<script setup lang="ts">
defineProps<{ code: string }>()
</script>

<template>
  <svg viewBox="0 0 64 64" fill="none" xmlns="http://www.w3.org/2000/svg" class="trait-icon">
    <!-- R: Realistic - wrench -->
    <g v-if="code === 'R'" stroke="#fff" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round">
      <path
        d="M44 14a10 10 0 0 0-13.8 11.4L14 41.6a4.2 4.2 0 0 0 6 6l16.2-16.2A10 10 0 0 0 50 20l-7 7-6-6 7-7Z"
      />
    </g>
    <!-- I: Investigative - magnifying glass -->
    <g v-else-if="code === 'I'" stroke="#fff" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="27" cy="27" r="14" />
      <path d="M37 37 L49 49" />
    </g>
    <!-- A: Artistic - palette -->
    <g v-else-if="code === 'A'" stroke="#fff" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round">
      <path
        d="M32 12c-11 0-20 8.5-20 19s9 15 15 12c2.5-1.3 1-4.5 3-6.5 2.5-2.5 15 1 19-7 3-6-2-17.5-17-17.5Z"
      />
      <circle cx="24" cy="26" r="2.4" fill="#fff" />
      <circle cx="32" cy="21" r="2.4" fill="#fff" />
      <circle cx="40" cy="26" r="2.4" fill="#fff" />
    </g>
    <!-- S: Social - two people -->
    <g v-else-if="code === 'S'" stroke="#fff" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round">
      <circle cx="24" cy="22" r="6.5" />
      <path d="M12 46c0-8 5.4-13 12-13s12 5 12 13" />
      <circle cx="42" cy="19" r="5.5" />
      <path d="M38 33.5c1.2-.4 2.6-.6 4-.6 6 0 10.5 4.4 10.5 11.3" />
    </g>
    <!-- E: Enterprising - rocket -->
    <g v-else-if="code === 'E'" stroke="#fff" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round">
      <path
        d="M32 10c6 4 9 11 9 19 0 4-1 8-2.5 11H25.5C24 36 23 32 23 28c0-8 3-15 9-18Z"
      />
      <circle cx="32" cy="24" r="3.2" />
      <path d="M25 40l-6 10M39 40l6 10M27 50h10" />
    </g>
    <!-- C: Conventional - clipboard/checklist -->
    <g v-else stroke="#fff" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round">
      <rect x="17" y="12" width="30" height="40" rx="4" />
      <path d="M26 10h12a2 2 0 0 1 2 2v2H24v-2a2 2 0 0 1 2-2Z" />
      <path d="M24 28h4M24 36h4M24 44h4" />
      <path d="M32 28h8M32 36h8M32 44h8" />
    </g>
  </svg>
</template>

<style scoped>
.trait-icon {
  width: 72px;
  height: 72px;
}
</style>
