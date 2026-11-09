<script setup lang="ts">
import { defineBlock } from '@bagelink/blox'
import { Icon, defineSchema, $ } from '@bagelink/vue'

interface Item { title?: string; text?: string; icon?: string; tone?: string; href?: string }
interface Props { kicker?: string; title?: string; body?: string; columns?: string; items?: Item[] }

const schema = defineSchema<Props>({
	kicker: $.text('Kicker'),
	title: $.text('Title'),
	body: $.textarea('Text'),
	columns: $.select('Columns', ['3', '4'], { default: '3' }),
	items: $.array('Tiles', defineSchema({
		title: $.text('Title'),
		text: $.textarea('Text'),
		icon: $.icon('Icon'),
		tone: $.select('Tone', [
			{ label: 'Paper', value: 'paper' },
			{ label: 'Ink', value: 'ink' },
			{ label: 'Violet', value: 'violet' },
			{ label: 'Blue', value: 'blue' },
			{ label: 'Cyan', value: 'cyan' },
			{ label: 'Green', value: 'green' },
			{ label: 'Yellow', value: 'yellow' },
			{ label: 'Orange', value: 'orange' },
			{ label: 'Pink', value: 'pink' },
		], { default: 'paper' }),
		href: $.text('Link'),
	}), { collapsible: true, allowReorder: true }),
})

defineBlock({
	name: 'Tiles',
	label: 'Tiles',
	icon: 'grid_view',
	category: 'content',
	order: 22,
	description: 'Colored product tiles, each with its own tone.',
	schema,
	defaults: { columns: '3', items: [] },
})

const props = withDefaults(defineProps<Props>(), { columns: '3', items: () => [] })
const tones = new Set(['violet', 'blue', 'cyan', 'orange', 'green', 'yellow', 'ink', 'pink', 'paper'])

function tone(item: Item): string {
	const t = (item.tone || 'paper').toLowerCase()
	return tones.has(t) ? t : 'paper'
}
</script>

<template>
	<section class="px-2 m_px-1 py-4">
		<div class="w-1100px mx-auto">
			<p v-if="props.kicker" class="txt12 uppercase tracking-wider quiet m-0 mb-1">{{ props.kicker }}</p>
			<h2 v-if="props.title" class="txt-36 line-height-11 m-0">{{ props.title }}</h2>
			<p v-if="props.body" class="line-height-15 measure m-0 mt-1">{{ props.body }}</p>
			<div :class="['tile-grid mt-3', props.columns === '4' ? 'tile-grid-4' : '']">
				<component
					:is="item.href ? 'router-link' : 'div'"
					v-for="(item, i) in props.items"
					:key="i"
					:to="item.href || undefined"
					:class="['tile', `tile-${tone(item)}`, item.href ? 'decoration-none' : '']"
				>
					<span v-if="item.icon" class="tile-icon"><Icon :name="item.icon" :size="1.25" /></span>
					<h3 class="txt-20 m-0">{{ item.title }}</h3>
					<p v-if="item.text" class="txt14 line-height-15 m-0 mt-05">{{ item.text }}</p>
				</component>
			</div>
		</div>
	</section>
</template>
