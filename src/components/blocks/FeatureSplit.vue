<script setup lang="ts">
import { defineBlock } from '@bagelink/blox'
import { Btn, defineSchema, $ } from '@bagelink/vue'

interface Row { title?: string; text?: string; image?: string; image_alt?: string; flip?: boolean; cta_label?: string; cta_href?: string }
interface Props { kicker?: string; title?: string; items?: Row[] }

const schema = defineSchema<Props>({
	kicker: $.text('Kicker'),
	title: $.text('Titre'),
	items: $.array('Rangées', defineSchema({
		title: $.text('Titre'),
		text: $.textarea('Texte'),
		image: $.text('Image'),
		image_alt: $.text('Texte alt'),
		flip: $.text('Inverser'),
		cta_label: $.text('Bouton'),
		cta_href: $.text('Lien'),
	}), { collapsible: true, allowReorder: true }),
})

defineBlock({
	name: 'FeatureSplit',
	label: 'Rangées image / texte',
	icon: 'view_week',
	category: 'content',
	order: 24,
	description: 'Rangées alternées image et texte, pour un rythme éditorial.',
	schema,
	defaults: { items: [] },
})

const props = withDefaults(defineProps<Props>(), { items: () => [] })

function flipped(row: Row): boolean {
	const v = String(row.flip ?? '').toLowerCase()
	return v === 'true' || v === 'oui' || v === 'yes' || v === '1'
}
</script>

<template>
	<section class="px-2 m_px-1 py-4">
		<div class="w-1100px mx-auto grid gap-3">
			<p v-if="props.kicker" class="txt12 uppercase tracking-wider quiet m-0">{{ props.kicker }}</p>
			<h2 v-if="props.title" class="txt-32 line-height-12 m-0">{{ props.title }}</h2>
			<div v-for="(row, i) in props.items" :key="i" :class="['grid grid-2-col m_grid-wrap-1 gap-2 align-items-center py-1-5 border-top', flipped(row) ? 'flip' : '']">
				<div v-if="row.image" class="frame" style="aspect-ratio: 4 / 3">
					<img :src="row.image" :alt="row.image_alt || row.title || ''" />
				</div>
				<div class="grid gap-1 align-content-center">
					<h3 class="txt-28 line-height-12 m-0">{{ row.title }}</h3>
					<p class="line-height-15 quiet m-0">{{ row.text }}</p>
					<Btn v-if="row.cta_label" class="justify-self-start" outline :value="row.cta_label" :href="row.cta_href || '/'" />
				</div>
			</div>
		</div>
	</section>
</template>
