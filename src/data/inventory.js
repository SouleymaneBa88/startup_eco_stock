// Données de démonstration utilisées par toutes les pages.
// Important : ces tableaux sont en mémoire côté navigateur, pas dans une base.
// Quand la page est rechargée, les ajouts/modifications reviennent à ces valeurs.
export const warehouses = [
  {
    id: 'wh-north',
    name: 'North Distribution Hub',
    location: 'Dakar Plateau',
    manager: 'Awa Ndiaye',
    capacity: 78,
    products: 342,
    status: 'Operational',
  },
  {
    id: 'wh-south',
    name: 'Southwest Depot',
    location: 'Mbour Logistics Zone',
    manager: 'Mamadou Fall',
    capacity: 96,
    products: 218,
    status: 'Critical Capacity',
  },
  {
    id: 'wh-east',
    name: 'Eastern Cold Storage',
    location: 'Tambacounda',
    manager: 'Fatou Sarr',
    capacity: 63,
    products: 187,
    status: 'Operational',
  },
];

// Produits disponibles. warehouseId relie chaque produit à un entrepôt.
export const products = [
  {
    id: 'prd-rice',
    name: 'Organic Rice 25kg',
    sku: 'ECO-RIC-25',
    category: 'Food staples',
    warehouseId: 'wh-north',
    quantity: 1280,
    unit: 'bags',
    reorderPoint: 450,
    price: 18500,
    status: 'In stock',
    description: 'Long-grain rice stored for regional food distribution partners.',
  },
  {
    id: 'prd-oil',
    name: 'Sunflower Oil 5L',
    sku: 'ECO-OIL-5L',
    category: 'Cooking supplies',
    warehouseId: 'wh-south',
    quantity: 310,
    unit: 'cartons',
    reorderPoint: 350,
    price: 9200,
    status: 'Low stock',
    description: 'Shelf-stable oil cartons used for household supply kits.',
  },
  {
    id: 'prd-beans',
    name: 'Red Beans 10kg',
    sku: 'ECO-BEA-10',
    category: 'Food staples',
    warehouseId: 'wh-east',
    quantity: 870,
    unit: 'sacks',
    reorderPoint: 300,
    price: 7600,
    status: 'In stock',
    description: 'Protein-rich dry beans tracked by batch and warehouse location.',
  },
  {
    id: 'prd-kit',
    name: 'Emergency Meal Kit',
    sku: 'ECO-KIT-EM',
    category: 'Relief kits',
    warehouseId: 'wh-north',
    quantity: 145,
    unit: 'kits',
    reorderPoint: 200,
    price: 24500,
    status: 'Reorder',
    description: 'Prepared emergency kit containing grains, oil, beans and hygiene basics.',
  },
];

// Journal d'audit partagé par le dashboard et la page Audit.
export const auditLogs = [
  {
    id: 'AUD-1042',
    action: 'Stock counted',
    target: 'Organic Rice 25kg',
    warehouse: 'North Distribution Hub',
    actor: 'Awa Ndiaye',
    date: '2026-07-06',
    status: 'Validated',
  },
  {
    id: 'AUD-1041',
    action: 'Capacity alert',
    target: 'Southwest Depot',
    warehouse: 'Southwest Depot',
    actor: 'System',
    date: '2026-07-05',
    status: 'Review',
  },
  {
    id: 'AUD-1040',
    action: 'Product transfer',
    target: 'Emergency Meal Kit',
    warehouse: 'North Distribution Hub',
    actor: 'Mamadou Fall',
    date: '2026-07-04',
    status: 'Validated',
  },
];

// Helpers centralisés pour éviter de répéter les find() dans les vues.
export function getWarehouseById(id) {
  return warehouses.find((warehouse) => warehouse.id === id);
}

export function getProductById(id) {
  return products.find((product) => product.id === id);
}

// Affiche un nom lisible même si l'id d'entrepôt est absent ou incorrect.
export function getWarehouseName(id) {
  return getWarehouseById(id)?.name || 'Unknown warehouse';
}
