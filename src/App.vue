<template>
  <div class="app">
    <TheHeader />
    <main class="main-content">
      <RouterView />
    </main>
    <TheFooter />
    <BackToTop />
  </div>
</template>

<script setup>
import { RouterView } from 'vue-router'
import TheHeader from './components/layout/TheHeader.vue'
import TheFooter from './components/layout/TheFooter.vue'
import BackToTop from './components/ui/BackToTop.vue'
</script>

<style>
@import './assets/styles/main.css';

.app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

.main-content {
  flex: 1;
}
</style>
