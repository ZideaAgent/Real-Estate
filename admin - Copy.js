/*
  RentEase Admin Script
  - Email/Password auth
  - CRUD on Firestore collection `properties`
  - Upload images/videos to Firebase Storage
  - Populate form for editing, delete docs
*/

import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js';
import { getAuth, signInWithEmailAndPassword, onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/10.12.4/firebase-auth.js';
import { getFirestore, collection, addDoc, updateDoc, deleteDoc, doc, getDocs, query } from 'https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js';
// Removed Storage import since we're using external URLs

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

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
// No storage needed for external URLs

// UI Elements
const loginForm = document.getElementById('loginForm');
const emailEl = document.getElementById('email');
const passEl = document.getElementById('password');
const logoutBtn = document.getElementById('logoutBtn');

const sectionLogin = document.getElementById('login');
const sectionDashboard = document.getElementById('dashboard');

const form = document.getElementById('propertyForm');
const docId = document.getElementById('docId');
const pTitle = document.getElementById('pTitle');
const pDesc = document.getElementById('pDesc');
const pType = document.getElementById('pType');
const pPrice = document.getElementById('pPrice');
const pGender = document.getElementById('pGender');
const pUniversity = document.getElementById('pUniversity');
const pArea = document.getElementById('pArea');
const pLocation = document.getElementById('pLocation');
const pCity = document.getElementById('pCity');
const pAvailability = document.getElementById('pAvailability');
const pRoomsLeft = document.getElementById('pRoomsLeft');
const pImages = document.getElementById('pImages');
const pVideo = document.getElementById('pVideo');
const resetFormBtn = document.getElementById('resetForm');

const adminList = document.getElementById('adminList');
const adminCardTpl = document.getElementById('adminCardTpl');

// Auth state handling
onAuthStateChanged(auth, (user) => {
  const loggedIn = !!user;
  sectionLogin.style.display = loggedIn ? 'none' : 'block';
  sectionDashboard.style.display = loggedIn ? 'block' : 'none';
  logoutBtn.style.display = loggedIn ? 'inline-flex' : 'none';
  if (loggedIn) loadList();
});

loginForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  try {
    await signInWithEmailAndPassword(auth, emailEl.value, passEl.value);
  } catch (err) {
    alert('Login failed: ' + err.message);
  }
});

logoutBtn?.addEventListener('click', async () => {
  await signOut(auth);
});

// Helpers
function toBool(v){ return String(v) === 'true'; }

function parseImageUrls(textareaValue) {
  if (!textareaValue.trim()) return [];
  return textareaValue.split('\n')
    .map(url => url.trim())
    .filter(url => url.length > 0);
}

// Create/Update
form?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const payload = {
    title: pTitle.value,
    description: pDesc.value,
    type: pType.value,
    price: Number(pPrice.value || 0),
    gender: pGender.value,
    university: pUniversity.value,
    area: pArea.value,
    location: pLocation.value,
    city: pCity.value,
    availability: toBool(pAvailability.value),
    roomsLeft: Number(pRoomsLeft.value || 0),
  };

  try{
    // Parse media URLs
    const imageUrls = parseImageUrls(pImages.value);
    if (imageUrls.length > 0) {
      payload.images = imageUrls;
    }
    if (pVideo.value.trim()) {
      payload.video = pVideo.value.trim();
    }

    if (docId.value){
      await updateDoc(doc(db, 'properties', docId.value), payload);
    } else {
      await addDoc(collection(db, 'properties'), { images: [], video: '', ...payload });
    }

    alert('Saved');
    form.reset();
    docId.value = '';
    await loadList();
  }catch(err){
    alert('Save failed: ' + err.message);
  }
});

resetFormBtn?.addEventListener('click', () => {
  form.reset();
  docId.value = '';
});

// Load list
async function loadList(){
  adminList.innerHTML = '';
  const q = query(collection(db, 'properties'));
  const snapshot = await getDocs(q);
  snapshot.forEach(d => {
    const data = { id: d.id, ...d.data() };
    const node = adminCardTpl.content.cloneNode(true);
    node.querySelector('.title').textContent = data.title;
    node.querySelector('.meta').textContent = `${data.type} • ${data.price} EGP • ${data.city || ''}`;
    const actions = node.querySelector('.actions');
    actions.querySelector('[data-action="edit"]').addEventListener('click', () => fillForm(data));
    actions.querySelector('[data-action="delete"]').addEventListener('click', () => removeDoc(data.id));
    adminList.appendChild(node);
  });
}

function fillForm(data){
  docId.value = data.id;
  pTitle.value = data.title || '';
  pDesc.value = data.description || '';
  pType.value = data.type || 'apartment';
  pPrice.value = data.price || 0;
  pGender.value = data.gender || 'male';
  pUniversity.value = data.university || '';
  pArea.value = data.area || '';
  pLocation.value = data.location || '';
  pCity.value = data.city || '';
  pAvailability.value = String(!!data.availability);
  pRoomsLeft.value = data.roomsLeft || 0;
  // Fill media URLs
  pImages.value = (data.images || []).join('\n');
  pVideo.value = data.video || '';
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

async function removeDoc(id){
  if (!confirm('Delete this property?')) return;
  try{
    await deleteDoc(doc(db, 'properties', id));
    await loadList();
  }catch(err){
    alert('Delete failed: ' + err.message);
  }
}


