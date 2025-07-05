import { createApp } from 'vue'
import App from './App.vue'
import router from './routes'  // Import the router, not routes

// Import global styles
import './assets/styles/main.css'
import './assets/styles/filter-components.css' // Added our shared filter styles

// Create and mount application
const app = createApp(App)
app.use(router)
app.mount('#app')
