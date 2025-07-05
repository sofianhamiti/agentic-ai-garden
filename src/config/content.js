export const CONTENT_CONFIG = {
  // Content source: 'local' (content fetched at build-time via GitHub Actions)
  source: 'local',
  
  // GitHub configuration (used by GitHub Actions, not client-side)
  github: {
    owner: 'sofianhamiti',
    repo: 'agentic-ai-garden-content',
    branch: 'main'
  },
  
  // Local configuration - content is fetched at build-time and available locally
  local: {
    basePath: '../data/content'
  }
}