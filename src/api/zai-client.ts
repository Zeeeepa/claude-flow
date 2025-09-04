/**
 * Z.ai API Client for Claude-Flow
 * Provides integration with Z.ai's GLM-4.5 model through OpenAI-compatible API
 */

import { EventEmitter } from 'events';
import { ILogger } from '../core/logger.js';
import { ConfigManager } from '../config/config-manager.js';
import { getErrorMessage } from '../utils/error-handler.js';
import { 
  ClaudeAPIError,
  ClaudeInternalServerError,
  ClaudeServiceUnavailableError,
  ClaudeRateLimitError,
  ClaudeTimeoutError,
  ClaudeNetworkError,
  ClaudeAuthenticationError,
  ClaudeValidationError,
  HealthCheckResult,
  getUserFriendlyError,
} from './claude-api-errors.js';
import { circuitBreaker, CircuitBreaker } from '../utils/helpers.js';

export interface ZaiAPIConfig {
  apiKey: string;
  apiUrl?: string;
  model?: ZaiModel;
  temperature?: number;
  maxTokens?: number;
  topP?: number;
  systemPrompt?: string;
  timeout?: number;
  retryAttempts?: number;
  retryDelay?: number;
  enableHealthCheck?: boolean;
  healthCheckInterval?: number;
  circuitBreakerThreshold?: number;
  circuitBreakerTimeout?: number;
  circuitBreakerResetTimeout?: number;
  retryJitter?: boolean;
}

export type ZaiModel = 'glm-4.5' | 'glm-4' | 'glm-3-turbo';

export interface ZaiMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export interface ZaiRequest {
  model: ZaiModel;
  messages: ZaiMessage[];
  max_tokens?: number;
  temperature?: number;
  top_p?: number;
  stream?: boolean;
  stop?: string[];
}

export interface ZaiResponse {
  id: string;
  object: 'chat.completion';
  created: number;
  model: ZaiModel;
  choices: Array<{
    index: number;
    message: {
      role: 'assistant';
      content: string;
    };
    finish_reason: 'stop' | 'length' | 'content_filter';
  }>;
  usage: {
    prompt_tokens: number;
    completion_tokens: number;
    total_tokens: number;
  };
}

export interface ZaiStreamEvent {
  id: string;
  object: 'chat.completion.chunk';
  created: number;
  model: ZaiModel;
  choices: Array<{
    index: number;
    delta: {
      role?: 'assistant';
      content?: string;
    };
    finish_reason?: 'stop' | 'length' | 'content_filter';
  }>;
}

export class ZaiAPIClient extends EventEmitter {
  private config: ZaiAPIConfig;
  private logger: ILogger;
  private configManager: ConfigManager;
  private circuitBreaker: CircuitBreaker;
  private lastHealthCheck?: HealthCheckResult;
  private healthCheckTimer?: NodeJS.Timeout;

  constructor(logger: ILogger, configManager: ConfigManager, config?: Partial<ZaiAPIConfig>) {
    super();
    this.logger = logger;
    this.configManager = configManager;
    this.config = this.loadConfiguration(config);
    
    // Initialize circuit breaker
    this.circuitBreaker = circuitBreaker('zai-api', {
      threshold: this.config.circuitBreakerThreshold || 5,
      timeout: this.config.circuitBreakerTimeout || 60000,
      resetTimeout: this.config.circuitBreakerResetTimeout || 300000,
    });

    // Start health check if enabled
    if (this.config.enableHealthCheck) {
      this.startHealthCheck();
    }
  }

  /**
   * Load configuration with Z.ai defaults
   */
  private loadConfiguration(overrides?: Partial<ZaiAPIConfig>): ZaiAPIConfig {
    const config: ZaiAPIConfig = {
      apiKey: '',
      apiUrl: 'https://api.z.ai/v1/chat/completions',
      model: 'glm-4.5',
      temperature: 0.7,
      maxTokens: 4096,
      topP: 1,
      systemPrompt: undefined,
      timeout: 60000,
      retryAttempts: 3,
      retryDelay: 1000,
      enableHealthCheck: true,
      healthCheckInterval: 300000, // 5 minutes
      circuitBreakerThreshold: 5,
      circuitBreakerTimeout: 60000,
      circuitBreakerResetTimeout: 300000,
      retryJitter: true,
    };

    // Load from environment
    if (process.env.ZAI_API_KEY) {
      config.apiKey = process.env.ZAI_API_KEY;
    }

    if (process.env.ZAI_API_URL) {
      config.apiUrl = process.env.ZAI_API_URL;
    }

    if (process.env.ZAI_MODEL) {
      config.model = process.env.ZAI_MODEL as ZaiModel;
    }

    // Apply overrides
    return { ...config, ...overrides };
  }

  /**
   * Send a message to Z.ai API
   */
  async sendMessage(
    messages: ZaiMessage[],
    options?: Partial<ZaiRequest>
  ): Promise<ZaiResponse> {
    this.logger.debug('Sending message to Z.ai API', {
      messageCount: messages.length,
      model: this.config.model,
    });

    if (!this.config.apiKey) {
      throw new ClaudeAuthenticationError('Z.ai API key is required');
    }

    const request: ZaiRequest = {
      model: this.config.model!,
      messages,
      max_tokens: this.config.maxTokens,
      temperature: this.config.temperature,
      top_p: this.config.topP,
      stream: false,
      ...options,
    };

    try {
      return await this.circuitBreaker.execute(async () => {
        const response = await this.makeRequest(request);
        this.emit('message_sent', { request, response });
        return response;
      });
    } catch (error) {
      this.logger.error('Failed to send message to Z.ai API', {
        error: getErrorMessage(error),
        model: this.config.model,
      });
      
      const apiError = this.handleAPIError(error);
      this.emit('error', apiError);
      throw apiError;
    }
  }

  /**
   * Send a streaming message to Z.ai API
   */
  async sendStreamingMessage(
    messages: ZaiMessage[],
    onChunk: (chunk: ZaiStreamEvent) => void,
    options?: Partial<ZaiRequest>
  ): Promise<void> {
    this.logger.debug('Sending streaming message to Z.ai API', {
      messageCount: messages.length,
      model: this.config.model,
    });

    if (!this.config.apiKey) {
      throw new ClaudeAuthenticationError('Z.ai API key is required');
    }

    const request: ZaiRequest = {
      model: this.config.model!,
      messages,
      max_tokens: this.config.maxTokens,
      temperature: this.config.temperature,
      top_p: this.config.topP,
      stream: true,
      ...options,
    };

    try {
      await this.circuitBreaker.execute(async () => {
        await this.makeStreamingRequest(request, onChunk);
        this.emit('streaming_message_sent', { request });
      });
    } catch (error) {
      this.logger.error('Failed to send streaming message to Z.ai API', {
        error: getErrorMessage(error),
        model: this.config.model,
      });
      
      const apiError = this.handleAPIError(error);
      this.emit('error', apiError);
      throw apiError;
    }
  }

  /**
   * Make HTTP request to Z.ai API
   */
  private async makeRequest(request: ZaiRequest): Promise<ZaiResponse> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

    try {
      const response = await fetch(this.config.apiUrl!, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.apiKey}`,
          'User-Agent': 'Claude-Flow/2.0.0',
        },
        body: JSON.stringify(request),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      return data as ZaiResponse;
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  /**
   * Make streaming HTTP request to Z.ai API
   */
  private async makeStreamingRequest(
    request: ZaiRequest,
    onChunk: (chunk: ZaiStreamEvent) => void
  ): Promise<void> {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

    try {
      const response = await fetch(this.config.apiUrl!, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.config.apiKey}`,
          'User-Agent': 'Claude-Flow/2.0.0',
        },
        body: JSON.stringify(request),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP ${response.status}: ${errorText}`);
      }

      if (!response.body) {
        throw new Error('No response body for streaming request');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data === '[DONE]') return;

              try {
                const parsed = JSON.parse(data) as ZaiStreamEvent;
                onChunk(parsed);
              } catch (parseError) {
                this.logger.warn('Failed to parse streaming chunk', { data });
              }
            }
          }
        }
      } finally {
        reader.releaseLock();
      }
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    }
  }

  /**
   * Handle API errors and convert to appropriate error types
   */
  private handleAPIError(error: any): ClaudeAPIError {
    const message = getErrorMessage(error);

    if (error.name === 'AbortError') {
      return new ClaudeTimeoutError('Request timed out');
    }

    if (message.includes('401') || message.includes('unauthorized')) {
      return new ClaudeAuthenticationError('Invalid Z.ai API key');
    }

    if (message.includes('429') || message.includes('rate limit')) {
      return new ClaudeRateLimitError('Z.ai API rate limit exceeded');
    }

    if (message.includes('500') || message.includes('502') || message.includes('503')) {
      return new ClaudeInternalServerError('Z.ai API server error');
    }

    if (message.includes('400') || message.includes('bad request')) {
      return new ClaudeValidationError('Invalid request to Z.ai API');
    }

    if (error.code === 'ECONNREFUSED' || error.code === 'ENOTFOUND') {
      return new ClaudeNetworkError('Cannot connect to Z.ai API');
    }

    return new ClaudeAPIError(`Z.ai API error: ${message}`);
  }

  /**
   * Perform health check
   */
  async performHealthCheck(): Promise<HealthCheckResult> {
    const startTime = Date.now();
    
    try {
      const testMessage: ZaiMessage = {
        role: 'user',
        content: 'Hello, this is a health check.',
      };

      await this.sendMessage([testMessage], { max_tokens: 10 });

      const result: HealthCheckResult = {
        healthy: true,
        responseTime: Date.now() - startTime,
        timestamp: new Date(),
        details: {
          apiUrl: this.config.apiUrl!,
          model: this.config.model!,
        },
      };

      this.lastHealthCheck = result;
      this.emit('health_check', result);
      return result;
    } catch (error) {
      const result: HealthCheckResult = {
        healthy: false,
        responseTime: Date.now() - startTime,
        timestamp: new Date(),
        error: getErrorMessage(error),
        details: {
          apiUrl: this.config.apiUrl!,
          model: this.config.model!,
        },
      };

      this.lastHealthCheck = result;
      this.emit('health_check', result);
      return result;
    }
  }

  /**
   * Start periodic health checks
   */
  private startHealthCheck(): void {
    if (this.healthCheckTimer) {
      clearInterval(this.healthCheckTimer);
    }

    this.healthCheckTimer = setInterval(
      () => this.performHealthCheck(),
      this.config.healthCheckInterval!
    );

    // Perform initial health check
    this.performHealthCheck();
  }

  /**
   * Stop health checks
   */
  stopHealthCheck(): void {
    if (this.healthCheckTimer) {
      clearInterval(this.healthCheckTimer);
      this.healthCheckTimer = undefined;
    }
  }

  /**
   * Get last health check result
   */
  getLastHealthCheck(): HealthCheckResult | undefined {
    return this.lastHealthCheck;
  }

  /**
   * Update configuration
   */
  updateConfig(newConfig: Partial<ZaiAPIConfig>): void {
    this.config = { ...this.config, ...newConfig };
    
    if (newConfig.enableHealthCheck !== undefined) {
      if (newConfig.enableHealthCheck) {
        this.startHealthCheck();
      } else {
        this.stopHealthCheck();
      }
    }
  }

  /**
   * Get current configuration (with sensitive data masked)
   */
  getConfig(): Partial<ZaiAPIConfig> {
    const { apiKey, ...safeConfig } = this.config;
    return {
      ...safeConfig,
      apiKey: apiKey ? '****...****' : undefined,
    };
  }

  /**
   * Cleanup resources
   */
  destroy(): void {
    this.stopHealthCheck();
    this.removeAllListeners();
  }
}

