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
  <DetailCard title="Privacy Leaks" icon="🔓" :loading="false">
    <div class="flex flex-col h-full space-y-4">
      <div class="flex-1 space-y-4">
        <!-- WebRTC Section -->
        <div>
          <div class="flex items-center justify-between mb-2">
            <span class="text-[11px] text-slate-500 uppercase tracking-wider">WebRTC Leak</span>
            <span v-if="checkingWebRTC" class="text-[10px] text-slate-500 animate-pulse">Checking...</span>
            <span v-else-if="webrtcLeakDetected" class="text-[10px] text-red-400 font-bold uppercase tracking-tight">⚠ Leak Detected</span>
            <span v-else class="text-[10px] text-emerald-400 font-bold uppercase tracking-tight">✓ Secure</span>
          </div>
          
          <div class="bg-black/20 rounded-lg p-2.5 min-h-[40px]">
            <div v-if="localIps.length === 0 && !checkingWebRTC" class="text-[11px] text-slate-600 italic">No local IPs exposed</div>
            <div v-else class="space-y-1">
              <div v-for="ip in localIps" :key="ip" class="flex items-center justify-between">
                <span class="text-[11px] font-mono" :class="ip === serverIp ? 'text-slate-400' : 'text-red-400'">{{ ip }}</span>
                <span v-if="ip !== serverIp" class="text-[9px] px-1 bg-red-500/10 text-red-400 rounded">LEAK</span>
              </div>
            </div>
          </div>
        </div>

        <!-- DNS Section -->
        <div>
          <div class="flex items-center justify-between mb-2">
            <span class="text-[11px] text-slate-500 uppercase tracking-wider">DNS Leak</span>
            <span v-if="checkingDNS" class="text-[10px] text-slate-500 animate-pulse">Checking...</span>
            <span v-else-if="dnsLeakDetected" class="text-[10px] text-amber-400 font-bold uppercase tracking-tight">△ DNS Exposed</span>
            <span v-else class="text-[10px] text-emerald-400 font-bold uppercase tracking-tight">✓ Secure</span>
          </div>
          
          <div class="bg-black/20 rounded-lg p-2.5 min-h-[40px]">
            <div v-if="dnsIps.length === 0 && !checkingDNS" class="text-[11px] text-slate-600 italic">Could not detect DNS</div>
            <div v-else class="space-y-1">
              <div v-for="ip in dnsIps" :key="ip" class="flex items-center justify-between">
                <span class="text-[11px] font-mono" :class="ip === serverIp ? 'text-slate-400' : 'text-amber-400'">{{ ip }}</span>
                <span v-if="ip !== serverIp" class="text-[9px] px-1 bg-amber-500/10 text-amber-400 rounded">RESOLVER</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Footer action -->
      <button
        @click="runAllTests"
        :disabled="checkingWebRTC || checkingDNS"
        class="w-full py-2 rounded-lg text-[10px] font-medium uppercase tracking-widest border border-orange-500/10 bg-orange-500/5 text-orange-400/80 hover:bg-orange-500/10 hover:border-orange-500/30 transition-all duration-200"
      >
        Re-Test Leaks
      </button>
    </div>
  </DetailCard>
</template>
