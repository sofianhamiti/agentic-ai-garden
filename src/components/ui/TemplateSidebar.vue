<template>
  <div class="template-sidebar-content">
    <!-- Render only the 3 required sections -->
    <div
      v-for="section in filteredSections"
      :key="section.type"
      class="sidebar-section"
      :class="`sidebar-section-${section.type}`"
    >
      <h3 class="section-title">{{ getSectionTitle(section) }}</h3>
      <div
        class="section-content"
        v-html="renderMarkdown(section.content)"
      ></div>
    </div>

    <!-- Error state -->
    <div v-if="sidebarData?.error" class="sidebar-error">
      <p class="error-message">Error loading sidebar content: {{ sidebarData.error }}</p>
    </div>

    <!-- Loading state -->
    <div v-if="isLoading" class="sidebar-loading">
      <div class="loading-spinner"></div>
      <p>Loading template information...</p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { renderMarkdown } from '../../utils/markdown'

/**
 * Props for TemplateSidebar component
 * @typedef {Object} SidebarSection
 * @property {string} title - Section title
 * @property {string} content - Section content (markdown)
 * @property {string} type - Section type (authors, template-info)
 *
 * @typedef {Object} SidebarData
 * @property {SidebarSection[]} sections - Array of structured sections
 * @property {string|null} error - Error message if any
 */

const props = defineProps({
  /**
   * Structured sidebar data from useTemplateContent composable
   * @type {SidebarData}
   */
  sidebarData: {
    type: Object,
    default: () => ({
      sections: [],
      error: null
    }),
    validator: (value) => {
      return value && typeof value === 'object'
    }
  },

  /**
   * Loading state indicator
   * @type {boolean}
   */
  isLoading: {
    type: Boolean,
    default: false
  }
})

/**
 * Filter sections to only show the 3 required ones: authors, frameworks, and services
 */
const filteredSections = computed(() => {
  const sections = props.sidebarData?.sections || []
  return sections.filter(section =>
    section.type === 'authors' || section.type === 'frameworks' || section.type === 'services'
  )
})

/**
 * Get the appropriate title for each section
 * @param {SidebarSection} section - Current section
 * @returns {string} - Formatted section title
 */
const getSectionTitle = (section) => {
  const titleMap = {
    'authors': 'Created by',
    'frameworks': 'Frameworks',
    'services': 'Services'
  }
  return titleMap[section.type] || section.title
}

</script>

<style scoped>
/* Clean, unified sidebar design */
.template-sidebar-content {
  background: var(--color-background);
  padding: var(--space-6);
}

/* Clean section styling without individual cards */
.sidebar-section {
  padding-bottom: var(--space-6);
  margin-bottom: var(--space-6);
  border-bottom: 1px solid var(--color-border);
}

.sidebar-section:last-child {
  margin-bottom: 0;
  padding-bottom: 0;
  border-bottom: none;
}

/* Refined AWS-branded section titles */
.section-title {
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-text-muted);
  margin: 0 0 var(--space-2) 0;
  text-transform: uppercase;
  letter-spacing: 0.8px;
  position: relative;
  padding-left: var(--space-3);
}

.section-title::before {
  content: '';
  position: absolute;
  left: 0;
  top: 50%;
  transform: translateY(-50%);
  width: 2px;
  height: 12px;
  background: var(--aws-orange);
  border-radius: 1px;
}

/* Clean content styling */
.section-content {
  color: var(--color-text-strong);
  line-height: 1.5;
  font-size: 0.9rem;
  font-weight: 500;
}

/* Minimal markdown styling */
.section-content :deep(p) {
  margin: 0 0 4px 0;
}

.section-content :deep(p:last-child) {
  margin-bottom: 0;
}

.section-content :deep(strong) {
  color: #1a1a1a;
  font-weight: 500;
}

/* Simple link styling */
.section-content :deep(a) {
  color: #0066cc;
  text-decoration: none;
}

.section-content :deep(a:hover) {
  text-decoration: underline;
}

/* Clean list styling */
.section-content :deep(ul) {
  margin: 4px 0;
  padding-left: 16px;
}

.section-content :deep(li) {
  margin-bottom: 2px;
}

/* Clean section-specific styling */
.sidebar-section-authors .section-title::before {
  background: var(--aws-purple);
}

.sidebar-section-frameworks .section-title::before {
  background: var(--aws-blue-dark);
}

.sidebar-section-services .section-title::before {
  background: var(--aws-orange);
}

.sidebar-section-authors .section-content :deep(p) {
  margin: 0;
}

/* Clean error state */
.sidebar-error {
  text-align: center;
  padding: var(--space-4);
  background: #fef2f2;
  border-left: 3px solid #dc2626;
  color: #dc2626;
}

.error-message {
  margin: 0;
  font-size: 0.875rem;
  font-weight: 500;
}

/* Clean loading state */
.sidebar-loading {
  text-align: center;
  padding: var(--space-6);
  color: var(--color-text-muted);
}

.loading-spinner {
  width: 20px;
  height: 20px;
  border: 2px solid var(--color-border);
  border-top: 2px solid var(--aws-orange);
  border-radius: var(--radius-full);
  animation: spin 1s linear infinite;
  margin: 0 auto var(--space-2);
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.sidebar-loading p {
  margin: 0;
  font-size: 0.875rem;
  color: var(--color-text-muted);
  font-weight: 500;
}

/* Responsive adjustments */
@media (max-width: 1024px) {
  .template-sidebar-content {
    padding: var(--space-4);
  }
  
  .sidebar-section {
    margin-bottom: var(--space-4);
    padding-bottom: var(--space-4);
  }
}

@media (max-width: 768px) {
  .template-sidebar-content {
    padding: var(--space-4);
  }
  
  .section-title {
    font-size: 0.7rem;
  }
  
  .section-content {
    font-size: 0.85rem;
  }
}
</style>
