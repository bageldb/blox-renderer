/**
 * Client entry — dev + hydration after SSG.
 */
import { ref } from 'vue'
import { createBloxApp } from '@bagelink/blox'
import { readProvidedTheme, SITE_THEME_KEY } from '@/theme'
import { BagelVue, RouterWrapper } from '@bagelink/vue'

import '@bagelink/vue/styles/core.css'
import '@bagelink/blox/style.css'
import '@/styles/main.css'
import '@/styles/playworks.css'

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
		app.provide(SITE_THEME_KEY, ref(readProvidedTheme(app)))
	},
})
