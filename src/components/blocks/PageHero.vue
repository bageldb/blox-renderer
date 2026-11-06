<script setup lang="ts">
import { defineBlock } from '@bagelink/blox'
import { defineSchema, $ } from '@bagelink/vue'

interface Props {
	heading?: string
	lead?: string
	image?: string
	image_alt?: string
}

const schema = defineSchema<Props>({
	heading: $.text('H1'),
	lead: $.textarea('Lead'),
	image: $.text('Image URL'),
	image_alt: $.text('Image alt'),
})

defineBlock({
	name: 'PageHero',
	label: 'Page hero',
	icon: 'title',
	category: 'hero',
	description: 'Inner-page hero with a single h1, lead and optional image.',
	schema,
	defaults: {},
})

const props = withDefaults(defineProps<Props>(), {})
</script>

<template>
	<section class="px-2 m_px-1 py-4">
		<div class="w-1100px mx-auto grid grid-2-col m_grid-wrap-1 gap-2 align-items-center">
			<div>
				<h1 class="txt-48 m_txt-36 line-height-11 m-0">{{ props.heading }}</h1>
				<p v-if="props.lead" class="sans line-height-15 measure m-0 mt-1">{{ props.lead }}</p>
			</div>
			<div v-if="props.image" class="frame hero-frame">
				<img :src="props.image" :alt="props.image_alt || props.heading || ''" />
			</div>
		</div>
	</section>
</template>
