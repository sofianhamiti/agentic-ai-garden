<template>
  <div class="filter-category-sections">
    <!-- Time Period Filter Section -->
    <FilterSection
      v-if="showTimeFilter"
      title="Time Period"
      :is-mobile="isMobile"
      :open="accordionState.time"
      :toggle="() => toggleAccordion('time')"
      :is-active="filters.time !== 'all'"
    >
      <FilterOptions
        type="radio"
        v-model="filters.time"
        :options="filterOptions.timeFilters.values"
        name="time"
        @update:modelValue="$emit('filter-change', 'time', $event)"
      />
    </FilterSection>
    
    <!-- Skill Level Filter Section -->
    <FilterSection
      v-if="showSkillFilter"
      title="Skill Level"
      :is-mobile="isMobile"
      :open="accordionState.skill"
      :toggle="() => toggleAccordion('skill')"
      :is-active="filters.skillLevel !== ''"
    >
      <FilterOptions
        type="radio"
        v-model="filters.skillLevel"
        :options="[{ value: '', label: 'All Levels' }, ...filterOptions.skillLevels.values.map(skill => ({ value: skill, label: skill }))]"
        name="skill"
        @update:modelValue="$emit('filter-change', 'skillLevel', $event)"
      />
    </FilterSection>
    
    <!-- Frameworks Filter Section -->
    <FilterSection
      v-if="showFrameworksFilter && filterOptions.frameworks.values.length > 0"
      title="Frameworks"
      :is-mobile="isMobile"
      :open="accordionState.frameworks"
      :toggle="() => toggleAccordion('frameworks')"
      :is-active="filters.frameworks.length > 0"
    >
      <FilterOptions
        type="checkbox"
        v-model="filters.frameworks"
        :options="filterOptions.frameworks.values"
        @update:modelValue="$emit('filter-change', 'frameworks', $event)"
      />
    </FilterSection>
    
    <!-- AWS Services Filter Section -->
    <FilterSection
      v-if="showServicesFilter"
      title="AWS Services"
      :is-mobile="isMobile"
      :open="accordionState.services"
      :toggle="() => toggleAccordion('services')"
      :is-active="filters.services.length > 0"
    >
      <div>
        <FilterOptions
          type="checkbox"
          v-model="filters.services"
          :options="displayedServices"
          scrollable
          @update:modelValue="$emit('filter-change', 'services', $event)"
        />
        
        <!-- Show more/less button -->
        <button 
          v-if="filteredServices.length > initialServicesCount" 
          @click="toggleShowMoreServices" 
          class="show-more"
        >
          <span v-if="!showAllServices">Show more ({{ filteredServices.length - initialServicesCount }} more)</span>
          <span v-else>Show less</span>
        </button>
      </div>
    </FilterSection>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import FilterSection from './FilterSection.vue';
import FilterOptions from './FilterOptions.vue';

const props = defineProps({
  filters: {
    type: Object,
    required: true
  },
  filterOptions: {
    type: Object,
    required: true
  },
  accordionState: {
    type: Object,
    required: true
  },
  isMobile: {
    type: Boolean,
    default: false
  },
  showTimeFilter: {
    type: Boolean,
    default: true
  },
  showSkillFilter: {
    type: Boolean,
    default: true
  },
  showFrameworksFilter: {
    type: Boolean,
    default: true
  },
  showServicesFilter: {
    type: Boolean,
    default: true
  }
});

const emit = defineEmits(['toggle-accordion', 'filter-change']);

// Show/hide services functionality
const initialServicesCount = 8; // Show first 8 services initially
const showAllServices = ref(false);

// All services without filtering
const filteredServices = computed(() => {
  return props.filterOptions?.services?.values || [];
});

// Displayed services based on show more/less state
const displayedServices = computed(() => {
  if (showAllServices.value || filteredServices.value.length <= initialServicesCount) {
    return filteredServices.value;
  }
  return filteredServices.value.slice(0, initialServicesCount);
});

// Toggle accordion sections
const toggleAccordion = (section) => {
  emit('toggle-accordion', section);
};

// Toggle show more/less services
function toggleShowMoreServices() {
  showAllServices.value = !showAllServices.value;
}
</script>

<style scoped>
.filter-category-sections {
  display: flex;
  flex-direction: column;
  gap: 0;
}

.show-more {
  display: block;
  width: 100%;
  padding: var(--gr-space-xs) var(--gr-space-sm);
  margin-top: var(--gr-space-xs);
  background: transparent;
  border: 1px solid rgba(var(--aws-purple-rgb), 0.2);
  border-radius: var(--radius-md);
  color: var(--aws-purple);
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
}

.show-more:hover {
  background-color: rgba(var(--aws-purple-rgb), 0.05);
  border-color: rgba(var(--aws-purple-rgb), 0.3);
}

.dark .show-more {
  border-color: rgba(255, 255, 255, 0.1);
  color: var(--aws-purple);
}

.dark .show-more:hover {
  background-color: rgba(255, 255, 255, 0.05);
  border-color: rgba(255, 255, 255, 0.2);
}
</style>