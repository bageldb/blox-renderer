import { ref, type App } from 'vue'
import { BLOCK_MODULES_KEY, sharedBlockModules, type BlockModules } from './blocks'
import { readProvidedTheme, SITE_THEME_KEY } from './theme'

/** Use the same composed modules in createBloxApp/createBloxSSREntry and preview. */
export function setupSiteApp(app: App, modules: BlockModules = sharedBlockModules): void {
	app.provide(BLOCK_MODULES_KEY, modules)
	app.provide(SITE_THEME_KEY, ref(readProvidedTheme(app)))
}
