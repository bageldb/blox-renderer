<script setup lang="ts">
import { computed } from 'vue'
import { defineBlock } from '@bagelink/blox'
import { defineSchema, $ } from '@bagelink/vue'
import { imageField, mediaUrl } from '@/media'

interface Props {
	title?: string
	kicker?: string
	dek?: string
	body?: string
	image?: unknown
	image_alt?: string
	date?: string
	author?: string
	category?: string
	reading_time?: string
}

const schema = defineSchema<Props>({
	title: $.text('Title'),
	kicker: $.text('Kicker'),
	dek: $.textarea('Deck'),
	body: $.textarea('Body (markdown)'),
	image: imageField(),
	image_alt: $.text('Alt text'),
	date: $.text('Date'),
	author: $.text('Author'),
	category: $.text('Category'),
	reading_time: $.text('Reading time'),
})

defineBlock({
	name: 'ArticleView',
	label: 'Article',
	icon: 'article',
	category: 'content',
	description:
		'Rich journal article: hero, byline and a markdown body (headings, quotes, rules, images).',
	schema,
	defaults: {},
})

const props = withDefaults(defineProps<Props>(), {})

// ---- markdown-lite --------------------------------------------------------
// Subset sufficient for editorial bodies: `## / ###` headings, `> ` pull
// quotes, `---` rules, `![alt](url)` images, and inline `**bold**`, `*italic*`,
// `` `code` ``, `[text](url)` links. No HTML, no code fences, no nesting.
interface Seg {
	text: string
	strong?: boolean
	em?: boolean
	code?: boolean
	link?: string
}
interface Block {
	kind: 'p' | 'h2' | 'h3' | 'quote' | 'rule' | 'image'
	segs?: Seg[]
	src?: string
	alt?: string
}

const INLINE_RE = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|\[[^\]]+\]\([^)]+\))/g

function safeHref(href: string): string {
	const value = href.trim()
	if (value.startsWith('/') || value.startsWith('#') || value.startsWith('mailto:')) return value
	if (/^https?:\/\//i.test(value)) return value
	return ''
}

function parseInline(raw: string): Seg[] {
	const segs: Seg[] = []
	let last = 0
	let m: RegExpExecArray | null
	while ((m = INLINE_RE.exec(raw))) {
		if (m.index > last) segs.push({ text: raw.slice(last, m.index) })
		const tok = m[0]
		if (tok.startsWith('**')) segs.push({ text: tok.slice(2, -2), strong: true })
		else if (tok.startsWith('*')) segs.push({ text: tok.slice(1, -1), em: true })
		else if (tok.startsWith('`')) segs.push({ text: tok.slice(1, -1), code: true })
		else {
			const lm = tok.match(/\[([^\]]+)\]\(([^)]+)\)/)
			const href = lm ? safeHref(lm[2]) : ''
			if (lm && href) segs.push({ text: lm[1], link: href })
			else segs.push({ text: tok })
		}
		last = m.index + tok.length
	}
	if (last < raw.length) segs.push({ text: raw.slice(last) })
	return segs
}

function parseMarkdown(body: string): Block[] {
	const blocks: Block[] = []
	let para: string[] = []
	const flush = () => {
		if (para.length) {
			blocks.push({ kind: 'p', segs: parseInline(para.join(' ')) })
			para = []
		}
	}
	for (const line of (body || '').split('\n')) {
		const t = line.trim()
		if (t === '') {
			flush()
			continue
		}
		if (/^-{3,}$/.test(t)) {
			flush()
			blocks.push({ kind: 'rule' })
			continue
		}
		const heading = t.match(/^(#{2,3})\s+(.*)$/)
		if (heading) {
			flush()
			blocks.push({ kind: heading[1].length === 3 ? 'h3' : 'h2', segs: parseInline(heading[2]) })
			continue
		}
		const quote = t.match(/^>\s?(.*)$/)
		if (quote) {
			flush()
			blocks.push({ kind: 'quote', segs: parseInline(quote[1]) })
			continue
		}
		const img = t.match(/^!\[([^\]]*)\]\(([^)]+)\)$/)
		if (img) {
			flush()
			blocks.push({ kind: 'image', src: img[2], alt: img[1] })
			continue
		}
		para.push(t)
	}
	flush()
	return blocks
}

const blocks = computed<Block[]>(() => parseMarkdown(props.body || ''))
</script>

<template>
	<article class="px-2 m_px-1 py-4">
		<div class="w-1100px mx-auto">
			<header class="measure mx-auto txt-center mb-3">
				<p v-if="props.kicker" class="txt12 uppercase tracking-wider quiet m-0 mb-1">{{ props.kicker }}</p>
				<h1 class="display m-0" style="font-size: clamp(2rem, 5vw, 3.6rem)">{{ props.title }}</h1>
				<p v-if="props.dek" class="txt-20 line-height-14 quiet m-0 mt-1">{{ props.dek }}</p>
				<p v-if="props.date || props.author || props.reading_time" class="txt13 quiet m-0 mt-1">
					<span v-if="props.author">{{ props.author }}</span>
					<span v-if="props.author && (props.date || props.reading_time)"> · </span>
					<span v-if="props.date">{{ props.date }}</span>
					<span v-if="props.reading_time && (props.date || props.author)"> · </span>
					<span v-if="props.reading_time">{{ props.reading_time }} read</span>
				</p>
			</header>

			<figure v-if="mediaUrl(props.image)" class="frame m-0 mb-3" style="aspect-ratio: 21 / 9; border-radius: 18px">
				<img :src="mediaUrl(props.image)" :alt="props.image_alt || props.title || ''" />
			</figure>

			<div class="measure mx-auto">
				<template v-for="(block, i) in blocks" :key="i">
					<p v-if="block.kind === 'p'" class="line-height-16 m-0 mt-1">
						<template v-for="(seg, j) in block.segs" :key="j">
							<a v-if="seg.link" :href="seg.link">{{ seg.text }}</a>
							<strong v-else-if="seg.strong">{{ seg.text }}</strong>
							<em v-else-if="seg.em">{{ seg.text }}</em>
							<code v-else-if="seg.code">{{ seg.text }}</code>
							<span v-else>{{ seg.text }}</span>
						</template>
					</p>
					<h2 v-else-if="block.kind === 'h2'" class="txt-28 line-height-12 m-0 mt-2 pt-1">
						<template v-for="(seg, j) in block.segs" :key="j">
							<a v-if="seg.link" :href="seg.link">{{ seg.text }}</a>
							<strong v-else-if="seg.strong">{{ seg.text }}</strong>
							<em v-else-if="seg.em">{{ seg.text }}</em>
							<code v-else-if="seg.code">{{ seg.text }}</code>
							<span v-else>{{ seg.text }}</span>
						</template>
					</h2>
					<h3 v-else-if="block.kind === 'h3'" class="txt-20 m-0 mt-1-5">
						<template v-for="(seg, j) in block.segs" :key="j">
							<a v-if="seg.link" :href="seg.link">{{ seg.text }}</a>
							<strong v-else-if="seg.strong">{{ seg.text }}</strong>
							<em v-else-if="seg.em">{{ seg.text }}</em>
							<code v-else-if="seg.code">{{ seg.text }}</code>
							<span v-else>{{ seg.text }}</span>
						</template>
					</h3>
					<blockquote v-else-if="block.kind === 'quote'" class="m-0 mt-1-5" style="border-inline-start: 3px solid var(--bgl-primary); padding-inline-start: 1rem">
						<p class="txt-22 line-height-14 m-0" style="font-family: var(--bgl-font-display)">
							<template v-for="(seg, j) in block.segs" :key="j">
								<a v-if="seg.link" :href="seg.link">{{ seg.text }}</a>
								<strong v-else-if="seg.strong">{{ seg.text }}</strong>
								<em v-else-if="seg.em">{{ seg.text }}</em>
								<code v-else-if="seg.code">{{ seg.text }}</code>
								<span v-else>{{ seg.text }}</span>
							</template>
						</p>
					</blockquote>
					<hr v-else-if="block.kind === 'rule'" class="mt-2 mb-2" style="border: none; border-top: 2px solid var(--bgl-primary); opacity: 0.25" />
					<figure v-else-if="block.kind === 'image'" class="frame m-0 mt-1-5 mb-1" style="aspect-ratio: 16 / 9">
						<img :src="block.src" :alt="block.alt || ''" />
						<figcaption v-if="block.alt" class="txt12 quiet txt-center mt-05">{{ block.alt }}</figcaption>
					</figure>
				</template>
			</div>
		</div>
	</article>
</template>
