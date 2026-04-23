// --- UI TRANSLATIONS (i18n) ---
const translations = {
    'en': {
        'home': 'Home',
        'analysis': 'AI Analysis',
        'market': 'Market Trends',
        'forecast': 'Weather Hub',
        'enterprise_ready': 'Enterprise-Ready AI',
        'hero_title': 'Precision Farming for 1 Billion Farmers.',
        'hero_subtitle': 'The world\'s most advanced AI-driven crop recommendation engine.',
        'start_now': 'Start Analysis',
        'watch_demo': 'Watch Demo',
        'accuracy': 'Model Accuracy',
        'supported_crops': 'Supported Crops',
        'weather_forecast': 'Weather Forecast',
        'loc_detection': 'GPS Auto-Detection',
        'ai_insights': 'Deep AI Insights',
        'mandi_bhav': 'Live Mandi Bhav',
        'field_params': 'Field Parameters',
        'soil_nutrients': 'Soil Nutrients',
        'climate_data': 'Climate Data',
        'run_analysis': 'Run AI Analysis',
        'detecting': 'Detecting location...',
        'loc_detected': '✅ Location detected: ',
        'searching': '🔍 Searching...',
        'not_found': '❌ Location not found.',
        'auto_predicting': '🚀 Auto-predicting...',
        'grains': 'Best Grains',
        'fruits': 'Best Fruits',
        'vegetables': 'Best Vegetables'
    },
    'hi': {
        'home': 'मुख्य पृष्ठ',
        'analysis': 'AI विश्लेषण',
        'market': 'मंडी भाव',
        'forecast': 'मौसम केंद्र',
        'enterprise_ready': 'कल की खेती',
        'hero_title': '1 अरब किसानों के लिए सटीक खेती।',
        'hero_subtitle': 'दुनिया का सबसे उन्नत AI-आधारित फसल अनुशंसा इंजन।',
        'start_now': 'विश्लेषण शुरू करें',
        'watch_demo': 'डेमो देखें',
        'accuracy': 'सटीकता',
        'supported_crops': 'फसलें',
        'weather_forecast': 'मौसम पूर्वानुमान',
        'loc_detection': 'GPS ऑटो-डिटेक्शन',
        'ai_insights': ' AI अंतर्दृष्टि',
        'mandi_bhav': 'लाइव मंडी भाव',
        'field_params': 'खेत के पैरामीटर्स',
        'soil_nutrients': 'मिट्टी के पोषक तत्व',
        'climate_data': 'जलवायु डेटा',
        'run_analysis': 'AI विश्लेषण शुरू करें',
        'detecting': 'स्थान खोज रहे हैं...',
        'loc_detected': '✅ स्थान मिला: ',
        'searching': '🔍 खोज रहे हैं...',
        'not_found': '❌ स्थान नहीं मिला।',
        'auto_predicting': '🚀 ऑटो-अनुमान...',
        'grains': 'सर्वोत्तम अनाज',
        'fruits': 'सर्वोत्तम फल',
        'vegetables': 'सर्वोत्तम सब्जियां'
    }
};

let currentLang = 'en';

const cropConfigs = {
    "rice": { emoji: "🌾", cat: "grains" },
    "maize": { emoji: "🌽", cat: "grains" },
    "chickpea": { emoji: "🫘", cat: "vegetables" },
    "kidneybeans": { emoji: "🫘", cat: "vegetables" },
    "pigeonpeas": { emoji: "🫘", cat: "vegetables" },
    "mothbeans": { emoji: "🫘", cat: "vegetables" },
    "mungbean": { emoji: "🫘", cat: "vegetables" },
    "blackgram": { emoji: "🫘", cat: "vegetables" },
    "lentil": { emoji: "🌱", cat: "vegetables" },
    "pomegranate": { emoji: "🍎", cat: "fruits" },
    "banana": { emoji: "🍌", cat: "fruits" },
    "mango": { emoji: "🥭", cat: "fruits" },
    "grapes": { emoji: "🍇", cat: "fruits" },
    "watermelon": { emoji: "🍉", cat: "fruits" },
    "muskmelon": { emoji: "🍈", cat: "fruits" },
    "apple": { emoji: "🍎", cat: "fruits" },
    "orange": { emoji: "🍊", cat: "fruits" },
    "papaya": { emoji: "🍈", cat: "fruits" },
    "coconut": { emoji: "🥥", cat: "fruits" },
    "cotton": { emoji: "🌿", cat: "commercial" },
    "jute": { emoji: "🌿", cat: "commercial" },
    "coffee": { emoji: "☕", cat: "commercial" }
};

document.addEventListener('DOMContentLoaded', () => {
    // --- MAP INIT (only on Analysis/Dashboard) ---
    const mapEl = document.getElementById('map');
    if(mapEl) {
        window.map = L.map('map').setView([20.5937, 78.9629], 5);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(window.map);
    }

    const form = document.getElementById('recommendation-form');
    const sliders = document.querySelectorAll('input[type=range]');
    const searchInput = document.getElementById('location-search');
    const searchBtn = document.getElementById('search-btn');
    const autocompleteList = document.getElementById('autocomplete-list');
    const detectLocBtn = document.getElementById('detect-loc-btn');
    const langEn = document.getElementById('lang-en');
    const langHi = document.getElementById('lang-hi');

    updateUIStrings();

    // Language Toggle
    if(langEn) langEn.addEventListener('click', () => { currentLang = 'en'; updateUIStrings(); langEn.classList.add('active'); langHi.classList.remove('active'); });
    if(langHi) langHi.addEventListener('click', () => { currentLang = 'hi'; updateUIStrings(); langHi.classList.add('active'); langEn.classList.remove('active'); });

    // Slider badges
    sliders.forEach(slider => {
        slider.addEventListener('input', (e) => {
            const v = document.getElementById(`v-${e.target.id}`);
            if(v) v.textContent = e.target.value;
            const b = document.getElementById(`badge-${e.target.id}`);
            if(b) b.classList.add('hidden');
        });
    });

    // --- AUTOCOMPLETE ---
    if(searchInput) {
        let debounce;
        searchInput.addEventListener('input', () => {
            clearTimeout(debounce);
            const q = searchInput.value.trim();
            if(q.length < 2) { autocompleteList.classList.add('hidden'); return; }
            debounce = setTimeout(async () => {
                const res = await fetch(`https://photon.komoot.io/api/?q=${encodeURIComponent(q)}&limit=5`);
                const data = await res.json();
                renderAutocomplete(data.features);
            }, 300);
        });

        document.addEventListener('click', (e) => {
            if(!searchInput.contains(e.target) && !autocompleteList.contains(e.target)) autocompleteList.classList.add('hidden');
        });
    }

    function renderAutocomplete(features) {
        autocompleteList.innerHTML = '';
        if(!features.length) { autocompleteList.classList.add('hidden'); return; }
        features.forEach(f => {
            const p = f.properties;
            const name = p.name || p.city || p.country;
            const sub = [p.city, p.state, p.country].filter(Boolean).filter(s => s !== name).join(', ');
            const div = document.createElement('div');
            div.className = 'autocomplete-item';
            div.innerHTML = `<i class="fas fa-location-dot"></i> <div><strong>${name}</strong><br><small>${sub}</small></div>`;
            div.onclick = () => {
                searchInput.value = name + (sub ? `, ${sub}` : '');
                autocompleteList.classList.add('hidden');
                updateLocationData(f.geometry.coordinates[1], f.geometry.coordinates[0], searchInput.value);
            };
            autocompleteList.appendChild(div);
        });
        autocompleteList.classList.remove('hidden');
    }

    // --- GPS & SEARCH ---
    if(searchBtn) searchBtn.onclick = () => searchLocation(searchInput.value);
    if(detectLocBtn) detectLocBtn.onclick = () => {
        if(!navigator.geolocation) return;
        detectLocBtn.classList.add('fa-spin');
        navigator.geolocation.getCurrentPosition(async (pos) => {
            const { latitude, longitude } = pos.coords;
            const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`);
            const data = await res.json();
            updateLocationData(latitude, longitude, data.display_name);
            detectLocBtn.classList.remove('fa-spin');
        }, () => detectLocBtn.classList.remove('fa-spin'));
    };

    async function searchLocation(query) {
        if(!query) return;
        const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&limit=1`);
        const data = await res.json();
        if(data.length) updateLocationData(data[0].lat, data[0].lon, data[0].display_name);
    }

    async function updateLocationData(lat, lng, name) {
        if(!form) {
            window.location.href = `analysis.html?lat=${lat}&lng=${lng}&name=${encodeURIComponent(name)}`;
            return;
        }

        if(window.map) {
            window.map.setView([lat, lng], 13);
            if(window.marker) window.map.removeLayer(window.marker);
            window.marker = L.marker([lat, lng]).addTo(window.map);
        }

        const cityEl = document.getElementById('current-city');
        if(cityEl) cityEl.textContent = name.split(',')[0];
        
        // Update search bar text
        if(searchInput) searchInput.value = name;

        try {
            const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lng}&current=temperature_2m,relative_humidity_2m,precipitation&daily=weather_code,temperature_2m_max,temperature_2m_min&timezone=auto`);
            const weather = await weatherRes.json();
            renderWeatherGrid(weather);

            const soilRes = await fetch('https://agriculture12.onrender.com/get_soil_data', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({ lat, lng })
            });
            const soil = await soilRes.json();
            
            const updates = [
                { id: 'N', val: soil.N, type: 'estimated' },
                { id: 'P', val: soil.P, type: 'estimated' },
                { id: 'K', val: soil.K, type: 'estimated' },
                { id: 'temperature', val: weather.current.temperature_2m, type: 'live' },
                { id: 'humidity', val: weather.current.relative_humidity_2m, type: 'live' },
                { id: 'ph', val: soil.ph, type: 'estimated' },
                { id: 'rainfall', val: Math.min(300, Math.max(20, weather.current.precipitation * 30 || 160)), type: 'live' }
            ];

            const zoneName = document.getElementById('zone-name');
            if(zoneName) zoneName.textContent = soil.zone;
            const zoneCard = document.getElementById('zone-card');
            if(zoneCard) zoneCard.classList.remove('hidden');

            for(const u of updates) {
                const el = document.getElementById(u.id);
                if(!el) continue;
                await new Promise(r => setTimeout(r, 100));
                el.value = u.val;
                document.getElementById(`v-${u.id}`).textContent = u.val;
                const b = document.getElementById(`badge-${u.id}`);
                b.textContent = u.type;
                b.className = `badge badge-${u.type}`;
                b.classList.remove('hidden');
            }

            setTimeout(() => form.dispatchEvent(new Event('submit')), 800);
        } catch (e) { console.error(e); }
    }

    // --- AI RESULTS ---
    if(form) {
        form.onsubmit = async (e) => {
            e.preventDefault();
            document.getElementById('loading-overlay').classList.remove('hidden');
            document.getElementById('result-grid').classList.add('hidden');
            document.getElementById('insights-area').classList.add('hidden');

            const fData = Object.fromEntries(new FormData(form).entries());
            const res = await fetch('https://agriculture12.onrender.com/predict', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(fData)
            });
            const data = await res.json();
            renderResults(data);
            document.getElementById('loading-overlay').classList.add('hidden');
        };
    }

    function renderResults(data) {
        const cats = { grains: [], fruits: [], vegetables: [] };
        const marketList = document.getElementById('market-list');
        const soilTips = document.getElementById('soil-tips');
        if(marketList) marketList.innerHTML = '';
        if(soilTips) soilTips.innerHTML = '';

        data.recommendations.forEach((item, idx) => {
            const cfg = cropConfigs[item.crop] || { emoji: "🌱", cat: "vegetables" };
            const grp = cfg.cat === 'commercial' ? 'vegetables' : cfg.cat;
            const html = `<div class="crop-item"><div class="crop-info"><span class="crop-rank">#${idx+1}</span><span class="crop-name">${cfg.emoji} ${item.crop}</span></div><span class="crop-conf">${item.confidence}%</span></div>`;
            if(cats[grp]) cats[grp].push(html);

            if(marketList) {
                const m = document.createElement('div');
                m.className = 'market-item';
                m.innerHTML = `<span>${cfg.emoji} ${item.crop}</span> <strong>${item.price}</strong>`;
                marketList.appendChild(m);
            }
        });

        for(const k in cats) {
            const el = document.getElementById(`cat-${k}`);
            if(el) el.innerHTML = cats[k].join('') || '<p>No match</p>';
        }

        if(soilTips) {
            const N = parseInt(document.getElementById('N').value);
            if(N < 50) soilTips.innerHTML += `<li>🔴 Low Nitrogen! Add urea.</li>`;
            if(soilTips.innerHTML === '') soilTips.innerHTML = '<li>✅ Soil health is stable.</li>';
        }

        document.getElementById('initial-message')?.classList.add('hidden');
        document.getElementById('result-grid').classList.remove('hidden');
        document.getElementById('insights-area').classList.remove('hidden');
    }

    function renderWeatherGrid(data) {
        const grid = document.getElementById('weather-grid');
        if(!grid) return;
        grid.innerHTML = '';
        const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
        data.daily.time.forEach((date, i) => {
            const dayIdx = new Date(date).getDay();
            const div = document.createElement('div');
            div.className = 'weather-day';
            div.innerHTML = `<span class="day">${days[dayIdx]}</span><span class="temp">${Math.round(data.daily.temperature_2m_max[i])}°</span>`;
            grid.appendChild(div);
        });
    }

    function updateUIStrings() {
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const k = el.getAttribute('data-i18n');
            if(translations[currentLang][k]) el.textContent = translations[currentLang][k];
        });
    }

    function showToast(m) {
        const t = document.getElementById('toast');
        if(t) { t.textContent = m; t.classList.remove('hidden'); setTimeout(() => t.classList.add('hidden'), 3000); }
    }
});
