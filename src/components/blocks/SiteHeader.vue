<script setup lang="ts">
import { computed, onMounted, onUnmounted, ref } from 'vue'
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
const open = ref(false)
const scrolled = ref(false)
let onScroll: (() => void) | null = null
onMounted(() => {
	onScroll = () => { scrolled.value = window.scrollY > 24 }
	onScroll()
	window.addEventListener('scroll', onScroll, { passive: true })
})
onUnmounted(() => { if (onScroll) window.removeEventListener('scroll', onScroll) })
</script>

<template>
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
