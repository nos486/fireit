<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import DetailCard from './DetailCard.vue'

defineProps({
  data: { type: Object, default: () => ({}) },
  loading: Boolean
})

const currentTime = ref('')
let timer = null

const updateTime = () => {
  currentTime.value = new Date().toLocaleTimeString('en-US', { hour12: false })
}

onMounted(() => {
  updateTime()
  timer = setInterval(updateTime, 1000)
})

onUnmounted(() => {
  clearInterval(timer)
})
</script>

<template>
  <DetailCard title="Client Analytics" icon="◈" :loading="loading">
    <div class="space-y-1">
      <!-- Live clock -->
      <div class="mb-5 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-between">
        <div>
          <p class="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Local Time</p>
          <p class="text-xl font-semibold text-slate-100 font-mono tracking-tight">{{ currentTime }}</p>
          <p class="text-[10px] text-slate-500 mt-1 font-mono uppercase tracking-wider">{{ timezone || 'UTC' }}</p>
        </div>
        <div class="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)] animate-pulse"></div>
      </div>

      <div class="divide-y divide-white/[0.04]">
        <div class="flex justify-between items-center py-2.5">
          <span class="text-[11px] text-slate-500 uppercase tracking-wider">OS</span>
          <span class="text-[12px] text-slate-200 font-medium">{{ data.os || '—' }}</span>
        </div>
        <div class="flex justify-between items-center py-2.5">
          <span class="text-[11px] text-slate-500 uppercase tracking-wider">Browser</span>
          <span class="text-[12px] text-slate-200 font-medium">{{ data.browser || '—' }}</span>
        </div>
        <div class="flex justify-between items-center py-2.5">
          <span class="text-[11px] text-slate-500 uppercase tracking-wider">Engine</span>
          <span class="text-[12px] text-slate-200 font-medium">{{ data.engine || '—' }}</span>
        </div>
      </div>
    </div>
  </DetailCard>
</template>
