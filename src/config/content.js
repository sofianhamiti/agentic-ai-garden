export const CONTENT_CONFIG = {
  // Content source: 'local' or 'github'
  source: 'github',
  
  // GitHub configuration (only used when source is 'github')
  github: {
    owner: 'sofianhamiti',
    repo: 'agentic-ai-garden-content',
    branch: 'main',
    basePath: '', // Empty string for root-level folders
    // Optional: GitHub token for higher rate limits (store in .env)
    // token: import.meta.env.VITE_GITHUB_TOKEN
  },
  
  // Local configuration (only used when source is 'local')
  local: {
    basePath: '../data/content'
  }
}