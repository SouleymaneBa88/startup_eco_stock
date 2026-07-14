<script setup>
import { computed, ref, onMounted } from 'vue';
import AppLayout from '@/components/AppLayout.vue';
import StatCard from '@/components/StatCard.vue';
import api from '@/services/api';

const logs = ref([]);
const warehouses = ref([]);
const products = ref([]);

async function loadTransfers() {
  try {
    const response = await api.get('/transfers/');
    logs.value = response.data;
  } catch (error) {
    console.error('Erreur recuperation transferts :', error.response?.data || error);
  }
}

async function loadWarehouses() {
  try {
    const response = await api.get('/warehouses/');
    warehouses.value = response.data;
  } catch (error) {
    console.error('Erreur recuperation entrepots :', error.response?.data || error);
  }
}
  
async function loadProducts() {
  try {
    const response = await api.get('/products/');
    products.value = response.data;
  } catch (error) {
    console.error('Erreur recuperation produits :', error.response?.data || error);
  }
}

onMounted(() => {
  loadTransfers();
  loadWarehouses();
  loadProducts();
});

const validatedLogs = computed(() => logs.value.filter((log) => log.status === 'Validated').length);
const totalTransferredUnits = computed(() =>
  logs.value.reduce((total, log) => total + Number(log.quantite || 0), 0)
);

function statusBadge(status) {
  if (status === 'Validated') return 'bg-emerald-50 text-emerald-700';
  if (status === 'Pending' || status === 'Review') return 'bg-amber-50 text-amber-600';
  return 'bg-red-50 text-red-600';
}

function statusLabel(status) {
  if (status === 'Validated') return 'Validé';
  if (status === 'Pending') return 'En attente';
  if (status === 'Review') return 'Révision';
  if (status === 'Rejected') return 'Rejeté';
  return status;
}

function formatDate(date) {
  return new Date(date).toLocaleString();
}
</script>

<template>
  <AppLayout>
    <section class="relative mb-6 overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 p-6 text-white shadow-lg shadow-emerald-900/10 sm:p-8">
      <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.08)_1px,transparent_0)] bg-[size:22px_22px]"></div>
      <div class="relative flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <p class="text-sm font-medium text-emerald-100/80">Transaction</p>
          <h1 class="mt-1 text-3xl font-bold">Transfert des produits vers un autre entrepôts</h1>
        </div>
        
      </div>
    </section>

    <section class="grid gap-4 md:grid-cols-3">
      <StatCard label="Produits vérifiés" :value="products.length" helper="Inventaire API" icon="box" color="teal" />
      <StatCard label="Journaux validés" :value="validatedLogs" helper="Dernier cycle d'audit" icon="check" color="emerald" />
      <StatCard label="Unites transferees" :value="totalTransferredUnits" helper="Tous transferts" icon="alert" color="amber" />
    </section>

    <section class="mt-6">
      <div class="mb-4 flex items-center justify-between">
        <h2 class="text-lg font-bold text-slate-950">Historique des transactions</h2>
        <span class="text-sm text-slate-400">{{ logs.length }} entrées</span>
      </div>

      <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <article v-for="log in logs" :key="log.id" class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:shadow-md">
          <div class="flex items-start justify-between gap-3">
            <div class="min-w-0">
              <p class="truncate text-base font-bold text-slate-950">{{ log.produit_nom }}</p>
              <p class="mt-1 truncate text-sm text-slate-500">{{ log.source_nom }} vers {{ log.destination_nom }}</p>
            </div>
            <span class="shrink-0 rounded-full px-2.5 py-1 text-xs font-bold" :class="statusBadge(log.status)">
              {{ statusLabel(log.status) }}
            </span>
          </div>

          <div class="mt-4 space-y-1 text-sm text-slate-500">
            <p>{{ log.quantite }} unite(s) transferee(s)</p>
            <p>Par {{ log.actor }}</p>
          </div>

          <div class="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
            <span class="text-xs font-semibold text-slate-400">{{ log.id }}</span>
            <span class="text-xs text-slate-400">{{ formatDate(log.date) }}</span>
          </div>
        </article>
      </div>
      <div v-if="!logs.length" class="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-10 text-center">
        <p class="text-sm font-medium text-slate-400">Aucun transfert enregistre pour le moment.</p>
      </div>
    </section>
  </AppLayout>
</template>
