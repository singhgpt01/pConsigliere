import { db, isFirebaseConfigured } from '../firebase/config';
import { doc, getDoc, updateDoc, setDoc, arrayUnion, arrayRemove } from 'firebase/firestore';

export interface SiteSettings {
  adminEmails: string[];
  superAdminEmails: string[];
  mapUrl: string;
  mapAddress: string;
  sitePhone: string;
  siteEmail: string;
  deskEmail: string;
  siteAddress: string;
  workingHours: string;
  isDeskOpen: boolean;
  socialWa: string;
  socialLinked: string;
  socialWeb: string;
}

const SETTINGS_COLLECTION = 'settings';
const SITE_DOC = 'site';

export const DEFAULT_SETTINGS: SiteSettings = {
  adminEmails: [],
  superAdminEmails: [
    "gs@consigliereholdings.com",
    "info@consigliereholdings.com"
  ],
  mapUrl: "https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d158857.28186121735!2d-0.24168128383377774!3d51.52873519808389!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47d8a00baf21de75%3A0x52963a5addd52a99!2sLondon%2C%20UK!5e0!3m2!1sen!2suk!4v1713254400000!5m2!1sen!2suk",
  mapAddress: "Consigliere Holdings Ltd., Mayfair, London, United Kingdom",
  sitePhone: "+44 (0) 20 7946 0912",
  siteEmail: "gs@consigliereholdings.com",
  deskEmail: "info@consigliereholdings.com",
  siteAddress: "Consigliere Holdings Ltd., Mayfair, London, United Kingdom",
  workingHours: "Mon - Fri: 08:30 - 18:00 GMT (Trading Hours)",
  isDeskOpen: true,
  socialWa: "+447946091200",
  socialLinked: "https://linkedin.com/company/consigliere-holdings",
  socialWeb: "https://consigliereholdings.com"
};

/**
 * Fetches all site settings from Firestore.
 * Initializes the document if it doesn't exist.
 */
export const getSettings = async (): Promise<SiteSettings> => {
  const firestore = db;
  if (!isFirebaseConfigured || !firestore) {
    return DEFAULT_SETTINGS;
  }

  try {
    const docRef = doc(firestore, SETTINGS_COLLECTION, SITE_DOC);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data() as Partial<SiteSettings>;
      return {
        ...DEFAULT_SETTINGS,
        ...data,
        adminEmails: data.adminEmails || [],
        superAdminEmails: data.superAdminEmails || DEFAULT_SETTINGS.superAdminEmails
      };
    } else {
      await setDoc(docRef, DEFAULT_SETTINGS);
      return DEFAULT_SETTINGS;
    }
  } catch (error: any) {
    console.error('[SettingsService] Error fetching settings:', error);
    return DEFAULT_SETTINGS;
  }
};

/**
 * Updates site settings in Firestore.
 */
export const updateSettings = async (data: Partial<SiteSettings>): Promise<void> => {
  const firestore = db;
  if (!isFirebaseConfigured || !firestore) {
    throw new Error('Firebase credentials are not configured in your .env file.');
  }

  try {
    const docRef = doc(firestore, SETTINGS_COLLECTION, SITE_DOC);
    await updateDoc(docRef, data);
  } catch (error: any) {
    console.error('[SettingsService] Error updating settings:', error);
    throw error;
  }
};

/**
 * Adds an email to the admin list.
 */
export const addAdminEmail = async (email: string): Promise<void> => {
  const firestore = db;
  if (!isFirebaseConfigured || !firestore) {
    throw new Error('Firebase credentials are not configured in your .env file.');
  }

  try {
    const docRef = doc(firestore, SETTINGS_COLLECTION, SITE_DOC);
    await updateDoc(docRef, {
      adminEmails: arrayUnion(email.toLowerCase().trim())
    });
  } catch (error: any) {
    console.error('[SettingsService] Error adding admin email:', error);
    throw error;
  }
};

/**
 * Removes an email from the admin list.
 */
export const removeAdminEmail = async (email: string): Promise<void> => {
  const firestore = db;
  if (!isFirebaseConfigured || !firestore) {
    throw new Error('Firebase credentials are not configured in your .env file.');
  }

  try {
    const docRef = doc(firestore, SETTINGS_COLLECTION, SITE_DOC);
    await updateDoc(docRef, {
      adminEmails: arrayRemove(email.toLowerCase().trim())
    });
  } catch (error: any) {
    console.error('[SettingsService] Error removing admin email:', error);
    throw error;
  }
};
