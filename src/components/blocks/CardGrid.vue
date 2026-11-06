<script setup lang="ts">
import { defineBlock } from '@bagelink/blox'
import { defineSchema, $ } from '@bagelink/vue'

interface Card { title?: string; text?: string; body?: string; image?: string; meta?: string; href?: string }
interface Props { kicker?: string; title?: string; body?: string; items?: Card[] }

const schema = defineSchema<Props>({
	kicker: $.text('Kicker'),
	title: $.text('Titre'),
	body: $.textarea('Texte'),
	items: $.array('Cartes', defineSchema({
		title: $.text('Titre'),
		text: $.textarea('Texte'),
		image: $.text('Image'),
		meta: $.text('Méta'),
		href: $.text('Lien'),
	}), { collapsible: true, allowReorder: true }),
})

defineBlock({
	name: 'CardGrid',
	label: 'Grille de cartes',
	icon: 'dashboard',
	category: 'content',
	order: 40,
	description: 'Cartes image liées, avec un léger soulèvement au survol.',
	schema,
	defaults: { items: [] },
})

const props = withDefaults(defineProps<Props>(), { items: () => [] })
// The agent may write the item description as `body` instead of `text`.
const desc = (item: Card) => item.text ?? item.body ?? ''
</script>

<template>
	<section class="px-2 m_px-1 py-4">
		<div class="w-1100px mx-auto">
			<p v-if="props.kicker" class="txt12 uppercase tracking-wider quiet m-0 mb-1">{{ props.kicker }}</p>
			<h2 class="txt-32 line-height-12 m-0">{{ props.title }}</h2>
			<p v-if="props.body" class="line-height-15 measure m-0 mt-1">{{ props.body }}</p>
			<ul class="bare grid grid-wrap-4 m_grid-wrap-2 gap-2 mt-3">
				<li v-for="(item, i) in props.items" :key="item.title || i">
					<a class="card-link" :href="item.href || '#'">
						<div v-if="item.image" class="frame">
							<img :src="item.image" :alt="item.title || ''" />
						</div>
						<p v-if="item.meta" class="txt12 quiet m-0 mt-075">{{ item.meta }}</p>
						<h3 class="txt-20 m-0 mt-025">{{ item.title }}</h3>
						<p v-if="desc(item)" class="txt14 quiet m-0 mt-025">{{ desc(item) }}</p>
					</a>
				</li>
			</ul>
		</div>
	</section>
</template>
