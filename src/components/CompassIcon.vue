<script setup lang="ts">
import { computed } from 'vue'

// `rotation` (degrees) drives the needle group only. When omitted the needle
// sits still at north — used for the static header/footer marks.
const props = defineProps<{ rotation?: number }>()

const needleStyle = computed(() =>
  props.rotation === undefined ? undefined : { transform: `rotate(${props.rotation}deg)` },
)
</script>

<template>
  <svg viewBox="0 0 100 100" class="compass-icon" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
    <!-- outer ring -->
    <circle cx="50" cy="50" r="44" fill="none" stroke="var(--accent)" stroke-width="3" />
    <circle cx="50" cy="50" r="37" fill="none" stroke="var(--accent-border)" stroke-width="1.5" stroke-dasharray="2 4" />

    <!-- cardinal ticks -->
    <g stroke="var(--accent)" stroke-width="2.5" stroke-linecap="round">
      <line x1="50" y1="7" x2="50" y2="15" />
      <line x1="50" y1="85" x2="50" y2="93" />
      <line x1="7" y1="50" x2="15" y2="50" />
      <line x1="85" y1="50" x2="93" y2="50" />
    </g>

    <!-- compass rose needle: N accent, S hollow -->
    <g class="needle" :style="needleStyle">
      <polygon points="50,20 57,50 50,50" fill="var(--accent)" />
      <polygon points="50,20 43,50 50,50" fill="var(--accent-hover)" />
      <polygon points="50,80 43,50 50,50" fill="var(--card-bg)" stroke="var(--accent)" stroke-width="2" stroke-linejoin="round" />
      <polygon points="50,80 57,50 50,50" fill="var(--border)" stroke="var(--accent)" stroke-width="2" stroke-linejoin="round" />
    </g>
    <circle cx="50" cy="50" r="5" fill="var(--card-bg)" stroke="var(--accent)" stroke-width="2.5" />
  </svg>
</template>

<style scoped>
.compass-icon {
  width: 100%;
  height: 100%;
}

.needle {
  transform-box: fill-box;
  transform-origin: center;
  will-change: transform;
}
</style>
