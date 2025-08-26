/*
  RentEase Frontend Script (Vanilla JS)
  - Landing overlay interactions
  - Theme toggle (light/dark) with persistence
  - i18n (English/Arabic) with RTL support and persistence
  - Filters UI + live property rendering
  - Firebase integration (Auth/Firestore/Storage) scaffold
*/

// ------------------------------
// Security Layer - Main Site Protection
// ------------------------------

// Security: Prevent right-click and inspect
document.addEventListener('contextmenu', (e) => e.preventDefault());
document.addEventListener('keydown', (e) => {
  // Disable F12, Ctrl+Shift+I, Ctrl+Shift+J, Ctrl+U
  if (e.key === 'F12' || 
      (e.ctrlKey && e.shiftKey && (e.key === 'I' || e.key === 'J')) ||
      (e.ctrlKey && e.key === 'u')) {
    e.preventDefault();
    return false;
  }
});

// Security: Prevent iframe embedding
if (window.self !== window.top) {
  window.top.location = window.self.location;
}

// Security: Content protection
document.addEventListener('DOMContentLoaded', () => {
  // Disable text selection
  document.body.style.userSelect = 'none';
  document.body.style.webkitUserSelect = 'none';
  document.body.style.mozUserSelect = 'none';
  document.body.style.msUserSelect = 'none';
  
  // Add security headers
  const meta = document.createElement('meta');
  meta.httpEquiv = 'Content-Security-Policy';
  meta.content = "default-src 'self'; script-src 'self' 'unsafe-inline' https://www.gstatic.com; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com; img-src 'self' data: https:; connect-src 'self' https://firestore.googleapis.com https://identitytoolkit.googleapis.com;";
  document.head.appendChild(meta);
});

// Security: Rate limiting for search
let searchCount = 0;
let lastSearchTime = 0;
const MAX_SEARCHES_PER_MINUTE = 30;

function checkSearchRateLimit() {
  const now = Date.now();
  if (now - lastSearchTime > 60000) {
    searchCount = 0;
    lastSearchTime = now;
  }
  
  if (searchCount >= MAX_SEARCHES_PER_MINUTE) {
    alert('Too many searches. Please wait a moment before searching again.');
    return false;
  }
  
  searchCount++;
  return true;
}

// ------------------------------
// Minimal Router (hash-based)
// ------------------------------
const scrollToHash = () => {
  const id = location.hash.slice(1);
  if (!id) return;
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
};
window.addEventListener('hashchange', scrollToHash);

// ------------------------------
// Theme Toggle with persistence
// ------------------------------
const THEME_KEY = 'rentease:theme';
const savedTheme = localStorage.getItem(THEME_KEY) || 'dark';
document.documentElement.setAttribute('data-theme', savedTheme);
const themeIcon = document.getElementById('themeIcon');
const themeToggle = document.getElementById('themeToggle');
const setThemeIcon = (theme) => themeIcon && (themeIcon.textContent = theme === 'light' ? '🌞' : '🌙');
setThemeIcon(savedTheme);
themeToggle?.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
  const next = current === 'light' ? 'dark' : 'light';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem(THEME_KEY, next);
  setThemeIcon(next);
});

// ------------------------------
// Landing Overlay
// ------------------------------
function initLandingOverlay() {
  const landingOverlay = document.getElementById('landing-overlay');
  const enterBtn = document.getElementById('enterBtn');
  
  if (enterBtn && landingOverlay) {
    enterBtn.addEventListener('click', () => {
      console.log('OK button clicked!'); // Debug log
      landingOverlay.classList.remove('visible');
      landingOverlay.setAttribute('aria-hidden', 'true');
    });
  }
}

// ------------------------------
// i18n English/Arabic with RTL
// ------------------------------
const LANG_KEY = 'rentease:lang';
const translations = {
  en: {
    'landing.title': 'Welcome to RentEase',
    'landing.subtitle': 'Find your next home with beautiful listings and powerful filters.',
    'landing.step1': 'Use filters to narrow down properties.',
    'landing.step2': 'Toggle language and theme from the header.',
    'landing.step3': 'Click Rent Now to submit the Google Form.',
    'landing.ok': 'OK',

    'nav.home': 'Home',
    'nav.properties': 'Properties',
    'nav.about': 'About',
    'nav.contact': 'Contact',
    'nav.admin': 'Admin',

    'hero.headline': 'Beautiful homes, smarter renting.',
    'hero.tagline': 'Browse curated apartments, rooms, and studios near your campus.',
    'hero.cta': 'Explore Properties',

    'filters.title': 'Filters',
    'filters.toggle': 'Show/Hide',
    'filters.gender': 'Gender',
    'filters.any': 'Any',
    'filters.male': 'Male',
    'filters.female': 'Female',
    'filters.type': 'Type',
    'filters.apartment': 'Apartment',
    'filters.room': 'Room',
    'filters.studio': 'Studio',
    'filters.price': 'Max Price',
    'filters.university': 'University',
    'filters.faculty': 'Faculty',
    'filters.area': 'Area',
    'filters.location': 'Location',
    'filters.city': 'City',
    'filters.search': 'Search',
    'filters.apply': 'Apply',
    'filters.reset': 'Reset',

    'properties.title': 'Available Properties',
    'properties.subtitle': 'Real-time listings from our database.',
    'properties.empty': 'No properties match your filters.',
    'properties.rent': 'Rent Now',

    'about.title': 'About Us',
    'about.body': 'We help students and professionals find high-quality rentals with transparent details and responsive support.',

    'contact.title': 'Contact',
    'contact.body': 'Questions? Reach out via email or follow us on social media.',

    'footer.rights': 'All rights reserved.'
  },
  ar: {
    'landing.title': 'مرحبًا بك في RentEase',
    'landing.subtitle': 'اعثر على منزلك التالي مع قوائم جميلة وفلاتر قوية.',
    'landing.step1': 'استخدم الفلاتر لتحديد العقارات.',
    'landing.step2': 'بدّل اللغة والمظهر من الشريط العلوي.',
    'landing.step3': 'اضغط "استأجر الآن" لإرسال نموذج Google.',
    'landing.ok': 'موافق',

    'nav.home': 'الرئيسية',
    'nav.properties': 'العقارات',
    'nav.about': 'من نحن',
    'nav.contact': 'تواصل',
    'nav.admin': 'لوحة التحكم',

    'hero.headline': 'منازل جميلة، واستئجار أذكى.',
    'hero.tagline': 'تصفح شقق وغرف واستوديوهات منتقاة قرب جامعتك.',
    'hero.cta': 'استكشف العقارات',

    'filters.title': 'الفلاتر',
    'filters.toggle': 'إظهار/إخفاء',
    'filters.gender': 'النوع',
    'filters.any': 'أي',
    'filters.male': 'ذكر',
    'filters.female': 'أنثى',
    'filters.type': 'النوع',
    'filters.apartment': 'شقة',
    'filters.room': 'غرفة',
    'filters.studio': 'استوديو',
    'filters.price': 'أقصى سعر',
    'filters.university': 'الجامعة',
    'filters.faculty': 'الكلية',
    'filters.area': 'الحي',
    'filters.location': 'العنوان',
    'filters.city': 'المدينة',
    'filters.search': 'بحث',
    'filters.apply': 'تطبيق',
    'filters.reset': 'إعادة تعيين',

    'properties.title': 'العقارات المتاحة',
    'properties.subtitle': 'قوائم مباشرة من قاعدة البيانات.',
    'properties.empty': 'لا توجد عقارات مطابقة للفلاتر.',
    'properties.rent': 'استأجر الآن',

    'about.title': 'من نحن',
    'about.body': 'نساعد الطلاب والمهنيين في العثور على إيجارات عالية الجودة وشفافة.',

    'contact.title': 'تواصل',
    'contact.body': 'أسئلة؟ تواصل عبر البريد أو تابعنا على الشبكات الاجتماعية.',

    'footer.rights': 'جميع الحقوق محفوظة.'
  }
};

const langSelect = document.getElementById('langSelect');
const savedLang = localStorage.getItem(LANG_KEY) || 'en';
langSelect && (langSelect.value = savedLang);
const applyLanguage = (lang) => {
  const dict = translations[lang] || translations.en;
  document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
  document.querySelectorAll('[data-i18n]')?.forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (key && dict[key]) el.textContent = dict[key];
  });
};
applyLanguage(savedLang);
langSelect?.addEventListener('change', (e) => {
  const lang = e.target.value;
  localStorage.setItem(LANG_KEY, lang);
  applyLanguage(lang);
});

// ------------------------------
// Filters: local state + rendering
// ------------------------------
const priceRange = document.getElementById('filterPrice');
const priceOutput = document.getElementById('priceOutput');
priceRange?.addEventListener('input', () => priceOutput && (priceOutput.textContent = priceRange.value));
priceOutput && (priceOutput.textContent = priceRange?.value || '');

const filtersToggle = document.getElementById('filtersToggle');
const filtersForm = document.getElementById('filtersForm');
let filtersOpen = true;
filtersToggle?.addEventListener('click', () => {
  filtersOpen = !filtersOpen;
  filtersForm.style.display = filtersOpen ? 'grid' : 'none';
});

// Data model for properties; in production we fetch from Firestore
let allProperties = [];

// Render utility to create a card from template
const grid = document.getElementById('propertiesGrid');
const emptyState = document.getElementById('emptyState');
const cardTpl = document.getElementById('propertyCardTpl');

function renderProperties(list) {
  if (!grid || !cardTpl) return;
  grid.innerHTML = '';
  if (!list || list.length === 0) {
    emptyState?.classList.remove('hidden');
    return;
  }
  emptyState?.classList.add('hidden');
  const formUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSeTyPgOb5xf4XVivwCpgfFzZVz6id6iTywlqH9Ekkm1WOVOfw/viewform?usp=dialog'; // Your Google Form link
  list.forEach(item => {
    const node = cardTpl.content.cloneNode(true);
    const card = node.querySelector('.card');
    const img = node.querySelector('.cover');
    const status = node.querySelector('.status');
    const title = node.querySelector('.title');
    const desc = node.querySelector('.desc');
    const price = node.querySelector('.price');
    const type = node.querySelector('.type');
    const gender = node.querySelector('.gender');
    const location = node.querySelector('.location');
    const students = node.querySelector('.students');
    const availability = node.querySelector('.availability');
    const rentBtn = node.querySelector('.rent-btn');

    // Media
    img.src = (item.images && item.images[0]) || 'https://picsum.photos/seed/home/800/600';
    // Cards show only the first image; video is shown in details view only

    // Primary fields
    title.textContent = item.title;
    desc.textContent = item.description;
    price.textContent = `${item.price.toLocaleString()} EGP`;
    type.textContent = item.type;
    gender.textContent = item.gender;
    location.textContent = `${item.area || ''} • ${item.location || ''} • ${item.city || ''}`;
    students.textContent = item.university ? `Students: ${item.university}${item.faculty ? ` • ${item.faculty}` : ''}` : '';
    status.textContent = item.availability ? 'Available' : 'Rented';
    availability.innerHTML = item.availability
      ? `<span class="ok">Available${typeof item.roomsLeft === 'number' ? ` • Rooms left: ${item.roomsLeft}` : ''}</span>`
      : `<span class="no">Rented</span>`;

    rentBtn.addEventListener('click', () => window.open(formUrl, '_blank'));
    // Open details on card click (except clicking Rent Now button)
    card.style.cursor = 'pointer';
    card.addEventListener('click', (e) => {
      if (e.target && e.target.closest && e.target.closest('.rent-btn')) return;
      openDetails(item);
    });
    grid.appendChild(node);
  });
}

// Apply filters with security
function applyFilters() {
  // Security: Rate limiting
  if (!checkSearchRateLimit()) return;
  
  const gender = document.getElementById('filterGender').value;
  const type = document.getElementById('filterType').value;
  const maxPrice = Number(document.getElementById('filterPrice').value || 0);
  const university = document.getElementById('filterUniversity').value;
  const faculty = document.getElementById('filterFaculty').value;
  const area = document.getElementById('filterArea').value;
  const city = document.getElementById('filterCity').value;
  const search = document.getElementById('searchText').value.trim().toLowerCase();

  // Security: Input validation
  if (search && (search.length < 2 || search.length > 100)) {
    alert('Search term must be between 2 and 100 characters');
    return;
  }

  const filtered = allProperties.filter(p => {
    if (gender && p.gender !== gender) return false;
    if (type && p.type !== type) return false;
    if (maxPrice && Number(p.price) > maxPrice) return false;
    if (university && p.university !== university) return false;
    if (faculty && p.faculty !== faculty) return false;
    if (area && p.area !== area) return false;
    if (city && p.city !== city) return false;
    if (search) {
      const blob = `${p.title} ${p.description}`.toLowerCase();
      if (!blob.includes(search)) return false;
    }
    return true;
  });
  renderProperties(filtered);
}

document.getElementById('applyFilters')?.addEventListener('click', applyFilters);
document.getElementById('resetFilters')?.addEventListener('click', () => {
  document.getElementById('filtersForm').reset();
  priceOutput.textContent = priceRange.value;
  renderProperties(allProperties);
});

// ------------------------------
// Firebase Integration (Modular SDK)
// - Replace the config object with your Firebase project values
// ------------------------------
// Note: For security, restrict API keys in Firebase console. Keys are public but rules protect data.
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js';
import { getFirestore, collection, getDocs, query } from 'https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js';

// Optional imports when you implement admin auth and storage in admin.html/admin.js
// import { getAuth } from 'https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js';
// import { getStorage } from 'https://www.gstatic.com/firebasejs/10.12.4/firebase-storage.js';

// Your Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDwdQ0ZAmifGSGnN-Vn3u8raYtpn5YPRhM",
  authDomain: "real-state-f8cc3.firebaseapp.com",
  projectId: "real-state-f8cc3",
  storageBucket: "real-state-f8cc3.firebasestorage.app",
  messagingSenderId: "3852629844",
  appId: "1:3852629844:web:2a3a7cbe726bad814dbac1",
  measurementId: "G-1G5YP5M0K6"
};

// Init Firebase app & Firestore
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Firestore: properties collection expected schema
// - title (string)
// - description (string)
// - type (string: apartment/room/studio)
// - price (number)
// - gender (string: male/female)
// - university (string)
// - area (string)
// - location (string)
// - city (string)
// - images (array of URLs)
// - video (URL)
// - availability (boolean)
// - roomsLeft (number)

async function loadProperties() {
  try {
    const q = query(collection(db, 'properties'));
    const snapshot = await getDocs(q);
    const rows = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    allProperties = rows;
    renderProperties(rows);
    populateFilterDropdowns(rows);
  } catch (err) {
    console.error('Failed to load properties from Firestore.', err);
    // Fallback demo data to visualize the UI if Firestore isn't configured yet
    allProperties = [
      {
        title: 'Modern Apartment near Campus',
        description: '2 bedrooms, furnished, 5 min walk to metro.',
        type: 'apartment',
        price: 8000,
        gender: 'male',
        university: 'Cairo University',
        faculty: 'Engineering',
        area: 'الحى الاول',
        location: 'عمارة 12، الدور الثاني، شقة 5',
        city: '6 أكتوبر',
        images: [],
        video: '',
        availability: true,
        roomsLeft: 1
      },
      {
        title: 'Cozy Room in Shared Flat',
        description: 'Quiet area, ideal for students. Bills included.',
        type: 'room',
        price: 3000,
        gender: 'female',
        university: 'October University',
        faculty: 'Business',
        area: 'الحى الثاني',
        location: 'عمارة 26، الدور الاول، شقة 23',
        city: '6 أكتوبر',
        images: [],
        video: '',
        availability: true,
        roomsLeft: 2
      }
    ];
    renderProperties(allProperties);
    populateFilterDropdowns(allProperties);
  }
}

// Populate filter dropdowns with unique values from properties
function populateFilterDropdowns(properties) {
  // Get unique values
  const universities = [...new Set(properties.map(p => p.university).filter(Boolean))];
  const faculties = [...new Set(properties.map(p => p.faculty).filter(Boolean))];
  const areas = [...new Set(properties.map(p => p.area).filter(Boolean))];
  const cities = [...new Set(properties.map(p => p.city).filter(Boolean))];

  // Populate University dropdown
  const universitySelect = document.getElementById('filterUniversity');
  if (universitySelect) {
    universitySelect.innerHTML = '<option value="" data-i18n="filters.any">Any</option>';
    universities.forEach(uni => {
      const option = document.createElement('option');
      option.value = uni;
      option.textContent = uni;
      universitySelect.appendChild(option);
    });
  }

  // Populate Faculty dropdown
  const facultySelect = document.getElementById('filterFaculty');
  if (facultySelect) {
    facultySelect.innerHTML = '<option value="" data-i18n="filters.any">Any</option>';
    faculties.forEach(faculty => {
      const option = document.createElement('option');
      option.value = faculty;
      option.textContent = faculty;
      facultySelect.appendChild(option);
    });
  }

  // Populate Area dropdown
  const areaSelect = document.getElementById('filterArea');
  if (areaSelect) {
    areaSelect.innerHTML = '<option value="" data-i18n="filters.any">Any</option>';
    areas.forEach(area => {
      const option = document.createElement('option');
      option.value = area;
      option.textContent = area;
      areaSelect.appendChild(option);
    });
  }

  // Populate City dropdown
  const citySelect = document.getElementById('filterCity');
  if (citySelect) {
    citySelect.innerHTML = '<option value="" data-i18n="filters.any">Any</option>';
    cities.forEach(city => {
      const option = document.createElement('option');
      option.value = city;
      option.textContent = city;
      citySelect.appendChild(option);
    });
  }
}

// Init
document.getElementById('year').textContent = new Date().getFullYear();
scrollToHash();
initLandingOverlay(); // Initialize landing overlay
loadProperties();

// ------------------------------
// Property Details Overlay (User)
// ------------------------------
const detailsOverlay = document.getElementById('detailsOverlay');
const detailsContent = document.getElementById('detailsContent');
const closeDetails = document.getElementById('closeDetails');

function openDetails(data) {
  if (!detailsOverlay || !detailsContent) return;
  detailsContent.innerHTML = renderDetailsHtml(data);
  const titleEl = document.getElementById('detailsTitle');
  if (titleEl) titleEl.textContent = data.title || '';
  detailsOverlay.classList.add('visible');

  // Wire up gallery interactions (thumbnails + zoom)
  try {
    const images = Array.isArray(data.images) ? data.images.filter(Boolean) : [];
    const mainImg = document.getElementById('detailsMainImage');
    const thumbs = document.querySelectorAll('.thumbs img[data-index]');
    let zoomScale = 1;

    const applyZoom = () => {
      if (!mainImg) return;
      const clamped = Math.min(2, Math.max(1, zoomScale));
      mainImg.style.transform = `scale(${clamped})`;
    };

    thumbs.forEach((t) => {
      t.addEventListener('click', () => {
        const idx = Number(t.getAttribute('data-index')) || 0;
        if (images[idx] && mainImg) {
          mainImg.src = images[idx];
          document.querySelectorAll('.thumbs img').forEach(n => n.classList.remove('active'));
          t.classList.add('active');
          zoomScale = 1;
          applyZoom();
        }
      });
    });

    document.getElementById('zoomIn')?.addEventListener('click', () => { zoomScale += 0.1; applyZoom(); });
    document.getElementById('zoomOut')?.addEventListener('click', () => { zoomScale -= 0.1; applyZoom(); });
    document.getElementById('zoomReset')?.addEventListener('click', () => { zoomScale = 1; applyZoom(); });
    
    // Full image functionality
    document.getElementById('fullImageBtn')?.addEventListener('click', () => {
      openFullImage(mainImg.src);
    });
  } catch (e) {
    console.warn('Gallery wiring failed', e);
  }
}
function closeDetailsOverlay() {
  detailsOverlay?.classList.remove('visible');
}
closeDetails?.addEventListener('click', closeDetailsOverlay);
detailsOverlay?.addEventListener('click', (e) => {
  if (e.target === detailsOverlay) closeDetailsOverlay();
});

function renderDetailsHtml(data) {
  const images = Array.isArray(data.images) ? data.images : [];
  const mainImageUrl = images[0] || 'https://picsum.photos/seed/home/800/600';
  const thumbs = images.map((url, idx) => `<img src="${url}" alt="thumb" data-index="${idx}" class="${idx===0?'active':''}"/>`).join('');
  const imageGallery = images.length ? `
    <div class="details-gallery">
      <div class="details-main">
        <img id="detailsMainImage" src="${mainImageUrl}" alt="image" />
        <div class="image-controls">
          <button id="zoomOut" class="btn" aria-label="Zoom out">-</button>
          <button id="zoomIn" class="btn" aria-label="Zoom in">+</button>
          <button id="zoomReset" class="btn" aria-label="Reset zoom">⤾</button>
          <button id="fullImageBtn" class="btn" aria-label="View full image">🔍</button>
        </div>
      </div>
      <div class="thumbs" style="overflow-x:auto;white-space:nowrap">
        ${thumbs}
      </div>
    </div>
  ` : '<p class="muted">No images</p>';

  const video = data.video ? `<video controls class="video" style="display:block;margin-top:12px;width:100%"><source src="${data.video}"></video>` : '';

  const availability = data.availability ? '<span class="ok">Available</span>' : '<span class="no">Rented</span>';

  return `
    <div class="meta">
      <span>${data.type || ''}</span>
      <span>${data.gender || ''}</span>
      <span>${data.city || ''}</span>
      <span class="availability">${availability}</span>
    </div>
    <p style="margin-top:8px">${data.description || ''}</p>
    <div style="margin-top:8px;display:grid;grid-template-columns:repeat(2,1fr);gap:8px">
      <div><strong>Price:</strong> ${Number(data.price || 0)} EGP</div>
      <div><strong>Rooms left:</strong> ${Number(data.roomsLeft || 0)}</div>
      <div><strong>University:</strong> ${data.university || ''}</div>
      <div><strong>Faculty:</strong> ${data.faculty || ''}</div>
      <div><strong>Area:</strong> ${data.area || ''}</div>
      <div><strong>Location:</strong> ${data.location || ''}</div>
    </div>
    ${imageGallery}
    ${video}
  `;
}

// Full Image Modal Functions
function openFullImage(imageSrc) {
  const modal = document.getElementById('fullImageModal');
  const img = document.getElementById('fullImage');
  if (modal && img) {
    img.src = imageSrc;
    modal.classList.add('visible');
  }
}

function closeFullImage() {
  const modal = document.getElementById('fullImageModal');
  if (modal) {
    modal.classList.remove('visible');
  }
}

// Close full image modal when clicking outside the image
document.addEventListener('DOMContentLoaded', () => {
  const fullImageModal = document.getElementById('fullImageModal');
  if (fullImageModal) {
    fullImageModal.addEventListener('click', (e) => {
      if (e.target === fullImageModal) {
        closeFullImage();
      }
    });
  }
});


