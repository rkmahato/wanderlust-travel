import { config } from '@/config';

const cache = new Map();
const CACHE_TTL = 10 * 60 * 1000; // 10 minutes

function getCached(key) {
    const entry = cache.get(key);
    if (!entry) return null;
    if (Date.now() - entry.timestamp > CACHE_TTL) {
        cache.delete(key);
        return null;
    }
    return entry.data;
}

function setCached(key, data) {
    cache.set(key, { data, timestamp: Date.now() });
}

export function mapWmoCode(code) {
    if (code === 0) return { description: 'Clear sky', icon: '01d' };
    if (code === 1) return { description: 'Mainly clear', icon: '02d' };
    if (code === 2) return { description: 'Partly cloudy', icon: '03d' };
    if (code === 3) return { description: 'Overcast', icon: '04d' };
    if (code === 45 || code === 48) return { description: 'Fog & Mist', icon: '50d' };
    if (code >= 51 && code <= 55) return { description: 'Light drizzle', icon: '09d' };
    if (code >= 61 && code <= 65) return { description: 'Rain showers', icon: '10d' };
    if (code >= 71 && code <= 77) return { description: 'Snowfall', icon: '13d' };
    if (code >= 80 && code <= 82) return { description: 'Rain showers', icon: '09d' };
    if (code >= 95) return { description: 'Thunderstorm', icon: '11d' };
    return { description: 'Partly cloudy', icon: '03d' };
}

function generateFallbackForecast(baseTemp, baseIcon, baseDescription) {
    const today = new Date();
    const offsets = [1, 2, 3];
    return offsets.map((offset, idx) => {
        const d = new Date(today);
        d.setDate(today.getDate() + offset);
        const dayName = offset === 1 ? 'Tomorrow' : d.toLocaleDateString('en-US', { weekday: 'short' });
        const dateStr = d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
        const delta = idx === 0 ? 1 : idx === 1 ? -1 : 2;
        return {
            day: dayName,
            date: dateStr,
            tempMax: Math.round(baseTemp + delta + 2),
            tempMin: Math.round(baseTemp + delta - 4),
            description: baseDescription || 'Mainly clear',
            icon: baseIcon || '02d',
            weatherCode: 1
        };
    });
}

function mapOpenWeatherResponse(raw) {
    const main = raw.main;
    const weather = raw.weather[0];
    const wind = raw.wind;
    const sys = raw.sys;
    const temp = Math.round(main.temp);
    const desc = weather.description;
    const icon = weather.icon;

    return {
        city: raw.name,
        country: sys.country || '',
        temperature: temp,
        feelsLike: Math.round(main.feels_like),
        humidity: main.humidity,
        description: desc,
        icon: icon,
        windSpeed: Math.round(wind.speed * 3.6), // convert m/s to km/h if metric
        windDirection: Math.round(wind.deg ?? 180),
        visibility: Math.round((raw.visibility ?? 10000) / 1000),
        sunrise: sys.sunrise,
        sunset: sys.sunset,
        forecast: generateFallbackForecast(temp, icon, desc)
    };
}

async function fetchWithTimeout(url, customTimeout) {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), customTimeout || config.openWeather.timeout || 6000);
    try {
        const response = await fetch(url, { signal: controller.signal });
        return response;
    } finally {
        clearTimeout(timer);
    }
}

/**
 * High-accuracy live weather and 3-day forecast using Open-Meteo
 */
async function fetchOpenMeteoLive(lat, lon, cityName, countryName) {
    const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,apparent_temperature,weather_code,wind_speed_10m,wind_direction_10m&daily=weather_code,temperature_2m_max,temperature_2m_min,sunrise,sunset&timezone=auto&forecast_days=4`;
    const res = await fetchWithTimeout(url);
    if (!res.ok) throw new Error(`Weather service error: ${res.status}`);
    const data = await res.json();
    const curr = data.current;
    const weather = mapWmoCode(curr.weather_code);

    const sunriseTs = data.daily?.sunrise?.[0]
        ? Math.floor(new Date(data.daily.sunrise[0]).getTime() / 1000)
        : Math.floor(Date.now() / 1000) - 20000;
    const sunsetTs = data.daily?.sunset?.[0]
        ? Math.floor(new Date(data.daily.sunset[0]).getTime() / 1000)
        : Math.floor(Date.now() / 1000) + 20000;

    // Parse 3-day forecast outlook
    const forecast = [];
    if (data.daily?.time && data.daily.time.length > 1) {
        for (let i = 1; i < Math.min(4, data.daily.time.length); i++) {
            const code = data.daily.weather_code?.[i] ?? 0;
            const wInfo = mapWmoCode(code);
            const dateObj = new Date(data.daily.time[i] + 'T00:00:00');
            const dayName = i === 1 ? 'Tomorrow' : dateObj.toLocaleDateString('en-US', { weekday: 'short' });
            const dateStr = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
            forecast.push({
                day: dayName,
                date: dateStr,
                tempMax: Math.round(data.daily.temperature_2m_max?.[i] ?? curr.temperature_2m + 2),
                tempMin: Math.round(data.daily.temperature_2m_min?.[i] ?? curr.temperature_2m - 4),
                description: wInfo.description,
                icon: wInfo.icon,
                weatherCode: code,
            });
        }
    } else {
        forecast.push(...generateFallbackForecast(curr.temperature_2m, weather.icon, weather.description));
    }

    return {
        city: cityName || 'Expedition Destination',
        country: countryName || '',
        temperature: Math.round(curr.temperature_2m),
        feelsLike: Math.round(curr.apparent_temperature),
        humidity: curr.relative_humidity_2m,
        description: weather.description,
        icon: weather.icon,
        windSpeed: Math.round(curr.wind_speed_10m),
        windDirection: Math.round(curr.wind_direction_10m ?? 180),
        visibility: 10,
        sunrise: sunriseTs,
        sunset: sunsetTs,
        forecast,
    };
}

export async function fetchWeather(lat, lon, cityName = '', countryName = '') {
    const cacheKey = `coord:${Number(lat).toFixed(2)},${Number(lon).toFixed(2)}`;
    const cached = getCached(cacheKey);
    if (cached) return cached;

    // If OpenWeather key is configured, query OpenWeather
    if (config.openWeather.key) {
        try {
            const url = `${config.openWeather.baseUrl}/weather?lat=${lat}&lon=${lon}&units=metric&appid=${config.openWeather.key}`;
            const response = await fetchWithTimeout(url);
            if (response.ok) {
                const raw = await response.json();
                const data = mapOpenWeatherResponse(raw);
                if (cityName) data.city = cityName;
                if (countryName) data.country = countryName;

                // Try fetching forecast from OpenWeather
                try {
                    const fUrl = `${config.openWeather.baseUrl}/forecast?lat=${lat}&lon=${lon}&units=metric&appid=${config.openWeather.key}`;
                    const fRes = await fetchWithTimeout(fUrl, 3000);
                    if (fRes.ok) {
                        const fData = await fRes.json();
                        const dailyList = fData.list.filter((_, idx) => idx % 8 === 0).slice(1, 4);
                        if (dailyList.length === 3) {
                            data.forecast = dailyList.map((item, idx) => {
                                const d = new Date(item.dt * 1000);
                                return {
                                    day: idx === 0 ? 'Tomorrow' : d.toLocaleDateString('en-US', { weekday: 'short' }),
                                    date: d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
                                    tempMax: Math.round(item.main.temp_max),
                                    tempMin: Math.round(item.main.temp_min),
                                    description: item.weather[0].description,
                                    icon: item.weather[0].icon,
                                    weatherCode: item.weather[0].id
                                };
                            });
                        }
                    }
                } catch {
                    // Maintain fallback forecast
                }

                setCached(cacheKey, data);
                return data;
            }
        } catch {
            // Fall through to Open-Meteo
        }
    }

    // High fidelity telemetry via Open-Meteo
    const liveData = await fetchOpenMeteoLive(lat, lon, cityName, countryName);
    setCached(cacheKey, liveData);
    return liveData;
}

export async function fetchWeatherByCity(city) {
    const cleanCity = city.trim();
    const cacheKey = `city:${cleanCity.toLowerCase()}`;
    const cached = getCached(cacheKey);
    if (cached) return cached;

    if (config.openWeather.key) {
        try {
            const url = `${config.openWeather.baseUrl}/weather?q=${encodeURIComponent(cleanCity)}&units=metric&appid=${config.openWeather.key}`;
            const response = await fetchWithTimeout(url);
            if (response.ok) {
                const raw = await response.json();
                const data = mapOpenWeatherResponse(raw);
                setCached(cacheKey, data);
                return data;
            }
        } catch {
            // Fall through
        }
    }

    // Geocode city via Open-Meteo geocoding API
    const geoUrl = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cleanCity)}&count=1&language=en&format=json`;
    const geoRes = await fetchWithTimeout(geoUrl);
    if (!geoRes.ok) throw new Error(`City "${cleanCity}" not found`);
    const geoJson = await geoRes.json();
    if (!geoJson.results || geoJson.results.length === 0) {
        throw new Error(`City "${cleanCity}" not found`);
    }

    const top = geoJson.results[0];
    const weather = await fetchOpenMeteoLive(top.latitude, top.longitude, top.name, top.country || '');
    setCached(cacheKey, weather);
    return weather;
}

export function getWeatherIconUrl(iconCode) {
    return `${config.openWeather.iconBaseUrl}/${iconCode}@2x.png`;
}

/**
 * Intelligent travel weather advisory generator tailored to expedition & outdoor travelers
 */
export function getWeatherAdvisory(data) {
    if (!data) return {
        title: 'Calibrating Telemetry',
        badge: 'Atmospheric Check',
        tip: 'Retrieving live atmospheric conditions from ground sensors...',
        tone: 'neutral'
    };

    const desc = (data.description || '').toLowerCase();
    const temp = data.temperature;
    const wind = data.windSpeed || 0;

    if (desc.includes('thunder') || desc.includes('storm')) {
        return {
            title: 'Storm System Warning',
            badge: 'Active Storm Alert',
            tip: 'Thunderstorm activity detected. Suspend high-altitude climbs & water expeditions; ideal for local heritage lounges.',
            tone: 'warning'
        };
    }
    if (desc.includes('snow') || desc.includes('blizzard') || temp <= 0) {
        return {
            title: 'Alpine Winter Protocol',
            badge: 'Glacial Chill',
            tip: 'Freezing conditions with snow cover. Insulated thermal layering, windproof outer shells, and crampons advised.',
            tone: 'cold'
        };
    }
    if (desc.includes('rain') || desc.includes('drizzle') || desc.includes('shower')) {
        return {
            title: 'Precipitation Advisory',
            badge: 'Pack Waterproof Layers',
            tip: 'Scattered showers present. Carry a lightweight Gore-Tex jacket and waterproof gear drybags.',
            tone: 'rain'
        };
    }
    if (desc.includes('fog') || desc.includes('mist')) {
        return {
            title: 'Low Visibility Advisory',
            badge: 'Moody Atmosphere',
            tip: 'Atmospheric mist and fog present. Dramatic light for moody photography; exercise caution on mountain switchbacks.',
            tone: 'neutral'
        };
    }
    if (wind >= 35) {
        return {
            title: 'Gale Wind Warning',
            badge: 'Brisk Ridge Winds',
            tip: `Sustained wind velocities of ${wind} km/h. Secure loose gear and avoid exposed cliff edges.`,
            tone: 'warning'
        };
    }
    if (temp <= 10) {
        return {
            title: 'Crisp Alpine Conditions',
            badge: 'Crisp Hiking Weather',
            tip: 'Crisp, invigorating mountain air. Perfect for vigorous ascents, trail running, and peak panoramas with a light fleece.',
            tone: 'cold'
        };
    }
    if (temp > 10 && temp <= 22) {
        return {
            title: 'Prime Expedition Weather',
            badge: 'Clear Golden Hour Skies',
            tip: 'Optimal temperate climate. Superb visibility for photography, trekking, and open-air adventure pursuits.',
            tone: 'optimal'
        };
    }
    if (temp > 22 && temp <= 29) {
        return {
            title: 'Warm Coastal Climate',
            badge: 'Warm Coastal Breeze',
            tip: 'Sun-drenched warmth with mild breezes. Ideal for ocean swims, scenic sailing, and alfresco terrace dining.',
            tone: 'warm'
        };
    }
    return {
        title: 'Tropical Heat Advisory',
        badge: 'High Solar Index',
        tip: 'Intense midday heat. Schedule summit treks for early dawn or dusk, hydrate continuously, and apply high-SPF protection.',
        tone: 'hot'
    };
}
