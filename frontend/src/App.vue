<script setup>
import { ref, onMounted } from 'vue'
import NetworkIntelligence from './components/NetworkIntelligence.vue'
import IdentityContext from './components/IdentityContext.vue'
import ClientAnalytics from './components/ClientAnalytics.vue'
import GeoMap from './components/GeoMap.vue'
import TerminalHelp from './components/TerminalHelp.vue'
import HeadersInspector from './components/HeadersInspector.vue'
import LatencyTest from './components/LatencyTest.vue'
import PrivacyLeaks from './components/PrivacyLeaks.vue'
import IPLookup from './components/IPLookup.vue'

const data = ref({ network: {}, identity: {}, client: {}, headers: {} })
const loading = ref(true)
const error = ref(null)
const showHelp = ref(false)
const showLookup = ref(false)

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8787'

const fetchData = async () => {
  loading.value = true
  error.value = null
  try {
    const res = await fetch(`${API_URL}/api/ip`)
    if (!res.ok) throw new Error('Failed to fetch')
    data.value = await res.json()
  } catch (err) {
    error.value = 'Unable to reach backend. Ensure the worker is deployed.'
  } finally {
    loading.value = false
  }
}

onMounted(fetchData)
</script>

<template>
  <div class="min-h-screen bg-[#0a0b0f] text-slate-300">

    <!-- Background radial glow -->
    <div class="fixed inset-0 pointer-events-none overflow-hidden">
      <div class="absolute top-[-20%] left-[10%] w-[600px] h-[600px] bg-orange-500/[0.04]  blur-[120px]"></div>
      <div class="absolute bottom-[-10%] right-[5%] w-[500px] h-[500px] bg-orange-600/[0.03]  blur-[100px]"></div>
    </div>

    <!-- Navbar -->
    <nav class="relative z-10 border-b border-white/[0.06] bg-black/20 backdrop-blur-xl">
      <div class="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
        <!-- Logo -->
        <div class="flex items-center gap-2.5">
          <div class="w-7 h-7 rounded-lg bg-orange-500 flex items-center justify-center shadow-[0_0_16px_rgba(249,115,22,0.5)]">
            <svg class="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/>
            </svg>
          </div>
          <div>
            <span class="text-sm font-bold text-white tracking-tight">FireIT</span>
          </div>
        </div>

        <!-- Subtitle -->
        <p class="hidden sm:block text-[11px] text-slate-500 uppercase tracking-[0.2em] font-medium">Advanced Network & Identity</p>

        <!-- Right buttons -->
        <div class="flex items-center gap-2">
          <!-- IP Lookup Button -->
          <button
            @click="showLookup = true"
            class="flex items-center justify-center w-9 h-9 rounded-xl border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.06] hover:border-orange-500/30 transition-all duration-200 text-slate-400 hover:text-orange-400"
            title="IP Lookup"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>

          <!-- Refresh button -->
          <button
            @click="fetchData"
            :disabled="loading"
            class="flex items-center justify-center w-9 h-9 rounded-xl border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.06] hover:border-orange-500/30 transition-all duration-200 text-slate-400 hover:text-orange-400 disabled:opacity-40 disabled:cursor-not-allowed"
            title="Refresh Data"
          >
            <svg class="w-4 h-4" :class="{ 'animate-spin': loading }" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"/>
            </svg>
          </button>

          <!-- Help Button -->
          <button
            @click="showHelp = true"
            class="flex items-center justify-center w-9 h-9 rounded-xl border border-white/[0.08] bg-white/[0.03] hover:bg-white/[0.06] hover:border-orange-500/30 transition-all duration-200 text-slate-400 hover:text-orange-400"
            title="Terminal API Help"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8.228 9c.549-1.165 2.03-2 3.772-2 2.21 0 4 1.343 4 3 0 1.4-1.278 2.575-3.006 2.907-.542.104-.994.54-.994 1.093m0 3h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </button>
        </div>
      </div>
    </nav>

    <!-- Main content -->
    <main class="relative z-10 max-w-7xl mx-auto px-6 py-8 space-y-4">

      <!-- Error banner -->
      <Transition name="slide-down">
        <div v-if="error" class="flex items-center gap-3 p-4 rounded-xl bg-red-500/5 border border-red-500/20 text-red-400 text-sm">
          <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
          </svg>
          {{ error }}
        </div>
      </Transition>

      <!-- Row 1: Core Data (3 cards) -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <NetworkIntelligence :data="data.network" :loading="loading" />
        <IdentityContext :data="data.identity" :loading="loading" />
        <ClientAnalytics :data="data.client" :loading="loading" />
      </div>

      <!-- Map -->
      <GeoMap
        :lat="data.identity.latitude"
        :lng="data.identity.longitude"
        :city="data.identity.city"
        :colo="data.identity.colo"
        :timezone="data.identity.timezone"
        :loading="loading"
      />

      <!-- Row 2: Analysis (3 cards) -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
        <LatencyTest :apiUrl="API_URL" />
        <PrivacyLeaks :serverIp="data.network.ip" />
        <HeadersInspector :data="data.headers" :loading="loading" />
      </div>

      <!-- Footer -->
      <div class="flex items-center justify-between pt-2 pb-4">
        <p class="text-[11px] text-slate-600">FireIT — <a href="https://github.com/nos486/fireit" target="_blank" class="hover:text-orange-500 transition-colors">Open Source</a> Network Intelligence Platform</p>
        <p class="text-[11px] text-slate-600">Built with Vue 3 & Cloudflare</p>
      </div>

    </main>

    <!-- Help Modal Overlay -->
    <Transition name="fade">
      <div v-if="showHelp" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#050608]/80 backdrop-blur-sm" @click.self="showHelp = false">
        <div class="relative w-full max-w-2xl transform transition-all">
          <!-- Close Button -->
          <button
            @click="showHelp = false"
            class="absolute top-4 right-4 z-[110] p-2  bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <TerminalHelp :apiUrl="API_URL" />
        </div>
      </div>
    </Transition>

    <!-- IP Lookup Modal Overlay -->
    <Transition name="fade">
      <div v-if="showLookup" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-[#050608]/80 backdrop-blur-sm" @click.self="showLookup = false">
        <div class="relative w-full max-w-2xl transform transition-all shadow-2xl">
          <!-- Close Button -->
          <button
            @click="showLookup = false"
            class="absolute top-4 right-4 z-[110] p-2  bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white transition-colors"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>

          <IPLookup :apiUrl="API_URL" />
        </div>
      </div>
    </Transition>
  </div>
</template>

<style>
.slide-down-enter-active, .slide-down-leave-active { transition: all 0.3s ease; }
.slide-down-enter-from { opacity: 0; transform: translateY(-8px); }
.slide-down-leave-to { opacity: 0; transform: translateY(-8px); }
.fade-enter-active, .fade-leave-active { transition: opacity 0.3s ease; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
