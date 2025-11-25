# 🚀 LM Studio Setup voor M4 MacBook Pro (36GB RAM)

## 📥 Te Downloaden Modellen (in LM Studio)

Met 36GB RAM kun je de **beste** modellen draaien! Hier zijn de 3 aanbevolen modellen:

### 1. **Qwen2.5-Coder-32B-Instruct** (Primaire Model)
- **Zoekterm in LM Studio**: `Qwen2.5-Coder-32B-Instruct`
- **Bestand**: `Q4_K_M.gguf` of `Q5_K_M.gguf` (beste balans)
- **Grootte**: ~18-20GB
- **Gebruik**: Dagelijkse code generatie, complexe debugging
- **Waarom**: Beste open-source code model, bijna GPT-4 niveau

### 2. **DeepSeek-R1-Distill-Llama-70B** (Redeneer Expert)
- **Zoekterm**: `DeepSeek-R1-Distill-Llama-70B`
- **Bestand**: `Q4_K_M.gguf` of `Q3_K_M.gguf` (voor snelheid)
- **Grootte**: ~35-40GB (past perfect in 36GB!)
- **Gebruik**: Complexe bugs, logica problemen
- **Waarom**: Meester in redeneren en debugging

### 3. **Phi-3.5-mini-instruct** (Snelheidsduivel)
- **Zoekterm**: `Phi-3.5-mini-instruct`
- **Bestand**: `Q8_0.gguf` (maximale kwaliteit, model is klein)
- **Grootte**: ~3-4GB
- **Gebruik**: Snelle vragen, code uitleg
- **Waarom**: Extreem snel, verrassend slim

---

## 📋 Stap-voor-Stap Download Instructies

### Stap 1: Open LM Studio
1. Start de LM Studio applicatie
2. Ga naar het **"Search"** tabblad (vergrootglas icoon links)

### Stap 2: Download Model 1 - Qwen2.5-Coder-32B
1. Typ in de zoekbalk: `Qwen2.5-Coder-32B-Instruct`
2. Klik op het model (meestal van `Qwen` organisatie)
3. Scroll naar beneden naar **"Available Files"**
4. Kies: **`Q5_K_M.gguf`** (beste balans kwaliteit/snelheid)
5. Klik op **"Download"**
6. Wacht tot download klaar is (~20GB, kan even duren)

### Stap 3: Download Model 2 - DeepSeek-R1-70B
1. Typ in zoekbalk: `DeepSeek-R1-Distill-Llama-70B`
2. Klik op het model
3. Kies: **`Q4_K_M.gguf`** (voor 36GB RAM perfect)
4. Klik **"Download"**
5. Wacht tot download klaar is (~35GB)

### Stap 4: Download Model 3 - Phi-3.5-mini
1. Typ in zoekbalk: `Phi-3.5-mini-instruct`
2. Klik op het model
3. Kies: **`Q8_0.gguf`** (maximale kwaliteit)
4. Klik **"Download"**
5. Wacht tot download klaar is (~4GB, snel!)

---

## ⚙️ LM Studio Server Starten

### Stap 1: Start de Server
1. Ga naar **"Local Server"** tabblad (of "Developer" tab)
2. Selecteer bovenaan één van de gedownloade modellen (bijv. Qwen)
3. Zet **"CORS"** aan (vinkje)
4. Klik op **"Start Server"** (groene knop)
5. Noteer de URL: `http://localhost:1234`

### Stap 2: Test de Server
Open terminal en test:
```bash
curl http://localhost:1234/v1/models
```

Je zou een JSON response moeten zien met je modellen.

---

## 🔗 Cursor Koppelen

### Stap 1: Cursor Settings
1. Open Cursor
2. Druk op `Cmd + ,` (Settings)
3. Ga naar **"Features"** → **"Models"** (of zoek naar "Models")

### Stap 2: Configureer LM Studio
1. Zoek naar **"OpenAI API Base URL"** of **"Override OpenAI Base URL"**
2. Voer in: `http://localhost:1234/v1`
3. Zet de schakelaar **AAN**

### Stap 3: Voeg Model Toe
1. Klik op **"+ Add Model"** of **"Add Custom Model"**
2. Voer model naam in: `qwen-32b-coder` (of gewoon `local-model`)
3. Sla op

### Stap 4: Gebruik in Chat
1. Open Cursor Chat (`Cmd + L`)
2. Klik op model dropdown (waar normaal "claude" staat)
3. Selecteer je lokale model
4. Start chatten! 🎉

---

## 🎯 Model Selectie Strategie

- **Qwen 32B**: Gebruik voor complexe code, nieuwe features, debugging
- **DeepSeek 70B**: Gebruik voor moeilijke bugs, logica problemen
- **Phi-3.5 Mini**: Gebruik voor snelle vragen, code uitleg, kleine fixes

---

## ⚡ Performance Tips voor M4

1. **Gebruik Metal Acceleration**: LM Studio gebruikt automatisch Metal op M4
2. **Context Window**: Zet op 4096-8192 tokens voor beste performance
3. **Temperature**: 0.2-0.7 voor code (lager = meer deterministisch)
4. **Threads**: Laat op auto (M4 optimaliseert zelf)

---

## 🐛 Troubleshooting

### Server start niet?
- Check of LM Studio draait
- Check of poort 1234 vrij is: `lsof -i :1234`
- Herstart LM Studio

### Model laadt niet?
- Check of je genoeg RAM hebt (36GB is genoeg voor alle 3)
- Sluit andere apps die veel RAM gebruiken
- Probeer een lagere quantisatie (Q3 in plaats van Q5)

### Cursor ziet model niet?
- Check of server draait: `curl http://localhost:1234/v1/models`
- Check Cursor settings: Base URL moet `http://localhost:1234/v1` zijn
- Herstart Cursor

---

## 📊 Model Vergelijking

| Model | Grootte | Snelheid | Kwaliteit | Best Voor |
|-------|---------|----------|-----------|------------|
| Qwen 32B | 18GB | ⭐⭐⭐ | ⭐⭐⭐⭐⭐ | Algemene code |
| DeepSeek 70B | 35GB | ⭐⭐ | ⭐⭐⭐⭐⭐ | Complexe bugs |
| Phi-3.5 Mini | 4GB | ⭐⭐⭐⭐⭐ | ⭐⭐⭐⭐ | Snelle vragen |

---

**Veel succes met je lokale AI setup! 🚀**

