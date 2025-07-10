<template>
  <Teleport to="body">
    <div v-if="isVisible" class="modal-overlay" @click="$emit('close')">
      <div class="modal-content" @click.stop>
        <button class="modal-close" @click="$emit('close')" aria-label="Close modal">
          ×
        </button>
        
        <div class="modal-header">
          <h3>System Architecture</h3>
          <p v-if="description">{{ description }}</p>
        </div>
        
        <div class="modal-body">
          <img 
            v-if="imageUrl" 
            :src="imageUrl" 
            :alt="`Architecture diagram for ${title || 'template'}`"
            class="architecture-image" 
          />
          <div v-else class="no-image">
            <p>Architecture diagram not available</p>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
defineProps({
  isVisible: {
    type: Boolean,
    default: false
  },
  imageUrl: {
    type: String,
    default: ''
  },
  title: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  }
})

defineEmits(['close'])
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(4px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: var(--space-8);
}

.modal-content {
  background: var(--color-background);
  border-radius: var(--radius-xl);
  padding: 2.618rem; /* φ for internal spacing */
  max-width: 85vw; /* Golden ratio of viewport */
  max-height: 85vh;
  position: relative;
  overflow: auto;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.15), 0 10px 20px rgba(0, 0, 0, 0.1);
  animation: modalSlideIn 0.4s cubic-bezier(0.4, 0, 0.2, 1);
  aspect-ratio: 1.618 / 1; /* Golden rectangle */
}

.modal-close {
  position: absolute;
  top: 1rem;
  right: 1rem;
  background: var(--color-surface);
  border: none;
  width: 2.618rem; /* φ × base for button size */
  height: 2.618rem;
  border-radius: var(--radius-full);
  cursor: pointer;
  font-size: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
  color: var(--color-text-muted);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
}

.modal-close:hover {
  background: var(--aws-orange);
  color: white;
  transform: scale(1.1);
}

.modal-header {
  margin-bottom: 1.618rem; /* φ for section spacing */
  padding-right: 2.618rem; /* φ to avoid close button */
}

.modal-header h3 {
  margin: 0 0 0.618rem; /* φ⁻¹ for tight spacing */
  color: var(--aws-purple);
  font-size: 1.618rem; /* φ for modal heading */
  font-weight: 600;
  line-height: 1.2;
}

.modal-header p {
  margin: 0;
  color: var(--color-text-muted);
  line-height: 1.618; /* φ line height */
  font-size: 0.875rem;
}

.modal-body {
  text-align: center;
}

.architecture-image {
  max-width: 100%;
  height: auto;
  border-radius: var(--radius-lg);
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
}

.no-image {
  padding: var(--space-16);
  color: var(--color-text-muted);
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  border: 2px dashed var(--color-border);
}

.no-image p {
  margin: 0;
  font-style: italic;
}

/* Responsive Design */
@media (max-width: 768px) {
  .modal-overlay {
    padding: 1rem;
  }
  
  .modal-content {
    padding: 1.618rem; /* φ for mobile */
    max-width: 95vw;
    max-height: 90vh;
    aspect-ratio: unset; /* Remove aspect ratio on mobile for flexibility */
  }
  
  .modal-header {
    padding-right: 1.618rem;
  }
  
  .modal-header h3 {
    font-size: 1.25rem;
  }
  
  .modal-close {
    width: 2rem;
    height: 2rem;
  }
}

@keyframes modalSlideIn {
  from {
    transform: translateY(1.618rem) scale(0.95); /* φ for subtle entry */
    opacity: 0;
  }
  to {
    transform: translateY(0) scale(1);
    opacity: 1;
  }
}
</style>
