<script setup lang="ts">
import { computed, h, onMounted, onUnmounted, ref } from 'vue'
import { defineBlock, useGlobalBlock } from '@bagelink/blox'
import { Btn, Icon, defineSchema, $ } from '@bagelink/vue'

interface Link { label: string; to: string }
interface Content { brand?: string; links?: any[] }

// Accept both {label,to} and {title,href} link shapes the agent may emit.
function normalizeLink(l: any): Link {
	if (!l) return { label: '', to: '' }
	return { label: l.label ?? l.title ?? '', to: l.to ?? l.href ?? '#' }
}
const links = computed(() => (data.value?.links ?? []).map(normalizeLink).filter((l) => l.label))
interface Theme { accent?: string; bg?: string; ink?: string; muted?: string; surface?: string; surface_ink?: string; font_display?: string; font_body?: string; radius?: string; gradient?: string; highlight?: string; btn?: string; btn_ink?: string; header?: string }
interface HeaderContent extends Content { cta_label?: string; cta_href?: string }

const schema = defineSchema({
	brand: $.text('Brand'),
	links: $.array('Links', defineSchema({
		label: $.text('Label'),
		to: $.text('Link'),
	}), { collapsible: true, allowReorder: true }),
	cta_label: $.text('Button'),
	cta_href: $.text('Button link'),
})

defineBlock({
	name: 'SiteHeader',
	label: 'Header',
	icon: 'menu',
	category: 'layout',
	description: 'Site navigation, shared by every page.',
	schema,
	defaults: { brand: '', links: [] },
	global: true,
})

const fallback: Content = {
	brand: '',
	links: [],
}
const { data } = useGlobalBlock<HeaderContent>('SiteHeader')
const { data: themeData } = useGlobalBlock<Theme>('SiteTheme')
const open = ref(false)
const scrolled = ref(false)
let onScroll: (() => void) | null = null
onMounted(() => {
	onScroll = () => { scrolled.value = window.scrollY > 24 }
	onScroll()
	window.addEventListener('scroll', onScroll, { passive: true })
})
onUnmounted(() => { if (onScroll) window.removeEventListener('scroll', onScroll) })

// Emit the site theme as CSS variables on :root. This runs only when the page
// actually includes the header block.
const themeCss = computed(() => {
	const t = themeData.value || {}
	const vars: Record<string, string> = {
		'--bgl-primary': t.accent || '#d95f2b',
		'--bgl-bg': t.bg || '#161310',
		'--bgl-font-color': t.ink || '#f3ece2',
		'--bgl-muted': t.muted || '#a89c8e',
		'--bgl-font-display': t.font_display || "'Fraunces', Georgia, serif",
		'--bgl-font': t.font_body || "'Hanken Grotesk', system-ui, sans-serif",
		'--bgl-surface': t.surface || '#201a16',
		'--bgl-surface-ink': t.surface_ink || '#f4ede2',
		'--bgl-card-border-radius': t.radius || '20px',
		'--bgl-btn-border-radius': t.radius || '20px',
		'--bgl-input-border-radius': t.radius || '12px',
		'--bgl-btn-bg': t.btn || t.accent || '#1c1917',
		'--bgl-btn-color': t.btn_ink || '#ffffff',
		'--bgl-highlight': t.highlight || t.accent || '#d95f2b',
		'--bgl-gradient': t.gradient || 'none',
	}
	return ':root{' + Object.entries(vars).map(([k, v]) => `${k}:${v};`).join('') + '}'
})

const ThemeStyle = () => h('style', themeCss.value)
</script>

<template>
	<ThemeStyle />
	<div :class="['nav-sticky', scrolled ? 'nav-scrolled' : '']">
		<header>
			<div class="w-1100px mx-auto px-2 m_px-1 h-60px flex align-items-center space-between gap-2">
				<router-link to="/" class="txt-22 decoration-none flex align-items-center" style="letter-spacing: -0.03em">
					<span>{{ data?.brand || fallback.brand }}</span>
				</router-link>
				<nav class="desk-nav gap-1-5 align-items-center" aria-label="Pages">
					<router-link v-for="link in links" :key="link.to" :to="link.to" class="txt14 decoration-none">{{ link.label }}</router-link>
					<Btn v-if="data?.cta_label" size="sm" :value="data.cta_label" :href="data.cta_href || '/'" />
				</nav>
				<Btn class="mob-toggle" flat icon="menu" aria-label="Open menu" @click="open = !open" />
			</div>
			<nav v-if="open" class="px-2 py-1 border-top m_px-1" aria-label="Pages">
				<router-link v-for="link in links" :key="link.to" :to="link.to" class="flex space-between align-items-center py-075 decoration-none border-bottom" @click="open = false">
					<span>{{ link.label }}</span>
					<Icon name="arrow_forward" class="opacity-4" />
				</router-link>
			</nav>
		</header>
	</div>
</template>
