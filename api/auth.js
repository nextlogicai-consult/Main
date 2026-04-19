export default function handler(req, res) {
  const params = new URLSearchParams({
    client_id: process.env.OAUTH_CLIENT_ID,
    redirect_uri: `${process.env.REDIRECT_URL}/api/callback`,
    scope: 'repo,user',
    state: Math.random().toString(36).substring(2),
  });
  res.redirect(`https://github.com/login/oauth/authorize?${params}`);
}