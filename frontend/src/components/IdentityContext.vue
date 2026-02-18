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
  <DetailCard title="Identity Context" :loading="loading">
    <div class="flex justify-between items-center p-2">
      <span class="text-gray-500 text-xs font-mono uppercase">Country</span>
      <span class="text-gray-200 text-xs text-right">{{ data.country }}</span>
    </div>
     <div class="flex justify-between items-center p-2">
      <span class="text-gray-500 text-xs font-mono uppercase">City</span>
      <span class="text-gray-200 text-xs text-right">{{ data.city }}</span>
    </div>
    <div class="flex justify-between items-center p-2">
      <span class="text-gray-500 text-xs font-mono uppercase">Metro Code</span>
      <span class="text-gray-200 text-xs text-right">{{ data.metroCode }}</span>
    </div>
    <div class="flex justify-between items-center p-2">
      <span class="text-gray-500 text-xs font-mono uppercase">Region</span>
      <span class="text-gray-200 text-xs text-right">{{ data.region }}</span>
    </div>
  </DetailCard>
</template>
