/* ═════════════════════════════════════════════
   ATMOS — Weather App  |  app.js
═════════════════════════════════════════════ */

/* ── Animated canvas background ── */
(function () {
  const canvas = document.getElementById('bgCanvas');
  const ctx    = canvas.getContext('2d');
  let W, H, particles = [];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
    initParticles();
  }

  function initParticles() {
    particles = Array.from({ length: 60 }, () => ({
      x:  Math.random() * W,
      y:  Math.random() * H,
      r:  Math.random() * 2.8 + 0.6,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.25,
      a:  Math.random() * 0.6 + 0.2,
    }));
  }

  function drawBg() {
    const grad = ctx.createLinearGradient(0, 0, 0, H);
    grad.addColorStop(0,   '#08091a');
    grad.addColorStop(0.5, '#080c18');
    grad.addColorStop(1,   '#060b1a');
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, W, H);

    const orb1 = ctx.createRadialGradient(W*0.78, H*0.12, 0, W*0.78, H*0.12, W*0.28);
    orb1.addColorStop(0, 'rgba(56,189,248,0.07)');
    orb1.addColorStop(1, 'transparent');
    ctx.fillStyle = orb1;
    ctx.fillRect(0, 0, W, H);

    const orb2 = ctx.createRadialGradient(W*0.12, H*0.82, 0, W*0.12, H*0.82, W*0.24);
    orb2.addColorStop(0, 'rgba(129,140,248,0.07)');
    orb2.addColorStop(1, 'transparent');
    ctx.fillStyle = orb2;
    ctx.fillRect(0, 0, W, H);
  }

  function tick() {
    drawBg();
    particles.forEach(p => {
      p.x = (p.x + p.vx + W) % W;
      p.y = (p.y + p.vy + H) % H;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(56,189,248,${p.a})`;
      ctx.fill();
    });
    requestAnimationFrame(tick);
  }

  window.addEventListener('resize', resize);
  resize();
  tick();
})();


/* ── Compass canvas ── */
function drawCompass(deg) {
  const canvas = document.getElementById('compass');
  const ctx    = canvas.getContext('2d');
  const W = canvas.width, H = canvas.height;
  const cx = W/2, cy = H/2, r = W/2 - 8;

  ctx.clearRect(0, 0, W, H);

  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI*2);
  ctx.strokeStyle = 'rgba(56,189,248,0.18)';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  const g = ctx.createRadialGradient(cx, cy, r-14, cx, cy, r);
  g.addColorStop(0, 'rgba(56,189,248,0.06)');
  g.addColorStop(1, 'transparent');
  ctx.fillStyle = g;
  ctx.beginPath();
  ctx.arc(cx, cy, r, 0, Math.PI*2);
  ctx.fill();

  for (let i = 0; i < 36; i++) {
    const a   = (i/36) * Math.PI*2;
    const len = i%9===0 ? 10 : 5;
    ctx.beginPath();
    ctx.moveTo(cx + (r-2)*Math.sin(a),   cy - (r-2)*Math.cos(a));
    ctx.lineTo(cx + (r-len)*Math.sin(a), cy - (r-len)*Math.cos(a));
    ctx.strokeStyle = i%9===0 ? 'rgba(56,189,248,0.5)' : 'rgba(56,189,248,0.15)';
    ctx.lineWidth = i%9===0 ? 1.5 : 1;
    ctx.stroke();
  }

  ctx.beginPath();
  ctx.arc(cx, cy, 4, 0, Math.PI*2);
  ctx.fillStyle = '#38bdf8';
  ctx.fill();

  const rad  = (deg * Math.PI) / 180;
  const tipX = cx + (r-18)*Math.sin(rad);
  const tipY = cy - (r-18)*Math.cos(rad);
  const tlX  = cx - (r-30)*Math.sin(rad);
  const tlY  = cy + (r-30)*Math.cos(rad);

  ctx.beginPath();
  ctx.moveTo(tlX, tlY);
  ctx.lineTo(tipX, tipY);
  ctx.strokeStyle = '#38bdf8';
  ctx.lineWidth = 2.5;
  ctx.lineCap = 'round';
  ctx.stroke();

  const hL=10, hW=5;
  const px=-Math.cos(rad), py=-Math.sin(rad);
  ctx.beginPath();
  ctx.moveTo(tipX, tipY);
  ctx.lineTo(tipX - hL*Math.sin(rad) + hW*px, tipY + hL*Math.cos(rad) + hW*py);
  ctx.lineTo(tipX - hL*Math.sin(rad) - hW*px, tipY + hL*Math.cos(rad) - hW*py);
  ctx.closePath();
  ctx.fillStyle = '#38bdf8';
  ctx.fill();
}


/* ── DOM refs ── */
const input      = document.getElementById('cityInput');
const searchBtn  = document.getElementById('searchBtn');
const loader     = document.getElementById('loader');
const errorBox   = document.getElementById('errorBox');
const errorMsg   = document.getElementById('errorMsg');
const results    = document.getElementById('results');
const searchHint = document.getElementById('searchHint');

searchBtn.addEventListener('click', doSearch);
input.addEventListener('keydown', e => { if (e.key === 'Enter') doSearch(); });

function doSearch() {
  const city = input.value.trim();
  if (!city) {
    const box = document.querySelector('.search-box');
    box.style.animation = 'none';
    requestAnimationFrame(() => { box.style.animation = 'shake 0.35s ease'; });
    return;
  }
  fetchWeather(city);
}

const shakeSt = document.createElement('style');
shakeSt.textContent = `@keyframes shake{0%,100%{transform:translateX(0)}20%{transform:translateX(-8px)}40%{transform:translateX(8px)}60%{transform:translateX(-5px)}80%{transform:translateX(5px)}}`;
document.head.appendChild(shakeSt);


/* ── Fetch ── */
async function fetchWeather(city) {
  setLoading(true);
  hideError();
  results.classList.add('hidden');
  if (searchHint) searchHint.classList.add('hidden');

  try {
    const res  = await fetch(`/weather?city=${encodeURIComponent(city)}`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Unknown error');
    renderResults(data);
  } catch (err) {
    showError(err.message);
  } finally {
    setLoading(false);
  }
}


/* ── Render ── */
function renderResults(d) {
  document.getElementById('cityName').textContent    = d.city;
  document.getElementById('countryName').textContent = `${d.country}  ·  ${d.description}`;
  document.getElementById('conditionIcon').textContent = d.icon;
  document.getElementById('conditionDesc').textContent = d.description;
  document.getElementById('tempMain').textContent    = d.temp;
  document.getElementById('feelsLike').textContent   = d.feels_like;
  document.getElementById('tempMin').textContent     = d.temp_min;
  document.getElementById('tempMax').textContent     = d.temp_max;
  document.getElementById('humidity').textContent    = `${d.humidity}%`;
  document.getElementById('visibility').textContent  = `${d.visibility} km`;
  document.getElementById('pressure').textContent    = `${d.pressure} hPa`;
  document.getElementById('wind').textContent        = `${d.wind_speed} km/h`;

  const pct = Math.min((d.wind_speed / 120) * 100, 100).toFixed(1);
  document.getElementById('windBarFill').style.width = pct + '%';

  const ts = new Date().toLocaleString('en-IN', {
    hour: '2-digit', minute: '2-digit',
    day: 'numeric', month: 'short', year: 'numeric'
  });
  document.getElementById('updatedAt').textContent = `Updated ${ts}`;

  const aqiColor = d.aqi_color;
  document.getElementById('aqiNum').textContent   = d.aqi;
  document.getElementById('aqiBadge').textContent = d.aqi_label;
  document.getElementById('aqiCity').textContent  = d.city;
  document.getElementById('aqiNum').style.color   = aqiColor;

  const badge = document.getElementById('aqiBadge');
  badge.style.background = aqiColor;
  badge.style.color = '#080c18';

  const arc = document.getElementById('aqiArc');
  arc.style.stroke           = aqiColor;
  arc.style.strokeDashoffset = 289 - (d.aqi / 5) * 289;

  document.getElementById('aqiCard').style.borderColor = aqiColor;

  document.getElementById('pm25').textContent = d.pm2_5;
  document.getElementById('pm10').textContent = d.pm10;
  document.getElementById('o3').textContent   = d.o3;
  document.getElementById('no2').textContent  = d.no2;
  document.getElementById('so2').textContent  = d.so2;
  document.getElementById('co').textContent   = d.co;

  drawCompass(d.wind_deg);
  document.getElementById('windSpeed2').textContent = d.wind_speed;
  document.getElementById('windDir').textContent    = d.wind_dir;

  results.classList.remove('hidden');
}


/* ── Helpers ── */
function setLoading(on) {
  loader.classList.toggle('hidden', !on);
  searchBtn.disabled = on;
}

function showError(msg) {
  errorMsg.textContent = msg;
  errorBox.classList.remove('hidden');
}

function hideError() {
  errorBox.classList.add('hidden');
}
