export default async function handler(req, res) {
  const { code } = req.query;
  
  const response = await fetch('https://github.com/login/oauth/access_token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
    body: JSON.stringify({
      client_id: process.env.OAUTH_CLIENT_ID,
      client_secret: process.env.OAUTH_CLIENT_SECRET,
      code,
    }),
  });
  
  const data = await response.json();
  
  // Temporary: show the raw response so we can see what GitHub is returning
  if (!data.access_token) {
    res.setHeader('Content-Type', 'application/json');
    res.status(200).json(data);
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