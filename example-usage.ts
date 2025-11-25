/**
 * Voorbeeld gebruik van Model Selector en Manager
 */

import { selectBestModels, getModelPrompt } from './model-selector';
import { getModelManager } from './model-manager';

// Voorbeeld 1: Directe model selectie
async function example1() {
  console.log('📋 Voorbeeld 1: Directe Model Selectie\n');
  
  const selection = await selectBestModels();
  
  console.log('Programmeer Model:', selection.programmingModel?.name || 'Niet gevonden');
  console.log('Debug Model:', selection.debugModel?.name || 'Niet gevonden');
  console.log('Beschikbare modellen:', selection.availableModels.length);
}

// Voorbeeld 2: Model Manager gebruiken
async function example2() {
  console.log('\n📋 Voorbeeld 2: Model Manager\n');
  
  const manager = getModelManager();
  await manager.initialize();
  
  const progModel = manager.getModelForTask('programming');
  const debugModel = manager.getModelForTask('debug');
  
  console.log('Programmeer Model:', progModel?.name || 'Niet gevonden');
  console.log('Debug Model:', debugModel?.name || 'Niet gevonden');
  
  // Genereer prompts
  const progPrompt = manager.generatePrompt(
    'programming',
    'Maak een React login component met validatie'
  );
  
  const debugPrompt = manager.generatePrompt(
    'debug',
    'Waarom geeft deze code een error: const x = null; x.toString();'
  );
  
  console.log('\nProgrammeer Prompt:');
  console.log(progPrompt);
  
  console.log('\nDebug Prompt:');
  console.log(debugPrompt);
}

// Voorbeeld 3: Model configuratie aanpassen
async function example3() {
  console.log('\n📋 Voorbeeld 3: Configuratie Aanpassen\n');
  
  const manager = getModelManager();
  
  // Update configuratie
  manager.updateConfig({
    autoSelect: true,
    preferredProgrammingModel: 'qwen2.5-coder-32b',
    preferredDebugModel: 'phi-3.5-mini'
  });
  
  await manager.refresh();
  
  const selection = manager.getCurrentSelection();
  console.log('Huidige selectie:', selection);
}

// Voorbeeld 4: Model informatie ophalen
async function example4() {
  console.log('\n📋 Voorbeeld 4: Model Informatie\n');
  
  const selection = await selectBestModels();
  
  if (selection.programmingModel) {
    const model = selection.programmingModel;
    console.log('Programmeer Model Details:');
    console.log(`  Naam: ${model.name}`);
    console.log(`  Bestand: ${model.file}`);
    console.log(`  Grootte: ${model.size_gb} GB`);
    console.log(`  Snelheid: ${'⭐'.repeat(model.speed)}`);
    console.log(`  Kwaliteit: ${'⭐'.repeat(model.quality)}`);
    console.log(`  Gebruik: ${model.useCase}`);
  }
  
  if (selection.debugModel) {
    const model = selection.debugModel;
    console.log('\nDebug Model Details:');
    console.log(`  Naam: ${model.name}`);
    console.log(`  Bestand: ${model.file}`);
    console.log(`  Grootte: ${model.size_gb} GB`);
    console.log(`  Snelheid: ${'⭐'.repeat(model.speed)}`);
    console.log(`  Kwaliteit: ${'⭐'.repeat(model.quality)}`);
    console.log(`  Gebruik: ${model.useCase}`);
  }
}

// Run alle voorbeelden
async function main() {
  try {
    await example1();
    await example2();
    await example3();
    await example4();
  } catch (error) {
    console.error('❌ Fout:', error);
  }
}

// Run alle voorbeelden
main().catch(console.error);

