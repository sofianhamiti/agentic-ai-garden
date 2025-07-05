import { ref } from 'vue'
import { CONTENT_CONFIG } from '../config/content'

export function useGitHubContentLoader() {
  const content = ref([])
  const isLoading = ref(false)
  const error = ref(null)

  const parseMarkdownFrontmatter = (content) => {
    const frontmatterRegex = /^---\s*\n([\s\S]*?)\n---\s*\n([\s\S]*)$/
    const match = content.match(frontmatterRegex)
    
    if (!match) {
      return { frontmatter: {}, content }
    }

    const [, frontmatterStr, markdownContent] = match
    const frontmatter = {}
    
    frontmatterStr.split('\n').forEach(line => {
      const [key, ...valueParts] = line.split(':')
      if (key && valueParts.length) {
        const value = valueParts.join(':').trim()
        try {
          frontmatter[key.trim()] = value.startsWith('[') ? JSON.parse(value) : value.replace(/^["']|["']$/g, '')
        } catch {
          frontmatter[key.trim()] = value.replace(/^["']|["']$/g, '')
        }
      }
    })

    return { frontmatter, content: markdownContent }
  }

  const fetchDirectoryContents = async (path) => {
    const { owner, repo, branch, token } = CONTENT_CONFIG.github
    const url = `https://api.github.com/repos/${owner}/${repo}/contents/${path}?ref=${branch}`
    
    const headers = {
      'Accept': 'application/vnd.github.v3+json'
    }
    
    if (token) {
      headers['Authorization'] = `token ${token}`
    }
    
    try {
      const response = await fetch(url, { headers })
      if (!response.ok) throw new Error(`GitHub API error: ${response.status}`)
      return await response.json()
    } catch (err) {
      console.error(`Error fetching directory ${path}:`, err)
      return []
    }
  }

  const fetchFileContent = async (downloadUrl) => {
    try {
      const response = await fetch(downloadUrl)
      if (!response.ok) throw new Error(`File fetch error: ${response.status}`)
      return await response.text()
    } catch (err) {
      console.error('Error fetching file content:', err)
      return null
    }
  }

  const loadContentFromGitHub = async (section = 'learn') => {
    isLoading.value = true
    error.value = null
    
    try {
      const contentItems = []
      const sectionPath = CONTENT_CONFIG.github.basePath ? `${CONTENT_CONFIG.github.basePath}/${section}` : section
      
      // Get subdirectories (blogs, videos, workshops, etc.)
      const subdirs = await fetchDirectoryContents(sectionPath)
      
      for (const subdir of subdirs.filter(item => item.type === 'dir')) {
        const files = await fetchDirectoryContents(subdir.path)
        
        for (const file of files.filter(item => item.name.endsWith('.md'))) {
          const fileContent = await fetchFileContent(file.download_url)
          if (!fileContent) continue

          const { frontmatter } = parseMarkdownFrontmatter(fileContent)
          
          const slug = file.name.replace('.md', '')
          const type = subdir.name
          
          contentItems.push({
            id: frontmatter.id || slug,
            title: frontmatter.title || 'Untitled',
            excerpt: frontmatter.description || frontmatter.excerpt || '',
            url: frontmatter.url || '#',
            image: frontmatter.image || null,
            type,
            date: frontmatter.date || new Date().toISOString().split('T')[0],
            skillLevel: frontmatter.skillLevel || '',
            frameworks: frontmatter.frameworks || [],
            services: frontmatter.services || [],
            components: frontmatter.components || [],
            category: frontmatter.category || '',
            path: file.path
          })
        }
      }
      
      content.value = contentItems.sort((a, b) => new Date(b.date) - new Date(a.date))
      
    } catch (err) {
      console.error('Error loading GitHub content:', err)
      error.value = err.message || 'Failed to load content from GitHub'
    } finally {
      isLoading.value = false
    }
  }

  return {
    content,
    isLoading,
    error,
    loadContentFromGitHub
  }
}