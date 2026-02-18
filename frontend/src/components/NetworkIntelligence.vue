<script setup>
import { ref } from 'vue'
import DetailCard from './DetailCard.vue'

const props = defineProps({
  data: { type: Object, default: () => ({}) },
  loading: Boolean
})

const copied = ref(false)
const copyIP = () => {
  if (!props.data.ip) return
  navigator.clipboard.writeText(props.data.ip)
  copied.value = true
  setTimeout(() => copied.value = false, 2000)
}
</script>

<template>
  <DetailCard title="Network Intelligence" icon='<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 10V3L4 14h7v7l9-11h-7z"/></svg>' :loading="loading">
    <div class="space-y-1">
      <!-- IP Address - Featured -->
      <div class="mb-5 p-3 rounded-xl bg-orange-500/8 border border-orange-500/15 group/ip relative">
        <p class="text-[10px] text-slate-500 uppercase tracking-widest mb-1 font-medium">IP Address</p>
        <div class="flex items-center justify-between">
          <p class="text-xl font-semibold text-orange-400 font-mono tracking-tight">{{ data.ip || '—' }}</p>
          <button 
            v-if="data.ip"
            @click="copyIP"
            class="p-1.5 rounded-lg bg-orange-500/10 text-orange-400/60 hover:text-orange-400 hover:bg-orange-500/20 transition-all duration-200"
            :title="copied ? 'Copied!' : 'Copy IP Address'"
          >
            <svg v-if="!copied" class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 002-2v-3M16 3h2a2 2 0 012 2v1" />
            </svg>
            <span v-else class="text-[9px] font-bold uppercase tracking-tight">Copied</span>
          </button>
        </div>
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
