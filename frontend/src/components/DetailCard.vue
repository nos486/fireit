<script setup>
defineProps({
  title: String,
  loading: Boolean
})
</script>

<template>
  <div class="bg-[#0f1218] border border-gray-800 p-6 flex flex-col h-full rounded-sm">
    <h2 class="text-sm font-bold text-gray-400 tracking-widest uppercase mb-6 flex items-center gap-2">
      <span class="w-1 h-4 bg-blue-500 inline-block"></span>
      {{ title }}
    </h2>
    
    <div v-if="loading" class="animate-pulse space-y-4 flex-1">
      <div class="h-4 bg-gray-800 rounded w-full"></div>
      <div class="h-4 bg-gray-800 rounded w-2/3"></div>
      <div class="h-4 bg-gray-800 rounded w-5/6"></div>
    </div>

    <div v-else class="flex-1 space-y-4">
      <slot />
    </div>
  </div>
</template>
