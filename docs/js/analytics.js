const isStandalone =
  window.matchMedia('(display-mode: standalone)').matches ||
  window.navigator.standalone === true;

if (isStandalone) {
  gtag('event', 'pwa_standalone_launch', {
    event_category: 'pwa',
    event_label: 'standalone'
  });
}
