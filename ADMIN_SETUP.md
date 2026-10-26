# Consigliere Holdings — Admin Dashboard & Firebase Integration Guide

This guide details the architecture, configuration, and step-by-step instructions for running the **Admin Trading Desk** and connecting **Firebase** to the Consigliere Holdings platform.

---

## 1. What Was Implemented

The administrative interface was recreated from the reference repository (`abhilash-tiwari-portfolio`) and adapted to the specific domain of **Consigliere Holdings** (Global Commodity Facilitation).

### Architectural & Design Patterns Reused
- **Neo-Brutalist High-Contrast Styling**: Crisp borders (`var(--adm-text)`), solid offset drop-shadows (`box-shadow: 6px 6px 0px var(--adm-text)`), bold uppercase typography, and high-visibility status badges (`NEW RFQ`, `ACTIVE / VISIBLE`, `PAUSED / HIDDEN`).
- **Gatekeeper Authentication View**: Restricted access card with legal warning notice, Google Sign-In, and unauthorized access screen displaying the authenticated user's email with authorization instructions.
- **Tabbed Management Interface**:
  - **Commodities**: Full CRUD operations for commodities (Energy, Industrial, Agriculture), specifications key-value builder, priority reordering (▲ / ▼), visibility toggles (Show/Hide), and a 1-click **Seed Default Portfolio** button.
  - **Enquiries**: Counterparty RFQ message inbox with real-time search, filters (All, New, Replied), source filters, copy contact actions, direct email response links, single/batch mark-as-replied, and deletion confirmation modals.
  - **Staff & Access**: Superadministrator directory, authorized standard admin whitelist management, add/revoke admin email actions, and security policy notes.
  - **Desk Settings**: Dynamic corporate contacts (public phone, desk email, principal email, registered address, trading hours, desk active toggle), Google Maps embed with live interactive preview, corporate channels (WhatsApp desk, LinkedIn, website), and dynamic theme preset selector.
- **Theme Engine**: 8 switchable color themes (`Executive Gold`, `Standard Pro`, `Midnight Noir`, `Neon Cyber`, `Forest Emerald`, `Tokyo Night`, `VS Dark Modern`, `Slate Pro`) with instant live preview and `localStorage` persistence.
- **Client & Server Security**: Dual-layer authorization with client-side verification and Cloud Firestore Security Rules enforcing role restrictions on the database.

---

## 2. Files Added & Modified

| File | Status | Description |
|---|---|---|
| `src/firebase/config.ts` | **Added** | Initializes Firebase App, Firestore, and Auth with safe environment fallbacks. |
| `src/themeConfig.ts` | **Added** | Centralized theme definitions (including custom Executive Gold). |
| `src/services/authService.ts` | **Added** | Firebase Google authentication, email authentication, and auth state listeners. |
| `src/services/settingsService.ts` | **Added** | Firestore operations for site settings and administrator whitelists. |
| `src/services/commodityService.ts` | **Added** | Firestore operations for commodity catalog management, ordering, and default seeding. |
| `src/services/enquiryService.ts` | **Added** | Firestore operations for commercial enquiry records, filtering, and reply statuses. |
| `src/hooks/useAuth.ts` | **Added** | Custom authentication hook with role detection (`isAdmin`, `isSuperAdmin`). |
| `src/components/admin/CommodityForm.tsx` | **Added** | Form component for adding and editing commodities with dynamic specification fields. |
| `src/pages/AdminDashboard.tsx` | **Added** | Complete administrative dashboard matching reference visual design and interactions. |
| `src/vite-env.d.ts` | **Added** | TypeScript definitions for Vite client and Firebase environment variables. |
| `firestore.rules` | **Added** | Production Cloud Firestore security rules with email whitelisting. |
| `.env.example` | **Updated** | Added template variables for Firebase client configuration. |
| `src/App.tsx` | **Modified** | Integrated `react-router-dom` with routes for `/`, `/admin`, and 404 fallback. |
| `src/components/home/Contact.tsx` | **Modified** | Connected public inquiry form to save records into Firestore `queries` collection. |
| `package.json` | **Modified** | Added `firebase`, `lucide-react`, and `react-router-dom`. |

---

## 3. Step-by-Step Firebase Setup Guide

Follow these steps in the [Firebase Console](https://console.firebase.google.com/) to connect your project.

### Step 3.1: Create a Firebase Project
1. Open [Firebase Console](https://console.firebase.google.com/).
2. Click **Add project** (or select an existing project).
3. Name your project (e.g., `consigliere-holdings`).
4. Google Analytics can be enabled or disabled according to your preference.
5. Click **Create project** and wait for provisioning to finish.

### Step 3.2: Register the Web Application
1. On the project overview page, click the **Web icon** (`</>`) to add a web app.
2. Enter an App nickname (e.g., `consigliere-web`).
3. You do not need Firebase Hosting immediately (leave unchecked unless desired).
4. Click **Register app**.
5. Firebase will display your `firebaseConfig` credentials object:
   ```javascript
   const firebaseConfig = {
     apiKey: "AIzaSy...",
     authDomain: "consigliere-holdings.firebaseapp.com",
     projectId: "consigliere-holdings",
     storageBucket: "consigliere-holdings.appspot.com",
     messagingSenderId: "1234567890",
     appId: "1:1234567890:web:abcdef..."
   };
   ```

### Step 3.3: Configure Local Environment Variables
Create or update your `.env` file in the project root:
```bash
# Transactional Email (Existing)
RESEND_API_KEY=re_your_api_key_here
ENQUIRY_TO_EMAIL=info@consigliereholdings.com
ENQUIRY_FROM_EMAIL=Consigliere Commercial Desk <onboarding@resend.dev>
NODE_ENV=development

# Firebase Configuration
VITE_FIREBASE_API_KEY=AIzaSy...
VITE_FIREBASE_AUTH_DOMAIN=consigliere-holdings.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=consigliere-holdings
VITE_FIREBASE_STORAGE_BUCKET=consigliere-holdings.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=1234567890
VITE_FIREBASE_APP_ID=1:1234567890:web:abcdef...
```

### Step 3.4: Enable Authentication Providers
1. In the Firebase Console left sidebar, click **Build > Authentication**.
2. Click **Get Started**.
3. Under the **Sign-in method** tab:
   - Click **Google**, toggle **Enable**, select your project support email, and click **Save**.
   - *(Optional)* Click **Email/Password**, toggle **Enable**, and click **Save** if you want email credentials as an alternative sign-in method.
4. Under **Settings > Authorized domains**:
   - Ensure `localhost` and `127.0.0.1` are in the list.
   - For production, add your domain (e.g., `consigliereholdings.com` and your Vercel deployment URL).

### Step 3.5: Create the Cloud Firestore Database
1. In the Firebase Console sidebar, click **Build > Firestore Database**.
2. Click **Create database**.
3. Choose a location closest to your users (e.g., `eur3 (europe-west)` or `nam5 (us-central)`).
4. Select **Start in production mode** (we will apply specific security rules in the next step).
5. Click **Create**.

### Step 3.6: Apply Firestore Security Rules
1. In Firestore Database, go to the **Rules** tab.
2. Replace all content with the rules from [`firestore.rules`](file:///firestore.rules):
   ```javascript
   rules_version = '2';

   service cloud.firestore {
     match /databases/{database}/documents {
       
       // Helper Functions
       function isSignedIn() {
         return request.auth != null;
       }

       function getSettings() {
         return get(/databases/$(database)/documents/settings/site).data;
       }

       function isAdmin() {
         let email = request.auth.token.email.lower();
         let settings = getSettings();
         return email in settings.adminEmails || email in settings.superAdminEmails;
       }

       function isSuperAdmin() {
         let email = request.auth.token.email.lower();
         let settings = getSettings();
         return email in settings.superAdminEmails;
       }

       // Commodities: Public read, Admin write
       match /commodities/{commodityId} {
         allow read: if true;
         allow create, update, delete: if isSignedIn() && isAdmin();
       }

       // Queries / Commercial Enquiries: Public create, Admin read/write
       match /queries/{queryId} {
         allow create: if true;
         allow read, update, delete: if isSignedIn() && isAdmin();
       }

       // Site Settings & Whitelist: Admin read, SuperAdmin write
       match /settings/site {
         allow read: if isSignedIn() && isAdmin();
         allow write: if isSignedIn() && isSuperAdmin();
       }
     }
   }
   ```
3. Click **Publish**.

### Step 3.7: Provision Your First Administrator Account
To establish your first Superadministrator:
1. In Firestore Database, go to the **Data** tab.
2. Click **Start collection**:
   - Collection ID: `settings`
   - Document ID: `site`
3. Add the following fields:
   - `superAdminEmails` (type: **array**): Add your Google email address (e.g., `["your-email@gmail.com"]`).
   - `adminEmails` (type: **array**): `[]` (empty array or additional emails).
   - `isDeskOpen` (type: **boolean**): `true`.
   - `deskEmail` (type: **string**): `info@consigliereholdings.com`.
   - `siteEmail` (type: **string**): `gs@consigliereholdings.com`.
4. Click **Save**.
*(Note: You can also update the default email in `src/services/settingsService.ts` under `DEFAULT_SETTINGS.superAdminEmails`).*

---

## 4. How to Run the Application

### Development Server
```bash
npm run dev
```
The application will start at `http://127.0.0.1:5173/`.

### Production Build & Type Check
```bash
npm run build
```
This runs TypeScript validation (`tsc`) and generates the optimized production bundle in `dist/`.

### Production Preview
```bash
npm run preview
```

---

## 5. How to Access the Admin Portal

1. Start the dev server and open:
   ```text
   http://localhost:5173/admin
   ```
2. You will be greeted by the **Gatekeeper Screen**:
   - High-contrast neo-brutalist authentication portal.
   - Click **Sign in with Google**.
3. **If Authorized**: You are immediately admitted to the trading desk dashboard with access to Commodities, Enquiries, Staff & Access, and Desk Settings.
4. **If Unauthorized**: The portal displays the **Access Denied** screen with your signed-in email address and instructions for a Superadmin to add your email.
5. **Session Termination**: Click the **LOGOUT** button in the top navigation bar at any time to revoke session tokens and return to the login gatekeeper.

---

## 6. Verifying the Integration

### 1. Seeding Initial Commodities
On your first login to `/admin`:
- Click the **COMMODITIES** tab.
- Click **SEED 9 DEFAULT COMMODITIES**.
- All 9 core commodities (EN590, Jet A1/TS-1, LNG, ESPO Blend, Granular Urea, Prilled Sulphur, Refined ICUMSA 45 Sugar, Milling Wheat, Yellow Corn) will be written to Firestore with specifications and display ordering.

### 2. Testing Commercial Inquiries
1. Open the public homepage at `http://localhost:5173/#contact`.
2. Fill out and submit an enquiry form.
3. The submission will dispatch transactional email notifications and save the record to Firestore `queries`.
4. Open `http://localhost:5173/admin` and click the **ENQUIRIES** tab:
   - The enquiry appears instantly marked with a `NEW RFQ` badge.
   - You can copy contact information, filter, mark as replied, or dispatch an email response.

---

## 7. Troubleshooting

| Issue | Cause | Solution |
|---|---|---|
| `auth/unauthorized-domain` | The current hostname is not authorized in Firebase Auth. | In Firebase Console > Authentication > Settings > Authorized Domains, add `localhost` and `127.0.0.1`. |
| `permission-denied` in Firestore | Security rules rejected the operation or user is not in `adminEmails`. | Verify that your signed-in email matches an entry in Firestore `settings/site` (`superAdminEmails` or `adminEmails`). |
| Missing Environment Variables | `.env` was not created or Vite was not restarted. | Ensure `.env` exists in project root with prefix `VITE_FIREBASE_*`. Restart `npm run dev`. |
| Popup Blocked during Login | Browser blocked the Google sign-in window. | Allow popups for `localhost:5173` or use the "Sign in with Email & Password" option. |
