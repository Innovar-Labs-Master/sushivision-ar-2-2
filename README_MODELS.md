# 🤖 Model Selectie Systeem

Intelligent model selectie systeem voor LM Studio dat automatisch de beste modellen kiest voor programmeren en debugging.

## 📁 Bestanden Overzicht

### Core Bestanden

- **`model-selector.ts`** - Intelligente model selectie logica
- **`model-manager.ts`** - Model beheer en configuratie
- **`huggingface-model-finder.ts`** - Zoekt gratis modellen op Hugging Face
- **`model-config.json`** - Configuratie bestand met alle model instellingen

### Scripts

- **`find-free-models.ts`** - TypeScript script om gratis modellen te vinden
- **`scripts/lm-studio/find-models-lm-studio.sh`** - Shell script voor snelle model zoekopdracht
- **`find-free-models.sh`** - Shell script voor gratis modellen (in root)
- **`example-usage.ts`** - Voorbeelden van hoe je het systeem gebruikt

### Documentatie

- **`MODEL_SELECTION_GUIDE.md`** - Uitgebreide gebruikersgids
- **`README_MODELS.md`** - Dit bestand (overzicht)

## 🚀 Snel Starten

### 1. Zoek Gratis Modellen

```bash
# Via npm script
npm run models:find

# Of direct
npx ts-node find-free-models.ts

# Of shell script
npm run models:search
```

Dit genereert een `FREE_MODELS_REPORT.md` met de beste gratis modellen.

### 2. Test Model Selectie

```bash
npm run models:example
```

### 3. Gebruik in Code

```typescript
import { getModelManager } from './model-manager';

const manager = getModelManager();
await manager.initialize();

// Krijg model voor programmeren
const progModel = manager.getModelForTask('programming');

// Krijg model voor debugging  
const debugModel = manager.getModelForTask('debug');
```

## 🎯 Geconfigureerde Modellen

### Programmeer Modellen

1. **Qwen2.5-Coder-32B-Instruct** ⭐ (Primair)
   - Bestand: `Qwen2.5-Coder-32B-Instruct-Q4_K_M.gguf`
   - Grootte: 18GB
   - Hugging Face: `Qwen/Qwen2.5-Coder-32B-Instruct`

2. **DeepSeek-Coder-6.7B-Instruct** (Alternatief)
   - Bestand: `Q5_K_M.gguf`
   - Grootte: 4.5GB

3. **CodeLlama-13B-Instruct** (Alternatief)
   - Bestand: `Q5_K_M.gguf`
   - Grootte: 7.5GB

### Debug Modellen

1. **Phi-3.5-mini-instruct** ⭐ (Primair)
   - Bestand: `Phi-3.5-mini-instruct-Q8_0.gguf`
   - Grootte: 4GB
   - Hugging Face: `microsoft/Phi-3.5-mini-instruct`

2. **Mistral-7B-Instruct-v0.2** (Alternatief)
   - Bestand: `Q5_K_M.gguf`
   - Grootte: 4.5GB

3. **Phi-3-mini-instruct** (Alternatief)
   - Bestand: `Q8_0.gguf`
   - Grootte: 2.5GB

## 🔧 Configuratie

### Hugging Face API Token

Het token is al geconfigureerd in `model-config.json`:
```json
{
  "huggingface": {
    "api_token": "${HF_API_TOKEN}"
  }
}
```

**Let op**: Vervang `${HF_API_TOKEN}` met je eigen Hugging Face token of gebruik een `.env` bestand.

### LM Studio Server

Zorg dat LM Studio server draait op:
```
http://localhost:1234/v1
```

## 📊 Model Selectie Strategie

Het systeem selecteert modellen op basis van:

1. **Beschikbaarheid** - Is het model gedownload in LM Studio?
2. **Priority** - Prioriteit in configuratie
3. **Type** - Programming vs Debug
4. **Kwaliteit** - Snelheid en kwaliteit score

## 💡 Gebruik Tips

### Automatische Selectie

Het systeem kiest automatisch het beste model:

```typescript
const manager = getModelManager();
await manager.initialize();
const model = manager.getModelForTask('programming');
```

### Handmatige Selectie

Je kunt ook handmatig modellen kiezen:

```typescript
manager.updateConfig({
  preferredProgrammingModel: 'qwen2.5-coder-32b',
  preferredDebugModel: 'phi-3.5-mini',
  autoSelect: false
});
```

### Prompt Generatie

Automatische prompt generatie met system prompts:

```typescript
const prompt = manager.generatePrompt(
  'programming',
  'Maak een React component'
);
```

## 🔍 Modellen Zoeken

### Via Hugging Face

Het systeem zoekt automatisch naar gratis modellen:

```typescript
import { findBestFreeProgrammingModels } from './huggingface-model-finder';

const models = await findBestFreeProgrammingModels();
```

### Criteria

Modellen worden beoordeeld op:
- Downloads (populariteit)
- Likes (community waardering)
- Beschikbare GGUF bestanden
- Quantisatie kwaliteit (Q4, Q5, Q8)
- Code/instruct tags

## 🐛 Troubleshooting

### LM Studio Server Niet Actief

```bash
# Check server
curl http://localhost:1234/v1/models

# Start in LM Studio:
# 1. Open LM Studio
# 2. Ga naar "Local Server"
# 3. Selecteer model
# 4. Klik "Start Server"
```

### Model Niet Gevonden

1. Check of model gedownload is
2. Check model naam in config
3. Run `npm run models:find` voor alternatieven

### API Fouten

1. Check API token in `model-config.json`
2. Check internet verbinding
3. Check of model niet gated is

## 📚 Meer Informatie

- [Model Selection Guide](./MODEL_SELECTION_GUIDE.md) - Uitgebreide gids
- [LM Studio Setup](./docs/setup/lm-studio/setup.md) - LM Studio installatie
- [LM Studio Zoek Gids](./docs/setup/lm-studio/zoek-gids.md) - Model zoekgids
- [Model Config](./model-config.json) - Configuratie bestand

## 🎉 Klaar!

Je hebt nu een volledig werkend model selectie systeem! 

Start met:
```bash
npm run models:find
```

En bekijk de resultaten in `FREE_MODELS_REPORT.md`.

