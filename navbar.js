async function loadJSON(path) {
  try {
    const res = await fetch(`./${path}?v=${Date.now()}`); // cache-busting
    if (!res.ok) throw new Error(`Failed to load ${path}: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error(`Error loading ${path}:`, err);
    return null;
  }
}

async function initSite() {
  const [navbarData, servicesData, footerData] = await Promise.all([
    loadJSON("navbar.json"),
    loadJSON("services.json"),
    loadJSON("footer.json")
  ]);

  // 🌸 Navbar
  if (navbarData && navbarData.navbar && document.querySelector("nav")) {
    const nav = document.querySelector("nav");
    nav.classList.add("nav-links");
    nav.innerHTML = navbarData.navbar.links.map(link => {
      const cls = link.class ? `class="${link.class}"` : "";
      return `<a href="${link.href}" ${cls}>${link.text}</a>`;
    }).join("");
  }

  // 🌿 Services Section
  if (servicesData && servicesData.services && document.getElementById("services-grid")) {
    const servicesGrid = document.getElementById("services-grid");
    servicesGrid.innerHTML = "";
    servicesData.services.forEach(service => {
      const el = document.createElement("div");
      el.className = "service";
      el.innerHTML = `
        <h3>${service.title}</h3>
        <p>${service.desc}</p>
      `;
      servicesGrid.appendChild(el);
    });
  }

  // 🌼 Footer
  if (footerData && footerData.footer && document.querySelector("footer")) {
    const footer = document.querySelector("footer");
    footer.innerHTML = `
      <div>${footerData.footer.left}</div>
      <div>${footerData.footer.right}</div>
    `;
  }

  // 🍔 Mobile Menu Toggle
  const header = document.querySelector("header");
  header.classList.add("sticky-header");

  const toggle = document.createElement("div");
  toggle.classList.add("menu-toggle");
  header.appendChild(toggle);

  toggle.addEventListener("click", () => {
    toggle.classList.toggle("open");
    nav.classList.toggle("active");
  });
}

document.addEventListener("DOMContentLoaded", initSite);
