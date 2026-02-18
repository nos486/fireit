<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import DetailCard from './DetailCard.vue'

const props = defineProps({
  apiUrl: { type: String, default: 'http://localhost:8787' }
})

const latency = ref(null)
const avgLatency = ref(null)
const minLatency = ref(null)
const maxLatency = ref(null)
const jitter = ref(null)
const running = ref(false)
const pings = ref([])
const totalPings = 3

const ping = async (log = false) => {
  const start = performance.now()
  try {
    const url = log ? `${props.apiUrl}/api/ping?log=true` : `${props.apiUrl}/api/ping`
    await fetch(url, { cache: 'no-store' })
    const end = performance.now()
    return Math.round(end - start)
  } catch {
    return -1
  }
}

const runTest = async () => {
  running.value = true
  pings.value = []
  latency.value = null
  avgLatency.value = null
  minLatency.value = null
  maxLatency.value = null
  jitter.value = null

  for (let i = 0; i < totalPings; i++) {
    const ms = await ping(i === 0) // Log only on first ping
    if (ms >= 0) {
      pings.value.push(ms)
      latency.value = ms
    }
    if (i < totalPings - 1) await new Promise(r => setTimeout(r, 300))
  }

  if (pings.value.length > 0) {
    const vals = pings.value
    avgLatency.value = Math.round(vals.reduce((a, b) => a + b, 0) / vals.length)
    minLatency.value = Math.min(...vals)
    maxLatency.value = Math.max(...vals)
    // Jitter = avg difference between consecutive pings
    if (vals.length > 1) {
      let diffs = 0
      for (let i = 1; i < vals.length; i++) diffs += Math.abs(vals[i] - vals[i - 1])
      jitter.value = Math.round(diffs / (vals.length - 1))
    }
  }
  running.value = false
}

const getLatencyColor = (ms) => {
  if (ms === null) return 'text-slate-500'
  if (ms < 50) return 'text-emerald-400'
  if (ms < 150) return 'text-lime-400'
  if (ms < 300) return 'text-amber-400'
  return 'text-red-400'
}

const getLatencyLabel = (ms) => {
  if (ms === null) return '—'
  if (ms < 50) return 'Excellent'
  if (ms < 150) return 'Good'
  if (ms < 300) return 'Fair'
  return 'Poor'
}

// onMounted(runTest) removed - user must click run manually
</script>

<template>
  <DetailCard title="Latency Test" icon='<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>' :loading="false">
    <div class="space-y-1">
      <!-- Featured latency display -->
      <div class="mb-3 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] relative overflow-hidden group">
        <!-- Visual background glow -->
        <div class="absolute inset-0 bg-gradient-to-br from-orange-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

        <div class="relative z-10">
          <div class="flex items-center justify-between mb-1.5">
            <p class="text-[10px] text-slate-500 uppercase tracking-[0.2em] font-medium">Network Latency</p>
            <div class="flex items-center gap-1.5 px-2 py-0.5 rounded-full border border-white/5 bg-white/5">
              <div class="w-1.5 h-1.5 rounded-full" :class="getLatencyColor(avgLatency).replace('text-', 'bg-')"></div>
              <span class="text-[9px] uppercase tracking-widest font-bold" :class="getLatencyColor(avgLatency)">
                {{ getLatencyLabel(avgLatency) }}
              </span>
            </div>
          </div>
          
          <div class="flex items-baseline gap-2">
            <span class="text-3xl font-bold font-mono tracking-tighter" :class="getLatencyColor(avgLatency)">
              {{ running ? '...' : (avgLatency ?? '—') }}
            </span>
            <span class="text-[10px] text-slate-500 font-medium lowercase">ms avg</span>
          </div>

          <!-- Progress indicators -->
          <div class="flex gap-1.5 mt-3">
            <div v-for="i in totalPings" :key="i" 
              class="h-1 flex-1 rounded-full transition-all duration-500 relative overflow-hidden"
              :class="i <= pings.length ? 'bg-white/10' : 'bg-white/5'">
              <div 
                v-if="i <= pings.length"
                class="absolute inset-0 transition-all duration-700 ease-out"
                :class="getLatencyColor(pings[i-1]).replace('text-', 'bg-')"
                :style="{ width: '100%' }"
              ></div>
            </div>
          </div>
        </div>
      </div>

      <div class="divide-y divide-white/[0.04]">
        <div class="flex justify-between items-center py-2">
          <span class="text-[11px] text-slate-500 uppercase tracking-wider">Min</span>
          <span class="text-[12px] font-mono" :class="getLatencyColor(minLatency)">{{ minLatency ?? '—' }} ms</span>
        </div>
        <div class="flex justify-between items-center py-2">
          <span class="text-[11px] text-slate-500 uppercase tracking-wider">Max</span>
          <span class="text-[12px] font-mono" :class="getLatencyColor(maxLatency)">{{ maxLatency ?? '—' }} ms</span>
        </div>
        <div class="flex justify-between items-center py-2">
          <span class="text-[11px] text-slate-500 uppercase tracking-wider">Jitter</span>
          <span class="text-[12px] text-slate-200 font-mono">{{ jitter ?? '—' }} ms</span>
        </div>
      </div>

      <!-- Re-run button -->
      <button
        @click="runTest"
        :disabled="running"
        class="w-full mt-3 py-2  text-[11px] font-medium uppercase tracking-wider border transition-all duration-200"
        :class="running
          ? 'border-white/5 bg-white/[0.02] text-slate-600 cursor-not-allowed'
          : 'border-orange-500/20 bg-orange-500/5 text-orange-400 hover:bg-orange-500/10 hover:border-orange-500/30'"
      >
        {{ running ? 'Testing...' : 'Run Again' }}
      </button>
    </div>
  </DetailCard>
</template>
