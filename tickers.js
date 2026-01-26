        (function() {
        window.externalTickersLoaded = true;

        // Exchange Rate Data
        const exchangeRateData = [
            { pair: "GBP/NGN", flag: "🇳🇬", rate: 2087.45, change: +12.34, changePercent: +0.59 },
            { pair: "GBP/KES", flag: "🇰🇪", rate: 163.28, change: -0.87, changePercent: -0.53 },
            { pair: "GBP/ZAR", flag: "🇿🇦", rate: 23.41, change: +0.15, changePercent: +0.64 },
            { pair: "GBP/GHS", flag: "🇬🇭", rate: 19.87, change: -0.23, changePercent: -1.14 },
            { pair: "GBP/EGP", flag: "🇪🇬", rate: 63.15, change: +0.42, changePercent: +0.67 },
            { pair: "GBP/TZS", flag: "🇹🇿", rate: 3234.56, change: +45.23, changePercent: +1.42 },
            { pair: "GBP/UGX", flag: "🇺🇬", rate: 4678.90, change: -12.34, changePercent: -0.26 },
            { pair: "GBP/ZMW", flag: "🇿🇲", rate: 32.45, change: +0.78, changePercent: +2.46 }
        ];

        // Stock Exchange Data
        const stockExchangeData = [
            { exchange: "JSE All Share", country: "ZA", value: 76234.58, change: +342.67, changePercent: +0.45, volume: "2.3B" },
            { exchange: "NSE All Share", country: "NG", value: 102458.23, change: -876.12, changePercent: -0.85, volume: "1.1B" },
            { exchange: "NSE 20", country: "KE", value: 1847.92, change: +12.45, changePercent: +0.68, volume: "456M" },
            { exchange: "FTSE 100", country: "GB", value: 8456.73, change: +23.89, changePercent: +0.28, volume: "4.7B" },
            { exchange: "EGX 30", country: "EG", value: 28934.12, change: +187.34, changePercent: +0.65, volume: "892M" },
            { exchange: "GSE Composite", country: "GH", value: 3245.67, change: -8.23, changePercent: -0.25, volume: "178M" },
            { exchange: "MASI", country: "MA", value: 13567.89, change: +56.12, changePercent: +0.42, volume: "234M" },
            { exchange: "TUNINDEX", country: "TN", value: 8923.45, change: -23.67, changePercent: -0.26, volume: "89M" }
        ];

        // Function to create exchange rate ticker items
        function createExchangeItem(data) {
            const changeClass = data.change >= 0 ? 'positive' : 'negative';
            return `
                <div class="ticker-item">
                    <span class="ticker-flag">${data.flag}</span>
                    <span class="ticker-symbol">${data.pair}</span>
                    <span class="ticker-value">${data.rate.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    <span class="ticker-change ${changeClass}">
                        ${data.changePercent > 0 ? '+' : ''}${data.changePercent.toFixed(2)}%
                    </span>
                </div>
            `;
        }

        // Function to create stock ticker items
        function createStockItem(data) {
            const changeClass = data.change >= 0 ? 'positive' : 'negative';
            return `
                <div class="ticker-item stock-ticker-item">
                    <span class="exchange-name">
                        ${data.exchange}
                        <span class="country-badge">${data.country}</span>
                    </span>
                    <span class="ticker-value">${data.value.toLocaleString('en-GB', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                    <span class="ticker-change ${changeClass}">
                        ${data.changePercent > 0 ? '+' : ''}${data.changePercent.toFixed(2)}%
                    </span>
                    <span class="ticker-volume">Vol: ${data.volume}</span>
                </div>
            `;
        }

        // Populate tickers
        function populateTickers() {
            const combinedTrack = document.getElementById('smartTickerTrack');
            const exchangeTrack = document.getElementById('exchangeTrack');
            const stockTrack = document.getElementById('stockTrack');
            const useCombinedTrack = Boolean(combinedTrack);

            // Create two sets for seamless loop
            let exchangeHTML = '';
            let stockHTML = '';

            // First set
            exchangeRateData.forEach(item => {
                exchangeHTML += createExchangeItem(item);
            });
            stockExchangeData.forEach(item => {
                stockHTML += createStockItem(item);
            });

            // Duplicate for seamless scrolling
            if (useCombinedTrack) {
                const combinedHTML = exchangeHTML + stockHTML;
                combinedTrack.innerHTML = combinedHTML + combinedHTML;
            } else {
                if (exchangeTrack) {
                    exchangeTrack.innerHTML = exchangeHTML + exchangeHTML;
                }
                if (stockTrack) {
                    stockTrack.innerHTML = stockHTML + stockHTML;
                }
            }
        }

        // Simulate live updates (optional - shows how to update data)
        function updateTickerData() {
            // Randomly update some values to simulate live data
            exchangeRateData.forEach(item => {
                const randomChange = (Math.random() - 0.5) * 2;
                item.rate += randomChange;
                item.change = randomChange;
                item.changePercent = (randomChange / item.rate) * 100;
            });

            stockExchangeData.forEach(item => {
                const randomChange = (Math.random() - 0.5) * 100;
                item.value += randomChange;
                item.change = randomChange;
                item.changePercent = (randomChange / item.value) * 100;
            });

            populateTickers();
        }

        // Initialize
        populateTickers();

        // Update every 5 seconds (optional - for live feel)
        setInterval(updateTickerData, 5000);
        })();

