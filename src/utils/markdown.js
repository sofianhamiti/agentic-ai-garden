import matter from 'gray-matter'

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
