'use client';

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, type FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

let firebaseApp: FirebaseApp;

// A more robust initialization function
export function initializeFirebase() {
  if (!getApps().length) {
    // Initialize the app only if it hasn't been initialized yet
    firebaseApp = initializeApp(firebaseConfig);
  } else {
    // If it has been initialized, get the default app
    firebaseApp = getApp();
  }

  return getSdks(firebaseApp);
}

export function getSdks(app: FirebaseApp) {
  return {
    firebaseApp: app,
    auth: getAuth(app),
    firestore: getFirestore(app),
  };
}


export * from './provider';
export * from './client-provider';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './non-blocking-updates';
export * from './non-blocking-login';
export * from './errors';
export * from './error-emitter';