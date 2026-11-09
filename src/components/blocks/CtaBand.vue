<script setup lang="ts">
import { defineBlock } from '@bagelink/blox'
import { Btn, defineSchema, $ } from '@bagelink/vue'

interface Props {
	title?: string
	body?: string
	cta_label?: string
	cta_href?: string
}

const schema = defineSchema<Props>({
	title: $.text('Title'),
	body: $.textarea('Text'),
	cta_label: $.text('Button'),
	cta_href: $.text('Link'),
})

defineBlock({
	name: 'CtaBand',
	label: 'Call to action',
	icon: 'campaign',
	category: 'content',
	order: 60,
	description: 'A contrasting closing band with a button.',
	schema,
	defaults: {},
})

const props = defineProps<Props>()
</script>

<template>
	<section class="band-deep px-2 m_px-1 py-4 m_py-3">
		<div class="w-1100px mx-auto grid grid-2-col m_grid-wrap-1 gap-2 align-items-center">
			<div>
				<h2 class="txt-32 line-height-12 m-0">{{ props.title }}</h2>
				<p v-if="props.body" class="line-height-15 m-0 mt-1" style="opacity: 0.85">{{ props.body }}</p>
			</div>
			<div class="justify-self-end m_justify-self-start">
				<Btn v-if="props.cta_label" size="lg" color="dark" :value="props.cta_label" :href="props.cta_href || '/contact'" />
			</div>
		</div>
	</section>
</template>
