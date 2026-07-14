<script setup>
import { computed, onMounted, reactive, ref } from 'vue';
import AppLayout from '@/components/AppLayout.vue';
import api from '@/services/api';

// Les produits et entrepots viennent de l'API Django.
// Le modele backend utilise ces champs : nom, quantite, date_expiration, etat, warehouse.
const productList = ref([]);
const warehouseList = ref([]);
const isModalOpen = ref(false);
const editingProductId = ref(null);

// Valeurs par defaut du formulaire d'ajout/modification.
// warehouse attend l'ID numerique de l'entrepot Django.
const emptyForm = {
  nom: '',
  warehouse: '',
  quantite: 0,
  date_expiration: '',
  etat: 'disponible',
};

const form = reactive({ ...emptyForm });

const modalTitle = computed(() => (editingProductId.value ? 'Modifier le produit' : 'Ajouter un produit'));

// Charge la liste affichee dans les cartes produits.
// Endpoint Django : GET /api/products/
async function fetchProducts() {
  try {
    const response = await api.get('products/');
    productList.value = response.data;
  } catch (error) {
    console.error('Erreur recuperation produits :', error.response?.data || error);
  }
}

// Charge les entrepots pour traduire l'ID warehouse d'un produit en nom lisible.
// Le formulaire garde volontairement un input ID, mais la liste affiche le nom.
async function fetchWarehouses() {
  try {
    const response = await api.get('warehouses/');
    warehouseList.value = response.data;
  } catch (error) {
    console.error('Erreur recuperation entrepots :', error.response?.data || error);
  }
}

// Premier chargement de la page : produits + entrepots.
onMounted(() => {
  fetchProducts();
  fetchWarehouses();
});

// Remet le formulaire a vide et quitte le mode edition.
function resetForm() {
  Object.assign(form, emptyForm);
  editingProductId.value = null;
}

// Ouvre le modal en mode creation.
function openCreateModal() {
  resetForm();
  isModalOpen.value = true;
}

// Ouvre le modal en mode edition avec les valeurs du produit selectionne.
function openEditModal(product) {
  Object.assign(form, {
    nom: product.nom || '',
    warehouse: product.warehouse || '',
    quantite: product.quantite || 0,
    date_expiration: product.date_expiration || '',
    etat: product.etat || 'disponible',
  });
  editingProductId.value = product.id;
  isModalOpen.value = true;
}

// Ferme le modal et nettoie le formulaire pour la prochaine utilisation.
function closeModal() {
  isModalOpen.value = false;
  resetForm();
}

// Prepare le payload exactement dans le format attendu par le serializer Django.
function buildProductPayload() {
  return {
    nom: form.nom.trim(),
    warehouse: form.warehouse,
    quantite: Number(form.quantite),
    date_expiration: form.date_expiration,
    etat: form.etat,
  };
}

// Cree ou modifie un produit selon la presence de editingProductId.
// Apres sauvegarde, on recharge depuis l'API pour garder l'interface synchronisee.
async function saveProduct() {
  const payload = buildProductPayload();

  try {
    if (editingProductId.value) {
      await api.put(`products/${editingProductId.value}/`, payload);
    } else {
      await api.post('products/', payload);
    }

    closeModal();
    fetchProducts();
  } catch (error) {
    console.error('Erreur sauvegarde produit :', error.response?.data || error);
  }
}

// Supprime le produit dans Django puis le retire de l'affichage local.
async function deleteProduct(productId) {
  try {
    await api.delete(`products/${productId}/`);
    productList.value = productList.value.filter((product) => product.id !== productId);
  } catch (error) {
    console.error('Erreur suppression :', error.response?.data || error);
  }
}

// Convertit l'ID d'entrepot du produit en nom affiche dans la carte.
function warehouseName(warehouseId) {
  return warehouseList.value.find((warehouse) => warehouse.id === warehouseId)?.nom || 'Entrepot inconnu';
}

// Retourne les classes Tailwind du badge selon l'etat du produit.
function statusBadge(status) {
  if (status === 'disponible') return 'bg-emerald-50 text-emerald-700';
  if (status === 'reserve') return 'bg-amber-50 text-amber-600';
  return 'bg-red-50 text-red-600';
}

// Traduit les valeurs stockees en base vers un libelle lisible.
function statusLabel(status) {
  if (status === 'disponible') return 'Disponible';
  if (status === 'reserve') return 'Reserve';
  if (status === 'perime') return 'Perime';
  return status || 'Non defini';
}
</script>

<template>
  <AppLayout>
    <!-- En-tete de page avec l'action principale d'ajout. -->
    <section class="relative mb-6 overflow-hidden rounded-2xl bg-gradient-to-br from-emerald-600 via-emerald-700 to-teal-800 p-6 text-white shadow-lg shadow-emerald-900/10 sm:p-8">
      <div class="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_1px_1px,rgba(255,255,255,0.08)_1px,transparent_0)] bg-[size:22px_22px]"></div>
      <div class="relative flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <p class="text-sm font-medium text-emerald-100/80">Inventaire</p>
          <h1 class="mt-1 text-3xl font-bold">Produits</h1>
          <p class="mt-1 text-emerald-50/90">Creez, modifiez et suivez les references disponibles.</p>
        </div>
        <button type="button" class="inline-flex items-center justify-center gap-2 rounded-xl bg-white px-5 py-2.5 text-sm font-bold text-emerald-700 shadow-md transition hover:bg-emerald-50 active:scale-[0.98]" @click="openCreateModal">
          <svg class="h-4 w-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Ajouter un produit
        </button>
      </div>
    </section>

    <!-- Liste des produits retournes par l'API Django. -->
    <section>
      <div class="mb-4 flex items-center justify-between">
        <h2 class="text-lg font-bold text-slate-950">Tous les produits</h2>
        <span class="text-sm text-slate-400">{{ productList.length }} references</span>
      </div>

      <div class="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <article v-for="product in productList" :key="product.id" class="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-emerald-200 hover:shadow-md">
          <div class="flex items-start justify-between gap-3">
            <RouterLink :to="`/products/${product.id}`" class="min-w-0">
              <p class="truncate text-base font-bold text-slate-950 hover:text-emerald-700">Nom: {{ product.nom }}</p>
              <p class="mt-1 text-xs font-medium text-slate-400">Expiration : {{ product.date_expiration }}</p>
            </RouterLink>
            <span class="shrink-0 rounded-full px-2.5 py-1 text-xs font-bold" :class="statusBadge(product.etat)">
              {{ statusLabel(product.etat) }}
            </span>
          </div>

          <div class="mt-4 space-y-2 text-sm text-slate-500">
            <p>Entrepot: {{ warehouseName(product.warehouse) }}</p>
            <p>Quantite: {{ product.quantite }} unites en stock</p>
          </div>

          <div class="mt-5 flex items-center justify-end border-t border-slate-100 pt-4">
            <div class="flex gap-2">
              <button type="button" class="rounded-lg border border-slate-200 px-3 py-2 text-xs font-bold text-slate-600 hover:border-emerald-200 hover:text-emerald-700" @click="openEditModal(product)">Modifier</button>
              <button type="button" class="rounded-lg border border-red-100 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50" @click="deleteProduct(product.id)">Supprimer</button>
            </div>
          </div>
        </article>
      </div>
    </section>

    <!-- Modal partage par la creation et la modification d'un produit. -->
    <div v-if="isModalOpen" class="fixed inset-0 z-50 grid place-items-center bg-slate-950/40 p-4">
      <form class="w-full max-w-2xl rounded-2xl bg-white p-6 shadow-2xl" @submit.prevent="saveProduct">
        <div class="flex items-start justify-between gap-4">
          <div>
            <h2 class="text-xl font-bold text-slate-950">{{ modalTitle }}</h2>
            <p class="mt-1 text-sm text-slate-500">Renseignez les informations de stock.</p>
          </div>
          <button type="button" class="rounded-lg p-2 text-slate-400 hover:bg-slate-100 hover:text-slate-700" @click="closeModal">x</button>
        </div>

        <div class="mt-6 grid gap-4 sm:grid-cols-2">
          <label class="text-sm font-semibold text-slate-700">Nom<input v-model="form.nom" required class="form-input" /></label>
          <label class="text-sm font-semibold text-slate-700">ID entrepot<input v-model.number="form.warehouse" required min="1" type="number" class="form-input" /></label>
          <label class="text-sm font-semibold text-slate-700">Quantite<input v-model.number="form.quantite" required min="0" type="number" class="form-input" /></label>
          <label class="text-sm font-semibold text-slate-700">Date expiration<input v-model="form.date_expiration" required type="date" class="form-input" /></label>
          <label class="text-sm font-semibold text-slate-700">Statut<select v-model="form.etat" class="form-input"><option value="disponible">Disponible</option><option value="reserve">Reserve</option><option value="perime">Perime</option></select></label>
        </div>

        <div class="mt-6 flex justify-end gap-3">
          <button type="button" class="rounded-lg border border-slate-200 px-4 py-2.5 text-sm font-bold text-slate-600 hover:bg-slate-50" @click="closeModal">Annuler</button>
          <button type="submit" class="btn-primary">{{ editingProductId ? 'Enregistrer' : 'Ajouter' }}</button>
        </div>
      </form>
    </div>
  </AppLayout>
</template>
