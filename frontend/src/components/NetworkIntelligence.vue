<script setup>
import DetailCard from './DetailCard.vue'

defineProps({
  data: {
    type: Object,
    default: () => ({})
  },
  loading: Boolean
})
</script>

<template>
  <DetailCard title="Network Intelligence" :loading="loading">
    <div class="flex justify-between items-center bg-gray-900/50 p-2 rounded">
      <span class="text-gray-500 text-xs font-mono uppercase">IP Address</span>
      <span class="text-blue-400 font-mono text-sm">{{ data.ip }}</span>
    </div>
    <div class="flex justify-between items-center p-2">
      <span class="text-gray-500 text-xs font-mono uppercase">ISP / Org</span>
      <span class="text-gray-200 text-xs text-right max-w-[150px] truncate" :title="data.isp">{{ data.isp }}</span>
    </div>
    <div class="flex justify-between items-center p-2">
      <span class="text-gray-500 text-xs font-mono uppercase">ASN</span>
      <span class="text-gray-200 text-xs font-mono">{{ data.asn }}</span>
    </div>
    <div class="flex justify-between items-center p-2">
      <span class="text-gray-500 text-xs font-mono uppercase">Protocol</span>
      <span class="text-gray-200 text-xs font-mono">{{ data.protocol }}</span>
    </div>
  </DetailCard>
</template>
