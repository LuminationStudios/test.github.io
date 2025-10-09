async function loadJSON(path) {
  try {
    const res = await fetch(`./${path}?v=${Date.now()}`); // Cache-busting
    if (!res.ok) throw new Error(`Failed to load ${path}: ${res.status}`);
    return await res.json();
  } catch (err) {
    console.error(`Error loading ${path}:`, err);
    return null;
  }
}

async function initSite() {
  // Only load services and footer
  const [servicesData, footerData] = await Promise.all([
    loadJSON("services.json"),
    loadJSON("footer.json")
  ]);

  // 🌿 Services Section
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

  // 🌸 Footer
  if (footerData && document.querySelector("footer")) {
    const footer = document.querySelector("footer");
    footer.innerHTML = `
      <div>${footerData.footer.left || "© Artemis Lawn & Leaf"}</div>
      <div>${footerData.footer.right || "Seasonal yard care & leaf removal"}</div>
    `;
  }
}

document.addEventListener("DOMContentLoaded", initSite);
