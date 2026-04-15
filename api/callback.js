export default async function handler(req, res) {
  const { code, error } = req.query;

  if (error) {
    res.status(400).send(`GitHub error: ${error}`);
    return;
  }

  if (!code) {
    res.status(400).send('No code received');
    return;
  }

  const response = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      client_id: process.env.OAUTH_CLIENT_ID,
      client_secret: process.env.OAUTH_CLIENT_SECRET,
      code,
      redirect_uri: 'https://www.nextlogic-ai.com/api/callback',
    }),
  });

  const data = await response.json();
  console.log('GitHub response:', JSON.stringify(data));

  if (!data.access_token) {
    res.send(`<pre>GitHub said: ${JSON.stringify(data, null, 2)}</pre>`);
    return;
  }

  res.setHeader('Content-Type', 'text/html');
  res.send(`<script>
    if (window.opener) {
      window.opener.postMessage(
        'authorization:github:success:{"token":"${data.access_token}","provider":"github"}',
        '*'
      );
    }
    window.close();
  </script>`);
}