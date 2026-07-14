<script setup>
import { useRoute } from 'vue-router';

const route = useRoute();

// Menu principal affiché à gauche sur les grands écrans.
// L'icône est une clé utilisée plus bas pour choisir le bon SVG.
const navigationItems = [
  { label: 'Tableau de bord', route: '/dashboard', icon: 'grid' },
  { label: 'Entrepôts', route: '/warehouses', icon: 'warehouse' },
  { label: 'Produits', route: '/products', icon: 'box' },
  { label: 'Transfert', route: '/move', icon: 'checklist' },
];

// Sert à mettre visuellement en avant la route active.
function isActive(path) {
  return route.path === path;
}
</script>

<template>
  <!-- Sidebar masquée sur mobile et visible à partir du breakpoint lg. -->
  <aside class="hidden min-h-screen w-72 shrink-0 border-r border-slate-200 bg-white px-4 py-6 lg:flex lg:flex-col">
    <RouterLink to="/dashboard" class="mb-8 flex items-center gap-3 px-2">
      <span class="grid h-10 w-10 place-items-center rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 text-lg font-black text-white shadow-md shadow-emerald-600/20">
        E
      </span>
      <span class="text-xl font-bold text-slate-950">Eco-Stock</span>
    </RouterLink>

    <p class="px-3 text-xs font-bold uppercase tracking-wide text-slate-400">Navigation</p>
    <nav class="mt-3 flex flex-1 flex-col gap-1">
      <!-- Génération automatique des liens depuis navigationItems. -->
      <RouterLink
        v-for="item in navigationItems"
        :key="item.route"
        :to="item.route"
        class="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold transition"
        :class="isActive(item.route)
          ? 'bg-emerald-50 text-emerald-700'
          : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'"
      >
        <span
          class="grid h-9 w-9 place-items-center rounded-lg transition"
          :class="isActive(item.route) ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200'"
        >
          <!-- Dashboard -->
          <svg v-if="item.icon === 'grid'" class="h-4.5 w-4.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M3.75 3.75h6v6h-6v-6zM14.25 3.75h6v6h-6v-6zM3.75 14.25h6v6h-6v-6zM14.25 14.25h6v6h-6v-6z" />
          </svg>
          <!-- Warehouses -->
          <svg v-else-if="item.icon === 'warehouse'" class="h-4.5 w-4.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 21h19.5M3 10.5L12 3l9 7.5M4.5 10.5V21h15V10.5M9 21v-6h6v6" />
          </svg>
          <!-- Products -->
          <svg v-else-if="item.icon === 'box'" class="h-4.5 w-4.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25M21 7.5v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
          </svg>
          <!-- Audit -->
          <svg v-else-if="item.icon === 'checklist'" class="h-4.5 w-4.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </span>
        <span>{{ item.label }}</span>
      </RouterLink>
    </nav>

    <div class="border-t border-slate-100 pt-4">
      <RouterLink
        to="/login"
        class="group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-semibold text-red-600 transition hover:bg-red-50"
      >
        <span class="grid h-9 w-9 place-items-center rounded-lg bg-red-50 text-red-600 transition group-hover:bg-red-100">
          <svg class="h-4.5 w-4.5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M8.25 9V5.25A2.25 2.25 0 0110.5 3h6a2.25 2.25 0 012.25 2.25v13.5A2.25 2.25 0 0116.5 21h-6a2.25 2.25 0 01-2.25-2.25V15M12 9l-3 3m0 0l3 3m-3-3h12.75" />
          </svg>
        </span>
        <span>Déconnexion</span>
      </RouterLink>

      <div class="mt-4 flex items-center gap-3 rounded-xl bg-slate-50 p-3">
        <span class="grid h-10 w-10 place-items-center rounded-lg bg-gradient-to-br from-emerald-500 to-teal-600 font-bold text-white shadow-sm">
          AM
        </span>
        <div>
          <p class="text-sm font-bold text-slate-950">Alex Manager</p>
          <p class="text-xs text-slate-500">Responsable des opérations</p>
        </div>
      </div>
    </div>
  </aside>
</template>
