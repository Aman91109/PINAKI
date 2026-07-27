/**
 * Manual trigger:  npm run generate-blog          (respects one-per-day)
 *                  npm run generate-blog -- --force
 *
 * Useful for testing the generator without waiting for the cron tick.
 */
require('dotenv').config();

const connectDB = require('../config/db');
const { generateDailyPost } = require('../services/blogGenerator');

(async () => {
  await connectDB();

  const force = process.argv.includes('--force');
  const result = await generateDailyPost({ force });

  console.log('\nResult:', JSON.stringify(result, null, 2));

  // Non-zero exit on anything that isn't a clean outcome, so CI or an external
  // scheduler can alert on it.
  const ok = result.status === 'published' || result.status === 'skipped';
  process.exit(ok ? 0 : 1);
})().catch((err) => {
  console.error('Generation script failed:', err);
  process.exit(1);
});
