# 🎯 Model Selectie Gids

Deze gids legt uit hoe je de beste modellen kiest voor programmeren en debugging met LM Studio.

## 📋 Overzicht

Het systeem bestaat uit verschillende componenten:

1. **model-selector.ts** - Intelligente model selectie
2. **model-manager.ts** - Model beheer en configuratie
3. **huggingface-model-finder.ts** - Zoekt gratis modellen op Hugging Face
4. **model-config.json** - Configuratie bestand

## 🚀 Snel Starten

### 1. Installeer Dependencies

```bash
npm install
```

### 2. Zoek Gratis Modellen

```bash
# Gebruik het shell script
chmod +x find-free-models.sh
./find-free-models.sh

# Of gebruik TypeScript versie voor meer details
npx ts-node find-free-models.ts
```

Dit genereert een `FREE_MODELS_REPORT.md` met de beste gratis modellen.

### 3. Gebruik Model Selector

```typescript
import { selectBestModels } from './model-selector';

// Selecteer beste modellen
const selection = await selectBestModels();

console.log('Programmeer model:', selection.programmingModel?.name);
console.log('Debug model:', selection.debugModel?.name);
```

### 4. Gebruik Model Manager

```typescript
import { getModelManager } from './model-manager';

const manager = await getModelManager().initialize();

// Krijg model voor programmeren
const progModel = manager.getModelForTask('programming');

// Krijg model voor debugging
const debugModel = manager.getModelForTask('debug');

// Genereer prompt
const prompt = manager.generatePrompt('programming', 'Maak een React component');
```

## 🔧 Configuratie

### model-config.json

Het configuratie bestand bevat:

- **Hugging Face API token** - Voor het zoeken naar modellen
- **LM Studio configuratie** - Server URL en timeout
- **Geconfigureerde modellen** - Primaire en alternatieve modellen
- **Selectie strategie** - Criteria voor model selectie

### Aangepaste Modellen Toevoegen

Voeg modellen toe aan `model-config.json`:

```json
{
  "configured_models": {
    "programming": {
      "primary": {
        "id": "jouw-model-id",
        "name": "Jouw Model Naam",
        "file": "model-bestand.gguf",
        "hf_repo": "organisatie/model-naam",
        "size_gb": 10,
        "priority": 1
      }
    }
  }
}
```

## 📊 Geconfigureerde Modellen

### Programmeer Modellen

1. **Qwen2.5-Coder-32B-Instruct** (Primair)
   - Bestand: `Qwen2.5-Coder-32B-Instruct-Q4_K_M.gguf`
   - Grootte: 18GB
   - Gebruik: Primaire code generatie, complexe features

2. **DeepSeek-Coder-6.7B-Instruct** (Alternatief)
   - Bestand: `Q5_K_M.gguf`
   - Grootte: 4.5GB
   - Gebruik: Lichter alternatief

3. **CodeLlama-13B-Instruct** (Alternatief)
   - Bestand: `Q5_K_M.gguf`
   - Grootte: 7.5GB
   - Gebruik: Betrouwbaar code model

### Debug Modellen

1. **Phi-3.5-mini-instruct** (Primair)
   - Bestand: `Phi-3.5-mini-instruct-Q8_0.gguf`
   - Grootte: 4GB
   - Gebruik: Snelle debugging, code uitleg

2. **Mistral-7B-Instruct-v0.2** (Alternatief)
   - Bestand: `Q5_K_M.gguf`
   - Grootte: 4.5GB
   - Gebruik: Goede balans

3. **Phi-3-mini-instruct** (Alternatief)
   - Bestand: `Q8_0.gguf`
   - Grootte: 2.5GB
   - Gebruik: Zeer snel

## 🔍 Modellen Zoeken

### Via Hugging Face API

Het systeem gebruikt de Hugging Face API om gratis modellen te vinden:

```typescript
import { 
  findBestFreeProgrammingModels,
  findBestFreeDebugModels 
} from './huggingface-model-finder';

// Zoek beste programmeer modellen
const progModels = await findBestFreeProgrammingModels();

// Zoek beste debug modellen
const debugModels = await findBestFreeDebugModels();
```

### Criteria voor Model Selectie

Het systeem beoordeelt modellen op:

- **Downloads** - Populariteit
- **Likes** - Community waardering
- **Beschikbare bestanden** - Aantal GGUF bestanden
- **Quantisatie** - Kwaliteit van quantisatie (Q4, Q5, Q8)
- **Tags** - Code/instruct tags

## 💡 Gebruik Tips

### Automatische Selectie

Het systeem selecteert automatisch het beste model:

```typescript
const manager = getModelManager();
await manager.initialize();

// Gebruik voor programmeren
const progModel = manager.getModelForTask('programming');

// Gebruik voor debugging
const debugModel = manager.getModelForTask('debug');
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

Het systeem genereert automatisch prompts:

```typescript
const prompt = manager.generatePrompt(
  'programming',
  'Maak een login component'
);
```

Dit voegt automatisch system prompts toe die zijn afgestemd op het model.

## 🐛 Troubleshooting

### LM Studio Server Niet Actief

```bash
# Check of server draait
curl http://localhost:1234/v1/models

# Start LM Studio server:
# 1. Open LM Studio
# 2. Ga naar "Local Server" tab
# 3. Selecteer model
# 4. Klik "Start Server"
```

### Model Niet Gevonden

Als een model niet wordt gevonden:

1. Check of model gedownload is in LM Studio
2. Check of model naam overeenkomt in config
3. Gebruik `find-free-models.ts` om alternatieven te vinden

### Hugging Face API Fouten

Als de API fouten geeft:

1. Check of API token geldig is
2. Check internet verbinding
3. Check of model niet gated is (vereist goedkeuring)

## 📚 Meer Informatie

- [LM Studio Setup Guide](./lm-studio-setup.md)
- [Model Configuratie](./model-config.json)
- [Hugging Face Model Finder](./huggingface-model-finder.ts)

