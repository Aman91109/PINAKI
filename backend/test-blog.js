require('dotenv').config();
const connectDB = require('./config/db');
const { generateDailyPost } = require('./services/blogGenerator');

async function runTest() {
  console.log('Connecting to database...');
  await connectDB();

  console.log('Triggering daily post generation (forced)...');
  try {
    const result = await generateDailyPost({ force: true });
    console.log('Result:', JSON.stringify(result, null, 2));
  } catch (err) {
    console.error('Error:', err);
  } finally {
    process.exit(0);
  }
}

runTest();
