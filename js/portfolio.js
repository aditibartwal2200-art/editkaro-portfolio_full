(function () {
  var categories = [
    { key: 'all', label: 'All clips' },
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

  // Replace/extend this array with the client's real delivered videos.
  // Each item just needs a category that matches one of the keys above.
  var projects = [
    { cat: 'shortform', title: 'Reel — Streetwear Drop', ratio: '9:16', time: '00:00:28', video: 'videos/v1.mp4' },
    { cat: 'shortform', title: 'Shorts — App Launch Teaser', ratio: '9:16', time: '00:00:34', video: 'videos/v2.mp4' },
    { cat: 'longform', title: 'YouTube — Founder Interview', ratio: '16:9', time: '00:12:40', video: 'videos/v3.mp4' },
    { cat: 'longform', title: 'YouTube — Studio Tour Vlog', ratio: '16:9', time: '00:09:12', video: 'videos/v4.mp4' },
    { cat: 'ecommerce', title: 'Product Ad — Skincare Launch', ratio: '1:1', time: '00:00:18', video: 'videos/v5.mp4' },
    { cat: 'colorgrade', title: 'Grade Pass — Wedding Teaser', ratio: '16:9', time: '00:01:44', video: 'videos/v6.mp4' },
    { cat: 'gaming', title: 'Montage — Valorant Ace Reel', ratio: '16:9', time: '00:02:15', video: 'videos/v7.mp4' },
    { cat: 'documentary', title: 'Doc-Style — City Street Food', ratio: '16:9', time: '00:06:10', video: 'videos/v8.mp4' },
    { cat: 'football', title: 'Match Highlights — Derby Day', ratio: '16:9', time: '00:03:20', video: 'videos/v9.mp4' },
    { cat: 'anime', title: 'AMV — Beat-Synced Shot', ratio: '16:9', time: '00:02:03', video: 'videos/v10.mp4' },
    { cat: 'ads', title: 'Brand Film — 30s Broadcast Cut', ratio: '16:9', time: '00:00:30', video: 'videos/v11.mp4' },
    { cat: 'ecommerce', title: 'UGC Style — Kitchen Gadget', ratio: '9:16', time: '00:00:31', video: 'videos/v12.mp4' }
  ];

  var descriptions = {
    shortform: 'Hook-first cut for feed scroll, paced for retention on Reels and Shorts.',
    longform: 'YouTube-native pacing with a chaptered structure and a grade-matched look.',
    gaming: 'Killcam timing and HUD-aware cuts synced tight to in-game audio.',
    football: 'Match highlights cut to the run of play, timed to the moment it happened.',
    ecommerce: 'Product-first edit built to convert, sized for the exact placement it runs in.',
    documentary: 'Interview-led pacing with patient b-roll, matched grade throughout.',
    colorgrade: 'A full grading pass — consistent look from raw log footage to final master.',
    anime: 'Frame-accurate, beat-synced cutting in the AMV tradition.',
    ads: 'Campaign cutdown built for the media plan it is actually running on.'
  };

  function labelFor(key) {
    var found = categories.filter(function (c) { return c.key === key; })[0];
    return found ? found.label : key;
  }

  // read ?cat= from URL so links from other pages can deep-link a filter
  function catFromURL() {
    var params = new URLSearchParams(window.location.search);
    var cat = params.get('cat');
    return categories.some(function (c) { return c.key === cat; }) ? cat : 'all';
  }

  // ---------- build chips ----------
  var chips = document.getElementById('chips');
  var initial = catFromURL();
  categories.forEach(function (c) {
    var b = document.createElement('button');
    b.className = 'chip' + (c.key === initial ? ' active' : '');
    b.textContent = c.label;
    b.dataset.cat = c.key;
    b.addEventListener('click', function () { setFilter(c.key); });
    chips.appendChild(b);
  });

  // ---------- build grid ----------
  var grid = document.getElementById('grid');
  var gridEmpty = document.getElementById('gridEmpty');

  projects.forEach(function (p) {
    var card = document.createElement('article');
    card.className = 'card';
    card.dataset.cat = p.cat;
    card.tabIndex = 0;
    card.setAttribute('role', 'button');
    card.setAttribute('aria-label', 'Play ' + p.title);

    var g = palette[p.cat] || ['#333', '#111'];
    card.innerHTML =
      '<div class="thumb" style="--g1:' + g[0] + ';--g2:' + g[1] + '">' +
      (p.video ? '<video src="' + p.video + '" muted loop playsinline preload="metadata"></video>' : '') +
      '<span class="badge ratio">' + p.ratio + '</span>' +
      '<span class="badge time mono">' + p.time + '</span>' +
      '<div class="split m"></div><div class="split c"></div>' +
      '<div class="play" aria-hidden="true"></div>' +
      '</div>' +
      '<div class="card-meta">' +
      '<span class="tag">' + labelFor(p.cat) + '</span>' +
      '<h3>' + p.title + '</h3>' +
      '</div>';

    function openLb() { openLightbox(p, g); }
    card.addEventListener('click', openLb);
    card.addEventListener('keydown', function (e) { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); openLb(); } });

    var vid = card.querySelector('video');
    if (vid) {
      card.addEventListener('mouseenter', function () { vid.play().catch(function () {}); });
      card.addEventListener('mouseleave', function () { vid.pause(); vid.currentTime = 0; });
    }

    grid.appendChild(card);
  });

  // ---------- filter + playhead ----------
  var track = document.getElementById('track');
  var playhead = document.getElementById('playhead');
  var filterLabel = document.getElementById('filterLabel');
  var filterCount = document.getElementById('filterCount');

  function setFilter(key) {
    var count = 0;
    document.querySelectorAll('.card').forEach(function (card) {
      var show = key === 'all' || card.dataset.cat === key;
      card.classList.toggle('hide', !show);
      if (show) count++;
    });
    document.querySelectorAll('.chip').forEach(function (chip) {
      chip.classList.toggle('active', chip.dataset.cat === key);
    });
    filterLabel.textContent = labelFor(key).toUpperCase();
    filterCount.textContent = count + (count === 1 ? ' clip' : ' clips');
    gridEmpty.classList.toggle('show', count === 0);
    movePlayhead(key);

    var url = new URL(window.location);
    if (key === 'all') url.searchParams.delete('cat'); else url.searchParams.set('cat', key);
    window.history.replaceState({}, '', url);
  }

  function movePlayhead(key) {
    var chip = document.querySelector('.chip[data-cat="' + key + '"]');
    if (!chip) return;
    var left = chip.offsetLeft - chips.scrollLeft;
    playhead.style.left = Math.max(0, left) + 'px';
  }

  window.addEventListener('resize', function () {
    var active = document.querySelector('.chip.active');
    if (active) movePlayhead(active.dataset.cat);
  });

  setFilter(initial);

  // ---------- lightbox ----------
  var lightbox = document.getElementById('lightbox');
  var lbThumb = document.getElementById('lbThumb');
  var lbTag = document.getElementById('lbTag');
  var lbTitle = document.getElementById('lbTitle');
  var lbDesc = document.getElementById('lbDesc');
  var lastFocused = null;

  function openLightbox(p, g) {
    lastFocused = document.activeElement;
    if (p.video) {
      lbThumb.style.background = '#000';
      lbThumb.innerHTML =
        '<video src="' + p.video + '" controls autoplay style="position:absolute;inset:0;width:100%;height:100%;object-fit:contain;"></video>' +
        '<span class="badge ratio">' + p.ratio + '</span>' +
        '<span class="badge time mono">' + p.time + '</span>';
    } else {
      lbThumb.style.background = 'linear-gradient(135deg,' + g[0] + ',' + g[1] + ')';
      lbThumb.innerHTML =
        '<span class="badge ratio">' + p.ratio + '</span>' +
        '<span class="badge time mono">' + p.time + '</span>';
    }
    lbTag.textContent = labelFor(p.cat);
    lbTitle.textContent = p.title;
    lbDesc.textContent = descriptions[p.cat] || '';
    lightbox.classList.add('open');
    lightbox.setAttribute('aria-hidden', 'false');
    document.getElementById('lbClose').focus();
    document.body.style.overflow = 'hidden';
  }

  function closeLightbox() {
    var v = lbThumb.querySelector('video');
    if (v) v.pause();
    lightbox.classList.remove('open');
    lightbox.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (lastFocused) lastFocused.focus();
  }

  document.getElementById('lbClose').addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', function (e) { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && lightbox.classList.contains('open')) closeLightbox();
  });
})();
