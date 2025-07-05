/**
 * Get default image for content type
 * @param {string} type - Content type (blogs, videos, workshops)
 * @returns {string} - Path to default image
 */
export function getDefaultImage(type) {
  // Use AWS logo for all content types
  return '/images/aws-logo.svg'
}

/**
 * Get image for content item with fallback to default
 * @param {Object} item - Content item
 * @returns {string} - Image path
 */
export function getContentImage(item) {
  // Return image if available
  if (item.image) {
    return item.image
  }
  
  // Otherwise return default image based on type
  return getDefaultImage(item.type)
}
