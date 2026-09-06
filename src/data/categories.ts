export const workCategories = [
  { slug: 'four-panel', label: '4コマ漫画', shortLabel: '読ませる' },
  { slug: 'short-video', label: 'ショート動画', shortLabel: '届ける' },
  { slug: 'education', label: '講座動画', shortLabel: '教える' },
  { slug: 'sizzle', label: '料理シネマ', shortLabel: '惹きつける' },
  { slug: 'remotion', label: 'Remotion', shortLabel: '動かす' },
  { slug: 'source-essay', label: '原典エッセイ', shortLabel: '読む' },
] as const;

export type WorkCategory = (typeof workCategories)[number]['slug'];

export const workCategorySlugs = workCategories.map(({ slug }) => slug) as [
  WorkCategory,
  ...WorkCategory[],
];

export function getCategoryLabel(slug: WorkCategory): string {
  return workCategories.find((category) => category.slug === slug)?.label ?? slug;
}
