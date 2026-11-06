<script setup lang="ts">
import { computed } from 'vue'
import { defineBlock } from '@bagelink/blox'
import { defineSchema, $ } from '@bagelink/vue'

interface Props {
	title?: string
	kicker?: string
	body?: string
	image?: string
	image_alt?: string
	date?: string
}

const schema = defineSchema<Props>({
	title: $.text('Title'),
	kicker: $.text('Kicker'),
	body: $.textarea('Body'),
	image: $.text('Image'),
	image_alt: $.text('Image alt'),
	date: $.text('Date'),
})

defineBlock({
	name: 'ArticleView',
	label: 'Article',
	icon: 'article',
	category: 'content',
	description: 'One journal article: title, date, image and body.',
	schema,
	defaults: {},
})

const props = withDefaults(defineProps<Props>(), {})
const paragraphs = computed(() => (props.body || '').split(/\n{2,}/).filter(Boolean))
</script>

<template>
	<article class="px-2 m_px-1 py-4">
		<div class="w-1100px mx-auto measure">
			<p v-if="props.kicker" class="txt12 uppercase tracking-wider quiet m-0 mb-1">{{ props.kicker }}</p>
			<h1 class="display m-0">{{ props.title }}</h1>
			<p v-if="props.date" class="txt14 quiet mt-1 mb-2">{{ props.date }}</p>
			<div v-if="props.image" class="frame mb-2">
				<img :src="props.image" :alt="props.image_alt || ''" />
			</div>
			<p v-for="(paragraph, i) in paragraphs" :key="i" class="line-height-16 m-0 mt-1">{{ paragraph }}</p>
		</div>
	</article>
</template>
