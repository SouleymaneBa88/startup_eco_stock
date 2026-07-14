<script setup>
import { ref } from 'vue';

// Etat local de la barre de recherche.
// Pour l'instant elle est visuelle; elle pourra filtrer les listes plus tard.
const search = ref('');
const isFocused = ref(false);
</script>

<template>
  <!-- Barre supérieure commune aux pages connectées. -->
  <header class="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white/95 px-4 py-3 backdrop-blur md:px-8">
    <label
      class="group relative flex w-10 max-w-xl items-center gap-3 rounded-xl border bg-slate-50 px-3.5 py-2.5 text-sm text-slate-500 transition-all duration-200"
      :class="isFocused
        ? 'border-emerald-400 bg-white shadow-lg shadow-emerald-500/10 ring-4 ring-emerald-100'
        : 'border-slate-200 hover:border-slate-300 hover:bg-white hover:shadow-sm'"
    >
      <svg
        class="h-4.5 w-4.5 shrink-0 transition-colors"
        :class="isFocused ? 'text-emerald-500' : 'text-slate-400'"
        fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"
      >
        <path stroke-linecap="round" stroke-linejoin="round" d="M21 21l-4.35-4.35m1.35-5.15a6.5 6.5 0 11-13 0 6.5 6.5 0 0113 0z" />
      </svg>

      <input
        v-model="search"
        class="w-100 bg-transparent text-slate-900 outline-none placeholder:text-slate-400"
        type="search"
        placeholder="Rechercher un entrepôt, un produit ou un ID d'audit..."
        @focus="isFocused = true"
        @blur="isFocused = false"
      />

      <!-- Bouton de remise à zéro visible seulement quand une recherche existe. -->
      <button
        v-if="search"
        type="button"
        class="grid h-5 w-5 shrink-0 place-items-center rounded-full bg-slate-200 text-slate-500 transition hover:bg-slate-300"
        @click="search = ''"
      >
        <svg class="h-3 w-3" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>

    </label>

    <div class="ml-4 hidden items-center gap-3 sm:flex">
      <button class="relative rounded-xl border border-slate-200 p-2.5 text-slate-500 transition hover:bg-slate-50 hover:text-slate-700">
        <svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" />
        </svg>
        <span class="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-red-500"></span>
      </button>
      <div class="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 font-bold text-white shadow-sm">
        AM
      </div>
    </div>
  </header>
</template>
