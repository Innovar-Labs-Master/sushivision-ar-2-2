#!/usr/bin/env ts-node

/**
 * Script om gratis sterke modellen te vinden op Hugging Face
 * Gebruikt de Hugging Face API om modellen te zoeken die geschikt zijn voor LM Studio
 */

import * as fs from 'fs';
import * as path from 'path';
import { 
  findBestFreeProgrammingModels, 
  findBestFreeDebugModels,
  generateModelReport 
} from './huggingface-model-finder';

async function main() {
  console.log('🔍 Zoeken naar gratis sterke modellen op Hugging Face...\n');

  try {
    console.log('📦 Zoeken naar programmeer modellen...');
    const programmingModels = await findBestFreeProgrammingModels();
    
    console.log(`✅ Gevonden: ${programmingModels.length} programmeer modellen\n`);
    
    console.log('🐛 Zoeken naar debug modellen...');
    const debugModels = await findBestFreeDebugModels();
    
    console.log(`✅ Gevonden: ${debugModels.length} debug modellen\n`);

    // Genereer rapport
    console.log('📝 Genereren van model rapport...');
    const report = await generateModelReport();
    
    // Sla rapport op
    const reportPath = path.join(__dirname, 'FREE_MODELS_REPORT.md');
    fs.writeFileSync(reportPath, report, 'utf-8');
    
    console.log(`\n✅ Rapport opgeslagen in: ${reportPath}\n`);
    
    // Toon top 3 van elk type
    console.log('🏆 TOP 3 PROGRAMMEER MODELLEN:');
    console.log('================================\n');
    programmingModels.slice(0, 3).forEach((item, index) => {
      console.log(`${index + 1}. ${item.model.id}`);
      console.log(`   Score: ${item.score.toFixed(1)}`);
      console.log(`   Downloads: ${item.model.downloads.toLocaleString()}`);
      console.log(`   Beste bestand: ${item.files[0]?.filename || 'N/A'}\n`);
    });

    console.log('🏆 TOP 3 DEBUG MODELLEN:');
    console.log('=========================\n');
    debugModels.slice(0, 3).forEach((item, index) => {
      console.log(`${index + 1}. ${item.model.id}`);
      console.log(`   Score: ${item.score.toFixed(1)}`);
      console.log(`   Downloads: ${item.model.downloads.toLocaleString()}`);
      console.log(`   Beste bestand: ${item.files[0]?.filename || 'N/A'}\n`);
    });

  } catch (error) {
    console.error('❌ Fout bij zoeken naar modellen:', error);
    process.exit(1);
  }
}

main();

