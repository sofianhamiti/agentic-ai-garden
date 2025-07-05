<template>
  <div class="template-detail">
    <div v-if="isLoading" class="loading">
      <div class="spinner"></div>
      <p>Loading template...</p>
    </div>

    <div v-else-if="error" class="error">
      <h2>Template Not Found</h2>
      <p>{{ error }}</p>
      <RouterLink to="/build" class="back-button">← Back to Build</RouterLink>
    </div>

    <div v-else-if="template" class="template-content">
      <!-- Header -->
      <div class="template-header">
        <div class="breadcrumb">
          <RouterLink to="/build">Build</RouterLink>
          <span class="separator">→</span>
          <RouterLink to="/build?type=templates">Templates</RouterLink>
          <span class="separator">→</span>
          <span class="current">{{ template.title }}</span>
        </div>
        
        <div class="template-meta">
          <h1 class="template-title">{{ template.title }}</h1>
          <p class="template-description">{{ template.excerpt }}</p>
          
          <div class="template-badges">
            <span class="badge type-badge">Template</span>
            <span v-if="template.skillLevel" class="badge skill-badge">{{ template.skillLevel }}</span>
            <span v-if="template.date" class="badge date-badge">{{ formatDate(template.date) }}</span>
          </div>
          
          <div v-if="template.frameworks?.length || template.services?.length" class="template-tags">
            <div v-if="template.frameworks?.length" class="tag-group">
              <span class="tag-label">Frameworks:</span>
              <span v-for="framework in template.frameworks" :key="framework" class="tag framework-tag">
                {{ framework }}
              </span>
            </div>
            <div v-if="template.services?.length" class="tag-group">
              <span class="tag-label">Services:</span>
              <span v-for="service in template.services" :key="service" class="tag service-tag">
                {{ service }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Content -->
      <div class="template-body">
        <div class="content-container">
          <article class="markdown-content" v-html="renderedContent"></article>
          
          <!-- Actions -->
          <div v-if="template.url && template.url !== '#'" class="template-actions">
            <a :href="template.url" target="_blank" rel="noopener noreferrer" class="action-button primary">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                <polyline points="15,3 21,3 21,9"></polyline>
                <line x1="10" y1="14" x2="21" y2="3"></line>
              </svg>
              View Template Implementation
            </a>
          </div>
        </div>
        
        <!-- Sidebar -->
        <aside class="template-sidebar">
          <div class="sidebar-section">
            <h3>Template Info</h3>
            <dl class="info-list">
              <dt>Type</dt>
              <dd>Template</dd>
              
              <dt v-if="template.skillLevel">Skill Level</dt>
              <dd v-if="template.skillLevel">{{ template.skillLevel }}</dd>
              
              <dt v-if="template.date">Published</dt>
              <dd v-if="template.date">{{ formatDate(template.date) }}</dd>
            </dl>
          </div>
          
          <div v-if="template.frameworks?.length" class="sidebar-section">
            <h3>Frameworks</h3>
            <div class="tag-list">
              <span v-for="framework in template.frameworks" :key="framework" class="tag framework-tag">
                {{ framework }}
              </span>
            </div>
          </div>
          
          <div v-if="template.services?.length" class="sidebar-section">
            <h3>AWS Services</h3>
            <div class="tag-list">
              <span v-for="service in template.services" :key="service" class="tag service-tag">
                {{ service }}
              </span>
            </div>
          </div>
          
          <div class="sidebar-section">
            <h3>What is a Template?</h3>
            <p class="sidebar-text">
              Templates provide architectural blueprints and design patterns you can adapt for your agentic AI solutions.
            </p>
          </div>
        </aside>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { renderMarkdown } from '../utils/markdown'

const route = useRoute()
const template = ref(null)
const isLoading = ref(true)
const error = ref(null)

const renderedContent = computed(() => {
  if (!template.value?.content) return ''
  return renderMarkdown(template.value.content)
})

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const loadTemplate = async () => {
  isLoading.value = true
  error.value = null
  
  try {
    const { slug } = route.params
    
    // Import markdown as raw string for consistent processing
    const rawModule = await import(`../data/content/build/templates/${slug}.md?raw`)
    const rawMarkdown = rawModule.default
    
    // Parse frontmatter and content using our utility
    const { parseMarkdown } = await import('../utils/markdown')
    const parsed = parseMarkdown(rawMarkdown)
    
    const frontmatter = parsed
    const content = parsed.body
    
    template.value = {
      id: frontmatter.id || slug,
      title: frontmatter.title || 'Untitled Template',
      excerpt: frontmatter.description || frontmatter.excerpt || '',
      content: content,
      type: frontmatter.type || 'templates',
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
    console.error('Error loading template:', err)
    error.value = 'Template not found'
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadTemplate()
})
</script>

<style scoped>
.template-detail {
  min-height: 100vh;
  background-color: var(--color-background);
}

.loading, .error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 50vh;
  text-align: center;
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid var(--color-border);
  border-top: 4px solid var(--aws-orange);
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: var(--space-4);
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.back-button {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  margin-top: var(--space-4);
  padding: var(--space-3) var(--space-4);
  background: var(--aws-purple);
  color: white;
  text-decoration: none;
  border-radius: var(--radius-md);
  transition: background-color 0.2s;
}

.back-button:hover {
  background: var(--aws-purple-dark);
}

.template-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--space-6);
}

.template-header {
  margin-bottom: var(--space-8);
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  margin-bottom: var(--space-4);
  font-size: 0.875rem;
  color: var(--color-text-muted);
}

.breadcrumb a {
  color: var(--aws-purple);
  text-decoration: none;
}

.breadcrumb a:hover {
  text-decoration: underline;
}

.separator {
  color: var(--color-text-muted);
}

.current {
  font-weight: 600;
}

.template-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--aws-purple);
  margin: 0 0 var(--space-4);
  line-height: 1.2;
}

.template-description {
  font-size: 1.125rem;
  color: var(--color-text-muted);
  margin: 0 0 var(--space-6);
  line-height: 1.6;
}

.template-badges {
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
  background: var(--aws-purple);
  color: white;
}

.date-badge {
  background: var(--color-border);
  color: var(--color-text-muted);
}

.template-tags {
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
  color: var(--color-text-muted);
}

.tag {
  padding: var(--space-1) var(--space-2);
  border-radius: var(--radius-sm);
  font-size: 0.75rem;
  font-weight: 500;
}

.framework-tag {
  background: rgba(124, 58, 237, 0.1);
  color: var(--aws-purple);
  border: 1px solid rgba(124, 58, 237, 0.2);
}

.service-tag {
  background: rgba(255, 153, 0, 0.1);
  color: var(--aws-orange);
  border: 1px solid rgba(255, 153, 0, 0.2);
}

.template-body {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: var(--space-8);
  align-items: start;
}

.content-container {
  min-width: 0;
}

.markdown-content {
  line-height: 1.7;
  color: var(--color-text);
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

.template-actions {
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

.template-sidebar {
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  padding: var(--space-6);
  border: 1px solid var(--color-border);
  position: sticky;
  top: var(--space-6);
}

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

.sidebar-text {
  font-size: 0.875rem;
  color: var(--color-text-muted);
  line-height: 1.5;
  margin: 0;
}

/* Responsive */
@media (max-width: 768px) {
  .template-body {
    grid-template-columns: 1fr;
    gap: var(--space-6);
  }
  
  .template-sidebar {
    position: static;
    order: -1;
  }
  
  .template-title {
    font-size: 2rem;
  }
  
  .template-content {
    padding: var(--space-4);
  }
}
</style>