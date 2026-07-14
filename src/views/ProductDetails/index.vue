<script setup>
import { computed, onMounted, reactive, ref } from 'vue';
import { useRoute } from 'vue-router';
import AppLayout from '@/components/AppLayout.vue';
import StatCard from '@/components/StatCard.vue';
import api from '@/services/api';

const route = useRoute();

// La fiche detail utilise les donnees Django, comme la liste produits.
const product = ref(null);
const warehouseList = ref([]);
const isLoading = ref(true);
const isTransferModalOpen = ref(false);
const transferError = ref('');
const transferForm = reactive({
  destination_id: '',
  quantite: 1,
});

const warehouse = computed(() =>
  warehouseList.value.find((item) => item.id === product.value?.warehouse) || null
);

const destinationWarehouses = computed(() =>
  warehouseList.value.filter((item) => item.id !== product.value?.warehouse)
);

async function fetchProduct() {
  isLoading.value = true;

  try {
    const response = await api.get(`products/${route.params.id}/`);
    product.value = response.data;
  } catch (error) {
    console.error('Erreur recuperation produit :', error.response?.data || error);
    product.value = null;
  } finally {
    isLoading.value = false;
  }
}

async function fetchWarehouses() {
  try {
    const response = await api.get('warehouses/');
    warehouseList.value = response.data;
  } catch (error) {
    console.error('Erreur recuperation entrepots :', error.response?.data || error);
  }
}

onMounted(() => {
  fetchProduct();
  fetchWarehouses();
});

function resetTransferForm() {
  transferError.value = '';
  transferForm.destination_id = destinationWarehouses.value[0]?.id || '';
  transferForm.quantite = product.value?.quantite || 1;
}

function openTransferModal() {
  resetTransferForm();
  isTransferModalOpen.value = true;
}

function closeTransferModal() {
  isTransferModalOpen.value = false;
  resetTransferForm();
}

// Appelle l'action DRF : POST /api/products/{id}/transfer_product/
async function transferProduct() {
  transferError.value = '';
   console.log("Début transfert");

  console.log("Produit :", product.value.id);

  console.log("Destination :", transferForm.destination_id);

  console.log("Quantité :", transferForm.quantite);

  try {
    await api.post(`products/${product.value.id}/transfer_product/`, {
      destination_id: transferForm.destination_id,
      quantite: Number(transferForm.quantite),
    });

    closeTransferModal();
    fetchProduct();
  }
  catch (error) {
  console.error(error);

  if (error.response) {
    console.log("Status :", error.response.status);
    console.log("Data :", error.response.data);
  }

  transferError.value =
    error.response?.data?.error ||
    error.response?.data?.detail ||
    "Transfert impossible.";
}
}

function statusBadge(status) {
  if (status === 'disponible') return 'bg-emerald-50 text-emerald-700';
  if (status === 'reserve') return 'bg-amber-50 text-amber-600';
  return 'bg-red-50 text-red-600';
}

function statusLabel(status) {
  if (status === 'disponible') return 'Disponible';
  if (status === 'reserve') return 'Reserve';
  if (status === 'perime') return 'Perime';
  return status || 'Non defini';
}

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
      <p class="font-medium text-slate-500">Chargement du produit...</p>
    </div>

    <div v-else-if="product">
      <RouterLink
        to="/products"
        class="inline-flex items-center gap-1.5 text-sm font-bold text-emerald-700 hover:text-emerald-800"
      >
        <svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
        </svg>
        Retour aux produits
      </RouterLink>

      <section class="relative mt-4 overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 p-6 text-white shadow-lg shadow-emerald-900/10 sm:p-8">
        <div class="pointer-events-none absolute -right-16 -top-16 h-64 w-64 rounded-full bg-white/10 blur-3xl"></div>
        <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.08)_1px,transparent_0)] bg-[size:22px_22px]"></div>

        <div class="relative flex flex-col justify-between gap-6 md:flex-row md:items-start">
          <div class="flex items-start gap-4">
            <span class="grid h-14 w-14 shrink-0 place-items-center rounded-2xl bg-white/15 backdrop-blur-sm">
              <svg class="h-7 w-7" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M21 7.5l-9-5.25L3 7.5m18 0l-9 5.25M21 7.5v9l-9 5.25M3 7.5l9 5.25M3 7.5v9l9 5.25m0-9v9" />
              </svg>
            </span>
            <div>
              <p class="text-xs font-bold uppercase tracking-wide text-emerald-100/70">Produit #{{ product.id }}</p>
              <h1 class="mt-1 text-3xl font-bold">{{ product.nom }}</h1>
              <p class="mt-2 max-w-2xl text-emerald-50/90">Expiration : {{ product.date_expiration }}</p>
            </div>
          </div>

          <span
            class="inline-flex shrink-0 items-center gap-1.5 rounded-full bg-white/15 px-3 py-1.5 text-sm font-bold backdrop-blur-sm"
          >
            <span class="h-1.5 w-1.5 rounded-full bg-emerald-300"></span>
            {{ statusLabel(product.etat) }}
          </span>
        </div>
      </section>

      <section class="mt-6 grid gap-4 md:grid-cols-3">
        <StatCard
          label="Quantite"
          :value="`${product.quantite} unites`"
          helper="Stock actuel"
          icon="box"
          color="emerald"
        />
        <StatCard
          label="Etat"
          :value="statusLabel(product.etat)"
          helper="Statut produit"
          icon="alert"
          color="amber"
        />
        <StatCard
          label="Expiration"
          :value="product.date_expiration"
          helper="Date limite"
          icon="tag"
          color="teal"
        />
      </section>

      <section class="mt-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <div class="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 class="text-lg font-bold text-slate-950">Entrepot assigne</h2>
          <button
            type="button"
            class="inline-flex items-center justify-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-bold text-white shadow-md shadow-emerald-600/20 transition hover:bg-emerald-700 active:scale-[0.98] disabled:cursor-not-allowed disabled:bg-slate-300 disabled:shadow-none"
            :disabled="destinationWarehouses.length === 0 || product.etat === 'perime'"
            @click="openTransferModal"
          >
            <svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h18M16.5 3L21 7.5m0 0L16.5 12M21 7.5H3" />
            </svg>
            Transferer
          </button>
        </div>

        <div v-if="warehouse" class="mt-5 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
          <div class="flex items-center gap-3">
            <span class="grid h-12 w-12 shrink-0 place-items-center rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-600/20">
              <svg class="h-6 w-6" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 21h19.5M3 10.5L12 3l9 7.5M4.5 10.5V21h15V10.5M9 21v-6h6v6" />
              </svg>
            </span>
            <div>
              <RouterLink
                :to="`/warehouses/${warehouse.id}`"
                class="text-base font-bold text-slate-950 hover:text-emerald-700"
              >
                {{ warehouse.nom }}
              </RouterLink>
              <p class="text-sm text-slate-500">{{ warehouse.localisation }}</p>
            </div>
          </div>

          <div class="flex items-center gap-3 rounded-xl bg-slate-50 p-3">
            <span class="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700">
              {{ initials(warehouse.nom) }}
            </span>
            <div>
              <p class="text-sm font-bold text-slate-900">{{ warehouse.capacite }} unites</p>
              <p class="text-xs text-slate-400">Capacite maximale</p>
            </div>
          </div>
        </div>
      </section>

      <div v-if="isTransferModalOpen" class="fixed inset-0 z-50 grid place-items-center bg-slate-950/40 p-4">
        <form class="w-full max-w-lg rounded-2xl bg-white p-6 shadow-2xl" @submit.prevent="transferProduct">
          <div class="flex items-start justify-between gap-4">
            <div>
              <h2 class="text-xl font-bold text-slate-950">Transferer le produit</h2>
              <p class="mt-1 text-sm text-slate-500">{{ product.nom }} sera deplace vers un autre entrepot.</p>
            </div>
            <button type="button" class="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700" @click="closeTransferModal">x</button>
          </div>

          <div class="mt-6 space-y-4">
            <div class="rounded-xl bg-slate-50 p-4">
              <p class="text-xs font-bold uppercase tracking-wide text-slate-400">Origine</p>
              <p class="mt-1 font-bold text-slate-950">{{ warehouse?.nom }}</p>
              <p class="text-sm text-slate-500">{{ warehouse?.localisation }}</p>
            </div>

            <label class="block text-sm font-semibold text-slate-700">
              Destination
              <select v-model="transferForm.destination_id" required class="form-input mt-2">
                <option v-for="item in destinationWarehouses" :key="item.id" :value="item.id">
                  {{ item.nom }} - {{ item.localisation }}
                </option>
              </select>
            </label>

            <label class="block text-sm font-semibold text-slate-700">
              Quantite
              <input v-model.number="transferForm.quantite" required min="1" :max="product.quantite" type="number" class="form-input mt-2" />
            </label>

            <p v-if="transferError" class="rounded-lg bg-red-50 px-3 py-2 text-sm font-semibold text-red-600">
              {{ transferError }}
            </p>
          </div>

          <div class="mt-6 flex justify-end gap-3">
            <button type="button" class="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50" @click="closeTransferModal">Annuler</button>
            <button type="submit" class="btn-primary">Valider le transfert</button>
          </div>
        </form>
      </div>
    </div>

    <div v-else class="rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
      <p class="font-medium text-slate-500">Produit introuvable.</p>
      <RouterLink to="/products" class="mt-3 inline-block text-sm font-bold text-emerald-700 hover:underline">
        Retour aux produits
      </RouterLink>
    </div>
  </AppLayout>
</template>
