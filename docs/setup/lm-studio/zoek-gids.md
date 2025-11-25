# 🔍 LM Studio Model Zoek Gids - Stap voor Stap

## Probleem: Modellen niet gevonden in LM Studio

Als je de modellen niet ziet, volg deze stappen:

---

## 📋 Stap 1: Open LM Studio Correct

1. **Start LM Studio applicatie** (niet de website, de desktop app)
2. **Ga naar het "Search" tabblad** (vergrootglas icoon links in de sidebar)
3. **Zorg dat je op de juiste tab bent**: Je moet "Search" zien, niet "Chat" of "Local Server"

---

## 🔍 Stap 2: Zoek de Modellen (Alternatieve Zoektermen)

Als de exacte namen niet werken, probeer deze zoektermen:

### Model 1: Qwen Coder (Primaire Code Model)

**Probeer deze zoektermen (één voor één):**
- `Qwen2.5-Coder` (zonder Instruct)
- `Qwen Coder` 
- `Qwen2.5` (algemeen, dan filter op Coder)
- `Coder-32B` (algemeen)
- `Qwen 32B`

**Als je het vindt:**
- Kies een versie met **32B** in de naam
- Download bestand: `Q5_K_M.gguf` of `Q4_K_M.gguf` of `Q6_K.gguf`

**Alternatief als 32B niet bestaat:**
- `Qwen2.5-Coder-14B-Instruct` (kleiner, maar nog steeds goed)
- `Qwen2.5-Coder-7B-Instruct` (nog kleiner, sneller)

### Model 2: DeepSeek (Redeneer Expert)

**Probeer deze zoektermen:**
- `DeepSeek-R1` (kortere naam)
- `DeepSeek R1` (met spatie)
- `DeepSeek Distill` (zonder Llama)
- `DeepSeek 70B` (algemeen)
- Alleen `DeepSeek` (dan filter op R1 of 70B)

**Als je het vindt:**
- Kies een versie met **70B** of **R1** in de naam
- Download bestand: `Q4_K_M.gguf` of `Q3_K_M.gguf`

**Alternatief als 70B niet bestaat:**
- `DeepSeek-R1-Distill-Llama-8B` (kleiner, past beter in RAM)
- `DeepSeek-Coder-33B` (andere variant)
- `DeepSeek-Coder-6.7B` (veel kleiner, sneller)

### Model 3: Phi-3.5 Mini (Snelheidsduivel)

**Probeer deze zoektermen:**
- `Phi-3.5-mini` (zonder instruct)
- `Phi 3.5` (met spatie)
- `Phi3.5` (zonder streepjes)
- `Microsoft Phi` (algemeen)
- Alleen `Phi` (dan filter op 3.5)

**Als je het vindt:**
- Kies een versie met **3.5** en **mini** in de naam
- Download bestand: `Q8_0.gguf` of `Q6_K.gguf`

**Alternatief als 3.5 niet bestaat:**
- `Phi-3-mini-instruct` (ouder, maar nog steeds goed)
- `Phi-3-medium-instruct` (iets groter)

---

## 🎯 Stap 3: Als Je Nog Steeds Niets Vindt

### Optie A: Gebruik "Browse" in plaats van "Search"

1. In LM Studio, klik op **"Browse"** tab (naast Search)
2. Blader door populaire modellen
3. Zoek naar modellen met tags: `code`, `coding`, `programming`, `instruct`

### Optie B: Filter op Model Type

1. In de zoekbalk, gebruik filters:
   - **Type**: `Instruct` (niet Base of Chat)
   - **Size**: `7B-32B` (voor jouw RAM)
   - **Tags**: `coding`, `code`, `programming`

### Optie C: Gebruik Alternatieve Modellen

Als de originele modellen echt niet bestaan, gebruik deze alternatieven:

#### Alternatief Set 1 (Goed voor Code):
1. **CodeLlama-13B-Instruct**
   - Zoek: `CodeLlama 13B`
   - Bestand: `Q5_K_M.gguf`

2. **StarCoder2-15B-Instruct**
   - Zoek: `StarCoder2 15B`
   - Bestand: `Q5_K_M.gguf`

3. **Phi-3-mini-instruct**
   - Zoek: `Phi-3-mini`
   - Bestand: `Q8_0.gguf`

#### Alternatief Set 2 (Beste Kwaliteit):
1. **Mixtral-8x7B-Instruct**
   - Zoek: `Mixtral 8x7B`
   - Bestand: `Q4_K_M.gguf`

2. **Llama-3.1-70B-Instruct**
   - Zoek: `Llama 3.1 70B`
   - Bestand: `Q4_K_M.gguf`

3. **Phi-3.5-mini-instruct**
   - Zoek: `Phi-3.5-mini`
   - Bestand: `Q8_0.gguf`

---

## 📥 Stap 4: Download Proces

Wanneer je een model vindt:

1. **Klik op het model** (niet op de download knop direct)
2. **Scroll naar beneden** naar "Available Files"
3. **Kies het juiste bestand**:
   - Voor grote modellen (32B+): `Q4_K_M.gguf` of `Q5_K_M.gguf`
   - Voor medium modellen (7B-15B): `Q5_K_M.gguf` of `Q6_K.gguf`
   - Voor kleine modellen (<7B): `Q8_0.gguf` (maximale kwaliteit)
4. **Klik "Download"**
5. **Wacht tot download klaar is** (kan lang duren voor grote modellen)

---

## ✅ Stap 5: Verifieer Download

Na download:

1. Ga naar **"Local Models"** tab in LM Studio
2. Je zou je gedownloade modellen moeten zien
3. Run het verificatie script:
   ```bash
   cd /Users/innovarslabo/Desktop/sushivision-ar-2-2
   python3 setup-lm-studio-models.py
   ```

---

## 🆘 Nog Steeds Problemen?

### Check 1: LM Studio Versie
- Update LM Studio naar de nieuwste versie
- Oudere versies hebben soms andere model databases

### Check 2: Internet Connectie
- Zorg dat je internet verbinding hebt
- LM Studio haalt model lijsten online op

### Check 3: Model Database
- In LM Studio: Settings → Check "Model Database" status
- Probeer "Refresh Model List" of "Reload Models"

### Check 4: Screenshot
Als je een screenshot maakt van wat je ziet in LM Studio, kan ik je precies vertellen waar je moet kijken!

---

## 💡 Quick Reference: Beste Modellen voor 36GB RAM

| Model Naam | Zoekterm | Grootte | Bestand Type |
|------------|----------|---------|--------------|
| Qwen2.5-Coder-32B | `Qwen Coder 32B` | ~18GB | Q5_K_M |
| DeepSeek-R1-70B | `DeepSeek R1 70B` | ~35GB | Q4_K_M |
| Phi-3.5-mini | `Phi-3.5-mini` | ~4GB | Q8_0 |
| **ALTERNATIEF** | | | |
| CodeLlama-13B | `CodeLlama 13B` | ~7GB | Q5_K_M |
| Mixtral-8x7B | `Mixtral 8x7B` | ~24GB | Q4_K_M |
| StarCoder2-15B | `StarCoder2 15B` | ~9GB | Q5_K_M |

---

**Tip**: Begin met het kleinste model (Phi-3.5-mini) om te testen of alles werkt, dan download je de grotere modellen!

