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
	name: $.text('Champ'),
	title: $.text('Libellé'),
	kind: $.text('Type'),
	required: $.text('Requis'),
	options: $.array('Options', defineSchema({
		label: $.text('Libellé'),
		value: $.text('Valeur'),
	})),
})

const schema = defineSchema<Props>({
	kicker: $.text('Kicker'),
	title: $.text('Titre'),
	body: $.textarea('Texte'),
	form_name: $.text('Définition de formulaire'),
	submit_label: $.text('Bouton'),
	success_message: $.text('Message de confirmation'),
	fields: $.array('Champs', fieldSchema, { collapsible: true }),
})

defineBlock({
	name: 'FormBlock',
	label: 'Formulaire',
	icon: 'assignment',
	category: 'form',
	description: 'Rend une définition de formulaire publique avec des champs Bagelink.',
	schema,
	defaults: {},
})

const props = withDefaults(defineProps<Props>(), {
	submit_label: 'Envoyer',
	success_message: 'Merci. Nous vous répondrons.',
})

// The agent writes fields as {name, label, type} or {name, title, kind}. Accept
// both, and map `type` values ('text'|'textarea'|'email'|'phone'|'checkbox') onto
// `kind`. A checkbox or `type: 'checkbox'` renders a Checkbox; a select renders
// when options are present.
function normalizeField(raw: any): Field {
	const kindRaw = (raw.kind ?? raw.type ?? 'text').toLowerCase()
	const hasOptions = Array.isArray(raw.options) && raw.options.length > 0
	const kind: Field['kind'] = hasOptions
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
		required: Boolean(raw.required),
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
		error.value = "L'envoi a échoué. Réessayez."
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
					<TextInput v-else v-model="values[field.name]" underlined :label="field.title" :type="field.kind === 'textarea' ? 'textarea' : field.kind" :required="field.required" />
				</template>
				<p v-if="error" class="m-0">{{ error }}</p>
				<Btn type="submit" :value="props.submit_label" :disabled="sending" />
			</form>
		</div>
	</section>
</template>
