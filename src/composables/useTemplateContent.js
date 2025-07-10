import { ref } from 'vue'
import { parseMarkdownFile, renderMarkdown } from '../utils/markdown'

// Pre-load all template markdown files using glob import
const templateModules = import.meta.glob('../data/content/build/templates/*/template.md', {
  query: '?raw',
  import: 'default'
})

// Pre-load all architecture images using glob import
const architectureImages = import.meta.glob('../data/content/build/templates/*/architecture.svg', {
  query: '?url',
  import: 'default'
})

/**
 * Simplified composable for template content loading
 */
export function useTemplateContent() {
  const isLoading = ref(false)
  const error = ref(null)

  /**
   * Process template data for consistency
   * @param {Object} frontmatter - Raw frontmatter
   * @returns {Object} - Processed frontmatter
   */
  const processTemplateData = (frontmatter) => {
    if (!frontmatter) return {}

    const processed = { ...frontmatter }

    // Field mappings for consistency
    if (processed['gitHub'] && !processed['github']) {
      processed['github'] = processed['gitHub']
      delete processed['gitHub']
    }

    // Ensure array fields are arrays
    const arrayFields = ['frameworks', 'services']
    arrayFields.forEach(field => {
      if (processed[field] && !Array.isArray(processed[field])) {
        processed[field] = [processed[field]]
      }
    })

    return processed
  }

  /**
   * Load template data from markdown file
   * @param {string} slug - Template slug
   * @returns {Object} - { frontmatter, content, error }
   */
  const loadTemplateData = async (slug) => {
    isLoading.value = true
    error.value = null
    
    try {
      // Find the template module for this slug
      const templatePath = `../data/content/build/templates/${slug}/template.md`
      const templateLoader = templateModules[templatePath]
      
      if (!templateLoader) {
        throw new Error(`Template ${slug} not found`)
      }
      
      // Load template.md
      const rawContent = await templateLoader()
      const { frontmatter, content } = parseMarkdownFile(rawContent)
      
      // Process template data
      const processedFrontmatter = processTemplateData(frontmatter)
      
      // Render content
      const renderedContent = renderMarkdown(content)
      
      return {
        frontmatter: processedFrontmatter,
        content: renderedContent,
        error: null
      }
      
    } catch (err) {
      console.error('Error loading template data:', err)
      const errorMessage = `Template ${slug} not found`
      error.value = errorMessage
      return {
        frontmatter: {},
        content: '',
        error: errorMessage
      }
    } finally {
      isLoading.value = false
    }
  }

  /**
   * Load architecture image for template
   * @param {string} slug - Template slug
   * @returns {string} - Image URL
   */
  const loadArchitectureImage = async (slug) => {
    const architecturePath = `../data/content/build/templates/${slug}/architecture.svg`
    const architectureLoader = architectureImages[architecturePath]
    
    if (architectureLoader) {
      try {
        const url = await architectureLoader()
        return url
      } catch {
        // Fallback to default AWS logo
        return '/images/aws-logo.svg'
      }
    } else {
      // Fallback to default AWS logo
      return '/images/aws-logo.svg'
    }
  }

  return {
    loadTemplateData,
    loadArchitectureImage,
    processTemplateData,
    isLoading,
    error
  }
}
