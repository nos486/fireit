<script setup>
import { ref } from 'vue'

const props = defineProps({
  apiUrl: {
    type: String,
    default: 'https://fireit-backend.YOUR_SUBDOMAIN.workers.dev'
  }
})

const copied = ref(null)

const commands = [
  {
    id: 'auto',
    label: 'Auto-detect (curl gets pretty output)',
    description: 'curl automatically receives a human-readable response',
    cmd: `curl ${props.apiUrl}/api/ip`,
  },
  {
    id: 'json',
    label: 'Force JSON',
    description: 'Always returns JSON regardless of client',
    cmd: `curl ${props.apiUrl}/api/ip.json`,
  },
  {
    id: 'pretty',
    label: 'Force plain text',
    description: 'Always returns formatted plain text',
    cmd: `curl ${props.apiUrl}/api/ip.txt`,
  },
  {
    id: 'jq',
    label: 'JSON + jq (pretty print)',
    description: 'Pipe through jq for colored JSON output',
    cmd: `curl -s ${props.apiUrl}/api/ip.json | jq`,
  },
  {
    id: 'ip-only',
    label: 'IP address only',
    description: 'Extract just the IP using jq',
    cmd: `curl -s ${props.apiUrl}/api/ip.json | jq -r '.network.ip'`,
  },
  {
    id: 'wget',
    label: 'Using wget',
    description: 'Alternative with wget',
    cmd: `wget -qO- ${props.apiUrl}/api/ip`,
  },
]

const copy = async (id, text) => {
  await navigator.clipboard.writeText(text)
  copied.value = id
  setTimeout(() => { copied.value = null }, 2000)
}
</script>

<template>
  <div class="bg-white/[0.03] border border-white/[0.07]  overflow-hidden">
    <!-- Top accent line -->
    <div class="h-px bg-gradient-to-r from-transparent via-orange-500/40 to-transparent"></div>

    <div class="p-6">
      <!-- Header -->
      <div class="flex items-center gap-3 mb-6">
        <div class="w-8 h-8  bg-orange-500/10 border border-orange-500/20 flex items-center justify-center flex-shrink-0">
          <span class="text-orange-400 text-sm">$_</span>
        </div>
        <div>
          <h2 class="text-xs font-semibold text-slate-400 tracking-widest uppercase">Terminal API</h2>
          <p class="text-[11px] text-slate-600 mt-0.5">Use FireIT directly from your terminal with curl or wget</p>
        </div>
      </div>

      <!-- Commands grid -->
      <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div
          v-for="cmd in commands"
          :key="cmd.id"
          class="group relative bg-black/40 border border-white/[0.06]  p-4 hover:border-orange-500/20 transition-all duration-200"
        >
          <!-- Label -->
          <div class="flex items-center justify-between mb-2">
            <span class="text-[11px] font-medium text-slate-400">{{ cmd.label }}</span>
            <button
              @click="copy(cmd.id, cmd.cmd)"
              class="opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 text-[10px] px-2 py-0.5 -md border"
              :class="copied === cmd.id
                ? 'border-emerald-500/40 text-emerald-400 bg-emerald-500/10'
                : 'border-white/10 text-slate-500 hover:text-slate-300 hover:border-white/20'"
            >
              <svg v-if="copied !== cmd.id" class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
              </svg>
              <svg v-else class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"/>
              </svg>
              {{ copied === cmd.id ? 'Copied!' : 'Copy' }}
            </button>
          </div>

          <!-- Description -->
          <p class="text-[10px] text-slate-600 mb-2">{{ cmd.description }}</p>

          <!-- Command -->
          <code class="block text-[11px] text-orange-300/80 font-mono break-all leading-relaxed">{{ cmd.cmd }}</code>
        </div>
      </div>

      <!-- Tip -->
      <div class="mt-4 flex items-start gap-2 p-3  bg-orange-500/5 border border-orange-500/10">
        <span class="text-orange-400 text-sm flex-shrink-0">💡</span>
        <p class="text-[11px] text-slate-500 leading-relaxed">
          <span class="text-slate-400 font-medium">Smart detection:</span>
          When you use <code class="text-orange-300/70 font-mono">curl</code> or <code class="text-orange-300/70 font-mono">wget</code>,
          the API automatically returns a human-readable plain-text response.
          Use <code class="text-orange-300/70 font-mono">/api/ip.json</code> to always get JSON.
        </p>
      </div>
    </div>
  </div>
</template>
