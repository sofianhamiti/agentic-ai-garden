/**
 * Validate if an image URL is potentially valid
 * @param {string} url - Image URL to validate
 * @returns {boolean} - Whether the URL appears valid
 */
export function isValidImageUrl(url) {
  if (!url || typeof url !== 'string') return false
  
  // Check for common image file extensions
  const imageExtensions = /\.(jpg|jpeg|png|gif|webp|svg|bmp|ico)(\?.*)?$/i
  
  // Check for data URLs
  const dataUrl = /^data:image\//i
  
  // Check for protocol-relative or absolute URLs
  const validUrl = /^(https?:)?\/\//i
  
  return imageExtensions.test(url) || dataUrl.test(url) || validUrl.test(url)
}

/**
 * Get default image for content type
 * @param {string} type - Content type (blogs, videos, workshops, templates, use-cases)
 * @returns {string} - Path to default image
 */
export function getDefaultImage(type) {
  // Use AWS logo for all content types as fallback
  // Account for Vite base URL configuration
  return '/agentic-ai-garden/images/aws-logo.svg'
}

/**
 * Get image for content item with validation and fallback
 * @param {Object} item - Content item
 * @returns {string} - Image path (validated or fallback)
 */
export function getContentImage(item) {
  // Return validated image if available
  if (item?.image && isValidImageUrl(item.image)) {
    return item.image
  }
  
  // Otherwise return default image based on type
  return getDefaultImage(item?.type)
}

/**
 * Get appropriate alt text for content item
 * @param {Object} item - Content item
 * @returns {string} - Alt text for the image
 */
export function getContentAltText(item) {
  // If custom alt text is provided, use it
  if (item?.imageAlt) {
    return item.imageAlt
  }
  
  // If using AWS logo fallback, provide descriptive alt text
  if (!item?.image || !isValidImageUrl(item.image)) {
    return `AWS logo representing ${item?.title || 'content'} - ${item?.type || 'resource'}`
  }
  
  // Generate alt text based on content
  const title = item?.title || 'Untitled'
  const type = item?.type || 'resource'
  
  return `${title} - ${type.charAt(0).toUpperCase() + type.slice(1)} thumbnail`
}

/**
 * Resolve image path to ensure it's accessible
 * @param {string} path - Image path
 * @returns {string} - Resolved path
 */
export function resolveImagePath(path) {
  if (!path) return getDefaultImage()
  
  // Handle absolute URLs
  if (/^https?:\/\//i.test(path)) {
    return path
  }
  
  // Handle data URLs
  if (/^data:/i.test(path)) {
    return path
  }
  
  // Handle relative paths - ensure they start with /
  if (!path.startsWith('/')) {
    path = `/${path}`
  }
  
  return path
}

/**
 * Get content type display name
 * @param {string} type - Content type
 * @returns {string} - Display name for the type
 */
export function getContentTypeDisplayName(type) {
  const typeMap = {
    'blogs': 'Blog',
    'videos': 'Video',
    'workshops': 'Workshop',
    'templates': 'Template',
    'use-cases': 'Use Case',
    'patterns': 'Pattern'
  }
  
  return typeMap[type] || type?.charAt(0).toUpperCase() + type?.slice(1) || 'Resource'
}
