export interface GraphWork {
  id: string;
  collection: string;
  episodeId?: string;
  originalGroup?: string;
  parentWorkIds: string[];
  sourceImageIds?: string[];
  relationshipVerified: boolean;
  media: { type: string; youtubeId?: string; images?: string[] };
}

/** Fail the build instead of silently connecting a work to the wrong source. */
export function validateContentGraph(
  episodes: { id: string }[],
  works: GraphWork[],
  images: { id: string }[] = [],
): void {
  const episodeIds = new Set(episodes.map((entry) => entry.id));
  const imageIds = new Set(images.map((entry) => entry.id));
  const byId = new Map(works.map((entry) => [entry.id, entry]));
  if (
    episodeIds.size !== episodes.length ||
    byId.size !== works.length ||
    imageIds.size !== images.length
  ) {
    throw new Error('Duplicate content id');
  }
  const mediaIds = new Set<string>();
  for (const work of works) {
    if (work.collection === 'article-derived') {
      if (
        !work.episodeId ||
        !episodeIds.has(work.episodeId) ||
        !work.relationshipVerified ||
        work.originalGroup
      ) {
        throw new Error(`Invalid episode relationship: ${work.id}`);
      }
    } else if (work.episodeId || !work.originalGroup) {
      throw new Error(`Invalid original group: ${work.id}`);
    }
    for (const parentId of work.parentWorkIds) {
      const parent = byId.get(parentId);
      if (!parent || parent.episodeId !== work.episodeId || !work.relationshipVerified) {
        throw new Error(`Invalid parent relationship: ${work.id}`);
      }
    }
    for (const imageId of work.sourceImageIds ?? []) {
      if (!imageIds.has(imageId) || !work.relationshipVerified)
        throw new Error(`Invalid source image: ${work.id}`);
    }
    const key = work.media.youtubeId ?? work.media.images?.[0];
    if (key) {
      if (mediaIds.has(key)) throw new Error(`Duplicate media: ${key}`);
      mediaIds.add(key);
    }
  }
  const visiting = new Set<string>();
  const done = new Set<string>();
  function visit(id: string) {
    if (visiting.has(id)) throw new Error(`Cyclic work relationship: ${id}`);
    if (done.has(id)) return;
    visiting.add(id);
    byId.get(id)?.parentWorkIds.forEach(visit);
    visiting.delete(id);
    done.add(id);
  }
  works.forEach((work) => visit(work.id));
}

export const formatLabels = {
  comic: '4コマ漫画',
  'motion-comic': '動く4コマ',
  short: 'ショート動画',
  lecture: '講座動画',
  video: '映像作品',
} as const;
