/**
 * Intelligent Model Selector voor LM Studio
 * Kiest automatisch het beste model voor programmeren of debugging
 */

export interface ModelConfig {
  id: string;
  name: string;
  type: 'programming' | 'debug' | 'general';
  priority: number;
  file: string;
  size_gb: number;
  speed: number; // 1-5
  quality: number; // 1-5
  useCase: string;
}

export interface ModelSelection {
  programmingModel: ModelConfig | null;
  debugModel: ModelConfig | null;
  availableModels: ModelConfig[];
}

// Configureerde modellen
export const CONFIGURED_MODELS: ModelConfig[] = [
  {
    id: 'qwen2.5-coder-32b',
    name: 'Qwen2.5-Coder-32B-Instruct',
    type: 'programming',
    priority: 1,
    file: 'Qwen2.5-Coder-32B-Instruct-Q4_K_M.gguf',
    size_gb: 18,
    speed: 3,
    quality: 5,
    useCase: 'Primaire code generatie, complexe features, dagelijkse programmering'
  },
  {
    id: 'phi-3.5-mini',
    name: 'Phi-3.5-mini-instruct',
    type: 'debug',
    priority: 2,
    file: 'Phi-3.5-mini-instruct-Q8_0.gguf',
    size_gb: 4,
    speed: 5,
    quality: 4,
    useCase: 'Snelle debugging, code uitleg, kleine fixes'
  }
];

// Aanbevolen gratis modellen van Hugging Face
export const RECOMMENDED_FREE_MODELS: ModelConfig[] = [
  {
    id: 'qwen2.5-coder-32b',
    name: 'Qwen/Qwen2.5-Coder-32B-Instruct',
    type: 'programming',
    priority: 1,
    file: 'Q4_K_M.gguf',
    size_gb: 18,
    speed: 3,
    quality: 5,
    useCase: 'Beste open-source code model'
  },
  {
    id: 'phi-3.5-mini',
    name: 'microsoft/Phi-3.5-mini-instruct',
    type: 'debug',
    priority: 2,
    file: 'Q8_0.gguf',
    size_gb: 4,
    speed: 5,
    quality: 4,
    useCase: 'Snel en efficiënt voor debugging'
  },
  {
    id: 'deepseek-coder-6.7b',
    name: 'deepseek-ai/DeepSeek-Coder-6.7B-Instruct',
    type: 'programming',
    priority: 3,
    file: 'Q5_K_M.gguf',
    size_gb: 4.5,
    speed: 4,
    quality: 4,
    useCase: 'Goede code model, kleiner alternatief'
  },
  {
    id: 'codellama-13b',
    name: 'codellama/CodeLlama-13B-Instruct',
    type: 'programming',
    priority: 4,
    file: 'Q5_K_M.gguf',
    size_gb: 7.5,
    speed: 3,
    quality: 4,
    useCase: 'Betrouwbaar code model'
  },
  {
    id: 'mistral-7b',
    name: 'mistralai/Mistral-7B-Instruct-v0.2',
    type: 'general',
    priority: 5,
    file: 'Q5_K_M.gguf',
    size_gb: 4.5,
    speed: 4,
    quality: 4,
    useCase: 'Algemeen model, goed voor debugging'
  }
];

/**
 * Haalt beschikbare modellen op van LM Studio server
 */
export async function getAvailableModels(): Promise<string[]> {
  try {
    const response = await fetch('http://localhost:1234/v1/models');
    if (!response.ok) {
      return [];
    }
    const data = await response.json();
    return data.data?.map((m: any) => m.id) || [];
  } catch (error) {
    console.error('Error fetching models from LM Studio:', error);
    return [];
  }
}

/**
 * Selecteert het beste model voor programmeren
 */
export function selectProgrammingModel(availableModelIds: string[]): ModelConfig | null {
  // Sorteer op priority en filter op beschikbaarheid
  const programmingModels = CONFIGURED_MODELS
    .filter(m => m.type === 'programming')
    .sort((a, b) => a.priority - b.priority);

  // Zoek eerst in geconfigureerde modellen
  for (const model of programmingModels) {
    if (availableModelIds.some(id => 
      id.toLowerCase().includes(model.id.toLowerCase()) ||
      id.toLowerCase().includes('qwen') && model.id.includes('qwen')
    )) {
      return model;
    }
  }

  // Fallback naar eerste beschikbare programming model
  const available = programmingModels.find(m => 
    availableModelIds.some(id => id.toLowerCase().includes(m.name.toLowerCase().split('/').pop() || ''))
  );

  return available || null;
}

/**
 * Selecteert het beste model voor debugging
 */
export function selectDebugModel(availableModelIds: string[]): ModelConfig | null {
  // Sorteer op priority en filter op beschikbaarheid
  const debugModels = CONFIGURED_MODELS
    .filter(m => m.type === 'debug')
    .sort((a, b) => a.priority - b.priority);

  // Zoek eerst in geconfigureerde modellen
  for (const model of debugModels) {
    if (availableModelIds.some(id => 
      id.toLowerCase().includes(model.id.toLowerCase()) ||
      id.toLowerCase().includes('phi') && model.id.includes('phi')
    )) {
      return model;
    }
  }

  // Fallback naar eerste beschikbare debug model
  const available = debugModels.find(m => 
    availableModelIds.some(id => id.toLowerCase().includes(m.name.toLowerCase().split('/').pop() || ''))
  );

  return available || null;
}

/**
 * Hoofdfunctie: Selecteert beste modellen voor programmeren en debugging
 */
export async function selectBestModels(): Promise<ModelSelection> {
  const availableModelIds = await getAvailableModels();
  
  const programmingModel = selectProgrammingModel(availableModelIds);
  const debugModel = selectDebugModel(availableModelIds);

  // Map beschikbare modellen naar config
  const availableModels = availableModelIds
    .map(id => {
      const found = CONFIGURED_MODELS.find(m => 
        id.toLowerCase().includes(m.id.toLowerCase()) ||
        id.toLowerCase().includes(m.name.toLowerCase().split('/').pop() || '')
      );
      return found || null;
    })
    .filter((m): m is ModelConfig => m !== null);

  return {
    programmingModel,
    debugModel,
    availableModels
  };
}

/**
 * Genereert een prompt voor het geselecteerde model
 */
export function getModelPrompt(
  model: ModelConfig | null,
  task: 'programming' | 'debug',
  userPrompt: string
): string {
  if (!model) {
    return userPrompt;
  }

  const systemPrompts = {
    programming: `Je bent een expert programmeur die code schrijft met ${model.name}.
Focus op:
- Schone, goed gedocumenteerde code
- Best practices en moderne patronen
- Efficiënte en onderhoudbare oplossingen
- Foutafhandeling en edge cases`,
    
    debug: `Je bent een expert debugger die problemen oplost met ${model.name}.
Focus op:
- Systematisch analyseren van fouten
- Logische redenering stap-voor-stap
- Efficiënte oplossingen
- Duidelijke uitleg van het probleem en de fix`
  };

  return `${systemPrompts[task]}\n\n${userPrompt}`;
}

