const functions = require('firebase-functions');
const admin = require('firebase-admin');

admin.initializeApp();

const GITHUB_CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const GITHUB_CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;

exports.exchangeGitHubCode = functions.https.onRequest(async (req, res) => {
  // Set CORS headers
  res.set('Access-Control-Allow-Origin', '*');
  res.set('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.set('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.status(204).send('');
    return;
  }

  console.log('exchangeGitHubCode called');

  if (!GITHUB_CLIENT_ID || !GITHUB_CLIENT_SECRET) {
    console.error('GitHub OAuth not configured');
    res.status(500).json({ error: 'GitHub OAuth not configured - missing CLIENT_ID or CLIENT_SECRET' });
    return;
  }

  const { code } = req.body;

  if (!code) {
    console.error('Missing authorization code in request');
    res.status(400).json({ error: 'Missing authorization code' });
    return;
  }

  try {
    console.log('Exchanging code for token...');
    // Exchange the code for an access token
    const tokenResponse = await fetch('https://github.com/login/oauth/access_token', {
      method: 'POST',
      headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        client_id: GITHUB_CLIENT_ID,
        client_secret: GITHUB_CLIENT_SECRET,
        code,
      }),
    });

    const tokenData = await tokenResponse.json();

    if (tokenData.error) {
      console.error('GitHub token exchange error:', tokenData.error, tokenData.error_description);
      res.status(400).json({ error: tokenData.error_description || tokenData.error || 'Failed to exchange code' });
      return;
    }

    if (!tokenData.access_token) {
      console.error('No access token in response:', tokenData);
      res.status(400).json({ error: 'No access token received from GitHub' });
      return;
    }

    console.log('Token exchange successful');
    res.json({ token: tokenData.access_token });
  } catch (error) {
    console.error('Error exchanging code:', error);
    res.status(500).json({ error: `Internal server error: ${error.message}` });
  }
});
