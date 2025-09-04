/**
 * AI Provider Configuration System for Claude-Flow
 * Supports multiple AI providers including Anthropic, OpenAI, Z.ai, and custom providers
 */

import { promises as fs } from 'fs';
import { join } from 'path';
import { homedir } from 'os';
import { ConfigManager } from '../core/config.js';
import { Logger } from '../core/logger.js';

export interface ProviderConfig {
  name: string;
  type: 'anthropic' | 'openai' | 'zai' | 'custom';
  apiKey: string;
  apiUrl?: string;
  model: string;
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  topK?: number;
  systemPrompt?: string;
  timeout?: number;
  retryAttempts?: number;
  retryDelay?: number;
  enabled: boolean;
  priority: number; // Higher number = higher priority
  capabilities: string[];
  metadata?: Record<string, any>;
}

export interface ProviderRegistry {
  activeProvider: string;
  providers: Record<string, ProviderConfig>;
  fallbackOrder: string[];
  loadBalancing: {
    enabled: boolean;
    strategy: 'round-robin' | 'weighted' | 'least-latency';
    weights?: Record<string, number>;
  };
}

export class ProviderConfigManager {
  private logger: Logger;
  private configManager: ConfigManager;
  private registry: ProviderRegistry;
  private configPath: string;

  constructor(configManager: ConfigManager, logger?: Logger) {
    this.configManager = configManager;
    this.logger = logger || new Logger('ProviderConfigManager');
    this.configPath = join(homedir(), '.claude-flow', 'providers.json');
    this.registry = this.getDefaultRegistry();
  }

  /**
   * Initialize provider configuration
   */
  async initialize(): Promise<void> {
    try {
      await this.loadConfiguration();
      await this.validateProviders();
      this.logger.info('Provider configuration initialized', {
        activeProvider: this.registry.activeProvider,
        providerCount: Object.keys(this.registry.providers).length,
      });
    } catch (error) {
      this.logger.error('Failed to initialize provider configuration', { error });
      // Use default configuration
      this.registry = this.getDefaultRegistry();
    }
  }

  /**
   * Get default provider registry
   */
  private getDefaultRegistry(): ProviderRegistry {
    return {
      activeProvider: 'zai',
      providers: {
        anthropic: {
          name: 'Anthropic Claude',
          type: 'anthropic',
          apiKey: process.env.ANTHROPIC_API_KEY || '',
          apiUrl: 'https://api.anthropic.com/v1/messages',
          model: 'claude-3-sonnet-20240229',
          temperature: 0.7,
          maxTokens: 4096,
          enabled: !!process.env.ANTHROPIC_API_KEY,
          priority: 80,
          capabilities: ['chat', 'reasoning', 'code', 'analysis'],
        },
        openai: {
          name: 'OpenAI GPT',
          type: 'openai',
          apiKey: process.env.OPENAI_API_KEY || '',
          apiUrl: 'https://api.openai.com/v1/chat/completions',
          model: 'gpt-4',
          temperature: 0.7,
          maxTokens: 4096,
          enabled: !!process.env.OPENAI_API_KEY,
          priority: 70,
          capabilities: ['chat', 'reasoning', 'code', 'analysis'],
        },
        zai: {
          name: 'Z.ai GLM',
          type: 'zai',
          apiKey: process.env.ZAI_API_KEY || '',
          apiUrl: 'https://api.z.ai/v1/chat/completions',
          model: 'glm-4.5',
          temperature: 0.7,
          maxTokens: 4096,
          enabled: !!process.env.ZAI_API_KEY,
          priority: 90,
          capabilities: ['chat', 'reasoning', 'code', 'analysis', 'chinese'],
        },
      },
      fallbackOrder: ['zai', 'anthropic', 'openai'],
      loadBalancing: {
        enabled: false,
        strategy: 'weighted',
        weights: {
          zai: 50,
          anthropic: 30,
          openai: 20,
        },
      },
    };
  }

  /**
   * Load configuration from file
   */
  private async loadConfiguration(): Promise<void> {
    try {
      const configData = await fs.readFile(this.configPath, 'utf8');
      const loadedRegistry = JSON.parse(configData) as ProviderRegistry;
      
      // Merge with defaults to ensure all required fields exist
      this.registry = {
        ...this.getDefaultRegistry(),
        ...loadedRegistry,
        providers: {
          ...this.getDefaultRegistry().providers,
          ...loadedRegistry.providers,
        },
      };
    } catch (error) {
      // File doesn't exist or is invalid, use defaults
      this.logger.info('Provider configuration file not found, using defaults');
    }
  }

  /**
   * Save configuration to file
   */
  async saveConfiguration(): Promise<void> {
    try {
      // Ensure directory exists
      const configDir = join(homedir(), '.claude-flow');
      await fs.mkdir(configDir, { recursive: true });

      // Save configuration
      await fs.writeFile(
        this.configPath,
        JSON.stringify(this.registry, null, 2),
        'utf8'
      );

      this.logger.info('Provider configuration saved', { path: this.configPath });
    } catch (error) {
      this.logger.error('Failed to save provider configuration', { error });
      throw error;
    }
  }

  /**
   * Validate all providers
   */
  private async validateProviders(): Promise<void> {
    for (const [name, provider] of Object.entries(this.registry.providers)) {
      if (provider.enabled && !provider.apiKey) {
        this.logger.warn(`Provider ${name} is enabled but has no API key`);
        provider.enabled = false;
      }
    }

    // Ensure active provider is valid and enabled
    const activeProvider = this.registry.providers[this.registry.activeProvider];
    if (!activeProvider || !activeProvider.enabled) {
      // Find the highest priority enabled provider
      const enabledProviders = Object.entries(this.registry.providers)
        .filter(([, provider]) => provider.enabled)
        .sort(([, a], [, b]) => b.priority - a.priority);

      if (enabledProviders.length > 0) {
        this.registry.activeProvider = enabledProviders[0][0];
        this.logger.info(`Switched to provider: ${this.registry.activeProvider}`);
      } else {
        this.logger.warn('No enabled providers found');
      }
    }
  }

  /**
   * Set API key for a provider
   */
  async setProviderApiKey(providerName: string, apiKey: string): Promise<void> {
    if (!this.registry.providers[providerName]) {
      throw new Error(`Provider ${providerName} not found`);
    }

    this.registry.providers[providerName].apiKey = apiKey;
    this.registry.providers[providerName].enabled = true;

    await this.saveConfiguration();
    this.logger.info(`API key set for provider: ${providerName}`);
  }

  /**
   * Set active provider
   */
  async setActiveProvider(providerName: string): Promise<void> {
    if (!this.registry.providers[providerName]) {
      throw new Error(`Provider ${providerName} not found`);
    }

    if (!this.registry.providers[providerName].enabled) {
      throw new Error(`Provider ${providerName} is not enabled`);
    }

    this.registry.activeProvider = providerName;
    await this.saveConfiguration();
    this.logger.info(`Active provider set to: ${providerName}`);
  }

  /**
   * Get active provider configuration
   */
  getActiveProvider(): ProviderConfig | null {
    const provider = this.registry.providers[this.registry.activeProvider];
    return provider && provider.enabled ? provider : null;
  }

  /**
   * Get all providers
   */
  getAllProviders(): Record<string, ProviderConfig> {
    return { ...this.registry.providers };
  }

  /**
   * Get enabled providers
   */
  getEnabledProviders(): Record<string, ProviderConfig> {
    return Object.fromEntries(
      Object.entries(this.registry.providers).filter(([, provider]) => provider.enabled)
    );
  }

  /**
   * Add or update a provider
   */
  async addProvider(name: string, config: Omit<ProviderConfig, 'name'>): Promise<void> {
    this.registry.providers[name] = {
      name,
      ...config,
    };

    await this.saveConfiguration();
    this.logger.info(`Provider ${name} added/updated`);
  }

  /**
   * Remove a provider
   */
  async removeProvider(name: string): Promise<void> {
    if (!this.registry.providers[name]) {
      throw new Error(`Provider ${name} not found`);
    }

    if (this.registry.activeProvider === name) {
      // Switch to next available provider
      const enabledProviders = Object.entries(this.registry.providers)
        .filter(([providerName, provider]) => providerName !== name && provider.enabled)
        .sort(([, a], [, b]) => b.priority - a.priority);

      if (enabledProviders.length > 0) {
        this.registry.activeProvider = enabledProviders[0][0];
      } else {
        this.registry.activeProvider = '';
      }
    }

    delete this.registry.providers[name];
    await this.saveConfiguration();
    this.logger.info(`Provider ${name} removed`);
  }

  /**
   * Enable/disable a provider
   */
  async toggleProvider(name: string, enabled: boolean): Promise<void> {
    if (!this.registry.providers[name]) {
      throw new Error(`Provider ${name} not found`);
    }

    this.registry.providers[name].enabled = enabled;

    // If disabling the active provider, switch to another
    if (!enabled && this.registry.activeProvider === name) {
      const enabledProviders = Object.entries(this.registry.providers)
        .filter(([, provider]) => provider.enabled)
        .sort(([, a], [, b]) => b.priority - a.priority);

      if (enabledProviders.length > 0) {
        this.registry.activeProvider = enabledProviders[0][0];
      } else {
        this.registry.activeProvider = '';
      }
    }

    await this.saveConfiguration();
    this.logger.info(`Provider ${name} ${enabled ? 'enabled' : 'disabled'}`);
  }

  /**
   * Get next provider for load balancing
   */
  getNextProvider(): ProviderConfig | null {
    if (!this.registry.loadBalancing.enabled) {
      return this.getActiveProvider();
    }

    const enabledProviders = Object.entries(this.registry.providers)
      .filter(([, provider]) => provider.enabled);

    if (enabledProviders.length === 0) {
      return null;
    }

    switch (this.registry.loadBalancing.strategy) {
      case 'round-robin':
        // Simple round-robin implementation
        // In a real implementation, you'd track the last used provider
        return enabledProviders[Math.floor(Math.random() * enabledProviders.length)][1];

      case 'weighted':
        const weights = this.registry.loadBalancing.weights || {};
        const totalWeight = enabledProviders.reduce(
          (sum, [name]) => sum + (weights[name] || 1),
          0
        );
        
        let random = Math.random() * totalWeight;
        for (const [name, provider] of enabledProviders) {
          random -= weights[name] || 1;
          if (random <= 0) {
            return provider;
          }
        }
        return enabledProviders[0][1];

      case 'least-latency':
        // In a real implementation, you'd track latency metrics
        // For now, return the highest priority provider
        return enabledProviders.sort(([, a], [, b]) => b.priority - a.priority)[0][1];

      default:
        return this.getActiveProvider();
    }
  }

  /**
   * Get provider registry status
   */
  getStatus(): {
    activeProvider: string;
    enabledProviders: string[];
    totalProviders: number;
    loadBalancing: boolean;
  } {
    const enabledProviders = Object.entries(this.registry.providers)
      .filter(([, provider]) => provider.enabled)
      .map(([name]) => name);

    return {
      activeProvider: this.registry.activeProvider,
      enabledProviders,
      totalProviders: Object.keys(this.registry.providers).length,
      loadBalancing: this.registry.loadBalancing.enabled,
    };
  }

  /**
   * Export configuration for backup
   */
  exportConfiguration(): ProviderRegistry {
    return JSON.parse(JSON.stringify(this.registry));
  }

  /**
   * Import configuration from backup
   */
  async importConfiguration(registry: ProviderRegistry): Promise<void> {
    this.registry = registry;
    await this.validateProviders();
    await this.saveConfiguration();
    this.logger.info('Provider configuration imported');
  }
}

