<script setup lang="ts">
import { computed } from 'vue'
import { defineBlock } from '@bagelink/blox'
import { Avatar, defineSchema, $ } from '@bagelink/vue'

interface Item { title?: string; text?: string; body?: string; icon?: string }
interface Props { kicker?: string; title?: string; body?: string; columns?: string; items?: Item[] }

const schema = defineSchema<Props>({
	kicker: $.text('Kicker'),
	title: $.text('Title'),
	body: $.textarea('Text'),
	columns: $.select('Columns', ['2', '3', '4'], { default: '2' }),
	items: $.array('Points', defineSchema({
		title: $.text('Title'),
		text: $.textarea('Text'),
		icon: $.icon('Icon'),
	}), { collapsible: true, allowReorder: true }),
})

defineBlock({
	name: 'FeatureGrid',
	label: 'Feature grid',
	icon: 'grid_view',
	category: 'content',
	order: 20,
	description: 'A heading and icon points, in two, three, or four columns.',
	schema,
	defaults: { columns: '2', items: [] },
})

const props = withDefaults(defineProps<Props>(), { columns: '2', items: () => [] })
const columnsClass = computed(() => {
	if (props.columns === '3') return 'feature-cols-3'
	if (props.columns === '4') return 'feature-cols-4'
	return 'feature-cols-2'
})
</script>

<template>
	<section class="px-2 m_px-1 py-4">
		<div class="w-1100px mx-auto">
			<p v-if="props.kicker" class="txt12 uppercase tracking-wider quiet m-0 mb-1">{{ props.kicker }}</p>
			<h2 class="txt-32 line-height-12 m-0">{{ props.title }}</h2>
			<p v-if="props.body" class="line-height-15 measure m-0 mt-1">{{ props.body }}</p>
			<ul class="bare grid gap-2 mt-3" :class="columnsClass">
				<li v-for="(item, i) in props.items" :key="item.title || i" class="grid grid-cols-[auto_1fr] gap-1 align-items-start">
					<Avatar v-if="item.icon" :icon="item.icon" :size="44" />
					<div>
						<h3 class="txt-20 m-0">{{ item.title }}</h3>
						<p class="line-height-15 quiet m-0 mt-05">{{ item.text ?? item.body }}</p>
					</div>
				</li>
			</ul>
		</div>
	</section>
</template>

<style>
.feature-cols-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
.feature-cols-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
.feature-cols-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
@media (max-width: 910px) {
	.feature-cols-2, .feature-cols-3, .feature-cols-4 { grid-template-columns: minmax(0, 1fr); }
}
</style>
