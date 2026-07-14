<script setup>
import { computed, ref, onMounted } from 'vue';
import AppLayout from '@/components/AppLayout.vue';
import StatCard from '@/components/StatCard.vue';
import api from "@/services/api";

const products = ref([]);
const warehouses = ref([]);
const auditLogs = ref([]);

async function loadProducts() {
  try {
    const response = await api.get('/products/');
    products.value = response.data;
  } catch (error) {
    console.error("Erreur produits :", error.response?.data || error);
  }
}


async function loadWarehouses() {
  try {
    const response = await api.get('/warehouses/');
    warehouses.value = response.data;
  } catch (error) {
    console.error("Erreur entrepôts :", error.response?.data || error);
  }
}


async function loadAudits() {
  try {
    const response = await api.get('/transfers/');
    auditLogs.value = response.data;
  } catch (error) {
    console.error("Erreur audits :", error.response?.data || error);
  }
}


onMounted(() => {
  loadProducts();
  loadWarehouses();
  loadAudits();
});


const lowStockProducts = computed(() =>
  products.value.filter(
    (product) => product.quantite <= product.seuil_reapprovisionnement
  )
);


const averageCapacity = computed(() => {
  if (warehouses.value.length === 0) return 0;

  const total = warehouses.value.reduce(
    (sum, warehouse) => sum + warehouse.capacite,
    0
  );

  return Math.round(total / warehouses.value.length);
});


function capacityColor(capacity) {
  if (capacity >= 90) return 'bg-red-500';
  if (capacity >= 70) return 'bg-amber-500';
  return 'bg-emerald-600';
}


function capacityBadge(capacity) {
  if (capacity >= 90) return 'bg-red-50 text-red-600';
  if (capacity >= 70) return 'bg-amber-50 text-amber-600';
  return 'bg-emerald-50 text-emerald-700';
}
</script>

<template>
  <AppLayout>
    <!-- Bannière de bienvenue -->
    <section class="relative mb-6 overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 p-6 text-white shadow-lg shadow-emerald-900/10 sm:p-8">
      <div class="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
      <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.08)_1px,transparent_0)] bg-[size:22px_22px]"></div>

      <div class="relative flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <p class="text-sm font-medium text-emerald-100/80">Tableau de bord</p>
          <h1 class="mt-1 text-3xl font-bold">Bienvenue, Alex 👋</h1>
          <p class="mt-1 text-emerald-50/90">Suivi global des entrepôts, produits et audits Eco-Stock.</p>
        </div>
        <RouterLink
          to="/products"
          class="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-emerald-700 shadow-md transition hover:bg-emerald-50 active:scale-[0.98]"
        >
         Voir les produits
        </RouterLink>
      </div>
    </section>

    <!-- Statistiques -->
    <section class="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
      <StatCard
        label="Total des entrepôts"
        :value="warehouses.length"
        helper="+2 ce mois-ci"
        icon="building"
        color="emerald"
      />
      <StatCard
        label="Total des produits"
        :value="products.length"
        helper="Inventaire synchronisé"
        icon="box"
        color="teal"
      />
      <StatCard
        label="Capacité moyenne"
        :value="`${averageCapacity}%`"
        helper="Tous entrepôts confondus"
        icon="chart"
        color="blue"
      />
      <StatCard
        label="Alertes stock bas"
        :value="lowStockProducts.length"
        helper="À vérifier"
        icon="alert"
        color="red"
      />
    </section>

    <section class="mt-6 grid gap-6 xl:grid-cols-3">
      <!-- Aperçu des entrepôts -->
      <article class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md xl:col-span-2">
        <div class="mb-5 flex items-center justify-between">
          <div>
            <h2 class="text-lg font-bold text-slate-950">Aperçu des entrepôts</h2>
            <p class="text-sm text-slate-400">Capacité actuelle par entrepôt</p>
          </div>
          <RouterLink
            to="/warehouses"
            class="inline-flex items-center gap-1 text-sm font-bold text-emerald-700 hover:text-emerald-800"
          >
            Voir tout
            <svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
            </svg>
          </RouterLink>
        </div>

        <div class="space-y-5">
          <div v-for="warehouse in warehouses" :key="warehouse.id" class="group">
            <div class="mb-1.5 flex items-center justify-between text-sm">
              <RouterLink
                :to="`/warehouses/${warehouse.id}`"
                class="font-bold text-slate-900 transition group-hover:text-emerald-700"
              >
                {{ warehouse.nom }}
              </RouterLink>
              <span
                class="rounded-full px-2 py-0.5 text-xs font-bold"
                :class="capacityBadge(warehouse.capacite)"
              >
                {{ (warehouse.capacite /100)}}%
              </span>
            </div>
            <div class="h-2.5 overflow-hidden rounded-full bg-slate-100">
              <div
                class="h-2.5 rounded-full transition-all duration-500"
                :class="capacityColor(warehouse.capacite)"
                :style="{ width: `${Math.min(warehouse.capacite, 100)}%` }"
              ></div>
            </div>
          </div>
        </div>
      </article>

      <!-- Audits récents -->
      <article class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:shadow-md">
        <div class="mb-5 flex items-center justify-between">
          <h2 class="text-lg font-bold text-slate-950">Audits récents</h2>
          <span class="grid h-8 w-8 place-items-center rounded-lg bg-emerald-50 text-emerald-700">
            <svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M12 6v6l4 2M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </span>
        </div>

        <div class="space-y-3">
          <div
            v-for="log in auditLogs"
            :key="log.id"
            class="group flex items-start gap-3 rounded-xl bg-slate-50 p-3 transition hover:bg-emerald-50"
          >
            <span class="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-lg bg-white text-emerald-700 shadow-sm">
              <svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </span>
            <div class="min-w-0">
              <p class="truncate text-sm font-bold text-slate-900">
              {{ log.produit_nom }}
              </p>

              <p class="text-xs text-slate-500">
              {{ log.source_nom }} → {{ log.destination_nom }}
              · {{ log.date }}
              </p>
            </div>
          </div>
        </div>
      </article>
    </section>
  </AppLayout>
</template>
