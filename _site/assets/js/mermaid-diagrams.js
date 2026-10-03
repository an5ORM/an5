/* Shared Mermaid renderer for every documentation page. */
(async () => {
  const blocks = [...document.querySelectorAll('.docs-body pre code.language-mermaid, .docs-body .language-mermaid pre code, .docs-body pre.mermaid')];
  if (!blocks.length) return;
  const cards = blocks.map(code => {
    const source = code.textContent;
    const pre = code.closest('pre');
    const card = document.createElement('section');
    card.className = 'arch-diagram-card diagram-viewer';
    const controls = document.createElement('div');
    controls.className = 'diagram-controls';
    const button = document.createElement('button');
    button.type = 'button'; button.textContent = 'Actual size';
    const mobile = window.matchMedia('(max-width: 768px)').matches;
    card.classList.toggle('diagram-expanded', mobile);
    button.setAttribute('aria-pressed', String(mobile));
    button.textContent = mobile ? 'Fit to screen' : 'Actual size';
    button.addEventListener('click', () => {
      const expanded = button.getAttribute('aria-pressed') !== 'true';
      card.classList.toggle('diagram-expanded', expanded);
      card.classList.toggle('diagram-fit', !expanded);
      button.setAttribute('aria-pressed', String(expanded));
      button.textContent = expanded ? 'Fit to screen' : 'Actual size';
    });
    controls.append(button);
    const zoomOut = action('−', 'Zoom out');
    const zoomIn = action('+', 'Zoom in');
    const download = action('Download SVG', 'Download diagram as SVG');
    const status = document.createElement('span');
    status.className = 'diagram-status'; status.setAttribute('aria-live', 'polite');
    controls.append(zoomOut, zoomIn, status, download);
    function action(label, title) {
      const control = document.createElement('button'); control.type = 'button';
      control.textContent = label; control.setAttribute('aria-label', title);
      control.disabled = true; return control;
    }
    const viewport = document.createElement('div');
    viewport.className = 'diagram-viewport'; viewport.tabIndex = 0;
    viewport.setAttribute('role', 'region'); viewport.setAttribute('aria-label', 'Diagram; scroll to explore');
    const diagram = document.createElement('div'); diagram.className = 'mermaid'; diagram.textContent = source;
    viewport.append(diagram); card.append(controls, viewport); pre.replaceWith(card);
    let scale = 1;
    let naturalWidth = 0;
    const zoom = delta => {
      if (!naturalWidth) return;
      if (!card.classList.contains('diagram-expanded')) scale = viewport.clientWidth / naturalWidth;
      scale = Math.max(0.25, Math.min(3, Math.round((scale + delta) * 100) / 100));
      card.classList.add('diagram-expanded'); card.classList.remove('diagram-fit');
      button.setAttribute('aria-pressed', 'true'); button.textContent = 'Fit to screen';
      diagram.style.width = `${naturalWidth * scale}px`;
      diagram.style.minWidth = '0';
      status.textContent = `${Math.round(scale * 100)}%`;
      zoomOut.disabled = scale <= 0.25; zoomIn.disabled = scale >= 3;
    };
    zoomOut.addEventListener('click', () => zoom(-0.25));
    zoomIn.addEventListener('click', () => zoom(0.25));
    button.addEventListener('click', () => {
      diagram.style.removeProperty('width'); diagram.style.removeProperty('min-width');
      scale = 1; status.textContent = ''; zoomOut.disabled = zoomIn.disabled = !naturalWidth;
    });
    download.addEventListener('click', () => {
      const svg = diagram.querySelector('svg'); if (!svg) return;
      const copy = svg.cloneNode(true);
      const originals = [svg, ...svg.querySelectorAll('*')];
      const clones = [copy, ...copy.querySelectorAll('*')];
      originals.forEach((element, index) => {
        const style = getComputedStyle(element);
        for (const property of ['fill', 'stroke', 'stroke-width', 'color', 'font-family', 'font-size', 'font-weight', 'background-color']) {
          clones[index].style.setProperty(property, style.getPropertyValue(property));
        }
      });
      copy.setAttribute('xmlns', 'http://www.w3.org/2000/svg');
      copy.setAttribute('width', String(svg.viewBox.baseVal.width));
      copy.setAttribute('height', String(svg.viewBox.baseVal.height));
      copy.style.removeProperty('max-width'); copy.style.removeProperty('width'); copy.style.removeProperty('height');
      const url = URL.createObjectURL(new Blob([new XMLSerializer().serializeToString(copy)], {type: 'image/svg+xml;charset=utf-8'}));
      const link = document.createElement('a'); link.href = url; link.download = `an5-diagram-${cards.indexOf(entry) + 1}.svg`;
      document.body.append(link); link.click(); link.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    });
    const entry = {card, diagram, source, button, controls, ready(width) {
      naturalWidth = width;
      button.disabled = false; zoomOut.disabled = zoomIn.disabled = !width; download.disabled = false;
    }};
    button.disabled = true;
    return entry;
  });
  try {
    if (!window.mermaid) await new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/mermaid@10.9.5/dist/mermaid.min.js';
      script.onload = resolve; script.onerror = () => reject(new Error('Diagram library unavailable'));
      document.head.append(script);
    });
    if (document.fonts) await document.fonts.ready;
    mermaid.initialize({startOnLoad: false, securityLevel: 'strict', theme: 'base',
          themeVariables: {
            darkMode: true,
            fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
            fontSize: '13px',
            background: '#0d1220',
            primaryColor: '#141c2e',
            primaryTextColor: '#f8fafc',
            primaryBorderColor: 'rgba(56, 189, 248, 0.35)',
            lineColor: '#6366f1',
            secondaryColor: '#0a0f1d',
            secondaryTextColor: '#cbd5e1',
            secondaryBorderColor: 'rgba(99, 102, 241, 0.35)',
            tertiaryColor: '#070b14',
            tertiaryTextColor: '#94a3b8',
            tertiaryBorderColor: 'rgba(255, 255, 255, 0.08)',
            mainBkg: '#141c2e',
            secondBkg: '#0a0f1d',
            nodeBorder: 'rgba(56, 189, 248, 0.35)',
            clusterBkg: 'rgba(10, 15, 29, 0.7)',
            clusterBorder: 'rgba(56, 189, 248, 0.22)',
            titleColor: '#38bdf8',
            edgeLabelBackground: '#070b14',
            nodeTextColor: '#f8fafc'
          }
    });
    for (const entry of cards) {
      try {
        await mermaid.run({nodes: [entry.diagram]});
        const svg = entry.diagram.querySelector('svg');
        if (svg) {
          const width = svg.viewBox.baseVal.width;
          if (width) entry.diagram.style.setProperty('--diagram-width', `${width}px`);
          entry.ready(width);
        }
      } catch (error) { fallback(entry); console.error('Mermaid render error:', error); }
    }
  } catch (error) { cards.forEach(fallback); console.error('Mermaid load error:', error); }
  function fallback(entry) {
    entry.controls.hidden = true;
    const pre = document.createElement('pre'); pre.textContent = entry.source;
    entry.diagram.replaceChildren(pre);
    const message = document.createElement('p'); message.textContent = 'Diagram unavailable. Source is shown below.';
    entry.card.prepend(message);
  }
})();
