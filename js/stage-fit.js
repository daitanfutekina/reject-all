export function sceneScale(width, height, availableWidth, availableHeight) {
  if (width <= 0 || height <= 0 || availableWidth <= 0 || availableHeight <= 0) return 1;
  return Math.min(1, availableWidth / width, availableHeight / height);
}

// Transform only the simulated page: pointer coordinates still use its rendered
// bounds, and the deliberate terms-box scroll remains part of SCROLL gameplay.
export function attachStageFit(host, site) {
  if (typeof ResizeObserver === 'undefined') return { refresh() {}, disconnect() {} };
  const desktop = matchMedia('(pointer: fine)');
  const refresh = () => {
    if (!desktop.matches) { site.style.transform = ''; site.style.width = ''; site.style.minHeight = ''; return; }
    const availableWidth = host.clientWidth - 2, availableHeight = host.clientHeight - 2;
    if (availableWidth <= 0 || availableHeight <= 0) return;
    site.style.width = `${availableWidth}px`; site.style.minHeight = `${availableHeight}px`;
    let scale = 1;
    // Reflow tall pages into a larger logical viewport before scaling. Both
    // dimensions then fill the frame instead of leaving a thin centered strip.
    for (let pass = 0; pass < 3; pass++) {
      const next = sceneScale(Math.max(site.offsetWidth, site.scrollWidth), Math.max(site.offsetHeight, site.scrollHeight), availableWidth, availableHeight);
      if (Math.abs(next - scale) < .001) break;
      scale = next;
      site.style.width = `${availableWidth / scale}px`; site.style.minHeight = `${availableHeight / scale}px`;
    }
    const width = Math.max(site.offsetWidth, site.scrollWidth);
    const height = Math.max(site.offsetHeight, site.scrollHeight);
    scale = sceneScale(width, height, availableWidth, availableHeight);
    const x = Math.max(0, (host.clientWidth - width * scale) / 2);
    const y = Math.max(0, (host.clientHeight - height * scale) / 2);
    site.style.transform = `translate(${x}px, ${y}px) scale(${scale})`;
  };
  const observer = new ResizeObserver(refresh);
  observer.observe(host); observer.observe(site);
  desktop.addEventListener('change', refresh); refresh();
  return { refresh, disconnect() { observer.disconnect(); desktop.removeEventListener('change', refresh); } };
}
