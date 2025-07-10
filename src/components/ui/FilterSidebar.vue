<template>
  <div class="filter-sidebar-wrapper">
    <!-- Sidebar Container -->
    <div class="filter-sidebar-container" :class="{ 'is-open': isOpen }">
      <aside
        id="filter-sidebar"
        class="filter-sidebar"
        ref="sidebar"
      >
        <!-- Filter Header Component -->
        <FilterHeader
          :is-mobile="isMobile"
          :has-active-filters="hasActiveFilters"
          @close="closeSidebar"
          @clear-filters="clearFilters"
        />
        
        <div class="sidebar-content">
          <!-- Filter Category Sections Component -->
          <FilterCategorySection
            :filters="filters"
            :filter-options="filterOptions"
            :accordion-state="accordionState"
            :is-mobile="isMobile"
            :show-time-filter="showTimeFilter"
            :show-skill-filter="showSkillFilter"
            :show-frameworks-filter="showFrameworksFilter"
            :show-services-filter="showServicesFilter"
            @toggle-accordion="toggleAccordion"
            @filter-change="handleFilterChange"
          />
        </div>
      </aside>
      
      <!-- Backdrop overlay for mobile -->
      <div
        v-if="isOpen"
        class="sidebar-backdrop"
        @click="closeSidebar"
      ></div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, watch, onMounted, onBeforeUnmount } from 'vue';
import { useBreakpoints, useStorage, useScrollLock } from '@vueuse/core';
import { useContentLoader, useFilterState } from '../../composables/useContentLoader';
import '../../assets/styles/filter-components.css';

// Props
const props = defineProps({
  resourceCount: {
    type: Number,
    default: 0
  },
  showTimeFilter: {
    type: Boolean,
    default: true
  },
  showSkillFilter: {
    type: Boolean,
    default: true
  },
  showFrameworksFilter: {
    type: Boolean,
    default: true
  },
  showServicesFilter: {
    type: Boolean,
    default: true
  }
});

// Decomposed filter components
import FilterHeader from './FilterSidebar/FilterHeader.vue';
import FilterCategorySection from './FilterSidebar/FilterCategorySection.vue';

// Get the global filter state
const { filters, clearAllFilters } = useFilterState();

// Get available filters and filtered content from content loader
const { getAvailableFilters, filteredContent, filters: contentFilters, content } = useContentLoader();
const filterOptions = computed(() => getAvailableFilters.value);

// Use either the prop value (if provided) or fallback to computed value for resources count
const displayedResourceCount = computed(() => {
  // If explicitly passed as prop, use that first
  if (props.resourceCount > 0) {
    return props.resourceCount;
  }
  // Otherwise fall back to computed count from filteredContent
  return filteredContent.value?.length || 0;
});

// Watch for any changes in filters or content to ensure counter reactivity
watch(
  [() => filters.value, () => content, filteredContent],
  () => {
    // This watch will trigger recalculation of displayedResourceCount when filters change
    console.log('[FilterSidebar] Filter or content changed, filtered resources count:', displayedResourceCount.value);
  },
  { deep: true }
);

// Sidebar state - using useStorage with a single object for better organization
const sidebarState = useStorage('filter-sidebar-state', {
  isOpen: false,
  accordionState: {
    time: true,
    skill: true,
    frameworks: true,
    services: true
  }
});

// Extract individual reactive values from sidebarState for easier use
const isOpen = computed({
  get: () => sidebarState.value.isOpen,
  set: (value) => sidebarState.value.isOpen = value
});

const accordionState = computed({
  get: () => sidebarState.value.accordionState,
  set: (value) => sidebarState.value.accordionState = value
});

const sidebar = ref(null);

// Setup responsive breakpoints using VueUse
const breakpoints = useBreakpoints({
  mobile: 640,
  tablet: 768,
  desktop: 1024,
});

const isMobile = computed(() => breakpoints.smallerOrEqual('tablet').value);
const isDesktop = computed(() => breakpoints.greaterOrEqual('desktop').value);

// Setup scroll lock for mobile
const scrollLock = useScrollLock(document.body);
const lock = () => { scrollLock.value = true; };
const unlock = () => { scrollLock.value = false; };

// Toggle accordion sections
const toggleAccordion = (section) => {
  accordionState.value[section] = !accordionState.value[section];
};

// Handle filter changes from child components
const handleFilterChange = (filterType, value) => {
  // The filters are already reactive through v-model in child components
  // This handler can be used for additional logic if needed in the future
  console.log(`[FilterSidebar] Filter changed: ${filterType} = ${value}`);
};

// Check if there are any active filters
const hasActiveFilters = computed(() => {
  return filters.value.time !== 'all' || 
         filters.value.skillLevel !== '' || 
         filters.value.frameworks.length > 0 || 
         filters.value.services.length > 0;
});

// Simplified toggle function
function toggleSidebar() {
  isOpen.value = !isOpen.value;
  
  if (isMobile.value && isOpen.value) {
    lock();
  } else if (isMobile.value) {
    unlock();
  }
}

// Close sidebar
function closeSidebar() {
  isOpen.value = false;
  unlock();
}

// Clear all filters
function clearFilters() {
  // Call the global filter reset function
  clearAllFilters();
  
  // Close the sidebar on mobile
  if (isMobile.value) {
    closeSidebar();
  }
}

// Handle window resize for responsive behavior
let resizeTimeout;
const handleResize = () => {
  clearTimeout(resizeTimeout);
  resizeTimeout = setTimeout(() => {
    if (window.innerWidth >= 1024 && isOpen.value) {
      document.body.style.overflow = '';
    }
  }, 100);
};

// Close sidebar on ESC key
const handleEscKey = (e) => {
  if (e.key === 'Escape' && isOpen.value) {
    closeSidebar();
  }
};

// Lifecycle hooks
onMounted(() => {
  document.addEventListener('keydown', handleEscKey);
  window.addEventListener('resize', handleResize);
  
  // Restore scroll state when mounting component
  if (isOpen.value && isMobile.value) {
    lock();
  }
});

onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleEscKey);
  window.removeEventListener('resize', handleResize);
  unlock();
});
</script>

<style>
/* Filter Sidebar Wrapper */
.filter-sidebar-wrapper {
  position: relative;
  width: 100%;
  border: none;
  border-radius: var(--radius-lg);
  padding: var(--gr-space-md);
  background: linear-gradient(
    to bottom right,
    rgba(255, 255, 255, 0.03),
    rgba(255, 255, 255, 0)
  );
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.04),
              0 0 1px rgba(0, 0, 0, 0.1);
  transition: none;
  overflow: hidden; /* Ensure content doesn't spill out */
}

.dark .filter-sidebar-wrapper {
  background: linear-gradient(
    to bottom right,
    rgba(255, 255, 255, 0.03),
    rgba(255, 255, 255, 0)
  );
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.15),
              0 0 1px rgba(255, 255, 255, 0.1);
}

/* Filter Toggle Button */
.filter-toggle {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  height: 48px;
  border-radius: 40px;
  background: var(--aws-purple);
  color: white;
  border: none;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  cursor: pointer;
  z-index: 1000;
  transition: all 0.2s ease;
  position: fixed;
  bottom: 24px;
  right: 24px;
}

.filter-toggle:hover {
  background: var(--aws-blue-dark);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.2);
}

.filter-toggle:active {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

/* Filter Sidebar Container */
.filter-sidebar-container {
  position: relative;
  display: flex;
  justify-content: center;
  width: 100%;
}

/* Filter Sidebar Styles */
.filter-sidebar {
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  z-index: 1000;
  width: 300px !important;
  max-width: 300px !important;
  min-height: 250px;
  margin: 0 auto;
  background: transparent;
  /* Hide scrollbar by default */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE/Edge */
}

.filter-sidebar::-webkit-scrollbar {
  width: 0px;
  background: transparent;
}

/* Show subtle scrollbar on hover */
.filter-sidebar:hover {
  scrollbar-width: thin;
  scrollbar-color: rgba(var(--aws-purple-rgb), 0.2) transparent;
}

.filter-sidebar:hover::-webkit-scrollbar {
  width: 6px;
}

.filter-sidebar:hover::-webkit-scrollbar-track {
  background: transparent;
}

.filter-sidebar:hover::-webkit-scrollbar-thumb {
  background-color: rgba(var(--aws-purple-rgb), 0.2);
  border-radius: 3px;
  transition: background-color 0.2s ease;
}

.filter-sidebar:hover::-webkit-scrollbar-thumb:hover {
  background-color: rgba(var(--aws-purple-rgb), 0.4);
}

/* Sidebar header styles are now in FilterHeader.vue */

.sidebar-content {
  padding: var(--gr-space-md);
  flex: 1;
  overflow-y: auto;
  /* Hide scrollbar by default */
  scrollbar-width: none; /* Firefox */
  -ms-overflow-style: none; /* IE/Edge */
}

.sidebar-content::-webkit-scrollbar {
  width: 0px;
  background: transparent;
}

/* Show subtle scrollbar on hover */
.sidebar-content:hover {
  scrollbar-width: thin;
  scrollbar-color: rgba(var(--aws-purple-rgb), 0.2) transparent;
}

.sidebar-content:hover::-webkit-scrollbar {
  width: 6px;
}

.sidebar-content:hover::-webkit-scrollbar-track {
  background: transparent;
}

.sidebar-content:hover::-webkit-scrollbar-thumb {
  background-color: rgba(var(--aws-purple-rgb), 0.2);
  border-radius: 3px;
  transition: background-color 0.2s ease;
}

.sidebar-content:hover::-webkit-scrollbar-thumb:hover {
  background-color: rgba(var(--aws-purple-rgb), 0.4);
}

/* Backdrop overlay for mobile */
.sidebar-backdrop {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  z-index: 999;
  opacity: 0;
  visibility: hidden;
  transition: opacity 0.2s linear, visibility 0s linear 0.2s;
}

.filter-sidebar-container.is-open .sidebar-backdrop {
  opacity: 1;
  visibility: visible;
  transition: opacity 0.2s linear, visibility 0s linear 0s;
}

/* Dark mode styles */
.dark .filter-sidebar {
  color: white;
}

.dark .sidebar-close-button:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

/* Responsive styles */
@media (max-width: 1023.98px) {
  /* Mobile styles - sidebar slides in from left */
  .filter-sidebar {
    position: fixed;
    top: 0;
    left: 0;
    width: 320px;
    max-width: 85vw;
    height: 100vh;
    z-index: 1001;
    border-radius: 0 var(--radius-lg) var(--radius-lg) 0;
    background: white;
    border: none;
    box-shadow: 
      0 4px 20px rgba(0, 0, 0, 0.1),
      0 0 0 1px rgba(0, 0, 0, 0.05);
    transform: translateX(-110%);
    transition: 
      transform 0.2s linear, 
      visibility 0s linear 0.2s;
    visibility: hidden; /* Hide when closed */
  }
  
  .dark .filter-sidebar {
    background-color: var(--aws-blue-dark);
    border-color: var(--color-border-dark);
    box-shadow: 
      0 4px 20px rgba(0, 0, 0, 0.3),
      0 0 0 1px rgba(255, 255, 255, 0.05);
  }
  
  .filter-sidebar-container.is-open .filter-sidebar {
    transform: translateX(0);
    visibility: visible; /* Show when open */
    transition: 
      transform 0.2s linear, 
      visibility 0s linear 0s;
    box-shadow: 
      0 8px 30px rgba(0, 0, 0, 0.15),
      0 0 0 1px rgba(0, 0, 0, 0.05);
  }
  
  .sidebar-content {
    padding: var(--gr-space-md);
  }
  
  /* Mobile close button styles are now in FilterHeader.vue */
  
  /* Mobile filter toggle */
  .filter-toggle {
    bottom: 16px;
    right: 16px;
    height: 40px;
    min-width: 40px;
  }
}

/* Desktop styles */
@media (min-width: 1024px) {
  .filter-sidebar-wrapper {
    display: flex;
    flex-direction: column;
    align-items: center;
    position: relative;
    width: 300px;
    max-width: 300px;
    flex-shrink: 0;
  }
    
  .filter-sidebar {
    position: sticky;
    top: 150px;
    max-height: calc(100vh - 220px);
    transform: none !important;
    display: block;
    opacity: 1;
    visibility: visible;
    z-index: 1;
  }
  
  /* Close button visibility is now handled in FilterHeader.vue */
}
</style>
