/**
 * crypto-rates.js
 * Fetches real-time crypto rates and updates the UI elements.
 */

const CRYPTO_CONFIG = {
    btc: { symbol: 'bitcoin', name: 'Bitcoin', icon: 'https://assets.coingecko.com/coins/images/1/large/bitcoin.png' },
    eth: { symbol: 'ethereum', name: 'Ethereum', icon: 'https://assets.coingecko.com/coins/images/279/large/ethereum.png' },
    usdt: { symbol: 'tether', name: 'Tether', icon: 'https://assets.coingecko.com/coins/images/325/large/Tether.png' },
    bnb: { symbol: 'binancecoin', name: 'BNB', icon: 'https://assets.coingecko.com/coins/images/825/large/binance-coin-logo.png' },
    ltc: { symbol: 'litecoin', name: 'Litecoin', icon: 'https://assets.coingecko.com/coins/images/2/large/litecoin.png' }
};

async function fetchCryptoRates() {
    try {
        const symbols = Object.values(CRYPTO_CONFIG).map(c => c.symbol).join(',');
        const response = await fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${symbols}&vs_currencies=usd&include_24hr_vol=true&include_24hr_change=true&include_market_cap=true`);
        if (!response.ok) throw new Error('Failed to fetch rates');
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching crypto rates:', error);
        return null;
    }
}

function formatPrice(price) {
    if (price >= 1000) {
        return (price / 1000).toFixed(2) + 'k';
    }
    return price.toFixed(2);
}

function formatLargeNumber(num) {
    if (num >= 1e12) return (num / 1e12).toFixed(2) + 'T';
    if (num >= 1e9) return (num / 1e9).toFixed(2) + 'B';
    if (num >= 1e6) return (num / 1e6).toFixed(2) + 'M';
    return num.toLocaleString();
}

async function updateCryptoUI() {
    const rates = await fetchCryptoRates();
    if (!rates) return;

    // 1. Update index.html dynamic updates if they exist
    if (typeof UPDATE_POOL !== 'undefined') {
        // BTC Update
        const btcData = rates[CRYPTO_CONFIG.btc.symbol];
        if (btcData) {
            const price = btcData.usd;
            const change = btcData.usd_24h_change;
            const volume = btcData.usd_24h_vol;
            UPDATE_POOL[0].text = `📝 In the last 24 hours, Bitcoin's price moved ${change >= 0 ? '+' : ''}${change.toFixed(2)}% to $${formatPrice(price)} and trading volume is $${formatLargeNumber(volume)}. 🔵 Bitcoin nears new heights driven by market demand.`;
        }

        // ETH Update
        const ethData = rates[CRYPTO_CONFIG.eth.symbol];
        if (ethData) {
            const price = ethData.usd;
            const change = ethData.usd_24h_change;
            UPDATE_POOL[1].text = `🚀 Ethereum market activity is high. ETH is trading at $${price.toLocaleString()}. 24h change: ${change >= 0 ? '+' : ''}${change.toFixed(2)}%. Now is a great time to diversify your portfolio.`;
        }

        // BNB Update
        const bnbData = rates[CRYPTO_CONFIG.bnb.symbol];
        if (bnbData) {
            const price = bnbData.usd;
            const change = bnbData.usd_24h_change;
            UPDATE_POOL[4].text = `🔵 BNB current price: $${price.toLocaleString()} (${change >= 0 ? '+' : ''}${change.toFixed(2)}%). SatrixAi users holding BNB plans are seeing consistent returns this week.`;
        }

        // Refresh currently visible update if it matches one we updated
        const updateTitle = document.getElementById('updateTitle');
        const updateBodyText = document.getElementById('updateBodyText');
        if (updateTitle && updateBodyText) {
            const currentLabel = updateTitle.textContent;
            const matchingUpdate = UPDATE_POOL.find(u => u.label === currentLabel);
            if (matchingUpdate) {
                updateBodyText.textContent = matchingUpdate.text;
            }
        }
    }

    // 2. Update update-detail.html if we are on that page
    const heroPrice = document.querySelector('.article-hero .text-2xl');
    if (heroPrice) {
        const btcData = rates[CRYPTO_CONFIG.btc.symbol];
        if (btcData) {
            heroPrice.textContent = `$${btcData.usd.toLocaleString()}`;
            const changeSpan = document.querySelector('.article-hero span.bg-emerald-400\\/20, .article-hero span.bg-red-400\\/20');
            if (changeSpan) {
                const change = btcData.usd_24h_change;
                changeSpan.textContent = `${change >= 0 ? '+' : ''}${change.toFixed(2)}% ${change >= 0 ? '↑' : '↓'}`;
                changeSpan.className = `text-[10px] font-bold ${change >= 0 ? 'bg-emerald-400/20 text-emerald-200 border-emerald-400/30' : 'bg-red-400/20 text-red-200 border-red-400/30'} px-2 py-0.5 rounded-full border`;
            }

            // Stats row
            const statCards = document.querySelectorAll('.stat-card');
            if (statCards.length >= 3) {
                // Price
                statCards[0].querySelector('.text-\\[13px\\]').textContent = `$${formatPrice(btcData.usd)}`;
                const pChange = statCards[0].querySelector('.stat-up, .stat-down');
                pChange.textContent = `${btcData.usd_24h_change >= 0 ? '+' : ''}${btcData.usd_24h_change.toFixed(2)}%`;
                pChange.className = `${btcData.usd_24h_change >= 0 ? 'stat-up' : 'stat-down'} text-[9px] font-semibold mt-0.5`;

                // Volume
                statCards[1].querySelector('.text-\\[13px\\]').textContent = `$${formatLargeNumber(btcData.usd_24h_vol)}`;
                
                // Market Cap
                statCards[2].querySelector('.text-\\[13px\\]').textContent = `$${formatLargeNumber(btcData.usd_market_cap)}`;
            }

            // Highlight box
            const highlightBox = document.querySelector('.highlight-box p');
            if (highlightBox) {
                highlightBox.innerHTML = `📝 In the last 24 hours, Bitcoin's price moved <strong>${btcData.usd_24h_change >= 0 ? '+' : ''}${btcData.usd_24h_change.toFixed(2)}%</strong> to <strong>$${formatPrice(btcData.usd)}</strong> and trading volume is <strong>$${formatLargeNumber(btcData.usd_24h_vol)}</strong>.`;
            }
        }
    }
}

// Run on load
document.addEventListener('DOMContentLoaded', updateCryptoUI);
// Periodically update
setInterval(updateCryptoUI, 60000); // Every minute
