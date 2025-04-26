// services/db.js

// Firebase
import { db } from './firebaseConfig'; // adjust path
import {
  setDoc,
  doc,
  orderBy,
  addDoc,
  onSnapshot,
  collection,
  getDoc,
  getDocs,
  query,
  where,
  Timestamp,
  increment,
  updateDoc,
  deleteDoc,
  limit,
  arrayUnion,
  deleteField,
  arrayRemove,
  serverTimestamp,
} from 'firebase/firestore';

// Supabase
import { supabase } from './supabase';

// Export everything you want to use globally
export {
  db,
  supabase,
  setDoc,
  doc,
  orderBy,
  addDoc,
  onSnapshot,
  collection,
  getDoc,
  getDocs,
  query,
  where,
  Timestamp,
  increment,
  updateDoc,
  deleteDoc,
  limit,
  arrayUnion,
  deleteField,
  arrayRemove,
  serverTimestamp,
};
