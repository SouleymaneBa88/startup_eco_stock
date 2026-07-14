<script setup>
import { computed, onMounted, reactive, ref } from 'vue';
import AppLayout from '@/components/AppLayout.vue';
import api from '@/services/api';

// Les entrepots viennent de l'API Django.
// Le modele backend utilise les champs : nom, localisation, capacite.
const warehouseList = ref([]);
const isModalOpen = ref(false);
const editingWarehouseId = ref(null);

const emptyForm = {
  nom: '',
  localisation: '',
  capacite: 0,
};

const form = reactive({ ...emptyForm });
const modalTitle = computed(() => (editingWarehouseId.value ? "Modifier l'entrepot" : 'Ajouter un entrepot'));

// Charge les entrepots affiches dans la grille.
async function fetchWarehouses() {
  try {
    const response = await api.get('warehouses/');
    warehouseList.value = response.data;
  } catch (error) {
    console.error('Erreur recuperation entrepots :', error.response?.data || error);
  }
}

onMounted(() => {
  fetchWarehouses();
});

function resetForm() {
  Object.assign(form, emptyForm);
  editingWarehouseId.value = null;
}

function openCreateModal() {
  resetForm();
  isModalOpen.value = true;
}

function openEditModal(warehouse) {
  Object.assign(form, {
    nom: warehouse.nom || '',
    localisation: warehouse.localisation || '',
    capacite: warehouse.capacite || 0,
  });
  editingWarehouseId.value = warehouse.id;
  isModalOpen.value = true;
}

function closeModal() {
  isModalOpen.value = false;
  resetForm();
}

function buildWarehousePayload() {
  return {
    nom: form.nom.trim(),
    localisation: form.localisation.trim(),
    capacite: Number(form.capacite),
  };
}

// Cree ou modifie un entrepot dans Django, puis recharge la liste.
async function saveWarehouse() {
  const payload = buildWarehousePayload();

  try {
    if (editingWarehouseId.value) {
      await api.put(`warehouses/${editingWarehouseId.value}/`, payload);
    } else {
      await api.post('warehouses/', payload);
    }

    closeModal();
    fetchWarehouses();
  } catch (error) {
    console.error('Erreur sauvegarde entrepot :', error.response?.data || error);
  }
}

async function deleteWarehouse(warehouseId) {
  try {
    await api.delete(`warehouses/${warehouseId}/`);
    warehouseList.value = warehouseList.value.filter((warehouse) => warehouse.id !== warehouseId);
  } catch (error) {
    console.error('Erreur suppression entrepot :', error.response?.data || error);
  }
}

function capacityColor(capacity) {
  if (capacity >= 90) return 'bg-red-500';
  if (capacity >= 70) return 'bg-amber-500';
  return 'bg-emerald-600';
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
    <section class="relative mb-6 overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 p-6 text-white shadow-lg shadow-emerald-900/10 sm:p-8">
      <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.08)_1px,transparent_0)] bg-[size:22px_22px]"></div>
      <div class="relative flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <p class="text-sm font-medium text-emerald-100/80">Reseau logistique</p>
          <h1 class="mt-1 text-3xl font-bold">Entrepots</h1>
          <p class="mt-1 text-emerald-50/90">Gerez les sites, localisations et capacites.</p>
        </div>
        <button type="button" class="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-emerald-700 shadow-md transition hover:bg-emerald-50 active:scale-[0.98]" @click="openCreateModal">
          <svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Ajouter un entrepot
        </button>
      </div>
    </section>

    <section>
      <div class="mb-4 flex items-center justify-between">
        <h2 class="text-lg font-bold text-slate-950">Tous les entrepots</h2>
        <span class="text-sm text-slate-400">{{ warehouseList.length }} sites</span>
      </div>

      <div class="grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
        <article v-for="warehouse in warehouseList" :key="warehouse.id" class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md">
          <div class="flex items-start justify-between gap-3">
            <RouterLink :to="`/warehouses/${warehouse.id}`" class="min-w-0">
              <h3 class="truncate text-lg font-bold text-slate-950 hover:text-emerald-700">Nom: {{ warehouse.nom }}</h3>
              <p class="mt-1 truncate text-sm text-slate-500">Localisation: {{ warehouse.localisation }}  {{warehouse.id}}</p>
            </RouterLink>
            <span class="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-emerald-100 text-xs font-bold text-emerald-700">
              {{ initials(warehouse.nom) }}
            </span>
          </div>

          <div class="mt-5">
            <div class="mb-1.5 flex items-center justify-between text-xs font-semibold text-slate-500">
              <span>Capacite</span>
              <span class="text-slate-900">{{ warehouse.capacite }}</span>
            </div>
            <div class="h-2 overflow-hidden rounded-full bg-slate-100">
              <div class="h-2 rounded-full transition-all duration-500" :class="capacityColor(warehouse.capacite)" :style="{ width: `${Math.min(warehouse.capacite, 100)}%` }"></div>
            </div>
          </div>

          <div class="mt-5 flex justify-end gap-2">
            <button type="button" class="rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600 hover:border-emerald-200 hover:text-emerald-700" @click="openEditModal(warehouse)">Modifier</button>
            <button type="button" class="rounded-lg border border-red-100 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50" @click="deleteWarehouse(warehouse.id)">Supprimer</button>
          </div>
        </article>
      </div>
    </section>

    <div v-if="isModalOpen" class="fixed inset-0 z-50 grid place-items-center bg-slate-950/40 p-4">
      <form class="w-full max-w-xl rounded-2xl bg-white p-6 shadow-2xl" @submit.prevent="saveWarehouse">
        <div class="flex items-start justify-between gap-4">
          <div>
            <h2 class="text-xl font-bold text-slate-950">{{ modalTitle }}</h2>
            <p class="mt-1 text-sm text-slate-500">Renseignez les informations de l'entrepot.</p>
          </div>
          <button type="button" class="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700" @click="closeModal">x</button>
        </div>

        <div class="mt-6 grid gap-4 sm:grid-cols-2">
          <label class="text-sm font-semibold text-slate-700">Nom<input v-model="form.nom" required class="form-input" /></label>
          <label class="text-sm font-semibold text-slate-700">Localisation<input v-model="form.localisation" required class="form-input" /></label>
          <label class="text-sm font-semibold text-slate-700">Capacite<input v-model.number="form.capacite" required min="0" type="number" class="form-input" /></label>
        </div>

        <div class="mt-6 flex justify-end gap-3">
          <button type="button" class="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50" @click="closeModal">Annuler</button>
          <button type="submit" class="btn-primary">{{ editingWarehouseId ? 'Enregistrer' : 'Ajouter' }}</button>
        </div>
      </form>
    </div>
  </AppLayout>
</template>
