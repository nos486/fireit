<script setup>
import DetailCard from './DetailCard.vue'

defineProps({
  data: { type: Object, default: () => ({}) },
  loading: Boolean
})
</script>

<template>
  <DetailCard title="Network Intelligence" icon='<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>' :loading="loading">
    <div class="space-y-1">
      <!-- IP Address - Featured -->
      <div class="mb-5 p-3  bg-orange-500/8 border border-orange-500/15">
        <p class="text-[10px] text-slate-500 uppercase tracking-widest mb-1 font-medium">IP Address</p>
        <p class="text-xl font-semibold text-orange-400 font-mono tracking-tight">{{ data.ip || '—' }}</p>
      </div>

      <div class="divide-y divide-white/[0.04]">
        <div class="flex justify-between items-center py-2.5">
          <span class="text-[11px] text-slate-500 uppercase tracking-wider">ISP / Org</span>
          <span class="text-[12px] text-slate-200 font-medium text-right max-w-[55%] truncate" :title="data.isp">{{ data.isp || '—' }}</span>
        </div>
        <div class="flex justify-between items-center py-2.5">
          <span class="text-[11px] text-slate-500 uppercase tracking-wider">ASN</span>
          <span class="text-[12px] text-slate-200 font-mono">{{ data.asn || '—' }}</span>
        </div>
        <div class="flex justify-between items-center py-2.5">
          <span class="text-[11px] text-slate-500 uppercase tracking-wider">Protocol</span>
          <span class="text-[12px] px-2 py-0.5  bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">{{ data.protocol || 'HTTP' }}</span>
        </div>
      </div>
    </div>
  </DetailCard>
</template>
