<script setup lang="ts">
import { defineBlock } from '@bagelink/blox'
import { defineSchema, $ } from '@bagelink/vue'
import { imageField, mediaUrl } from '@/media'

interface Item { title?: string; text?: string; image?: unknown; span?: string }
interface Props { kicker?: string; title?: string; body?: string; items?: Item[] }

const schema = defineSchema<Props>({
	kicker: $.text('Kicker'),
	title: $.text('Title'),
	body: $.textarea('Text'),
	items: $.array('Cards', defineSchema({
		title: $.text('Title'),
		text: $.textarea('Text'),
		image: imageField(),
		span: $.text('Size (1|2|wide)'),
	}), { collapsible: true, allowReorder: true }),
})

defineBlock({
	name: 'Bento',
	label: 'Bento grid',
	icon: 'dashboard',
	category: 'content',
	order: 21,
	description: 'Cards of mixed sizes.',
	schema,
	defaults: { items: [] },
})

const props = withDefaults(defineProps<Props>(), { items: () => [] })

function cls(item: Item): string {
	const s = (item.span ?? '1').toLowerCase()
	if (s === '2' || s === 'wide') return 'bento-wide'
	if (s === 'lg') return 'bento-tall'
	return ''
}
</script>

<template>
	<section class="px-2 m_px-1 py-4">
		<div class="w-1100px mx-auto">
			<p v-if="props.kicker" class="txt12 uppercase tracking-wider quiet m-0 mb-1">{{ props.kicker }}</p>
			<h2 class="txt-32 line-height-12 m-0">{{ props.title }}</h2>
			<p v-if="props.body" class="line-height-15 measure m-0 mt-1">{{ props.body }}</p>
			<div class="bento-grid mt-3">
				<div v-for="(item, i) in props.items" :key="i" :class="['panel bento-cell', cls(item)]">
					<div v-if="mediaUrl(item.image)" class="frame m-0 mb-1" style="aspect-ratio: 16 / 9; border-radius: 12px">
						<img :src="mediaUrl(item.image)" :alt="item.title || ''" />
					</div>
					<h3 class="txt-20 m-0">{{ item.title }}</h3>
					<p v-if="item.text" class="line-height-15 m-0 mt-05" style="opacity: .8">{{ item.text }}</p>
				</div>
			</div>
		</div>
	</section>
</template>
