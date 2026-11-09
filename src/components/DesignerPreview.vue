<script setup lang="ts">
import type { Block } from '@bagelink/blox'
import {
	BLOX_RUNTIME_KEY,
	resolveBlockProps,
	sendToEditor,
	useLocale,
} from '@bagelink/blox'
import { nextTick, onMounted, onUnmounted, provide, ref } from 'vue'
import SiteThemeStyle from '@/components/SiteThemeStyle.vue'

interface BlockMeta {
	name?: string
	label?: string
	description?: string
	icon?: string
	schema?: unknown
	defaults?: Record<string, unknown>
	dataSource?: unknown
	category?: string
	thumbnail?: string
	order?: number
	pickerHidden?: boolean
	global?: boolean
}

const modules = import.meta.glob('./blocks/*.vue', { eager: true }) as Record<string, Record<string, unknown>>

function buildRegistry() {
	const registry: Record<string, { component: unknown, schema: Record<string, unknown> }> = {}
	for (const mod of Object.values(modules)) {
		if (!mod?.default) continue
		for (const [key, value] of Object.entries(mod)) {
			if (key === 'default' || !value || typeof value !== 'object' || !('label' in value)) continue
			const meta = value as BlockMeta
			registry[meta.name ?? key] = {
				component: mod.default,
				schema: {
					label: meta.label,
					description: meta.description,
					icon: meta.icon,
					fields: meta.schema,
					defaults: meta.defaults,
					dataSource: meta.dataSource,
					category: meta.category,
					thumbnail: meta.thumbnail,
					order: meta.order,
					pickerHidden: meta.pickerHidden,
					global: meta.global,
				},
			}
			break
		}
	}
	return registry
}

const registry = buildRegistry()
const { setLocale } = useLocale()

const blocks = ref<Block[]>([])
const contexts = ref<Record<string, Record<string, unknown> | null>>({})
const selectedIndex = ref<number | null>(null)
const hoveredIndex = ref<number | null>(null)
const globalBlockTypes = ref<string[]>([])
const localHovered = ref<number | null>(null)
const runtimeLoading = ref(true)

provide('contexts', contexts)
provide(BLOX_RUNTIME_KEY, { isPreview: ref(true), loading: runtimeLoading })

const REGULAR = { solid: '#6366f1', rgb: '99, 102, 241' }
const GLOBAL = { solid: '#f59e0b', rgb: '245, 158, 11' }

function rendered() {
	return blocks.value.map((block, index) => ({ block, index }))
}

function readyPayload() {
	return {
		type: 'BLOX_READY' as const,
		registry: Object.fromEntries(Object.entries(registry).map(([key, def]) => [key, def.schema])),
	}
}

function onMessage(event: MessageEvent) {
	const msg = event.data
	if (!msg || typeof msg !== 'object') return
	switch (msg.type) {
		case 'BLOX_INIT':
			blocks.value = msg.page?.page?.content?.blocks ?? []
			contexts.value = msg.page?.contexts ?? {}
			setLocale(msg.locale)
			runtimeLoading.value = false
			break
		case 'BLOX_SET_LOCALE':
			setLocale(msg.locale)
			break
		case 'BLOX_SET_BLOCKS':
			blocks.value = msg.blocks ?? []
			break
		case 'BLOX_SELECT_BLOCK':
			selectedIndex.value = msg.index
			if (msg.index !== null) {
				nextTick(() => {
					const el = document.querySelector(`[data-blox-index="${msg.index}"]`)
					if (!el) return
					const top = el.getBoundingClientRect().top + window.scrollY - 72
					window.scrollTo({ top: Math.max(0, top), behavior: 'smooth' })
				})
			}
			break
		case 'BLOX_HOVER_BLOCK':
			hoveredIndex.value = msg.index
			break
		case 'BLOX_SET_GLOBAL_BLOCKS':
			globalBlockTypes.value = msg.types ?? []
			break
		case 'BLOX_SCROLL_TOP':
			window.scrollTo(0, 0)
			break
	}
}

function selectBlock(index: number | null) {
	if (index === null) return
	sendToEditor({ type: 'BLOX_BLOCK_CLICK', index })
}

function hoverBlock(index: number | null) {
	localHovered.value = index
	sendToEditor({ type: 'BLOX_BLOCK_HOVER', index })
}

function blockNavigation(event: MouseEvent) {
	const anchor = (event.target as HTMLElement | null)?.closest('a')
	if (anchor && (anchor.getAttribute('href') || anchor.hasAttribute('target'))) event.preventDefault()
}

let heightObserver: ResizeObserver | null = null
let stopReady: (() => void) | undefined

onMounted(() => {
	window.addEventListener('message', onMessage)
	document.addEventListener('click', blockNavigation, true)
	document.addEventListener('submit', (event) => event.preventDefault(), true)
	window.addEventListener('beforeunload', (event) => event.preventDefault())
	heightObserver = new ResizeObserver(() => {
		sendToEditor({ type: 'BLOX_HEIGHT', height: document.body.scrollHeight })
	})
	heightObserver.observe(document.body)
	let attempts = 0
	const timer = window.setInterval(() => {
		if (attempts >= 20) return stop()
		attempts += 1
		sendToEditor(readyPayload())
	}, 500)
	function stop() {
		window.clearInterval(timer)
		window.removeEventListener('message', onInit)
	}
	function onInit(event: MessageEvent) {
		if (event.data?.type === 'BLOX_INIT') stop()
	}
	window.addEventListener('message', onInit)
	sendToEditor(readyPayload())
	stopReady = stop
})

onUnmounted(() => {
	stopReady?.()
	window.removeEventListener('message', onMessage)
	heightObserver?.disconnect()
})
</script>

<template>
	<div class="blox-preview-root">
		<SiteThemeStyle />
		<div class="blox-preview-canvas">
			<template v-for="item in rendered()" :key="item.index ?? item.block.type">
				<div
					v-if="registry[item.block.type]"
					class="blox-preview-block"
					:class="{ 'is-nav': item.block.type === 'SiteHeader' }"
					:data-blox-index="item.index"
					:style="{
						'--blox-rgb': globalBlockTypes.includes(item.block.type) ? GLOBAL.rgb : REGULAR.rgb,
						'--blox-solid': globalBlockTypes.includes(item.block.type) ? GLOBAL.solid : REGULAR.solid,
					}"
					@click="selectBlock(item.index)"
					@contextmenu.prevent="item.index !== null && sendToEditor({ type: 'BLOX_BLOCK_CONTEXTMENU', index: item.index, x: $event.clientX, y: $event.clientY })"
					@mouseenter="hoverBlock(item.index)"
					@mouseleave="hoverBlock(null)"
				>
					<component
						:is="registry[item.block.type].component"
						v-bind="resolveBlockProps(item.block, registry[item.block.type].schema.defaults as Record<string, unknown> | undefined, contexts)"
					/>
					<div
						class="blox-preview-overlay"
						:class="{
							'is-selected': item.index !== null && selectedIndex === item.index,
							'is-hovered': item.index !== null && (hoveredIndex === item.index || localHovered === item.index) && selectedIndex !== item.index,
						}"
					/>
					<div
						v-if="item.index !== null && (selectedIndex === item.index || hoveredIndex === item.index || localHovered === item.index)"
						class="blox-preview-label"
						:class="{ 'is-selected': selectedIndex === item.index }"
					>
						{{ registry[item.block.type].schema.label }}
					</div>
				</div>
			</template>
		</div>
	</div>
</template>

<style>
* { box-sizing: border-box; }
body { margin: 0; }
.blox-preview-block { position: relative; z-index: 0; cursor: pointer; }
.blox-preview-block.is-nav { z-index: 30; }
.blox-preview-block.is-nav .blox-preview-overlay,
.blox-preview-block.is-nav .blox-preview-label { height: 60px; bottom: auto; }
.blox-preview-overlay {
	position: absolute;
	inset: 0;
	z-index: 2147483646;
	pointer-events: auto;
	background: transparent;
}
.blox-preview-overlay.is-selected { box-shadow: inset 0 0 0 3px var(--blox-solid); background: rgba(var(--blox-rgb), 0.06); }
.blox-preview-overlay.is-hovered { box-shadow: inset 0 0 0 2px rgba(var(--blox-rgb), 0.5); background: rgba(var(--blox-rgb), 0.04); }
.blox-preview-label {
	position: absolute;
	top: 0;
	left: 0;
	z-index: 2147483647;
	padding: 2px 8px;
	font: 600 11px/20px system-ui, sans-serif;
	letter-spacing: 0.02em;
	text-transform: uppercase;
	pointer-events: none;
	color: var(--blox-solid, #6366f1);
	background: rgba(var(--blox-rgb, 99, 102, 241), 0.12);
}
.blox-preview-label.is-selected { color: #fff; background: var(--blox-solid, #6366f1); }
</style>
