<script setup>
import { ref, onMounted } from 'vue'
import NetworkIntelligence from './components/NetworkIntelligence.vue'
import IdentityContext from './components/IdentityContext.vue'
import ClientAnalytics from './components/ClientAnalytics.vue'
import GeoMap from './components/GeoMap.vue'

const data = ref({
  network: {},
  identity: {},
  client: {}
})
const loading = ref(true)
const error = ref(null)

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8787'

const fetchData = async () => {
  loading.value = true
  error.value = null
  try {
    const res = await fetch(`${API_URL}/api/ip`)
    if (!res.ok) throw new Error('Failed to fetch IP data')
    data.value = await res.json()
  } catch (err) {
    console.error(err)
    error.value = 'CONNECTION LOST - RECONNECTING...'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchData()
})
</script>

<template>
  <div class="min-h-screen bg-[#050608] text-gray-300 font-sans p-4 md:p-8 flex flex-col items-center">
    
    <!-- Branding Header -->
    <header class="w-full max-w-7xl mx-auto mb-10 flex flex-col items-center justify-center text-center">
      <div class="flex items-center gap-3 mb-2">
        <!-- Fire Logo SVG -->
        <svg class="w-10 h-10 text-orange-500" fill="currentColor" viewBox="0 0 24 24">
          <path d="M12 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-4 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm12 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm-6 3l-2.5 4.5h5L14 11zM6 16c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm12 0c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z"/>
        </svg>
        <h1 class="text-4xl font-bold text-white tracking-tighter">FireIT</h1>
      </div>
      <p class="text-gray-500 uppercase tracking-[0.2em] text-xs font-semibold">Advanced Network & Identity</p>
    </header>

    <div v-if="error" class="max-w-7xl mx-auto w-full mb-4 bg-orange-900/10 border border-orange-500/50 p-4 text-orange-500 font-mono text-center">
      ⚠ {{ error }} ⚠
    </div>

    <!-- Grid Container -->
    <div class="max-w-7xl mx-auto w-full space-y-4">
      
      <!-- Top Row: 3 Data Columns -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 h-auto md:h-64">
        <NetworkIntelligence :data="data.network" :loading="loading" />
        <IdentityContext :data="data.identity" :loading="loading" />
        <ClientAnalytics :data="data.client" :loading="loading" />
      </div>

      <!-- Bottom Row: Map -->
      <div class="w-full">
        <GeoMap 
          :lat="data.identity.latitude" 
          :lng="data.identity.longitude" 
          :loading="loading"
        />
      </div>

    </div>
  </div>
</template>

<style>
/* Global Overlay for CRT effect optional */
body {
  background-color: #050608;
}
</style>
