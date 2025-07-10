<template>
  <DetailPageLayout :is-loading="isLoading" :error="error">
    <!-- Header Section -->
    <template #header>
      <section class="header-section">
        <div class="container">
          <div class="breadcrumb">
            <RouterLink to="/build">Build</RouterLink>
            <span class="separator">→</span>
            <span class="current">{{ pattern?.title }}</span>
          </div>
          
          <h1 class="page-title">{{ pattern?.title }}</h1>
          <p class="page-description">{{ pattern?.excerpt }}</p>
          
          <div v-if="pattern" class="pattern-badges">
            <span class="badge type-badge">{{ pattern.type }}</span>
            <span v-if="pattern.skillLevel" class="badge skill-badge">{{ pattern.skillLevel }}</span>
            <span v-if="pattern.date" class="badge date-badge">{{ formatDate(pattern.date) }}</span>
          </div>
          
          <div v-if="pattern?.frameworks?.length || pattern?.services?.length" class="pattern-tags">
            <div v-if="pattern.frameworks?.length" class="tag-group">
              <span class="tag-label">Frameworks:</span>
              <span v-for="framework in pattern.frameworks" :key="framework" class="tag framework-tag">
                {{ framework }}
              </span>
            </div>
            <div v-if="pattern.services?.length" class="tag-group">
              <span class="tag-label">Services:</span>
              <span v-for="service in pattern.services" :key="service" class="tag service-tag">
                {{ service }}
              </span>
            </div>
          </div>
        </div>
      </section>
    </template>

    <!-- Main Content -->
    <template #content>
      <article class="markdown-content" v-html="renderedContent"></article>
      
      <!-- Actions -->
      <div v-if="pattern?.url && pattern.url !== '#'" class="pattern-actions">
        <a :href="pattern.url" target="_blank" rel="noopener noreferrer" class="action-button primary">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
            <polyline points="15,3 21,3 21,9"></polyline>
            <line x1="10" y1="14" x2="21" y2="3"></line>
          </svg>
          View Implementation
        </a>
      </div>
    </template>

    <!-- Sidebar -->
    <template #sidebar>
      <div class="sidebar-section">
        <h3>Quick Info</h3>
        <dl class="info-list">
          <dt>Type</dt>
          <dd>{{ pattern?.type }}</dd>
          
          <dt v-if="pattern?.skillLevel">Skill Level</dt>
          <dd v-if="pattern?.skillLevel">{{ pattern.skillLevel }}</dd>
          
          <dt v-if="pattern?.date">Published</dt>
          <dd v-if="pattern?.date">{{ formatDate(pattern.date) }}</dd>
        </dl>
      </div>
      
      <div v-if="pattern?.frameworks?.length" class="sidebar-section">
        <h3>Frameworks</h3>
        <div class="tag-list">
          <span v-for="framework in pattern.frameworks" :key="framework" class="tag framework-tag">
            {{ framework }}
          </span>
        </div>
      </div>
      
      <div v-if="pattern?.services?.length" class="sidebar-section">
        <h3>AWS Services</h3>
        <div class="tag-list">
          <span v-for="service in pattern.services" :key="service" class="tag service-tag">
            {{ service }}
          </span>
        </div>
      </div>
    </template>
  </DetailPageLayout>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { renderMarkdown } from '../utils/markdown'
import { formatDate } from '../utils/dateHelpers'
import DetailPageLayout from '../components/layout/DetailPageLayout.vue'

const route = useRoute()
const pattern = ref(null)
const isLoading = ref(true)
const error = ref(null)

const renderedContent = computed(() => {
  if (!pattern.value?.content) return ''
  return renderMarkdown(pattern.value.content)
})

const loadPattern = async () => {
  isLoading.value = true
  error.value = null
  
  try {
    const { type, slug } = route.params
    
    // Import the specific pattern based on type and slug
    let module = null
    
    if (type === 'templates') {
      try {
        module = await import(`../data/content/build/templates/${slug}.md`)
      } catch (importError) {
        console.error('Failed to import template:', importError)
      }
    } else if (type === 'use-cases') {
      try {
        module = await import(`../data/content/build/use-cases/${slug}.md`)
      } catch (importError) {
        console.error('Failed to import use-case:', importError)
      }
    }
    
    if (!module) {
      throw new Error(`Pattern not found: ${type}/${slug}`)
    }
    
    // Extract pattern data
    const frontmatter = module.frontmatter || {}
    const content = module.default || ''
    
    pattern.value = {
      id: frontmatter.id || slug,
      title: frontmatter.title || 'Untitled Pattern',
      excerpt: frontmatter.description || frontmatter.excerpt || '',
      content: content,
      type: frontmatter.type || type,
      date: frontmatter.date,
      url: frontmatter.url,
      image: frontmatter.image,
      skillLevel: frontmatter.skillLevel,
      frameworks: frontmatter.frameworks || [],
      services: frontmatter.services || [],
      components: frontmatter.components || [],
      category: frontmatter.category || ''
    }
    
  } catch (err) {
    console.error('Error loading pattern:', err)
    error.value = err.message || 'Failed to load pattern'
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadPattern()
})
</script>

<style scoped>
/* Header Section */
.header-section {
  padding: var(--space-16) 0;
  background: linear-gradient(to right, var(--aws-blue-dark), var(--aws-blue-medium));
  color: white;
}

.container {
  max-width: 100rem;
  width: 100%;
  margin: 0 auto;
  padding: 0 var(--space-4);
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  margin-bottom: var(--space-4);
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.8);
}

.breadcrumb a {
  color: white;
  text-decoration: none;
}

.breadcrumb a:hover {
  text-decoration: underline;
}

.separator {
  color: rgba(255, 255, 255, 0.6);
}

.current {
  font-weight: 600;
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
  margin-bottom: var(--space-4);
}

.pattern-badges {
  display: flex;
  gap: var(--space-2);
  margin-bottom: var(--space-4);
}

.badge {
  padding: var(--space-1) var(--space-3);
  border-radius: var(--radius-full);
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.type-badge {
  background: var(--aws-orange);
  color: white;
}

.skill-badge {
  background: rgba(255, 255, 255, 0.2);
  color: white;
}

.date-badge {
  background: rgba(255, 255, 255, 0.1);
  color: rgba(255, 255, 255, 0.8);
}

.pattern-tags {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-4);
}

.tag-group {
  display: flex;
  align-items: center;
  gap: var(--space-2);
}

.tag-label {
  font-size: 0.875rem;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.8);
}

.tag {
  padding: var(--space-1) var(--space-2);
  border-radius: var(--radius-sm);
  font-size: 0.75rem;
  font-weight: 500;
}

.framework-tag {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: 1px solid rgba(255, 255, 255, 0.3);
}

.service-tag {
  background: rgba(255, 153, 0, 0.2);
  color: white;
  border: 1px solid rgba(255, 153, 0, 0.4);
}

/* Main Content */
.markdown-content {
  line-height: 1.7;
  color: var(--color-text);
  width: 100%;
  max-width: none;
}

.markdown-content h1,
.markdown-content h2,
.markdown-content h3,
.markdown-content h4 {
  color: var(--aws-purple);
  margin-top: var(--space-6);
  margin-bottom: var(--space-4);
}

.markdown-content h1 {
  font-size: 2rem;
}

.markdown-content h2 {
  font-size: 1.5rem;
  border-bottom: 2px solid var(--color-border);
  padding-bottom: var(--space-2);
}

.markdown-content h3 {
  font-size: 1.25rem;
}

.markdown-content p {
  margin-bottom: var(--space-4);
}

.markdown-content ul,
.markdown-content ol {
  margin-bottom: var(--space-4);
  padding-left: var(--space-6);
}

.markdown-content li {
  margin-bottom: var(--space-1);
}

.markdown-content code {
  background: var(--color-code-bg);
  padding: var(--space-1);
  border-radius: var(--radius-sm);
  font-size: 0.875rem;
}

.markdown-content pre {
  background: var(--color-code-bg);
  padding: var(--space-4);
  border-radius: var(--radius-md);
  overflow-x: auto;
  margin-bottom: var(--space-4);
}

.pattern-actions {
  margin-top: var(--space-8);
  padding-top: var(--space-6);
  border-top: 1px solid var(--color-border);
}

.action-button {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-3) var(--space-6);
  border-radius: var(--radius-md);
  text-decoration: none;
  font-weight: 600;
  transition: all 0.2s;
}

.action-button.primary {
  background: var(--aws-orange);
  color: white;
}

.action-button.primary:hover {
  background: var(--aws-orange-dark);
  transform: translateY(-2px);
}

/* Sidebar Sections */
.sidebar-section {
  margin-bottom: var(--space-6);
}

.sidebar-section:last-child {
  margin-bottom: 0;
}

.sidebar-section h3 {
  font-size: 1rem;
  font-weight: 600;
  color: var(--aws-purple);
  margin: 0 0 var(--space-3);
}

.info-list {
  margin: 0;
}

.info-list dt {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-text-muted);
  margin-bottom: var(--space-1);
}

.info-list dd {
  font-size: 0.875rem;
  color: var(--color-text);
  margin: 0 0 var(--space-3);
}

.tag-list {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-2);
}

.sidebar-section .framework-tag {
  background: rgba(124, 58, 237, 0.1);
  color: var(--aws-purple);
  border: 1px solid rgba(124, 58, 237, 0.2);
}

.sidebar-section .service-tag {
  background: rgba(255, 153, 0, 0.1);
  color: var(--aws-orange);
  border: 1px solid rgba(255, 153, 0, 0.2);
}

/* Responsive */
@media (max-width: 768px) {
  .page-title {
    font-size: 2rem;
  }
  
  .pattern-badges {
    flex-wrap: wrap;
  }
  
  .pattern-tags {
    gap: var(--space-2);
  }
}
</style>
