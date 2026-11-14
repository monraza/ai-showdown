/* Google Analytics 4 for the AI Showdown site, with Google Consent Mode.
   Who is asked:
   - Defaults are set per country by Google from the visitor's IP: in the EU/EEA, the UK and Switzerland, analytics
     cookies are denied until the visitor allows them; elsewhere they are allowed. Ad features are always off.
   - The question itself is shown when the device's time zone is in those regions (no lookup, nothing sent).
     If that guess misses someone in the EU, they are simply never given cookies: only anonymous cookieless pings.
   How it asks: a small glass pill, bottom-left, after the visitor scrolls or stays 4 s. Scrolling down tucks it
   into a round icon; tapping the icon opens it again. "Allow" and "No thanks" are equally easy.
   The choice is kept in localStorage ('ig-analytics'). Elements with data-analytics-settings (the footer link)
   reopen it for anyone. Clicks are tracked with one delegated listener, so the pages stay unchanged.
   While ID is the placeholder, nothing loads and nothing is shown. */
(() => {
  const ID = 'G-58GKGRKG4N';
  if (!/^G-[A-Z0-9]+$/.test(ID) || ID === 'G-XXXXXXXXXX') { window.track = () => {}; return; }

  /* EU 27, rest of the EEA, the UK and Switzerland */
  const ASK_REGIONS = ['AT', 'BE', 'BG', 'HR', 'CY', 'CZ', 'DK', 'EE', 'FI', 'FR', 'DE', 'GR', 'HU', 'IE', 'IT', 'LV', 'LT', 'LU', 'MT', 'NL',
    'PL', 'PT', 'RO', 'SK', 'SI', 'ES', 'SE', 'IS', 'LI', 'NO', 'GB', 'CH'];
  /* time zones in those regions, including the EU's Atlantic islands and French overseas departments;
     Europe/* zones of Russia, Belarus, Ukraine, Turkey and other non-EU countries are left out */
  const NOT_ASK_TZ = /^Europe\/(Moscow|Kaliningrad|Samara|Volgograd|Saratov|Ulyanovsk|Astrakhan|Kirov|Simferopol|Minsk|Kiev|Kyiv|Uzhgorod|Zaporozhye|Istanbul|Chisinau|Belgrade|Sarajevo|Skopje|Tirane|Podgorica)$/;
  const ASK_TZ = /^(Europe\/|Atlantic\/(Canary|Madeira|Azores|Faroe|Reykjavik)$|Arctic\/Longyearbyen$|America\/(Guadeloupe|Martinique|Cayenne|St_Barthelemy|Marigot)$|Indian\/(Reunion|Mayotte)$)/;
  const tz = (() => { try { return Intl.DateTimeFormat().resolvedOptions().timeZone || ''; } catch (e) { return ''; } })();
  const askHere = ASK_TZ.test(tz) && !NOT_ASK_TZ.test(tz);

  const KEY = 'ig-analytics';
  const getChoice = () => { try { return localStorage.getItem(KEY); } catch (e) { return null; } };
  const setChoice = v => { try { localStorage.setItem(KEY, v); } catch (e) {} };

  window.dataLayer = window.dataLayer || [];
  function gtag() { dataLayer.push(arguments); }
  window.gtag = gtag;
  const NO_ADS = { ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied' };
  gtag('consent', 'default', { analytics_storage: 'denied', ...NO_ADS, region: ASK_REGIONS });
  gtag('consent', 'default', { analytics_storage: 'granted', ...NO_ADS });
  const choice = getChoice();
  if (choice === 'granted' || choice === 'denied') gtag('consent', 'update', { analytics_storage: choice });
  gtag('js', new Date());
  gtag('config', ID);
  const s = document.createElement('script');
  s.async = true; s.src = 'https://www.googletagmanager.com/gtag/js?id=' + ID;
  document.head.appendChild(s);

  const track = window.track = (name, params) => gtag('event', name, params || {});

  /* ---------- the consent pill ---------- */
  const css = document.createElement('style');
  css.textContent = `
.ig-pill{position:fixed;z-index:60;left:16px;bottom:16px;display:flex;align-items:center;gap:10px;max-width:calc(100% - 32px);height:44px;padding:0 6px 0 7px;
  background:var(--glass-popover);background:color-mix(in srgb,var(--wall-base) 50%,var(--glass-popover));border:1px solid var(--edge);border-radius:var(--radius-pill);box-shadow:var(--shadow-glass);color:var(--ink);font:500 13px/18px var(--font-sans);
  -webkit-backdrop-filter:blur(var(--blur-popover)) saturate(170%);backdrop-filter:blur(var(--blur-popover)) saturate(170%);
  overflow:hidden;white-space:nowrap;transform:translateY(calc(100% + 24px));opacity:0;
  transition:transform .45s cubic-bezier(.2,.9,.3,1.2),opacity .3s ease,max-width .4s cubic-bezier(.3,.8,.3,1)}
.ig-pill.in{transform:none;opacity:1}
.ig-pill .ic{display:grid;place-items:center;flex:none;width:30px;height:30px;padding:0;border:0;border-radius:50%;background:var(--accent-wash);color:var(--accent-ink);cursor:pointer}
.ig-pill .ic svg{width:16px;height:16px;fill:none;stroke:currentColor;stroke-width:2.2;stroke-linecap:round}
.ig-pill .ic .bar{transform-origin:50% 100%;transform-box:fill-box;animation:igRise 1.6s ease-in-out infinite alternate}
.ig-pill .ic .bar:nth-child(2){animation-delay:.25s}.ig-pill .ic .bar:nth-child(3){animation-delay:.5s}
@keyframes igRise{from{transform:scaleY(.45)}to{transform:scaleY(1)}}
.ig-pill .q{color:var(--ink-muted)}
.ig-pill .q b{color:var(--ink);font-weight:600}
.ig-pill .acts{display:flex;gap:4px;flex:none}
.ig-pill .acts button{height:32px;padding:0 12px;border:1px solid var(--hairline);border-radius:var(--radius-pill);background:var(--fill);color:var(--ink);font:500 13px/1 var(--font-sans);cursor:pointer}
.ig-pill .acts button:hover{background:var(--fill-hover)}
.ig-pill .q,.ig-pill .acts{transition:opacity .25s ease}
.ig-pill.tucked{max-width:44px}
.ig-pill.tucked .q,.ig-pill.tucked .acts{opacity:0;pointer-events:none}
.ig-pill.done .acts{display:none}
.ig-pill.done{padding-right:16px}
.ig-pill.out{transform:translateY(calc(100% + 24px)) scale(.9);opacity:0}
@media (max-width:420px){.ig-pill .q .more{display:none}}
@media (prefers-reduced-motion:reduce){.ig-pill .ic .bar{animation:none}}
[data-analytics-settings]{background:none;border:0;padding:0;color:inherit;font:inherit;text-decoration:underline;text-underline-offset:2px;cursor:pointer}
[data-analytics-settings]::before{content:"·";display:inline-block;margin:0 .45em;text-decoration:none}`;
  document.head.appendChild(css);
  const onReady = fn => { if (document.readyState === 'loading') addEventListener('DOMContentLoaded', fn); else fn(); };
  onReady(() => document.querySelectorAll('[data-analytics-settings][hidden]').forEach(b => { b.hidden = false; }));

  let pill = null;
  function showPill() {
    if (pill) { pill.classList.remove('tucked'); return; }
    pill = document.createElement('div');
    pill.className = 'ig-pill'; pill.setAttribute('role', 'region'); pill.setAttribute('aria-label', 'Analytics choice');
    pill.innerHTML =
      '<button class="ic" type="button" aria-label="Show or hide the analytics choice"><svg viewBox="0 0 24 24" aria-hidden="true">' +
      '<path class="bar" d="M6 20V12"/><path class="bar" d="M12 20V5"/><path class="bar" d="M18 20V9"/></svg></button>' +
      '<span class="q"><b>Count your visit?</b><span class="more"> Uses analytics cookies.</span></span>' +
      '<span class="acts"><button type="button" data-c="granted">Allow</button><button type="button" data-c="denied">No thanks</button></span>';
    pill.addEventListener('click', e => {
      if (e.target.closest('.ic')) { pill && pill.classList.toggle('tucked'); return; }
      const b = e.target.closest('[data-c]'); if (!b || !pill) return;
      const c = b.dataset.c;
      setChoice(c);
      gtag('consent', 'update', { analytics_storage: c });
      const p = pill; pill = null;
      p.classList.remove('tucked'); p.classList.add('done');
      p.querySelector('.q').innerHTML = c === 'granted' ? '<b>Thanks!</b>' : '<b>No cookies, got it.</b>';
      setTimeout(() => { p.classList.add('out'); setTimeout(() => p.remove(), 500); }, 1100);
    });
    document.body.appendChild(pill);
    requestAnimationFrame(() => requestAnimationFrame(() => pill && pill.classList.add('in')));
    /* scrolling down tucks it away, so it never sits over what someone is reading */
    let lastY = scrollY;
    addEventListener('scroll', () => {
      if (!pill) return;
      if (scrollY > lastY + 40) pill.classList.add('tucked');
      if (Math.abs(scrollY - lastY) > 40) lastY = scrollY;
    }, { passive: true });
  }
  if (!choice && askHere) {
    onReady(() => {
      let shown = false, t = 0;
      const go = () => { if (shown) return; shown = true; removeEventListener('scroll', go); clearTimeout(t); showPill(); };
      t = setTimeout(go, 4000);
      addEventListener('scroll', go, { passive: true });
    });
  }

  /* ---------- events ---------- */
  const where = el => el.closest('header') ? 'header' : el.closest('footer') ? 'footer' : el.closest('.hero') ? 'hero' : el.closest('.card') ? 'card' : 'page';
  document.addEventListener('click', e => {
    const el = e.target.closest('a,button'); if (!el) return;
    if (el.matches('[data-analytics-settings]')) { showPill(); return; }
    if (el.closest('.ig-pill')) return;
    const href = el.getAttribute('href') || '';
    let m;
    if ((m = href.match(/play\.html\?m=(\w+)/))) track('play_3d_click', { model: m[1], location: where(el) });
    else if (el.dataset.tour) track('video_open', { model: el.dataset.tour, via: el.classList.contains('cv') ? 'thumbnail' : 'button' });
    else if (el.id === 'copyPrompt') track('prompt_copy');
    else if (el.id === 'sound') track('hero_sound', { on: el.getAttribute('aria-pressed') === 'true' });
    else if (/#(play|prompt)$/.test(href)) track('nav_click', { target: href.match(/#(\w+)$/)[1], location: where(el) });
    else if (/\/\/(www\.)?(x|twitter)\.com\/|linkedin\.com\//.test(href)) track('follow_click', { network: /linkedin\.com/.test(href) ? 'linkedin' : 'x', location: where(el) });
    else if (el.matches('.tabs a[data-m]')) track('model_switch', { model: el.dataset.m });
    else if (el.id === 'fs') track('fullscreen');
    else if (el.matches('.ctl')) track('controls_toggle', { shown: el.getAttribute('aria-pressed') === 'true' });
  });

  /* 3D page: how long each scene takes to appear (its loading cover is shown, then hidden) */
  onReady(() => {
    const cover = document.getElementById('loading'); if (!cover) return;
    let t0 = 0;
    new MutationObserver(() => {
      if (!cover.classList.contains('off')) t0 = performance.now();
      else if (t0 !== null) {
        track('scene_load', { model: new URLSearchParams(location.search).get('m') || 'sonnet', load_ms: Math.round(performance.now() - t0) });
        t0 = null;
      }
    }).observe(cover, { attributes: true, attributeFilter: ['class'] });
  });
})();
