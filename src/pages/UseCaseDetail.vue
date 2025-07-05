<template>
  <div class="usecase-detail">
    <div v-if="isLoading" class="loading">
      <div class="spinner"></div>
      <p>Loading use case...</p>
    </div>

    <div v-else-if="error" class="error">
      <h2>Use Case Not Found</h2>
      <p>{{ error }}</p>
      <RouterLink to="/build" class="back-button">← Back to Build</RouterLink>
    </div>

    <div v-else-if="useCase" class="usecase-content">
      <!-- Header -->
      <div class="usecase-header">
        <div class="breadcrumb">
          <RouterLink to="/build">Build</RouterLink>
          <span class="separator">→</span>
          <RouterLink to="/build?type=use-cases">Use Cases</RouterLink>
          <span class="separator">→</span>
          <span class="current">{{ useCase.title }}</span>
        </div>
        
        <div class="usecase-meta">
          <h1 class="usecase-title">{{ useCase.title }}</h1>
          <p class="usecase-description">{{ useCase.excerpt }}</p>
          
          <div class="usecase-badges">
            <span class="badge type-badge">Use Case</span>
            <span v-if="useCase.skillLevel" class="badge skill-badge">{{ useCase.skillLevel }}</span>
            <span v-if="useCase.date" class="badge date-badge">{{ formatDate(useCase.date) }}</span>
          </div>
          
          <div v-if="useCase.frameworks?.length || useCase.services?.length" class="usecase-tags">
            <div v-if="useCase.frameworks?.length" class="tag-group">
              <span class="tag-label">Frameworks:</span>
              <span v-for="framework in useCase.frameworks" :key="framework" class="tag framework-tag">
                {{ framework }}
              </span>
            </div>
            <div v-if="useCase.services?.length" class="tag-group">
              <span class="tag-label">Services:</span>
              <span v-for="service in useCase.services" :key="service" class="tag service-tag">
                {{ service }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Content -->
      <div class="usecase-body">
        <div class="content-container">
          <article class="markdown-content" v-html="renderedContent"></article>
          
          <!-- Actions -->
          <div v-if="useCase.url && useCase.url !== '#'" class="usecase-actions">
            <a :href="useCase.url" target="_blank" rel="noopener noreferrer" class="action-button primary">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
              </svg>
              View Project Repository
            </a>
          </div>
        </div>
        
        <!-- Sidebar -->
        <aside class="usecase-sidebar">
          <div class="sidebar-section">
            <h3>Use Case Info</h3>
            <dl class="info-list">
              <dt>Type</dt>
              <dd>Use Case</dd>
              
              <dt v-if="useCase.skillLevel">Skill Level</dt>
              <dd v-if="useCase.skillLevel">{{ useCase.skillLevel }}</dd>
              
              <dt v-if="useCase.date">Published</dt>
              <dd v-if="useCase.date">{{ formatDate(useCase.date) }}</dd>
            </dl>
          </div>
          
          <div v-if="useCase.frameworks?.length" class="sidebar-section">
            <h3>Frameworks</h3>
            <div class="tag-list">
              <span v-for="framework in useCase.frameworks" :key="framework" class="tag framework-tag">
                {{ framework }}
              </span>
            </div>
          </div>
          
          <div v-if="useCase.services?.length" class="sidebar-section">
            <h3>AWS Services</h3>
            <div class="tag-list">
              <span v-for="service in useCase.services" :key="service" class="tag service-tag">
                {{ service }}
              </span>
            </div>
          </div>
          
          <div class="sidebar-section">
            <h3>What is a Use Case?</h3>
            <p class="sidebar-text">
              Use cases provide complete, ready-to-deploy implementations of agentic AI solutions for specific business scenarios.
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
const useCase = ref(null)
const isLoading = ref(true)
const error = ref(null)

const renderedContent = computed(() => {
  if (!useCase.value?.content) return ''
  return renderMarkdown(useCase.value.content)
})

const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
}

const loadUseCase = async () => {
  isLoading.value = true
  error.value = null
  
  try {
    const { slug } = route.params
    
    // Import markdown as raw string for consistent processing
    const rawModule = await import(`../data/content/build/use-cases/${slug}.md?raw`)
    const rawMarkdown = rawModule.default
    
    // Parse frontmatter and content using our utility
    const { parseMarkdown } = await import('../utils/markdown')
    const parsed = parseMarkdown(rawMarkdown)
    
    const frontmatter = parsed
    const content = parsed.body
    
    useCase.value = {
      id: frontmatter.id || slug,
      title: frontmatter.title || 'Untitled Use Case',
      excerpt: frontmatter.description || frontmatter.excerpt || '',
      content: content,
      type: frontmatter.type || 'use-cases',
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
    console.error('Error loading use case:', err)
    error.value = 'Use case not found'
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadUseCase()
})
</script>

<style scoped>
.usecase-detail {
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

.usecase-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: var(--space-6);
}

.usecase-header {
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

.usecase-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--aws-purple);
  margin: 0 0 var(--space-4);
  line-height: 1.2;
}

.usecase-description {
  font-size: 1.125rem;
  color: var(--color-text-muted);
  margin: 0 0 var(--space-6);
  line-height: 1.6;
}

.usecase-badges {
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

.usecase-tags {
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

.usecase-body {
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

.usecase-actions {
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

.usecase-sidebar {
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
  .usecase-body {
    grid-template-columns: 1fr;
    gap: var(--space-6);
  }
  
  .usecase-sidebar {
    position: static;
    order: -1;
  }
  
  .usecase-title {
    font-size: 2rem;
  }
  
  .usecase-content {
    padding: var(--space-4);
  }
}
</style>