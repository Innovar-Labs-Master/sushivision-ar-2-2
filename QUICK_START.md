# 🚀 Quick Start - Restaurant Eigenaar

## In 5 Minuten Live

### ⚡ Stap 1: Start de App (1 min)

```bash
npm install
npm run dev
```

App draait op: `http://localhost:5173`

---

### 🔒 Stap 2: Open Admin Panel (30 sec)

Ga naar: `http://localhost:5173/admin`

---

### 📸 Stap 3: Voeg Eerste Gerecht Toe (2 min)

1. ✅ Klik **"Nieuw Gerecht Toevoegen"**
2. ✅ Upload een foto (klik op gestippeld vlak)
3. ✅ Vul in:
   - **Naam**: "Spicy Tuna Roll"
   - **Beschrijving**: "Verse tonijn met wasabi mayo"
   - **Prijs**: 12.50
4. ✅ Klik **"Toevoegen"**
5. ✅ Klik **"Opslaan"** (rechtsboven)

---

### 👁️ Stap 4: Test Preview (1 min)

1. ✅ Klik **"Preview Modus"**
2. ✅ Zie hoe klanten het zien
3. ✅ Test door op item te klikken → AR opent!

---

### 🎉 Klaar

**Klant URL**: `http://localhost:5173`
**Admin URL**: `http://localhost:5173/admin`

---

## 📝 Cheat Sheet

### Admin Panel Shortcuts

| Actie | Knop |
|-------|------|
| Item toevoegen | Gele knop "Nieuw Gerecht Toevoegen" |
| Preview klant view | Blauwe knop "Preview Modus" |
| Opslaan | Groene knop "Opslaan" rechtsboven |
| Item verwijderen | Rode "Verwijder" knop bij elk item |

### Foto Requirements

- ✅ JPG of PNG
- ✅ Max 5MB
- ✅ Min 800x600px aanbevolen
- ✅ 45° hoek van bovenaf = best

### Best Practices

1. 📸 Maak **professionele foto's** met goede belichting
2. 📝 Schrijf **appetijelijke beschrijvingen** (kort!)
3. 💰 Gebruik **realistische prijzen**
4. 💾 **Sla regelmatig op** (groene knop)
5. 👁️ Test in **Preview Modus** voor live

---

## ⚠️ Belangrijk

### LocalStorage Limiet

- Max ~20-50 items met foto's
- Data verdwijnt bij cache clear
- **Voor productie**: Migreer naar Firebase!

### URL Delen

- **Klanten**: Deel `jouw-site.com`
- **Admin**: NIET delen! (geen wachtwoord)

---

## 🆘 Problemen?

### "Menu niet opgeslagen"

→ Klik groene "Opslaan" knop!

### "Foto te groot"

→ Gebruik tool om te comprimeren (<5MB)

### "Items verdwenen"

→ LocalStorage cleared. Upload opnieuw.
→ **Tip**: Maak screenshots als backup!

---

## 🚀 Productie Klaar Maken?

### Checklist

- [ ] Firebase account aanmaken
- [ ] Database opzetten
- [ ] Cloud storage configureren
- [ ] Login systeem toevoegen
- [ ] Domain kopen en koppelen
- [ ] SSL/HTTPS activeren
- [ ] Test alles op mobiel

**Need help?** Check `ADMIN_GUIDE.md` of `README.md`

---

**Support**: Zie volledige handleidingen in projectmap

- 📖 [Admin Guide](./docs/guides/admin.md) - Uitgebreide admin handleiding (indien beschikbaar)
- 📖 [Customer Guide](./docs/guides/customer.md) - Klant instructies
- 📖 [README.md](./README.md) - Technische documentatie
- 📖 [Deployment Guide](./docs/deployment/index.md) - Deployment instructies

---

**Nu live: Klanten kunnen AR menu gebruiken! 🎉**
