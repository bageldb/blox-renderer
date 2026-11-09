import type { App, InjectionKey, Ref } from 'vue'

export interface SiteThemeProps {
	accent?: string
	bg?: string
	ink?: string
	muted?: string
	surface?: string
	surface_ink?: string
	font_display?: string
	font_body?: string
	radius?: string
	gradient?: string
	highlight?: string
	btn?: string
	btn_ink?: string
	header?: string
}

export const SITE_THEME_KEY: InjectionKey<Ref<SiteThemeProps | null>> = Symbol('blox-renderer:site-theme')

export function themeFromContexts(contexts: { $website?: Record<string, unknown> | null } | null | undefined): SiteThemeProps | null {
	const blocks = contexts?.$website?.global_blocks
	if (!blocks || typeof blocks !== 'object') return null
	if (Array.isArray(blocks)) {
		const row = blocks.find((block) =>
			!!block && typeof block === 'object' && (block as { type?: string }).type === 'SiteTheme',
		) as { props?: SiteThemeProps } | undefined
		return row?.props && typeof row.props === 'object' ? row.props : null
	}
	const theme = (blocks as Record<string, SiteThemeProps>).SiteTheme
	return theme && typeof theme === 'object' ? theme : null
}

/** Read the site theme from the SSR page already provided on the app. */
export function readProvidedTheme(app: App): SiteThemeProps | null {
	const provides = (app as unknown as { _context?: { provides?: object } })._context?.provides
	if (!provides) return null
	for (const key of Reflect.ownKeys(provides)) {
		const value = Reflect.get(provides, key) as { resolved?: { contexts?: { $website?: Record<string, unknown> | null } } } | null
		if (!value || typeof value !== 'object' || !('resolved' in value)) continue
		const theme = themeFromContexts(value.resolved?.contexts)
		if (theme) return theme
	}
	return null
}

export function themeCss(theme: SiteThemeProps): string {
	const vars: Record<string, string> = {
		'--bgl-primary': theme.accent || '#d95f2b',
		'--bgl-bg': theme.bg || '#161310',
		'--bgl-font-color': theme.ink || '#f3ece2',
		'--bgl-muted': theme.muted || '#a89c8e',
		'--bgl-font-display': theme.font_display || "'Fraunces', Georgia, serif",
		'--bgl-font': theme.font_body || "'Hanken Grotesk', system-ui, sans-serif",
		'--bgl-surface': theme.surface || '#201a16',
		'--bgl-surface-ink': theme.surface_ink || '#f4ede2',
		'--bgl-card-border-radius': theme.radius || '20px',
		'--bgl-btn-border-radius': theme.radius || '20px',
		'--bgl-input-border-radius': theme.radius || '12px',
		'--bgl-btn-bg': theme.btn || theme.accent || '#1c1917',
		'--bgl-btn-color': theme.btn_ink || '#ffffff',
		'--bgl-highlight': theme.highlight || theme.accent || '#d95f2b',
		'--bgl-gradient': theme.gradient || 'none',
	}
	return `:root{${Object.entries(vars).map(([key, value]) => `${key}:${value};`).join('')}}`
}
