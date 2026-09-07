import { describe, expect, it } from 'vitest';
import episodes from '../../src/content/episodes.json';
import works from '../../src/content/works.json';
import { validateContentGraph, type GraphWork } from '../../src/data/content-graph';

const copy = () => structuredClone(works) as GraphWork[];
describe('content relationships', () => {
  it('validates the real catalog and keeps the supplied videos unique', () => {
    expect(() => validateContentGraph(episodes, works)).not.toThrow();
    for (const id of ['aHuVB-HqrlA', '1PVJ6SJkLHo', '4Gqv7d6ShXA', 'qfpKfBIuMc4', 'C4k87y6XJJQ']) {
      expect(works.filter((work) => work.media.youtubeId === id)).toHaveLength(1);
    }
    expect(works.find((work) => work.media.youtubeId === '4Gqv7d6ShXA')?.episodeId).toBe('EP-0001');
    expect(works.find((work) => work.media.youtubeId === 'C4k87y6XJJQ')?.episodeId).toBe('EP-0005');
  });
  it('rejects missing, unverified, or cross-episode relationships', () => {
    const missing = copy();
    missing[0]!.episodeId = 'EP-9999';
    expect(() => validateContentGraph(episodes, missing)).toThrow(/episode/);
    const unverified = copy();
    unverified[0]!.relationshipVerified = false;
    expect(() => validateContentGraph(episodes, unverified)).toThrow(/episode/);
    const cross = copy();
    cross[0]!.parentWorkIds = [cross.find((work) => work.episodeId === 'EP-0004')!.id];
    expect(() => validateContentGraph(episodes, cross)).toThrow(/parent/);
  });
  it('rejects cycles, duplicate media, and missing source images', () => {
    const cycle = copy();
    cycle[0]!.parentWorkIds = [cycle[0]!.id];
    expect(() => validateContentGraph(episodes, cycle)).toThrow(/Cyclic/);
    const duplicate = copy();
    duplicate.push({ ...duplicate[0]!, id: 'duplicate' });
    expect(() => validateContentGraph(episodes, duplicate)).toThrow(/Duplicate media/);
    const image = copy();
    image[0]!.sourceImageIds = ['missing'];
    expect(() => validateContentGraph(episodes, image)).toThrow(/source image/);
  });
});
