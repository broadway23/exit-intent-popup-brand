/* counter.js  – a self-contained, reusable live counter  */
(function () {
  /* ============== EDIT THESE NUMBERS ONLY ============== */
  const START_VALUE        = 400000;                      // counter start
  const END_VALUE          = 405000;                      // counter end
  const CAMPAIGN_START_UTC = Date.UTC(2025, 3, 23, 0, 0); // 23 Apr 2025 00:00 UTC
  const CAMPAIGN_MS        = 3 * 24 * 60 * 60 * 1000;     // 3 days campaign
  /* ===================================================== */

  const nf        = new Intl.NumberFormat('en-US');
  const ratePerMs = (END_VALUE - START_VALUE) / CAMPAIGN_MS;
  let shuffled    = false;

  function currentValue () {
    const elapsed = Date.now() - CAMPAIGN_START_UTC;
    const clamped = Math.min(Math.max(elapsed, 0), CAMPAIGN_MS);
    return START_VALUE + clamped * ratePerMs;
  }

  function runCounter () {
    const $el = document.getElementById('js-user-num');
    if (!$el) return;

    const DURATION = 800, STEP = 60;
    const target   = Math.floor(currentValue());
    const base     = Math.floor(target / 1000);
    const maxTail  = target % 1000;
    const t0       = Date.now();

    const iv = setInterval(() => {
      const dt = Date.now() - t0;
      if (dt >= DURATION) {
        clearInterval(iv);
        $el.textContent = nf.format(target);
        shuffled = true;
        return;
      }
      const rndTail = Math.floor(Math.random() * (maxTail + 1))
                        .toString()
                        .padStart(3, '0');
      $el.textContent = nf.format(Number(`${base}${rndTail}`));
    }, STEP);

    (function liveTick () {
      if (shuffled) $el.textContent = nf.format(Math.floor(currentValue()));
      requestAnimationFrame(liveTick);
    })();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', runCounter);
  } else {
    runCounter();
  }
})();
