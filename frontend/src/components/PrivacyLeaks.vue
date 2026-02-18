<script setup>
import { ref, onMounted } from 'vue'
import DetailCard from './DetailCard.vue'

const props = defineProps({
  serverIp: { type: String, default: '' }
})

const localIps = ref([])
const dnsIps = ref([])
const webrtcLeakDetected = ref(false)
const dnsLeakDetected = ref(false)
const checkingWebRTC = ref(true)
const checkingDNS = ref(true)
const supported = ref(true)

const checkWebRTC = async () => {
  checkingWebRTC.value = true
  localIps.value = []
  webrtcLeakDetected.value = false

  if (!window.RTCPeerConnection) {
    supported.value = false
    checkingWebRTC.value = false
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
    
    if (localIps.value.length > 0 && props.serverIp) {
      webrtcLeakDetected.value = localIps.value.some(ip => ip !== props.serverIp)
    }
  } catch (e) {
    console.error('WebRTC check failed:', e)
  }
  checkingWebRTC.value = false
}

const checkDNS = async () => {
  checkingDNS.value = true
  dnsIps.value = []
  dnsLeakDetected.value = false

  try {
    const res = await fetch('https://edns.ip-api.com/json')
    const data = await res.json()
    if (data.dns && data.dns.ip) {
      const ip = data.dns.ip
      dnsIps.value = [ip]
      if (props.serverIp && ip !== props.serverIp) {
        dnsLeakDetected.value = true
      }
    }
  } catch (e) {
    console.error('DNS leak check failed:', e)
  }
  checkingDNS.value = false
}

const runAllTests = () => {
  checkWebRTC()
  checkDNS()
}

onMounted(runAllTests)
</script>

<template>
  <DetailCard title="Privacy Leaks" icon='<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"/></svg>' :loading="false">
    <div class="flex flex-col h-full space-y-6">
      <!-- WebRTC Section -->
      <div class="group/leak relative p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] transition-all duration-300">
        <div class="flex items-center justify-between mb-3 border-b border-white/[0.05] pb-2">
          <div class="flex items-center gap-2">
            <span class="text-[10px] text-slate-500 uppercase tracking-widest font-bold">WebRTC Interface</span>
          </div>
          <div class="flex items-center gap-1.5">
            <span v-if="checkingWebRTC" class="flex gap-0.5">
              <span class="w-1 h-1 bg-orange-500 animate-[bounce_1s_infinite_0ms] rounded-full"></span>
              <span class="w-1 h-1 bg-orange-500 animate-[bounce_1s_infinite_200ms] rounded-full"></span>
              <span class="w-1 h-1 bg-orange-500 animate-[bounce_1s_infinite_400ms] rounded-full"></span>
            </span>
            <span v-else-if="webrtcLeakDetected" class="text-[9px] px-2 py-0.5 rounded-full bg-red-400/10 text-red-400 font-bold uppercase tracking-tight">⚠ EXPOSED</span>
            <span v-else class="text-[9px] px-2 py-0.5 rounded-full bg-emerald-400/10 text-emerald-400 font-bold uppercase tracking-tight">✓ SECURE</span>
          </div>
        </div>
        
        <div class="space-y-2">
          <div v-if="localIps.length === 0 && !checkingWebRTC" class="text-[11px] text-slate-600 italic py-1">No local network exposure detected</div>
          <div v-else class="space-y-1.5">
            <div v-for="ip in localIps" :key="ip" class="flex items-center justify-between p-2 rounded-lg bg-black/20 border border-white/[0.03]">
              <span class="text-[11px] font-mono tracking-tight" :class="ip === serverIp ? 'text-slate-400' : 'text-red-400 font-medium'">{{ ip }}</span>
              <span v-if="ip !== serverIp" class="text-[8px] px-1.5 py-0.5 bg-red-500/20 text-red-400 rounded-md font-bold">LOCAL IP</span>
              <span v-else class="text-[8px] px-1.5 py-0.5 bg-white/5 text-slate-600 rounded-md font-bold uppercase">Public</span>
            </div>
          </div>
        </div>
      </div>

      <!-- DNS Section -->
      <div class="group/leak relative p-3 rounded-xl bg-white/[0.02] border border-white/[0.05] hover:bg-white/[0.04] transition-all duration-300">
        <div class="flex items-center justify-between mb-3 border-b border-white/[0.05] pb-2">
          <div class="flex items-center gap-2">
            <span class="text-[10px] text-slate-500 uppercase tracking-widest font-bold">DNS Resolver</span>
          </div>
          <div class="flex items-center gap-1.5">
            <span v-if="checkingDNS" class="flex gap-0.5">
              <span class="w-1 h-1 bg-orange-500 animate-[bounce_1s_infinite_0ms] rounded-full"></span>
              <span class="w-1 h-1 bg-orange-500 animate-[bounce_1s_infinite_200ms] rounded-full"></span>
              <span class="w-1 h-1 bg-orange-500 animate-[bounce_1s_infinite_400ms] rounded-full"></span>
            </span>
            <span v-else-if="dnsLeakDetected" class="text-[9px] px-2 py-0.5 rounded-full bg-amber-400/10 text-amber-400 font-bold uppercase tracking-tight">△ REDIRECTED</span>
            <span v-else class="text-[9px] px-2 py-0.5 rounded-full bg-emerald-400/10 text-emerald-400 font-bold uppercase tracking-tight">✓ SECURE</span>
          </div>
        </div>
        
        <div class="space-y-2">
          <div v-if="dnsIps.length === 0 && !checkingDNS" class="text-[11px] text-slate-600 italic py-1">DNS check in progress...</div>
          <div v-else class="space-y-1.5">
            <div v-for="ip in dnsIps" :key="ip" class="flex items-center justify-between p-2 rounded-lg bg-black/20 border border-white/[0.03]">
              <span class="text-[11px] font-mono tracking-tight" :class="ip === serverIp ? 'text-slate-400' : 'text-amber-400 font-medium'">{{ ip }}</span>
              <span v-if="ip !== serverIp" class="text-[8px] px-1.5 py-0.5 bg-amber-500/20 text-amber-400 rounded-md font-bold uppercase">Resolver</span>
              <span v-else class="text-[8px] px-1.5 py-0.5 bg-white/5 text-slate-600 rounded-md font-bold uppercase">Direct</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer action - pinned to bottom -->
      <button
        @click="runAllTests"
        :disabled="checkingWebRTC || checkingDNS"
        class="w-full mt-auto py-2.5 rounded-full text-[10px] font-bold uppercase tracking-[0.2em] border border-orange-500/20 bg-orange-500/5 text-orange-400 hover:bg-orange-500/10 hover:border-orange-500/40 hover:shadow-[0_0_20px_rgba(249,115,22,0.1)] transition-all duration-300 disabled:opacity-30"
      >
        Re-Scan Privacy Leaks
      </button>
    </div>
  </DetailCard>
</template>
