async function loadGallery() {
  try {
    const res = await fetch('gallery.json');
    if (!res.ok) throw new Error('Failed to load gallery.json');
    const data = await res.json();
    const galleryData = data.gallery;

    const gallerySection = document.createElement('section');
    gallerySection.id = 'gallery';
    gallerySection.innerHTML = '<h2>Gallery</h2><div class="gallery-grid" id="gallery-grid"></div>';
    document.body.appendChild(gallerySection);

    const grid = document.getElementById('gallery-grid');

    galleryData.forEach((img, i) => {
      const el = document.createElement('div');
      el.className = 'gallery-item';
      el.innerHTML = `<img src="${img.src}" alt="${img.alt}" loading="lazy">`;
      grid.appendChild(el);
    });

    // Auto-rotate fade effect
    let index = 0;
    setInterval(() => {
      const items = document.querySelectorAll('.gallery-item');
      items.forEach((item, idx) => {
        item.style.opacity = idx === index ? '1' : '0.3';
      });
      index = (index + 1) % items.length;
    }, 4000);
  } catch (err) {
    console.error('Error loading gallery:', err);
  }
}
document.addEventListener('DOMContentLoaded', loadGallery);
