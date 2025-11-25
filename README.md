# SushiVision AR 🍣 - Interactive Restaurant AR Menu

<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

## 🎯 Project Overzicht

**SushiVision AR** is een cutting-edge restaurant applicatie die **Augmented Reality** combineert met **AI-gegenereerde beelden** om klanten een revolutionair menu-ervaring te bieden.

### ✨ Hoofdfuncties

- 🖼️ **Admin Panel**: Restaurant eigenaren kunnen menu items en foto's uploaden
- 👁️ **AR Visualisatie**: Klanten bekijken gerechten op hun tafel via AR
- 🤖 **AI-Powered**: Google Gemini AI voor automatische gerecht generatie (optioneel)
- 📱 **Responsive**: Werkt op desktop, tablet en mobiel
- 🎨 **Premium Design**: Moderne dark mode interface met glassmorphism
- 🛒 **Complete Bestelflow**: Van menu tot bestelling tot review

---

## 🏗️ Architectuur

### Voor Restaurant Eigenaren

```
Admin Panel (/admin) → Upload Foto's → Beheer Menu → Preview
                   ↓
              LocalStorage (tijdelijk) / Firebase (productie)
```

### Voor Klanten

```
Landing Page → Menu (Foto's) → Klik Gerecht → AR View → Bestelling → Checkout
```

---

## 📁 Project Structuur

```
sushivision-ar-4/
├── components/
│   ├── AdminPanel.tsx      ← 🔒 Admin interface voor eigenaar
│   ├── ARView.tsx          ← 👁️ AR visualisatie
│   ├── MenuPresets.tsx     ← 📋 Menu weergave met foto's
│   ├── Cart.tsx            ← 🛒 Winkelwagen
│   ├── Landing.tsx         ← 🏠 Welkomstpagina
│   ├── Navigation.tsx      ← 🧭 Navigatie
│   ├── OrderTracker.tsx    ← 📦 Bestelling tracking
│   └── ReviewForm.tsx      ← ⭐ Reviews
├── services/
│   └── geminiService.ts    ← 🤖 AI integratie (optioneel)
├── App.tsx                 ← 🎯 Hoofd component
├── types.ts                ← 📝 TypeScript types
├── constants.ts            ← 🎨 Menu data
├── ADMIN_GUIDE.md          ← 📖 Handleiding voor eigenaren
└── CUSTOMER_GUIDE.md       ← 📖 Handleiding voor klanten
```

---

## 🚀 Installatie & Gebruik

### Vereisten

- Node.js (v16 of hoger)
- NPM of Yarn

### Snelle Start

```bash
# 1. Installeer dependencies
npm install

# 2. Stel Gemini API key in voor AI features
# Maak een .env bestand in de root directory:
# VITE_GEMINI_API_KEY=jouw-gemini-api-key-hier
# 
# OF gebruik Cursor's environment variables:
# - Open Cursor Settings
# - Zoek naar "Environment Variables" of "Secrets"
# - Voeg toe: VITE_GEMINI_API_KEY=jouw-gemini-api-key-hier
#
# OF gebruik Developer Settings in de app zelf:
# - Ga naar /developer route
# - Voer je API key in en klik "Save Settings"

# 3. Start development server
npm run dev

# App draait nu op: http://localhost:3000
```

### Toegang Admin Panel

```
http://localhost:5173/admin
of
http://localhost:5173/#admin
```

---

## 👨‍💼 Voor Restaurant Eigenaren

### Admin Panel Gebruiken

1. **Open Admin Panel**
   - Ga naar `/admin` route
   - Je ziet een zwarte interface met "🔒 Admin Panel"

2. **Menu Item Toevoegen**
   - Klik "Nieuw Gerecht Toevoegen"
   - Upload een professionele foto (JPG/PNG)
   - Vul naam, beschrijving en prijs in
   - Klik "Toevoegen"

3. **Opslaan**
   - Klik groene "Opslaan" knop rechtsboven
   - Items worden opgeslagen in LocalStorage*

4. **Preview Mode**
   - Klik "Preview Modus" om te zien hoe klanten het zien
   - Test de AR functionaliteit

> ⚠️ **Let op**: LocalStorage is tijdelijk. Voor productie gebruik Firebase/Supabase.

### Volledige Admin Handleiding

📖 Zie [ADMIN_GUIDE.md](./ADMIN_GUIDE.md) voor complete instructies

---

## 👥 Voor Klanten

### Hoe de App Gebruiken

1. **Open de Website**
   - Scan QR-code of ga naar URL
   - Klik "Start" op welkomstpagina

2. **Bekijk Menu**
   - Zie alle gerechten met foto's
   - Elk item toont: foto, naam, beschrijving, prijs

3. **AR Activeren**
   - Klik op een gerecht
   - Geef camera toegang (eenmalig)
   - Zie het gerecht op je tafel!

4. **AR Bedienen**
   - **Verplaatsen**: Sleep met vinger/muis
   - **Zoom**: Pinch of scroll
   - **Foto**: Klik camera icoon

5. **Bestellen**
   - Voeg toe aan winkelwagen
   - Checkout en volg je bestelling

### Volledige Klant Handleiding

📖 Zie [Customer Guide](./docs/guides/customer.md) voor complete instructies

---

## 🛠️ Technische Details

### Tech Stack

| Component | Technologie | Versie |
|-----------|-------------|--------|
| Framework | React | 19.2.0 |
| Language | TypeScript | 5.8.2 |
| Build Tool | Vite | 6.2.0 |
| Styling | TailwindCSS | CDN |
| AI | Google Gemini | 2.5-flash |
| Icons | Lucide React | 0.554.0 |

### API Configuraties

#### SiliconFlow API (DeepSeek)
De SiliconFlow API configuratie is opgeslagen in `config/api.json`:

- **Base URL**: `https://api.siliconflow.com/v1`
- **API Endpoint**: `nex-agi/DeepSeek-V3.1-Nex-N1`
- **Model ID**: `nex-agi/DeepSeek-V3.1-Nex-N1`
- **Compatible APIs**: `OpenAI`

Voor gebruik met OpenAI-compatible clients, gebruik de base URL en model ID zoals gedefinieerd in `config/api.json`.

### Features Overzicht

#### ✅ Geïmplementeerd

- [x] Admin Panel voor foto upload
- [x] Menu weergave met echte foto's
- [x] AR visualisatie met camera
- [x] Touch/mouse controls (drag, pinch, zoom)
- [x] Snapshot functionaliteit
- [x] Winkelwagen systeem
- [x] Bestelling tracking
- [x] Review systeem
- [x] Multi-cuisine support (Sushi/Burger)
- [x] LocalStorage voor demo

#### 🚧 Toekomstige Features

- [ ] Firebase/Supabase database
- [ ] Cloud foto storage
- [ ] Admin login/authenticatie
- [ ] Edit menu items (nu: alleen toevoegen/verwijderen)
- [ ] Categorieën (starters, mains, desserts)
- [ ] Bulk foto upload
- [ ] Real-time bestellingen backend
- [ ] Payment integratie
- [ ] Multi-taal support
- [ ] Analytics dashboard

---

## 🎨 Customization

### Kleuren Aanpassen

In `index.html`:

```javascript
colors: {
  sushi: {
    dark: '#1a1a1a',
    red: '#ff6b6b',
    gold: '#fbbf24'  // ← Pas aan naar jouw brand kleur
  }
}
```

### Nieuwe Cuisine Toevoegen

In `constants.ts`:

```typescript
export const CUISINES = {
  sushi: { ... },
  burger: { ... },
  pizza: {  // ← Voeg nieuwe toe
    id: 'pizza',
    name: 'Pizza',
    label: 'Pizzeria Bella',
    // ... rest van config
  }
}
```

---

## 📊 Data Flow

### Admin → Customer Flow

```
Eigenaar uploadt foto in Admin Panel
         ↓
Opgeslagen in LocalStorage als base64
         ↓
App.tsx merged custom items met default presets
         ↓
MenuPresets component toont foto's
         ↓
Klant klikt op item
         ↓
ARView toont foto in AR overlay
         ↓
Klant kan bestellen
```

---

## 🔐 Beveiliging

### Huidige Status

⚠️ **Development Mode**:

- Admin panel is **niet beveiligd**
- Iedereen met `/admin` URL heeft toegang
- LocalStorage is client-side (niet veilig voor productie)

### Productie Aanbevelingen

✅ **Implementeer**:

1. Firebase Authentication voor admin
2. Protected routes met login verificatie
3. Cloud storage voor foto's (niet base64)
4. Server-side validatie
5. HTTPS only
6. Rate limiting op uploads
7. Rol-based access control

---

## 🌐 Deployment

### Optie 1: Vercel (Aanbevolen)

```bash
# 1. Install Vercel CLI
npm i -g vercel

# 2. Deploy
vercel

# 3. Set environment variables in Vercel dashboard
# Add: API_KEY=your-gemini-key
```

### Optie 2: Netlify

```bash
# 1. Build
npm run build

# 2. Drag & drop 'dist' folder naar Netlify
```

### Optie 3: Firebase Hosting

```bash
# 1. Install Firebase tools
npm install -g firebase-tools

# 2. Init
firebase init hosting

# 3. Build & Deploy
npm run build
firebase deploy
```

---

## 💾 Database Migratie (LocalStorage → Firebase)

### Setup Firebase

```bash
npm install firebase
```

### Config

```typescript
// firebase.config.ts
import { initializeApp } from 'firebase/app';
import { getStorage } from 'firebase/storage';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_AUTH_DOMAIN",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_STORAGE_BUCKET",
};

const app = initializeApp(firebaseConfig);
export const storage = getStorage(app);
export const db = getFirestore(app);
```

### Upload Flow

```typescript
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';

// In AdminPanel.tsx, replace localStorage with:
const uploadImage = async (file: File) => {
  const storageRef = ref(storage, `menu/${Date.now()}_${file.name}`);
  await uploadBytes(storageRef, file);
  const url = await getDownloadURL(storageRef);
  return url;
};
```

---

## 🐛 Troubleshooting

### Admin Panel niet zichtbaar?

- Check of je naar `/admin` of `/#admin` gaat
- Refresh de pagina
- Clear browser cache

### Foto's laden niet?

- Check bestandsgrootte (<5MB)
- Gebruik JPG/PNG format
- Check browser console voor errors

### AR werkt niet?

- Geef camera toegang in browser
- Test op HTTPS (niet HTTP)
- Gebruik moderne browser (Chrome/Safari)

### LocalStorage vol?

- Max ~5-10MB per domain
- Verwijder oude items
- Migreer naar Firebase voor meer ruimte

---

## 📈 Performance Tips

### Foto Optimalisatie

```bash
# Compress images before upload
npm install -g imagemagick
magick input.jpg -quality 85 -resize 1200x800 output.jpg
```

### Lazy Loading

```typescript
// Implementeer lazy loading voor menu foto's
<img loading="lazy" src={preset.image} alt={preset.name} />
```

---

## 🤝 Contributing

Dit is een demo project. Voor productie gebruik:

1. Fork het project
2. Implementeer Firebase/Supabase
3. Voeg authenticatie toe
4. Test extensief
5. Deploy met HTTPS

---

## 📄 License

Built with ❤️ using Google AI Studio

---

## 📞 Support & Contact

### Handleidingen

- 📖 [Admin Guide](./docs/guides/admin.md) - Voor restaurant eigenaren (indien beschikbaar)
- 📖 [Customer Guide](./docs/guides/customer.md) - Voor klanten
- 📖 [Quick Start](./QUICK_START.md) - Snelle start gids
- 📖 [Deployment Guide](./docs/deployment/index.md) - Deployment instructies
- 📖 [Security Guide](./docs/security.md) - Beveiligingsrichtlijnen

### Tech Stack Docs

- [React Documentation](https://react.dev)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Guide](https://vitejs.dev/guide/)
- [Google Gemini AI](https://ai.google.dev/gemini-api/docs)
- [TailwindCSS](https://tailwindcss.com/docs)

---

## 🎯 Use Cases

Perfect voor:

- 🍽️ **Restaurants** met QR-code menu's
- 🏪 **Food Courts** met digitale kiosks
- 🚀 **Cloud Kitchens** met alleen online ordering
- 📱 **Delivery Apps** met AR preview
- 🎓 **Trainings** voor keuken personeel
- 🎨 **Marketing** demos voor restaurant concepten

---

**Veel succes met je AR Restaurant Menu! 🎉**

View your app in AI Studio: <https://ai.studio/apps/drive/1h3sR9PR5-4iKpDnK4HyBivB6G8Oiz6Y->
