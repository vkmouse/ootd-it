import { createRouter, createWebHistory } from 'vue-router'
import WardrobeView from '../views/WardrobeView.vue'
import ClothesEditView from '../views/ClothesEditView.vue'
import OutfitsView from '../views/OutfitsView.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      redirect: '/wardrobe',
    },
    {
      path: '/wardrobe',
      name: 'wardrobe',
      component: WardrobeView,
    },
    {
      path: '/wardrobe/new',
      name: 'wardrobe-new',
      component: ClothesEditView,
    },
    {
      path: '/outfits',
      name: 'outfits',
      component: OutfitsView,
    },
  ],
})

export default router
