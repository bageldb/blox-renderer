<script setup lang="ts">
import { defineBlock } from '@bagelink/blox'
import { defineSchema, $ } from '@bagelink/vue'

interface Props {
	items?: string[]
	speed?: string
}

const schema = defineSchema<Props>({
	items: $.array('Phrases', defineSchema({ text: $.text('Text') }), { collapsible: true, allowReorder: true }),
	speed: $.text('Duration (s)', { default: '24' }),
})

defineBlock({
	name: 'Marquee',
	label: 'Marquee',
	icon: 'more_horiz',
	category: 'content',
	order: 16,
	description: 'A looping strip of text.',
	schema,
	defaults: { items: [], speed: '24' },
})

const props = withDefaults(defineProps<Props>(), { items: () => [], speed: '24' })
const items = () => (props.items ?? []).flatMap((i: any) => (typeof i === 'string' ? [i] : [i?.text ?? ''])).filter(Boolean)
const duration = () => `${props.speed || '24'}s`
</script>

<template>
	<section class="marquee" aria-hidden="true">
		<div class="marquee-track" :style="{ animationDuration: duration() }">
			<span v-for="(item, i) in [...items(), ...items()]" :key="i" class="marquee-item">{{ item }}<span class="marquee-dot">✦</span></span>
		</div>
	</section>
</template>
