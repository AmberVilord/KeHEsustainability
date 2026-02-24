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
  { id: 'savingsPerTruck', value: 6000, formatter: value => `$${value.toLocaleString('en-US')}` },
  { id: 'fleetSavings', value: 3000000, formatter: value => `$${value.toLocaleString('en-US')}` },
  { id: 'fleetCo2Reduced', value: 7500, formatter: value => `${value.toLocaleString('en-US')} metric tons` }
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
  const gallonsSavedPerTruckInput = document.getElementById('simAnnualMiles');
  const co2PerGallonInput = document.getElementById('simMpg');
  const dieselPriceInput = document.getElementById('simDieselPrice');

  if (!fleetInput || !gallonsSavedPerTruckInput || !co2PerGallonInput || !dieselPriceInput) {
    return;
  }

  const fleetValue = document.getElementById('simFleetSizeValue');
  const gallonsSavedPerTruckValue = document.getElementById('simAnnualMilesValue');
  const co2PerGallonValue = document.getElementById('simMpgValue');
  const dieselPriceValue = document.getElementById('simDieselPriceValue');

  const gallonsSavedOutput = document.getElementById('simGallonsSaved');
  const costSavedOutput = document.getElementById('simCostSaved');
  const co2SavedOutput = document.getElementById('simCo2Saved');

  const formatWhole = value => Math.round(value).toLocaleString('en-US');

  function updateSimulator() {
    const fleet = Number(fleetInput.value);
    const gallonsSavedPerTruck = Number(gallonsSavedPerTruckInput.value);
    const co2PerGallon = Number(co2PerGallonInput.value);
    const dieselPrice = Number(dieselPriceInput.value);

    fleetValue.textContent = formatWhole(fleet);
    gallonsSavedPerTruckValue.textContent = formatWhole(gallonsSavedPerTruck);
    co2PerGallonValue.textContent = co2PerGallon.toFixed(1);
    dieselPriceValue.textContent = `$${dieselPrice.toFixed(2)}`;

    const gallonsSaved = fleet * gallonsSavedPerTruck;
    const costSaved = gallonsSaved * dieselPrice;
    const co2MetricTons = (gallonsSaved * co2PerGallon) / 2204.62;

    gallonsSavedOutput.textContent = `${formatWhole(gallonsSaved)} gallons`;
    costSavedOutput.textContent = `$${formatWhole(costSaved)}`;
    co2SavedOutput.textContent = `${formatWhole(co2MetricTons)} metric tons CO₂`;
  }

  [fleetInput, gallonsSavedPerTruckInput, co2PerGallonInput, dieselPriceInput].forEach(input => {
    input.addEventListener('input', updateSimulator);
  });

  updateSimulator();
}

activateTab('fleet');
initMetrics();
initImpactSimulator();
ensureCompetitionFooter();
