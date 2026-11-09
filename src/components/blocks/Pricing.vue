<script setup lang="ts">
import { defineBlock } from '@bagelink/blox'
import { Btn, defineSchema, $ } from '@bagelink/vue'

interface Plan { name?: string; price?: string; period?: string; text?: string; features?: string[]; cta_label?: string; cta_href?: string; featured?: boolean }
interface Props { kicker?: string; title?: string; body?: string; items?: Plan[] }

const schema = defineSchema<Props>({
	kicker: $.text('Kicker'),
	title: $.text('Titre'),
	body: $.textarea('Texte'),
	items: $.array('Offres', defineSchema({
		name: $.text('Nom'),
		price: $.text('Prix'),
		period: $.text('Période'),
		text: $.textarea('Texte'),
		features: $.array('Inclus', defineSchema({ text: $.text('Élément') })),
		cta_label: $.text('Bouton'),
		cta_href: $.text('Lien'),
		featured: $.text('Mis en avant'),
	}), { collapsible: true, allowReorder: true }),
})

defineBlock({
	name: 'Pricing',
	label: 'Tarifs',
	icon: 'sell',
	category: 'content',
	order: 23,
	description: 'Cartes de tarification avec une offre mise en avant.',
	schema,
	defaults: { items: [] },
})

const props = withDefaults(defineProps<Props>(), { items: () => [] })

function feats(p: Plan): string[] {
	return (p.features ?? []).flatMap((f: any) => (typeof f === 'string' ? [f] : [f?.text ?? ''])).filter(Boolean)
}
function isFeatured(p: Plan): boolean {
	const v = String(p.featured ?? '').toLowerCase()
	return v === 'true' || v === 'oui' || v === 'yes' || v === '1'
}
</script>

<template>
	<section class="px-2 m_px-1 py-4">
		<div class="w-1100px mx-auto">
			<p v-if="props.kicker" class="txt12 uppercase tracking-wider quiet m-0 mb-1">{{ props.kicker }}</p>
			<h2 class="txt-32 line-height-12 m-0">{{ props.title }}</h2>
			<p v-if="props.body" class="line-height-15 measure m-0 mt-1">{{ props.body }}</p>
			<div class="grid grid-wrap-3 m_grid-wrap-1 gap-1 mt-3 align-items-stretch">
				<div v-for="(p, i) in props.items" :key="i" :class="['panel grid align-content-space-between', isFeatured(p) ? 'pricing-featured' : '']">
					<div>
						<h3 class="txt-20 m-0">{{ p.name }}</h3>
						<p class="m-0 mt-1"><span class="txt-36 line-height-1">{{ p.price }}</span><span v-if="p.period" class="txt14 quiet"> {{ p.period }}</span></p>
						<p v-if="p.text" class="line-height-15 quiet m-0 mt-1">{{ p.text }}</p>
						<ul class="bare mt-1 grid gap-05">
							<li v-for="(f, j) in feats(p)" :key="j" class="txt14 flex gap-075 align-items-start">
								<span aria-hidden="true">✓</span><span>{{ f }}</span>
							</li>
						</ul>
					</div>
					<Btn v-if="p.cta_label" class="mt-2" :value="p.cta_label" :href="p.cta_href || '/'" :outline="!isFeatured(p)" />
				</div>
			</div>
		</div>
	</section>
</template>
