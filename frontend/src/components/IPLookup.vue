<script setup>
import { ref } from 'vue'

const props = defineProps({
  apiUrl: { type: String, default: 'http://localhost:8787' }
})

const query = ref('')
const result = ref(null)
const loading = ref(false)
const error = ref(null)

const lookup = async () => {
  const ip = query.value.trim()
  if (!ip) return
  
  loading.value = true
  error.value = null
  result.value = null

  try {
    const res = await fetch(`${props.apiUrl}/api/lookup?ip=${encodeURIComponent(ip)}`)
    const data = await res.json()
    if (data.error) {
      error.value = data.error
    } else {
      result.value = data
    }
  } catch (e) {
    error.value = 'Failed to reach API'
  } finally {
    loading.value = false
  }
}

const fields = [
  { key: 'ip', label: 'IP Address', accent: true },
  { key: 'isp', label: 'ISP' },
  { key: 'org', label: 'Organization' },
  { key: 'as', label: 'AS Number' },
  { key: 'country', label: 'Country' },
  { key: 'city', label: 'City' },
  { key: 'region', label: 'Region' },
  { key: 'zip', label: 'ZIP Code' },
  { key: 'timezone', label: 'Timezone' },
  { key: 'latitude', label: 'Latitude' },
  { key: 'longitude', label: 'Longitude' },
]
</script>

<template>
  <div class="bg-white/[0.03] border border-white/[0.07]  overflow-hidden">
    <div class="h-px bg-gradient-to-r from-transparent via-orange-500/40 to-transparent"></div>
    <div class="p-6">
      <!-- Header -->
      <div class="flex items-center gap-3 mb-5">
        <div class="w-8 h-8  bg-orange-500/10 border border-orange-500/20 flex items-center justify-center flex-shrink-0">
          <span class="text-orange-400 text-sm">🔍</span>
        </div>
        <div>
          <h2 class="text-xs font-semibold text-slate-400 tracking-widest uppercase">IP Lookup</h2>
          <p class="text-[11px] text-slate-600 mt-0.5">Search any IP address for network & geo info</p>
        </div>
      </div>

      <!-- Search Box -->
      <form @submit.prevent="lookup" class="flex gap-2 mb-5">
        <div class="flex-1 relative">
          <input
            v-model="query"
            type="text"
            placeholder="Enter IP address (e.g. 8.8.8.8)"
            class="w-full bg-black/40 border border-white/[0.08]  px-4 py-2.5 text-sm text-slate-200 font-mono placeholder-slate-600 focus:outline-none focus:border-orange-500/40 focus:ring-1 focus:ring-orange-500/20 transition-all"
          />
        </div>
        <button
          type="submit"
          :disabled="loading || !query.trim()"
          class="px-5 py-2.5  text-xs font-semibold uppercase tracking-wider transition-all duration-200 flex items-center gap-2"
          :class="loading || !query.trim()
            ? 'bg-white/5 text-slate-600 border border-white/5 cursor-not-allowed'
            : 'bg-orange-500 text-white hover:bg-orange-600 shadow-[0_0_20px_rgba(249,115,22,0.3)] hover:shadow-[0_0_24px_rgba(249,115,22,0.4)]'"
        >
          <svg v-if="loading" class="w-3.5 h-3.5 animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3" fill="none" stroke-dasharray="31.4 31.4" stroke-linecap="round" />
          </svg>
          <svg v-else class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
          Lookup
        </button>
      </form>

      <!-- Error -->
      <div v-if="error" class="flex items-center gap-2 p-3  bg-red-500/5 border border-red-500/20 text-red-400 text-[12px] mb-4">
        <span>⚠</span> {{ error }}
      </div>

      <!-- Results -->
      <div v-if="result" class="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-0.5">
        <div
          v-for="field in fields"
          :key="field.key"
          class="flex justify-between items-center py-2.5 border-b border-white/[0.04]"
        >
          <span class="text-[11px] text-slate-500 uppercase tracking-wider">{{ field.label }}</span>
          <span
            class="text-[12px] font-mono text-right max-w-[55%] truncate"
            :class="field.accent ? 'text-orange-400 font-semibold' : 'text-slate-200'"
            :title="result[field.key]"
          >{{ result[field.key] ?? '—' }}</span>
        </div>
      </div>

      <!-- Empty state -->
      <div v-if="!result && !error && !loading" class="text-center py-6">
        <p class="text-[11px] text-slate-600">Enter an IP address above to get started</p>
      </div>
    </div>
  </div>
</template>
