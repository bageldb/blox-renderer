import { $ } from '@bagelink/vue'

const ASSET_ID = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i

/** Image field stored as a public asset pin. Existing URL strings still render. */
export function imageField(label = 'Image') {
	return $.upload(label, {
		accept: 'image/*',
		assetMode: true,
		assetVisibility: 'public',
		height: '160px',
	})
}

/** Resolve a block image prop to a URL the published site can load. */
export function mediaUrl(value: unknown): string {
	if (value == null || value === '') return ''
	if (typeof value === 'string') {
		const trimmed = value.trim()
		const pin = /^asset:\/\/([0-9a-f-]{36})$/i.exec(trimmed)
		if (pin?.[1] && ASSET_ID.test(pin[1])) return assetPath(pin[1])
		return trimmed
	}
	if (typeof value === 'object' && 'asset_id' in value) {
		const id = String((value as { asset_id?: unknown }).asset_id ?? '')
		if (ASSET_ID.test(id)) return assetPath(id)
	}
	return ''
}

function assetPath(id: string): string {
	return `/api/assets/${id}?fmt=webp`
}
