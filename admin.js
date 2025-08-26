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
  
  // Reset form button
  document.getElementById('resetForm')?.addEventListener('click', () => {
    form.reset();
    document.getElementById('docId').value = '';
    uploadedUrls = [];
    displayUploadedImages();
    document.getElementById('pImages').value = '';
    updateClearAllButton();
  });
  
  // Clear all images button
  document.getElementById('clearAllImages')?.addEventListener('click', () => {
    if (confirm('Remove all uploaded images?')) {
      uploadedUrls = [];
      pImages.value = '';
      displayUploadedImages();
      updateClearAllButton();
    }
  });
  
  // Test Cloudinary connection
  document.getElementById('testCloudinary')?.addEventListener('click', async () => {
    const testBtn = document.getElementById('testCloudinary');
    const originalText = testBtn.textContent;
    
    try {
      testBtn.textContent = 'Testing...';
      testBtn.disabled = true;
      
      // Test with a simple fetch to Cloudinary
      const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/image/upload`, {
        method: 'POST',
        body: new FormData()
      });
      
      if (response.status === 400) {
        // 400 is expected for empty form data, but means the endpoint is reachable
        alert('✅ Cloudinary connection successful! The endpoint is reachable.\n\nNote: You may need to create a custom upload preset in your Cloudinary dashboard for actual uploads to work.');
      } else {
        alert(`Cloudinary response: ${response.status} - ${response.statusText}`);
      }
      
    } catch (error) {
      console.error('Cloudinary test failed:', error);
      alert(`❌ Cloudinary connection failed: ${error.message}\n\nPlease check your cloud name and internet connection.`);
    } finally {
      testBtn.textContent = originalText;
      testBtn.disabled = false;
    }
  });
  
  function updateClearAllButton() {
    const clearBtn = document.getElementById('clearAllImages');
    if (clearBtn) {
      clearBtn.style.display = uploadedUrls.length > 0 ? 'inline-block' : 'none';
    }
  }
  
  // Cloudinary upload functionality
  const imageUpload = document.getElementById('imageUpload');
  const uploadProgress = document.getElementById('uploadProgress');
  const progressFill = document.querySelector('.progress-fill');
  const uploadStatus = document.querySelector('.upload-status');
  const uploadedImages = document.getElementById('uploadedImages');
  const pImages = document.getElementById('pImages');
  
  let uploadedUrls = [];
  
  // Cloudinary configuration
  const cloudinaryConfig = {
    cloudName: 'dycisbm24',
    apiKey: '977787321868472',
    uploadPreset: 'ml_default' // Using default preset for now
  };
  
  // Alternative upload method using direct form submission
  async function uploadToCloudinary(file) {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', cloudinaryConfig.uploadPreset);
    
    console.log('Uploading file:', file.name, 'Size:', file.size, 'Type:', file.type);
    
    try {
      const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudinaryConfig.cloudName}/image/upload`, {
        method: 'POST',
        body: formData
      });
      
      console.log('Cloudinary response status:', response.status);
      
      if (!response.ok) {
        const errorData = await response.text();
        console.error('Cloudinary error response:', response.status, errorData);
        throw new Error(`Upload failed: ${response.status} - ${errorData}`);
      }
      
      const result = await response.json();
      console.log('Upload successful:', result.secure_url);
      return result.secure_url;
    } catch (error) {
      console.error('Upload error:', error);
      throw error;
    }
  }
  
  // Fallback: If Cloudinary fails, we can store files as data URLs temporarily
  function createDataURL(file) {
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.readAsDataURL(file);
    });
  }
  
  imageUpload?.addEventListener('change', async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;
    
    // Show progress
    uploadProgress.style.display = 'block';
    progressFill.style.width = '0%';
    uploadStatus.textContent = `Uploading ${files.length} image(s)...`;
    
    try {
      // Upload files one by one to avoid overwhelming the API
      const newUrls = [];
      
      for (let i = 0; i < files.length; i++) {
        const file = files[i];
        
        try {
          // Update progress
          const progress = ((i + 1) / files.length) * 100;
          progressFill.style.width = `${progress}%`;
          uploadStatus.textContent = `Uploading ${file.name} (${i + 1} of ${files.length})`;
          
          const url = await uploadToCloudinary(file);
          newUrls.push(url);
          
        } catch (fileError) {
          console.error(`Failed to upload ${file.name}:`, fileError);
          uploadStatus.textContent = `Failed to upload ${file.name}. Continuing with others...`;
          // Continue with other files instead of stopping completely
        }
      }
      
      if (newUrls.length > 0) {
        // Add new URLs to existing ones
        uploadedUrls = [...uploadedUrls, ...newUrls];
        
        // Update hidden field
        pImages.value = uploadedUrls.join('\n');
        
        // Show uploaded images
        displayUploadedImages();
        
        // Success state
        progressFill.classList.add('success');
        uploadStatus.textContent = `Successfully uploaded ${newUrls.length} of ${files.length} image(s)!`;
        
        setTimeout(() => {
          uploadProgress.style.display = 'none';
          progressFill.classList.remove('success');
        }, 3000);
      } else {
        throw new Error('No images were uploaded successfully');
      }
      
    } catch (error) {
      console.error('Upload failed:', error);
      progressFill.classList.add('error');
      uploadStatus.textContent = `Upload failed: ${error.message}`;
      
      setTimeout(() => {
        uploadProgress.style.display = 'none';
        progressFill.classList.remove('error');
      }, 5000);
    }
    
    // Clear file input
    e.target.value = '';
  });
  
  function displayUploadedImages() {
    uploadedImages.innerHTML = '';
    
    if (uploadedUrls.length === 0) {
      uploadedImages.innerHTML = '<p class="muted">No images uploaded yet</p>';
      return;
    }
    
    uploadedUrls.forEach((url, index) => {
      const imgContainer = document.createElement('div');
      imgContainer.style.position = 'relative';
      imgContainer.style.display = 'inline-block';
      imgContainer.style.margin = '4px';
      
      const img = document.createElement('img');
      img.src = url;
      img.alt = `Uploaded image ${index + 1}`;
      img.style.cursor = 'pointer';
      
      // Add click to preview
      img.onclick = () => previewImage(url);
      
      const removeBtn = document.createElement('button');
      removeBtn.className = 'remove-btn';
      removeBtn.textContent = '×';
      removeBtn.title = 'Remove image';
      removeBtn.onclick = (e) => {
        e.stopPropagation();
        removeImage(index);
      };
      
      imgContainer.appendChild(img);
      imgContainer.appendChild(removeBtn);
      uploadedImages.appendChild(imgContainer);
    });
    
    // Update clear all button visibility
    updateClearAllButton();
  }
  
  function removeImage(index) {
    if (confirm(`Remove image ${index + 1}?`)) {
      uploadedUrls.splice(index, 1);
      pImages.value = uploadedUrls.join('\n');
      displayUploadedImages();
    }
  }
  
  function previewImage(url) {
    // Create a simple preview modal
    const modal = document.createElement('div');
    modal.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: rgba(0,0,0,0.8);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 1000;
      cursor: pointer;
    `;
    
    const img = document.createElement('img');
    img.src = url;
    img.style.cssText = `
      max-width: 90%;
      max-height: 90%;
      object-fit: contain;
      border-radius: 8px;
    `;
    
    modal.appendChild(img);
    modal.onclick = () => document.body.removeChild(modal);
    
    document.body.appendChild(modal);
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
    
    // Handle images for editing
    uploadedUrls = data.images || [];
    document.getElementById('pImages').value = uploadedUrls.join('\n');
    displayUploadedImages();
    
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
