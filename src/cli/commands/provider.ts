/**
 * Provider Management CLI Commands
 * Handles AI provider configuration, API keys, and switching between providers
 */

import { Command } from 'commander';
import { ProviderConfigManager, ProviderConfig } from '../../config/provider-config.js';
import { ConfigManager } from '../../core/config.js';
import { Logger } from '../../core/logger.js';
import { ZaiAPIClient } from '../../api/zai-client.js';
import { EnhancedClaudeAPIClient } from '../../api/claude-client-enhanced.js';

interface ProviderCommandOptions {
  list?: boolean;
  set?: string;
  key?: string;
  test?: boolean;
  status?: boolean;
  enable?: string;
  disable?: string;
  remove?: string;
  export?: string;
  import?: string;
  verbose?: boolean;
}

export class ProviderCommand {
  private configManager: ConfigManager;
  private providerManager: ProviderConfigManager;
  private logger: Logger;

  constructor() {
    this.logger = new Logger('ProviderCommand');
    this.configManager = new ConfigManager();
    this.providerManager = new ProviderConfigManager(this.configManager, this.logger);
  }

  /**
   * Create provider command
   */
  createCommand(): Command {
    const command = new Command('provider')
      .description('Manage AI providers and API keys')
      .option('-l, --list', 'List all providers')
      .option('-s, --set <provider>', 'Set active provider')
      .option('-k, --key <apikey>', 'Set API key for provider (use with --set)')
      .option('-t, --test', 'Test active provider connection')
      .option('--status', 'Show provider status')
      .option('--enable <provider>', 'Enable a provider')
      .option('--disable <provider>', 'Disable a provider')
      .option('--remove <provider>', 'Remove a provider')
      .option('--export <file>', 'Export provider configuration')
      .option('--import <file>', 'Import provider configuration')
      .option('-v, --verbose', 'Verbose output')
      .action(async (options: ProviderCommandOptions) => {
        await this.handleCommand(options);
      });

    // Add subcommands
    command
      .command('setup')
      .description('Interactive provider setup')
      .action(async () => {
        await this.interactiveSetup();
      });

    command
      .command('zai')
      .description('Quick Z.ai setup')
      .argument('<apikey>', 'Z.ai API key')
      .action(async (apikey: string) => {
        await this.setupZai(apikey);
      });

    command
      .command('anthropic')
      .description('Quick Anthropic setup')
      .argument('<apikey>', 'Anthropic API key')
      .action(async (apikey: string) => {
        await this.setupAnthropic(apikey);
      });

    command
      .command('openai')
      .description('Quick OpenAI setup')
      .argument('<apikey>', 'OpenAI API key')
      .action(async (apikey: string) => {
        await this.setupOpenAI(apikey);
      });

    return command;
  }

  /**
   * Handle main provider command
   */
  private async handleCommand(options: ProviderCommandOptions): Promise<void> {
    try {
      await this.providerManager.initialize();

      if (options.list) {
        await this.listProviders(options.verbose);
      } else if (options.status) {
        await this.showStatus();
      } else if (options.set) {
        if (options.key) {
          await this.setProviderWithKey(options.set, options.key);
        } else {
          await this.setActiveProvider(options.set);
        }
      } else if (options.test) {
        await this.testProvider();
      } else if (options.enable) {
        await this.enableProvider(options.enable);
      } else if (options.disable) {
        await this.disableProvider(options.disable);
      } else if (options.remove) {
        await this.removeProvider(options.remove);
      } else if (options.export) {
        await this.exportConfiguration(options.export);
      } else if (options.import) {
        await this.importConfiguration(options.import);
      } else {
        // Default: show status
        await this.showStatus();
      }
    } catch (error) {
      console.error('❌ Provider command failed:', error.message);
      process.exit(1);
    }
  }

  /**
   * List all providers
   */
  private async listProviders(verbose = false): Promise<void> {
    const providers = this.providerManager.getAllProviders();
    const activeProvider = this.providerManager.getActiveProvider();

    console.log('\n🤖 AI Providers:\n');

    for (const [name, provider] of Object.entries(providers)) {
      const isActive = activeProvider?.name === provider.name;
      const status = provider.enabled ? '✅' : '❌';
      const active = isActive ? '👑' : '  ';
      
      console.log(`${active} ${status} ${provider.name} (${name})`);
      
      if (verbose) {
        console.log(`     Type: ${provider.type}`);
        console.log(`     Model: ${provider.model}`);
        console.log(`     API Key: ${provider.apiKey ? '****...****' : 'Not set'}`);
        console.log(`     Priority: ${provider.priority}`);
        console.log(`     Capabilities: ${provider.capabilities.join(', ')}`);
        if (provider.apiUrl) {
          console.log(`     API URL: ${provider.apiUrl}`);
        }
        console.log();
      }
    }

    if (!verbose) {
      console.log('\nUse --verbose for detailed information');
    }
  }

  /**
   * Show provider status
   */
  private async showStatus(): Promise<void> {
    const status = this.providerManager.getStatus();
    const activeProvider = this.providerManager.getActiveProvider();

    console.log('\n📊 Provider Status:\n');
    console.log(`Active Provider: ${status.activeProvider || 'None'}`);
    console.log(`Enabled Providers: ${status.enabledProviders.join(', ') || 'None'}`);
    console.log(`Total Providers: ${status.totalProviders}`);
    console.log(`Load Balancing: ${status.loadBalancing ? 'Enabled' : 'Disabled'}`);

    if (activeProvider) {
      console.log('\n🎯 Active Provider Details:');
      console.log(`Name: ${activeProvider.name}`);
      console.log(`Type: ${activeProvider.type}`);
      console.log(`Model: ${activeProvider.model}`);
      console.log(`API Key: ${activeProvider.apiKey ? '✅ Set' : '❌ Not set'}`);
    }
  }

  /**
   * Set active provider
   */
  private async setActiveProvider(providerName: string): Promise<void> {
    await this.providerManager.setActiveProvider(providerName);
    console.log(`✅ Active provider set to: ${providerName}`);
  }

  /**
   * Set provider with API key
   */
  private async setProviderWithKey(providerName: string, apiKey: string): Promise<void> {
    await this.providerManager.setProviderApiKey(providerName, apiKey);
    await this.providerManager.setActiveProvider(providerName);
    console.log(`✅ Provider ${providerName} configured and activated`);
  }

  /**
   * Test active provider
   */
  private async testProvider(): Promise<void> {
    const activeProvider = this.providerManager.getActiveProvider();
    
    if (!activeProvider) {
      console.log('❌ No active provider configured');
      return;
    }

    console.log(`🧪 Testing provider: ${activeProvider.name}...`);

    try {
      let client: any;
      
      switch (activeProvider.type) {
        case 'zai':
          client = new ZaiAPIClient(this.logger, this.configManager, {
            apiKey: activeProvider.apiKey,
            apiUrl: activeProvider.apiUrl,
            model: activeProvider.model as any,
          });
          break;
          
        case 'anthropic':
          client = new EnhancedClaudeAPIClient(this.logger, this.configManager, {
            apiKey: activeProvider.apiKey,
            apiUrl: activeProvider.apiUrl,
            model: activeProvider.model as any,
          });
          break;
          
        default:
          console.log(`❌ Testing not implemented for provider type: ${activeProvider.type}`);
          return;
      }

      const healthCheck = await client.performHealthCheck();
      
      if (healthCheck.healthy) {
        console.log(`✅ Provider test successful`);
        console.log(`   Response time: ${healthCheck.responseTime}ms`);
      } else {
        console.log(`❌ Provider test failed: ${healthCheck.error}`);
      }
    } catch (error) {
      console.log(`❌ Provider test failed: ${error.message}`);
    }
  }

  /**
   * Enable provider
   */
  private async enableProvider(providerName: string): Promise<void> {
    await this.providerManager.toggleProvider(providerName, true);
    console.log(`✅ Provider ${providerName} enabled`);
  }

  /**
   * Disable provider
   */
  private async disableProvider(providerName: string): Promise<void> {
    await this.providerManager.toggleProvider(providerName, false);
    console.log(`✅ Provider ${providerName} disabled`);
  }

  /**
   * Remove provider
   */
  private async removeProvider(providerName: string): Promise<void> {
    await this.providerManager.removeProvider(providerName);
    console.log(`✅ Provider ${providerName} removed`);
  }

  /**
   * Export configuration
   */
  private async exportConfiguration(filename: string): Promise<void> {
    const config = this.providerManager.exportConfiguration();
    const fs = await import('fs/promises');
    
    await fs.writeFile(filename, JSON.stringify(config, null, 2));
    console.log(`✅ Configuration exported to: ${filename}`);
  }

  /**
   * Import configuration
   */
  private async importConfiguration(filename: string): Promise<void> {
    const fs = await import('fs/promises');
    const configData = await fs.readFile(filename, 'utf8');
    const config = JSON.parse(configData);
    
    await this.providerManager.importConfiguration(config);
    console.log(`✅ Configuration imported from: ${filename}`);
  }

  /**
   * Interactive provider setup
   */
  private async interactiveSetup(): Promise<void> {
    const readline = await import('readline');
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    const question = (prompt: string): Promise<string> => {
      return new Promise((resolve) => {
        rl.question(prompt, resolve);
      });
    };

    try {
      console.log('\n🚀 Claude-Flow Provider Setup\n');

      const provider = await question('Which provider would you like to configure? (zai/anthropic/openai): ');
      const apiKey = await question('Enter your API key: ');

      switch (provider.toLowerCase()) {
        case 'zai':
          await this.setupZai(apiKey);
          break;
        case 'anthropic':
          await this.setupAnthropic(apiKey);
          break;
        case 'openai':
          await this.setupOpenAI(apiKey);
          break;
        default:
          console.log('❌ Unknown provider. Supported: zai, anthropic, openai');
      }
    } finally {
      rl.close();
    }
  }

  /**
   * Setup Z.ai provider
   */
  private async setupZai(apiKey: string): Promise<void> {
    console.log('🔧 Setting up Z.ai provider...');
    
    await this.providerManager.setProviderApiKey('zai', apiKey);
    await this.providerManager.setActiveProvider('zai');
    
    console.log('✅ Z.ai provider configured successfully!');
    console.log('🧪 Testing connection...');
    
    await this.testProvider();
  }

  /**
   * Setup Anthropic provider
   */
  private async setupAnthropic(apiKey: string): Promise<void> {
    console.log('🔧 Setting up Anthropic provider...');
    
    await this.providerManager.setProviderApiKey('anthropic', apiKey);
    await this.providerManager.setActiveProvider('anthropic');
    
    console.log('✅ Anthropic provider configured successfully!');
    console.log('🧪 Testing connection...');
    
    await this.testProvider();
  }

  /**
   * Setup OpenAI provider
   */
  private async setupOpenAI(apiKey: string): Promise<void> {
    console.log('🔧 Setting up OpenAI provider...');
    
    await this.providerManager.setProviderApiKey('openai', apiKey);
    await this.providerManager.setActiveProvider('openai');
    
    console.log('✅ OpenAI provider configured successfully!');
    console.log('🧪 Testing connection...');
    
    await this.testProvider();
  }
}

