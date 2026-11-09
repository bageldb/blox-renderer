<script setup lang="ts">
import { defineBlock } from '@bagelink/blox'
import { defineSchema, $ } from '@bagelink/vue'

interface Props {
	accent?: string
	bg?: string
	ink?: string
	muted?: string
	surface?: string
	surface_ink?: string
	font_display?: string
	font_body?: string
	radius?: string
}

const schema = defineSchema<Props>({
	accent: $.text('Accent'),
	bg: $.text('Ground'),
	ink: $.text('Ink'),
	muted: $.text('Muted'),
	surface: $.text('Contrast surface'),
	surface_ink: $.text('Contrast surface text'),
	font_display: $.text('Display font'),
	font_body: $.text('Body font'),
	radius: $.text('Radius'),
})

defineBlock({
	name: 'SiteTheme',
	label: 'Theme',
	icon: 'palette',
	category: 'layout',
	description: 'Site palette and typography. One block, applied to every page.',
	schema,
	defaults: {
		accent: '#1c1917',
		bg: '#faf9f6',
		ink: '#1c1917',
		muted: '#6b6560',
		font_display: "'Fraunces', Georgia, serif",
		font_body: "'Hanken Grotesk', system-ui, sans-serif",
		radius: '20px',
	},
	global: true,
})
</script>

<template>
	<div />
</template>
