<script setup>
import DetailCard from './DetailCard.vue'

defineProps({
  data: { type: Object, default: () => ({}) },
  loading: Boolean
})
</script>

<template>
  <DetailCard title="Identity Context" icon='<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/></svg>' :loading="loading">
    <div class="space-y-1">
      <!-- Country + City - Featured -->
      <div class="mb-5 p-3  bg-white/[0.03] border border-white/[0.06]">
        <div class="flex items-center gap-2 mb-1">
          <span class="text-lg">{{ data.country ? `${data.country}` : '🌍' }}</span>
          <p class="text-base font-semibold text-slate-100">{{ data.city || 'Unknown City' }}</p>
        </div>
        <p class="text-[11px] text-slate-500">{{ data.region || 'Unknown Region' }}</p>
      </div>

      <div class="divide-y divide-white/[0.04]">
        <div class="flex justify-between items-center py-2.5">
          <span class="text-[11px] text-slate-500 uppercase tracking-wider">Country Code</span>
          <span class="text-[12px] text-slate-200 font-mono font-medium">{{ data.country || '—' }}</span>
        </div>
        <div class="flex justify-between items-center py-2.5">
          <span class="text-[11px] text-slate-500 uppercase tracking-wider">Metro Code</span>
          <span class="text-[12px] text-slate-200 font-mono">{{ data.metroCode || 'N/A' }}</span>
        </div>
        <div class="flex justify-between items-center py-2.5">
          <span class="text-[11px] text-slate-500 uppercase tracking-wider">Timezone</span>
          <span class="text-[12px] text-slate-200 font-mono">{{ data.timezone || '—' }}</span>
        </div>
      </div>
    </div>
  </DetailCard>
</template>
