<template>
  <div class="filter-section" :class="{ 'is-active': isActive }">
    <div 
      class="accordion-header" 
      :class="{ 'is-open': open, 'is-active': isActive }"
      @click="toggle"
      :data-title="title"
    >
      <div class="accordion-left">
        <span class="section-icon" v-if="icon">
          <component :is="icon" />
        </span>
        <span class="filter-label">{{ title }}</span>
      </div>
      <div class="accordion-right">
        <span class="accordion-icon" :class="{ 'is-open': open }">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="6 9 12 15 18 9"></polyline>
          </svg>
        </span>
      </div>
    </div>
    
    <transition
      @before-enter="handleBeforeEnter"
      @enter="handleEnter"
      @after-enter="handleAfterEnter"
      @before-leave="handleBeforeLeave"
      @leave="handleLeave"
    >
      <div v-show="open" class="filter-options-wrapper">
        <div class="filter-options">
          <slot></slot>
        </div>
      </div>
    </transition>
  </div>
</template>

<script setup>

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  icon: {
    type: Object,
    required: true
  },
  isMobile: {
    type: Boolean,
    default: false
  },
  open: {
    type: Boolean,
    default: false
  },
  toggle: {
    type: Function,
    required: true
  },
  isActive: {
    type: Boolean,
    default: false
  }
});

// Simplified transition handlers
const handleBeforeEnter = (el) => {
  el.style.height = '0px';
  el.style.opacity = '0';
};

const handleEnter = (el) => {
  const height = el.scrollHeight;
  el.style.height = height + 'px';
  el.style.opacity = '1';
  el.classList.add('is-visible');
};

const handleAfterEnter = (el) => {
  el.style.height = '';
};

const handleBeforeLeave = (el) => {
  el.style.height = el.scrollHeight + 'px';
};

const handleLeave = (el) => {
  el.offsetHeight; // Force reflow
  el.style.height = '0px';
  el.style.opacity = '0';
  el.classList.remove('is-visible');
};
</script>

<style scoped>
/* Filter Section Styles */
.filter-section {
  position: relative;
  margin-bottom: var(--gr-space-md);
  transition: none;
  overflow: hidden;
}

.filter-section:not(:last-child)::after {
  content: "";
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 1px;
  background: linear-gradient(
    to right,
    transparent,
    rgba(var(--aws-purple-rgb), 0.1),
    rgba(var(--aws-purple-rgb), 0.15),
    rgba(var(--aws-purple-rgb), 0.1),
    transparent
  );
  transform: scaleY(0.5);
  margin: 0 auto;
}

.filter-section.is-active::before {
  content: "";
  position: absolute;
  left: -4px;
  top: 25px;
  width: 3px;
  height: 16px;
  background: linear-gradient(
    to bottom,
    var(--aws-purple),
    rgba(var(--aws-purple-rgb), 0.6)
  );
  border-radius: 2px;
  box-shadow: 0 0 8px rgba(var(--aws-purple-rgb), 0.3);
  transition: all 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
  opacity: 0.85;
}

.filter-section.is-active.is-open::before {
  height: 24px;
  opacity: 1;
}

.filter-section:hover.is-active::before {
  transform: scaleY(1.1);
  opacity: 1;
}

/* Accordion header styles */
.accordion-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1rem; /* Slightly larger font */
  font-weight: 500;
  padding: var(--gr-space-sm) var(--gr-space-xs);
  color: var(--color-text);
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: none;
  position: relative;
  border-radius: var(--radius-lg);
  margin-bottom: var(--gr-space-xs);
  height: 60px; /* Increased height */
  width: 100%; /* Full width */
  margin-left: 0;
  /* Removed gradient */
}

.accordion-header:hover {
  background-color: rgba(var(--aws-purple-rgb), 0.05);
  transform: translateX(2px);
}

.accordion-header.is-active {
  color: var(--aws-purple);
  font-weight: 600;
  letter-spacing: -0.01em;
}

/* Removed pulse animation */

.dark .accordion-header {
  color: rgba(255, 255, 255, 0.9);
}

.dark .accordion-header:hover {
  background-color: rgba(255, 255, 255, 0.05);
}

.dark .accordion-header.is-active {
  color: var(--aws-purple);
}

.accordion-left {
  display: flex;
  align-items: center;
  gap: var(--gr-space-sm); /* Golden ratio spacing */
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.section-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px; /* Increased size */
  height: 24px; /* Increased size */
  color: var(--aws-blue-medium);
  opacity: 0.7;
  transition: none;
  flex-shrink: 0;
}

.accordion-header:hover .section-icon {
  color: var(--aws-purple);
  opacity: 0.9;
}

.accordion-header.is-active .section-icon {
  color: var(--aws-purple);
  opacity: 1;
}

.accordion-right {
  display: flex;
  align-items: center;
  gap: var(--gr-space-sm); /* Golden ratio spacing */
}

.accordion-icon {
  transition: none;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 21px; /* Golden ratio unit */
  height: 21px; /* Golden ratio unit */
  color: rgba(var(--aws-blue-rgb), 0.6);
  flex-shrink: 0;
  border-radius: 50%;
}

.accordion-icon.is-open {
  transform: rotate(180deg);
  color: var(--aws-purple);
}

.accordion-header:hover .accordion-icon:not(.is-open) {
  color: rgba(var(--aws-purple-rgb), 0.6);
}

/* Filter options wrapper with transitions */
.filter-options-wrapper {
  overflow: hidden;
  transition: height 0.2s linear, opacity 0.2s linear;
  padding-left: var(--gr-space-xs); /* Reduced padding to increase content width */
  padding-right: var(--gr-space-xs); /* Reduced padding to increase content width */
  position: relative;
  width: 100%;
  margin-left: 0;
}

.filter-options-wrapper.is-visible {
  background: linear-gradient(
    to bottom,
    rgba(var(--aws-purple-rgb), 0.01),
    transparent 20px
  );
}

.filter-options {
  display: flex;
  flex-direction: column;
  gap: var(--gr-space-xs); /* Golden ratio spacing */
  padding: var(--gr-space-xs) 0 var(--gr-space-sm);
  /* Removed animation */
}

/* Removed animation */

/* Filter label */
.filter-label {
  white-space: nowrap;
  letter-spacing: -0.01em;
  font-weight: 500;
  padding-top: 1px; /* Alignment fix */
  position: relative;
  transition: all 0.3s ease;
}

.accordion-header.is-active .filter-label {
  transform: translateX(1px);
}

/* Selected count badge - already defined above with enhanced styling */
</style>
