const tabButtons = [...document.querySelectorAll('.tab-btn')];
const tabPanels = [...document.querySelectorAll('.tab-panel')];

const metricTargets = [
  { id: 'dieselReduced', value: 1102000, formatter: value => `${value.toLocaleString('en-US')}` },
  { id: 'costReduction', value: 4628000, formatter: value => `$${value.toLocaleString('en-US')}` },
  { id: 'co2Reduced', value: 11190, formatter: value => `${value.toLocaleString('en-US')} metric tons` },
  { id: 'tripsEliminated', value: 7850, formatter: value => `${value.toLocaleString('en-US')}` },
  { id: 'communityDeliveries', value: 12400, formatter: value => `${value.toLocaleString('en-US')}` },
  { id: 'jobsSupported', value: 1560, formatter: value => `${value.toLocaleString('en-US')}` }
];

function activateTab(tabName) {
  tabButtons.forEach(button => {
    const isActive = button.dataset.tab === tabName;
    button.classList.toggle('active', isActive);
    button.setAttribute('aria-selected', String(isActive));
  });

  tabPanels.forEach(panel => {
    const isActive = panel.dataset.panel === tabName;
    panel.classList.toggle('active', isActive);
    panel.hidden = !isActive;
  });
}

tabButtons.forEach(button => {
  button.addEventListener('click', () => activateTab(button.dataset.tab));
});

function animateMetric(element, endValue, formatter) {
  const duration = 900;
  const startTime = performance.now();

  function tick(now) {
    const progress = Math.min((now - startTime) / duration, 1);
    const eased = 1 - (1 - progress) * (1 - progress);
    const current = Math.round(endValue * eased);
    element.textContent = formatter(current);

    if (progress < 1) {
      requestAnimationFrame(tick);
    }
  }

  requestAnimationFrame(tick);
}

function initMetrics() {
  metricTargets.forEach(target => {
    const element = document.getElementById(target.id);
    if (!element) {
      return;
    }

    element.textContent = '—';
    animateMetric(element, target.value, target.formatter);
  });
}

activateTab('fleet');
initMetrics();
