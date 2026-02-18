<script setup>
import DetailCard from './DetailCard.vue'

defineProps({
  data: { type: Object, default: () => ({}) },
  loading: Boolean
})

const getThreatLevel = (score) => {
  if (score === 'N/A' || score === undefined) return { label: 'Unknown', color: 'slate', icon: '?' }
  const s = Number(score)
  if (s === 0) return { label: 'Clean', color: 'emerald', icon: '✓' }
  if (s < 10) return { label: 'Low Risk', color: 'lime', icon: '○' }
  if (s < 25) return { label: 'Medium Risk', color: 'amber', icon: '△' }
  return { label: 'High Risk', color: 'red', icon: '✕' }
}
</script>

<template>
  <DetailCard title="Security" icon="🛡" :loading="loading">
    <div class="space-y-1">
      <!-- Threat Score - Featured -->
      <div class="mb-4 p-3 rounded-xl border" :class="{
        'bg-emerald-500/5 border-emerald-500/20': getThreatLevel(data.threatScore).color === 'emerald',
        'bg-lime-500/5 border-lime-500/20': getThreatLevel(data.threatScore).color === 'lime',
        'bg-amber-500/5 border-amber-500/20': getThreatLevel(data.threatScore).color === 'amber',
        'bg-red-500/5 border-red-500/20': getThreatLevel(data.threatScore).color === 'red',
        'bg-white/[0.03] border-white/[0.06]': getThreatLevel(data.threatScore).color === 'slate',
      }">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-[10px] text-slate-500 uppercase tracking-widest mb-1">Threat Level</p>
            <p class="text-sm font-semibold" :class="{
              'text-emerald-400': getThreatLevel(data.threatScore).color === 'emerald',
              'text-lime-400': getThreatLevel(data.threatScore).color === 'lime',
              'text-amber-400': getThreatLevel(data.threatScore).color === 'amber',
              'text-red-400': getThreatLevel(data.threatScore).color === 'red',
              'text-slate-400': getThreatLevel(data.threatScore).color === 'slate',
            }">
              {{ getThreatLevel(data.threatScore).icon }} {{ getThreatLevel(data.threatScore).label }}
            </p>
          </div>
          <span class="text-2xl font-bold font-mono" :class="{
            'text-emerald-400/60': getThreatLevel(data.threatScore).color === 'emerald',
            'text-lime-400/60': getThreatLevel(data.threatScore).color === 'lime',
            'text-amber-400/60': getThreatLevel(data.threatScore).color === 'amber',
            'text-red-400/60': getThreatLevel(data.threatScore).color === 'red',
            'text-slate-500': getThreatLevel(data.threatScore).color === 'slate',
          }">{{ data.threatScore ?? '—' }}</span>
        </div>
      </div>

      <div class="divide-y divide-white/[0.04]">
        <div class="flex justify-between items-center py-2.5">
          <span class="text-[11px] text-slate-500 uppercase tracking-wider">TLS Version</span>
          <span class="text-[12px] px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20 font-mono">{{ data.tlsVersion || '—' }}</span>
        </div>
        <div class="flex justify-between items-center py-2.5">
          <span class="text-[11px] text-slate-500 uppercase tracking-wider">TLS Cipher</span>
          <span class="text-[12px] text-slate-200 font-mono text-right max-w-[60%] truncate" :title="data.tlsCipher">{{ data.tlsCipher || '—' }}</span>
        </div>
        <div class="flex justify-between items-center py-2.5">
          <span class="text-[11px] text-slate-500 uppercase tracking-wider">Protocol</span>
          <span class="text-[12px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-mono">{{ data.httpProtocol || '—' }}</span>
        </div>
      </div>
    </div>
  </DetailCard>
</template>
