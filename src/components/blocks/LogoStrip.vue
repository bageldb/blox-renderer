<script setup lang="ts">
import { defineBlock } from '@bagelink/blox'
import { defineSchema, $ } from '@bagelink/vue'

interface Props {
	kicker?: string
	title?: string
	items?: string[]
}

const schema = defineSchema<Props>({
	kicker: $.text('Kicker'),
	title: $.text('Titre'),
	items: $.array('Marques', defineSchema({ name: $.text('Nom') }), { collapsible: true, allowReorder: true }),
})

defineBlock({
	name: 'LogoStrip',
	label: 'Bande de logos',
	icon: 'grid_view',
	category: 'content',
	order: 17,
	description: 'Une rangée de noms de clients ou de partenaires.',
	schema,
	defaults: { items: [] },
})

const props = withDefaults(defineProps<Props>(), { items: () => [] })
const names = () => (props.items ?? []).flatMap((i: any) => (typeof i === 'string' ? [i] : [i?.name ?? ''])).filter(Boolean)
</script>

<template>
	<section class="px-2 m_px-1 py-3">
		<div class="w-1100px mx-auto">
			<p v-if="props.kicker" class="txt12 uppercase tracking-wider quiet txt-center m-0 mb-1">{{ props.kicker }}</p>
			<p v-if="props.title" class="txt14 quiet txt-center m-0 mb-2">{{ props.title }}</p>
			<div class="flex flex-wrap gap-2 justify-center align-items-center" style="row-gap: 1rem">
				<span v-for="(name, i) in names()" :key="i" class="txt-22 semi" style="opacity: .45; letter-spacing: -0.02em">{{ name }}</span>
			</div>
		</div>
	</section>
</template>
