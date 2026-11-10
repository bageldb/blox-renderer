import type { InjectionKey } from 'vue'
import * as ArticleView from './components/blocks/ArticleView.vue'
import * as Bento from './components/blocks/Bento.vue'
import * as CardGrid from './components/blocks/CardGrid.vue'
import * as CtaBand from './components/blocks/CtaBand.vue'
import * as FeatureGrid from './components/blocks/FeatureGrid.vue'
import * as FeatureSplit from './components/blocks/FeatureSplit.vue'
import * as FormBlock from './components/blocks/FormBlock.vue'
import * as Hero from './components/blocks/Hero.vue'
import * as LogoStrip from './components/blocks/LogoStrip.vue'
import * as Marquee from './components/blocks/Marquee.vue'
import * as PageHero from './components/blocks/PageHero.vue'
import * as Pricing from './components/blocks/Pricing.vue'
import * as QuoteList from './components/blocks/QuoteList.vue'
import * as SiteFooter from './components/blocks/SiteFooter.vue'
import * as SiteHeader from './components/blocks/SiteHeader.vue'
import * as SiteTheme from './components/blocks/SiteTheme.vue'
import * as Stage from './components/blocks/Stage.vue'
import * as StatsBand from './components/blocks/StatsBand.vue'
import * as Steps from './components/blocks/Steps.vue'
import * as Tiles from './components/blocks/Tiles.vue'
import * as Timeline from './components/blocks/Timeline.vue'

export type BlockModules = Record<string, Record<string, unknown>>

/** Eager module namespaces retain the named metadata emitted by the Blox Vite transform. */
export const sharedBlockModules: BlockModules = {
	ArticleView, Bento, CardGrid, CtaBand, FeatureGrid, FeatureSplit, FormBlock,
	Hero, LogoStrip, Marquee, PageHero, Pricing, QuoteList, SiteFooter,
	SiteHeader, SiteTheme, Stage, StatsBand, Steps, Tiles, Timeline,
}

export const BLOCK_MODULES_KEY: InjectionKey<BlockModules> = Symbol('blox-renderer:block-modules')
