const {onRequest} = require("firebase-functions/https");
const {defineSecret} = require("firebase-functions/params");
const logger = require("firebase-functions/logger");

const GITHUB_CLIENT_ID = defineSecret('GITHUB_CLIENT_ID');
const GITHUB_CLIENT_SECRET = defineSecret('GITHUB_CLIENT_SECRET');

exports.exchangeGitHubCode = onRequest(
  { secrets: [GITHUB_CLIENT_ID, GITHUB_CLIENT_SECRET] },
  async (req, res) => {
    // Set CORS headers
    res.set('Access-Control-Allow-Origin', '*');
    res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.set('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight
    if (req.method === 'OPTIONS') {
      res.status(204).send('');
      return;
    }

    logger.info('exchangeGitHubCode called');

    const clientId = GITHUB_CLIENT_ID.value();
    const clientSecret = GITHUB_CLIENT_SECRET.value();

    if (!clientId || !clientSecret) {
      logger.error('GitHub OAuth not configured');
      res.status(500).json({ error: 'GitHub OAuth not configured - missing CLIENT_ID or CLIENT_SECRET' });
      return;
    }

    const { code } = req.body;

    if (!code) {
      logger.error('Missing authorization code in request');
      res.status(400).json({ error: 'Missing authorization code' });
      return;
    }

    try {
      logger.info('Exchanging code for token...');
      // Exchange the code for an access token
      const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
        method: 'POST',
        headers: {
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          client_id: clientId,
          client_secret: clientSecret,
          code,
        }),
      });

      const tokenData = await tokenResponse.json();

      if (tokenData.error) {
        logger.error('GitHub token exchange error:', tokenData.error, tokenData.error_description);
        res.status(400).json({ error: tokenData.error_description || tokenData.error || 'Failed to exchange code' });
        return;
      }

      if (!tokenData.access_token) {
        logger.error('No access token in response:', tokenData);
        res.status(400).json({ error: 'No access token received from GitHub' });
        return;
      }

      logger.info('Token exchange successful');
      res.json({ token: tokenData.access_token });
    } catch (error) {
      logger.error('Error exchanging code:', error);
      res.status(500).json({ error: `Internal server error: ${error.message}` });
    }
  }
);
