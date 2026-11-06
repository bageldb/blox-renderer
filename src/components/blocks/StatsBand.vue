<script setup lang="ts">
import { defineBlock } from '@bagelink/blox'
import { defineSchema, $ } from '@bagelink/vue'

interface Stat { value?: string; label?: string }
interface Props { items?: Stat[] }

const schema = defineSchema<Props>({
	items: $.array('Chiffres', defineSchema({
		value: $.text('Valeur'),
		label: $.text('Libellé'),
	}), { collapsible: true, allowReorder: true }),
})

defineBlock({
	name: 'StatsBand',
	label: 'Bande de chiffres',
	icon: 'query_stats',
	category: 'content',
	order: 15,
	description: 'Une rangée de chiffres clés sur une bande contrastée.',
	schema,
	defaults: { items: [] },
})

const props = withDefaults(defineProps<Props>(), { items: () => [] })
</script>

<template>
	<section class="band px-2 m_px-1 py-2">
		<div class="w-1100px mx-auto grid grid-wrap-4 m_grid-wrap-2 gap-1">
			<div v-for="(s, i) in props.items" :key="s.label || i" class="txt-center grid gap-025 py-1">
				<span class="display txt-36 m_txt-28 line-height-1 m-0">{{ s.value }}</span>
				<span class="txt12 uppercase tracking-wider quiet">{{ s.label }}</span>
			</div>
		</div>
	</section>
</template>
