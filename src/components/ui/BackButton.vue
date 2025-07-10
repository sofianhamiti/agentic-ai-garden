<template>
  <RouterLink 
    :to="backNavigation.to" 
    class="back-button"
    :aria-label="backNavigation.label"
  >
    {{ backNavigation.label }}
  </RouterLink>
</template>

<script setup>
import { RouterLink } from 'vue-router'
import { useBackNavigation } from '../../composables/useBackNavigation'

// Use the back navigation composable
const { backNavigation } = useBackNavigation()
</script>

<style scoped>
.back-button {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  padding: var(--space-2) var(--space-3);
  background: rgba(255, 255, 255, 0.1);
  color: white;
  text-decoration: none;
  border-radius: var(--radius-md);
  transition: all 0.2s;
  font-size: 0.875rem;
  font-weight: 500;
  border: 1px solid rgba(255, 255, 255, 0.2);
  backdrop-filter: blur(10px);
}

.back-button:hover {
  background: rgba(255, 255, 255, 0.2);
  color: white;
  transform: translateY(-1px);
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
  border-color: rgba(255, 255, 255, 0.3);
}

.back-button:active {
  transform: translateY(0);
}

/* Mobile responsive */
@media (max-width: 768px) {
  .back-button {
    font-size: 0.8rem;
    padding: var(--space-1) var(--space-2);
  }
}
</style>