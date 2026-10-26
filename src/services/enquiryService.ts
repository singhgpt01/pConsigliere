import { db, isFirebaseConfigured } from '../firebase/config';
import {
  collection,
  addDoc,
  getDocs,
  deleteDoc,
  doc,
  query,
  orderBy,
  updateDoc,
  serverTimestamp,
  writeBatch,
  type Timestamp
} from 'firebase/firestore';

export interface EnquiryRecord {
  id: string;
  fullName: string;
  companyName: string;
  businessEmail: string;
  country: string;
  commodity: string;
  deliveryTerms?: string;
  quantity?: string;
  destination?: string;
  description?: string;
  contactMethod?: string;
  source?: 'form' | 'popup' | 'direct' | 'call';
  isSeen: boolean;
  reference?: string;
  createdAt?: Timestamp | { toDate?: () => Date; toMillis?: () => number } | any;
}

const QUERIES_COLLECTION = 'queries';

/**
 * Stores a commercial enquiry submission in Firestore.
 */
export const addEnquiry = async (enquiryData: Omit<EnquiryRecord, 'id' | 'isSeen' | 'createdAt'>): Promise<string | null> => {
  const firestore = db;
  if (!isFirebaseConfigured || !firestore) {
    return null;
  }

  try {
    const docRef = await addDoc(collection(firestore, QUERIES_COLLECTION), {
      ...enquiryData,
      source: enquiryData.source || 'form',
      isSeen: false,
      createdAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error: any) {
    console.error('[EnquiryService] Error adding enquiry to Firestore:', error);
    return null;
  }
};

/**
 * Fetches all commercial inquiries from Firestore.
 */
export const getEnquiries = async (): Promise<EnquiryRecord[]> => {
  const firestore = db;
  if (!isFirebaseConfigured || !firestore) {
    return [];
  }

  try {
    const q = query(
      collection(firestore, QUERIES_COLLECTION),
      orderBy('createdAt', 'desc')
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(docSnap => {
      const data = docSnap.data();
      return {
        id: docSnap.id,
        fullName: data.fullName || 'Anonymous Counterparty',
        companyName: data.companyName || 'Not specified',
        businessEmail: data.businessEmail || 'Not provided',
        country: data.country || 'International',
        commodity: data.commodity || 'General Commodity',
        deliveryTerms: data.deliveryTerms || 'CIF',
        quantity: data.quantity || '',
        destination: data.destination || '',
        description: data.description || '',
        contactMethod: data.contactMethod || 'email',
        source: data.source || 'form',
        isSeen: Boolean(data.isSeen),
        reference: data.reference,
        createdAt: data.createdAt
      };
    });
  } catch (error: any) {
    console.error('[EnquiryService] Error fetching inquiries:', error);
    try {
      const fallbackSnapshot = await getDocs(collection(firestore, QUERIES_COLLECTION));
      return fallbackSnapshot.docs.map(docSnap => {
        const data = docSnap.data();
        return {
          id: docSnap.id,
          fullName: data.fullName || 'Anonymous Counterparty',
          companyName: data.companyName || 'Not specified',
          businessEmail: data.businessEmail || 'Not provided',
          country: data.country || 'International',
          commodity: data.commodity || 'General Commodity',
          deliveryTerms: data.deliveryTerms || 'CIF',
          quantity: data.quantity || '',
          destination: data.destination || '',
          description: data.description || '',
          contactMethod: data.contactMethod || 'email',
          source: data.source || 'form',
          isSeen: Boolean(data.isSeen),
          reference: data.reference,
          createdAt: data.createdAt
        };
      });
    } catch {
      return [];
    }
  }
};

/**
 * Marks a single inquiry as replied / handled.
 */
export const markEnquiryAsSeen = async (enquiryId: string): Promise<void> => {
  const firestore = db;
  if (!isFirebaseConfigured || !firestore) return;

  try {
    const docRef = doc(firestore, QUERIES_COLLECTION, enquiryId);
    await updateDoc(docRef, { isSeen: true });
  } catch (error: any) {
    console.error('[EnquiryService] Error marking inquiry as seen:', error);
    throw error;
  }
};

/**
 * Marks multiple inquiries as replied using a batch update.
 */
export const markAllEnquiriesAsSeen = async (enquiryIds: string[]): Promise<void> => {
  const firestore = db;
  if (!isFirebaseConfigured || !firestore || enquiryIds.length === 0) return;

  try {
    const batch = writeBatch(firestore);
    enquiryIds.forEach(id => {
      const docRef = doc(firestore, QUERIES_COLLECTION, id);
      batch.update(docRef, { isSeen: true });
    });
    await batch.commit();
  } catch (error: any) {
    console.error('[EnquiryService] Error marking all inquiries as seen:', error);
    throw error;
  }
};

/**
 * Permanently deletes an inquiry.
 */
export const deleteEnquiry = async (enquiryId: string): Promise<void> => {
  const firestore = db;
  if (!isFirebaseConfigured || !firestore) return;

  try {
    await deleteDoc(doc(firestore, QUERIES_COLLECTION, enquiryId));
  } catch (error: any) {
    console.error('[EnquiryService] Error deleting inquiry:', error);
    throw error;
  }
};
