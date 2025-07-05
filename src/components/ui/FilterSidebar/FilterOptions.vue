<template>
  <div class="filter-options-container" :class="{ scrollable }">
    <label 
      v-for="option in normalizedOptions" 
      :key="typeof option === 'object' ? option.value : option" 
      class="custom-input"
      :class="{ 'custom-radio': type === 'radio', 'custom-checkbox': type === 'checkbox' }"
    >
      <input 
        :type="type"
        :value="typeof option === 'object' ? option.value : option"
        :checked="isOptionSelected(option)"
        :name="name"
        @change="handleChange(option)"
      />
      
      <!-- Control element (radio or checkbox) -->
      <span 
        class="input-control"
        :class="{ 'radio-control': type === 'radio', 'checkbox-control': type === 'checkbox' }"
      >
        <!-- Radio indicator -->
        <span v-if="type === 'radio'" class="radio-indicator"></span>
        
        <!-- Checkbox indicator -->
        <svg v-if="type === 'checkbox'" class="checkbox-icon" viewBox="0 0 24 24">
          <path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z" />
        </svg>
      </span>
      
      <!-- Label -->
      <span class="input-label">
        {{ typeof option === 'object' ? option.label : option }}
      </span>
      
      <!-- Count badge (optional) -->
      <span 
        v-if="counts && typeof counts[typeof option === 'object' ? option.value : option] !== 'undefined'"
        class="filter-count"
      >
        {{ counts[typeof option === 'object' ? option.value : option] }}
      </span>
    </label>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import '../../../assets/styles/filter-components.css';

const props = defineProps({
  type: {
    type: String,
    default: 'radio',
    validator: (value) => ['radio', 'checkbox'].includes(value)
  },
  modelValue: {
    type: [String, Array],
    required: true
  },
  options: {
    type: Array,
    required: true
  },
  name: {
    type: String,
    default: ''
  },
  counts: {
    type: Object,
    default: () => ({})
  },
  scrollable: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['update:modelValue', 'change']);

// Normalize options to handle both string arrays and object arrays
const normalizedOptions = computed(() => {
  return props.options.map(option => {
    if (typeof option === 'object' && option !== null) {
      return option;
    }
    return { value: option, label: option };
  });
});

// Check if an option is selected
const isOptionSelected = (option) => {
  const optionValue = typeof option === 'object' ? option.value : option;
  
  if (props.type === 'radio') {
    return props.modelValue === optionValue;
  } else {
    return Array.isArray(props.modelValue) && props.modelValue.includes(optionValue);
  }
};

// Handle change event
const handleChange = (option) => {
  const optionValue = typeof option === 'object' ? option.value : option;
  
  if (props.type === 'radio') {
    // For radio buttons, simply emit the selected value
    emit('update:modelValue', optionValue);
    emit('change', optionValue);
  } else {
    // For checkboxes, toggle the value in the array
    // Make a proper copy of the model value, ensuring it's always an array
    const modelValueArray = Array.isArray(props.modelValue) ? props.modelValue : [];
    const newValue = [...modelValueArray];
    const index = newValue.indexOf(optionValue);
    
    if (index === -1) {
      // Option doesn't exist in array, add it
      newValue.push(optionValue);
    } else {
      // Option exists in array, remove it
      newValue.splice(index, 1);
    }
    
    emit('update:modelValue', newValue);
    emit('change', newValue);
  }
};
</script>

<style scoped>
/* Component-specific styles */
.custom-input {
  display: flex;
  align-items: center;
  position: relative;
  cursor: pointer;
  padding: 4px var(--gr-space-xs);
  border-radius: var(--radius-md);
  transition: none;
  opacity: 1;
  width: 100%;
}

.custom-input:hover {
  background-color: rgba(var(--aws-purple-rgb), 0.05);
}

.custom-input input {
  position: absolute;
  opacity: 0;
  height: 0;
  width: 0;
}

/* Radio-specific styles */
.radio-control {
  border-radius: 50%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.radio-indicator {
  position: absolute;
  width: 7px; /* Slightly smaller dot for better alignment */
  height: 7px;
  border-radius: 50%;
  background: var(--aws-purple);
  opacity: 0;
  transform: scale(0);
  /* Use fixed positioning for perfect centering */
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  margin: auto;
}

.custom-radio input:checked ~ .radio-control {
  border-color: var(--aws-purple);
  background-color: rgba(255, 255, 255, 0.1);
  box-shadow: 0 2px 4px rgba(var(--aws-purple-rgb), 0.2);
}

.custom-radio input:checked ~ .radio-control .radio-indicator {
  opacity: 1;
  transform: scale(1);
}

/* Add specific dimensions for the input control to ensure perfect alignment */
.custom-radio .input-control {
  width: 18px;
  height: 18px;
}

/* Checkbox-specific styles */
.checkbox-control {
  border-radius: 5px;
  background-color: transparent;
}

.checkbox-control::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: var(--aws-purple);
  transform: scale(0);
  opacity: 0;
  border-radius: 3px;
  transition: none;
}

.checkbox-icon {
  width: 13px;
  height: 13px;
  fill: white;
  opacity: 0;
  position: relative;
  z-index: 2;
}

.custom-checkbox input:checked ~ .checkbox-control .checkbox-icon {
  opacity: 1;
}

.custom-checkbox input:checked ~ .checkbox-control {
  border-color: var(--aws-purple);
}

.custom-checkbox input:checked ~ .checkbox-control::before {
  transform: scale(1);
  opacity: 1;
}

.custom-input input:checked ~ .input-label {
  color: var(--aws-purple);
  font-weight: 500;
}

/* Dark mode specific adjustments */
.dark .radio-indicator {
  box-shadow: 0 0 8px rgba(var(--aws-purple-rgb), 0.4);
}
</style>
