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
  <div class="min-h-screen bg-[#050608] text-gray-300 font-sans p-4 md:p-8 flex flex-col justify-center">
    
    <div v-if="error" class="max-w-7xl mx-auto w-full mb-4 bg-red-900/20 border border-red-500/50 p-4 text-red-500 font-mono text-center">
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
