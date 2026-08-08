const cron = require('node-cron');
const { generateDailyPost } = require('./blogGenerator');

/**
 * In-process daily scheduler.
 *
 * This only fires while the server is awake. Hosts that idle a free instance
 * (Render, Fly, etc.) will skip firings, which is why /api/cron/generate-blog
 * also exists — point an external scheduler at it and the in-process cron
 * becomes a redundant backup rather than the only trigger. The one-post-per-day
 * check inside generateDailyPost() makes running both safe.
 */

const SCHEDULE = process.env.BLOG_AUTOGEN_CRON || '0 6 * * *'; // 06:00 daily
const TIMEZONE = process.env.BLOG_AUTOGEN_TZ || 'Asia/Kolkata';

function startScheduler() {
  if (process.env.BLOG_AUTOGEN_ENABLED === 'false') {
    console.log('[blog-autogen] disabled (BLOG_AUTOGEN_ENABLED=false).');
    return null;
  }
  if (!process.env.GROQ_API_KEY) {
    console.log('[blog-autogen] no GROQ_API_KEY set — scheduler not started.');
    return null;
  }
  if (!cron.validate(SCHEDULE)) {
    console.error(`[blog-autogen] invalid cron expression "${SCHEDULE}" — scheduler not started.`);
    return null;
  }

  const task = cron.schedule(
    SCHEDULE,
    async () => {
      try {
        const result = await generateDailyPost();
        if (result.status !== 'published') {
          console.log(`[blog-autogen] ${result.status}: ${result.reason || ''}`);
        }
      } catch (err) {
        // A scheduled job must never take the process down.
        console.error('[blog-autogen] unexpected scheduler error:', err);
      }
    },
    { timezone: TIMEZONE }
  );

  console.log(`[blog-autogen] scheduled "${SCHEDULE}" (${TIMEZONE}).`);
  return task;
}

module.exports = { startScheduler };
