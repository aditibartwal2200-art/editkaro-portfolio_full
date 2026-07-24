(function () {
  var categories = [
    { key: 'shortform', label: 'Short-Form' },
    { key: 'longform', label: 'Long-Form' },
    { key: 'gaming', label: 'Gaming' },
    { key: 'football', label: 'Football' },
    { key: 'ecommerce', label: 'eCommerce Ads' },
    { key: 'documentary', label: 'Documentary' },
    { key: 'colorgrade', label: 'Color Grade' },
    { key: 'anime', label: 'Anime' },
    { key: 'ads', label: 'Ads' }
  ];

  var palette = {
    shortform: ['#ff2e7a', '#7a1bd6'],
    longform: ['#22d3ff', '#155e9b'],
    gaming: ['#ff2e7a', '#22d3ff'],
    football: ['#0fae5c', '#0d0d10'],
    ecommerce: ['#ffb020', '#ff2e7a'],
    documentary: ['#4b5563', '#0d0d10'],
    colorgrade: ['#ff2e7a', '#22d3ff'],
    anime: ['#a855f7', '#22d3ff'],
    ads: ['#ff2e7a', '#ffb020']
  };

  var sampleVideo = {
    shortform: 'videos/v1.mp4', longform: 'videos/v3.mp4', gaming: 'videos/v7.mp4',
    football: 'videos/v9.mp4', ecommerce: 'videos/v5.mp4', documentary: 'videos/v8.mp4',
    colorgrade: 'videos/v6.mp4', anime: 'videos/v10.mp4', ads: 'videos/v11.mp4'
  };

  var stripTrack = document.getElementById('stripTrack');
  if (!stripTrack) return;

  categories.forEach(function (c) {
    var el = document.createElement('a');
    el.className = 'strip-clip';
    el.href = 'portfolio.html?cat=' + c.key;
    el.dataset.cat = c.key;
    el.setAttribute('data-label', c.label);
    var g = palette[c.key] || ['#333', '#111'];
    el.style.background = 'linear-gradient(135deg,' + g[0] + ',' + g[1] + ')';

    var src = sampleVideo[c.key];
    if (src) {
      var v = document.createElement('video');
      v.src = src;
      v.muted = true; v.loop = true; v.playsInline = true; v.preload = 'metadata';
      el.appendChild(v);
      el.addEventListener('mouseenter', function () { v.play().catch(function () {}); });
      el.addEventListener('mouseleave', function () { v.pause(); v.currentTime = 0; });
    }

    var tick = document.createElement('span');
    tick.className = 'tick';
    el.appendChild(tick);
    stripTrack.appendChild(el);
  });
})();
