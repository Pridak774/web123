document.addEventListener("DOMContentLoaded", () => {
  const section = document.querySelector(".battery-flex-fund");
  if (!section) return;

  // Animate counters once when section scrolls into view
  const counters = section.querySelectorAll(".counter");
  const startCounters = () => {
    counters.forEach((el) => {
      if (el.classList.contains("done")) return;
      const target = parseFloat(el.dataset.target);
      const isDecimal = target % 1 !== 0;
      let count = 0;
      const step = target / 100;
      const update = () => {
        count += step;
        if (count >= target) count = target;
        el.textContent = isDecimal ? count.toFixed(1) : Math.floor(count);
        if (count < target) requestAnimationFrame(update);
      };
      el.classList.add("done");
      update();
    });
  };

  const obs = new IntersectionObserver(
    (entries) => {
      entries.forEach((e) => {
        if (e.isIntersecting) {
          startCounters();
          obs.disconnect();
        }
      });
    },
    { threshold: 0.5 }
  );

  obs.observe(section);

  // metrics‑controls toggle
  const metricBtns = document.querySelectorAll(
    ".fund-metrics-panel .metrics-control-btn"
  );
  metricBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      document
        .querySelector(".metrics-control-btn.active")
        .classList.remove("active");
      btn.classList.add("active");
      document
        .querySelectorAll(".metrics-cards .metric-card")
        .forEach((card) => (card.style.display = "none"));
      document.getElementById(`${btn.dataset.view}-metric`).style.display =
        "block";
    });
  });

  // strategy-switch toggle
  document.querySelectorAll(".strategy-switch .strategy-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      document.querySelector(".strategy-btn.active").classList.remove("active");
      btn.classList.add("active");
      document
        .querySelectorAll(".strategy-visualization")
        .forEach((v) => v.classList.add("hidden"));
      document
        .getElementById(`${btn.dataset.strategy}-viz`)
        .classList.remove("hidden");
    });
  });

  // count‑up animation
  document.querySelectorAll(".counter").forEach((el) => {
    const end = +el.dataset.target,
      step = end / 60;
    let v = 0;
    const id = setInterval(() => {
      v += step;
      el.textContent = v.toFixed(end % 1 ? 1 : 0);
      if (v >= end) {
        el.textContent = end;
        clearInterval(id);
      }
    }, 20);
  });

  // price‑spread chart stub (hook real data here)
  const psCtx = document.getElementById("priceSpreadChart")?.getContext("2d");
  if (psCtx)
    new Chart(psCtx, {
      type: "line",
      data: { labels: [], datasets: [] },
      options: {},
    });

  // chart‑tab toggle
  document.querySelectorAll(".chart-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      document.querySelector(".chart-tab.active").classList.remove("active");
      tab.classList.add("active");
      // ...toggle .chart-display sections by data-chart...
    });
  });

  // confetti on grant‑badge click
  document.getElementById("nrrpGrant")?.addEventListener("click", () => {
    if (typeof confetti === "function")
      confetti({ particleCount: 30, spread: 50 });
  });

  // tab switching
  const tabs = document.querySelectorAll(".chart-tab"),
    panes = document.querySelectorAll(".chart-display");
  tabs.forEach((tab) =>
    tab.addEventListener("click", () => {
      tabs.forEach((t) => t.classList.remove("active"));
      tab.classList.add("active");
      panes.forEach(
        (p) =>
          (p.style.display =
            p.dataset.chart === tab.dataset.chart ? "block" : "none")
      );
    })
  );

  // helper to get current accent color
  const accent = getComputedStyle(document.documentElement)
    .getPropertyValue("--accent-color")
    .trim();
  // Price Spread chart
  new Chart(document.getElementById("priceSpreadChart").getContext("2d"), {
    type: "line",
    data: {
      labels: ["1h", "6h", "12h", "24h"],
      datasets: [
        {
          label: "Spread (€)",
          data: [0.1, 0.2, 0.15, 0.18],
          borderColor: accent,
          fill: false,
        },
      ],
    },
  });
  // Arbitrage chart
  new Chart(document.getElementById("arbitrageChart").getContext("2d"), {
    type: "line",
    data: {
      labels: ["1h", "6h", "12h", "24h"],
      datasets: [
        {
          label: "Arbitrage (€)",
          data: [5, 8, 6, 9],
          borderColor: accent,
          fill: false,
        },
      ],
    },
  });
  // Frequency gauge (doughnut)
  new Chart(document.getElementById("frequencyChart").getContext("2d"), {
    type: "doughnut",
    data: {
      labels: ["Hz"],
      datasets: [
        {
          data: [50, 0.15],
          backgroundColor: [accent, "rgba(255,255,255,0.1)"],
          borderWidth: 0,
        },
      ],
    },
    options: { cutout: "80%", plugins: { tooltip: { enabled: false } } },
  });

  // confetti on grant badge click
  const grant = document.getElementById("nrrpGrant"),
    canvas = document.getElementById("confettiCanvas");
  if (grant && window.confetti) {
    grant.addEventListener("click", () =>
      confetti.create(canvas, { resize: true, useWorker: true })()
    );
  }

  // === OPCOM Price Spread Chart: Simulated Data ===
  function getImaginaryOpcomPriceSpread() {
    // Simulate 24h price spread (in EUR/MWh)
    const base = 12 + Math.random() * 2; // base price between 12-14
    return Array.from({ length: 24 }, (_, i) =>
      Number((base + Math.sin(i / 3) * 1.5 + Math.random() * 0.5).toFixed(2))
    );
  }

  function updateOpcomPriceSpreadChart(chart) {
    const now = new Date();
    const labels = Array.from(
      { length: 24 },
      (_, i) => `${(now.getHours() - 23 + i + 24) % 24}:00`
    );
    const data = getImaginaryOpcomPriceSpread();
    chart.data.labels = labels;
    chart.data.datasets[0].data = data;
    chart.update();
  }

  const psCtxSimulated = document
    .getElementById("priceSpreadChart")
    ?.getContext("2d");
  if (psCtxSimulated) {
    const opcomChart = new Chart(psCtxSimulated, {
      type: "line",
      data: {
        labels: [],
        datasets: [
          {
            label: "OPCOM Price Spread (EUR/MWh)",
            data: [],
            borderColor: "#00bfff",
            backgroundColor: "rgba(0,191,255,0.1)",
            fill: true,
            tension: 0.3,
            pointRadius: 2,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: true },
        },
        scales: {
          y: { beginAtZero: false, title: { display: true, text: "EUR/MWh" } },
          x: { title: { display: true, text: "Hour" } },
        },
      },
    });
    updateOpcomPriceSpreadChart(opcomChart);
    setInterval(() => updateOpcomPriceSpreadChart(opcomChart), 10000); // update every 10s
  }

  initBatteryFlexFundCharts();
  setupBatteryFlexFundInteractivity();

  // Helper to get last 6 months labels
  function getLast6Months() {
    const now = new Date(2025, 3, 22); // April is month 3 (0-based)
    const labels = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      labels.push(
        d.toLocaleString("default", { month: "short", year: "2-digit" })
      );
    }
    return labels;
  }

  // 1. Performance & Market Data (Line Chart)
  const perfCtx = document.querySelector(
    "#battery-flex-fund .fund-metrics-panel .metrics-visualization .metric-card .chart-container canvas"
  );
  if (perfCtx) {
    new Chart(perfCtx.getContext("2d"), {
      type: "line",
      data: {
        labels: getLast6Months(),
        datasets: [
          {
            label: "Performance Index",
            data: [82, 88, 91, 95, 97, 99],
            borderColor: "rgba(0,255,255,0.8)",
            backgroundColor: "rgba(0,255,255,0.1)",
            tension: 0.3,
            fill: true,
            pointRadius: 4,
          },
        ],
      },
      options: {
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true, max: 100 } },
      },
    });
  }

  // 2. Revenue Streams (Bar Chart)
  const revenueCtx = document.querySelector("#revenueChart canvas");
  if (revenueCtx) {
    new Chart(revenueCtx.getContext("2d"), {
      type: "bar",
      data: {
        labels: getLast6Months(),
        datasets: [
          {
            label: "Frequency Regulation",
            data: [120, 135, 140, 150, 160, 170],
            backgroundColor: "rgba(0,255,255,0.8)",
          },
          {
            label: "Energy Arbitrage",
            data: [80, 90, 95, 100, 110, 120],
            backgroundColor: "rgba(0,255,150,0.8)",
          },
          {
            label: "Capacity Payments",
            data: [40, 45, 50, 55, 60, 65],
            backgroundColor: "rgba(150,255,0,0.8)",
          },
        ],
      },
      options: {
        plugins: { legend: { display: false } },
        scales: { y: { beginAtZero: true } },
      },
    });
  }

  // 3. Grid Frequency Response (Line Chart)
  const freqCtx = document.querySelector("#frequencyChart canvas");
  if (freqCtx) {
    new Chart(freqCtx.getContext("2d"), {
      type: "line",
      data: {
        labels: getLast6Months(),
        datasets: [
          {
            label: "Grid Frequency (Hz)",
            data: [49.8, 49.9, 50.0, 50.1, 50.0, 49.95],
            borderColor: "rgba(0,255,255,0.8)",
            backgroundColor: "rgba(0,255,255,0.1)",
            tension: 0.4,
            fill: true,
            pointRadius: 4,
          },
        ],
      },
      options: {
        plugins: { legend: { display: false } },
        scales: { y: { min: 49.7, max: 50.3 } },
      },
    });
  }

  // 4. Romania Energy Market Price/Revenue Allocation (Pie Chart)
  const allocCtx = document.getElementById("revenueAllocationChart");
  if (allocCtx) {
    new Chart(allocCtx.getContext("2d"), {
      type: "pie",
      data: {
        labels: [
          "Frequency Regulation",
          "Energy Arbitrage",
          "Capacity Market",
          "Ancillary Services",
        ],
        datasets: [
          {
            data: [45, 30, 15, 10],
            backgroundColor: [
              "rgba(0,255,255,0.8)",
              "rgba(0,255,150,0.8)",
              "rgba(150,255,0,0.8)",
              "rgba(255,200,0,0.8)",
            ],
          },
        ],
      },
      options: {
        plugins: { legend: { position: "bottom" } },
      },
    });
  }
});

function initBatteryFlexFundCharts() {
  // Revenue Streams Chart
  const revenueCtx = document.getElementById("revenueChart")?.getContext("2d");
  if (revenueCtx) {
    new Chart(revenueCtx, {
      type: "line",
      data: {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul"],
        datasets: [
          {
            label: "Frequency Regulation",
            data: [345, 378, 392, 421, 460, 482, 494],
            borderColor: "rgba(0, 255, 255, 0.8)",
            backgroundColor: "rgba(0, 255, 255, 0.2)",
            tension: 0.4,
            fill: true,
          },
          {
            label: "Energy Arbitrage",
            data: [210, 245, 267, 305, 332, 346, 360],
            borderColor: "rgba(0, 255, 150, 0.8)",
            backgroundColor: "rgba(0, 255, 150, 0.2)",
            tension: 0.4,
            fill: true,
          },
          {
            label: "Capacity Payments",
            data: [125, 125, 125, 140, 140, 140, 155],
            borderColor: "rgba(150, 255, 0, 0.8)",
            backgroundColor: "rgba(150, 255, 0, 0.2)",
            tension: 0.4,
            fill: true,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: "index",
          intersect: false,
        },
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            mode: "index",
            callbacks: {
              label: function (context) {
                let label = context.dataset.label || "";
                if (label) {
                  label += ": €";
                }
                if (context.parsed.y !== null) {
                  label += context.parsed.y.toFixed(0) + "k";
                }
                return label;
              },
            },
          },
        },
        scales: {
          x: {
            grid: {
              color: "rgba(255, 255, 255, 0.05)",
            },
          },
          y: {
            grid: {
              color: "rgba(255, 255, 255, 0.05)",
            },
            ticks: {
              callback: function (value) {
                return "€" + value + "k";
              },
            },
          },
        },
      },
    });
  }

  // Frequency Response Chart
  const frequencyCtx = document
    .getElementById("frequencyChart")
    ?.getContext("2d");
  if (frequencyCtx) {
    new Chart(frequencyCtx, {
      type: "line",
      data: {
        labels: Array.from({ length: 100 }, (_, i) => i),
        datasets: [
          {
            label: "Grid Frequency",
            data: generateFrequencyData(100),
            borderColor: "rgba(0, 255, 255, 0.8)",
            borderWidth: 2,
            pointRadius: 0,
          },
          {
            label: "Response",
            data: generateResponseData(100),
            borderColor: "rgba(255, 120, 0, 0.8)",
            borderWidth: 2,
            pointRadius: 0,
            borderDash: [5, 5],
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: true,
            position: "top",
            labels: {
              boxWidth: 12,
              font: {
                size: 10,
              },
            },
          },
        },
        scales: {
          x: {
            display: false,
          },
          y: {
            grid: {
              color: "rgba(255, 255, 255, 0.05)",
            },
            min: 49.5,
            max: 50.5,
          },
        },
        animation: {
          duration: 0,
        },
      },
    });
  }

  // Market Price Chart
  const marketPriceCtx = document
    .getElementById("marketPriceChart")
    ?.getContext("2d");
  if (marketPriceCtx) {
    const marketPriceChart = new Chart(marketPriceCtx, {
      type: "line",
      data: {
        labels: generateTimeLabels(24),
        datasets: [
          {
            label: "Market Price",
            data: generateMarketPriceData(24),
            borderColor: "rgba(0, 255, 255, 0.8)",
            backgroundColor: "rgba(0, 255, 255, 0.2)",
            fill: true,
            tension: 0.4,
          },
          {
            label: "24h Average",
            data: Array(24).fill(135),
            borderColor: "rgba(255, 255, 255, 0.5)",
            borderWidth: 1,
            borderDash: [5, 5],
            pointRadius: 0,
          },
          {
            label: "Buy Threshold",
            data: Array(24).fill(105),
            borderColor: "rgba(255, 150, 0, 0.8)",
            borderWidth: 1,
            borderDash: [2, 2],
            pointRadius: 0,
          },
          {
            label: "Sell Threshold",
            data: Array(24).fill(165),
            borderColor: "rgba(0, 255, 150, 0.8)",
            borderWidth: 1,
            borderDash: [2, 2],
            pointRadius: 0,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
          tooltip: {
            callbacks: {
              label: function (context) {
                let label = context.dataset.label || "";
                if (label) {
                  label += ": ";
                }
                if (context.parsed.y !== null) {
                  label += "€" + context.parsed.y.toFixed(2) + "/MWh";
                }
                return label;
              },
            },
          },
        },
        scales: {
          x: {
            grid: {
              color: "rgba(255, 255, 255, 0.05)",
            },
            ticks: {
              maxTicksLimit: 12,
            },
          },
          y: {
            grid: {
              color: "rgba(255, 255, 255, 0.05)",
            },
            ticks: {
              callback: function (value) {
                return "€" + value;
              },
            },
          },
        },
      },
    });

    // Simulate live data updates
    setInterval(() => {
      const data = marketPriceChart.data.datasets[0].data;
      data.shift();
      data.push(generateRandomMarketPrice());
      marketPriceChart.update();
    }, 10000);
  }

  // Revenue Allocation Pie Chart
  const revenueAllocationCtx = document
    .getElementById("revenueAllocationChart")
    ?.getContext("2d");
  if (revenueAllocationCtx) {
    new Chart(revenueAllocationCtx, {
      type: "doughnut",
      data: {
        labels: [
          "Frequency Regulation",
          "Energy Arbitrage",
          "Capacity Market",
          "Ancillary Services",
        ],
        datasets: [
          {
            data: [45, 30, 15, 10],
            backgroundColor: [
              "rgba(0, 255, 255, 0.8)",
              "rgba(0, 255, 150, 0.8)",
              "rgba(150, 255, 0, 0.8)",
              "rgba(255, 200, 0, 0.8)",
            ],
            borderColor: "rgba(0, 0, 0, 0.3)",
            borderWidth: 1,
          },
        ],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            display: false,
          },
        },
        cutout: "65%",
      },
    });
  }

  // Add animated flow to system diagram
  animateDataFlow();
}

function setupBatteryFlexFundInteractivity() {
  // Panel controls for the Performance & Market Data section
  const panelButtons = document.querySelectorAll(
    ".battery-flex-fund .panel-controls .btn-sm"
  );
  panelButtons.forEach((btn) => {
    btn.addEventListener("click", function () {
      panelButtons.forEach((b) => b.classList.remove("active"));
      this.classList.add("active");
      // Here you would normally update the chart data based on the timeframe
    });
  });

  // Chart tab container for the market charts
  const chartTabButtons = document.querySelectorAll(
    ".battery-flex-fund .chart-tab-container .btn-sm"
  );
  chartTabButtons.forEach((btn) => {
    btn.addEventListener("click", function () {
      chartTabButtons.forEach((b) => b.classList.remove("active"));
      this.classList.add("active");
      // Here you would switch between different chart displays
    });
  });

  // Request Investment Memorandum button
  const requestButton = document.querySelector(
    ".battery-flex-fund .btn-primary"
  );
  if (requestButton) {
    requestButton.addEventListener("click", function () {
      showInvestmentRequestModal();
    });
  }

  // Add hover effects to metrics
  const metricCards = document.querySelectorAll(
    ".battery-flex-fund .metric-card"
  );
  metricCards.forEach((card) => {
    card.addEventListener("mouseenter", function () {
      this.style.transform = "translateY(-5px)";
      this.style.boxShadow = "0 8px 16px rgba(0, 0, 0, 0.2)";
    });

    card.addEventListener("mouseleave", function () {
      this.style.transform = "";
      this.style.boxShadow = "";
    });
  });
}

// Helper function to show investment request modal
function showInvestmentRequestModal() {
  alert(
    "Investment Memorandum request functionality will be implemented in the next phase."
  );
}

// Helper function to generate frequency data
function generateFrequencyData(count) {
  const baseFrequency = 50;
  return Array.from(
    { length: count },
    () => baseFrequency + (Math.random() * 0.4 - 0.2)
  );
}

// Helper function to generate response data with slight delay from frequency
function generateResponseData(count) {
  const frequency = generateFrequencyData(count);
  return frequency.map((val, i) => {
    if (i < 5) return 50;
    const diff = val - 50;
    return 50 - diff * 0.85;
  });
}

// Helper function to generate market price data
function generateMarketPriceData(count) {
  const basePrice = 135;
  return Array.from(
    { length: count },
    () => basePrice + (Math.random() * 60 - 30)
  );
}

// Helper function to generate a random market price that continues the trend
function generateRandomMarketPrice() {
  return 135 + (Math.random() * 60 - 30);
}

// Helper function to generate time labels for the market price chart
function generateTimeLabels(count) {
  const labels = [];
  const now = new Date();
  for (let i = count - 1; i >= 0; i--) {
    const time = new Date(now.getTime() - i * 60 * 60 * 1000);
    labels.push(time.getHours() + ":00");
  }
  return labels;
}

// Helper function to animate the data flow in the system diagram
function animateDataFlow() {
  const chargingFlow = document.querySelector(
    ".battery-flex-fund .data-flow.charging"
  );
  const dischargingFlow = document.querySelector(
    ".battery-flex-fund .data-flow.discharging"
  );

  if (chargingFlow && dischargingFlow) {
    // Alternate between charging and discharging
    let isCharging = true;

    setInterval(() => {
      if (isCharging) {
        chargingFlow.style.opacity = "1";
        dischargingFlow.style.opacity = "0";
      } else {
        chargingFlow.style.opacity = "0";
        dischargingFlow.style.opacity = "1";
      }
      isCharging = !isCharging;
    }, 5000);
  }
}
