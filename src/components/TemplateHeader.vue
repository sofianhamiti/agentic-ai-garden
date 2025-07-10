<template>
  <header class="template-header">
    <div class="container">
      <!-- Subtle back link -->
      <RouterLink to="/build?type=blueprints" class="back-link">
        ← Back to Blueprints
      </RouterLink>
      
      <!-- Header content -->
      <div class="header-content">
        <h1 class="template-title">{{ title }}</h1>
        <p class="template-description">{{ description }}</p>
      </div>
    </div>
  </header>
</template>

<script setup>
import { RouterLink } from 'vue-router'

defineProps({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  repository: {
    type: String,
    default: ''
  },
  architectureUrl: {
    type: String,
    default: ''
  }
})

defineEmits(['openArchitecture'])
</script>

<style scoped>
.template-header {
  padding: var(--space-8) 0 var(--space-6);
  margin-bottom: var(--space-8);
}

.back-link {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  color: var(--color-text-muted);
  font-weight: 400;
  font-size: 0.9rem;
  margin-bottom: var(--space-6);
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-md);
  transition: all 0.2s ease;
  text-decoration: none;
  opacity: 0.8;
}

.back-link:hover {
  background: var(--color-surface);
  color: var(--color-secondary);
  transform: translateX(-2px);
  opacity: 1;
}

.header-content {
  max-width: none;
}

.template-title {
  font-size: 2.5rem;
  font-weight: 700;
  background: linear-gradient(135deg, var(--aws-purple) 0%, var(--aws-orange) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  margin-bottom: var(--space-4);
  line-height: 1.1;
  letter-spacing: -0.02em;
}

.template-description {
  font-size: 1.125rem;
  color: var(--color-text-muted);
  line-height: 1.6;
  font-weight: 400;
  max-width: 60rem;
  margin: 0;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .template-title {
    font-size: 2.25rem;
  }
  
  .template-description {
    font-size: 1.1rem;
  }
}

@media (max-width: 768px) {
  .template-header {
    padding: var(--space-6) 0 var(--space-4);
  }
  
  .template-title {
    font-size: 2rem;
    line-height: 1.15;
  }
  
  .template-description {
    font-size: 1rem;
    max-width: none;
  }
}

@media (max-width: 480px) {
  .template-title {
    font-size: 1.75rem;
  }
  
  .template-description {
    font-size: 0.95rem;
  }
}
</style>
