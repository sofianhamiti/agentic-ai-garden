import { ref, computed } from 'vue'
import { createGlobalState, useStorage } from '@vueuse/core'
import filterConfig from '../config/filters'
import { CONTENT_CONFIG } from '../config/content'
import { parseMarkdownFile } from '../utils/markdown'

/**
 * Global filter state using VueUse createGlobalState
 * This ensures a single source of truth for filters across components
 */
export const useFilterState = createGlobalState(() => {
  // Use useStorage for persist-ability with a simpler structure
  const filters = useStorage('content-filter-state', {
    page: 'build', // Default to 'build' page
    type: 'all',
    time: 'all',
    skillLevel: '',
    frameworks: [],
    services: [],
    searchQuery: ''
  })

  // Clear all filters
  const clearAllFilters = () => {
    // Preserve the page value when clearing filters
    const currentPage = filters.value.page
    filters.value = {
      page: currentPage, // Keep the current page
      type: 'all',
      time: 'all',
      skillLevel: '',
      frameworks: [],
      services: [],
      searchQuery: ''
    }
  }

  return {
    filters,
    clearAllFilters
  }
})

/**
 * Composable for loading and filtering markdown content
 * @returns {Object} - Functions and state for content management
 */
export function useContentLoader() {
  const content = ref([])
  const isLoading = ref(true)
  const error = ref(null)
  
  // Get the global filter state
  const { filters, clearAllFilters } = useFilterState()
  

  /**
   * Count resources in a specific section without loading full content
   * @param {string} section - Section name (build, learn, etc.)
   * @returns {Promise<number>} - Number of resources in the section
   */
  const countResourcesBySection = async (section) => {
    try {
      // Get modules for the section
      let modules = {}
      
      if (section === 'build') {
        modules = {
          ...import.meta.glob('../data/content/build/blueprints/**/template.md'),
          ...import.meta.glob('../data/content/build/repositories/*.md')
        }
      } else if (section === 'learn') {
        modules = {
          ...import.meta.glob('../data/content/learn/blogs/*.md'),
          ...import.meta.glob('../data/content/learn/videos/*.md'),
          ...import.meta.glob('../data/content/learn/workshops/*.md')
        }
      } else if (section === 'discover') {
        modules = {
          ...import.meta.glob('../data/content/discover/services-frameworks/*.md'),
          ...import.meta.glob('../data/content/discover/patterns/*/pattern.md')
        }
      }
      
      // Simply count the number of modules
      return Object.keys(modules).length
    } catch (err) {
      console.error(`Error counting resources for ${section}:`, err)
      return 0
    }
  }

  /**
   * Load content from markdown files (local or GitHub)
   */
  const loadContent = async () => {
    isLoading.value = true
    error.value = null
    
    try {
      console.log('[useContentLoader] Starting content load, current page:', filters.value.page);
      
      // Load from local files (content fetched at build-time)
      await loadLocalContent()
      
      console.log(`[useContentLoader] Content loaded: ${content.value.length} items`);
      
      // Validate filter type - ensure it's one of the valid values based on current page
      let validTypes = ['all'];
      
      if (filters.value.page === 'build') {
        validTypes = ['all', 'blueprints', 'repositories'];
      } else if (filters.value.page === 'learn') {
        validTypes = ['all', 'blogs', 'videos', 'workshops'];
      } else if (filters.value.page === 'discover') {
        validTypes = ['all', 'services-frameworks', 'patterns'];
      }
      
      if (!validTypes.includes(filters.value.type)) {
        console.log('[useContentLoader] Resetting invalid filter type:', filters.value.type);
        filters.value.type = 'all';
      }
    } catch (err) {
      console.error('Error loading content:', err)
      error.value = err.message || 'Failed to load content'
    } finally {
      isLoading.value = false;
      console.log(`[useContentLoader] Loading complete. Filtered content count: ${filteredContent.value.length}`);
    }
  }

  /**
   * Load content from local markdown files (original implementation)
   */
  const loadLocalContent = async () => {
    // Use Vite's import.meta.glob to get all markdown files based on the current page
    let moduleObjects = {};

    // Load content based on the current page
    if (filters.value.page === 'build') {
      // Load content for Build page - use raw imports for consistent frontmatter parsing
      const blueprintModules = import.meta.glob('../data/content/build/blueprints/**/template.md', {
        query: '?raw',
        import: 'default'
      })
      const repositoryModules = import.meta.glob('../data/content/build/repositories/*.md', {
        query: '?raw',
        import: 'default'
      })
      
      moduleObjects = {
        ...blueprintModules,
        ...repositoryModules
      }
    } else if (filters.value.page === 'learn') {
      // Load content for Learn page - use raw imports for consistent frontmatter parsing
      const blogModules = import.meta.glob('../data/content/learn/blogs/*.md', {
        query: '?raw',
        import: 'default'
      })
      const videoModules = import.meta.glob('../data/content/learn/videos/*.md', {
        query: '?raw',
        import: 'default'
      })
      const workshopModules = import.meta.glob('../data/content/learn/workshops/*.md', {
        query: '?raw',
        import: 'default'
      })
      
      moduleObjects = {
        ...blogModules,
        ...videoModules,
        ...workshopModules
      }
    } else if (filters.value.page === 'discover') {
      // Load content for Discover page - use raw imports for consistent frontmatter parsing
      const servicesFrameworksModules = import.meta.glob('../data/content/discover/services-frameworks/*.md', {
        query: '?raw',
        import: 'default'
      })
      const patternsModules = import.meta.glob('../data/content/discover/patterns/*/pattern.md', {
        query: '?raw',
        import: 'default'
      })
      
      moduleObjects = {
        ...servicesFrameworksModules,
        ...patternsModules
      }
    }
    
    // Load all markdown files and extract their content
    const contentItems = await Promise.all(
      Object.entries(moduleObjects).map(async ([path, importModule]) => {
        try {
          // Import the module
          const module = await importModule()
          
          // Extract frontmatter - all imports are now raw strings
          let frontmatter = {}
          if (typeof module === 'string') {
            // Raw markdown import - parse frontmatter manually
            const parsed = parseMarkdownFile(module)
            frontmatter = parsed.frontmatter || {}
            
            if (Object.keys(frontmatter).length === 0) {
              console.warn(`No frontmatter found in ${path}`)
            }
          } else {
            console.warn(`Expected string module for ${path}, got:`, typeof module)
          }
          
          // Determine content type from path if not specified in frontmatter
          const pathSegments = path.split('/')
          
          // For template.md files, the type should be 'blueprints' (grandparent directory)
          // For other files, use the immediate parent directory
          let typeFromPath
          if (pathSegments[pathSegments.length - 1] === 'template.md') {
            // For template.md files: ../data/content/build/blueprints/hello-world-agent-template/template.md
            // We want 'blueprints' (index -3), not 'hello-world-agent-template' (index -2)
            typeFromPath = pathSegments[pathSegments.length - 3]
          } else {
            // For regular files: ../data/content/build/repositories/some-repository.md
            // Use the parent directory name directly
            typeFromPath = pathSegments[pathSegments.length - 2]
          }
          
          const type = frontmatter.type || typeFromPath
          
          // Use filename as slug if not specified, but for templates and patterns use the directory name
          const filename = pathSegments[pathSegments.length - 1]
          let slug = frontmatter.slug || filename.replace('.md', '')
          
          // For template.md and pattern.md files, use the parent directory name as the slug
          if (filename === 'template.md' || filename === 'pattern.md') {
            const templateDirName = pathSegments[pathSegments.length - 2]
            slug = frontmatter.slug || templateDirName
          }
          
          // Extract description as excerpt if available
          const excerpt = frontmatter.description || frontmatter.excerpt || ''
          
          // Extract image from frontmatter or use default based on type
          const image = frontmatter.image || null
          
          return {
            id: frontmatter.id || slug,
            title: frontmatter.title || 'Untitled',
            excerpt: excerpt,
            url: frontmatter.url, // Don't set default URL, let Build page generate it
            image: image,
            type,
            date: frontmatter.date || new Date().toISOString().split('T')[0],
            path,
            // Extract filter properties
            skillLevel: frontmatter.skillLevel || '',
            frameworks: frontmatter.frameworks || [],
            services: frontmatter.services || [],
            components: frontmatter.components || [],
            category: frontmatter.category || '',
            // Discover-specific fields
            industry: frontmatter.industry || '',
            pricing: frontmatter.pricing || '',
            company: frontmatter.company || ''
          }
        } catch (err) {
          console.error(`Error loading file ${path}:`, err)
          return null
        }
      })
    )
    
    // Filter out any null values from errors
    content.value = contentItems
      .filter(item => item !== null)
      .sort((a, b) => {
        // Sort by date, newest first
        const dateA = new Date(a.date || 0)
        const dateB = new Date(b.date || 0)
        return dateB - dateA
      })
  }

  /**
   * Get available filter options combining predefined values and discovered ones
   * @returns {Object} Object containing all available filter options
   */
  const getAvailableFilters = computed(() => {
    const filterOptions = JSON.parse(JSON.stringify(filterConfig)) // Deep clone to avoid mutation
    
    // Only process if content has been loaded
    if (content.value?.length > 0) {
      // For frameworks, combine predefined values with discovered ones if enabled
      if (filterOptions.frameworks.discoverAdditional) {
        // Get unique frameworks from content
        const discoveredFrameworks = [...new Set(content.value.flatMap(item => 
          item.frameworks || []).filter(Boolean))]
        
        // Merge with predefined values, removing duplicates
        const allFrameworks = [...new Set([
          ...filterOptions.frameworks.values,
          ...discoveredFrameworks
        ])]
        
        // Replace the values with the combined set
        filterOptions.frameworks.values = allFrameworks
      }
      
      // For services, do the same
      if (filterOptions.services.discoverAdditional) {
        // Get unique services from content
        const discoveredServices = [...new Set(content.value.flatMap(item => 
          item.services || []).filter(Boolean))]
        
        // Merge with predefined values, removing duplicates
        const allServices = [...new Set([
          ...filterOptions.services.values,
          ...discoveredServices
        ])]
        
        // Replace the values with the combined set
        filterOptions.services.values = allServices.sort()
      }
    }
    
    return filterOptions
  })

  /**
   * Filter content by all applied filters
   * Simplified implementation with cleaner reactivity
   */
  const filteredContent = computed(() => {
    // Start with a fresh copy of content
    let result = [...content.value]
    
    // Filter by type (tab)
    if (filters.value.type !== 'all') {
      result = result.filter(item => item.type === filters.value.type)
    }
    
    // Filter by time period
    if (filters.value.time && filters.value.time !== 'all') {
      const daysAgo = parseInt(filters.value.time)
      const cutoffDate = new Date()
      cutoffDate.setDate(cutoffDate.getDate() - daysAgo)
      
      result = result.filter(item => {
        const itemDate = new Date(item.date)
        return itemDate >= cutoffDate
      })
    }
    
    // Filter by skill level
    if (filters.value.skillLevel) {
      result = result.filter(item =>
        item.skillLevel === filters.value.skillLevel
      )
    }
    
    // Filter by frameworks (multiple selection)
    if (filters.value.frameworks.length > 0) {
      result = result.filter(item => {
        if (!item.frameworks) return false
        return filters.value.frameworks.some(framework =>
          item.frameworks.includes(framework)
        )
      })
    }
    
    // Filter by AWS services (multiple selection)
    if (filters.value.services.length > 0) {
      result = result.filter(item => {
        if (!item.services) return false
        return filters.value.services.some(service =>
          item.services.includes(service)
        )
      })
    }
    
    // Filter by search query
    if (filters.value.searchQuery) {
      const lowercaseQuery = filters.value.searchQuery.toLowerCase()
      result = result.filter(item =>
        (item.title && item.title.toLowerCase().includes(lowercaseQuery)) ||
        (item.excerpt && item.excerpt.toLowerCase().includes(lowercaseQuery))
      )
    }
    
    return result
  })

  /**
   * Function to set active tab and search query
   * @param {string} activeTab - Active tab/filter (all, blogs, videos, workshops)
   * @param {string} searchQuery - Search query
   */
  const updateFilters = (activeTab, searchQuery) => {
    // Update filters
    filters.value.type = activeTab
    filters.value.searchQuery = searchQuery
    
    return filteredContent.value
  }
  
  return {
    content,
    isLoading,
    error,
    loadContent,
    filteredContent,
    updateFilters,
    getAvailableFilters,
    filters,
    clearAllFilters,
    countResourcesBySection
  }
}
