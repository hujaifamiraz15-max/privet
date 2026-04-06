const mongoose = require("mongoose");

// Member Schema
const memberSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    grade: { type: String, required: true },
    improvement: { type: Number, required: true },
    decline: { type: Number, required: true },
    targetRole: { type: String, required: true },
    circleRole: { type: String, required: true },
    monova: { type: String, required: true },
    remarks: { type: String, required: true },
  },
  { timestamps: true },
);

const Member = mongoose.model("Member", memberSchema);

// MongoDB Connection
let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;

  try {
    // Quick connection test
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI not found in environment variables");
    }

    // Connect with timeout
    const connectionPromise = mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000, // 5 second timeout
      socketTimeoutMS: 45000, // 45 seconds
    });

    // Race between connection and timeout
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error("Connection timeout")), 10000);
    });

    await Promise.race([connectionPromise, timeoutPromise]);
    isConnected = true;
    console.log("MongoDB connected");
  } catch (error) {
    console.error("MongoDB connection error:", error);
    throw error;
  }
};

exports.handler = async (event, context) => {
  context.callbackWaitsForEmptyEventLoop = false;

  // CORS headers
  const headers = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Content-Type",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Content-Type": "application/json",
  };

  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers };
  }

  try {
    await connectDB();

    const { httpMethod, path, body, queryStringParameters } = event;
    const pathParts = path
      .replace("/.netlify/functions/api", "")
      .split("/")
      .filter(Boolean);

    console.log("Method:", httpMethod);
    console.log("Path:", path);
    console.log("Path parts:", pathParts);

    // GET all members with pagination
    if (
      httpMethod === "GET" &&
      pathParts[0] === "api" &&
      pathParts[1] === "members" &&
      !pathParts[2]
    ) {
      const page = parseInt(queryStringParameters?.page) || 1;
      const limit = 10;
      const skip = (page - 1) * limit;

      const members = await Member.find()
        .skip(skip)
        .limit(limit)
        .sort({ createdAt: -1 })
        .maxTimeMS(5000);
      const total = await Member.countDocuments().maxTimeMS(5000);

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          members,
          totalPages: Math.ceil(total / limit),
          currentPage: page,
          total,
        }),
      };
    }

    // POST new member
    if (
      httpMethod === "POST" &&
      pathParts[0] === "api" &&
      pathParts[1] === "members"
    ) {
      const memberData = JSON.parse(body);
      const member = new Member(memberData);
      const savedMember = await member.save();

      return {
        statusCode: 201,
        headers,
        body: JSON.stringify(savedMember),
      };
    }

    // PUT update member
    if (
      httpMethod === "PUT" &&
      pathParts[0] === "api" &&
      pathParts[1] === "members" &&
      pathParts[2]
    ) {
      const memberData = JSON.parse(body);
      const member = await Member.findByIdAndUpdate(pathParts[2], memberData, {
        new: true,
      });

      if (!member) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ message: "Member not found" }),
        };
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(member),
      };
    }

    // DELETE member
    if (
      httpMethod === "DELETE" &&
      pathParts[0] === "api" &&
      pathParts[1] === "members" &&
      pathParts[2]
    ) {
      const member = await Member.findByIdAndDelete(pathParts[2]);

      if (!member) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ message: "Member not found" }),
        };
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ message: "Member deleted successfully" }),
      };
    }

    // GET single member
    if (
      httpMethod === "GET" &&
      pathParts[0] === "api" &&
      pathParts[1] === "members" &&
      pathParts[2]
    ) {
      const member = await Member.findById(pathParts[2]);

      if (!member) {
        return {
          statusCode: 404,
          headers,
          body: JSON.stringify({ message: "Member not found" }),
        };
      }

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify(member),
      };
    }

    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({ message: "Route not found", pathParts }),
    };
  } catch (error) {
    console.error("Function error:", error);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({
        message: error.message,
        type: error.name,
      }),
    };
  } finally {
    // Always disconnect to prevent connection pooling issues
    if (mongoose.connection.readyState === 1) {
      await mongoose.disconnect();
      isConnected = false;
    }
  }
};
