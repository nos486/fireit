<script setup>
import { ref, onMounted } from 'vue'
import DetailCard from './DetailCard.vue'

const props = defineProps({
  serverIp: { type: String, default: '' }
})

const localIps = ref([])
const leakDetected = ref(false)
const checking = ref(true)
const supported = ref(true)

const checkWebRTC = async () => {
  checking.value = true
  localIps.value = []
  leakDetected.value = false

  if (!window.RTCPeerConnection) {
    supported.value = false
    checking.value = false
    return
  }

  try {
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }]
    })
    const ips = new Set()

    pc.createDataChannel('')
    const offer = await pc.createOffer()
    await pc.setLocalDescription(offer)

    await new Promise((resolve) => {
      const timeout = setTimeout(resolve, 5000)

      pc.onicecandidate = (event) => {
        if (!event.candidate) {
          clearTimeout(timeout)
          resolve()
          return
        }
        const parts = event.candidate.candidate.split(' ')
        const ip = parts[4]
        if (ip && !ip.includes('.local') && !ips.has(ip)) {
          ips.add(ip)
        }
      }
    })

    pc.close()

    localIps.value = Array.from(ips)
    
    // Check if any detected IP differs from the server-reported IP
    if (localIps.value.length > 0 && props.serverIp) {
      leakDetected.value = localIps.value.some(ip => ip !== props.serverIp)
    }
  } catch (e) {
    console.error('WebRTC check failed:', e)
  }

  checking.value = false
}

onMounted(checkWebRTC)
</script>

<template>
  <DetailCard title="WebRTC Leak Test" icon="🔓" :loading="false">
    <div class="space-y-1">
      <!-- Status Banner -->
      <div class="mb-4 p-3 rounded-xl border" :class="
        checking
          ? 'bg-white/[0.03] border-white/[0.06]'
          : !supported
            ? 'bg-slate-500/5 border-slate-500/20'
            : leakDetected
              ? 'bg-red-500/5 border-red-500/20'
              : localIps.length === 0
                ? 'bg-emerald-500/5 border-emerald-500/20'
                : 'bg-amber-500/5 border-amber-500/20'
      ">
        <p class="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Status</p>
        <p v-if="checking" class="text-sm text-slate-400 font-medium animate-pulse">Checking WebRTC...</p>
        <p v-else-if="!supported" class="text-sm text-slate-400 font-medium">WebRTC Not Supported</p>
        <p v-else-if="localIps.length === 0" class="text-sm text-emerald-400 font-medium">✓ No Leak Detected</p>
        <p v-else-if="leakDetected" class="text-sm text-red-400 font-medium">⚠ IP Leak Detected!</p>
        <p v-else class="text-sm text-amber-400 font-medium">△ IPs Exposed (Same as Public)</p>
      </div>

      <!-- Server IP -->
      <div class="flex justify-between items-center py-2.5 border-b border-white/[0.04]">
        <span class="text-[11px] text-slate-500 uppercase tracking-wider">Server IP</span>
        <span class="text-[12px] text-orange-400 font-mono">{{ serverIp || '—' }}</span>
      </div>

      <!-- Detected IPs -->
      <div class="py-2.5">
        <p class="text-[11px] text-slate-500 uppercase tracking-wider mb-2">WebRTC IPs</p>
        <div v-if="checking" class="shimmer h-3 w-3/4"></div>
        <div v-else-if="localIps.length === 0" class="text-[11px] text-slate-600 font-mono">None found — protected</div>
        <div v-else class="space-y-1.5">
          <div v-for="ip in localIps" :key="ip" class="flex items-center gap-2">
            <span class="w-1.5 h-1.5 rounded-full" :class="ip === serverIp ? 'bg-amber-400' : 'bg-red-400'"></span>
            <span class="text-[12px] font-mono" :class="ip === serverIp ? 'text-amber-300' : 'text-red-300'">{{ ip }}</span>
            <span v-if="ip !== serverIp" class="text-[9px] px-1.5 py-0.5 rounded bg-red-500/10 text-red-400 border border-red-500/20">LEAKED</span>
          </div>
        </div>
      </div>

      <!-- Re-check -->
      <button
        @click="checkWebRTC"
        :disabled="checking"
        class="w-full mt-2 py-2 rounded-lg text-[11px] font-medium uppercase tracking-wider border transition-all duration-200"
        :class="checking
          ? 'border-white/5 bg-white/[0.02] text-slate-600 cursor-not-allowed'
          : 'border-orange-500/20 bg-orange-500/5 text-orange-400 hover:bg-orange-500/10 hover:border-orange-500/30'"
      >
        {{ checking ? 'Checking...' : 'Re-Check' }}
      </button>
    </div>
  </DetailCard>
</template>
