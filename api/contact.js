import { Resend } from 'resend';

const resend = new Resend('re_Q3FAiv1b_9xwvSttg8q9EJXpCpEQUV2NG');

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { fname, lname, email, business, industry, pain, timeline } = req.body;

  if (!fname || !email || !industry) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    await resend.emails.send({
      from: 'onboarding@resend.dev',
      to: 'info@nextlogicai.com',
      subject: `New Discovery Call Request from ${fname}${lname ? ' ' + lname : ''}`,
      html: `
        <h2>New Discovery Call Request</h2>
        <table style="border-collapse: collapse; width: 100%; font-family: sans-serif; font-size: 15px;">
          <tr><td style="padding: 8px 12px; color: #666;">Name</td><td style="padding: 8px 12px;">${fname} ${lname || ''}</td></tr>
          <tr style="background: #f9f9f9;"><td style="padding: 8px 12px; color: #666;">Email</td><td style="padding: 8px 12px;"><a href="mailto:${email}">${email}</a></td></tr>
          <tr><td style="padding: 8px 12px; color: #666;">Business</td><td style="padding: 8px 12px;">${business || 'Not provided'}</td></tr>
          <tr style="background: #f9f9f9;"><td style="padding: 8px 12px; color: #666;">Industry</td><td style="padding: 8px 12px;">${industry}</td></tr>
          <tr><td style="padding: 8px 12px; color: #666;">Problem</td><td style="padding: 8px 12px;">${pain || 'Not provided'}</td></tr>
          <tr style="background: #f9f9f9;"><td style="padding: 8px 12px; color: #666;">Timeline</td><td style="padding: 8px 12px;">${timeline || 'Not provided'}</td></tr>
        </table>
      `,
    });

    return res.status(200).json({ success: true });

  } catch (err) {
    console.error('Resend error:', err);
    return res.status(500).json({ error: 'Failed to send email' });
  }
}
