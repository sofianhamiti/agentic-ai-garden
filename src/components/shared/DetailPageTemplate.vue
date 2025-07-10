<template>
  <DetailPageLayout :is-loading="isLoading" :error="error">
    <!-- Header Section -->
    <template #header>
      <section class="header-section">
        <div class="container">
          <div class="header-content">
            <div class="back-button-container">
              <BackButton />
            </div>
            <h1 class="page-title">{{ content?.title }}</h1>
            <p class="page-description">{{ content?.excerpt }}</p>
          </div>
        </div>
      </section>
    </template>

    <!-- Main Content -->
    <template #content>
      <article class="markdown-content" v-html="renderedContent"></article>
    </template>

    <!-- Sidebar -->
    <template #sidebar>
      <!-- Deploy Button (only for blueprints/templates) -->
      <div v-if="content?.repository && props.contentType !== 'pattern'" class="sidebar-section deploy-section">
        <a
          :href="content.repository"
          target="_blank"
          rel="noopener noreferrer"
          class="action-button primary"
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M7 17l-4-4 4-4m6 8l4-4-4-4"></path>
          </svg>
          Deploy to AWS
        </a>
      </div>

      <div class="sidebar-section">
        <h3>{{ contentTypeInfo.title }}</h3>
        <dl class="info-list">
          <dt>Type</dt>
          <dd>{{ contentTypeInfo.type }}</dd>
          
          <dt v-if="content?.date">Published</dt>
          <dd v-if="content?.date">{{ formatDate(content.date) }}</dd>
        </dl>
      </div>

      <!-- Pattern-specific sections -->
      <div v-if="props.contentType === 'pattern' && (content?.company || content?.industry)" class="sidebar-section">
        <h3>Company & Industry</h3>
        <dl class="info-list">
          <dt v-if="content?.company">Company</dt>
          <dd v-if="content?.company">{{ content.company }}</dd>
          
          <dt v-if="content?.industry">Industry</dt>
          <dd v-if="content?.industry">{{ content.industry }}</dd>
        </dl>
      </div>

      <div v-if="props.contentType === 'pattern' && content?.skillLevel" class="sidebar-section">
        <h3>Skill Level</h3>
        <p class="sidebar-text">{{ content.skillLevel }}</p>
      </div>
      
      <div v-if="content?.frameworks?.length" class="sidebar-section">
        <h3>Frameworks</h3>
        <div class="tag-list">
          <span v-for="framework in content.frameworks" :key="framework" class="tag framework-tag">
            {{ framework }}
          </span>
        </div>
      </div>
      
      <div v-if="content?.services?.length" class="sidebar-section">
        <h3>{{ props.contentType === 'pattern' ? 'Services' : 'AWS Services' }}</h3>
        <div class="tag-list">
          <span v-for="service in content.services" :key="service" class="tag service-tag">
            {{ service }}
          </span>
        </div>
      </div>

      <div v-if="props.contentType === 'pattern' && content?.category" class="sidebar-section">
        <h3>Category</h3>
        <p class="sidebar-text">{{ content.category }}</p>
      </div>

      <div v-if="props.contentType === 'pattern' && content?.pricing" class="sidebar-section">
        <h3>Pricing Model</h3>
        <p class="sidebar-text">{{ content.pricing }}</p>
      </div>

      <div v-if="content?.authors && props.contentType !== 'pattern'" class="sidebar-section">
        <h3>Authors</h3>
        <p class="sidebar-text">{{ content.authors }}</p>
      </div>
      
      <div class="sidebar-section">
        <h3>{{ contentTypeInfo.whatIsTitle }}</h3>
        <p class="sidebar-text">
          {{ contentTypeInfo.description }}
        </p>
      </div>
    </template>

  </DetailPageLayout>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute } from 'vue-router'
import { renderMarkdown } from '../../utils/markdown'
import { formatDate } from '../../utils/dateHelpers'
import DetailPageLayout from '../layout/DetailPageLayout.vue'
import BackButton from '../ui/BackButton.vue'

// Props to configure the component behavior
const props = defineProps({
  contentType: {
    type: String,
    required: true,
    validator: (value) => ['blueprint', 'template', 'pattern'].includes(value)
  },
  contentPath: {
    type: String,
    required: true
  }
})

const route = useRoute()
const content = ref(null)
const isLoading = ref(true)
const error = ref(null)

// Configuration based on content type
const contentTypeInfo = computed(() => {
  const configs = {
    blueprint: {
      title: 'Blueprint Info',
      type: 'Blueprint',
      whatIsTitle: 'What is a Blueprint?',
      description: 'Blueprints provide ready-to-deploy scaffolding for agentic AI applications with conversation handling, API integration, and deployment automation.'
    },
    template: {
      title: 'Template Info',
      type: 'Template',
      whatIsTitle: 'What is a Template?',
      description: 'Templates provide reusable patterns and structures for building agentic AI applications with best practices and proven architectures.'
    },
    pattern: {
      title: 'Pattern Info',
      type: 'Pattern',
      whatIsTitle: 'What is a Pattern?',
      description: 'Patterns showcase real-world AI implementations and case studies from leading companies, providing insights into successful AI strategies and architectures.'
    }
  }
  return configs[props.contentType] || configs.blueprint
})

// Pre-load all content markdown files using glob import
const contentModules = computed(() => {
  if (props.contentType === 'pattern') {
    return import.meta.glob('../../data/content/discover/patterns/*/pattern.md', {
      query: '?raw',
      import: 'default'
    })
  } else {
    return import.meta.glob('../../data/content/build/blueprints/*/template.md', {
      query: '?raw',
      import: 'default'
    })
  }
})

const renderedContent = computed(() => {
  if (!content.value?.content) return ''
  return renderMarkdown(content.value.content, route.params.slug, props.contentType)
})

const loadContent = async () => {
  isLoading.value = true
  error.value = null
  
  try {
    const { slug } = route.params
    
    // Find the content module for this slug
    let contentPath
    if (props.contentType === 'pattern') {
      contentPath = `../../data/content/discover/patterns/${slug}/pattern.md`
    } else {
      contentPath = `../../data/content/build/blueprints/${slug}/template.md`
    }
    
    const contentLoader = contentModules.value[contentPath]
    
    if (!contentLoader) {
      throw new Error(`${props.contentType} ${slug} not found`)
    }
    
    // Load the content
    const rawContent = await contentLoader()
    const frontmatterMatch = rawContent.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/)
    
    if (!frontmatterMatch) {
      throw new Error(`Invalid ${props.contentType} format`)
    }
    
    // Parse YAML frontmatter
    const frontmatterText = frontmatterMatch[1]
    const markdownContent = frontmatterMatch[2]
    
    // Simple YAML parser for frontmatter
    const frontmatter = {}
    frontmatterText.split('\n').forEach(line => {
      const match = line.match(/^([^:]+):\s*(.*)$/)
      if (match) {
        const key = match[1].trim()
        let value = match[2].trim()
        
        // Remove quotes if present
        if ((value.startsWith('"') && value.endsWith('"')) ||
            (value.startsWith("'") && value.endsWith("'"))) {
          value = value.slice(1, -1)
        }
        
        // Handle arrays (simple case)
        if (value.startsWith('[') && value.endsWith(']')) {
          value = value.slice(1, -1).split(',').map(item => item.trim())
        }
        
        frontmatter[key] = value
      }
    })
    
    // Handle services array (multi-line YAML)
    if (rawContent.includes('services:')) {
      const servicesMatch = rawContent.match(/services:\s*\n((?:\s*-\s*.+\n?)+)/)
      if (servicesMatch) {
        frontmatter.services = servicesMatch[1]
          .split('\n')
          .map(line => line.trim())
          .filter(line => line.startsWith('-'))
          .map(line => line.substring(1).trim())
          .filter(Boolean)
      }
    }
    
    content.value = {
      id: frontmatter.id || slug,
      title: frontmatter.title || `Untitled ${props.contentType}`,
      excerpt: frontmatter.description || frontmatter.excerpt || '',
      content: markdownContent,
      date: frontmatter.date,
      repository: frontmatter.repository,
      frameworks: Array.isArray(frontmatter.frameworks) ? frontmatter.frameworks : [frontmatter.frameworks].filter(Boolean),
      services: frontmatter.services || [],
      authors: frontmatter.authors || '',
      category: frontmatter.category || '',
      // Pattern-specific fields
      company: frontmatter.company || '',
      industry: frontmatter.industry || '',
      skillLevel: frontmatter.skillLevel || '',
      pricing: frontmatter.pricing || ''
    }
    
  } catch (err) {
    console.error(`Error loading ${props.contentType}:`, err)
    error.value = `${props.contentType} not found: ${err.message}`
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  loadContent()
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

.header-content {
  position: relative;
}

.back-button-container {
  margin-bottom: var(--space-4);
}

.page-title {
  font-size: 3rem; /* Match Learn page sizing */
  font-weight: 700;
  margin-bottom: var(--space-4);
  line-height: 1.2;
}

.page-description {
  font-size: 1.25rem; /* Match Learn page sizing */
  max-width: 60rem; /* Match Learn page width */
  line-height: 1.5;
  opacity: 0.9;
}


/* Markdown Content */
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
  font-size: 2.5rem; /* Match global CSS standards */
}

.markdown-content h2 {
  font-size: 2rem; /* Match global CSS standards */
  border-bottom: 1px solid var(--color-border);
  padding-bottom: var(--space-2);
  margin-bottom: var(--space-4);
}

.markdown-content h3 {
  font-size: 1.5rem; /* Match global CSS standards */
  font-weight: 600;
  text-transform: none;
  letter-spacing: normal;
  color: var(--aws-purple);
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

/* Simplified and effective image constraints to prevent flickering */
.markdown-content img,
.markdown-content svg {
  /* Core constraints applied immediately */
  max-width: 100% !important;
  max-height: 400px !important;
  width: auto !important;
  height: auto !important;
  display: block !important;
  margin: var(--space-6) auto !important;
  object-fit: contain !important;
  
  /* Visual styling */
  border-radius: var(--radius-lg);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05), 0 10px 15px rgba(0, 0, 0, 0.1);
}

/* First image (typically architecture) has no top margin */
.markdown-content img:first-child,
.markdown-content svg:first-child {
  margin-top: 0 !important;
}

/* Override any inline dimensions that might cause flickering */
.markdown-content img[width],
.markdown-content img[height],
.markdown-content svg[width],
.markdown-content svg[height] {
  width: auto !important;
  height: auto !important;
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

.deploy-section {
  text-align: center;
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
  width: 100%;
  justify-content: center;
}

.action-button.primary {
  background: var(--aws-orange);
  color: white;
}

.action-button.primary:hover {
  background: var(--aws-orange-light);
  transform: translateY(-2px);
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

.sidebar-text {
  font-size: 0.875rem;
  color: var(--color-text-muted);
  line-height: 1.5;
  margin: 0;
}

/* Responsive */
@media (max-width: 768px) {
  .page-title {
    font-size: 2rem;
  }
  
  .back-button-container {
    margin-bottom: var(--space-3);
  }
}
</style>