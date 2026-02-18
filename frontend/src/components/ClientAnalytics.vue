<script setup>
import { computed } from 'vue'
import DetailCard from './DetailCard.vue'

defineProps({
  data: {
    type: Object,
    default: () => ({})
  },
  loading: Boolean
})

const currentTime = computed(() => {
  return new Date().toLocaleTimeString('en-US', { hour12: false })
})
</script>

<template>
  <DetailCard title="Client Analytics" :loading="loading">
    <div class="flex justify-between items-center p-2">
      <span class="text-gray-500 text-xs font-mono uppercase">Operating System</span>
      <span class="text-gray-200 text-xs text-right">{{ data.os }}</span>
    </div>
     <div class="flex justify-between items-center p-2">
      <span class="text-gray-500 text-xs font-mono uppercase">Browser</span>
      <span class="text-gray-200 text-xs text-right">{{ data.browser }}</span>
    </div>
    <div class="flex justify-between items-center p-2">
      <span class="text-gray-500 text-xs font-mono uppercase">Engine</span>
      <span class="text-gray-200 text-xs text-right">{{ data.engine }}</span>
    </div>
    <div class="flex justify-between items-center p-2">
      <span class="text-gray-500 text-xs font-mono uppercase">Time</span>
      <span class="text-gray-200 text-xs text-right font-mono">{{ currentTime }}</span>
    </div>
  </DetailCard>
</template>
