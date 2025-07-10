<template>
  <footer class="footer">
    <div class="container footer-container">
      <div class="footer-content">
        <ul class="footer-nav">
          <!-- <li><a href="#">Privacy</a></li>
          <li class="separator">|</li>
          <li><a href="#">Site Terms</a></li>
          <li class="separator">|</li>
          <li><a href="#">Cookie Preferences</a></li>
          <li class="separator">|</li>
          <li class="footer-copyright">&copy; Copyright 2025 Amazon.com, Inc. or its affiliates. All rights reserved.</li> -->
        </ul>
      </div>
    </div>
  </footer>
</template>

<script setup>
// No computed properties needed anymore
</script>

<style>
.footer {
  background-color: var(--aws-blue-dark);
  color: white;
  padding: var(--space-4) 0;
}

.footer-container {
  display: flex;
  justify-content: center;
  align-items: center;
}

.footer-content {
  display: flex;
  justify-content: center;
}

.footer-nav {
  display: flex;
  list-style: none;
  gap: var(--space-2);
  margin: 0;
  padding: 0;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
}

.footer-nav a {
  color: white;
  text-decoration: none;
  transition: color 0.2s ease;
  font-size: 0.875rem;
}

.footer-nav a:hover {
  color: var(--aws-orange);
  text-decoration: none;
}

.separator {
  color: rgba(255, 255, 255, 0.7);
  padding: 0 var(--space-1);
}

.footer-copyright {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.7);
}

@media (max-width: 768px) {
  .footer-nav {
    gap: var(--space-1);
    flex-direction: column;
  }
  
  .separator {
    display: none;
  }
}
</style>
