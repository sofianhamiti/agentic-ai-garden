import { computed } from 'vue'
import { useRoute } from 'vue-router'

/**
 * Composable for handling contextual back navigation
 * Returns appropriate back route and label based on current content type
 */
export function useBackNavigation() {
  const route = useRoute()
  
  // Determine content type from current route
  const contentType = computed(() => {
    const path = route.path
    if (path.includes('/build/blueprints/')) {
      return 'blueprint'
    } else if (path.includes('/build/templates/')) {
      return 'template'
    } else if (path.includes('/discover/patterns/')) {
      return 'pattern'
    }
    return null
  })
  
  // Get contextual back route and label
  const backNavigation = computed(() => {
    switch (contentType.value) {
      case 'blueprint':
      case 'template':
        return {
          to: '/build',
          label: '← Back to Build',
          filterParam: contentType.value === 'blueprint' ? 'blueprints' : 'templates'
        }
      case 'pattern':
        return {
          to: '/discover',
          label: '← Back to Discover',
          filterParam: 'patterns' // Could be used for filtering if supported
        }
      default:
        return {
          to: '/',
          label: '← Back to Home',
          filterParam: null
        }
    }
  })
  
  return {
    contentType,
    backNavigation
  }
}