<script setup lang="ts">
import { defineBlock } from '@bagelink/blox'
import { Btn, defineSchema, $ } from '@bagelink/vue'

interface Props {
	kicker?: string
	title?: string
	body?: string
	cta_label?: string
	cta_href?: string
	cta2_label?: string
	cta2_href?: string
	image?: string
	image_alt?: string
}

const schema = defineSchema<Props>({
	kicker: $.text('Kicker'),
	title: $.text('Titre'),
	body: $.textarea('Texte'),
	cta_label: $.text('Bouton'),
	cta_href: $.text('Lien du bouton'),
	cta2_label: $.text('Bouton secondaire'),
	cta2_href: $.text('Lien secondaire'),
	image: $.text('Image'),
	image_alt: $.text('Texte alt'),
})

defineBlock({
	name: 'Hero',
	label: 'Hero',
	icon: 'landscape',
	category: 'hero',
	order: 10,
	description: 'Pleine page : une photographie, un dégradé, le titre par-dessus.',
	schema,
	defaults: {},
})

const props = defineProps<Props>()
</script>

<template>
	<section class="hero-overlay" :style="props.image ? `background-image: linear-gradient(180deg, rgba(20,16,12,.2), rgba(20,16,12,.72)), url(${props.image})` : undefined">
		<div class="w-1100px mx-auto px-2 m_px-1 grid align-items-end" style="min-height: 82vh; padding-block: 5rem">
			<div class="color-white keep-white grid gap-1-5 m_justify-items-start" style="max-width: 42rem">
				<p v-if="props.kicker" class="txt12 uppercase tracking-wider m-0" style="opacity: .85">{{ props.kicker }}</p>
				<h1 class="display m-0">{{ props.title }}</h1>
				<p v-if="props.body" class="txt-18 line-height-15 m-0" style="opacity: .92">{{ props.body }}</p>
				<div class="flex gap-1 flex-wrap pt-05">
					<Btn v-if="props.cta_label" size="lg" :value="props.cta_label" :href="props.cta_href || '/reservations'" />
					<Btn v-if="props.cta2_label" size="lg" outline class="color-white keep-white border-white" :value="props.cta2_label" :href="props.cta2_href || '/menu'" />
				</div>
			</div>
		</div>
	</section>
</template>
