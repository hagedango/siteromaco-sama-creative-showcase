import { describe, expect, it } from 'vitest';
import { getCategoryLabel, workCategories } from '../../src/data/categories';

describe('work categories', () => {
  it('keeps the six approved filters unique', () => {
    const slugs = workCategories.map(({ slug }) => slug);
    expect(workCategories).toHaveLength(6);
    expect(new Set(slugs).size).toBe(slugs.length);
  });

  it('returns the Japanese presentation label', () => {
    expect(getCategoryLabel('remotion')).toBe('Remotion');
    expect(getCategoryLabel('source-essay')).toBe('原典エッセイ');
  });
});
