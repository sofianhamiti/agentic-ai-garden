<template>
  <RouterLink :to="to" class="resource-card" :class="{ 'disabled': !to }">
    <div class="card-header">
      <div class="card-icon">
        <component :is="icon" size="24" :fill="fillColor" />
      </div>
      <h3 class="card-title">{{ title }}</h3>
    </div>
    
    <div class="card-content">
      <p class="card-description">{{ description }}</p>
    </div>
    
    <div class="card-footer">
      <span class="resource-count">{{ count }} Resources</span>
      <svg 
        v-if="to"
        class="card-arrow"
        xmlns="http://www.w3.org/2000/svg" 
        width="16" 
        height="16" 
        viewBox="0 0 24 24" 
        fill="none" 
        stroke="currentColor" 
        stroke-width="2" 
        stroke-linecap="round" 
        stroke-linejoin="round"
      >
        <path d="M5 12h14"></path>
        <path d="m12 5 7 7-7 7"></path>
      </svg>
    </div>
  </RouterLink>
</template>

<script setup>
import { computed } from 'vue'
import { RouterLink } from 'vue-router'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  count: {
    type: Number,
    default: 0
  },
  to: {
    type: String,
    default: ''
  },
  icon: {
    type: Object,
    required: true
  },
  color: {
    type: String,
    default: '#7c3aed' // Default purple color
  }
})

// Compute fill color with reduced opacity
const fillColor = computed(() => {
  // If color starts with #, convert to rgba
  if (props.color.startsWith('#')) {
    const hex = props.color.slice(1)
    const r = parseInt(hex.substring(0, 2), 16)
    const g = parseInt(hex.substring(2, 4), 16)
    const b = parseInt(hex.substring(4, 6), 16)
    return `rgba(${r}, ${g}, ${b}, 0.1)`
  }
  return props.color
})
</script>

<style>
.resource-card {
  display: flex;
  flex-direction: column;
  background-color: #ffffff;
  border-radius: var(--radius-xl);
  box-shadow: 0px 8px 16px -12px rgba(0, 0, 0, 0.1), 0px 5px 10px -8px rgba(0, 0, 0, 0.04);
  overflow: hidden;
  transition: all 0.3s ease;
  height: 100%;
  min-height: 15rem; /* Reduced minimum height for better proportions */
  text-decoration: none;
  color: var(--color-text);
  border: 1px solid var(--color-border);
}

.resource-card:hover {
  transform: translateY(-6px);
  box-shadow: 0px 15px 30px -12px rgba(0, 0, 0, 0.15), 0px 12px 20px -8px rgba(0, 0, 0, 0.06);
  text-decoration: none;
}

.card-header {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-6); /* Reduced padding */
  border-bottom: 1px solid var(--color-border);
}

.card-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 42px;
  height: 42px;
  border-radius: var(--radius-md);
  background-color: var(--aws-orange);
  color: white;
}

.card-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
  color: var(--aws-purple);
}

.card-content {
  flex: 1;
  padding: var(--space-4) var(--space-6) var(--space-6); /* Reduced padding */
  background-image: linear-gradient(to bottom right, #fff, #f5f1ff);
}

.card-description {
  font-size: 1rem;
  line-height: 1.6;
  margin: 0;
  color: var(--color-text);
  position: relative;
  padding-bottom: var(--space-6);
}

.card-description::after {
  content: '';
  position: absolute;
  bottom: 0;
  left: 0;
  width: 3rem;
  height: 3px;
  background: linear-gradient(to right, var(--aws-orange), var(--aws-purple));
  border-radius: var(--radius-full);
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: var(--space-4) var(--space-6); /* Reduced padding */
  border-top: 1px solid var(--color-border);
  margin-top: auto; /* Push footer to bottom of card */
}

.resource-count {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--aws-purple);
}

.card-arrow {
  color: var(--aws-orange);
  transition: transform 0.2s ease;
}

.resource-card:hover .card-arrow {
  transform: translateX(3px);
}

.resource-card.disabled {
  opacity: 0.8;
  cursor: default;
}

.resource-card.disabled:hover {
  transform: none;
  box-shadow: 0px 10px 25px -12px rgba(0, 0, 0, 0.1), 0px 8px 16px -8px rgba(0, 0, 0, 0.04);
}

/* Dark mode styles */
.dark .resource-card {
  background-color: var(--aws-blue-dark);
  border-color: var(--color-border-dark);
}

.dark .card-content {
  background-image: linear-gradient(to bottom right, var(--aws-blue-dark), var(--aws-blue-medium));
}

.dark .card-header,
.dark .card-footer {
  border-color: var(--color-border-dark);
}

.dark .card-description {
  color: var(--color-text-dark);
}
</style>
