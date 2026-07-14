<script setup>
import { computed, onMounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import AppLayout from '@/components/AppLayout.vue';
import api from '@/services/api';

const route = useRoute();
const warehouse = ref(null);
const warehouseProducts = ref([]);
const audit = ref(null);
const isLoading = ref(true);
const loadError = ref('');

const transfers = computed(() => audit.value?.transferts || []);
const occupancyRate = computed(() => audit.value?.taux_occupation_pourcentage || 0);

// Valeur de secours utilisee si l'endpoint audit n'est pas encore disponible.
// Cela evite d'afficher une page vide alors que le detail de l'entrepot existe.
function buildFallbackAudit(currentWarehouse, products) {
  const currentQuantity = products.reduce((total, product) => total + Number(product.quantite || 0), 0);
  const capacity = Number(currentWarehouse?.capacite || 0);

  return {
    hangar_nom: currentWarehouse?.nom || '',
    capacite_maximale: capacity,
    quantite_actuelle_stockee: currentQuantity,
    taux_occupation_pourcentage: capacity > 0 ? Math.round((currentQuantity / capacity) * 10000) / 100 : 0,
    alerte_produits_perimes: products.filter((product) => product.etat === 'perime'),
    transferts: [],
  };
}

async function fetchWarehouseDetails() {
  isLoading.value = true;
  loadError.value = '';

  try {
    // L'entrepot est l'information principale de la page: s'il charge, la page doit s'afficher.
    const warehouseResponse = await api.get(`warehouses/${route.params.id}/`);
    warehouse.value = warehouseResponse.data;

    try {
      const productsResponse = await api.get(`products/?warehouse=${route.params.id}`);
      warehouseProducts.value = productsResponse.data;
    } catch (error) {
      console.error('Erreur produits de l entrepot :', error.response?.data || error);
      warehouseProducts.value = [];
    }

    try {
      const auditResponse = await api.get(`warehouses/${route.params.id}/audit/`);
      audit.value = auditResponse.data;
    } catch (error) {
      console.error('Erreur audit entrepot :', error.response?.data || error);
      audit.value = buildFallbackAudit(warehouse.value, warehouseProducts.value);
      // loadError.value = "L'audit API est indisponible, les statistiques sont calculees localement.";
    }
  } catch (error) {
    console.error('Erreur detail entrepot :', error.response?.data || error);
    warehouse.value = null;
    loadError.value = "Impossible de charger cet entrepot depuis l'API.";
  } finally {
    isLoading.value = false;
  }
}

onMounted(() => {
  fetchWarehouseDetails();
});

function capacityColor(capacity) {
  if (capacity >= 90) return 'from-red-500 to-red-600';
  if (capacity >= 70) return 'from-amber-400 to-amber-500';
  return 'from-emerald-400 to-teal-500';
}

// Traduit les statuts Django en classes Tailwind lisibles dans les cartes produit.
function productStatusBadge(status) {
  if (status === 'disponible') return 'bg-emerald-50 text-emerald-700';
  if (status === 'reserve') return 'bg-amber-50 text-amber-600';
  return 'bg-red-50 text-red-600';
}

// Garde l'affichage en francais meme si l'API renvoie les valeurs techniques.
function productStatusLabel(status) {
  if (status === 'disponible') return 'Disponible';
  if (status === 'reserve') return 'Reserve';
  if (status === 'perime') return 'Perime';
  return status;
}

// Fabrique un petit avatar texte stable pour l'entrepot.
function initials(name) {
  return name
    ?.split(' ')
    .map((part) => part[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();
}
</script>

<template>
  <AppLayout>
    <div v-if="isLoading" class="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
      <p class="font-medium text-slate-500">Chargement de l'entrepot...</p>
    </div>

    <div v-else-if="warehouse">
      <RouterLink
        to="/warehouses"
        class="inline-flex items-center gap-1.5 text-sm font-bold text-emerald-700 hover:text-emerald-800"
      >
        <svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
        </svg>
        Retour aux entrepôts
      </RouterLink>

      <div v-if="loadError" class="mt-4 rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-semibold text-amber-700">
        {{ loadError }}
      </div>

      <!-- Bannière -->
      <section class="relative mt-4 overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 p-6 text-white shadow-lg shadow-emerald-900/10 sm:p-8">
        <div class="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
        <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.08)_1px,transparent_0)] bg-[size:22px_22px]"></div>

        <div class="relative flex flex-col justify-between gap-6 md:flex-row md:items-start">
          <div class="flex items-start gap-4">
            <span class="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-white/15 backdrop-blur-sm">
              <svg class="h-7 w-7" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 21h19.5M3 10.5L12 3l9 7.5M4.5 10.5V21h15V10.5M9 21v-6h6v6" />
              </svg>
            </span>
            <div>
              <h1 class="text-3xl font-bold">{{ warehouse.nom }}</h1>
              <p class="mt-1 flex flex-wrap items-center gap-x-1.5 text-emerald-50/90">
                <svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M15 10.5a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path stroke-linecap="round" stroke-linejoin="round" d="M19.5 10.5c0 7.142-7.5 11.25-7.5 11.25S4.5 17.642 4.5 10.5a7.5 7.5 0 1115 0z" />
                </svg>
                {{ warehouse.localisation }}
              </p>
            </div>
          </div>

          <span
            class="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-sm font-bold backdrop-blur-sm"
          >
            <span class="h-1.5 w-1.5 rounded-full bg-emerald-300"></span>
            Actif
          </span>
        </div>

        <!-- Capacité -->
        <div class="relative mt-8">
          <div class="mb-2 flex items-end justify-between">
            <span class="text-sm font-semibold text-emerald-50/80">Capacité de stockage</span>
            <span class="text-2xl font-bold">{{ occupancyRate }}%</span>
          </div>
          <div class="h-3 overflow-hidden rounded-full bg-white/15">
            <div
              class="h-3 rounded-full bg-gradient-to-r transition-all duration-500"
              :class="capacityColor(occupancyRate)"
              :style="{ width: `${Math.min(occupancyRate, 100)}%` }"
            ></div>
          </div>
        </div>
      </section>

      <!-- Mini stats -->
      <section class="mt-5 grid gap-4 sm:grid-cols-3">
        <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p class="text-xs font-bold uppercase tracking-wide text-slate-400">Responsable</p>
          <div class="mt-2 flex items-center gap-2.5">
            <span class="grid h-9 w-9 place-items-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700">
              {{ initials(warehouse.nom) }}
            </span>
            <span class="text-sm font-bold text-slate-900">API Eco-Stock</span>
          </div>
        </div>
        <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p class="text-xs font-bold uppercase tracking-wide text-slate-400">Localisation</p>
          <p class="mt-2 text-sm font-bold text-slate-900">{{ warehouse.localisation }}</p>
        </div>
        <div class="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
          <p class="text-xs font-bold uppercase tracking-wide text-slate-400">Stock occupe</p>
          <p class="mt-2 text-sm font-bold text-slate-900">{{ audit?.quantite_actuelle_stockee || 0 }} / {{ warehouse.capacite }} unites</p>
        </div>
      </section>

      <!-- Produits -->
      <section class="mt-6">
        <div class="mb-4 flex items-center justify-between">
          <h2 class="text-lg font-bold text-slate-950">Produits de cet entrepôt</h2>
          <span class="text-sm text-slate-400">{{ warehouseProducts.length }} produits</span>
        </div>

        <div v-if="warehouseProducts.length" class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <RouterLink
            v-for="product in warehouseProducts"
            :key="product.id"
            :to="`/products/${product.id}`"
            class="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition duration-300 hover:-translate-y-1 hover:border-emerald-200 hover:shadow-lg hover:shadow-emerald-900/5"
          >
            <div class="flex items-start justify-between">
              <span class="grid h-11 w-11 place-items-center rounded-xl bg-emerald-50 text-emerald-700">
                <svg class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25M21 7.5v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
                </svg>
              </span>
              <span
                class="inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-bold"
                :class="productStatusBadge(product.etat)"
              >
                <span class="h-1.5 w-1.5 rounded-full bg-current"></span>
                {{ productStatusLabel(product.etat) }}
              </span>
            </div>

            <h3 class="mt-4 text-base font-bold text-slate-950 transition group-hover:text-emerald-700">
              {{ product.nom }}
            </h3>
            <p class="mt-1 text-xs font-medium text-slate-400">Expiration : {{ product.date_expiration }}</p>

            <div class="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
              <span class="text-sm font-bold text-slate-900">{{ product.quantite }} unites</span>
              <svg class="h-4 w-4 text-slate-300 transition group-hover:translate-x-1 group-hover:text-emerald-600" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M17.25 8.25L21 12m0 0l-3.75 3.75M21 12H3" />
              </svg>
            </div>
          </RouterLink>
        </div>

        <div v-else class="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-10 text-center">
          <p class="text-sm font-medium text-slate-400">Aucun produit dans cet entrepôt pour le moment.</p>
        </div>
      </section>

      <section class="mt-6">
        <div class="mb-4 flex items-center justify-between">
          <h2 class="text-lg font-bold text-slate-950">Transferts lies a cet entrepot</h2>
          <span class="text-sm text-slate-400">{{ transfers.length }} mouvement(s)</span>
        </div>

        <div v-if="transfers.length" class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          <article v-for="transfer in transfers" :key="transfer.id" class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <p class="text-base font-bold text-slate-950">{{ transfer.produit_nom }}</p>
            <p class="mt-1 text-sm text-slate-500">{{ transfer.source_nom }} vers {{ transfer.destination_nom }}</p>
            <div class="mt-4 flex items-center justify-between border-t border-slate-100 pt-3">
              <span class="text-sm font-bold text-slate-900">{{ transfer.quantite }} unites</span>
              <span class="text-xs text-slate-400">{{ new Date(transfer.date).toLocaleString() }}</span>
            </div>
          </article>
        </div>

        <div v-else class="rounded-2xl border border-dashed border-slate-200 bg-slate-50 p-10 text-center">
          <p class="text-sm font-medium text-slate-400">Aucun transfert pour cet entrepot.</p>
        </div>
      </section>
    </div>

    <div v-else class="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
      <p class="text-slate-500 font-medium">Entrepôt introuvable.</p>
      <RouterLink to="/warehouses" class="mt-3 inline-block text-sm font-bold text-emerald-700 hover:underline">
        Retour aux entrepôts
      </RouterLink>
    </div>
  </AppLayout>
</template>
