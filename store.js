// Where to get MovieRecs: the App Store once it's live there, the TestFlight beta until then.
// Asks Apple's public lookup (nothing about the visitor is sent). MovieRecsStore.whenKnown(fn)
// calls fn({ url, isLive }) once that's known (or right away, if it already is).
(function () {
  var APP_STORE = "https://apps.apple.com/app/id6817897695";
  var TESTFLIGHT = "https://testflight.apple.com/join/E2WVG1ms";
  var known = null, waiting = [];
  function settle(live) {
    if (known) return;
    known = { url: live ? APP_STORE : TESTFLIGHT, isLive: live };
    waiting.forEach(function (fn) { fn(known); });
    waiting = [];
  }
  window.MovieRecsStore = {
    whenKnown: function (fn) { if (known) fn(known); else waiting.push(fn); },
    fallback: TESTFLIGHT
  };
  window.__movieRecsLookup = function (data) { settle(!!(data && data.resultCount > 0)); };
  var script = document.createElement("script");
  script.src = "https://itunes.apple.com/lookup?id=6817897695&country=us&callback=__movieRecsLookup";
  script.onerror = function () { settle(false); };
  document.head.appendChild(script);
  setTimeout(function () { settle(false); }, 2500);
})();
