/**
 * Firestore helpers for community feedback and newsletter subscriptions.
 * Uses the existing Firebase app from firebase.ts.
 */

import { getFirestore, collection, addDoc, serverTimestamp, type Firestore } from 'firebase/firestore';
import { app, isFirebaseConfigured } from './firebase';

let db: Firestore | null = null;

function getDb(): Firestore | null {
  if (!isFirebaseConfigured || !app) return null;
  if (!db) {
    db = getFirestore(app);
  }
  return db;
}

export interface FeedbackData {
  name: string;
  role: string;
  feedback: string;
}

export interface NewsletterData {
  email: string;
}

/**
 * Save community feedback to Firestore.
 */
export async function addFeedback(data: FeedbackData): Promise<boolean> {
  const firestore = getDb();
  if (!firestore) {
    console.warn('[Firestore] Not configured — feedback not saved');
    return false;
  }

  try {
    await addDoc(collection(firestore, 'community_feedback'), {
      ...data,
      createdAt: serverTimestamp(),
    });
    return true;
  } catch (err) {
    console.error('[Firestore] Failed to save feedback:', err);
    return false;
  }
}

/**
 * Save newsletter subscription to Firestore.
 */
export async function addNewsletterSubscriber(data: NewsletterData): Promise<boolean> {
  const firestore = getDb();
  if (!firestore) {
    console.warn('[Firestore] Not configured — subscription not saved');
    return false;
  }

  try {
    await addDoc(collection(firestore, 'newsletter_subscribers'), {
      ...data,
      subscribedAt: serverTimestamp(),
    });
    return true;
  } catch (err) {
    console.error('[Firestore] Failed to save subscription:', err);
    return false;
  }
}
