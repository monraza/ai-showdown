/* Appearance: Match system (default), Light or Dark. Loaded in <head> so the pinned theme
   applies before the first paint. The choice is a per-browser convenience; without storage
   the page simply follows the system. */
(function () {
  var KEY = 'ai-showdown-theme', root = document.documentElement;
  function get() { try { return localStorage.getItem(KEY) || 'system'; } catch (e) { return 'system'; } }
  function apply(t) {
    if (t === 'light' || t === 'dark') root.setAttribute('data-theme', t); else root.removeAttribute('data-theme');
    document.querySelectorAll('[data-appearance] button').forEach(function (b) {
      b.setAttribute('aria-pressed', String(b.value === t));
    });
  }
  apply(get());
  document.addEventListener('DOMContentLoaded', function () {
    document.querySelectorAll('[data-appearance] button').forEach(function (b) {
      b.addEventListener('click', function () {
        try { if (b.value === 'system') localStorage.removeItem(KEY); else localStorage.setItem(KEY, b.value); } catch (e) {}
        apply(b.value);
      });
    });
    apply(get());
  });
})();
