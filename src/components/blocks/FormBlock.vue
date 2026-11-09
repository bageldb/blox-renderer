<script setup lang="ts">
import { computed, reactive, ref } from 'vue'
import { defineBlock } from '@bagelink/blox'
import { Btn, Checkbox, SelectBtn, TextInput, defineSchema, $ } from '@bagelink/vue'

interface Field {
	name: string
	title: string
	kind: 'text' | 'textarea' | 'email' | 'phone' | 'checkbox' | 'choice'
	required: boolean
	options: { label: string; value: string }[]
}

interface Props {
	kicker?: string
	title?: string
	body?: string
	form_name?: string
	submit_label?: string
	success_message?: string
	fields?: any[]
}

const fieldSchema = defineSchema({
	name: $.text('Field'),
	title: $.text('Label'),
	kind: $.select('Type', [
		{ label: 'Text', value: 'text' },
		{ label: 'Long text', value: 'textarea' },
		{ label: 'Email', value: 'email' },
		{ label: 'Phone', value: 'phone' },
		{ label: 'Checkbox', value: 'checkbox' },
		{ label: 'Choice', value: 'choice' },
	], { default: 'text' }),
	required: $.select('Required', [
		{ label: 'No', value: 'no' },
		{ label: 'Yes', value: 'yes' },
	], { default: 'no', display: 'btn' }),
	options: $.array('Options', defineSchema({
		label: $.text('Label'),
		value: $.text('Value'),
	})),
})

const schema = defineSchema<Props>({
	kicker: $.text('Kicker'),
	title: $.text('Title'),
	body: $.textarea('Text'),
	form_name: $.text('Form definition'),
	submit_label: $.text('Button'),
	success_message: $.text('Confirmation message'),
	fields: $.array('Fields', fieldSchema, { collapsible: true }),
})

defineBlock({
	name: 'FormBlock',
	label: 'Form',
	icon: 'assignment',
	category: 'form',
	description: 'Renders a public form definition with Bagelink fields.',
	schema,
	defaults: {},
})

const props = withDefaults(defineProps<Props>(), {
	submit_label: 'Send',
	success_message: 'Thank you. We will be in touch.',
})

// The agent writes fields as {name, label, type} or {name, title, kind}. Accept
// both, and map `type` values ('text'|'textarea'|'email'|'phone'|'checkbox') onto
// `kind`. A checkbox or `type: 'checkbox'` renders a Checkbox; a select renders
// when options are present.
function normalizeField(raw: any): Field {
	const kindRaw = (raw.kind ?? raw.type ?? 'text').toLowerCase()
	const hasOptions = Array.isArray(raw.options) && raw.options.length > 0
	const kind: Field['kind'] = hasOptions || kindRaw === 'choice' || kindRaw === 'select'
		? 'choice'
		: kindRaw === 'checkbox'
			? 'checkbox'
			: kindRaw === 'textarea'
				? 'textarea'
				: kindRaw === 'email'
					? 'email'
					: kindRaw === 'phone' || kindRaw === 'tel'
						? 'phone'
						: 'text'
	return {
		name: raw.name,
		title: raw.title ?? raw.label ?? raw.name,
		kind,
		required: raw.required === true || ['true', 'yes', 'oui', '1'].includes(String(raw.required ?? '').toLowerCase()),
		options: (raw.options ?? []).map((o: any) => ({
			label: o.label ?? o.title ?? String(o.value ?? o),
			value: String(o.value ?? o),
		})),
	}
}
const fields = computed<Field[]>(() => (props.fields ?? []).map(normalizeField))

const values = reactive<Record<string, string | boolean>>({})
const done = ref(false)
const error = ref('')
const sending = ref(false)

async function submit() {
	if (!props.form_name || sending.value) return
	sending.value = true
	error.value = ''
	try {
		const response = await fetch(`/api/form/submit/${props.form_name}`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json' },
			body: JSON.stringify({ ...values, _meta: { locale: 'en' } }),
		})
		if (!response.ok) throw new Error('submit failed')
		done.value = true
	} catch {
		error.value = 'Sending failed. Please try again.'
	} finally {
		sending.value = false
	}
}
</script>

<template>
	<section class="px-2 m_px-1 py-4">
		<div class="w-1100px mx-auto measure">
			<p v-if="props.kicker" class="txt12 uppercase tracking-wider quiet m-0 mb-1">{{ props.kicker }}</p>
			<h2 v-if="props.title" class="txt-32 line-height-12 m-0">{{ props.title }}</h2>
			<p v-if="props.body" class="line-height-15 m-0 mt-1">{{ props.body }}</p>
			<p v-if="done" class="line-height-15 mt-2">{{ props.success_message }}</p>
			<form v-else class="grid gap-1 mt-2" @submit.prevent="submit">
				<template v-for="field in fields" :key="field.name">
					<label v-if="field.kind === 'checkbox'" class="flex gap-075 align-items-center">
						<Checkbox v-model="values[field.name]" />
						<span>{{ field.title }}</span>
					</label>
					<SelectBtn v-else-if="field.kind === 'choice'" v-model="values[field.name]" :label="field.title" :options="field.options" />
					<TextInput v-else v-model="values[field.name]" underlined :label="field.title" :type="field.kind === 'textarea' ? 'text' : field.kind" :multiline="field.kind === 'textarea'" :rows="field.kind === 'textarea' ? 4 : undefined" :required="field.required" />
				</template>
				<p v-if="error" class="m-0">{{ error }}</p>
				<Btn type="submit" :value="props.submit_label" :disabled="sending" />
			</form>
		</div>
	</section>
</template>
