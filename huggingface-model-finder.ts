/**
 * Hugging Face Model Finder
 * Zoekt naar gratis, sterke modellen die geschikt zijn voor LM Studio
 */

export interface HuggingFaceModel {
  id: string;
  author: string;
  downloads: number;
  likes: number;
  model_type: string;
  tags: string[];
  gated: boolean;
  library_name?: string;
  pipeline_tag?: string;
}

export interface ModelFile {
  filename: string;
  size: number;
  quantization?: string;
}

// Gebruik environment variable voor API token
const HF_API_TOKEN = process.env.HF_API_TOKEN || '';
const HF_API_BASE = 'https://huggingface.co/api';

if (!HF_API_TOKEN) {
  console.warn('⚠️  HF_API_TOKEN niet ingesteld. Sommige functies werken mogelijk niet.');
}

/**
 * Zoekt naar gratis code modellen op Hugging Face
 */
export async function searchFreeCodeModels(limit: number = 20): Promise<HuggingFaceModel[]> {
  try {
    const response = await fetch(
      `${HF_API_BASE}/models?search=coder&filter=gguf&sort=downloads&direction=-1&limit=${limit}`,
      {
        headers: {
          'Authorization': `Bearer ${HF_API_TOKEN}`
        }
      }
    );

    if (!response.ok) {
      throw new Error(`HF API error: ${response.status}`);
    }

    const models: HuggingFaceModel[] = await response.json();
    
    // Filter op gratis modellen (niet gated)
    return models.filter(model => !model.gated);
  } catch (error) {
    console.error('Error searching HF models:', error);
    return [];
  }
}

/**
 * Zoekt naar gratis instruct modellen (goed voor debugging)
 */
export async function searchFreeInstructModels(limit: number = 20): Promise<HuggingFaceModel[]> {
  try {
    const response = await fetch(
      `${HF_API_BASE}/models?search=instruct&filter=gguf&sort=downloads&direction=-1&limit=${limit}`,
      {
        headers: {
          'Authorization': `Bearer ${HF_API_TOKEN}`
        }
      }
    );

    if (!response.ok) {
      throw new Error(`HF API error: ${response.status}`);
    }

    const models: HuggingFaceModel[] = await response.json();
    
    // Filter op gratis modellen
    return models.filter(model => !model.gated);
  } catch (error) {
    console.error('Error searching HF models:', error);
    return [];
  }
}

/**
 * Haalt model details op van een specifiek model
 */
export async function getModelDetails(modelId: string): Promise<any> {
  try {
    const response = await fetch(
      `${HF_API_BASE}/models/${modelId}`,
      {
        headers: {
          'Authorization': `Bearer ${HF_API_TOKEN}`
        }
      }
    );

    if (!response.ok) {
      throw new Error(`HF API error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error fetching model ${modelId}:`, error);
    return null;
  }
}

/**
 * Haalt beschikbare GGUF bestanden op voor een model
 */
export async function getModelFiles(modelId: string): Promise<ModelFile[]> {
  try {
    const response = await fetch(
      `https://huggingface.co/api/models/${modelId}/tree/main`,
      {
        headers: {
          'Authorization': `Bearer ${HF_API_TOKEN}`
        }
      }
    );

    if (!response.ok) {
      return [];
    }

    const files: any[] = await response.json();
    
    // Filter op GGUF bestanden
    return files
      .filter(file => file.path.endsWith('.gguf'))
      .map(file => ({
        filename: file.path,
        size: file.size || 0,
        quantization: extractQuantization(file.path)
      }));
  } catch (error) {
    console.error(`Error fetching files for ${modelId}:`, error);
    return [];
  }
}

/**
 * Extraheert quantisatie niveau uit bestandsnaam
 */
function extractQuantization(filename: string): string | undefined {
  const patterns = [
    /Q(\d)_K_M/i,
    /Q(\d)_K_L/i,
    /Q(\d)_0/i,
    /Q(\d)K_M/i,
    /Q(\d)K_L/i
  ];

  for (const pattern of patterns) {
    const match = filename.match(pattern);
    if (match) {
      return match[0];
    }
  }

  return undefined;
}

/**
 * Zoekt naar de beste gratis modellen voor programmeren
 */
export async function findBestFreeProgrammingModels(): Promise<{
  model: HuggingFaceModel;
  files: ModelFile[];
  score: number;
}[]> {
  const codeModels = await searchFreeCodeModels(30);
  
  const results = await Promise.all(
    codeModels.map(async (model) => {
      const files = await getModelFiles(model.id);
      const score = calculateModelScore(model, files);
      
      return {
        model,
        files,
        score
      };
    })
  );

  // Sorteer op score (hoogste eerst)
  return results
    .filter(r => r.files.length > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);
}

/**
 * Zoekt naar de beste gratis modellen voor debugging
 */
export async function findBestFreeDebugModels(): Promise<{
  model: HuggingFaceModel;
  files: ModelFile[];
  score: number;
}[]> {
  const instructModels = await searchFreeInstructModels(30);
  
  const results = await Promise.all(
    instructModels.map(async (model) => {
      const files = await getModelFiles(model.id);
      const score = calculateModelScore(model, files);
      
      return {
        model,
        files,
        score
      };
    })
  );

  // Sorteer op score (hoogste eerst)
  return results
    .filter(r => r.files.length > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);
}

/**
 * Berekent een score voor een model (hoe beter, hoe hoger)
 */
function calculateModelScore(model: HuggingFaceModel, files: ModelFile[]): number {
  let score = 0;

  // Downloads (populariteit)
  score += Math.log10(model.downloads + 1) * 10;

  // Likes
  score += model.likes * 2;

  // Aantal beschikbare bestanden
  score += files.length * 5;

  // Heeft goede quantisatie bestanden
  const hasGoodQuantization = files.some(f => 
    f.filename.includes('Q4') || 
    f.filename.includes('Q5') || 
    f.filename.includes('Q8')
  );
  if (hasGoodQuantization) score += 20;

  // Code-specifieke tags
  if (model.tags?.some(t => 
    t.includes('code') || 
    t.includes('coding') || 
    t.includes('programming')
  )) {
    score += 15;
  }

  // Instruct modellen zijn beter
  if (model.tags?.some(t => t.includes('instruct'))) {
    score += 10;
  }

  return score;
}

/**
 * Genereert een rapport van beschikbare gratis modellen
 */
export async function generateModelReport(): Promise<string> {
  const programmingModels = await findBestFreeProgrammingModels();
  const debugModels = await findBestFreeDebugModels();

  let report = '# 🎯 Gratis Sterke Modellen voor LM Studio\n\n';
  
  report += '## 💻 Programmering Modellen\n\n';
  programmingModels.forEach((item, index) => {
    report += `### ${index + 1}. ${item.model.id}\n`;
    report += `- Downloads: ${item.model.downloads.toLocaleString()}\n`;
    report += `- Likes: ${item.model.likes}\n`;
    report += `- Score: ${item.score.toFixed(1)}\n`;
    report += `- GGUF Bestanden: ${item.files.length}\n`;
    report += `- Beste bestanden:\n`;
    item.files
      .filter(f => f.filename.includes('Q4') || f.filename.includes('Q5') || f.filename.includes('Q8'))
      .slice(0, 3)
      .forEach(f => {
        report += `  - ${f.filename} (${(f.size / 1024 / 1024 / 1024).toFixed(2)} GB)\n`;
      });
    report += '\n';
  });

  report += '\n## 🐛 Debug Modellen\n\n';
  debugModels.forEach((item, index) => {
    report += `### ${index + 1}. ${item.model.id}\n`;
    report += `- Downloads: ${item.model.downloads.toLocaleString()}\n`;
    report += `- Likes: ${item.model.likes}\n`;
    report += `- Score: ${item.score.toFixed(1)}\n`;
    report += `- GGUF Bestanden: ${item.files.length}\n`;
    report += `- Beste bestanden:\n`;
    item.files
      .filter(f => f.filename.includes('Q4') || f.filename.includes('Q5') || f.filename.includes('Q8'))
      .slice(0, 3)
      .forEach(f => {
        report += `  - ${f.filename} (${(f.size / 1024 / 1024 / 1024).toFixed(2)} GB)\n`;
      });
    report += '\n';
  });

  return report;
}

