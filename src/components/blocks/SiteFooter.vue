<script setup lang="ts">
import { defineBlock, useGlobalBlock } from '@bagelink/blox'
import { defineSchema, $ } from '@bagelink/vue'

interface Link { label: string; to: string }
interface Column { title?: string; links?: Link[] }
interface Content { brand?: string; note?: string; columns?: Column[] }

const schema = defineSchema({
	brand: $.text('Marque'),
	note: $.textarea('Note'),
	columns: $.array('Colonnes', defineSchema({
		title: $.text('Titre'),
		links: $.array('Liens', defineSchema({ label: $.text('Libellé'), to: $.text('Lien') })),
	}), { collapsible: true, allowReorder: true }),
})

defineBlock({
	name: 'SiteFooter',
	label: 'Pied de page',
	icon: 'vertical_align_bottom',
	category: 'layout',
	description: 'Pied de page multi-colonnes, partagé par toutes les pages.',
	schema,
	defaults: { brand: '', note: '', columns: [] },
	global: true,
})

const { data } = useGlobalBlock<Content>('SiteFooter')
const fallback: Content = {
	brand: '',
	note: '',
	columns: [
		{ title: 'Site', links: [] },
		{ title: 'Contact', links: [] },
	],
}
</script>

<template>
	<footer class="border-top mt-6">
		<div class="w-1100px mx-auto px-2 m_px-1 py-4 grid grid-wrap-4 m_grid-wrap-1 gap-2">
			<div class="grid gap-1 align-content-start">
				<p class="txt-28 m-0" style="letter-spacing: -0.03em">{{ data?.brand || fallback.brand }}</p>
				<p class="txt13 quiet m-0 measure">{{ data?.note || fallback.note }}</p>
			</div>
			<div v-for="column in data?.columns?.length ? data.columns : fallback.columns" :key="column.title" class="grid gap-05 align-content-start">
				<span class="txt12 uppercase tracking-wider semi">{{ column.title }}</span>
				<router-link v-for="link in column.links || []" :key="link.to" :to="link.to" class="txt14 quiet decoration-none">{{ link.label }}</router-link>
			</div>
		</div>
		<div class="w-1100px mx-auto px-2 m_px-1 border-top py-2 txt12 quiet">© {{ new Date().getFullYear() }} {{ data?.brand || fallback.brand }}. All rights reserved.</div>
	</footer>
</template>
