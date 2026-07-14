<script setup>
// Carte statistique réutilisable dans le dashboard et les pages détails.
// label = titre, value = nombre/texte principal, helper = petit texte optionnel.
defineProps({
  label: { type: String, required: true },
  value: { type: [String, Number], required: true },
  helper: { type: String, default: '' },
});
</script>

<template>
  <article class="rounded-lg border border-slate-200 bg-white p-5 shadow-sm">
    <p class="text-sm text-slate-500">{{ label }}</p>
    <p class="mt-2 text-2xl font-bold text-slate-950">{{ value }}</p>
    <p v-if="helper" class="mt-2 text-xs font-semibold text-emerald-700">{{ helper }}</p>
  </article>
</template>
