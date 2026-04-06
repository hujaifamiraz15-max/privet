const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://tasnimmuhammad51_db_user:Cee18Wwe7lCyLkcx@ics-arabic-22-23.jg2bicf.mongodb.net/?appName=ICS-ARABIC-22-23', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Member Schema
const memberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  grade: { type: String, required: true },
  improvement: { type: Number, required: true },
  decline: { type: Number, required: true },
  targetRole: { type: String, required: true },
  circleRole: { type: String, required: true },
  monova: { type: String, required: true },
  remarks: { type: String, required: true }
}, { timestamps: true });

const Member = mongoose.model('Member', memberSchema);

// API Routes

// GET all members with pagination
app.get('/api/members', async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 10;
    const skip = (page - 1) * limit;
    
    const members = await Member.find().skip(skip).limit(limit).sort({ createdAt: -1 });
    const total = await Member.countDocuments();
    
    res.json({
      members,
      totalPages: Math.ceil(total / limit),
      currentPage: page,
      total
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// POST new member
app.post('/api/members', async (req, res) => {
  try {
    const member = new Member(req.body);
    const savedMember = await member.save();
    res.status(201).json(savedMember);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// PUT update member
app.put('/api/members/:id', async (req, res) => {
  try {
    const member = await Member.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }
    res.json(member);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE member
app.delete('/api/members/:id', async (req, res) => {
  try {
    const member = await Member.findByIdAndDelete(req.params.id);
    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }
    res.json({ message: 'Member deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET single member
app.get('/api/members/:id', async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);
    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }
    res.json(member);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
