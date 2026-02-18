<script setup>
import DetailCard from './DetailCard.vue'

defineProps({
  data: { type: Object, default: () => ({}) },
  loading: Boolean
})
</script>

<template>
  <DetailCard title="Request Headers" icon="⟨⟩" :loading="loading">
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
