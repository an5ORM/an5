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
    const viewport = document.createElement('div');
    viewport.className = 'diagram-viewport'; viewport.tabIndex = 0;
    viewport.setAttribute('role', 'region'); viewport.setAttribute('aria-label', 'Diagram; scroll to explore');
    const diagram = document.createElement('div'); diagram.className = 'mermaid'; diagram.textContent = source;
    viewport.append(diagram); card.append(controls, viewport); pre.replaceWith(card);
    return {card, diagram, source, button};
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
        }
      } catch (error) { fallback(entry); console.error('Mermaid render error:', error); }
    }
  } catch (error) { cards.forEach(fallback); console.error('Mermaid load error:', error); }
  function fallback(entry) {
    entry.button.hidden = true;
    const pre = document.createElement('pre'); pre.textContent = entry.source;
    entry.diagram.replaceChildren(pre);
    const message = document.createElement('p'); message.textContent = 'Diagram unavailable. Source is shown below.';
    entry.card.prepend(message);
  }
})();
