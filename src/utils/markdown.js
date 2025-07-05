import matter from 'gray-matter'
import MarkdownIt from 'markdown-it'

// Initialize markdown-it with plugins
const md = new MarkdownIt({
  html: true,        // Enable HTML tags in source
  breaks: true,      // Convert '\n' in paragraphs into <br>
  linkify: true,     // Autoconvert URL-like text to links
  typographer: true  // Enable some language-neutral replacement + quotes beautification
})

/**
 * Parse markdown content with frontmatter
 * @param {string} content - Raw markdown content with frontmatter
 * @returns {Object} - Parsed frontmatter data and content body
 */
export function parseMarkdown(content) {
  const { data, content: body } = matter(content)
  return {
    ...data,
    body
  }
}

/**
 * Render markdown content to HTML
 * @param {string} markdown - Markdown content to render
 * @returns {string} - Rendered HTML
 */
export function renderMarkdown(markdown) {
  if (!markdown) return ''
  
  // Ensure we have a string
  if (typeof markdown !== 'string') {
    console.error('renderMarkdown expects a string, got:', typeof markdown, markdown)
    return `<p>Error: Content must be a string, received ${typeof markdown}</p>`
  }
  
  try {
    return md.render(markdown)
  } catch (error) {
    console.error('Error rendering markdown:', error)
    return `<p>Error rendering content: ${error.message}</p>`
  }
}

/**
 * Format a date string
 * @param {string} dateString - Date string in format YYYY-MM-DD
 * @returns {string} - Formatted date string
 */
export function formatDate(dateString) {
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  }).format(date)
}
