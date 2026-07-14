import { createRouter, createWebHistory } from 'vue-router';
import DashboardOverview from '../views/DashboardOverview/index.vue';
import LoginPage from '../views/LoginPage/index.vue';
import ProductDetails from '../views/ProductDetails/index.vue';
import ProductsList from '../views/ProductsList/index.vue';
import WarehouseAudit from '../views/WarehouseAudit/index.vue';
import WarehouseDetails from '../views/WarehouseDetails/index.vue';
import WarehousesManagement from '../views/WarehousesManagement/index.vue';
import Singup from '../views/Singup/index.vue';

// Chaque objet associe une URL à une vue Vue.
// Les routes dynamiques (:id) servent aux pages détails produit/entrepôt.
const routes = [
  { path: '/', redirect: 'home' },
  { path: '/login', name: 'login', component: LoginPage },
  { path: '/signup', name: 'signup', component: Singup },
  { path: '/dashboard', name: 'dashboard', component: DashboardOverview },
  { path: '/warehouses', name: 'warehouses', component: WarehousesManagement },
  { path: '/warehouses/:id', name: 'warehouse-details', component: WarehouseDetails },
  { path: '/products', name: 'products', component: ProductsList },
  { path: '/products/:id', name: 'product-details', component: ProductDetails },
  { path: '/move', name: 'move', component: WarehouseAudit },
  { path: '/:pathMatch(.*)*', redirect: '/dashboard' },
];

// createWebHistory donne des URLs propres sans #.
const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
