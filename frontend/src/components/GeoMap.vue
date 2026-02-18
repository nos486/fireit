<script setup>
import { onMounted, ref, watch } from 'vue'
import 'leaflet/dist/leaflet.css'
import L from 'leaflet'

const props = defineProps({
  lat: [Number, String],
  lng: [Number, String],
  loading: Boolean
})

const mapContainer = ref(null)
let map = null
let marker = null

// Custom pulsing marker icon using CSS
const customIcon = L.divIcon({
  className: 'custom-pulsing-icon',
  html: '<div class="marker-pulse"></div>',
  iconSize: [20, 20],
  iconAnchor: [10, 10]
})

const initMap = () => {
  if (!mapContainer.value) return

  // Default to 0,0 if no data
  const initialLat = props.lat || 0
  const initialLng = props.lng || 0

  map = L.map(mapContainer.value, {
    zoomControl: false,
    attributionControl: false
  }).setView([initialLat, initialLng], 13)

  // Dark Matter Tiles (CartoDB) - Free for non-commercial use mostly, nice dark theme
  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    maxZoom: 19
  }).addTo(map)

  if (props.lat && props.lng) {
    marker = L.marker([props.lat, props.lng], { icon: customIcon }).addTo(map)
  }
}

watch(() => [props.lat, props.lng], ([newLat, newLng]) => {
  if (map && newLat && newLng) {
    const coords = [parseFloat(newLat), parseFloat(newLng)]
    map.setView(coords, 10)
    
    if (marker) {
      marker.setLatLng(coords)
    } else {
      marker = L.marker(coords, { icon: customIcon }).addTo(map)
    }
  }
})

onMounted(() => {
  initMap()
})
</script>

<template>
  <div class="relative w-full h-[400px] bg-[#0f1218] border border-gray-800 rounded-sm overflow-hidden">
    <div ref="mapContainer" class="w-full h-full z-0"></div>
    
    <!-- Map Overlay Info -->
    <div class="absolute bottom-0 left-0 w-full bg-black/80 backdrop-blur-sm p-4 z-[1000] border-t border-gray-800 flex justify-between items-end">
      <div class="grid grid-cols-2 md:grid-cols-4 gap-8 text-xs font-mono">
        <div>
          <span class="text-gray-500 block mb-1">LATITUDE:</span>
          <span class="text-white">{{ lat || '...' }}</span>
        </div>
        <div>
          <span class="text-gray-500 block mb-1">LONGITUDE:</span>
          <span class="text-white">{{ lng || '...' }}</span>
        </div>
        <div>
          <span class="text-gray-500 block mb-1">TIMEZONE:</span>
          <span class="text-white text-nowrap">Europe/Berlin</span> <!-- Placeholder until computed -->
        </div>
        <div>
           <span class="text-gray-500 block mb-1">EDGE NODE:</span>
          <span class="text-white">FRA</span> <!-- Placeholder until passed -->
        </div>
      </div>
      
       <div class="text-right hidden md:block">
        <span class="text-gray-500 text-xs block mb-1">FULL DATE:</span>
        <span class="text-white text-xs font-mono">{{ new Date().toLocaleString() }}</span>
      </div>
    </div>

    <!-- Loading Overlay -->
    <div v-if="loading" class="absolute inset-0 bg-[#0f1218]/80 z-[1001] flex items-center justify-center">
      <span class="text-blue-500 font-mono animate-pulse">LOCATING SIGNAL...</span>
    </div>
  </div>
</template>

<style>
/* Global styles for Leaflet map */
.leaflet-container {
  background: #0f1218;
}

.marker-pulse {
  width: 20px;
  height: 20px;
  background: rgba(59, 130, 246, 0.5);
  border-radius: 50%;
  position: relative;
  border: 2px solid #3b82f6;
  box-shadow: 0 0 10px #3b82f6;
}

.marker-pulse::after {
  content: '';
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
  border-radius: 50%;
  border: 1px solid #3b82f6;
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    transform: translate(-50%, -50%) scale(1);
    opacity: 1;
  }
  100% {
    transform: translate(-50%, -50%) scale(3);
    opacity: 0;
  }
}
</style>
