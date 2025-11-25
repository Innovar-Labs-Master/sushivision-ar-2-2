# 📁 Organisatieplan voor SushiVision AR Project

## 🔍 Gevonden Dubbele/Gerelateerde Bestanden

### 1. LM Studio Scripts (3 gerelateerde scripts)
- `download-models-direct.sh` - Download modellen direct
- `find-models-lm-studio.sh` - Zoek modellen in LM Studio
- `check-lm-studio.sh` - Check LM Studio status

**Actie**: Verplaatsen naar `scripts/lm-studio/`

### 2. Python Extensie Scripts (2 gerelateerde scripts)
- `fix-python-extension.sh` - Diagnose Python extensie problemen
- `install-python-extension.sh` - Installeer Python extensie handmatig

**Actie**: Verplaatsen naar `scripts/cursor/`

### 3. LM Studio Documentatie (2 gerelateerde docs)
- `lm-studio-setup.md` - Setup instructies
- `lm-studio-zoek-gids.md` - Zoekgids voor modellen

**Actie**: Verplaatsen naar `docs/setup/lm-studio/`

### 4. Python Extensie Documentatie
- `PYTHON_EXTENSION_FIX.md` - Fix instructies

**Actie**: Verplaatsen naar `docs/setup/cursor/`

### 5. Config Bestanden (verspreid)
- `api-config.json` - API configuratie
- `lm-studio-cursor-config.json` - LM Studio/Cursor config
- `metadata.json` - Project metadata
- `vercel.json` - Vercel deployment config

**Actie**: 
- `api-config.json` → `config/api.json`
- `lm-studio-cursor-config.json` → `config/lm-studio.json`
- `metadata.json` → Blijft in root (voor PWA)
- `vercel.json` → Blijft in root (voor Vercel)

### 6. Vreemd Genoemd Bestand
- `ac4b23f44d81b28695713175e51d431754fe58ecb0d516235690ec7f94097d4a.png kopie.png`

**Actie**: Verplaatsen naar `assets/images/temp/` of verwijderen als niet nodig

### 7. Documentatie Bestanden (veel in root)
- `CURSOR_SETUP.md` → `docs/setup/cursor/`
- `CUSTOMER_GUIDE.md` → `docs/guides/customer.md`
- `DEPLOYMENT.md` → `docs/deployment/`
- `QUICK_START.md` → `docs/quick-start.md` (blijft in root als belangrijk)
- `README.md` → Blijft in root
- `SECURITY.md` → `docs/security.md`

---

## 📂 Voorgestelde Nieuwe Structuur

```
sushivision-ar-2-2/
├── 📄 README.md (blijft)
├── 📄 QUICK_START.md (blijft - belangrijk voor nieuwe gebruikers)
├── 📄 package.json (blijft)
├── 📄 tsconfig.json (blijft)
├── 📄 vite.config.ts (blijft)
├── 📄 vercel.json (blijft - Vercel vereist root)
├── 📄 metadata.json (blijft - PWA vereist root)
│
├── 📁 config/                    # NIEUW: Alle configuratie bestanden
│   ├── api.json                  # (was api-config.json)
│   └── lm-studio.json            # (was lm-studio-cursor-config.json)
│
├── 📁 scripts/                   # NIEUW: Alle shell scripts
│   ├── lm-studio/
│   │   ├── download-models-direct.sh
│   │   ├── find-models-lm-studio.sh
│   │   └── check-lm-studio.sh
│   └── cursor/
│       ├── fix-python-extension.sh
│       └── install-python-extension.sh
│
├── 📁 docs/                      # NIEUW: Alle documentatie
│   ├── setup/
│   │   ├── lm-studio/
│   │   │   ├── setup.md          # (was lm-studio-setup.md)
│   │   │   └── zoek-gids.md      # (was lm-studio-zoek-gids.md)
│   │   └── cursor/
│   │       ├── setup.md           # (was CURSOR_SETUP.md)
│   │       └── python-extension.md # (was PYTHON_EXTENSION_FIX.md)
│   ├── guides/
│   │   └── customer.md            # (was CUSTOMER_GUIDE.md)
│   ├── deployment/
│   │   └── index.md               # (was DEPLOYMENT.md)
│   └── security.md               # (was SECURITY.md)
│
├── 📁 assets/                    # NIEUW: Statische assets
│   └── images/
│       ├── temp/                 # Voor tijdelijke/test bestanden
│       │   └── [vreemd PNG bestand hier]
│       └── [andere images]
│
├── 📁 components/                # (blijft zoals het is)
├── 📁 services/                  # (blijft zoals het is)
├── 📁 store/                     # (blijft zoals het is)
├── 📁 server/                    # (blijft zoals het is)
└── 📁 public/                    # (blijft zoals het is)
```

---

## ✅ Uitvoeringsplan

### Fase 1: Mappen Aanmaken
1. Maak `config/` map
2. Maak `scripts/lm-studio/` map
3. Maak `scripts/cursor/` map
4. Maak `docs/setup/lm-studio/` map
5. Maak `docs/setup/cursor/` map
6. Maak `docs/guides/` map
7. Maak `docs/deployment/` map
8. Maak `assets/images/temp/` map

### Fase 2: Bestanden Verplaatsen
1. Verplaats config bestanden
2. Verplaats scripts
3. Verplaats documentatie
4. Verplaats vreemd PNG bestand

### Fase 3: Referenties Updaten
1. Update README.md met nieuwe paden
2. Update package.json scripts indien nodig
3. Update imports/references in code
4. Update .gitignore indien nodig

### Fase 4: Verificatie
1. Test of alle scripts nog werken
2. Test of documentatie links werken
3. Controleer of build nog werkt

---

## 🎯 Voordelen van Deze Organisatie

1. **Duidelijke structuur**: Alles heeft een logische plek
2. **Makkelijk te vinden**: Scripts, docs en config zijn gegroepeerd
3. **Schaalbaar**: Makkelijk nieuwe bestanden toe te voegen
4. **Professioneel**: Ziet er georganiseerd uit
5. **Minder rommel**: Root directory is schoner

---

## ⚠️ Belangrijke Opmerkingen

- **Niet verplaatsen**: `package.json`, `tsconfig.json`, `vite.config.ts`, `vercel.json`, `metadata.json` moeten in root blijven
- **Scripts updaten**: Na verplaatsen moeten script paden mogelijk geüpdatet worden
- **Documentatie links**: Links in README en andere docs moeten geüpdatet worden
- **Git history**: Bestanden verplaatsen behoudt Git history (met `git mv`)

---

## 📝 Volgende Stappen

Wil je dat ik:
1. ✅ De nieuwe mappenstructuur aanmaak?
2. ✅ Alle bestanden verplaats?
3. ✅ Referenties en links update?
4. ✅ Een samenvatting geef van wat er veranderd is?

Laat weten of je akkoord gaat met dit plan of aanpassingen wilt!

