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

const ping = async () => {
  const start = performance.now()
  try {
    await fetch(`${props.apiUrl}/api/ping`, { cache: 'no-store' })
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
    const ms = await ping()
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
  <DetailCard title="Latency Test" icon="⚡" :loading="false">
    <div class="space-y-1">
      <!-- Featured latency display -->
      <div class="mb-4 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06]">
        <div class="flex items-center justify-between mb-1">
          <p class="text-[10px] text-slate-500 uppercase tracking-widest">Round Trip</p>
          <span class="text-[10px] uppercase tracking-widest font-medium" :class="getLatencyColor(avgLatency)">
            {{ getLatencyLabel(avgLatency) }}
          </span>
        </div>
        <div class="flex items-baseline gap-1">
          <span class="text-2xl font-bold font-mono" :class="getLatencyColor(avgLatency)">
            {{ running ? '...' : (avgLatency ?? '—') }}
          </span>
          <span class="text-[10px] text-slate-600">ms avg</span>
        </div>
        <!-- Progress dots -->
        <div class="flex gap-1.5 mt-3">
          <div v-for="i in totalPings" :key="i" class="h-1 flex-1 rounded-full transition-all duration-300"
            :class="i <= pings.length ? getLatencyColor(pings[i-1]).replace('text-', 'bg-') + '/60' : 'bg-white/5'">
          </div>
        </div>
      </div>

      <div class="divide-y divide-white/[0.04]">
        <div class="flex justify-between items-center py-2.5">
          <span class="text-[11px] text-slate-500 uppercase tracking-wider">Min</span>
          <span class="text-[12px] font-mono" :class="getLatencyColor(minLatency)">{{ minLatency ?? '—' }} ms</span>
        </div>
        <div class="flex justify-between items-center py-2.5">
          <span class="text-[11px] text-slate-500 uppercase tracking-wider">Max</span>
          <span class="text-[12px] font-mono" :class="getLatencyColor(maxLatency)">{{ maxLatency ?? '—' }} ms</span>
        </div>
        <div class="flex justify-between items-center py-2.5">
          <span class="text-[11px] text-slate-500 uppercase tracking-wider">Jitter</span>
          <span class="text-[12px] text-slate-200 font-mono">{{ jitter ?? '—' }} ms</span>
        </div>
      </div>

      <!-- Re-run button -->
      <button
        @click="runTest"
        :disabled="running"
        class="w-full mt-3 py-2 rounded-lg text-[11px] font-medium uppercase tracking-wider border transition-all duration-200"
        :class="running
          ? 'border-white/5 bg-white/[0.02] text-slate-600 cursor-not-allowed'
          : 'border-orange-500/20 bg-orange-500/5 text-orange-400 hover:bg-orange-500/10 hover:border-orange-500/30'"
      >
        {{ running ? 'Testing...' : 'Run Again' }}
      </button>
    </div>
  </DetailCard>
</template>
