async function loadJSON(path) {
  const res = await fetch(path + '?v=' + Date.now());
  if (!res.ok) throw new Error('Failed to load ' + path);
  return await res.json();
}

async function initSite() {
  const [navData, servicesData, footerData, bannerData] = await Promise.all([
    loadJSON('navbar.json'),
    loadJSON('services.json'),
    loadJSON('footer.json'),
    loadJSON('banner.json')
  ]);

  const navLinks = document.getElementById('navLinks');
  if (navData && navLinks) {
    navLinks.innerHTML = navData.navbar.map(link => `<a href='${link.href}' class='btn${link.cta ? ' cta' : ''}'>${link.text}</a>`).join('');
  }

  const banner = document.getElementById('banner');
  if (banner && bannerData) {
    const month = new Date().getMonth() + 1;
    const match = bannerData.banners.find(b => b.month == month);
    banner.textContent = match ? match.text : '🌿 Seasonal Yard Care';
  }

  const servicesGrid = document.getElementById('services-grid');
  if (servicesData && servicesGrid) {
    servicesGrid.innerHTML = servicesData.services.map(s => `<div class='service'><h3>${s.title}</h3><p>${s.desc}</p></div>`).join('');
  }

  const footer = document.querySelector('footer');
  if (footer && footerData) {
    footer.innerHTML = `<div>${footerData.footer.left}</div><div>${footerData.footer.right}</div>`;
  }
}

document.addEventListener('DOMContentLoaded', initSite);
