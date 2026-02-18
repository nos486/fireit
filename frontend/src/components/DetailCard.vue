<script setup>
defineProps({
  title: String,
  icon: String,
  loading: Boolean
})
</script>

<template>
  <div class="group relative bg-white/[0.03] border border-white/[0.07] rounded-2xl p-6 flex flex-col h-full backdrop-blur-sm transition-all duration-300 hover:border-orange-500/30 hover:bg-white/[0.05]">
    <!-- Top accent line -->
    <div class="absolute top-0 left-6 right-6 h-px bg-gradient-to-r from-transparent via-orange-500/40 to-transparent"></div>
    
    <!-- Header -->
    <div class="flex items-center gap-3 mb-6">
      <div class="w-8 h-8 rounded-full bg-orange-500/10 border border-orange-500/20 flex items-center justify-center flex-shrink-0">
        <span class="text-orange-400 text-base leading-none" v-html="icon"></span>
      </div>
      <h2 class="text-xs font-semibold text-slate-400 tracking-widest uppercase">{{ title }}</h2>
    </div>
    
    <!-- Loading shimmer -->
    <div v-if="loading" class="flex-1 space-y-3">
      <div class="shimmer h-3 w-full"></div>
      <div class="shimmer h-3 w-4/5"></div>
      <div class="shimmer h-3 w-3/5"></div>
      <div class="shimmer h-3 w-4/5 mt-2"></div>
    </div>

    <div v-else class="flex-1">
      <slot />
    </div>
  </div>
</template>
