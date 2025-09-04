#!/usr/bin/env node
/**
 * Test script for Z.ai integration with Claude-Flow
 * This script demonstrates how to configure and use Z.ai provider
 */

import { ProviderConfigManager } from './src/config/provider-config.js';
import { ConfigManager } from './src/core/config.js';
import { Logger } from './src/core/logger.js';
import { ZaiAPIClient } from './src/api/zai-client.js';

async function testZaiIntegration() {
  console.log('🚀 Testing Z.ai Integration with Claude-Flow\n');

  // Initialize components
  const logger = new Logger('ZaiTest');
  const configManager = new ConfigManager();
  const providerManager = new ProviderConfigManager(configManager, logger);

  try {
    // Initialize provider manager
    console.log('📋 Initializing provider configuration...');
    await providerManager.initialize();

    // Set Z.ai API key
    const zaiApiKey = 'deb21352b03a40d59eb80c330dadc530.YajyK4xUtogbCVGR';
    console.log('🔑 Setting Z.ai API key...');
    await providerManager.setProviderApiKey('zai', zaiApiKey);

    // Set Z.ai as active provider
    console.log('🎯 Setting Z.ai as active provider...');
    await providerManager.setActiveProvider('zai');

    // Get provider status
    console.log('\n📊 Provider Status:');
    const status = providerManager.getStatus();
    console.log(`   Active Provider: ${status.activeProvider}`);
    console.log(`   Enabled Providers: ${status.enabledProviders.join(', ')}`);

    // Get active provider config
    const activeProvider = providerManager.getActiveProvider();
    if (activeProvider) {
      console.log('\n🎯 Active Provider Details:');
      console.log(`   Name: ${activeProvider.name}`);
      console.log(`   Type: ${activeProvider.type}`);
      console.log(`   Model: ${activeProvider.model}`);
      console.log(`   API URL: ${activeProvider.apiUrl}`);
      console.log(`   API Key: ${activeProvider.apiKey ? '✅ Set' : '❌ Not set'}`);
    }

    // Test Z.ai API client
    console.log('\n🧪 Testing Z.ai API Client...');
    const zaiClient = new ZaiAPIClient(logger, configManager, {
      apiKey: zaiApiKey,
      apiUrl: 'https://api.z.ai/v1/chat/completions',
      model: 'glm-4.5',
      temperature: 0.7,
      maxTokens: 100,
    });

    // Perform health check
    console.log('🏥 Performing health check...');
    const healthCheck = await zaiClient.performHealthCheck();
    
    if (healthCheck.healthy) {
      console.log(`✅ Health check passed!`);
      console.log(`   Response time: ${healthCheck.responseTime}ms`);
    } else {
      console.log(`❌ Health check failed: ${healthCheck.error}`);
    }

    // Test message sending
    console.log('\n💬 Testing message sending...');
    const testMessages = [
      {
        role: 'user',
        content: 'Hello! Please respond with a brief greeting and confirm you are GLM-4.5 from Z.ai.'
      }
    ];

    try {
      const response = await zaiClient.sendMessage(testMessages, {
        max_tokens: 150,
        temperature: 0.7,
      });

      console.log('✅ Message sent successfully!');
      console.log(`   Model: ${response.model}`);
      console.log(`   Response: ${response.choices[0].message.content}`);
      console.log(`   Tokens used: ${response.usage.total_tokens}`);
    } catch (error) {
      console.log(`❌ Message sending failed: ${error.message}`);
    }

    // Test streaming (optional)
    console.log('\n🌊 Testing streaming response...');
    try {
      let streamContent = '';
      await zaiClient.sendStreamingMessage(
        [{ role: 'user', content: 'Count from 1 to 5, one number per response chunk.' }],
        (chunk) => {
          if (chunk.choices[0]?.delta?.content) {
            streamContent += chunk.choices[0].delta.content;
            process.stdout.write(chunk.choices[0].delta.content);
          }
        },
        { max_tokens: 50 }
      );
      console.log('\n✅ Streaming test completed!');
    } catch (error) {
      console.log(`❌ Streaming test failed: ${error.message}`);
    }

    // Show final configuration
    console.log('\n🎉 Z.ai Integration Test Complete!');
    console.log('\n📝 Next Steps:');
    console.log('1. Use "npx claude-flow provider --status" to check provider status');
    console.log('2. Use "npx claude-flow provider --test" to test the connection');
    console.log('3. Use "npx claude-flow provider --list" to see all providers');
    console.log('4. Start using Z.ai in your Claude-Flow workflows!');

    // Cleanup
    zaiClient.destroy();

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    if (error.stack) {
      console.error('Stack trace:', error.stack);
    }
    process.exit(1);
  }
}

// Run the test
testZaiIntegration().catch(console.error);

