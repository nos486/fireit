<script setup>
import { onMounted, ref, watch } from 'vue'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

const props = defineProps({
  lat: [Number, String],
  lng: [Number, String],
  city: String,
  colo: String,
  timezone: String,
  loading: Boolean
})

const mapContainer = ref(null)
let map = null
let marker = null

const customIcon = L.divIcon({
  className: 'custom-pulsing-icon',
  html: '<div class="marker-pulse"></div>',
  iconSize: [16, 16],
  iconAnchor: [8, 8]
})

const initMap = () => {
  if (!mapContainer.value) return
  const lat = parseFloat(props.lat) || 20
  const lng = parseFloat(props.lng) || 0

  map = L.map(mapContainer.value, {
    zoomControl: false,
    attributionControl: false,
    scrollWheelZoom: false,
  }).setView([lat, lng], props.lat ? 10 : 2)

  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    maxZoom: 19
  }).addTo(map)

  if (props.lat && props.lng) {
    marker = L.marker([lat, lng], { icon: customIcon }).addTo(map)
  }
}

watch(() => [props.lat, props.lng], ([newLat, newLng]) => {
  if (!map || !newLat || !newLng) return
  const coords = [parseFloat(newLat), parseFloat(newLng)]
  map.flyTo(coords, 10, { duration: 1.5 })
  if (marker) {
    marker.setLatLng(coords)
  } else {
    marker = L.marker(coords, { icon: customIcon }).addTo(map)
  }
})

onMounted(initMap)
</script>

<template>
  <div class="relative w-full rounded-2xl overflow-hidden border border-white/[0.07] bg-[#0a0b0f]" style="height: 380px;">
    <!-- Top accent line -->
    <div class="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-orange-500/40 to-transparent z-[1001]"></div>

    <!-- Map -->
    <div ref="mapContainer" class="w-full h-full"></div>

    <!-- Bottom info bar -->
    <div class="absolute bottom-0 left-0 right-0 z-[1000] bg-gradient-to-t from-black/90 via-black/60 to-transparent pt-12 pb-4 px-6">
      <div class="flex flex-wrap gap-x-8 gap-y-2">
        <div>
          <p class="text-[10px] text-slate-500 uppercase tracking-widest mb-0.5">Latitude</p>
          <p class="text-xs text-slate-200 font-mono">{{ lat ? parseFloat(lat).toFixed(5) : '—' }}</p>
        </div>
        <div>
          <p class="text-[10px] text-slate-500 uppercase tracking-widest mb-0.5">Longitude</p>
          <p class="text-xs text-slate-200 font-mono">{{ lng ? parseFloat(lng).toFixed(5) : '—' }}</p>
        </div>
        <div>
          <p class="text-[10px] text-slate-500 uppercase tracking-widest mb-0.5">Timezone</p>
          <p class="text-xs text-slate-200 font-mono">{{ timezone || '—' }}</p>
        </div>
        <div>
          <p class="text-[10px] text-slate-500 uppercase tracking-widest mb-0.5">Edge Node</p>
          <p class="text-xs text-orange-400 font-mono font-medium">{{ colo || '—' }}</p>
        </div>
        <div v-if="city">
          <p class="text-[10px] text-slate-500 uppercase tracking-widest mb-0.5">Location</p>
          <p class="text-xs text-slate-200 font-mono">{{ city }}</p>
        </div>
      </div>
    </div>

    <!-- Loading overlay -->
    <Transition name="fade">
      <div v-if="loading" class="absolute inset-0 bg-[#0a0b0f]/90 z-[1002] flex flex-col items-center justify-center gap-3">
        <div class="w-8 h-8 border-2 border-orange-500/30 border-t-orange-500  animate-spin"></div>
        <p class="text-[11px] text-slate-500 uppercase tracking-widest font-mono">Locating signal...</p>
      </div>
    </Transition>
  </div>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active { transition: opacity 0.4s; }
.fade-enter-from, .fade-leave-to { opacity: 0; }
</style>
