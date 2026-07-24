<script setup lang="ts">
// Topographic contour-line texture — signature cartography background.
// Very low contrast in both modes; purely decorative.
withDefaults(defineProps<{ variant?: 'accent' | 'ink' }>(), { variant: 'accent' })
</script>

<template>
  <svg
    class="contour"
    :class="variant"
    viewBox="0 0 400 300"
    preserveAspectRatio="xMidYMid slice"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
  >
    <g class="drift" fill="none" stroke="currentColor" stroke-width="1.2">
      <path d="M-20 120 C 60 70, 120 150, 200 110 S 340 60, 430 130" />
      <path d="M-20 145 C 60 95, 125 175, 205 135 S 345 88, 430 155" />
      <path d="M-20 172 C 65 125, 130 200, 210 162 S 350 118, 430 182" />
      <path d="M-20 202 C 70 158, 135 228, 215 192 S 352 150, 430 210" />
      <path d="M-20 236 C 72 196, 140 258, 220 226 S 356 188, 430 244" />
      <path d="M60 20 C 130 -10, 200 40, 250 10 S 360 -20, 430 30" />
      <path d="M40 44 C 120 12, 195 66, 248 36 S 362 6, 430 56" />
      <path d="M120 288 C 190 260, 250 300, 320 276 S 400 250, 440 286" />
    </g>
  </svg>
</template>

<style scoped>
.contour {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  pointer-events: none;
  z-index: 0;
}

/* Very slow, imperceptible drift so the map feels alive. Transform-only. */
.drift {
  transform-box: view-box;
  transform-origin: center;
  will-change: transform;
  animation: contourDrift 40s ease-in-out infinite alternate;
}

@keyframes contourDrift {
  from {
    transform: translate(0, 0);
  }
  to {
    transform: translate(20px, -14px);
  }
}

@media (prefers-reduced-motion: reduce) {
  .drift {
    animation: none;
  }
}

.contour.accent {
  color: var(--accent);
  opacity: 0.14;
}

.contour.ink {
  color: var(--text-h);
  opacity: 0.05;
}

@media (prefers-color-scheme: dark) {
  .contour.accent {
    opacity: 0.16;
  }
  .contour.ink {
    opacity: 0.08;
  }
}
</style>
