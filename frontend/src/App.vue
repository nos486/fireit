<script setup>
import { ref, onMounted } from 'vue'
import IpCard from './components/IpCard.vue'

const ipData = ref({})
const loading = ref(true)
const error = ref(null)

// Development URL vs Production
// In development, we might need to point to localhost:8787 if not proxying.
// For now, let's assume the user will configure env or we use relative path if same domain, 
// but since they are separate, we need the full URL. 
// I'll use a hardcoded dev URL for now, editable by user.
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8787'

const fetchIpData = async () => {
  loading.value = true
  error.value = null
  try {
    const res = await fetch(`${API_URL}/api/ip`)
    if (!res.ok) throw new Error('Failed to fetch IP data')
    ipData.value = await res.json()
  } catch (err) {
    console.error(err)
    error.value = 'Could not load network data. Ensure backend is running.'
  } finally {
    loading.value = false
  }
}

onMounted(() => {
  fetchIpData()
})
</script>

<template>
  <div class="min-h-screen bg-gray-900 text-gray-100 font-sans selection:bg-emerald-500 selection:text-white">
    <!-- Navbar -->
    <nav class="border-b border-gray-800 bg-gray-900/50 backdrop-blur-md sticky top-0 z-50">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        <div class="flex items-center gap-2">
          <div class="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <span class="text-xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">
            NetMon
          </span>
        </div>
        <div>
          <a href="https://github.com" target="_blank" class="text-gray-400 hover:text-white transition-colors">
            GitHub
          </a>
        </div>
      </div>
    </nav>

    <!-- Main Content -->
    <main class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        
        <!-- Main IP Card -->
        <div class="md:col-span-2 lg:col-span-2">
           <div class="mb-6 flex items-center justify-between">
            <h1 class="text-3xl font-bold text-white">Dashboard</h1>
            <button @click="fetchIpData" class="p-2 hover:bg-gray-800 rounded-full transition-colors" title="Refresh">
               <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" /></svg>
            </button>
           </div>
           
           <div v-if="error" class="bg-red-900/50 border border-red-700 text-red-200 p-4 rounded-lg mb-6">
             {{ error }}
           </div>

           <IpCard :ipData="ipData" :loading="loading" />
        </div>

        <!-- Side Panel / Additional Info -->
        <div class="space-y-6">
          <div class="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700">
            <h3 class="text-lg font-semibold mb-4 text-emerald-400">System Status</h3>
            <div class="space-y-2">
              <div class="flex justify-between items-center">
                <span class="text-gray-400">Backend</span>
                <span class="px-2 py-1 rounded text-xs font-medium" :class="error ? 'bg-red-500/20 text-red-400' : 'bg-emerald-500/20 text-emerald-400'">
                  {{ error ? 'Offline' : 'Online' }}
                </span>
              </div>
              <div class="flex justify-between items-center">
                <span class="text-gray-400">Database</span>
                <span class="px-2 py-1 rounded text-xs font-medium bg-blue-500/20 text-blue-400">
                  D1 / Cloudflare
                </span>
              </div>
            </div>
          </div>
          
           <div class="bg-blue-900/20 rounded-xl p-6 border border-blue-900/50">
            <h3 class="text-lg font-semibold mb-2 text-blue-300">Pro Tip</h3>
            <p class="text-sm text-blue-200/70">
              Deploy this worker to 200+ cities in seconds using Cloudflare.
            </p>
          </div>
        </div>

      </div>
    </main>
  </div>
</template>
