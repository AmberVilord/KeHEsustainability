const tabButtons = [...document.querySelectorAll('.tab-btn')];
const tabPanels = [...document.querySelectorAll('.tab-panel')];

function ensureCompetitionFooter() {
  if (document.querySelector('.competition-footer')) {
    return;
  }

  const footer = document.createElement('p');
  footer.className = 'competition-footer';
  footer.textContent = 'This is a competition concept created by Amber Vilord: A GCA coding student at the University of Missouri- Columbia 2026';
  document.body.appendChild(footer);
}

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

function initImpactSimulator() {
  const fleetInput = document.getElementById('simFleetSize');
  const annualMilesInput = document.getElementById('simAnnualMiles');
  const mpgInput = document.getElementById('simMpg');
  const dieselPriceInput = document.getElementById('simDieselPrice');
  const efficiencyToggle = document.getElementById('simEfficiencyToggle');
  const railToggle = document.getElementById('simRailToggle');

  if (!fleetInput || !annualMilesInput || !mpgInput || !dieselPriceInput || !efficiencyToggle || !railToggle) {
    return;
  }

  const fleetValue = document.getElementById('simFleetSizeValue');
  const annualMilesValue = document.getElementById('simAnnualMilesValue');
  const mpgValue = document.getElementById('simMpgValue');
  const dieselPriceValue = document.getElementById('simDieselPriceValue');

  const gallonsSavedOutput = document.getElementById('simGallonsSaved');
  const costSavedOutput = document.getElementById('simCostSaved');
  const co2SavedOutput = document.getElementById('simCo2Saved');

  const formatWhole = value => Math.round(value).toLocaleString('en-US');

  function updateSimulator() {
    const fleet = Number(fleetInput.value);
    const miles = Number(annualMilesInput.value);
    const mpg = Number(mpgInput.value);
    const dieselPrice = Number(dieselPriceInput.value);

    fleetValue.textContent = formatWhole(fleet);
    annualMilesValue.textContent = formatWhole(miles);
    mpgValue.textContent = mpg.toFixed(1);
    dieselPriceValue.textContent = `$${dieselPrice.toFixed(2)}`;

    const baselineGallons = (fleet * miles) / mpg;
    let savingsRate = 0.08;

    if (efficiencyToggle.checked) {
      savingsRate += 0.1;
    }
    if (railToggle.checked) {
      savingsRate += 0.12;
    }

    const gallonsSaved = baselineGallons * savingsRate;
    const costSaved = gallonsSaved * dieselPrice;
    const co2MetricTons = (gallonsSaved * 22.38) / 2204.62;

    gallonsSavedOutput.textContent = `${formatWhole(gallonsSaved)} gallons`;
    costSavedOutput.textContent = `$${formatWhole(costSaved)}`;
    co2SavedOutput.textContent = `${formatWhole(co2MetricTons)} metric tons CO₂`;
  }

  [fleetInput, annualMilesInput, mpgInput, dieselPriceInput].forEach(input => {
    input.addEventListener('input', updateSimulator);
  });

  [efficiencyToggle, railToggle].forEach(toggle => {
    toggle.addEventListener('change', updateSimulator);
  });

  updateSimulator();
}

activateTab('fleet');
initMetrics();
initImpactSimulator();
ensureCompetitionFooter();
