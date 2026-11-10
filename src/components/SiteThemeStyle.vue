<script setup lang="ts">
import { computed, h, inject } from 'vue'
import { readBloxHydration, useGlobalBlock } from '@bagelink/blox'
import { SITE_THEME_KEY, themeCss, themeFromContexts, type SiteThemeProps } from '../theme'

const { data } = useGlobalBlock<SiteThemeProps>('SiteTheme')
const provided = inject(SITE_THEME_KEY, null)

const theme = computed(() =>
	data.value
	?? provided?.value
	?? themeFromContexts(readBloxHydration()?.route?.resolved?.contexts),
)
const css = computed(() => theme.value ? themeCss(theme.value) : '')
const ThemeStyle = () => css.value ? h('style', css.value) : null
</script>

<template>
	<ThemeStyle />
</template>
