<script setup>
defineProps({
  ipData: {
    type: Object,
    required: true
  },
  loading: Boolean
})
</script>

<template>
  <div class="bg-gray-800 rounded-xl p-6 shadow-lg border border-gray-700">
    <h2 class="text-xl font-bold mb-4 text-emerald-400">Your Connection</h2>
    
    <div v-if="loading" class="animate-pulse space-y-4">
      <div class="h-8 bg-gray-700 rounded w-3/4"></div>
      <div class="h-4 bg-gray-700 rounded w-1/2"></div>
      <div class="h-4 bg-gray-700 rounded w-1/2"></div>
    </div>

    <div v-else class="space-y-3">
      <div class="flex flex-col">
        <span class="text-gray-400 text-sm">IP Address</span>
        <span class="text-3xl font-mono text-white">{{ ipData.ip || 'Unknown' }}</span>
      </div>
      
      <div class="grid grid-cols-2 gap-4 mt-4">
        <div>
          <span class="text-gray-400 text-sm block">Country</span>
          <span class="text-lg text-white flex items-center gap-2">
            {{ ipData.country || 'Unknown' }}
          </span>
        </div>
        <div>
          <span class="text-gray-400 text-sm block">ASN</span>
          <span class="text-lg text-white">{{ ipData.asn || 'N/A' }}</span>
        </div>
        <div class="col-span-2">
          <span class="text-gray-400 text-sm block">Organization</span>
          <span class="text-lg text-white break-words">{{ ipData.asOrganization || 'N/A' }}</span>
        </div>
         <div class="col-span-2">
          <span class="text-gray-400 text-sm block">User Agent</span>
          <span class="text-sm text-gray-300 break-words font-mono bg-gray-900 p-2 rounded">{{ ipData.userAgent }}</span>
        </div>
      </div>
    </div>
  </div>
</template>
