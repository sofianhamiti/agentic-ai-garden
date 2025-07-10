<template>
  <header class="header" :class="{ 'header-scrolled': isScrolled }">
    <div class="container header-container">
      <div class="header-logo">
        <RouterLink to="/" class="logo-link">
          <span class="logo-text">Agentic AI Garden</span>
        </RouterLink>
      </div>
      
      <div class="header-actions">
        <!-- Desktop Navigation -->
        <nav class="desktop-nav" v-if="!isMobile">
          <ul class="nav-list">
            <li v-for="item in navItems" :key="item.name" class="nav-item" :class="{ 'has-dropdown': item.dropdown }">
              <RouterLink 
                :to="item.path" 
                class="nav-link"
                :class="{ active: isActive(item.path) }"
              >
                {{ item.name }}
                <span v-if="item.dropdown" class="dropdown-arrow">▼</span>
              </RouterLink>
              
              <!-- Dropdown Menu -->
              <div v-if="item.dropdown" class="dropdown-menu">
                <RouterLink 
                  v-for="dropdownItem in item.dropdown" 
                  :key="dropdownItem.name"
                  :to="dropdownItem.path"
                  class="dropdown-item"
                >
                  {{ dropdownItem.name }}
                </RouterLink>
              </div>
            </li>
          </ul>
        </nav>

        <!-- Mobile Menu Button -->
        <button
          v-if="isMobile"
          class="mobile-menu-button"
          @click="isMenuOpen = !isMenuOpen"
          aria-label="Toggle menu"
        >
          <div class="menu-icon" :class="{ 'is-open': isMenuOpen }">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </button>

      </div>
    </div>

    <!-- Mobile Navigation -->
    <div v-if="isMobile && isMenuOpen" class="mobile-menu-content">
      <nav class="mobile-nav">
        <ul class="mobile-nav-list">
          <li v-for="item in navItems" :key="item.name" class="mobile-menu-item">
            <div class="mobile-menu-item-wrapper">
              <RouterLink 
                :to="item.path" 
                class="mobile-menu-link" 
                @click="handleMobileItemClick(item)"
              >
                {{ item.name }}
              </RouterLink>
              <button 
                v-if="item.dropdown" 
                class="mobile-dropdown-toggle"
                @click="toggleMobileDropdown(item.name)"
              >
                <span :class="{'rotate-icon': openMobileDropdowns.includes(item.name)}">▼</span>
              </button>
            </div>
            
            <!-- Mobile Dropdown -->
            <div 
              v-if="item.dropdown" 
              class="mobile-dropdown"
              :class="{'mobile-dropdown-open': openMobileDropdowns.includes(item.name)}"
            >
              <RouterLink 
                v-for="dropdownItem in item.dropdown" 
                :key="dropdownItem.name"
                :to="dropdownItem.path"
                class="mobile-dropdown-item"
                @click="isMenuOpen = false"
              >
                {{ dropdownItem.name }}
              </RouterLink>
            </div>
          </li>
        </ul>
      </nav>
    </div>
  </header>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useRoute, RouterLink } from 'vue-router'
import { useScroll, useMediaQuery } from '@vueuse/core'

// Navigation items
const navItems = [
  { name: 'Home', path: '/' },
  {
    name: 'Discover',
    path: '/discover',
    dropdown: [
      { name: 'Services & Frameworks', path: '/discover?type=services-frameworks' },
      { name: 'Patterns', path: '/discover?type=patterns' }
    ]
  },
  {
    name: 'Learn',
    path: '/learn',
    dropdown: [
      { name: 'Blogs', path: '/learn?type=blogs' },
      { name: 'Videos', path: '/learn?type=videos' },
      { name: 'Workshops', path: '/learn?type=workshops' },
    ]
  },
  {
    name: 'Build',
    path: '/build',
    dropdown: [
      { name: 'Blueprints', path: '/build?type=blueprints' },
      { name: 'Repositories', path: '/build?type=repositories' }
    ]
  }
]

// Route and active link detection
const route = useRoute()
const isActive = (path) => {
  return route.path === path || route.path.startsWith(`${path}/`)
}

// Mobile detection
const isMobile = useMediaQuery('(max-width: 768px)')
const isMenuOpen = ref(false)
const openMobileDropdowns = ref([])

// Handle mobile dropdown toggle
function toggleMobileDropdown(itemName) {
  if (openMobileDropdowns.value.includes(itemName)) {
    openMobileDropdowns.value = openMobileDropdowns.value.filter(name => name !== itemName)
  } else {
    openMobileDropdowns.value.push(itemName)
  }
}

// Handle mobile menu item click
function handleMobileItemClick(item) {
  if (!item.dropdown) {
    isMenuOpen.value = false
  }
}

// Scroll detection for header styling
const { y } = useScroll(window)
const isScrolled = computed(() => y.value > 50)
</script>

<style>
/* Base styles (existing) */
.header {
  position: sticky;
  top: 0;
  z-index: 50;
  background: linear-gradient(to right, var(--aws-blue-dark), var(--aws-blue-medium));
  color: white;
  transition: all 0.3s ease;
}

.header-scrolled {
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
}

.header-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 4rem;
  padding: 0 var(--space-4);
  width: 100%;
}

.header-logo {
  display: flex;
  align-items: center;
}

.logo-link {
  display: flex;
  align-items: center;
  text-decoration: none;
}

.logo-text {
  font-size: 1.4rem;
  font-weight: 700;
  background: linear-gradient(to right, white, var(--aws-orange));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
  transition: all 0.3s ease;
}

.logo-link:hover .logo-text {
  background: linear-gradient(to right, var(--aws-orange), white);
  -webkit-background-clip: text;
  background-clip: text;
}

.header-actions {
  display: flex;
  align-items: center;
  gap: var(--space-4);
}

.nav-list {
  display: flex;
  list-style: none;
  gap: var(--space-4);
}

.nav-item {
  position: relative;
}

.nav-item.has-dropdown:hover .dropdown-menu {
  display: block;
  opacity: 1;
  transform: translateY(0);
  pointer-events: auto;
}

.nav-link {
  color: white;
  text-decoration: none;
  font-size: 1rem;
  padding: var(--space-2) var(--space-3);
  border-radius: var(--radius-md);
  transition: all 0.3s ease;
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.nav-link:hover {
  background-color: rgba(255, 255, 255, 0.1);
  text-decoration: none;
}

.nav-link.active {
  color: var(--aws-orange);
  font-weight: 500;
}

.nav-link.active:after {
  content: '';
  position: absolute;
  bottom: -2px;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: var(--aws-orange);
  border-radius: var(--radius-full);
}

/* Mobile Menu */
.mobile-menu-button {
  background: none;
  border: none;
  cursor: pointer;
  padding: var(--space-2);
}

.menu-icon {
  width: 24px;
  height: 20px;
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.menu-icon span {
  display: block;
  height: 2px;
  width: 100%;
  background-color: white;
  border-radius: var(--radius-full);
  transition: all 0.3s ease;
}

.menu-icon.is-open span:nth-child(1) {
  transform: translateY(9px) rotate(45deg);
}

.menu-icon.is-open span:nth-child(2) {
  opacity: 0;
}

.menu-icon.is-open span:nth-child(3) {
  transform: translateY(-9px) rotate(-45deg);
}

.mobile-menu-content {
  background-color: var(--aws-blue-dark);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: var(--radius-md);
  padding: var(--space-2) 0;
  width: 100%;
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  animation: fadeIn 0.2s ease-out;
}

.mobile-nav-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.mobile-menu-item {
  padding: var(--space-2) var(--space-4);
}

.mobile-menu-link {
  color: white;
  text-decoration: none;
  display: block;
  width: 100%;
  padding: var(--space-3);
}

.mobile-menu-link:hover {
  background-color: rgba(255, 255, 255, 0.1);
}

/* Dropdown styles */
.dropdown-arrow {
  font-size: 0.7rem;
  margin-left: 0.25rem;
  opacity: 0.8;
}

.dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  min-width: 180px;
  background-color: var(--aws-blue-dark);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-md);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
  display: none;
  opacity: 0;
  transform: translateY(10px);
  transition: opacity 0.3s ease, transform 0.3s ease;
  z-index: 100;
  pointer-events: none;
  padding: var(--space-2) 0;
}

.dropdown-item {
  display: block;
  padding: var(--space-2) var(--space-4);
  color: white;
  text-decoration: none;
  transition: background-color 0.2s ease;
  font-size: 0.9rem;
}

.dropdown-item:hover {
  background-color: rgba(255, 255, 255, 0.1);
  text-decoration: none;
}

/* Mobile dropdown styles */
.mobile-menu-item-wrapper {
  display: flex;
  align-items: center;
}

.mobile-menu-link {
  flex: 1;
}

.mobile-dropdown-toggle {
  background: transparent;
  border: none;
  color: white;
  padding: var(--space-2);
  cursor: pointer;
}

.mobile-dropdown-toggle span {
  display: inline-block;
  font-size: 0.7rem;
  transition: transform 0.3s ease;
}

.rotate-icon {
  transform: rotate(180deg);
}

.mobile-dropdown {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease;
  padding-left: var(--space-4);
  background-color: rgba(0, 0, 0, 0.2);
}

.mobile-dropdown-open {
  max-height: 500px;
}

.mobile-dropdown-item {
  display: block;
  padding: var(--space-2) var(--space-4);
  color: white;
  text-decoration: none;
  font-size: 0.9rem;
}

/* Animation keyframes */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
