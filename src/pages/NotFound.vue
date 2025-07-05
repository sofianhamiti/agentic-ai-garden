<template>
  <div class="not-found">
    <div class="container not-found-container">
      <h1 class="not-found-title">404</h1>
      <p class="not-found-message">Page not found</p>
      <p class="not-found-description">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </p>
      <RouterLink to="/" class="not-found-link">
        <button class="primary-button">Return Home</button>
      </RouterLink>
    </div>
  </div>
</template>

<script setup>
import { RouterLink } from 'vue-router'
</script>

<style>
.not-found {
  min-height: 80vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
  padding: var(--space-8);
}

.not-found-container {
  max-width: 600px;
}

.not-found-title {
  font-size: 6rem;
  font-weight: 700;
  color: var(--aws-orange);
  margin-bottom: var(--space-4);
}

.not-found-message {
  font-size: 2rem;
  font-weight: 600;
  margin-bottom: var(--space-6);
}

.not-found-description {
  color: var(--color-muted);
  margin-bottom: var(--space-8);
}

.not-found-link {
  display: inline-block;
  text-decoration: none;
}

.primary-button {
  font-size: 1rem;
  font-weight: 600;
  padding: var(--space-3) var(--space-6);
  border-radius: var(--radius-md);
  background: linear-gradient(to right, var(--aws-orange), var(--aws-orange-light));
  color: var(--aws-blue-dark);
  border: none;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  text-decoration: none;
  transition: all 0.3s ease;
}

.primary-button:hover {
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  transform: translateY(-2px);
}
</style>
