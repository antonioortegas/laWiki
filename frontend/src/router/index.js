import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/Home.vue')
  },
  {
    path: '/wiki/:wikiId',
    name: 'WikiPage',
    component: () => import('../views/WikiPage.vue')
  },
  {
    path: '/entry/:entryId',
    name: 'EntryPage',
    component: () => import('../views/EntryPage.vue')
  },
  {
    path: '/entry/:entryId/versions',
    name: 'EntryVersions',
    component: () => import('../views/EntryVersions.vue')
  },
  {
    path: '/profile/:userId',
    name: 'ProfilePage',
    component: () => import('../views/ProfilePage.vue')
  },
  {
    path: '/wiki/new',
    name: 'CreateWiki',
    component: () => import('../views/WikiForm.vue')
  },
  {
    path: '/wiki/:wikiId/edit',
    name: 'EditWiki',
    component: () => import('../views/WikiForm.vue')
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'NotFound',
    component: () => import('../views/NotFound.vue')
  },
  {
    path: '/wiki/:wikiId/entry/new',
    name: 'CreateEntry',
    component: () => import('../views/EntryForm.vue')
  }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
