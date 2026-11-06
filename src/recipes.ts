/**
 * Page recipes. A recipe is an ordered list of blocks that already exist in the
 * renderer. The agent fills props. It does not invent blocks for these.
 */
export const recipes = {
	offer: ['Hero', 'FeatureGrid', 'CardGrid', 'Steps', 'QuoteList', 'FormBlock'],
	editorial: ['Hero', 'FeatureGrid', 'QuoteList', 'FormBlock'],
	contact: ['PageHero', 'FormBlock'],
} as const
