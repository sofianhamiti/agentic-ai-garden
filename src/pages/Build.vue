<template>
  <div class="build-page">
    <section class="header-section">
      <div class="container">
        <h1 class="page-title">Build</h1>
        <p class="page-description">
          Fast-track your development with patterns, blueprints, and example projects
        </p>
      </div>
    </section>
    
    <section class="content-section">
      <div class="container">
        <div class="filter-controls">
          <div class="content-tabs">
            <div class="tabs-list">
              <button 
                v-for="tab in tabs" 
                :key="tab.value"
                class="tab-trigger" 
                :class="{ 'active': activeTab === tab.value }"
                @click="handleTabClick(tab.value)"
              >
                {{ tab.label }}
              </button>
            </div>
          </div>
          
          <div class="search-box">
            <input 
              v-model="searchQuery" 
              type="text" 
              placeholder="Search resources..." 
              class="search-input" 
            />
          </div>
        </div>
        
        <div class="content-with-sidebar">
          <div class="content-container">
            <!-- Filter area (now part of main content) -->
            <div class="filters-area">
              <FilterSidebar 
                :resource-count="filteredContent.length"
                :show-time-filter="false"
                :show-skill-filter="false" 
              />
            </div>
            
            <!-- Content Grid -->
            <div class="main-content">
              <!-- Results Summary -->
              <div class="results-summary" v-if="content.length > 0">
                <span v-if="filteredContent.length > 0">
                  Showing {{ filteredContent.length }} {{ filteredContent.length === 1 ? 'resource' : 'resources' }}
                </span>
                <span v-else>No resources match your filters</span>
              </div>
              
              <!-- Add key to force re-render when filters change -->
              <div v-if="content.length > 0 && filteredContent.length > 0" class="content-grid" :key="filterChangeKey">
                <a
                  v-for="item in filteredContent"
                  :key="item.id"
                  :href="item.url"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="content-card"
                >
                  <div class="card-image">
                    <img :src="getContentImage(item)" :alt="item.title" />
                  </div>
                  <div class="content-type">{{ item.type }}</div>
                  <h3 class="content-title">{{ item.title }}</h3>
                  <p class="content-excerpt">{{ item.excerpt }}</p>
                  <div class="content-meta">
                    <span class="content-date">{{ formatDate(item.date) }}</span>
                  </div>
                </a>
              </div>
              <div v-else class="empty-state">
                <p v-if="isLoading">Loading resources...</p>
                <p v-else-if="content.length > 0 && filteredContent.length === 0">No resources found matching your criteria.</p>
                <p v-else>Loading resources...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, onBeforeMount, nextTick } from 'vue'
import { useContentLoader, useFilterState } from '../composables/useContentLoader'
import { formatDate } from '../utils/markdown'
import { getContentImage } from '../utils/contentHelpers'
import { useDebounce } from '@vueuse/core'
import { useRoute } from 'vue-router'
import FilterSidebar from '../components/ui/FilterSidebar.vue'

// Get route for accessing query parameters
const route = useRoute()

// Get the global filter state from our refactored composable
const { filters, clearAllFilters } = useFilterState()

// Calculate a key to force re-rendering when filters change
const filterChangeKey = computed(() => JSON.stringify(filters.value))

// Track if content has been initially loaded
const hasInitiallyLoaded = ref(false)

// Load content using our composable
const {
  content,
  isLoading,
  error,
  loadContent,
  filteredContent
} = useContentLoader()

// Tab options - customized for the Build page
const tabs = [
  { label: 'All Resources', value: 'all' },
  { label: 'Patterns', value: 'patterns' },
  { label: 'Blueprints', value: 'blueprints' },
  { label: 'Projects', value: 'projects' }
]

// Log whenever the filteredContent changes (for debugging)
watch(() => filteredContent.value, (newVal, oldVal) => {
  console.log('[BUILD] Filtered content changed:', newVal.length, 'items (previously', oldVal?.length || 0, 'items)');
  
  // Mark as initially loaded once we have content and loading is complete
  if (newVal.length > 0 && !isLoading.value) {
    hasInitiallyLoaded.value = true;
  }
}, { deep: true })

// Computed active tab that reads from the filters.value.type
const activeTab = computed(() => filters.value.type)

// Tab click handler that updates filters.value.type
function handleTabClick(tabValue) {
  console.log(`[BUILD] Tab clicked: ${tabValue}`);
  
  if (filters.value.type !== tabValue) {
    console.log(`[BUILD] Updating tab from ${filters.value.type} to ${tabValue}`);
    filters.value.type = tabValue;
    console.log('[BUILD] Tab change complete');
  }
}

// Initialize tab logging
onBeforeMount(() => {
  console.log('[BUILD] Component mounting, initial tab value:', filters.value.type);
  
  // Set page to 'build'
  filters.value.page = 'build';
  console.log('[BUILD] Set page filter to:', filters.value.page);
  
  // Validate the filter type on mount
  const validTypes = ['all', 'patterns', 'blueprints', 'projects'];
  if (!validTypes.includes(filters.value.type)) {
    console.log(`[BUILD] Resetting invalid initial filter type '${filters.value.type}' to 'all'`);
    filters.value.type = 'all';
  }
})

// Search input with VueUse debounce
const searchQuery = ref(filters.value.searchQuery || '')
const debouncedSearch = useDebounce(searchQuery, 300)

// Watch the debounced search and update the filter
watch(debouncedSearch, (newVal) => {
  console.log('[BUILD] Search query debounced:', newVal);
  if (filters.value.searchQuery !== newVal) {
    filters.value.searchQuery = newVal
    console.log('[BUILD] Updated search query in filter state');
  }
})

// Sync the search query from filterState for bidirectional binding
watch(() => filters.value.searchQuery, (newVal) => {
  console.log('[BUILD] Filter state search query changed:', newVal);
  if (searchQuery.value !== newVal) {
    searchQuery.value = newVal
  }
})

// Watch filters for changes to log filter updates
watch(() => filters.value, (newVal) => {
  console.log('[BUILD] Current filter state:', {
    type: newVal.type,
    frameworks: newVal.frameworks.length,
    services: newVal.services.length,
    searchQuery: newVal.searchQuery
  });
}, { deep: true });

// Load content on mount and ensure we have valid content after loading
onMounted(async () => {
  console.log('[BUILD] Component mounted, loading content');
  
  // Read type from URL query parameter if present
  const typeParam = route.query.type;
  if (typeParam && ['all', 'patterns', 'blueprints', 'projects'].includes(typeParam)) {
    console.log(`[BUILD] Setting type from URL parameter: ${typeParam}`);
    filters.value.type = typeParam;
  }
  
  await loadContent();
  
  // Force a reactive update after content loading is complete
  await nextTick();
  console.log(`[BUILD] Content loaded and processed. Filtered content: ${filteredContent.value.length} items`);
})

// Watch for route query parameter changes to update tabs when navigating via header dropdown
watch(() => route.query.type, (newType) => {
  if (newType && ['all', 'patterns', 'blueprints', 'projects'].includes(newType)) {
    console.log(`[BUILD] Route query type changed to: ${newType}`);
    filters.value.type = newType;
  }
})
</script>

<style>
.build-page {
  min-height: 100vh;
}

/* Make the container wider for a more spacious layout */
.build-page .container {
  max-width: 100rem; /* ~1600px in responsive units */
  width: 100%;
  margin: 0 auto;
  padding: 0 var(--space-4);
}

.header-section {
  padding: var(--space-16) 0;
  background: linear-gradient(to right, var(--aws-blue-dark), var(--aws-blue-medium));
  color: white;
}

.page-title {
  font-size: 3rem;
  font-weight: 700;
  margin-bottom: var(--space-4);
}

.page-description {
  font-size: 1.25rem;
  max-width: 60rem;
}

.content-section {
  padding: var(--space-12) 0;
}

.filter-controls {
  display: flex;
  flex-direction: column;
  gap: var(--space-6);
  margin-bottom: var(--space-8);
}

@media (min-width: 768px) {
  .filter-controls {
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  }
}

.content-tabs {
  width: 100%;
}

@media (min-width: 768px) {
  .content-tabs {
    width: auto;
  }
}

.tabs-list {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
  border-bottom: 1px solid var(--color-border);
  padding-bottom: var(--space-2);
}

.tab-trigger {
  padding: var(--space-2) var(--space-4);
  font-weight: 500;
  border-radius: var(--radius-md);
  border: none;
  background: none;
  cursor: pointer;
  transition: all 0.2s ease;
  color: var(--color-text);
}

.tab-trigger:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

.dark .tab-trigger:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

.tab-trigger.active {
  background-color: var(--aws-orange);
  color: white;
}

.search-box {
  position: relative;
  flex-shrink: 0;
  width: 100%;
}

@media (min-width: 768px) {
  .search-box {
    width: 250px;
  }
}

.search-input {
  width: 100%;
  padding: var(--space-2) var(--space-4);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  font-size: 0.875rem;
}

/* Content with sidebar layout */
.content-with-sidebar {
  position: relative;
  min-height: 80vh; /* Ensure there's enough room for scrolling */
}

/* Content container for the integrated layout */
.content-container {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: var(--space-6);
}

/* Filters area - integrated with main content */
.filters-area {
  margin-bottom: var(--space-8);
  padding-right: var(--space-6);
}

/* Main content area */
.main-content {
  min-width: 0; /* Prevent overflow issues */
}

/* Results Summary styling */
.results-summary {
  margin-bottom: var(--space-6);
  font-size: 1rem;
  color: var(--color-muted);
  padding-left: var(--space-2);
  font-weight: 500;
}

/* Content grid with consistently maintained column count */
.content-grid {
  display: grid;
  gap: var(--space-6);
  grid-template-columns: repeat(auto-fill, minmax(236px, 1fr)); /* Golden ratio basis */
  width: 100%;
}

/* Desktop layout */
@media (min-width: 1024px) {
  .content-container {
    grid-template-columns: 300px minmax(0, 1fr);
  }
  
  .filters-area {
    margin-bottom: 0;
  }
  
  /* Set maximum columns based on viewport width */
  @media (max-width: 1400px) {
    .content-grid {
      grid-template-columns: repeat(2, 1fr);
    }
  }
  
  @media (min-width: 1401px) {
    .content-grid {
      grid-template-columns: repeat(3, minmax(0, 382px)); /* Golden ratio: 236px × 1.618 */
      justify-content: center;
    }
  }
}

.content-card {
  padding: 13px; /* Golden ratio-based spacing */
  border-radius: 8px; /* Harmonious with reduced card size */
  border: 1px solid var(--color-border);
  transition: all 0.3s ease;
  background-color: white;
  height: 100%;
  display: flex;
  flex-direction: column;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.05);
}

.dark .content-card {
  background-color: var(--aws-blue-dark);
  border-color: var(--color-border-dark);
}

.content-card:hover {
  box-shadow: 0px 10px 25px -12px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}

.content-type {
  display: inline-block;
  font-size: 0.6875rem; /* Golden ratio-based typography */
  font-weight: 700;
  text-transform: uppercase;
  color: var(--aws-orange);
  margin-bottom: 8px; /* Golden ratio-based spacing */
}

.content-title {
  font-size: 1.125rem; /* Golden ratio-based typography */
  font-weight: 600;
  margin-bottom: 8px; /* Golden ratio-based spacing */
  color: var(--color-text);
  line-height: 1.3;
}

.dark .content-title {
  color: white;
}

.content-excerpt {
  font-size: 0.875rem;
  color: var(--color-muted);
  margin-bottom: 21px; /* Golden ratio-based spacing */
  flex: 1;
  line-height: 1.5;
}

.content-meta {
  display: flex;
  justify-content: flex-end;
  font-size: 0.75rem;
  color: var(--color-muted);
}

.card-image {
  height: 148px; /* Golden ratio harmony with content */
  margin: -13px -13px 13px; /* Match new padding */
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  overflow: hidden;
  position: relative;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s ease;
}

.content-card:hover .card-image img {
  transform: scale(1.05);
}

.empty-state {
  padding: var(--space-12);
  text-align: center;
  color: var(--color-muted);
}
</style>
