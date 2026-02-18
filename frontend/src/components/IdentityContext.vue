<script setup>
import DetailCard from './DetailCard.vue'

defineProps({
  data: { type: Object, default: () => ({}) },
  loading: Boolean
})
</script>

<template>
  <DetailCard title="Identity Context" icon="◎" :loading="loading">
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
