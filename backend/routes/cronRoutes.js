const express = require('express');
const crypto = require('crypto');
const { generateDailyPost } = require('../services/blogGenerator');

const router = express.Router();

/**
 * External trigger for the daily post.
 *
 * Exists so the generator still runs on hosts that sleep idle instances and
 * therefore never reach an in-process cron tick. Point any external scheduler
 * (Render Cron, GitHub Actions, cron-job.org) at:
 *
 *   POST /api/cron/generate-blog     header: x-cron-secret: <CRON_SECRET>
 *
 * Protected by a shared secret rather than the admin JWT, because a scheduler
 * cannot log in. Without CRON_SECRET set the route refuses every request — it
 * does not fall open.
 */

function isAuthorised(req) {
  const expected = process.env.CRON_SECRET;
  if (!expected) return false;

  const provided = req.get('x-cron-secret') || '';
  const a = Buffer.from(provided);
  const b = Buffer.from(expected);
  // timingSafeEqual throws on length mismatch, so compare lengths first.
  return a.length === b.length && crypto.timingSafeEqual(a, b);
}

router.post('/generate-blog', async (req, res) => {
  if (!isAuthorised(req)) {
    return res.status(401).json({ success: false, error: 'Unauthorized' });
  }

  try {
    const result = await generateDailyPost({ force: req.query.force === 'true' });
    const ok = result.status === 'published' || result.status === 'skipped';
    return res.status(ok ? 200 : 500).json({ success: ok, ...result });
  } catch (err) {
    console.error('[blog-autogen] trigger failed:', err);
    return res.status(500).json({ success: false, error: 'Generation failed' });
  }
});

module.exports = router;
