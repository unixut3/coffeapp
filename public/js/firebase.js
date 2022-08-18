// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.9.1/firebase-app.js";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import {
  getFirestore,
  collection,
  getDocs,
  onSnapshot,
  addDoc,
  deleteDoc,
  doc,
  getDoc,
  updateDoc,
} from "https://www.gstatic.com/firebasejs/9.9.1/firebase-firestore.js";
import { 
  getStorage, 
  ref, 
  uploadBytesResumable, 
  getDownloadURL, 
} from "https://www.gstatic.com/firebasejs/9.9.1/firebase-storage.js";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAgXXUhj4aCXpxeBCMnbaJLWB-YfXFI6zQ",
        authDomain: "coffeerecipe-bbff6.firebaseapp.com",
        projectId: "coffeerecipe-bbff6",
        storageBucket: "coffeerecipe-bbff6.appspot.com",
        messagingSenderId: "442796272109",
        appId: "1:442796272109:web:04a56630e45f3453339fe4",
        measurementId: "G-GTGZKLL42C"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
export const db = getFirestore();
export const storage = getStorage();

/**
 * Save a New Task in Firestore
 * @param {string} rosteryName the rosteryName of the Task
 * @param {string} location the location of the Task
 * @param {string} imageUrl the imageUrl of the Task
 */
export const saveTask = (rosteryName, location, imageUrl) =>
  addDoc(collection(db, "Rostery"), { rosteryName, location, imageUrl });

export const onGetTasks = (callback) =>
  onSnapshot(collection(db, "Rostery"), callback);

/**
 *
 * @param {string} id Task ID
 */
export const deleteTask = (id) => deleteDoc(doc(db, "Rostery", id));

export const getTask = (id) => getDoc(doc(db, "Rostery", id));

export const updateTask = (id, newFields) =>
  updateDoc(doc(db, "Rostery", id), newFields);

export const getTasks = () => getDocs(collection(db, "Rostery"));

export const uploadImage = (file) => {
  debugger
  const storageRef = ref(storage, 'images/' + file.name);
  const uploadTask = uploadBytesResumable(storageRef, file);
  
  // Listen for state changes, errors, and completion of the upload.
  uploadTask.on('state_changed',
  (snapshot) => {
    // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
    console.log('Upload is ' + progress + '% done');
    switch (snapshot.state) {
      case 'paused':
        console.log('Upload is paused');
        break;
      case 'running':
        console.log('Upload is running');
        break;
    }
  },
  (error) => {
    console.log("Error : " + error);
  },
  () => {
    // Upload completed successfully, now we can get the download URL
    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
      console.log('File available at', downloadURL);
    });
  }
  );
}
