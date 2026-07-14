<template>
  <!-- Layout commun des pages connectées : sidebar + topbar + contenu. -->
  <div class="min-h-screen bg-slate-50 text-slate-900">
    <div class="flex">
      <AppSidebar />
      <div class="min-w-0 flex-1">
        <AppTopbar />
        <main class="px-4 py-6 md:px-8">
          <!-- Les vues enfants sont injectées ici via le slot. -->
          <slot />
        </main>
      </div>
    </div>
  </div>
</template>

<script setup>
import AppSidebar from './AppSidebar.vue';
import AppTopbar from './AppTopbar.vue';
</script>
