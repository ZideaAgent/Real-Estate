/*
  Script to add sample property data to Firebase Firestore
  Run this in the browser console or as a separate script
*/

// Firebase configuration (same as in app.js)
const firebaseConfig = {
  apiKey: "AIzaSyDwdQ0ZAmifGSGnN-Vn3u8raYtpn5YPRhM",
  authDomain: "real-state-f8cc3.firebaseapp.com",
  projectId: "real-state-f8cc3",
  storageBucket: "real-state-f8cc3.firebasestorage.app",
  messagingSenderId: "3852629844",
  appId: "1:3852629844:web:2a3a7cbe726bad814dbac1",
  measurementId: "G-1G5YP5M0K6"
};

// Sample property data
const sampleProperties = [
  {
    title: "Modern 2-Bedroom Apartment",
    description: "Beautiful furnished apartment with balcony, 5 minutes walk to metro station. Perfect for students or young professionals.",
    type: "apartment",
    price: 8500,
    gender: "male",
    university: "Cairo University",
    area: "الحى الاول",
    location: "عمارة 12، الدور الثاني، شقة 5",
    city: "6 أكتوبر",
    images: [
      "https://picsum.photos/800/600?random=1",
      "https://picsum.photos/800/600?random=2"
    ],
    video: "",
    availability: true,
    roomsLeft: 1
  },
  {
    title: "Cozy Room in Shared Flat",
    description: "Quiet residential area, bills included. Ideal for students looking for affordable accommodation.",
    type: "room",
    price: 3200,
    gender: "female",
    university: "October University",
    area: "الحى الثاني",
    location: "عمارة 26، الدور الاول، شقة 23",
    city: "6 أكتوبر",
    images: [
      "https://picsum.photos/800/600?random=3"
    ],
    video: "",
    availability: true,
    roomsLeft: 2
  },
  {
    title: "Luxury Studio Apartment",
    description: "Fully furnished studio with modern amenities, gym access, and 24/7 security. Perfect for professionals.",
    type: "studio",
    price: 12000,
    gender: "male",
    university: "AUC",
    area: "الحى الثالث",
    location: "عمارة 45، الدور الخامس، شقة 12",
    city: "6 أكتوبر",
    images: [
      "https://picsum.photos/800/600?random=4",
      "https://picsum.photos/800/600?random=5",
      "https://picsum.photos/800/600?random=6"
    ],
    video: "",
    availability: true,
    roomsLeft: 1
  },
  {
    title: "Student-Friendly Room",
    description: "Budget-friendly room in a student house. Shared kitchen and bathroom. Close to university campus.",
    type: "room",
    price: 2800,
    gender: "female",
    university: "Cairo University",
    area: "الحى الاول",
    location: "عمارة 8، الدور الثالث، شقة 8",
    city: "6 أكتوبر",
    images: [
      "https://picsum.photos/800/600?random=7"
    ],
    video: "",
    availability: true,
    roomsLeft: 3
  },
  {
    title: "Family Apartment",
    description: "Spacious 3-bedroom apartment suitable for families. Large living room and kitchen. Parking available.",
    type: "apartment",
    price: 15000,
    gender: "male",
    university: "October University",
    area: "الحى الرابع",
    location: "عمارة 33، الدور الاول، شقة 15",
    city: "6 أكتوبر",
    images: [
      "https://picsum.photos/800/600?random=8",
      "https://picsum.photos/800/600?random=9"
    ],
    video: "",
    availability: false,
    roomsLeft: 0
  },
  {
    title: "Premium Studio with View",
    description: "High-end studio with city view, modern appliances, and concierge service. Ideal for executives.",
    type: "studio",
    price: 18000,
    gender: "female",
    university: "AUC",
    area: "الحى الخامس",
    location: "عمارة 67، الدور العاشر، شقة 25",
    city: "6 أكتوبر",
    images: [
      "https://picsum.photos/800/600?random=10",
      "https://picsum.photos/800/600?random=11"
    ],
    video: "",
    availability: true,
    roomsLeft: 1
  }
];

// Function to add data to Firestore
async function addSampleData() {
  try {
    // Import Firebase modules
    const { initializeApp } = await import('https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js');
    const { getFirestore, collection, addDoc } = await import('https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js');
    
    // Initialize Firebase
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    
    console.log('Adding sample data to Firebase...');
    
    // Add each property to Firestore
    for (const property of sampleProperties) {
      const docRef = await addDoc(collection(db, 'properties'), property);
      console.log(`Added property: ${property.title} with ID: ${docRef.id}`);
    }
    
    console.log('✅ All sample data added successfully!');
    console.log('Refresh your website to see the new properties.');
    
  } catch (error) {
    console.error('Error adding sample data:', error);
  }
}

// Function to clear all data (use with caution!)
async function clearAllData() {
  try {
    const { initializeApp } = await import('https://www.gstatic.com/firebasejs/10.12.4/firebase-app.js');
    const { getFirestore, collection, getDocs, deleteDoc } = await import('https://www.gstatic.com/firebasejs/10.12.4/firebase-firestore.js');
    
    const app = initializeApp(firebaseConfig);
    const db = getFirestore(app);
    
    const querySnapshot = await getDocs(collection(db, 'properties'));
    querySnapshot.forEach(async (doc) => {
      await deleteDoc(doc.ref);
    });
    
    console.log('✅ All data cleared!');
  } catch (error) {
    console.error('Error clearing data:', error);
  }
}

// Make functions available globally
window.addSampleData = addSampleData;
window.clearAllData = clearAllData;

console.log('Sample data script loaded!');
console.log('To add sample data, run: addSampleData()');
console.log('To clear all data, run: clearAllData()');
