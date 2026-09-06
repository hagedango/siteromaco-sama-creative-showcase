export const workCategories = [
  { slug: 'four-panel', label: '4コマ漫画', shortLabel: '読ませる' },
  { slug: 'motion-comic', label: 'モーションコミック', shortLabel: '動かす' },
  { slug: 'ai-animation', label: 'AIアニメ', shortLabel: '演じさせる' },
  { slug: 'sizzle', label: 'シズル', shortLabel: '惹きつける' },
  { slug: 'short-video', label: '縦型ショート', shortLabel: '届ける' },
  { slug: 'education', label: '講座', shortLabel: '教える' },
  { slug: 'latest-ai', label: '最新AI映像', shortLabel: '更新する' },
] as const;

export type WorkCategory = (typeof workCategories)[number]['slug'];

export const workCategorySlugs = workCategories.map(({ slug }) => slug) as [
  WorkCategory,
  ...WorkCategory[],
];

export function getCategoryLabel(slug: WorkCategory): string {
  return workCategories.find((category) => category.slug === slug)?.label ?? slug;
}
