/**
 * Client entry — dev + hydration after SSG.
 */
import { BLOX_LAYOUT_KEY, createBloxApp } from '@bagelink/blox'
import { BagelVue, RouterWrapper } from '@bagelink/vue'

import '@bagelink/vue/styles/core.css'
import '@bagelink/blox/style.css'
import '@/styles/main.css'

import App from './App.vue'
import router from './router'

const blocks = import.meta.glob('./components/blocks/*.vue', { eager: true })

const websiteName = import.meta.env.VITE_BLOX_WEBSITE_NAME ?? 'blox'

createBloxApp({
	rootComponent: App,
	router,
	modules: blocks as Record<string, any>,
	websiteName,
	store: websiteName,
	apiBaseURL: import.meta.env.VITE_BLOX_API_URL ?? '/api',
	plugins: [[BagelVue, {}]],
	globalComponents: { RouterWrapper },
	setup: (app) => {
		// Prepend SiteHeader / append SiteFooter as page blocks, rendered inside
		// the page contexts provider so their global-block content resolves.
		app.provide(BLOX_LAYOUT_KEY, {
			ensureChrome: true,
			navType: 'SiteHeader',
			footerType: 'SiteFooter',
		})
	},
})
