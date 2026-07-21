<template>
  <svg viewBox="0 0 100 100" class="compass-icon" xmlns="http://www.w3.org/2000/svg">
    <defs>
      <linearGradient id="compassGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color: var(--accent)" />
        <stop offset="100%" style="stop-color: var(--accent-2)" />
      </linearGradient>
    </defs>
    <circle cx="50" cy="50" r="43" fill="none" stroke="url(#compassGradient)" stroke-width="4" />
    <g stroke="url(#compassGradient)" stroke-width="2.5" stroke-linecap="round" opacity="0.55">
      <line x1="50" y1="9" x2="50" y2="17" />
      <line x1="50" y1="83" x2="50" y2="91" />
      <line x1="9" y1="50" x2="17" y2="50" />
      <line x1="83" y1="50" x2="91" y2="50" />
    </g>
    <polygon points="50,24 59,50 50,50" fill="url(#compassGradient)" />
    <polygon points="50,76 41,50 50,50" fill="var(--bg)" stroke="url(#compassGradient)" stroke-width="2.5" stroke-linejoin="round" />
    <circle cx="50" cy="50" r="5.5" fill="url(#compassGradient)" />
  </svg>
</template>

<style scoped>
.compass-icon {
  width: 100%;
  height: 100%;
}
</style>
