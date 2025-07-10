<template>
  <div class="detail-page">
    <div v-if="isLoading" class="loading">
      <div class="spinner"></div>
      <p>Loading...</p>
    </div>

    <div v-else-if="error" class="error">
      <h2>Content Not Found</h2>
      <p>{{ error }}</p>
      <RouterLink to="/build" class="back-button">← Back to Build</RouterLink>
    </div>

    <div v-else class="detail-page-content">
      <!-- Header Section -->
      <slot name="header" />

      <!-- Main Content -->
      <div class="detail-content">
        <div class="container">
          <div class="detail-body">
            <main class="content-main">
              <slot name="content" />
            </main>
            <aside class="content-sidebar">
              <slot name="sidebar" />
            </aside>
          </div>
        </div>
      </div>

      <!-- Modals/Overlays -->
      <slot name="modals" />
    </div>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router'

defineProps({
  isLoading: {
    type: Boolean,
    default: false
  },
  error: {
    type: String,
    default: null
  }
})
</script>

<style scoped>
.detail-page {
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

.container {
  max-width: 100rem;
  width: 100%;
  margin: 0 auto;
  padding: 0 var(--space-4);
}

.detail-content {
  padding: var(--space-12) 0; /* Standard section spacing */
}

.detail-body {
  display: grid;
  grid-template-columns: 2fr 1fr; /* Standard 2:1 proportions */
  gap: var(--space-8); /* Standard spacing */
  align-items: start;
}

.content-main {
  min-width: 0; /* Prevents grid overflow issues */
  width: 100%;
}

.content-sidebar {
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  padding: var(--space-6); /* Standard internal spacing */
  border: 1px solid var(--color-border);
  position: sticky;
  top: var(--space-6); /* Standard sticky offset */
  width: 100%;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

/* Responsive Design */
@media (max-width: 1024px) {
  .detail-body {
    grid-template-columns: 1fr;
    gap: var(--space-6); /* Standard mobile spacing */
  }
  
  .content-sidebar {
    position: static;
    order: -1; /* Show sidebar above content on mobile */
    width: 100%;
  }
}

@media (max-width: 768px) {
  .detail-content {
    padding: var(--space-8) 0; /* Standard mobile spacing */
  }
  
  .container {
    padding: 0 var(--space-4);
  }
  
  .detail-body {
    gap: var(--space-4); /* Standard tight mobile spacing */
  }
  
  .content-sidebar {
    padding: var(--space-4); /* Standard mobile padding */
  }
}
</style>
