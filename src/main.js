import './style.css'
import { products } from './data.js'

// State
let currentCategory = 'Todos';

// DOM Elements
const app = document.querySelector('#app');
const header = document.querySelector('.navbar');
const mobileToggle = document.createElement('button');

// Setup Application
function init() {
  renderHeader();
  renderMain();
  renderFloaters();
  renderProducts();
  setupEventListeners();
}

function renderHeader() {
  const categories = ['Todos', ...new Set(products.map(p => p.category))];

  header.innerHTML = `
    <div class="logo">CATÁLOGO</div>
    <button class="mobile-toggle" aria-label="Menu">☰</button>
    <ul class="nav-links">
      ${categories.map(cat => `
        <li><button class="nav-btn ${cat === 'Todos' ? 'active' : ''}" data-category="${cat}">${cat}</button></li>
      `).join('')}
    </ul>
  `;
}

function renderMain() {
  app.innerHTML = `
    <div class="product-grid" id="grid">
      <!-- Products will be injected here -->
    </div>
  `;
}

function renderFloaters() {
  // WhatsApp Button
  const waBtn = document.createElement('a');
  waBtn.href = "https://wa.me/964004214"; // Replace with real number
  waBtn.className = "whatsapp-btn";
  waBtn.target = "_blank";
  waBtn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="white"><path d="M12.031 6.172c-3.181 0-5.767 2.586-5.768 5.766-.001 1.298.38 2.27 1.019 3.287l-.711 2.592 2.654-.696c1.029.66 2.228 1.093 3.522 1.093h.001c3.181 0 5.768-2.586 5.768-5.767 0-3.18-2.587-5.767-5.768-5.767zm8.267 5.768c0 4.558-3.709 8.268-8.268 8.268-1.574 0-3.033-.448-4.303-1.22l-4.729 1.24.872-4.04c-1.1-1.604-1.748-3.535-1.748-5.617 0-4.559 3.709-8.268 8.268-8.268 4.559 0 8.268 3.709 8.268 8.268zm-5.748 3.704c.15.074.881.428 1.027.502.149.074.249.112.285.187.037.074.037.408-.135.594-.173.186-.615.398-1.242.062-.626-.336-2.582-1.393-3.483-2.618-.899-1.226-1.572-2.316-1.572-3.171 0-.855.449-1.332.748-1.593.224-.187.486-.261.748-.261.262 0 .524.015.748.112.224.097.524.856.598 1.042.075.186.037.336-.037.484-.075.149-.232.261-.399.429-.168.169-.356.26-.149.615.205.354.912 1.487 1.956 2.417 1.045.929.954.766 1.346.591.391-.174.954-.05 1.103-.236z"/></svg>`;

  document.body.appendChild(waBtn);

  // Lightbox
  const lightbox = document.createElement('div');
  lightbox.className = 'lightbox';
  lightbox.id = 'lightbox';
  lightbox.innerHTML = `
    <button class="close-lightbox" aria-label="Close">&times;</button>
    <img src="" alt="" class="lightbox-img">
    <div class="lightbox-info">
      <h3 class="lightbox-title"></h3>
    </div>
  `;
  document.body.appendChild(lightbox);
}

function renderProducts() {
  const grid = document.getElementById('grid');
  
  // 1. Filtrar los productos
  const filtered = currentCategory === 'Todos'
    ? products
    : products.filter(p => p.category === currentCategory);

  // 2. Agrupar en DOS niveles: Primero por Categoría, luego por Subcategoría
  const groupedByCategory = {};
  
  filtered.forEach(product => {
    const cat = product.category;
    const subcat = product.subcategory || 'Otros';

    if (!groupedByCategory[cat]) {
      groupedByCategory[cat] = {};
    }
    if (!groupedByCategory[cat][subcat]) {
      groupedByCategory[cat][subcat] = [];
    }
    groupedByCategory[cat][subcat].push(product);
  });

  // 3. Generar el HTML
  let html = '';

  for (const [categoryName, subcategories] of Object.entries(groupedByCategory)) {
    
    // Título Principal (Ej: LICORES). Solo lo mostramos en la pestaña "Todos" para no ser redundantes al entrar a una pestaña específica.
    if (currentCategory === 'Todos') {
      html += `
        <div class="category-header" style="width: 100%; grid-column: 1 / -1; margin-top: 3rem; margin-bottom: 0.5rem; border-bottom: 3px solid #333;">
          <h1 style="font-size: 2rem; color: #111; text-transform: uppercase; margin: 0; padding-bottom: 0.5rem;">
            ${categoryName}
          </h1>
        </div>
      `;
    }

    for (const [subcategoryName, items] of Object.entries(subcategories)) {
      // Subtítulo (Ej: RON, VINO)
      html += `
        <div class="subcategory-header" style="width: 100%; grid-column: 1 / -1; margin-top: 1.5rem; margin-bottom: 1rem; border-bottom: 1px solid #ccc;">
          <h2 style="font-size: 1.3rem; color: #555; text-transform: uppercase; margin: 0; padding-bottom: 0.5rem;">
            ${subcategoryName}
          </h2>
        </div>
      `;

      // Productos de ese subtipo
      html += items.map(product => `
        <div class="product-card" data-id="${product.id}">
          <div class="image-container">
            <img src="${product.image}" alt="${product.name}" class="product-image" loading="lazy">
          </div>
          <div class="product-info">
            <h3 class="product-name">${product.name}</h3>
            <p class="product-category">${product.subcategory || product.category}</p>
          </div>
        </div>
      `).join('');
    }
  }

  grid.innerHTML = html;
}

function setupEventListeners() {
  // Navigation Filtering
  document.querySelector('.nav-links').addEventListener('click', (e) => {
    if (e.target.classList.contains('nav-btn')) {
      // Update Active State
      document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');

      // Filter
      currentCategory = e.target.dataset.category;
      renderProducts();

      // Close mobile menu if open
      document.querySelector('.nav-links').classList.remove('open');
    }
  });

  // Mobile Menu
  document.querySelector('.mobile-toggle').addEventListener('click', () => {
    document.querySelector('.nav-links').classList.toggle('open');
  });

  // Lightbox
  document.getElementById('grid').addEventListener('click', (e) => {
    const card = e.target.closest('.product-card');
    if (card) {
      const id = parseInt(card.dataset.id);
      const product = products.find(p => p.id === id);
      openLightbox(product);
    }
  });

  document.querySelector('.close-lightbox').addEventListener('click', closeLightbox);
  document.getElementById('lightbox').addEventListener('click', (e) => {
    if (e.target === e.currentTarget) closeLightbox();
  });
}

function openLightbox(product) {
  const lb = document.getElementById('lightbox');
  lb.querySelector('.lightbox-img').src = product.image;
  lb.querySelector('.lightbox-title').textContent = product.name;
  lb.classList.add('active');
  document.body.style.overflow = 'hidden'; // Prevent scrolling
}

function closeLightbox() {
  const lb = document.getElementById('lightbox');
  lb.classList.remove('active');
  document.body.style.overflow = '';
}

// Start
init();
