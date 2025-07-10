<template>
  <div 
    class="content-image-container"
    :style="{ aspectRatio: aspectRatio }"
    :aria-label="loadingAriaLabel"
  >
    <!-- Loading state -->
    <div 
      v-if="isLoading && showLoadingState" 
      class="content-image-skeleton"
      role="img"
      :aria-label="`Loading image: ${alt}`"
    >
      <div class="skeleton-animation"></div>
    </div>
    
    <!-- Main image -->
    <img
      v-show="!isLoading && !hasError"
      :src="src"
      :alt="alt"
      class="content-image"
      :class="imageClasses"
      @load="handleImageLoad"
      @error="handleImageError"
      loading="lazy"
    />
    
    <!-- Fallback AWS logo -->
    <img
      v-show="hasError"
      :src="fallbackSrc"
      :alt="fallbackAlt"
      class="content-image fallback-image"
      :class="{ 'image-loaded': fallbackLoaded }"
      @load="handleFallbackLoad"
      @error="handleFallbackError"
    />
    
    <!-- Error state (if even fallback fails) -->
    <div 
      v-if="fallbackError"
      class="content-image-error"
      role="img"
      :aria-label="`Failed to load image: ${alt}`"
    >
      <div class="error-icon">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
          <circle cx="8.5" cy="8.5" r="1.5"/>
          <polyline points="21,15 16,10 5,21"/>
        </svg>
      </div>
      <span class="error-text">Image unavailable</span>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { getDefaultImage, getContentAltText } from '../../utils/contentHelpers'

const props = defineProps({
  src: {
    type: String,
    required: true
  },
  alt: {
    type: String,
    required: true
  },
  aspectRatio: {
    type: String,
    default: '16/9'
  },
  showLoadingState: {
    type: Boolean,
    default: true
  },
  contentItem: {
    type: Object,
    default: null
  }
})

// Component state
const isLoading = ref(true)
const hasError = ref(false)
const imageLoaded = ref(false)
const fallbackLoaded = ref(false)
const fallbackError = ref(false)

// Fallback image source (AWS logo)
const fallbackSrc = ref('/agentic-ai-garden/images/aws-logo.svg')

// Helper function to detect if image is AWS logo
const isAwsLogo = (src) => {
  return src && src.includes('aws-logo.svg')
}

// Computed properties
const fallbackAlt = computed(() => {
  if (props.contentItem) {
    return getContentAltText(props.contentItem)
  }
  return `AWS logo - ${props.alt}`
})

const loadingAriaLabel = computed(() => {
  if (isLoading.value) return `Loading image: ${props.alt}`
  if (hasError.value && !fallbackError.value) return `Showing fallback image for: ${props.alt}`
  if (fallbackError.value) return `Image failed to load: ${props.alt}`
  return props.alt
})

// Computed class for main image
const imageClasses = computed(() => {
  return {
    'image-loaded': imageLoaded.value,
    'aws-logo': isAwsLogo(props.src)
  }
})

// Event handlers
const handleImageLoad = () => {
  isLoading.value = false
  imageLoaded.value = true
  hasError.value = false
}

const handleImageError = () => {
  isLoading.value = false
  hasError.value = true
  imageLoaded.value = false
}

const handleFallbackLoad = () => {
  isLoading.value = false  // ✅ Ensure loading state is cleared
  fallbackLoaded.value = true
  fallbackError.value = false
}

const handleFallbackError = () => {
  isLoading.value = false  // ✅ Clear loading state even on fallback error
  fallbackError.value = true
  fallbackLoaded.value = false
}

// Reset states when src changes - but only if src actually changed to prevent race conditions
watch(() => props.src, (newSrc, oldSrc) => {
  // Skip reset if src hasn't actually changed or is just undefined/null variations
  if (newSrc === oldSrc || (!newSrc && !oldSrc)) {
    return
  }
  
  isLoading.value = true
  hasError.value = false
  imageLoaded.value = false
  fallbackLoaded.value = false
  fallbackError.value = false
})

// Initialize on mount
onMounted(() => {
  // If no src provided, go straight to fallback
  if (!props.src || props.src === fallbackSrc.value) {
    handleImageError()
  }
})
</script>

<style scoped>
.content-image-container {
  position: relative;
  width: 100%;
  overflow: hidden;
  background-color: var(--color-background-subtle, #f8f9fa);
  border-radius: inherit;
}

.content-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: all 0.3s ease;
  opacity: 0;
}

.content-image.image-loaded {
  opacity: 1;
}

/* AWS logo styling - applied to any AWS logo regardless of how it's loaded */
.content-image.aws-logo {
  object-fit: contain;
  object-position: center;
  padding: 20%;
  background-color: white;
}

.dark .content-image.aws-logo {
  background-color: var(--aws-blue-dark);
}

.fallback-image {
  object-fit: contain;
  object-position: center;
  padding: 20%;
  background-color: white;
}

.dark .fallback-image {
  background-color: var(--aws-blue-dark);
}

.content-image-skeleton {
  width: 100%;
  height: 100%;
  position: relative;
  background-color: var(--color-background-subtle, #f1f3f4);
  overflow: hidden;
}

.skeleton-animation {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.4) 50%,
    transparent 100%
  );
  animation: skeleton-loading 1.5s infinite;
}

.dark .skeleton-animation {
  background: linear-gradient(
    90deg,
    transparent 0%,
    rgba(255, 255, 255, 0.1) 50%,
    transparent 100%
  );
}

@keyframes skeleton-loading {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(100%);
  }
}

.content-image-error {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: var(--space-2, 8px);
  color: var(--color-muted, #6b7280);
  background-color: var(--color-background-subtle, #f8f9fa);
}

.dark .content-image-error {
  background-color: var(--aws-blue-medium);
  color: var(--color-text-dark);
}

.error-icon {
  opacity: 0.6;
}

.error-text {
  font-size: 0.75rem;
  font-weight: 500;
  text-align: center;
}

/* Hover effects */
.content-image-container:hover .content-image.image-loaded {
  transform: scale(1.05);
}

.content-image-container:hover .fallback-image.image-loaded {
  transform: scale(1.02);
}

/* Accessibility improvements */
@media (prefers-reduced-motion: reduce) {
  .content-image,
  .skeleton-animation {
    transition: none;
    animation: none;
  }
}

/* High contrast mode support */
@media (prefers-contrast: high) {
  .content-image-skeleton {
    border: 1px solid currentColor;
  }
  
  .content-image-error {
    border: 1px solid currentColor;
  }
}
</style>
