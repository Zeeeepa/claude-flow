# API Key Setup for Claude-Flow

This guide provides detailed instructions for obtaining and configuring API keys for Claude-Flow.

## Anthropic API Key

Claude-Flow primarily uses the Anthropic API to interact with Claude models. Here's how to obtain and configure your Anthropic API key:

### 1. Obtaining an Anthropic API Key

1. Go to [Anthropic's Console](https://console.anthropic.com/)
2. Sign up or log in to your account
3. Navigate to the API Keys section
4. Click "Create API Key"
5. Give your key a name (e.g., "Claude-Flow")
6. Select the appropriate permissions (Claude API access is required)
7. Click "Create"
8. Copy the API key immediately (you won't be able to see it again)

### 2. Configuring the API Key in Your Environment

#### Option 1: Environment Variables (Recommended)

Set the API key as an environment variable:

```bash
# For Linux/macOS
export ANTHROPIC_API_KEY=your_api_key_here

# For Windows Command Prompt
set ANTHROPIC_API_KEY=your_api_key_here

# For Windows PowerShell
$env:ANTHROPIC_API_KEY="your_api_key_here"
```

To make this permanent:

```bash
# For Linux/macOS (add to ~/.bashrc or ~/.zshrc)
echo 'export ANTHROPIC_API_KEY=your_api_key_here' >> ~/.bashrc
source ~/.bashrc

# For Windows, add it to your system environment variables
# Control Panel > System > Advanced System Settings > Environment Variables
```

#### Option 2: Configuration File

Create a `.env` file in your project directory:

```
ANTHROPIC_API_KEY=your_api_key_here
```

Then, in your project, use a package like `dotenv` to load the environment variables:

```javascript
require('dotenv').config();
// Now process.env.ANTHROPIC_API_KEY is available
```

#### Option 3: Claude-Flow Configuration

Claude-Flow also supports storing API keys in its configuration:

```bash
# Set the API key in Claude-Flow's configuration
claude-flow config set apiKey.anthropic your_api_key_here
```

### 3. Verifying the API Key

To verify that your API key is correctly configured:

```bash
# Check if the environment variable is set
echo $ANTHROPIC_API_KEY

# Test the API key with Claude-Flow
claude-flow test api-key
```

## Additional API Keys (Optional)

Depending on your use case, you might need additional API keys:

### GitHub API Key (for GitHub Integration)

1. Go to [GitHub's Personal Access Tokens page](https://github.com/settings/tokens)
2. Click "Generate new token"
3. Give your token a name
4. Select the appropriate scopes (repo, workflow, etc.)
5. Click "Generate token"
6. Copy the token and set it as an environment variable:

```bash
export GITHUB_TOKEN=your_github_token_here
```

### Database Connection Strings (for Database Integration)

If you're using a database with Claude-Flow:

```bash
# PostgreSQL example
export DATABASE_URL=postgresql://username:password@localhost:5432/database_name
```

## Troubleshooting API Key Issues

### API Key Not Found

If Claude-Flow can't find your API key:

1. Verify that the environment variable is set correctly:
   ```bash
   echo $ANTHROPIC_API_KEY
   ```

2. Make sure the variable name is exactly `ANTHROPIC_API_KEY`

3. Try setting the key directly in your code:
   ```javascript
   process.env.ANTHROPIC_API_KEY = 'your_api_key_here';
   ```

### API Key Invalid

If your API key is rejected:

1. Verify that you've copied the entire key correctly

2. Check if your key has expired or been revoked in the Anthropic Console

3. Ensure you have sufficient credits or quota for the API calls

4. Check if there are any IP restrictions on your API key

### Rate Limiting

If you're experiencing rate limiting:

1. Check your usage in the Anthropic Console

2. Consider implementing retry logic with exponential backoff

3. Optimize your prompts to reduce token usage

## Best Practices for API Key Security

1. **Never hardcode API keys** in your source code

2. **Don't commit API keys** to version control

3. **Use environment variables** or secure secret management

4. **Rotate API keys** periodically

5. **Set appropriate permissions** for your API keys

6. **Monitor API key usage** for unusual activity

7. **Use different API keys** for development and production

## Next Steps

Now that you've set up your API keys, you can proceed to:

1. [Quick Start Guide](quick-start-guide.md) - Get started with Claude-Flow
2. [PRD Implementation Guide](prd-implementation-guide.md) - Learn how to implement PRD requirements
3. [Example Projects](examples/) - Explore example projects using Claude-Flow

