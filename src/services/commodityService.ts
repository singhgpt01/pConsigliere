import { db, isFirebaseConfigured } from '../firebase/config';
import {
  collection,
  addDoc,
  getDocs,
  getDoc,
  deleteDoc,
  doc,
  query,
  updateDoc,
  serverTimestamp,
  writeBatch,
  type Timestamp
} from 'firebase/firestore';
import { commoditiesData, type CommoditySpec, type CommodityCategoryType } from '../data/commodities';

export interface AdminCommodity {
  id: string;
  name: string;
  category: CommodityCategoryType;
  categoryLabel: string;
  tagline: string;
  overview: string;
  featured?: boolean;
  specs: CommoditySpec[];
  availabilityNote: string;
  isDisabled?: boolean;
  displayOrder?: number;
  createdAt?: Timestamp | { toDate?: () => Date } | any;
  updatedAt?: Timestamp | any;
}

const COMMODITIES_COLLECTION = 'commodities';

/**
 * Fetches all commodities from Firestore.
 * Falls back to default static commodities if Firestore is not yet configured or empty.
 */
export const getCommodities = async (includeDisabled = false): Promise<AdminCommodity[]> => {
  const firestore = db;
  if (!isFirebaseConfigured || !firestore) {
    const list: AdminCommodity[] = commoditiesData.map((c, i) => ({
      ...c,
      isDisabled: false,
      displayOrder: i * 10
    }));
    return includeDisabled ? list : list.filter(item => !item.isDisabled);
  }

  try {
    const q = query(collection(firestore, COMMODITIES_COLLECTION));
    const querySnapshot = await getDocs(q);

    // If Firestore is empty, seed with initial items
    if (querySnapshot.empty) {
      return commoditiesData.map((c, i) => ({
        ...c,
        isDisabled: false,
        displayOrder: i * 10
      }));
    }

    let items: AdminCommodity[] = querySnapshot.docs.map(docSnap => ({
      id: docSnap.id,
      ...(docSnap.data() as Omit<AdminCommodity, 'id'>)
    }));

    // In-memory sort
    items.sort((a, b) => {
      const orderA = a.displayOrder ?? 9999999999999;
      const orderB = b.displayOrder ?? 9999999999999;

      if (orderA !== orderB) {
        return orderA - orderB;
      }

      const timeA = a.createdAt?.toMillis ? a.createdAt.toMillis() : 0;
      const timeB = b.createdAt?.toMillis ? b.createdAt.toMillis() : 0;
      return timeB - timeA;
    });

    if (!includeDisabled) {
      return items.filter(c => !c.isDisabled);
    }
    return items;
  } catch (error: any) {
    console.error('[CommodityService] Error fetching commodities:', error);
    return commoditiesData.map((c, i) => ({
      ...c,
      isDisabled: false,
      displayOrder: i * 10
    }));
  }
};

/**
 * Seeds default portfolio commodities into Firestore.
 */
export const seedDefaultCommodities = async (): Promise<void> => {
  const firestore = db;
  if (!isFirebaseConfigured || !firestore) {
    throw new Error('Firebase credentials are not configured in your .env file.');
  }

  try {
    const batch = writeBatch(firestore);
    commoditiesData.forEach((item, index) => {
      const docRef = doc(firestore, COMMODITIES_COLLECTION, item.id);
      batch.set(docRef, {
        ...item,
        isDisabled: false,
        displayOrder: index * 10,
        createdAt: serverTimestamp()
      });
    });
    await batch.commit();
  } catch (error: any) {
    console.error('[CommodityService] Error seeding default commodities:', error);
    throw error;
  }
};

/**
 * Fetches a single commodity by ID.
 */
export const getCommodity = async (commodityId: string): Promise<AdminCommodity> => {
  const firestore = db;
  if (!isFirebaseConfigured || !firestore) {
    const found = commoditiesData.find(c => c.id === commodityId);
    if (!found) throw new Error('Commodity not found');
    return { ...found, isDisabled: false };
  }

  try {
    const docRef = doc(firestore, COMMODITIES_COLLECTION, commodityId);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      return { id: docSnap.id, ...(docSnap.data() as Omit<AdminCommodity, 'id'>) };
    } else {
      throw new Error('Commodity not found');
    }
  } catch (error: any) {
    console.error('[CommodityService] Error fetching commodity:', error);
    throw error;
  }
};

/**
 * Adds a new commodity to Firestore.
 */
export const addCommodity = async (commodityData: Omit<AdminCommodity, 'id'>): Promise<string> => {
  const firestore = db;
  if (!isFirebaseConfigured || !firestore) {
    throw new Error('Firebase credentials are not configured in your .env file.');
  }

  try {
    const docRef = await addDoc(collection(firestore, COMMODITIES_COLLECTION), {
      ...commodityData,
      isDisabled: false,
      displayOrder: Date.now(),
      createdAt: serverTimestamp()
    });
    return docRef.id;
  } catch (error: any) {
    console.error('[CommodityService] Error adding commodity:', error);
    throw error;
  }
};

/**
 * Permanently deletes a commodity.
 */
export const deleteCommodity = async (commodityId: string): Promise<void> => {
  const firestore = db;
  if (!isFirebaseConfigured || !firestore) {
    throw new Error('Firebase credentials are not configured in your .env file.');
  }

  try {
    await deleteDoc(doc(firestore, COMMODITIES_COLLECTION, commodityId));
  } catch (error: any) {
    console.error('[CommodityService] Error deleting commodity:', error);
    throw error;
  }
};

/**
 * Toggles commodity visibility (Soft delete / Hide).
 */
export const toggleCommodityStatus = async (commodityId: string, isDisabled: boolean): Promise<void> => {
  const firestore = db;
  if (!isFirebaseConfigured || !firestore) {
    throw new Error('Firebase credentials are not configured in your .env file.');
  }

  try {
    const docRef = doc(firestore, COMMODITIES_COLLECTION, commodityId);
    await updateDoc(docRef, { isDisabled });
  } catch (error: any) {
    console.error('[CommodityService] Error toggling status:', error);
    throw error;
  }
};

/**
 * Updates an existing commodity.
 */
export const updateCommodity = async (commodityId: string, commodityData: Partial<AdminCommodity>): Promise<void> => {
  const firestore = db;
  if (!isFirebaseConfigured || !firestore) {
    throw new Error('Firebase credentials are not configured in your .env file.');
  }

  try {
    const docRef = doc(firestore, COMMODITIES_COLLECTION, commodityId);
    await updateDoc(docRef, {
      ...commodityData,
      updatedAt: serverTimestamp()
    });
  } catch (error: any) {
    console.error('[CommodityService] Error updating commodity:', error);
    throw error;
  }
};

/**
 * Batch update display order.
 */
export const updateCommodityOrder = async (orderUpdates: { id: string; displayOrder: number }[]): Promise<void> => {
  const firestore = db;
  if (!isFirebaseConfigured || !firestore) {
    return;
  }

  try {
    const batch = writeBatch(firestore);
    orderUpdates.forEach(update => {
      const docRef = doc(firestore, COMMODITIES_COLLECTION, update.id);
      batch.update(docRef, { displayOrder: update.displayOrder });
    });
    await batch.commit();
  } catch (error: any) {
    console.error('[CommodityService] Error updating commodity order:', error);
    throw error;
  }
};
