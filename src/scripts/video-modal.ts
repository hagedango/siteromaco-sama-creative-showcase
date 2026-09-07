export function youtubeEmbedUrl(id: string): string {
  if (!/^[A-Za-z0-9_-]{11}$/.test(id)) throw new Error('Invalid YouTube id');
  return `https://www.youtube-nocookie.com/embed/${id}?autoplay=1&rel=0&playsinline=1`;
}

export function bindVideoModal(dialog: HTMLDialogElement, doc: Document = document) {
  const player = dialog.querySelector<HTMLElement>('[data-video-player]')!;
  const title = dialog.querySelector<HTMLElement>('#video-modal-title')!;
  const closeButton = dialog.querySelector<HTMLButtonElement>('[data-video-close]')!;
  const external = dialog.querySelector<HTMLAnchorElement>('[data-video-external]')!;
  const share = dialog.querySelector<HTMLAnchorElement>('[data-video-share]')!;
  let opener: HTMLAnchorElement | null = null;
  let previousOverflow = '';
  let previousBodyOverflow = '';
  let locked = false;

  function cleanup() {
    player.replaceChildren(); // Removing the frame also stops audio and playback.
    if (locked) {
      doc.documentElement.style.overflow = previousOverflow;
      doc.body.style.overflow = previousBodyOverflow;
      locked = false;
    }
    if (opener?.isConnected) opener.focus({ preventScroll: true });
    opener = null;
  }
  function close() {
    if (dialog.open) dialog.close();
    cleanup();
  }
  function open(link: HTMLAnchorElement) {
    const id = link.dataset.youtubeId;
    if (!id || typeof dialog.showModal !== 'function') return false;
    let src: string;
    try {
      src = youtubeEmbedUrl(id);
    } catch {
      return false;
    }
    const frame = doc.createElement('iframe');
    frame.src = src;
    frame.title = link.dataset.videoTitle || 'ロマ子様の動画';
    frame.allow = 'autoplay; encrypted-media; picture-in-picture; fullscreen';
    frame.allowFullscreen = true;
    frame.referrerPolicy = 'strict-origin-when-cross-origin';
    title.textContent = frame.title;
    external.href = `https://www.youtube.com/watch?v=${id}`;
    const shareUrl = new URL('https://twitter.com/intent/tweet');
    shareUrl.searchParams.set('text', `${frame.title}｜Romaco-sama Creative Showcase`);
    shareUrl.searchParams.set('url', external.href);
    share.href = shareUrl.href;
    opener = link;
    if (!locked) {
      previousOverflow = doc.documentElement.style.overflow;
      previousBodyOverflow = doc.body.style.overflow;
      locked = true;
    }
    doc.documentElement.style.overflow = 'hidden';
    doc.body.style.overflow = 'hidden';
    try {
      if (!dialog.open) dialog.showModal();
      player.replaceChildren(frame);
      closeButton.focus();
      return true;
    } catch {
      close();
      return false;
    }
  }
  doc.addEventListener('click', (event) => {
    if (
      event.defaultPrevented ||
      event.ctrlKey ||
      event.metaKey ||
      event.shiftKey ||
      event.altKey ||
      event.button !== 0
    )
      return;
    const link = (event.target as Element | null)?.closest<HTMLAnchorElement>('a[data-youtube-id]');
    if (link && open(link)) event.preventDefault();
  });
  closeButton.addEventListener('click', close);
  dialog.addEventListener('cancel', (event) => {
    event.preventDefault();
    close();
  });
  dialog.addEventListener('close', () => {
    if (!dialog.open) cleanup();
  });
  // Native dialog makes the rest of the page inert and traps keyboard focus.
  let backdropDown = false;
  dialog.addEventListener('pointerdown', (event) => {
    backdropDown = event.target === dialog;
  });
  dialog.addEventListener('click', (event) => {
    if (backdropDown && event.target === dialog) close();
    backdropDown = false;
  });
  return { open, close };
}
