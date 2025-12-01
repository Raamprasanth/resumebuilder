'use client';

import { firebaseConfig } from '@/firebase/config';
import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore'

// IMPORTANT: DO NOT MODIFY THIS FUNCTION
export function initializeFirebase() {
  if (getApps().length) {
    const app = getApp();
    // Ensure the app is initialized with the correct config
    if (app.options.projectId === firebaseConfig.projectId) {
      return getSdks(app);
    }
  }

  // Always initialize with the config as a fallback.
  // In a production App Hosting environment, initializeApp() with no args
  // works, but for local dev and other environments, the config is necessary.
  const firebaseApp = initializeApp(firebaseConfig);

  return getSdks(firebaseApp);
}


export function getSdks(firebaseApp: FirebaseApp) {
  return {
    firebaseApp,
    auth: getAuth(firebaseApp),
    firestore: getFirestore(firebaseApp)
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
