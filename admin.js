// Admin.js - Simple working version
import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js';
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js';
import { getFirestore, collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query } from 'https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js';

// Firebase config
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
const auth = getAuth(app);
const db = getFirestore(app);

// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
  console.log('Admin page loaded, initializing...');
  
  // Get DOM elements
  const loginForm = document.getElementById('loginForm');
  const emailEl = document.getElementById('email');
  const passEl = document.getElementById('password');
  const logoutBtn = document.getElementById('logoutBtn');
  const sectionLogin = document.getElementById('login');
  const sectionDashboard = document.getElementById('dashboard');
  const form = document.getElementById('propertyForm');
  const adminList = document.getElementById('adminList');
  const adminCardTpl = document.getElementById('adminCardTpl');
  const detailsOverlay = document.getElementById('detailsOverlay');
  const detailsContent = document.getElementById('detailsContent');
  const closeDetails = document.getElementById('closeDetails');
  
  // GitHub upload elements
  const selectPhotosBtn = document.getElementById('selectPhotosBtn');
  const photoUpload = document.getElementById('photoUpload');
  const selectedFilesCount = document.getElementById('selectedFilesCount');
  const uploadProgress = document.getElementById('uploadProgress');
  const progressBar = document.getElementById('progressBar');
  const uploadStatus = document.getElementById('uploadStatus');
  const uploadPhotosBtn = document.getElementById('uploadPhotosBtn');
  const githubUsername = document.getElementById('githubUsername');
  const githubRepo = document.getElementById('githubRepo');
  const githubToken = document.getElementById('githubToken');
  
  // Check if elements exist
  if (!loginForm || !emailEl || !passEl || !logoutBtn || !sectionLogin || !sectionDashboard || !form || !adminList || !adminCardTpl || !detailsOverlay || !detailsContent || !closeDetails) {
    console.error('Some DOM elements are missing!');
    return;
  }
  
  console.log('All DOM elements found, setting up...');
  
  // Auth state listener
  onAuthStateChanged(auth, (user) => {
    console.log('Auth state changed:', user ? 'logged in' : 'logged out');
    const loggedIn = !!user;
    sectionLogin.style.display = loggedIn ? 'none' : 'block';
    sectionDashboard.style.display = loggedIn ? 'block' : 'none';
    logoutBtn.style.display = loggedIn ? 'inline-flex' : 'none';
    if (loggedIn) {
      loadList();
    }
  });
  
  // Login form
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    try {
      await signInWithEmailAndPassword(auth, emailEl.value, passEl.value);
      console.log('Login successful');
    } catch (err) {
      console.error('Login failed:', err);
      alert('Login failed: ' + err.message);
    }
  });
  
  // Logout button
  logoutBtn.addEventListener('click', async () => {
    try {
      await signOut(auth);
      console.log('Logout successful');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  });
  
  // Property form
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    await saveProperty();
  });
  
  // GitHub Photo Upload Setup
  let selectedFiles = [];
  
  selectPhotosBtn?.addEventListener('click', () => {
    photoUpload?.click();
  });
  
  photoUpload?.addEventListener('change', (e) => {
    selectedFiles = Array.from(e.target.files);
    selectedFilesCount.textContent = selectedFiles.length > 0 ? `${selectedFiles.length} file(s) selected` : '';
    uploadPhotosBtn.style.display = selectedFiles.length > 0 ? 'inline-block' : 'none';
  });
  
  uploadPhotosBtn?.addEventListener('click', async () => {
    if (!githubUsername.value || !githubRepo.value || !githubToken.value) {
      alert('Please fill in all GitHub fields');
      return;
    }
    
    if (selectedFiles.length === 0) {
      alert('Please select files to upload');
      return;
    }
    
    await uploadPhotosToGitHub();
  });
  
  // GitHub Upload Function
  async function uploadPhotosToGitHub() {
    const username = githubUsername.value;
    const repo = githubRepo.value;
    const token = githubToken.value;
    
    uploadProgress.style.display = 'block';
    uploadPhotosBtn.disabled = true;
    
    try {
      const uploadedUrls = [];
      
      for (let i = 0; i < selectedFiles.length; i++) {
        const file = selectedFiles[i];
        const progress = ((i + 1) / selectedFiles.length) * 100;
        
        progressBar.style.width = `${progress}%`;
        uploadStatus.textContent = `Uploading ${file.name}...`;
        
        // Create unique filename with timestamp
        const timestamp = Date.now();
        const fileExtension = file.name.split('.').pop().toLowerCase();
        const isVideo = ['mp4', 'avi', 'mov', 'wmv', 'flv', 'webm'].includes(fileExtension);
        
        // Use Vercel-friendly folder structure
        const folder = isVideo ? 'assets/videos' : 'assets/images';
        const filename = `${folder}/${timestamp}-${i + 1}.${fileExtension}`;
        
        // Convert file to base64
        const base64Content = await fileToBase64(file);
        
        // Upload to GitHub using API
        const response = await fetch(`https://api.github.com/repos/${username}/${repo}/contents/${filename}`, {
          method: 'PUT',
          headers: {
            'Authorization': `token ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            message: `Add ${isVideo ? 'video' : 'image'}: ${file.name}`,
            content: base64Content,
            branch: 'main'
          })
        });
        
        if (!response.ok) {
          throw new Error(`GitHub API error: ${response.status} ${response.statusText}`);
        }
        
        const result = await response.json();
        
        // Generate URLs that work with Vercel deployment
        // Option 1: Raw GitHub URLs (works immediately)
        const rawUrl = `https://raw.githubusercontent.com/${username}/${repo}/main/${filename}`;
        
        // Option 2: Vercel deployment URLs (after next deployment)
        const vercelUrl = `https://real-estate-zideas-projects.vercel.app/${filename}`;
        
        // Store both URLs, but prefer Vercel URL for production
        const finalUrl = vercelUrl;
        uploadedUrls.push(finalUrl);
        
        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
      
      // Update the images textarea with the new URLs
      const imagesTextarea = document.getElementById('pImages');
      const existingUrls = imagesTextarea.value.split('\n').filter(url => url.trim());
      const allUrls = [...existingUrls, ...uploadedUrls];
      imagesTextarea.value = allUrls.join('\n');
      
      uploadStatus.textContent = `Successfully uploaded ${uploadedUrls.length} files! URLs will work after Vercel redeploys.`;
      progressBar.style.background = 'var(--success)';
      
      // Clear selected files
      selectedFiles = [];
      selectedFilesCount.textContent = '';
      uploadPhotosBtn.style.display = 'none';
      photoUpload.value = '';
      
      setTimeout(() => {
        uploadProgress.style.display = 'none';
        progressBar.style.width = '0%';
        progressBar.style.background = 'var(--primary)';
        uploadPhotosBtn.disabled = false;
      }, 5000);
      
    } catch (error) {
      console.error('Upload failed:', error);
      uploadStatus.textContent = `Upload failed: ${error.message}`;
      progressBar.style.background = 'var(--danger)';
      uploadPhotosBtn.disabled = false;
      
      setTimeout(() => {
        uploadProgress.style.display = 'none';
        progressBar.style.width = '0%';
        progressBar.style.background = 'var(--primary)';
      }, 5000);
    }
  }
  
  // Helper function to convert file to base64
  function fileToBase64(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64 = reader.result.split(',')[1];
        resolve(base64);
      };
      reader.onerror = error => reject(error);
    });
  }
  
  // Load properties list
  async function loadList() {
    try {
      adminList.innerHTML = '';
      const q = query(collection(db, 'properties'));
      const snapshot = await getDocs(q);
      console.log(`Found ${snapshot.size} properties`);
      
      snapshot.forEach(d => {
        const data = { id: d.id, ...d.data() };
        const node = adminCardTpl.content.cloneNode(true);
        const card = node.querySelector('.card');
        card.style.cursor = 'pointer';
        card.addEventListener('click', (evt) => {
          const target = evt.target;
          if (target.closest && target.closest('.actions')) return;
          openDetails(data);
        });
        node.querySelector('.title').textContent = data.title;
        node.querySelector('.meta').textContent = `${data.type} • ${data.price} EGP • ${data.city || ''}`;
        
        const actions = node.querySelector('.actions');
        actions.querySelector('[data-action="edit"]').addEventListener('click', (e) => { e.stopPropagation(); fillForm(data); });
        actions.querySelector('[data-action="delete"]').addEventListener('click', (e) => { e.stopPropagation(); removeDoc(data.id); });
        adminList.appendChild(node);
      });
    } catch (err) {
      console.error('Failed to load properties:', err);
      adminList.innerHTML = '<p style="color: red;">Failed to load properties: ' + err.message + '</p>';
    }
  }
  
  // Save property
  async function saveProperty() {
    const payload = {
      title: document.getElementById('pTitle').value,
      description: document.getElementById('pDesc').value,
      type: document.getElementById('pType').value,
      price: Number(document.getElementById('pPrice').value || 0),
      gender: document.getElementById('pGender').value,
      university: document.getElementById('pUniversity').value,
      area: document.getElementById('pArea').value,
      location: document.getElementById('pLocation').value,
      city: document.getElementById('pCity').value,
      availability: document.getElementById('pAvailability').value === 'true',
      roomsLeft: Number(document.getElementById('pRoomsLeft').value || 0),
    };
    
    try {
      // Parse image URLs
      const imageUrls = document.getElementById('pImages').value.split('\n').filter(url => url.trim());
      if (imageUrls.length > 0) {
        payload.images = imageUrls;
      }
      
      if (document.getElementById('pVideo').value.trim()) {
        payload.video = document.getElementById('pVideo').value.trim();
      }
      
      const docId = document.getElementById('docId').value;
      if (docId) {
        await updateDoc(doc(db, 'properties', docId), payload);
        console.log('Property updated');
      } else {
        await addDoc(collection(db, 'properties'), payload);
        console.log('Property created');
      }
      
      alert('Property saved successfully!');
      form.reset();
      document.getElementById('docId').value = '';
      await loadList();
    } catch (err) {
      console.error('Save failed:', err);
      alert('Save failed: ' + err.message);
    }
  }
  
  // Fill form for editing
  function fillForm(data) {
    document.getElementById('docId').value = data.id;
    document.getElementById('pTitle').value = data.title || '';
    document.getElementById('pDesc').value = data.description || '';
    document.getElementById('pType').value = data.type || 'apartment';
    document.getElementById('pPrice').value = data.price || 0;
    document.getElementById('pGender').value = data.gender || 'male';
    document.getElementById('pUniversity').value = data.university || '';
    document.getElementById('pArea').value = data.area || '';
    document.getElementById('pLocation').value = data.location || '';
    document.getElementById('pCity').value = data.city || '';
    document.getElementById('pAvailability').value = String(!!data.availability);
    document.getElementById('pRoomsLeft').value = data.roomsLeft || 0;
    document.getElementById('pImages').value = (data.images || []).join('\n');
    document.getElementById('pVideo').value = data.video || '';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }
  
  // Delete property
  async function removeDoc(id) {
    if (!confirm('Delete this property?')) return;
    try {
      await deleteDoc(doc(db, 'properties', id));
      console.log('Property deleted');
      await loadList();
    } catch (err) {
      console.error('Delete failed:', err);
      alert('Delete failed: ' + err.message);
    }
  }
  
  // Details overlay handlers
  function openDetails(data) {
    detailsContent.innerHTML = renderDetailsHtml(data);
    detailsOverlay.classList.add('visible');
  }
  function closeDetailsOverlay() {
    detailsOverlay.classList.remove('visible');
  }
  closeDetails.addEventListener('click', closeDetailsOverlay);
  detailsOverlay.addEventListener('click', (e) => {
    if (e.target === detailsOverlay) closeDetailsOverlay();
  });

  function renderDetailsHtml(data) {
    const images = Array.isArray(data.images) ? data.images : [];
    const imageGallery = images.length ? `
      <div style="display:grid;grid-template-columns:repeat(3,1fr);gap:8px;margin-top:8px">
        ${images.map(url => `<img src="${url}" alt="image" style="width:100%;height:120px;object-fit:cover;border-radius:8px;border:1px solid var(--border)"/>`).join('')}
      </div>
    ` : '<p class="muted">No images</p>';

    const video = data.video ? `<video controls class="video" style="display:block;margin-top:10px"><source src="${data.video}"></video>` : '';

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
        <div><strong>Area:</strong> ${data.area || ''}</div>
        <div><strong>Location:</strong> ${data.location || ''}</div>
      </div>
      ${imageGallery}
      ${video}
    `;
  }
  
  console.log('Admin setup complete!');
});
