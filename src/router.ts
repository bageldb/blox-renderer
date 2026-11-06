import { createRouter as _createRouter, createWebHistory, createMemoryHistory } from 'vue-router'
import { CmsPageView } from '@bagelink/blox'
import Layout from '@/components/Layout.vue'

export function createRouter(mode: 'web' | 'memory' = 'web', _initialUrl?: string) {
	const history = mode === 'memory'
		? createMemoryHistory()
		: createWebHistory(import.meta.env.BASE_URL)

	const router = _createRouter({
		history,
		routes: [
			{
				path: '/',
				name: 'layout',
				component: Layout,
				children: [
					{ path: '', name: 'home', component: CmsPageView },
					{ path: ':pathMatch(.*)*', name: 'page', component: CmsPageView },
				],
			},
		],
		scrollBehavior() {
			return { top: 0 }
		},
	})

	return router
}

export default createRouter()
