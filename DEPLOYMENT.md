# Deployment Guide - SushiVision AR

## 📦 GitHub Setup

### 1. Maak een GitHub Repository aan

1. Ga naar [GitHub.com](https://github.com) en log in
2. Klik op **"+"** → **"New repository"**
3. Vul in:
   - **Repository name**: `sushivision-ar` (of een andere naam)
   - **Description**: "Interactive Restaurant AR Menu with AI"
   - **Visibility**: Public of Private
   - ❌ **NIET** "Initialize with README" aanvinken
4. Klik **"Create repository"**

### 2. Push Code naar GitHub

```bash
# Voeg de remote repository toe (vervang USERNAME en REPO_NAME)
git remote add origin https://github.com/USERNAME/REPO_NAME.git

# Of met SSH (als je SSH keys hebt ingesteld):
# git remote add origin git@github.com:USERNAME/REPO_NAME.git

# Push naar GitHub
git branch -M main
git push -u origin main
```

**Let op**: Vervang `USERNAME` en `REPO_NAME` met jouw GitHub username en de repository naam die je hebt gekozen.

---

## 🚀 Vercel Deployment

### Optie 1: Via Vercel Dashboard (Aanbevolen)

1. **Ga naar [Vercel.com](https://vercel.com)** en log in met GitHub
2. Klik op **"Add New..."** → **"Project"**
3. **Import** je GitHub repository (`sushivision-ar`)
4. Vercel detecteert automatisch:
   - Framework: Vite
   - Build Command: `npm run build`
   - Output Directory: `dist`
5. **Environment Variables** toevoegen (als je Gemini AI gebruikt):
   - Klik op **"Environment Variables"**
   - Voeg toe:
     - **Name**: `GEMINI_API_KEY`
     - **Value**: Je Gemini API key
     - **Environment**: Production, Preview, Development (alle drie aanvinken)
6. Klik **"Deploy"**
7. Wacht tot deployment klaar is (~2-3 minuten)
8. Je krijgt een URL zoals: `https://sushivision-ar.vercel.app`

### Optie 2: Via Vercel CLI

```bash
# Installeer Vercel CLI (als je het nog niet hebt)
npm i -g vercel

# Login bij Vercel
vercel login

# Deploy (in de project directory)
cd /Users/innovarslabo/Desktop/sushivision-ar-4
vercel

# Volg de prompts:
# - Link to existing project? N (nieuw project)
# - Project name: sushivision-ar
# - Directory: ./
# - Override settings? N

# Voor productie deployment:
vercel --prod
```

### Environment Variables in Vercel

Als je Gemini AI gebruikt, voeg deze toe in Vercel Dashboard:

1. Ga naar je project in Vercel
2. **Settings** → **Environment Variables**
3. Voeg toe:
   - **GEMINI_API_KEY** = `jouw-api-key-hier`
   - Selecteer alle environments (Production, Preview, Development)

---

## ✅ Post-Deployment Checklist

- [ ] Test de app op de Vercel URL
- [ ] Controleer of AR functionaliteit werkt (vereist HTTPS)
- [ ] Test Admin Panel op `/admin` route
- [ ] Controleer of foto uploads werken
- [ ] Test op mobiel apparaat
- [ ] Voeg custom domain toe (optioneel) in Vercel Settings

---

## 🔧 Troubleshooting

### Build Fails?

- Check Vercel build logs voor errors
- Zorg dat alle dependencies in `package.json` staan
- Check of `vercel.json` correct is

### AR Werkt Niet?

- AR vereist **HTTPS** (Vercel geeft dit automatisch)
- Test camera toegang in browser
- Check browser console voor errors

### Environment Variables Niet Werken?

- Zorg dat variabelen zijn toegevoegd in Vercel Dashboard
- Herdeploy na het toevoegen van environment variables
- Check of variabele naam overeenkomt met code (`GEMINI_API_KEY`)

---

## 🔄 Continuous Deployment

Vercel deployt automatisch bij elke push naar GitHub:

1. Push naar `main` branch → Production deployment
2. Push naar andere branches → Preview deployment
3. Pull Requests → Preview deployment met unieke URL

---

## 📝 Custom Domain (Optioneel)

1. Ga naar Vercel Dashboard → Project → **Settings** → **Domains**
2. Voeg je custom domain toe (bijv. `sushivision.nl`)
3. Volg DNS instructies van Vercel
4. Wacht tot SSL certificaat is gegenereerd (~5 minuten)

---

**Veel succes met je deployment! 🎉**

