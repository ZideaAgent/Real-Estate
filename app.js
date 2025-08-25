/*
  RentEase Frontend Script (Vanilla JS)
  - Landing overlay interactions
  - Theme toggle (light/dark) with persistence
  - i18n (English/Arabic) with RTL support and persistence
  - Filters UI + live property rendering
  - Firebase integration (Auth/Firestore/Storage) scaffold
*/

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
    'filters.university': 'University/Faculty',
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
    'filters.university': 'الجامعة/الكلية',
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
    const img = node.querySelector('.cover');
    const vid = node.querySelector('.video');
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
    if (item.video) {
      vid.style.display = 'block';
      vid.src = item.video;
    }

    // Primary fields
    title.textContent = item.title;
    desc.textContent = item.description;
    price.textContent = `${item.price.toLocaleString()} EGP`;
    type.textContent = item.type;
    gender.textContent = item.gender;
    location.textContent = `${item.area || ''} • ${item.location || ''} • ${item.city || ''}`;
    students.textContent = item.university ? `Students: ${item.university}` : '';
    status.textContent = item.availability ? 'Available' : 'Rented';
    availability.innerHTML = item.availability
      ? `<span class="ok">Available${typeof item.roomsLeft === 'number' ? ` • Rooms left: ${item.roomsLeft}` : ''}</span>`
      : `<span class="no">Rented</span>`;

    rentBtn.addEventListener('click', () => window.open(formUrl, '_blank'));
    grid.appendChild(node);
  });
}

// Apply filters
function applyFilters() {
  const gender = document.getElementById('filterGender').value;
  const type = document.getElementById('filterType').value;
  const maxPrice = Number(document.getElementById('filterPrice').value || 0);
  const university = document.getElementById('filterUniversity').value.trim().toLowerCase();
  const area = document.getElementById('filterArea').value.trim().toLowerCase();
  const location = document.getElementById('filterLocation').value.trim().toLowerCase();
  const city = document.getElementById('filterCity').value.trim().toLowerCase();
  const search = document.getElementById('searchText').value.trim().toLowerCase();

  const filtered = allProperties.filter(p => {
    if (gender && p.gender !== gender) return false;
    if (type && p.type !== type) return false;
    if (maxPrice && Number(p.price) > maxPrice) return false;
    if (university && !(p.university || '').toLowerCase().includes(university)) return false;
    if (area && !(p.area || '').toLowerCase().includes(area)) return false;
    if (location && !(p.location || '').toLowerCase().includes(location)) return false;
    if (city && !(p.city || '').toLowerCase().includes(city)) return false;
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
  }
}

// Init
document.getElementById('year').textContent = new Date().getFullYear();
scrollToHash();
initLandingOverlay(); // Initialize landing overlay
loadProperties();


