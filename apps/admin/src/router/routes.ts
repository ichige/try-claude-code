import type { RouteRecordRaw } from 'vue-router'

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [{ path: '', component: () => import('pages/IndexPage.vue') }],
  },

  {
    path: '/unauthorized',
    name: 'unauthorized',
    meta: { public: true, errorStatus: 401, errorMessage: 'アクセスが許可されていません' },
    component: () => import('pages/ErrorPage.vue'),
  },
  {
    path: '/error',
    name: 'error',
    meta: { public: true, errorStatus: 500, errorMessage: 'サーバーエラーが発生しました' },
    component: () => import('pages/ErrorPage.vue'),
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    name: 'fallback',
    meta: { public: true, errorStatus: 404, errorMessage: 'ページが見つかりません' },
    component: () => import('pages/ErrorPage.vue'),
  },
]

export default routes
