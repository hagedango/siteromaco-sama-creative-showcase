import { describe, expect, it } from 'vitest';
import { getCategoryLabel, workCategories } from '../../src/data/categories';

describe('work categories', () => {
  it('keeps the seven approved categories unique', () => {
    const slugs = workCategories.map(({ slug }) => slug);
    expect(workCategories).toHaveLength(7);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it('returns the Japanese presentation label', () => {
    expect(getCategoryLabel('motion-comic')).toBe('モーションコミック');
  });
});
