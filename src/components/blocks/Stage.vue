<script setup lang="ts">
import { computed } from 'vue'
import { defineBlock } from '@bagelink/blox'
import { Btn, Icon, defineSchema, $ } from '@bagelink/vue'

interface Metric { label?: string; value?: string; delta?: string }
interface Chip { text?: string }
interface Props {
	treatment?: string
	tone?: string
	kicker?: string
	title?: string
	body?: string
	cta_label?: string
	cta_href?: string
	cta2_label?: string
	cta2_href?: string
	image?: string
	image_alt?: string
	visual?: string
	chips?: any[]
	metrics?: Metric[]
}

const schema = defineSchema<Props>({
	treatment: $.text('Traitement (angle|mesh|poster|split|editorial)'),
	tone: $.text('Ton du texte (light|ink)'),
	kicker: $.text('Kicker'),
	title: $.text('Titre'),
	body: $.textarea('Texte'),
	cta_label: $.text('Bouton'),
	cta_href: $.text('Lien du bouton'),
	cta2_label: $.text('Bouton secondaire'),
	cta2_href: $.text('Lien secondaire'),
	image: $.text('Image'),
	image_alt: $.text('Texte alt'),
	visual: $.text('Visuel (dashboard|image|none)'),
	chips: $.array('Puces', defineSchema({ text: $.text('Texte') }), { collapsible: true, allowReorder: true }),
	metrics: $.array('Mesures', defineSchema({
		label: $.text('Libellé'),
		value: $.text('Valeur'),
		delta: $.text('Variation'),
	}), { collapsible: true, allowReorder: true }),
})

defineBlock({
	name: 'Stage',
	label: 'Scène',
	icon: 'slideshow',
	category: 'hero',
	order: 9,
	description: 'Ouverture de marque : dégradé incliné, halo, affiche, ou éditorial.',
	schema,
	defaults: { treatment: 'angle', visual: 'none' },
})

const props = withDefaults(defineProps<Props>(), {
	treatment: 'angle',
	tone: '',
	visual: 'none',
	chips: () => [],
	metrics: () => [],
})

const treatment = computed(() => (props.treatment || 'angle').toLowerCase())
const light = computed(() => {
	const tone = (props.tone || '').toLowerCase()
	if (tone === 'light') return true
	if (tone === 'ink') return false
	return treatment.value === 'angle' || treatment.value === 'mesh'
})
const showDash = computed(() => (props.visual || '').toLowerCase() === 'dashboard')
const bars = [42, 58, 46, 72, 63, 84, 70, 91, 66, 96, 78, 100]
const nav = [
	['home', 'Home'],
	['payments', 'Payments'],
	['receipt_long', 'Billing'],
	['groups', 'Customers'],
	['bar_chart', 'Reports'],
]

function parts(title?: string) {
	const src = title || ''
	const out: { text: string; em: boolean }[] = []
	const re = /\*([^*]+)\*/g
	let last = 0
	let match: RegExpExecArray | null
	while ((match = re.exec(src))) {
		if (match.index > last) out.push({ text: src.slice(last, match.index), em: false })
		out.push({ text: match[1] || '', em: true })
		last = match.index + match[0].length
	}
	if (last < src.length) out.push({ text: src.slice(last), em: false })
	return out.length ? out : [{ text: src, em: false }]
}
const titleParts = computed(() => parts(props.title))
function chipText(chip: any): string {
	return typeof chip === 'string' ? chip : chip?.text || ''
}
const chipList = computed(() => (props.chips || []).map(chipText).filter(Boolean))
const metricList = computed(() => (props.metrics || []).filter((m) => m?.value))
</script>

<template>
	<section :class="['stage', `stage-${treatment}`, light ? 'stage-light' : '']">
		<div class="stage-ground">
			<div :class="['w-1100px mx-auto px-2 m_px-1', treatment === 'split' || treatment === 'poster' ? 'grid grid-2-col m_grid-wrap-1 gap-3 align-items-center' : 'grid gap-1-5']">
				<div class="grid gap-1-25 m_justify-items-start" :style="treatment === 'editorial' ? 'max-width: 18em' : 'max-width: 40rem'">
					<p v-if="props.kicker" class="stage-kicker m-0">{{ props.kicker }}</p>
					<h1 class="stage-title m-0">
						<template v-for="(part, i) in titleParts" :key="i">
							<em v-if="part.em">{{ part.text }}</em><span v-else>{{ part.text }}</span>
						</template>
					</h1>
					<p v-if="props.body" class="stage-body m-0">{{ props.body }}</p>
					<div class="flex gap-1 flex-wrap pt-05">
						<Btn v-if="props.cta_label" size="lg" :value="props.cta_label" :href="props.cta_href || '/'" />
						<Btn v-if="props.cta2_label" size="lg" outline :class="light ? 'stage-ghost' : ''" :value="props.cta2_label" :href="props.cta2_href || '/'" />
					</div>
					<div v-if="chipList.length" class="flex gap-075 flex-wrap pt-1">
						<span v-for="chip in chipList" :key="chip" class="stage-chip">{{ chip }}</span>
					</div>
				</div>
				<div v-if="(treatment === 'split' || treatment === 'poster') && props.image" :class="treatment === 'poster' ? 'stage-mascot' : 'frame stage-split-frame'">
					<img :src="props.image" :alt="props.image_alt || ''" />
				</div>
			</div>
		</div>

		<figure v-if="treatment === 'editorial' && props.image" class="stage-film">
			<img :src="props.image" :alt="props.image_alt || ''" />
			<figcaption v-if="props.image_alt">{{ props.image_alt }}</figcaption>
		</figure>

		<div v-if="showDash" class="stage-mock-wrap px-2 m_px-1">
			<div class="stage-mock">
				<aside>
					<p class="semi m-0 mb-1">Atlas</p>
					<div v-for="item in nav" :key="item[1]" class="flex gap-075 align-items-center py-05 txt13 opacity-7">
						<Icon :name="item[0]" :size="1.05" />{{ item[1] }}
					</div>
				</aside>
				<div class="grid gap-1 align-content-start">
					<div class="flex space-between align-items-center">
						<p class="semi m-0">Payments</p>
						<span class="stage-live">Live</span>
					</div>
					<div class="grid grid-wrap-3 m_grid-wrap-1 gap-075">
						<div v-for="(metric, i) in metricList" :key="i" class="stage-metric">
							<span class="txt12 opacity-6">{{ metric.label }}</span>
							<strong>{{ metric.value }}</strong>
							<span v-if="metric.delta" class="txt12 stage-delta">{{ metric.delta }}</span>
						</div>
					</div>
					<div class="stage-chart" aria-hidden="true">
						<i v-for="(h, i) in bars" :key="i" :style="{ height: h + '%' }" />
					</div>
				</div>
			</div>
		</div>
	</section>
</template>
