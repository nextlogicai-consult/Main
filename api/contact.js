export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const {
    fname,
    lname,
    email,
    business,
    industry,
    pain,
    timeline
  } = req.body;

  // Basic validation
  if (!fname || !email) {
    return res.status(400).json({ message: 'Missing required fields' });
  }

  console.log('New lead:', {
    fname,
    lname,
    email,
    business,
    industry,
    pain,
    timeline
  });

  // 👉 TODO: send email or store in DB

  return res.status(200).json({ success: true });
}
