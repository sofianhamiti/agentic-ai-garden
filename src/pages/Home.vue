<template>
  <div>
    <!-- Hero Section -->
    <section class="hero-section">
      <div class="container hero-container">
        <div class="hero-content">
          <!-- Title -->
          <h1 class="hero-title">
            <span>Agentic AI </span>
            <span class="hero-title-highlight">Garden</span>
          </h1>

          <!-- Subtitle -->
          <p class="hero-subtitle">
            Your Hub for Exploring and Learning <span class="hero-subtitle-highlight">Agentic AI on AWS</span>
          </p>

          <!-- Introduction -->
          <!-- <p class="hero-intro">
            This site brings together the latest information, blogs, videos, code, and learning resources for Agentic AI. Learn to build AI agents that can reason through problems, execute complex workflows, and adapt their behavior based on outcomes.
          </p> -->
          <p class="hero-intro">
            Software is undergoing a transformative shift from deterministic to agentic paradigms—evolving from
            rule-following systems to autonomous agents that observe, act, and learn from their environment. For
            developers embracing this frontier, the <strong>Agentic AI Garden</strong> gathers key learning resources,
            implementation patterns,
            and blueprints to build intelligent systems using AWS services and open-source frameworks.
          </p>
          <!-- Button -->
          <div class="hero-actions">
            <a href="#resources" class="explore-button">
              Explore Resources
            </a>
          </div>
        </div>
      </div>
    </section>

    <!-- Resources Section -->
    <section id="resources" class="resources-section">
      <div class="container">
        <h2 class="section-title">
          <span class="section-title-highlight">Get Started with Agentic AI</span>
        </h2>

        <div class="resources-grid">
          <ResourceCard v-for="card in resourceCards" :key="card.title" :title="card.title"
            :description="card.description" :count="card.count" :to="card.to" :icon="card.icon" />
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watchEffect } from 'vue'
import { useScroll } from '@vueuse/core'
import { useContentLoader, useFilterState } from '../composables/useContentLoader'

// Import components
import ResourceCard from '../components/ui/ResourceCard.vue'

// Import icons
import LightningIcon from '../components/icons/LightningIcon.vue'
import BookIcon from '../components/icons/BookIcon.vue'
import CodeIcon from '../components/icons/CodeIcon.vue'

// Use the content loader to access content data
const { filteredContent, loadContent, content, countResourcesBySection } = useContentLoader()

// Reactive variables to hold the resource counts
const learnCount = ref(0)
const buildCount = ref(0)

// Resource cards definition
const resourceCards = [
  {
    title: 'Discover',
    description: 'Begin your journey with Agentic AI concepts and AWS quickstarts',
    count: 0, // Fixed count as number
    to: '/discover', // Added placeholder link
    icon: LightningIcon
  },
  {
    title: 'Learn',
    description: 'Deepen your expertise with curated blogs, videos, and workshops',
    count: learnCount, // Count using total learn resources
    to: '/learn?type=all',
    icon: BookIcon
  },
  {
    title: 'Build',
    description: 'Fast-track your development with blueprints and repositories',
    count: buildCount, // Count build resources
    to: '/build', // Added placeholder link
    icon: CodeIcon
  }
]

// Scroll handling for animations
const { y } = useScroll(window)

// Load content on mount to ensure we have the correct count
onMounted(async () => {
  // Use direct counting method to get section counts without loading all content
  buildCount.value = await countResourcesBySection('build')
  learnCount.value = await countResourcesBySection('learn')
  
  // Load content for the current page (for filtering/display purposes)
  await loadContent()
})
</script>

<style>
.hero-section {
  min-height: 100vh;
  background: linear-gradient(to bottom right, var(--aws-blue-dark), var(--aws-blue-light), var(--aws-purple));
  color: white;
  display: flex;
  align-items: center;
  position: relative;
  overflow: hidden;
}

.hero-container {
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  /* Using golden ratio for vertical padding */
  padding-top: calc(100vh / 2.618);
  /* 1/1.618² */
  padding-bottom: calc(100vh / 2.618);
  box-sizing: border-box;
}

.hero-content {
  max-width: 78rem;
  /* Increased from 62rem to 78rem for wider content area */
  margin: 0 auto;
  padding: 0 1.5rem;
  /* Consistent padding for all content */
  display: grid;
  grid-template-columns: 61.8% 38.2%;
  /* Golden ratio split */
  grid-template-areas:
    "title title"
    "subtitle subtitle"
    "intro intro"
    ". button";
  position: relative;
}

.hero-title {
  grid-area: title;
  font-size: 2.5rem;
  font-weight: 700;
  margin-bottom: 1rem;
  /* 1 unit of spacing (base unit) */
  line-height: 1.1;
  max-width: 78rem;
  text-align: left;
  /* Ensure left alignment */
  margin-left: 0;
  /* Remove auto margins to ensure left alignment */
  margin-right: 0;
  animation: fadeInUp 0.8s ease-out forwards;
}

@media (min-width: 768px) {
  .hero-title {
    font-size: 3rem;
  }
}

@media (min-width: 1024px) {
  .hero-title {
    font-size: 3.2rem;
    /* Reduced while maintaining golden ratio relationships */
  }
}

.hero-title-highlight {
  background: linear-gradient(to right, white, var(--aws-orange));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  /* Create a subtle offset for visual interest based on golden ratio */
  text-shadow: 0 0 1px rgba(255, 255, 255, 0.1);
  position: relative;
  display: inline-block;
}

.hero-subtitle {
  grid-area: subtitle;
  font-size: 1.1rem;
  font-weight: 400;
  margin-bottom: 1.618rem;
  /* 1.618 units of spacing (golden ratio) */
  max-width: 100%;
  /* Allow full width to prevent wrapping */
  margin-left: 0;
  /* Set to 0 for left alignment */
  margin-right: 0;
  text-align: left;
  /* Ensure left alignment */
  white-space: nowrap; /* Prevent wrapping to multiple lines */
  animation: fadeInUp 0.8s ease-out 0.5s forwards;
  /* 0.8 × 0.618 = ~0.5s delay */
  opacity: 0;
  /* Start invisible */
}

@media (min-width: 768px) {
  .hero-subtitle {
    font-size: 1.5rem;
    /* Reduced size while maintaining golden ratio feel */
    letter-spacing: -0.01em; /* Slightly tighter letter spacing for better fit */
  }
}

@media (min-width: 1024px) {
  .hero-subtitle {
    font-size: 1.8rem; /* Reduced while maintaining golden ratio relationship */
    letter-spacing: -0.02em; /* Slightly tighter letter spacing for better fit */
  }
}

.hero-subtitle-highlight {
  color: var(--aws-orange);
  font-weight: 600;
  display: inline; /* Ensure inline display */
}

.hero-intro {
  grid-area: intro;
  font-size: 1rem;
  max-width: 50rem;
  /* Increased from 38.3rem to 50rem for consistency with subtitle */
  margin: 0 0 1rem;
  /* First paragraph has 1rem bottom margin */
  /* Base unit spacing between paragraphs */
  line-height: 1.8;
  letter-spacing: 0.01em;
  opacity: 0;
  font-weight: 300;
  padding: 0;
  /* Remove padding to align with title and subtitle */
  animation: fadeInUp 0.8s ease-out 0.809s forwards;
  /* 0.8 × 1.618 = 1.29 - 0.5 = ~0.8s delay */
  text-align: left;
  /* Maintain left alignment */
}

.hero-intro:last-of-type {
  margin-bottom: 2.618rem;
  /* Golden ratio squared (1.618 * 1.618) for last paragraph */
}

.hero-intro strong {
  color: white;
  font-weight: 500;
}

@media (min-width: 768px) {
  .hero-intro {
    font-size: 1.3rem;
    /* Reduced while maintaining golden ratio proportion */
    padding: 0;
    /* Remove padding to ensure consistent alignment */
  }

  /* Maintain the golden ratio for spacing but ensure consistent left alignment */
  .hero-content {
    padding: 0 2rem;
    /* Slightly increased padding for better spacing on larger screens */
    text-align: left;
    /* Ensure left alignment is maintained on larger screens */
  }
}

@media (min-width: 1024px) {
  .hero-intro {
    font-size: 1.4rem;
    /* Reduced while maintaining golden ratio relationships */
    max-width: 50rem;
    /* Increased from 38.3rem to 50rem for consistency with other elements */
  }

  /* Improved vertical spacing for larger screens */
  .hero-container {
    padding-top: calc(100vh / 4.236);
    /* 1/1.618³ for golden ratio vertical spacing */
    padding-bottom: calc(100vh / 4.236);
  }

  .hero-content {
    /* Adjust grid proportions on larger screens for better visibility */
    grid-template-columns: 61.8% 38.2%;
    /* Perfect golden ratio */
  }
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(16.18px);
    /* Based on golden ratio: 10 × 1.618 */
  }

  to {
    opacity: 0.85;
    transform: translateY(0);
  }
}

/* For reduced motion preferences */
@media (prefers-reduced-motion: reduce) {

  .hero-title,
  .hero-subtitle,
  .hero-intro,
  .explore-button {
    animation-name: fadeSimple;
    animation-duration: 0.5s;
  }

  @keyframes fadeSimple {
    from {
      opacity: 0;
    }

    to {
      opacity: 0.85;
    }
  }
}

.hero-actions {
  grid-area: button;
  /* Button is positioned in the grid area */
  text-align: left;
  /* Position at golden ratio point */
  width: 100%;
  /* Ensure the container spans full width */
  opacity: 0;
  animation: fadeInUp 0.8s ease-out 1.309s forwards;
  /* 0.809 × 1.618 = ~1.309s delay */
}

.explore-button {
  font-size: 1rem;
  font-weight: 600;
  padding: 0.85rem 1.75rem;
  /* Increased horizontal padding for better balance without icon */
  border-radius: var(--radius-md);
  background: linear-gradient(to right, var(--aws-orange), var(--aws-orange-light));
  color: var(--aws-blue-dark);
  border: none;
  cursor: pointer;
  display: inline-block;
  /* Changed from inline-flex since we don't need to align icon anymore */
  text-decoration: none;
  transition: transform 0.3s cubic-bezier(0.165, 0.84, 0.44, 1),
    box-shadow 0.3s cubic-bezier(0.165, 0.84, 0.44, 1),
    background 0.3s ease-out;
  /* Split transitions for better performance */
  box-shadow: 0 10px 16.18px rgba(0, 0, 0, 0.1);
  /* Golden ratio for shadow: 10 × 1.618 */
  opacity: 1;
  /* Maintain full opacity since parent container handles the fade in */
  position: relative;
}

.explore-button:hover {
  box-shadow: 0 16.18px 26.18px rgba(0, 0, 0, 0.2);
  /* Golden ratio: 10 × 1.618 = 16.18, 16.18 × 1.618 = 26.18 */
  transform: translateY(-5px) scale(1.038);
  /* Golden ratio: 1.618/1.562 = ~1.038 */
  background: linear-gradient(to right, var(--aws-orange), var(--aws-orange));
  color: var(--aws-blue-dark);
}

.explore-button:active {
  transform: translateY(-1px);
  box-shadow: 0 8px 12.94px rgba(0, 0, 0, 0.15);
  /* Golden ratio: 8 × 1.618 = 12.94 */
}

.ml-2 {
  margin-left: 0.5rem;
}

/* Resources Section */
.resources-section {
  padding: var(--space-20) 0 var(--space-20);
  min-height: 70vh;
  /* Reduced from 85vh for better proportion */
  background: linear-gradient(to bottom, #f8f9fa, #ffffff);
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.dark .resources-section {
  background: linear-gradient(to bottom, #121212, #1a1a1a);
}

.section-title {
  text-align: center;
  margin-bottom: var(--space-16);
  font-size: 2.5rem;
  font-weight: 700;
}

.section-title-highlight {
  background: linear-gradient(to right, var(--aws-orange), var(--aws-purple));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.resources-grid {
  display: grid;
  gap: var(--space-8);
  /* Increased gap between cards */
  margin-top: var(--space-8);
  /* Add spacing below section title */
}

@media (min-width: 640px) {
  .resources-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (min-width: 1024px) {
  .resources-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
