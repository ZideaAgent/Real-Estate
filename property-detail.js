// Property Detail Page Script
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js';
import { getFirestore, doc, getDoc } from 'https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDwdQ0ZAmifGSGnN-Vn3u8raYtpn5YPRhM",
  authDomain: "real-state-f8cc3.firebaseapp.com",
  projectId: "real-state-f8cc3",
  storageBucket: "real-state-f8cc3.firebasestorage.app",
  messagingSenderId: "3852629844",
  appId: "1:3852629844:web:2a3a7cbe726bad814dbac1",
  measurementId: "G-1G5YP5M0K6"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// Get property ID from URL
function getPropertyId() {
  const urlParams = new URLSearchParams(window.location.search);
  return urlParams.get('id');
}

// Load property details
async function loadPropertyDetails() {
  const propertyId = getPropertyId();
  
  if (!propertyId) {
    showError('No property ID provided');
    return;
  }

  try {
    console.log('Loading property:', propertyId);
    
    const docRef = doc(db, 'properties', propertyId);
    const docSnap = await getDoc(docRef);
    
    if (docSnap.exists()) {
      const property = { id: docSnap.id, ...docSnap.data() };
      displayProperty(property);
    } else {
      showError('Property not found');
    }
  } catch (error) {
    console.error('Error loading property:', error);
    showError('Failed to load property details');
  }
}

// Display property information
function displayProperty(property) {
  console.log('Displaying property:', property);
  
  // Basic information
  document.getElementById('propertyTitle').textContent = property.title || 'Untitled Property';
  document.getElementById('propertyPrice').textContent = `${(property.price || 0).toLocaleString()} EGP`;
  document.getElementById('propertyDescription').textContent = property.description || 'No description available';
  
  // Availability badge
  const availabilityBadge = document.getElementById('availabilityBadge');
  if (property.availability) {
    availabilityBadge.textContent = 'Available';
    availabilityBadge.className = 'availability-badge available';
  } else {
    availabilityBadge.textContent = 'Rented';
    availabilityBadge.className = 'availability-badge rented';
  }
  
  // Meta information
  document.getElementById('propertyType').textContent = property.type || 'N/A';
  document.getElementById('propertyGender').textContent = property.gender || 'N/A';
  document.getElementById('propertyUniversity').textContent = property.university || 'N/A';
  document.getElementById('propertyArea').textContent = property.area || 'N/A';
  document.getElementById('propertyLocation').textContent = property.location || 'N/A';
  document.getElementById('propertyCity').textContent = property.city || 'N/A';
  document.getElementById('propertyRoomsLeft').textContent = property.roomsLeft || 'N/A';
  
  // Location details
  document.getElementById('locationArea').textContent = property.area || 'N/A';
  document.getElementById('locationLocation').textContent = property.location || 'N/A';
  document.getElementById('locationCity').textContent = property.city || 'N/A';
  
  // Display images
  displayImages(property.images || []);
  
  // Display video
  displayVideo(property.video);
  
  // Update page title
  document.title = `${property.title} - RentEase`;
  
  // Setup rent button
  setupRentButton();
}

// Display property images
function displayImages(images) {
  const imagesSection = document.getElementById('imagesSection');
  const imagesGrid = document.getElementById('imagesGrid');
  
  if (images.length === 0) {
    imagesSection.style.display = 'none';
    return;
  }
  
  imagesSection.style.display = 'block';
  imagesGrid.innerHTML = '';
  
  images.forEach((imageUrl, index) => {
    if (imageUrl && imageUrl.trim()) {
      const mediaItem = document.createElement('div');
      mediaItem.className = 'media-item';
      
      const img = document.createElement('img');
      img.src = imageUrl.trim();
      img.alt = `Property image ${index + 1}`;
      img.loading = 'lazy';
      
      // Add click to enlarge functionality
      img.style.cursor = 'pointer';
      img.addEventListener('click', () => {
        openImageModal(imageUrl.trim());
      });
      
      mediaItem.appendChild(img);
      imagesGrid.appendChild(mediaItem);
    }
  });
}

// Display property video
function displayVideo(videoUrl) {
  const videoSection = document.getElementById('videoSection');
  const propertyVideo = document.getElementById('propertyVideo');
  
  if (!videoUrl || !videoUrl.trim()) {
    videoSection.style.display = 'none';
    return;
  }
  
  videoSection.style.display = 'block';
  propertyVideo.src = videoUrl.trim();
  propertyVideo.load();
}

// Setup rent button to open Google Form
function setupRentButton() {
  const rentBtn = document.querySelector('.rent-btn');
  const formUrl = 'https://docs.google.com/forms/d/e/1FAIpQLSeTyPgOb5xf4XVivwCpgfFzZVz6id6iTywlqH9Ekkm1WOVOfw/viewform?usp=dialog';
  
  rentBtn.addEventListener('click', () => {
    window.open(formUrl, '_blank');
  });
}

// Show error message
function showError(message) {
  const container = document.querySelector('.container');
  container.innerHTML = `
    <div style="text-align: center; padding: 60px 20px;">
      <h1 style="color: var(--error); margin-bottom: 20px;">Error</h1>
      <p style="color: var(--text); margin-bottom: 30px;">${message}</p>
      <button class="btn primary" onclick="window.location.href='./'">Go Home</button>
    </div>
  `;
}

// Image modal for enlarged view
function openImageModal(imageUrl) {
  const modal = document.createElement('div');
  modal.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.9);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
    cursor: pointer;
  `;
  
  const img = document.createElement('img');
  img.src = imageUrl;
  img.style.cssText = `
    max-width: 90%;
    max-height: 90%;
    object-fit: contain;
    border-radius: 8px;
  `;
  
  modal.appendChild(img);
  document.body.appendChild(modal);
  
  // Close modal on click
  modal.addEventListener('click', () => {
    document.body.removeChild(modal);
  });
}

// Initialize theme and language
function initializeUI() {
  // Theme toggle
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = themeToggle.querySelector('.theme-icon');
  
  // Load saved theme
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
  themeIcon.textContent = savedTheme === 'light' ? '🌙' : '☀️';
  
  themeToggle.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'light' ? 'dark' : 'light';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
    themeIcon.textContent = newTheme === 'light' ? '🌙' : '☀️';
  });
  
  // Language toggle
  const langToggle = document.getElementById('langToggle');
  const langIcon = langToggle.querySelector('.lang-icon');
  
  // Load saved language
  const savedLang = localStorage.getItem('language') || 'en';
  document.documentElement.setAttribute('lang', savedLang);
  langIcon.textContent = savedLang.toUpperCase();
  
  langToggle.addEventListener('click', () => {
    const currentLang = document.documentElement.getAttribute('lang');
    const newLang = currentLang === 'en' ? 'ar' : 'en';
    
    document.documentElement.setAttribute('lang', newLang);
    localStorage.setItem('language', newLang);
    langIcon.textContent = newLang.toUpperCase();
    
    // Update text direction for Arabic
    if (newLang === 'ar') {
      document.body.style.direction = 'rtl';
    } else {
      document.body.style.direction = 'ltr';
    }
  });
  
  // Set initial text direction
  if (savedLang === 'ar') {
    document.body.style.direction = 'rtl';
  }
}

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
  console.log('Property detail page loaded');
  
  // Set year in footer
  document.getElementById('year').textContent = new Date().getFullYear();
  
  // Initialize UI
  initializeUI();
  
  // Load property details
  loadPropertyDetails();
});
