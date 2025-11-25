# 🔧 Cursor Setup - API Key Configuratie

## API Key Instellen in Cursor

De Gemini API key kan op **3 manieren** worden ingesteld:

### Optie 1: Via Cursor Environment Variables (Aanbevolen)

1. **Open Cursor Settings**
   - Druk op `Cmd + ,` (Mac) of `Ctrl + ,` (Windows/Linux)
   - Of ga naar: `Cursor` → `Settings` → `Features` → `Environment Variables`

2. **Voeg Environment Variable toe**
   - Klik op "Add Environment Variable"
   - **Name**: `VITE_GEMINI_API_KEY`
   - **Value**: Je Gemini API key (haal op via https://aistudio.google.com/apikey)

3. **Herstart Cursor** (of herlaad de window)
   - Druk op `Cmd + Shift + P` → "Developer: Reload Window"

### Optie 2: Via .env Bestand

1. **Maak een `.env` bestand** in de root directory:
   ```bash
   touch .env
   ```

2. **Voeg toe aan `.env`**:
   ```
   VITE_GEMINI_API_KEY=jouw-gemini-api-key-hier
   ```

3. **Herstart de dev server**:
   ```bash
   npm run dev
   ```

### Optie 3: Via Developer Settings in de App

1. **Start de app**:
   ```bash
   npm run dev
   ```

2. **Ga naar Developer Settings**:
   - Navigeer naar: `http://localhost:3000/developer`
   - Of gebruik de developer route in de app

3. **Voer API key in**:
   - Vul je Gemini API key in het veld "AI API Key"
   - Klik op "Save Settings"
   - De key wordt opgeslagen in localStorage

## ✅ Verificatie

Na het instellen van de API key, test of het werkt:

1. Start de app: `npm run dev`
2. Ga naar het menu
3. Maak een custom gerecht
4. Klik op "Generate" - dit zou nu moeten werken zonder de "ERROR_BAD_USER_API_KEY" fout

## 🔑 Gemini API Key Aanmaken

Als je nog geen API key hebt:

1. Ga naar: https://aistudio.google.com/apikey
2. Log in met je Google account
3. Klik op "Create API Key"
4. Kopieer de key en gebruik deze in een van de bovenstaande opties

## ⚠️ Belangrijk

- **Gebruik Optie 1 (Cursor Environment Variables)** voor de beste ervaring
- De `.env` file staat in `.gitignore` en wordt niet gecommit
- De API key in Developer Settings wordt opgeslagen in localStorage (alleen lokaal)

## 🐛 Troubleshooting

### "ERROR_BAD_USER_API_KEY" blijft verschijnen

1. Check of de environment variable correct is ingesteld:
   ```bash
   echo $VITE_GEMINI_API_KEY
   ```

2. Herstart Cursor volledig

3. Herstart de dev server:
   ```bash
   # Stop de server (Ctrl+C)
   npm run dev
   ```

4. Check de browser console voor errors

### API key werkt niet

- Zorg dat de key begint met `AIza...` (Gemini API keys beginnen altijd zo)
- Check of de key niet is verlopen
- Verifieer dat je de juiste key hebt gekopieerd (geen extra spaties)

## 📝 Notities

- De app gebruikt eerst de API key uit de store (Developer Settings)
- Als die niet bestaat, valt het terug op `VITE_GEMINI_API_KEY` environment variable
- Dit geeft flexibiliteit: developers kunnen hun eigen key gebruiken zonder de .env te delen

