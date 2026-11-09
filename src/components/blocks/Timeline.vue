<script setup lang="ts">
import { defineBlock } from '@bagelink/blox'
import { defineSchema, $ } from '@bagelink/vue'

interface Item { year?: string; title?: string; text?: string }
interface Props { kicker?: string; title?: string; items?: Item[] }

const schema = defineSchema<Props>({
	kicker: $.text('Kicker'),
	title: $.text('Title'),
	items: $.array('Milestones', defineSchema({
		year: $.text('Period'),
		title: $.text('Title'),
		text: $.textarea('Text'),
	}), { collapsible: true, allowReorder: true }),
})

defineBlock({
	name: 'Timeline',
	label: 'Timeline',
	icon: 'timeline',
	category: 'content',
	order: 22,
	description: 'A vertical timeline of dated milestones.',
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
			<ol class="bare mt-3">
				<li v-for="(item, i) in props.items" :key="i" class="timeline-row">
					<span class="timeline-mark" aria-hidden="true"></span>
					<div class="grid gap-025">
						<p v-if="item.year" class="txt12 uppercase tracking-wider quiet m-0">{{ item.year }}</p>
						<h3 class="txt-20 m-0">{{ item.title }}</h3>
						<p v-if="item.text" class="line-height-15 quiet m-0">{{ item.text }}</p>
					</div>
				</li>
			</ol>
		</div>
	</section>
</template>
