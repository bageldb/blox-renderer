<script setup lang="ts">
import { RouterLink } from 'vue-router'
import type { GuideEntry } from '@/content/site'

defineProps<{ guides: GuideEntry[] }>()
</script>

<template>
	<ul class="bare">
		<li v-for="g in guides" :key="g.title" class="border-bottom">
			<component
				:is="g.to ? RouterLink : 'div'"
				:to="g.to"
				class="guide-row flex gap-2 align-items-baseline py-1-25 decoration-none m_column m_gap-025"
			>
				<span class="sans txt11 uppercase tracking-wider opacity-5 kicker-col">{{ g.kicker }}</span>
				<span class="flex-1 min-w-0">
					<span class="txt-20 line-height-12">{{ g.title }}</span>
					<span v-if="g.dek" class="sans txt14 opacity-6 line-height-15 block mt-025">{{ g.dek }}</span>
				</span>
				<span class="sans txt12 opacity-5 noshrink">{{ g.verifier }}</span>
			</component>
		</li>
	</ul>
</template>
