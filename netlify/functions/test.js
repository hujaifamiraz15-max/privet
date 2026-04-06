exports.handler = async (event, context) => {
  console.log('Test function called');
  console.log('Environment variables:', Object.keys(process.env));
  console.log('MONGODB_URI exists:', !!process.env.MONGODB_URI);
  
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      message: 'Test function working',
      envVars: Object.keys(process.env),
      hasMongoUri: !!process.env.MONGODB_URI,
      mongoUriPrefix: process.env.MONGODB_URI ? process.env.MONGODB_URI.substring(0, 20) + '...' : 'not found'
    })
  };
};
