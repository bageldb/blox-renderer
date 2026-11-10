<script setup lang="ts">
import { defineBlock } from '@bagelink/blox'
import { Btn, defineSchema, $ } from '@bagelink/vue'
import { imageField, mediaUrl } from '../../media'

interface Row { title?: string; text?: string; image?: unknown; image_alt?: string; flip?: boolean; cta_label?: string; cta_href?: string }
interface Props { kicker?: string; title?: string; items?: Row[] }

const schema = defineSchema<Props>({
	kicker: $.text('Kicker'),
	title: $.text('Title'),
	items: $.array('Rows', defineSchema({
		title: $.text('Title'),
		text: $.textarea('Text'),
		image: imageField(),
		image_alt: $.text('Alt text'),
		flip: $.select('Flip', [
			{ label: 'No', value: 'no' },
			{ label: 'Yes', value: 'yes' },
		], { default: 'no', display: 'btn' }),
		cta_label: $.text('Button'),
		cta_href: $.text('Link'),
	}), { collapsible: true, allowReorder: true }),
})

defineBlock({
	name: 'FeatureSplit',
	label: 'Image and text rows',
	icon: 'view_week',
	category: 'content',
	order: 24,
	description: 'Alternating image and text rows.',
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
				<div v-if="mediaUrl(row.image)" class="frame" style="aspect-ratio: 4 / 3">
					<img :src="mediaUrl(row.image)" :alt="row.image_alt || row.title || ''" />
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
