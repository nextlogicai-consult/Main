const form = document.getElementById('contactForm');
const statusText = document.getElementById('formStatus');
const successBox = document.getElementById('formSuccess');

form.addEventListener('submit', async (e) => {
  e.preventDefault();

  statusText.textContent = "Sending...";
  
  const formData = {
    fname: form.fname.value.trim(),
    lname: form.lname.value.trim(),
    email: form.email.value.trim(),
    business: form.business.value.trim(),
    industry: form.industry.value,
    pain: form.pain.value.trim(),
    timeline: form.timeline.value
  };

  try {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });

    if (!res.ok) throw new Error();

    form.style.display = 'none';
    successBox.style.display = 'block';

  } catch (err) {
    statusText.textContent = "Something went wrong. Please try again.";
  }
});
