/**
 * Model Manager - Beheert model selectie en configuratie
 * Werkt samen met LM Studio en Hugging Face
 */

import { 
  selectBestModels, 
  ModelSelection, 
  ModelConfig,
  getModelPrompt 
} from './model-selector';
import * as fs from 'fs';
import * as path from 'path';

export interface ModelManagerConfig {
  autoSelect: boolean;
  preferredProgrammingModel?: string;
  preferredDebugModel?: string;
  fallbackToAvailable: boolean;
}

const DEFAULT_CONFIG: ModelManagerConfig = {
  autoSelect: true,
  fallbackToAvailable: true
};

/**
 * Model Manager class
 */
export class ModelManager {
  private config: ModelManagerConfig;
  private currentSelection: ModelSelection | null = null;
  private configPath: string;

  constructor(configPath: string = './model-config.json') {
    this.configPath = configPath;
    this.config = this.loadConfig();
  }

  /**
   * Laadt configuratie
   */
  private loadConfig(): ModelManagerConfig {
    try {
      const configData = fs.readFileSync(this.configPath, 'utf-8');
      const fullConfig = JSON.parse(configData);
      return {
        ...DEFAULT_CONFIG,
        ...fullConfig.manager || {}
      };
    } catch (error) {
      return DEFAULT_CONFIG;
    }
  }

  /**
   * Slaat configuratie op
   */
  private saveConfig(): void {
    try {
      let fullConfig: any = {};
      if (fs.existsSync(this.configPath)) {
        fullConfig = JSON.parse(fs.readFileSync(this.configPath, 'utf-8'));
      }
      fullConfig.manager = this.config;
      fs.writeFileSync(this.configPath, JSON.stringify(fullConfig, null, 2), 'utf-8');
    } catch (error) {
      console.error('Error saving config:', error);
    }
  }

  /**
   * Initialiseert model selectie
   */
  async initialize(): Promise<ModelSelection> {
    if (this.config.autoSelect) {
      this.currentSelection = await selectBestModels();
    } else {
      // Gebruik voorkeursmodellen
      this.currentSelection = await this.selectPreferredModels();
    }

    return this.currentSelection;
  }

  /**
   * Selecteert voorkeursmodellen
   */
  private async selectPreferredModels(): Promise<ModelSelection> {
    const { selectBestModels, getAvailableModels } = await import('./model-selector');
    const available = await getAvailableModels();

    const programmingModel = this.config.preferredProgrammingModel
      ? this.findModelById(this.config.preferredProgrammingModel, available)
      : null;

    const debugModel = this.config.preferredDebugModel
      ? this.findModelById(this.config.preferredDebugModel, available)
      : null;

    return {
      programmingModel,
      debugModel,
      availableModels: []
    };
  }

  /**
   * Vindt model op ID
   */
  private findModelById(id: string, availableIds: string[]): ModelConfig | null {
    const { CONFIGURED_MODELS } = require('./model-selector');
    
    const model = CONFIGURED_MODELS.find((m: ModelConfig) => m.id === id);
    if (!model) return null;

    const isAvailable = availableIds.some(aid => 
      aid.toLowerCase().includes(model.id.toLowerCase()) ||
      aid.toLowerCase().includes(model.name.toLowerCase().split('/').pop() || '')
    );

    return isAvailable ? model : null;
  }

  /**
   * Krijgt het beste model voor een taak
   */
  getModelForTask(task: 'programming' | 'debug'): ModelConfig | null {
    if (!this.currentSelection) {
      throw new Error('ModelManager not initialized. Call initialize() first.');
    }

    return task === 'programming' 
      ? this.currentSelection.programmingModel
      : this.currentSelection.debugModel;
  }

  /**
   * Genereert een prompt voor een taak
   */
  generatePrompt(task: 'programming' | 'debug', userPrompt: string): string {
    const model = this.getModelForTask(task);
    return getModelPrompt(model, task, userPrompt);
  }

  /**
   * Update configuratie
   */
  updateConfig(updates: Partial<ModelManagerConfig>): void {
    this.config = { ...this.config, ...updates };
    this.saveConfig();
  }

  /**
   * Krijgt huidige selectie
   */
  getCurrentSelection(): ModelSelection | null {
    return this.currentSelection;
  }

  /**
   * Refresh model selectie
   */
  async refresh(): Promise<ModelSelection> {
    return await this.initialize();
  }
}

/**
 * Singleton instance
 */
let managerInstance: ModelManager | null = null;

/**
 * Krijgt of maakt ModelManager instance
 */
export function getModelManager(): ModelManager {
  if (!managerInstance) {
    managerInstance = new ModelManager();
  }
  return managerInstance;
}

