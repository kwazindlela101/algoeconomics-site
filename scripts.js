// ==================== PERFORMANCE OPTIMIZATION ====================
let chartsInitialized = {
    sparklines: false,
    gdp: false,
    dashboard: false,
    regional: false,
    model: false
};

// Debounce function for slider updates
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Intersection Observer for lazy loading
const chartObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const sectionId = entry.target.id;
            loadSectionCharts(sectionId);
        }
    });
}, { rootMargin: '100px' });

function loadSectionCharts(sectionId) {
    switch(sectionId) {
        case 'african-markets':
            if (!chartsInitialized.sparklines) {
                createSparklineCharts();
                chartsInitialized.sparklines = true;
            }
            if (!chartsInitialized.gdp) {
                setTimeout(() => createGDPChart(), 100);
                chartsInitialized.gdp = true;
            }
            break;
        case 'real-time-dashboard':
            if (!chartsInitialized.dashboard) {
                initializeRealTimeDashboard();
                chartsInitialized.dashboard = true;
            }
            break;
        case 'regional-analysis':
            if (!chartsInitialized.regional) {
                initializeRegionalAnalysis();
                chartsInitialized.regional = true;
            }
            break;
        case 'economic-model':
            if (!chartsInitialized.model) {
                initializeEconomicModel();
                chartsInitialized.model = true;
            }
            break;
    }
}

// ==================== CORE NAVIGATION ====================
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.getElementById('menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    if (menuToggle) { 
        menuToggle.addEventListener('click', function() { 
            navLinks.classList.toggle('active'); 
        }); 
    }
    
    document.querySelectorAll('.nav-link').forEach(link => { 
        link.addEventListener('click', function() { 
            navLinks.classList.remove('active'); 
        }); 
    });

    document.querySelectorAll('a[href^="#"]').forEach(anchor => { 
        anchor.addEventListener('click', function(e) { 
            e.preventDefault(); 
            const target = document.querySelector(this.getAttribute('href')); 
            if (target) { 
                target.scrollIntoView({ behavior: 'smooth', block: 'start' }); 
            } 
        }); 
    });

    const briefBtn = document.querySelector('.brief-btn');
    if (briefBtn) { 
        briefBtn.addEventListener('click', function() { 
            alert("Thank you! We'll send your brief shortly."); 
        }); 
    }

    // Active section highlighting (throttled)
    let scrollTimeout;
    window.addEventListener('scroll', function() { 
        if (scrollTimeout) return;
        scrollTimeout = setTimeout(() => {
            const sections = document.querySelectorAll('section'); 
            let current = ''; 
            sections.forEach(section => { 
                if (pageYOffset >= section.offsetTop - 150) { 
                    current = section.getAttribute('id'); 
                } 
            }); 
            document.querySelectorAll('.nav-link').forEach(link => { 
                link.classList.remove('active'); 
                if (link.getAttribute('href') === '#' + current) { 
                    link.classList.add('active'); 
                } 
            }); 
            scrollTimeout = null;
        }, 100);
    });

    // Back to top button (throttled)
    const backToTopBtn = document.getElementById('backToTop');
    let backToTopTimeout;
    window.addEventListener('scroll', () => { 
        if (backToTopTimeout) return;
        backToTopTimeout = setTimeout(() => {
            if (window.scrollY > 500) { 
                backToTopBtn.classList.add('visible'); 
            } else { 
                backToTopBtn.classList.remove('visible'); 
            }
            backToTopTimeout = null;
        }, 100);
    });
    backToTopBtn.addEventListener('click', () => { 
        window.scrollTo({ top: 0, behavior: 'smooth' }); 
    });

    // Setup lazy loading observers
    const sectionsToObserve = ['african-markets', 'real-time-dashboard', 'regional-analysis', 'economic-model'];
    sectionsToObserve.forEach(id => {
        const section = document.getElementById(id);
        if (section) {
            chartObserver.observe(section);
        }
    });
});

// ==================== EXISTING CHARTS ====================
function createSparklineCharts() {
    const cities = [
        { id: 'lagosChart', data: [65, 59, 80, 81, 76, 75, 80] }, 
        { id: 'nairobiChart', data: [45, 55, 65, 75, 80, 85, 90] }, 
        { id: 'johannesburgChart', data: [80, 75, 70, 65, 60, 65, 70] }
    ];
    
    cities.forEach(city => { 
        const ctx = document.getElementById(city.id); 
        if (ctx && !ctx.dataset.loaded) { 
            new Chart(ctx.getContext('2d'), { 
                type: 'line', 
                data: { 
                    labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul'], 
                    datasets: [{ 
                        data: city.data, 
                        borderColor: 'rgba(45, 80, 22, 1)', 
                        backgroundColor: 'rgba(45, 80, 22, 0.1)', 
                        borderWidth: 2, 
                        fill: true, 
                        tension: 0.4, 
                        pointRadius: 0 
                    }] 
                }, 
                options: { 
                    responsive: true, 
                    maintainAspectRatio: false,
                    animation: { duration: 750 },
                    plugins: { 
                        legend: { display: false }, 
                        tooltip: { enabled: false } 
                    }, 
                    scales: { 
                        x: { display: false }, 
                        y: { display: false } 
                    } 
                } 
            });
            ctx.dataset.loaded = 'true';
        } 
    });
}

function createGDPChart() {
    const ctx = document.getElementById('gdpChart');
    const container = document.getElementById('gdpChartContainer');
    if (ctx && !ctx.dataset.loaded) {
        new Chart(ctx, { 
            type: 'bar', 
            data: { 
                labels: ['Nigeria', 'Kenya', 'South Africa', 'Ghana', 'Egypt'], 
                datasets: [{ 
                    label: 'GDP Growth %', 
                    data: [3.2, 5.1, 1.9, 4.8, 4.5], 
                    backgroundColor: [
                        'rgba(212, 175, 55, 0.8)', 
                        'rgba(56, 161, 105, 0.8)', 
                        'rgba(49, 130, 206, 0.8)', 
                        'rgba(147, 51, 234, 0.8)', 
                        'rgba(236, 72, 153, 0.8)'
                    ], 
                    borderWidth: 1 
                }] 
            }, 
            options: { 
                responsive: true, 
                plugins: { 
                    legend: { display: false }, 
                    tooltip: { 
                        callbacks: { 
                            label: function(context) { 
                                return 'GDP Growth: ' + context.parsed.y + '%'; 
                            } 
                        } 
                    } 
                }, 
                animation: { 
                    duration: 1000, 
                    easing: 'easeOutQuart' 
                } 
            } 
        }); 
        if (container) container.classList.add('loaded');
        ctx.dataset.loaded = 'true';
    }
}

// ==================== NEW: REAL-TIME DASHBOARD ====================
function initializeRealTimeDashboard() {
    // Create stability trend chart
    const stabilityCtx = document.getElementById('stabilityChart');
    if (stabilityCtx) {
        new Chart(stabilityCtx, {
            type: 'line',
            data: {
                labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'],
                datasets: [{
                    data: [68.2, 69.1, 70.5, 71.2, 71.8, 72.4],
                    borderColor: '#d4af37',
                    backgroundColor: 'rgba(212, 175, 55, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 3,
                    pointBackgroundColor: '#d4af37'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: { duration: 750 },
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return 'Stability: ' + context.parsed.y;
                            }
                        }
                    }
                },
                scales: {
                    x: { display: true, grid: { display: false } },
                    y: { display: true, beginAtZero: false, min: 65, max: 75 }
                }
            }
        });
    }

    // Create investment climate trend chart
    const investmentCtx = document.getElementById('investmentChart');
    if (investmentCtx) {
        new Chart(investmentCtx, {
            type: 'line',
            data: {
                labels: ['Q1', 'Q2', 'Q3', 'Q4', 'Q1', 'Q2'],
                datasets: [{
                    data: [62.3, 63.8, 65.1, 66.2, 67.4, 68.5],
                    borderColor: '#38a169',
                    backgroundColor: 'rgba(56, 161, 105, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 3,
                    pointBackgroundColor: '#38a169'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                animation: { duration: 750 },
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return 'Score: ' + context.parsed.y;
                            }
                        }
                    }
                },
                scales: {
                    x: { display: true, grid: { display: false } },
                    y: { display: true, beginAtZero: false, min: 60, max: 72 }
                }
            }
        });
    }
}

// ==================== NEW: REGIONAL ANALYSIS ====================
function initializeRegionalAnalysis() {
    const tabs = document.querySelectorAll('.regional-tab');
    const contents = document.querySelectorAll('.regional-content');

    tabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const region = this.getAttribute('data-region');
            
            // Update active tab
            tabs.forEach(t => t.classList.remove('active'));
            this.classList.add('active');
            
            // Update active content
            contents.forEach(c => c.classList.remove('active'));
            document.getElementById(region + '-content').classList.add('active');
            
            // Load regional chart if not already loaded
            loadRegionalChart(region);
        });
    });

    // Load initial chart
    loadRegionalChart('eac');
}

function loadRegionalChart(region) {
    const chartId = region + 'Chart';
    const canvas = document.getElementById(chartId);
    
    if (!canvas || canvas.dataset.loaded === 'true') return;
    
    const regionalData = {
        eac: {
            labels: ['Kenya', 'Tanzania', 'Uganda', 'Rwanda'],
            data: [5.5, 4.9, 5.8, 7.2],
            colors: ['#d4af37', '#3182ce', '#38a169', '#e53e3e']
        },
        ecowas: {
            labels: ['Nigeria', 'Ghana', "Côte d'Ivoire", 'Senegal'],
            data: [3.2, 4.8, 6.5, 5.3],
            colors: ['#d4af37', '#3182ce', '#38a169', '#e53e3e']
        },
        sadc: {
            labels: ['South Africa', 'Angola', 'Zambia', 'Mozambique'],
            data: [1.9, 2.8, 4.1, 5.8],
            colors: ['#d4af37', '#3182ce', '#38a169', '#e53e3e']
        },
        comesa: {
            labels: ['Egypt', 'Ethiopia', 'Zimbabwe', 'Malawi'],
            data: [4.5, 6.8, 3.5, 2.8],
            colors: ['#d4af37', '#3182ce', '#38a169', '#e53e3e']
        }
    };

    const data = regionalData[region];
    
    new Chart(canvas, {
        type: 'bar',
        data: {
            labels: data.labels,
            datasets: [{
                label: 'GDP Growth (%)',
                data: data.data,
                backgroundColor: data.colors.map(c => c + 'cc'),
                borderColor: data.colors,
                borderWidth: 2
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: { duration: 750 },
            plugins: {
                legend: { display: false },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return 'GDP Growth: ' + context.parsed.y + '%';
                        }
                    }
                }
            },
            scales: {
                y: {
                    beginAtZero: true,
                    max: 8,
                    ticks: {
                        callback: function(value) {
                            return value + '%';
                        }
                    }
                }
            }
        }
    });
    
    canvas.dataset.loaded = 'true';
}

// ==================== NEW: INTERACTIVE ECONOMIC MODEL ====================
let modelChart = null;
const debouncedUpdate = debounce(updateModel, 50); // Faster response

function initializeEconomicModel() {
    // Get all slider elements
    const inflationSlider = document.getElementById('inflationSlider');
    const interestSlider = document.getElementById('interestSlider');
    const commoditySlider = document.getElementById('commoditySlider');
    const stabilitySlider = document.getElementById('stabilitySlider');
    const fdiSlider = document.getElementById('fdiSlider');

    // Slider event listeners with immediate display update + debounced calculation
    inflationSlider.addEventListener('input', function() {
        document.getElementById('inflationDisplay').textContent = this.value + '%';
        debouncedUpdate();
    });

    interestSlider.addEventListener('input', function() {
        document.getElementById('interestDisplay').textContent = this.value + '%';
        debouncedUpdate();
    });

    commoditySlider.addEventListener('input', function() {
        const sign = this.value >= 0 ? '+' : '';
        document.getElementById('commodityDisplay').textContent = sign + this.value + '%';
        debouncedUpdate();
    });

    stabilitySlider.addEventListener('input', function() {
        document.getElementById('stabilitySliderDisplay').textContent = this.value;
        debouncedUpdate();
    });

    fdiSlider.addEventListener('input', function() {
        document.getElementById('fdiDisplay').textContent = '$' + this.value + 'B';
        debouncedUpdate();
    });

    // Preset scenario buttons
    const presetButtons = document.querySelectorAll('.preset-btn');
    presetButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const scenario = this.getAttribute('data-scenario');
            applyScenario(scenario);
        });
    });

    // Initialize model chart
    createModelChart();
    
    // Initial calculation
    updateModel();
}

function applyScenario(scenario) {
    const scenarios = {
        base: { inflation: 12.5, interest: 8.5, commodity: 15, stability: 75, fdi: 5.2 },
        optimistic: { inflation: 6.0, interest: 5.5, commodity: 30, stability: 85, fdi: 8.5 },
        pessimistic: { inflation: 20.0, interest: 15.0, commodity: -15, stability: 60, fdi: 2.0 },
        crisis: { inflation: 28.0, interest: 22.0, commodity: -40, stability: 45, fdi: 0.5 }
    };

    const values = scenarios[scenario];
    
    document.getElementById('inflationSlider').value = values.inflation;
    document.getElementById('inflationDisplay').textContent = values.inflation + '%';
    
    document.getElementById('interestSlider').value = values.interest;
    document.getElementById('interestDisplay').textContent = values.interest + '%';
    
    document.getElementById('commoditySlider').value = values.commodity;
    const sign = values.commodity >= 0 ? '+' : '';
    document.getElementById('commodityDisplay').textContent = sign + values.commodity + '%';
    
    document.getElementById('stabilitySlider').value = values.stability;
    document.getElementById('stabilitySliderDisplay').textContent = values.stability;
    
    document.getElementById('fdiSlider').value = values.fdi;
    document.getElementById('fdiDisplay').textContent = '$' + values.fdi + 'B';
    
    updateModel();
}

function updateModel() {
    // Get current values
    const inflation = parseFloat(document.getElementById('inflationSlider').value);
    const interest = parseFloat(document.getElementById('interestSlider').value);
    const commodity = parseFloat(document.getElementById('commoditySlider').value);
    const stability = parseFloat(document.getElementById('stabilitySlider').value);
    const fdi = parseFloat(document.getElementById('fdiSlider').value);

    // Calculate GDP Growth (simplified model)
    const baseGDP = 4.0;
    const inflationImpact = (12.5 - inflation) * 0.15;
    const commodityImpact = commodity * 0.05;
    const stabilityImpact = (stability - 75) * 0.03;
    const fdiImpact = (fdi - 5.2) * 0.3;
    
    const gdpGrowth = baseGDP + inflationImpact + commodityImpact + stabilityImpact + fdiImpact;
    const gdpChange = gdpGrowth - baseGDP;

    // Calculate Trade Balance
    const baseTrade = -2.35;
    const tradeBalance = baseTrade + (commodity * 0.08) + (gdpGrowth * 0.2);
    const tradeChange = tradeBalance - baseTrade;

    // Calculate Investment Climate Score
    const baseClimate = 68.3;
    const climateScore = baseClimate + (stability - 75) * 0.2 + (fdi - 5.2) * 1.5 - (inflation - 12.5) * 0.3;
    const climateChange = climateScore - baseClimate;

    // Update display
    document.getElementById('gdpResult').textContent = gdpGrowth.toFixed(1) + '%';
    document.getElementById('gdpChange').textContent = (gdpChange >= 0 ? '+' : '') + gdpChange.toFixed(1) + '% from baseline';
    document.getElementById('gdpChange').className = gdpChange >= 0 ? 'result-change' : 'result-change negative';

    document.getElementById('tradeResult').textContent = (tradeBalance >= 0 ? '+' : '') + '$' + Math.abs(tradeBalance).toFixed(1) + 'B';
    document.getElementById('tradeChange').textContent = (tradeChange >= 0 ? '+' : '') + '$' + Math.abs(tradeChange).toFixed(1) + 'M from baseline';
    document.getElementById('tradeChange').className = tradeChange >= 0 ? 'result-change' : 'result-change negative';

    document.getElementById('climateResult').textContent = climateScore.toFixed(1);
    document.getElementById('climateChange').textContent = (climateChange >= 0 ? '+' : '') + climateChange.toFixed(1) + ' points from baseline';
    document.getElementById('climateChange').className = climateChange >= 0 ? 'result-change' : 'result-change negative';

    // Update chart
    updateModelChart(gdpGrowth, tradeBalance, climateScore);
}

function createModelChart() {
    const ctx = document.getElementById('modelChart');
    if (!ctx) return;

    modelChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: ['2020', '2021', '2022', '2023', '2024', '2025 (Projected)'],
            datasets: [{
                label: 'GDP Growth %',
                data: [2.8, 3.5, 3.9, 4.2, 4.0, 4.2],
                borderColor: '#d4af37',
                backgroundColor: 'rgba(212, 175, 55, 0.1)',
                borderWidth: 3,
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            animation: { duration: 500 },
            plugins: {
                legend: {
                    display: true,
                    labels: { color: '#e6e8ef' }
                },
                tooltip: {
                    callbacks: {
                        label: function(context) {
                            return context.dataset.label + ': ' + context.parsed.y.toFixed(1) + '%';
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: { color: 'rgba(255, 255, 255, 0.1)' },
                    ticks: { color: '#a9afc7' }
                },
                y: {
                    grid: { color: 'rgba(255, 255, 255, 0.1)' },
                    ticks: {
                        color: '#a9afc7',
                        callback: function(value) {
                            return value + '%';
                        }
                    },
                    beginAtZero: false,
                    min: 0,
                    max: 8
                }
            }
        }
    });
}

function updateModelChart(gdpGrowth, tradeBalance, climateScore) {
    if (!modelChart) return;

    // Update the projected value
    modelChart.data.datasets[0].data[5] = gdpGrowth;
    modelChart.update('none'); // Update without animation for smooth experience
}
