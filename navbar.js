async function loadJSON(path) {
  try {
    const res = await fetch(`./${path}?v=${Date.now()}`);
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
  if (navbarData && document.querySelector("header")) {
    const header = document.querySelector("header");
    header.classList.add("sticky-header");

    const brand = document.createElement("div");
    brand.className = "brand";
    brand.innerHTML = `
      <div class="logo">${navbarData.navbar.brand.logo}</div>
      <div style="font-weight:700">${navbarData.navbar.brand.name}</div>
    `;

    const navLinks = document.createElement("div");
    navLinks.className = "nav-links";
    navLinks.innerHTML = navbarData.navbar.links
      .map(link => `
        <a href="${link.url}" class="btn ${link.class || ""}">
          ${link.label}
        </a>
      `)
      .join("");

    const menuToggle = document.createElement("button");
    menuToggle.className = "menu-toggle";
    menuToggle.innerHTML = "☰";
    menuToggle.addEventListener("click", () => {
      navLinks.classList.toggle("active");
      menuToggle.classList.toggle("open");
    });

    header.innerHTML = "";
    header.appendChild(brand);
    header.appendChild(menuToggle);
    header.appendChild(navLinks);
  }

  // 🌿 Services
  if (servicesData && document.getElementById("services-grid")) {
    const servicesGrid = document.getElementById("services-grid");
    servicesGrid.innerHTML = "";
    servicesData.services.forEach(service => {
      const el = document.createElement("div");
      el.className = "card service";
      el.innerHTML = `
        <h3>${service.title}</h3>
        <p>${service.desc}</p>
      `;
      servicesGrid.appendChild(el);
    });
  }

  // 🌷 Footer
  if (footerData && document.querySelector("footer")) {
    const footer = document.querySelector("footer");
    footer.innerHTML = `
      <div>${footerData.footer.left}</div>
      <div>${footerData.footer.right}</div>
    `;
  }
}

document.addEventListener("DOMContentLoaded", initSite);
