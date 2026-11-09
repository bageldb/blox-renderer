<script setup lang="ts">
import { defineBlock } from '@bagelink/blox'
import { defineSchema, $ } from '@bagelink/vue'

interface Quote { quote?: string; name?: string; detail?: string }
interface Props { kicker?: string; title?: string; items?: Quote[] }

const schema = defineSchema<Props>({
	kicker: $.text('Kicker'),
	title: $.text('Title'),
	items: $.array('Quotes', defineSchema({
		quote: $.textarea('Quote'),
		name: $.text('Name'),
		detail: $.text('Detail'),
	}), { collapsible: true, allowReorder: true }),
})

defineBlock({
	name: 'QuoteList',
	label: 'Quotes',
	icon: 'format_quote',
	category: 'content',
	order: 50,
	description: 'Quotes on soft cards, with the name underneath.',
	schema,
	defaults: { items: [] },
})

const props = withDefaults(defineProps<Props>(), { items: () => [] })
</script>

<template>
	<section class="px-2 m_px-1 py-4">
		<div class="w-1100px mx-auto">
			<p v-if="props.kicker" class="txt12 uppercase tracking-wider quiet m-0 mb-1">{{ props.kicker }}</p>
			<h2 class="txt-32 line-height-12 m-0">{{ props.title }}</h2>
			<ul class="bare grid grid-wrap-3 m_grid-wrap-1 gap-1 mt-3">
				<li v-for="(item, i) in props.items" :key="item.name || i" class="panel grid align-content-space-between" style="min-height: 12rem">
					<p class="line-height-15 m-0">“{{ item.quote }}”</p>
					<p class="txt14 quiet m-0 mt-1">{{ item.name }}<span v-if="item.detail"> · {{ item.detail }}</span></p>
				</li>
			</ul>
		</div>
	</section>
</template>
