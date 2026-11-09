<script setup lang="ts">
import { defineBlock } from '@bagelink/blox'
import { Btn, defineSchema, $ } from '@bagelink/vue'
import { imageField, mediaUrl } from '@/media'

interface Props {
	variant?: 'fullbleed' | 'split' | 'typographic'
	kicker?: string
	title?: string
	body?: string
	cta_label?: string
	cta_href?: string
	cta2_label?: string
	cta2_href?: string
	image?: unknown
	image_alt?: string
}

const schema = defineSchema<Props>({
	variant: $.text('Variant', { default: 'fullbleed' }),
	kicker: $.text('Kicker'),
	title: $.text('Title'),
	body: $.textarea('Text'),
	cta_label: $.text('Button'),
	cta_href: $.text('Button link'),
	cta2_label: $.text('Secondary button'),
	cta2_href: $.text('Secondary link'),
	image: imageField(),
	image_alt: $.text('Alt text'),
})

defineBlock({
	name: 'Hero',
	label: 'Hero',
	icon: 'landscape',
	category: 'hero',
	order: 10,
	description: 'Opening: full bleed, two columns, or type only.',
	schema,
	defaults: { variant: 'fullbleed' },
})

const props = withDefaults(defineProps<Props>(), { variant: 'fullbleed' })
</script>

<template>
	<!-- Full-bleed image + gradient overlay -->
	<section
		v-if="props.variant === 'fullbleed'"
		class="hero-overlay"
		:style="mediaUrl(props.image) ? `background-image: linear-gradient(180deg, rgba(20,16,12,.2), rgba(20,16,12,.72)), url(${mediaUrl(props.image)})` : undefined"
	>
		<div class="w-1100px mx-auto px-2 m_px-1 grid align-items-end" style="min-height: 82vh; padding-block: 5rem">
			<div class="color-white keep-white grid gap-1-5 m_justify-items-start" style="max-width: 42rem">
				<p v-if="props.kicker" class="txt12 uppercase tracking-wider m-0" style="opacity: .85">{{ props.kicker }}</p>
				<h1 class="display m-0">{{ props.title }}</h1>
				<p v-if="props.body" class="txt-18 line-height-15 m-0" style="opacity: .92">{{ props.body }}</p>
				<div class="flex gap-1 flex-wrap pt-05">
					<Btn v-if="props.cta_label" size="lg" :value="props.cta_label" :href="props.cta_href || '/'" />
					<Btn v-if="props.cta2_label" size="lg" outline class="color-white keep-white border-white" :value="props.cta2_label" :href="props.cta2_href || '/'" />
				</div>
			</div>
		</div>
	</section>

	<!-- Split: text left, image right -->
	<section v-else-if="props.variant === 'split'" class="px-2 m_px-1 pt-4 pb-4 m_pt-2">
		<div class="w-1100px mx-auto grid grid-2-col m_grid-wrap-1 gap-3 align-items-center">
			<div class="grid gap-1-25 m_justify-items-start">
				<p v-if="props.kicker" class="txt12 uppercase tracking-wider quiet m-0" style="opacity: .7">{{ props.kicker }}</p>
				<h1 class="display m-0">{{ props.title }}</h1>
				<p v-if="props.body" class="txt-18 line-height-15 m-0" style="opacity: .85">{{ props.body }}</p>
				<div class="flex gap-1 flex-wrap pt-05">
					<Btn v-if="props.cta_label" size="lg" :value="props.cta_label" :href="props.cta_href || '/'" />
					<Btn v-if="props.cta2_label" size="lg" outline :value="props.cta2_label" :href="props.cta2_href || '/'" />
				</div>
			</div>
			<div v-if="mediaUrl(props.image)" class="frame" style="aspect-ratio: 4 / 5">
				<img :src="mediaUrl(props.image)" :alt="props.image_alt || props.title || ''" />
			</div>
		</div>
	</section>

	<!-- Typographic: no image, huge type -->
	<section v-else class="px-2 m_px-1 pt-5 pb-5 m_pt-3">
		<div class="w-1100px mx-auto grid gap-1-5">
			<p v-if="props.kicker" class="txt13 uppercase tracking-wider m-0" style="letter-spacing: 0.14em">{{ props.kicker }}</p>
			<h1 class="m-0" style="font-size: clamp(2.6rem, 8vw, 6rem); line-height: 0.98; letter-spacing: -0.035em">{{ props.title }}</h1>
			<p v-if="props.body" class="txt-20 line-height-14 measure m-0" style="opacity: .75">{{ props.body }}</p>
			<div class="flex gap-1 flex-wrap pt-05">
				<Btn v-if="props.cta_label" size="lg" :value="props.cta_label" :href="props.cta_href || '/'" />
				<Btn v-if="props.cta2_label" size="lg" outline :value="props.cta2_label" :href="props.cta2_href || '/'" />
			</div>
		</div>
	</section>
</template>
