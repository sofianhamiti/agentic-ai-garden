import MarkdownIt from 'markdown-it'
import hljs from 'highlight.js'

// Configure highlight.js
hljs.configure({
  languages: ['javascript', 'typescript', 'python', 'bash', 'json', 'yaml', 'html', 'css', 'java', 'go', 'rust', 'sql']
})

// Initialize markdown-it with configuration optimized for github-markdown-css
const md = new MarkdownIt({
  html: true,        // Enable HTML tags in source
  breaks: false,     // Don't convert '\n' in paragraphs into <br> for better typography
  linkify: true,     // Autoconvert URL-like text to links
  typographer: true, // Enable some language-neutral replacement + quotes beautification
  highlight: function (str, lang) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        const highlighted = hljs.highlight(str, { language: lang })
        return `<pre class="hljs"><code class="hljs language-${lang}">${highlighted.value}</code></pre>`
      } catch (error) {
        console.warn('Syntax highlighting failed:', error)
      }
    }
    
    // Fallback for unknown languages or errors
    return `<pre class="hljs"><code class="hljs">${md.utils.escapeHtml(str)}</code></pre>`
  }
})

/**
 * Simple YAML frontmatter parser for browser compatibility
 * @param {string} yamlString - YAML string to parse
 * @returns {Object} - Parsed YAML object
 */
function parseYAML(yamlString) {
  const result = {}
  const lines = yamlString.trim().split('\n')
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim()
    if (!line || line.startsWith('#')) continue
    
    // Handle simple key-value pairs
    const colonIndex = line.indexOf(':')
    if (colonIndex === -1) continue
    
    const key = line.substring(0, colonIndex).trim()
    let value = line.substring(colonIndex + 1).trim()
    
    // Remove quotes if present
    if ((value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1)
    }
    
    // Handle arrays (simple format: "- item")
    if (value === '' && i + 1 < lines.length) {
      const arrayItems = []
      let j = i + 1
      
      while (j < lines.length) {
        const nextLine = lines[j].trim()
        if (nextLine.startsWith('- ')) {
          arrayItems.push(nextLine.substring(2).trim())
          j++
        } else if (nextLine === '' || nextLine.startsWith('#')) {
          j++
        } else {
          break
        }
      }
      
      if (arrayItems.length > 0) {
        result[key] = arrayItems
        i = j - 1
        continue
      }
    }
    
    // Handle boolean values
    if (value === 'true') {
      result[key] = true
    } else if (value === 'false') {
      result[key] = false
    } else if (value === '[]') {
      // Handle empty arrays
      result[key] = []
    } else if (!isNaN(value) && value !== '') {
      // Handle numbers
      result[key] = Number(value)
    } else {
      result[key] = value
    }
  }
  
  return result
}

/**
 * Parse markdown file with frontmatter
 * @param {string} rawContent - Raw markdown content with frontmatter
 * @returns {Object} - Parsed frontmatter and content
 */
export function parseMarkdownFile(rawContent) {
  if (!rawContent || typeof rawContent !== 'string') {
    console.error('parseMarkdownFile expects a string, got:', typeof rawContent)
    return {
      frontmatter: {},
      content: '',
      error: 'Invalid content provided'
    }
  }

  try {
    // Check if content starts with frontmatter delimiter
    if (!rawContent.startsWith('---')) {
      console.warn('No frontmatter delimiter found')
      return {
        frontmatter: {},
        content: rawContent,
        error: 'No frontmatter found'
      }
    }

    // Find the end of frontmatter
    const frontmatterEnd = rawContent.indexOf('---', 3)
    if (frontmatterEnd === -1) {
      console.warn('No closing frontmatter delimiter found')
      return {
        frontmatter: {},
        content: rawContent,
        error: 'Invalid frontmatter format'
      }
    }

    // Extract frontmatter and content
    const frontmatterString = rawContent.substring(3, frontmatterEnd).trim()
    const content = rawContent.substring(frontmatterEnd + 3).trim()

    // Parse YAML frontmatter
    const frontmatter = parseYAML(frontmatterString)
    
    return {
      frontmatter,
      content,
      error: null
    }
  } catch (error) {
    console.error('Error parsing markdown frontmatter:', error)
    return {
      frontmatter: {},
      content: rawContent,
      error: error.message
    }
  }
}

/**
 * Transform relative image paths in markdown to work with Vite's asset handling
 * @param {string} markdown - Markdown content
 * @param {string} templateSlug - Template slug for path resolution
 * @param {string} contentType - Content type ('pattern' or 'blueprint')
 * @returns {string} - Markdown with transformed image paths
 */
function transformImagePaths(markdown, templateSlug, contentType = 'blueprint') {
  if (!markdown || !templateSlug) return markdown
  
  // Transform relative image paths (./image.ext) to absolute paths
  let basePath
  if (contentType === 'pattern') {
    basePath = `/agentic-ai-garden/src/data/content/discover/patterns/${templateSlug}`
  } else {
    basePath = `/agentic-ai-garden/src/data/content/build/templates/${templateSlug}`
  }
  
  return markdown.replace(
    /!\[([^\]]*)\]\(\.\/([^)]+\.(svg|png|jpg|jpeg|gif|webp|bmp|tiff|ico))\)/gi,
    `![$1](${basePath}/$2)`
  )
}

/**
 * Process all images (including SVGs) to prevent flickering and ensure proper sizing
 * @param {string} html - HTML content that may contain images
 * @returns {string} - HTML with processed image elements
 */
function processImageContent(html) {
  if (!html || typeof html !== 'string') return html
  
  // Process SVG elements - remove hardcoded dimensions and add constraints
  html = html.replace(/<svg([^>]*?)>/gi, (match, attributes) => {
    // Remove width and height attributes but preserve viewBox
    let processedAttributes = attributes
      .replace(/\s*width\s*=\s*["'][^"']*["']/gi, '')
      .replace(/\s*height\s*=\s*["'][^"']*["']/gi, '')
    
    // Add comprehensive styling to prevent flickering
    processedAttributes += ' style="max-width: 100% !important; max-height: 400px !important; width: auto !important; height: auto !important; display: block !important; margin: 1.5rem auto !important; object-fit: contain !important;"'
    
    return `<svg${processedAttributes}>`
  })
  
  // Process regular img tags to add immediate size constraints
  html = html.replace(/<img([^>]*?)>/gi, (match, attributes) => {
    // Check if style attribute already exists
    const hasStyle = /style\s*=/.test(attributes)
    
    if (hasStyle) {
      // Append to existing style
      return match.replace(/style\s*=\s*["']([^"']*?)["']/gi, (styleMatch, existingStyle) => {
        const newStyle = existingStyle + '; max-width: 100% !important; max-height: 400px !important; width: auto !important; height: auto !important; display: block !important; margin: 1.5rem auto !important; object-fit: contain !important;'
        return `style="${newStyle}"`
      })
    } else {
      // Add new style attribute
      return match.replace('>', ' style="max-width: 100% !important; max-height: 400px !important; width: auto !important; height: auto !important; display: block !important; margin: 1.5rem auto !important; object-fit: contain !important;">')
    }
  })
  
  return html
}

/**
 * Render markdown content to HTML
 * @param {string} markdown - Markdown content to render
 * @param {string} templateSlug - Optional template slug for image path resolution
 * @param {string} contentType - Optional content type ('pattern' or 'blueprint')
 * @returns {string} - Rendered HTML
 */
export function renderMarkdown(markdown, templateSlug = null, contentType = 'blueprint') {
  if (!markdown) return ''
  
  if (typeof markdown !== 'string') {
    console.error('renderMarkdown expects a string, got:', typeof markdown, markdown)
    return `<p class="error">Error: Content must be a string, received ${typeof markdown}</p>`
  }
  
  try {
    // Transform image paths if templateSlug is provided
    const processedMarkdown = templateSlug ? transformImagePaths(markdown, templateSlug, contentType) : markdown
    
    // Render markdown to HTML
    let html = md.render(processedMarkdown)
    
    // Process all image content to prevent flickering and fix sizing issues
    html = processImageContent(html)
    
    return html
  } catch (error) {
    console.error('Error rendering markdown:', error)
    return `<p class="error">Error rendering content: ${error.message}</p>`
  }
}

/**
 * Format a date string
 * @param {string} dateString - Date string in format YYYY-MM-DD
 * @returns {string} - Formatted date string
 */
export function formatDate(dateString) {
  if (!dateString) return ''
  
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) {
      return dateString // Return original if invalid
    }
    
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date)
  } catch (error) {
    console.warn('Error formatting date:', error)
    return dateString
  }
}
