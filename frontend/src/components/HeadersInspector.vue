<script setup>
import DetailCard from './DetailCard.vue'

defineProps({
  data: { type: Object, default: () => ({}) },
  loading: Boolean
})
</script>

<template>
  <DetailCard title="Request Headers" icon='<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>' :loading="loading">
    <div class="space-y-0.5 max-h-64 overflow-y-auto pr-1">
      <div
        v-for="(value, key) in data"
        :key="key"
        class="group py-2 border-b border-white/[0.04] last:border-0"
      >
        <p class="text-[10px] text-orange-400/70 font-mono uppercase tracking-wider mb-0.5">{{ key }}</p>
        <p class="text-[11px] text-slate-300 font-mono break-all leading-relaxed">{{ value }}</p>
      </div>
      <div v-if="!data || Object.keys(data).length === 0" class="text-[11px] text-slate-600 py-4 text-center">
        No headers available
      </div>
    </div>
  </DetailCard>
</template>
