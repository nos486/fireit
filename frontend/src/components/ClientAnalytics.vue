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
  <DetailCard title="Client Analytics" icon='<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"/></svg>' :loading="loading">
    <div class="space-y-1">
      <!-- Live clock -->
      <div class="mb-5 p-3 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-between">
        <div>
          <p class="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Local Time</p>
          <p class="text-xl font-semibold text-slate-100 font-mono tracking-tight">{{ currentTime }}</p>
        </div>
        <div class="w-2 h-2  bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)] animate-pulse"></div>
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
