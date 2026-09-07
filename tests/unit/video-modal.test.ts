import { describe, expect, it, vi } from 'vitest';
import { bindVideoModal, youtubeEmbedUrl } from '../../src/scripts/video-modal';

// DOM boundary doubles let us test lifecycle and navigation without loading YouTube.
class NodeDouble extends EventTarget {
  open = false;
  isConnected = true;
  dataset: Record<string, string> = {};
  style = { overflow: '' };
  children: NodeDouble[] = [];
  nodes = new Map<string, NodeDouble>();
  textContent = '';
  title = '';
  src = '';
  href = '';
  focus = vi.fn();
  querySelector(selector: string) { return this.nodes.get(selector); }
  closest() { return this; }
  replaceChildren(...children: NodeDouble[]) { this.children = children; }
  showModal() { this.open = true; }
  close() { this.open = false; this.dispatchEvent(new Event('close')); }
}
function fixture() {
  const dialog = new NodeDouble();
  const player = new NodeDouble();
  const button = new NodeDouble();
  const external = new NodeDouble();
  const share = new NodeDouble();
  dialog.nodes.set('[data-video-player]', player);
  dialog.nodes.set('#video-modal-title', new NodeDouble());
  dialog.nodes.set('[data-video-close]', button);
  dialog.nodes.set('[data-video-external]', external);
  dialog.nodes.set('[data-video-share]', share);
  const root = new NodeDouble();
  const body = new NodeDouble();
  root.style.overflow = 'scroll';
  body.style.overflow = 'clip';
  const doc = Object.assign(new NodeDouble(), {
    documentElement: root, body, createElement: () => new NodeDouble(),
  });
  const link = new NodeDouble();
  link.dataset = { youtubeId: 'aHuVB-HqrlA', videoTitle: 'ロマ子様MV『能登の光』' };
  const controller = bindVideoModal(dialog as unknown as HTMLDialogElement, doc as unknown as Document);
  function click(modifiers = {}) {
    const event = new Event('click', { cancelable: true });
    Object.defineProperties(event, {
      target: { value: link }, button: { value: 0 },
      ...Object.fromEntries(Object.entries(modifiers).map(([key,value]) => [key,{value}])),
    });
    doc.dispatchEvent(event);
    return event;
  }
  return { dialog, player, button, external, share, root, body, link, controller, click };
}

describe('video modal', () => {
  it('intercepts a normal click, mounts an autoplay embed and locks page scrolling', () => {
    const f = fixture();
    expect(f.click().defaultPrevented).toBe(true);
    expect(f.dialog.open).toBe(true);
    expect(f.player.children).toHaveLength(1);
    expect(f.player.children[0]?.src).toBe('https://www.youtube-nocookie.com/embed/aHuVB-HqrlA?autoplay=1&rel=0&playsinline=1');
    expect(f.root.style.overflow).toBe('hidden');
    expect(f.body.style.overflow).toBe('hidden');
    expect(f.button.focus).toHaveBeenCalledOnce();
    const share = new URL(f.share.href);
    expect(share.searchParams.get('url')).toBe(f.external.href);
    expect(share.searchParams.get('text')).toContain('能登の光');
  });
  for (const method of ['button', 'escape', 'backdrop'] as const) {
    it(`stops playback and restores focus/scroll after ${method} close`, () => {
      const f = fixture();
      f.click();
      if (method === 'button') f.button.dispatchEvent(new Event('click'));
      if (method === 'escape') {
        const event = new Event('cancel', { cancelable: true });
        f.dialog.dispatchEvent(event);
        expect(event.defaultPrevented).toBe(true);
      }
      if (method === 'backdrop') {
        f.dialog.dispatchEvent(new Event('pointerdown'));
        f.dialog.dispatchEvent(new Event('click'));
      }
      expect(f.dialog.open).toBe(false);
      expect(f.player.children).toHaveLength(0);
      expect(f.root.style.overflow).toBe('scroll');
      expect(f.body.style.overflow).toBe('clip');
      expect(f.link.focus).toHaveBeenCalledWith({ preventScroll: true });
    });
  }
  it('retains native navigation for modifiers and invalid video ids', () => {
    const f = fixture();
    expect(f.click({ ctrlKey: true }).defaultPrevented).toBe(false);
    f.link.dataset.youtubeId = 'invalid/../url';
    expect(f.click().defaultPrevented).toBe(false);
    expect(f.dialog.open).toBe(false);
    expect(f.player.children).toHaveLength(0);
  });
  it('does not close from content clicks or remove a reopened player on a queued close event', () => {
    const f = fixture();
    f.click();
    f.dialog.dispatchEvent(new Event('click'));
    expect(f.dialog.open).toBe(true);
    f.controller.close();
    f.click();
    f.dialog.dispatchEvent(new Event('close'));
    expect(f.player.children).toHaveLength(1);
  });
  it('rejects unsafe ids and supports shorts ids', () => {
    expect(() => youtubeEmbedUrl('https://bad')).toThrow();
    expect(youtubeEmbedUrl('qfpKfBIuMc4')).toContain('qfpKfBIuMc4?autoplay=1');
  });
});
