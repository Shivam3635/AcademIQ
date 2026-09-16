import {
  collection,
  doc,
  addDoc,
  updateDoc,
  deleteDoc,
  onSnapshot,
  query,
  orderBy,
  getDocs,
  Timestamp,
} from 'firebase/firestore';
import { db, isFirebaseConfigured } from '@/lib/firebase';
import { notices as defaultNotices } from '@/lib/academic-data';
import type { Notice } from '@/lib/types';

export interface NoticeItem extends Notice {
  category?: 'academic' | 'exam' | 'event' | 'urgent' | 'general';
  priority?: 'normal' | 'urgent';
  createdAt?: string;
}

const NOTICES_COLLECTION = 'notices';
const LOCAL_STORAGE_KEY = 'academiq_local_notices';

/**
 * Get initial local or default notices
 */
function getStoredLocalNotices(): NoticeItem[] {
  if (typeof window === 'undefined') return defaultNotices;
  try {
    const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
    if (saved) {
      return JSON.parse(saved);
    }
  } catch (err) {
    console.error('Failed to read local notices:', err);
  }
  return defaultNotices;
}

function saveStoredLocalNotices(items: NoticeItem[]): void {
  if (typeof window === 'undefined') return;
  try {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(items));
  } catch (err) {
    console.error('Failed to save local notices:', err);
  }
}

/**
 * Subscribe to real-time updates for notices from Firestore.
 * Falls back to localStorage or static notices if Firebase is not connected.
 */
export function subscribeToNotices(callback: (notices: NoticeItem[]) => void): () => void {
  if (!isFirebaseConfigured) {
    const initial = getStoredLocalNotices();
    callback(initial);
    // Return a no-op unsubscribe function
    return () => {};
  }

  try {
    const noticesRef = collection(db, NOTICES_COLLECTION);
    const q = query(noticesRef, orderBy('createdAt', 'desc'));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        if (snapshot.empty) {
          // If Firestore collection is empty, provide default notices
          callback(defaultNotices);
          return;
        }

        const items: NoticeItem[] = snapshot.docs.map((d) => {
          const data = d.data();
          return {
            id: d.id,
            title: data.title || '',
            content: data.content || '',
            author: data.author || 'Admin Office',
            date: data.date || new Date().toISOString().split('T')[0],
            category: data.category || 'general',
            priority: data.priority || 'normal',
            createdAt: data.createdAt instanceof Timestamp
              ? data.createdAt.toDate().toISOString()
              : data.createdAt || new Date().toISOString(),
          };
        });

        callback(items);
      },
      (error) => {
        console.error('Error in onSnapshot for notices:', error);
        callback(getStoredLocalNotices());
      }
    );

    return unsubscribe;
  } catch (err) {
    console.error('Failed to subscribe to notices:', err);
    callback(getStoredLocalNotices());
    return () => {};
  }
}

/**
 * Create a new notice document in Firestore
 */
export async function createNotice(
  data: Omit<NoticeItem, 'id' | 'createdAt'>
): Promise<string> {
  const newNotice: Omit<NoticeItem, 'id'> = {
    ...data,
    date: data.date || new Date().toISOString().split('T')[0],
    createdAt: new Date().toISOString(),
  };

  if (isFirebaseConfigured) {
    const noticesRef = collection(db, NOTICES_COLLECTION);
    const docRef = await addDoc(noticesRef, {
      ...newNotice,
      createdAt: Timestamp.now(),
    });
    return docRef.id;
  } else {
    // Local demo mode
    const current = getStoredLocalNotices();
    const id = `notice-${Date.now()}`;
    const created: NoticeItem = { id, ...newNotice };
    saveStoredLocalNotices([created, ...current]);
    return id;
  }
}

/**
 * Update an existing notice document in Firestore
 */
export async function updateNotice(
  id: string,
  data: Partial<Omit<NoticeItem, 'id'>>
): Promise<void> {
  if (isFirebaseConfigured) {
    const docRef = doc(db, NOTICES_COLLECTION, id);
    await updateDoc(docRef, {
      ...data,
      updatedAt: Timestamp.now(),
    });
  } else {
    const current = getStoredLocalNotices();
    const updated = current.map((item) =>
      item.id === id ? { ...item, ...data } : item
    );
    saveStoredLocalNotices(updated);
  }
}

/**
 * Delete a notice document from Firestore
 */
export async function deleteNotice(id: string): Promise<void> {
  if (isFirebaseConfigured) {
    const docRef = doc(db, NOTICES_COLLECTION, id);
    await deleteDoc(docRef);
  } else {
    const current = getStoredLocalNotices();
    const filtered = current.filter((item) => item.id !== id);
    saveStoredLocalNotices(filtered);
  }
}

/**
 * Seeds initial mock notices into Firestore if the collection is empty.
 */
export async function seedInitialNotices(): Promise<number> {
  if (!isFirebaseConfigured) {
    saveStoredLocalNotices(defaultNotices);
    return defaultNotices.length;
  }

  const noticesRef = collection(db, NOTICES_COLLECTION);
  const existing = await getDocs(noticesRef);
  if (!existing.empty) {
    return 0; // Already has notices
  }

  let count = 0;
  for (const item of defaultNotices) {
    await addDoc(noticesRef, {
      title: item.title,
      content: item.content,
      author: item.author,
      date: item.date,
      category: item.title.toLowerCase().includes('exam') ? 'exam' : 'general',
      priority: 'normal',
      createdAt: Timestamp.now(),
    });
    count++;
  }

  return count;
}
