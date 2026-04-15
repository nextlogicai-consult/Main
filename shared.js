// Shared nav and footer injected into every page
// Usage: include this script, then call injectNav('pagename') and injectFooter()

function injectNav(activePage) {
  const leftPages = [
    { id: 'index',        label: 'Home',         href: 'index.html' },
    { id: 'how-it-works', label: 'How It Works', href: 'how-it-works.html' },
    { id: 'services',     label: 'Services',     href: 'services.html' },
  ];
  const rightPages = [
    { id: 'packages', label: 'Packages', href: 'packages.html' },
    { id: 'blog',     label: 'Blog',     href: 'blog.html' },
  ];

  const leftLinks = leftPages
    .map(p => `<li><a href="${p.href}"${activePage === p.id ? ' class="active"' : ''}>${p.label}</a></li>`)
    .join('');

  const rightLinks = rightPages
    .map(p => `<li><a href="${p.href}"${activePage === p.id ? ' class="active"' : ''}>${p.label}</a></li>`)
    .join('');

  document.body.insertAdjacentHTML('afterbegin', `
    <nav>
      <ul class="nav-links-left">
        ${leftLinks}
      </ul>
      <a href="index.html" class="nav-logo">
        <img src="logo.png" alt="NextLogicAI Consulting" class="nav-logo-img">
      </a>
      <ul class="nav-links-right">
        ${rightLinks}
        <li><a href="contact.html" class="nav-cta${activePage === 'contact' ? ' active' : ''}">Book a Discovery Call</a></li>
      </ul>
      <button class="nav-hamburger" id="hamburger" aria-label="Open menu">
        <span></span><span></span><span></span>
      </button>
    </nav>
    <div class="mobile-menu" id="mobileMenu">
      <a href="index.html" class="mobile-nav-link${activePage === 'index' ? ' active' : ''}">Home</a>
      <a href="how-it-works.html" class="mobile-nav-link${activePage === 'how-it-works' ? ' active' : ''}">How It Works</a>
      <a href="services.html" class="mobile-nav-link${activePage === 'services' ? ' active' : ''}">Services</a>
      <a href="packages.html" class="mobile-nav-link${activePage === 'packages' ? ' active' : ''}">Packages</a>
      <a href="blog.html" class="mobile-nav-link${activePage === 'blog' ? ' active' : ''}">Blog</a>
      <a href="contact.html" class="mobile-nav-link mobile-cta">Book a Discovery Call</a>
    </div>
  `);

  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('open');
    mobileMenu.classList.toggle('open');
    document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
  });
  document.querySelectorAll('.mobile-nav-link').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('open');
      mobileMenu.classList.remove('open');
      document.body.style.overflow = '';
    });
  });

  // Scroll reveal
  const reveals = document.querySelectorAll('.reveal');
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => entry.target.classList.add('visible'), i * 90);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08 });
  reveals.forEach(el => observer.observe(el));
}

function injectFooter() {
  document.body.insertAdjacentHTML('beforeend', `
    <footer>
      <div>
        <div class="footer-brand">NextLogic<span>AI</span> Consulting</div>
        <div class="footer-sub">AI Integration for Small &amp; Mid-Sized Businesses · © 2025</div>
      </div>
      <div class="footer-links">
        <a href="index.html">Home</a>
        <a href="how-it-works.html">How It Works</a>
        <a href="services.html">Services</a>
        <a href="packages.html">Packages</a>
        <a href="blog.html">Blog</a>
        <a href="contact.html">Contact</a>
      </div>
    </footer>
  `);
}