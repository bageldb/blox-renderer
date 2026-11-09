/**
 * Prerender entry — used by blox-ssg at build time only.
 */
import process from 'node:process'
import { ref } from 'vue'
import { createBloxSSREntry } from '@bagelink/blox/ssg'
import { readProvidedTheme, SITE_THEME_KEY } from '@/theme'
import { BagelVue, RouterWrapper } from '@bagelink/vue'
import App from './App.vue'
import { createRouter } from './router'

import '@bagelink/vue/styles/core.css'
import '@bagelink/blox/style.css'
import '@/styles/main.css'

const blocks = import.meta.glob('./components/blocks/*.vue', { eager: true })

const websiteName = process.env.BLOX_WEBSITE_NAME ?? process.env.WEBSITE_NAME ?? 'blox'

export const { render, prefetchResolve, configureBuildData } = createBloxSSREntry({
	rootComponent: App,
	createRouter,
	modules: blocks as Record<string, any>,
	websiteName,
	store: websiteName,
	locale: 'en',
	supportedLocales: ['en'],
	apiBase: process.env.BLOX_API_URL ?? process.env.BAGELINK_API_URL ?? 'https://api.bagel.to',
	plugins: [[BagelVue, {}]],
	globalComponents: { RouterWrapper },
	setup: (app) => {
		app.provide(SITE_THEME_KEY, ref(readProvidedTheme(app)))
	},
})
