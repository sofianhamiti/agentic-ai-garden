<template>
  <div class="sidebar-header">
    <div class="sidebar-header-left">
      <button v-if="isMobile"
        class="sidebar-close-button" 
        @click="$emit('close')"
        aria-label="Close filters"
      >
        <div class="close-button-icon">
          <CloseIcon />
        </div>
        <span class="close-button-text">Close</span>
      </button>
      <h3 v-else class="sidebar-title">
        Filters
      </h3>
    </div>
    <div class="sidebar-header-right">
      <button
        class="clear-filters-small"
        @click="$emit('clear-filters')"
        :disabled="!hasActiveFilters"
        aria-label="Clear all filters"
      >
        Clear
      </button>
    </div>
  </div>
</template>

<script setup>
import CloseIcon from './icons/CloseIcon.vue';

defineProps({
  isMobile: {
    type: Boolean,
    default: false
  },
  hasActiveFilters: {
    type: Boolean,
    default: false
  }
});

defineEmits(['close', 'clear-filters']);
</script>

<style scoped>
.sidebar-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--gr-space-sm) var(--gr-space-md);
  border-bottom: 1px solid transparent;
  background: transparent;
  position: relative;
  border-radius: var(--radius-md) var(--radius-md) 0 0;
  margin-bottom: var(--gr-space-xs);
}

.sidebar-header-left,
.sidebar-header-right {
  display: flex;
  align-items: center;
}

.sidebar-title {
  font-size: 1.1rem;
  font-weight: 600;
  margin: 0;
  color: var(--aws-blue-dark);
  letter-spacing: -0.01em;
  display: flex;
  align-items: center;
  gap: 6px;
}

.dark .sidebar-title {
  color: rgba(255, 255, 255, 0.9);
}

.sidebar-header::after {
  display: none; /* Hide the bottom line */
}

.sidebar-close-button {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: var(--gr-space-xs);
  background: transparent;
  border: none;
  padding: var(--gr-space-xs) var(--gr-space-sm);
  font-size: 0.95rem;
  font-weight: 500;
  color: var(--aws-blue-dark);
  cursor: pointer;
  border-radius: var(--radius-md);
  transition: none;
  position: relative;
  overflow: hidden;
}

.sidebar-close-button:hover {
  color: var(--aws-purple);
  background-color: rgba(var(--aws-purple-rgb), 0.05);
}

.close-button-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 34px;
  height: 34px;
  border-radius: 50%;
  background: rgba(var(--aws-purple-rgb), 0.05);
  transition: none;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.06);
  z-index: 1;
}

.sidebar-close-button:hover .close-button-icon {
  background: rgba(var(--aws-purple-rgb), 0.1);
}

.clear-filters-small {
  background: transparent;
  border: none;
  color: var(--aws-purple);
  font-size: 0.9rem;
  font-weight: 500;
  cursor: pointer;
  padding: var(--gr-space-xs) var(--gr-space-sm);
  border-radius: var(--radius-md);
  transition: all 0.2s ease;
}

.clear-filters-small:hover:not(:disabled) {
  background-color: rgba(var(--aws-purple-rgb), 0.05);
  color: var(--aws-purple);
}

.clear-filters-small:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.dark .sidebar-close-button:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

/* Mobile styles */
@media (max-width: 1023.98px) {
  .sidebar-close-button {
    position: relative;
    padding: var(--gr-space-xs);
    height: 44px; /* Mobile tap target size */
    margin-right: var(--gr-space-xs);
  }
  
  /* Show the text in mobile view to improve usability */
  .close-button-text {
    font-weight: 500;
    font-size: 0.9rem;
  }
}
</style>