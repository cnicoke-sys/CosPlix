/* ============================================================
   CosPlix – Shared Script
   Contains: particles config, mobile menu, lucide init,
             and all page-specific logic
   ============================================================ */

/* ----- Tailwind Config (called inline via <script> on each page) ----- */
// NOTE: tailwind.config must remain in a <script> tag in each HTML
// file's <head> so Tailwind CDN can read it before rendering.

/* ============================================================
   SHARED UTILITIES
   ============================================================ */

/** Toggle the mobile sidebar open/closed */
function toggleMobile() {
  document.getElementById('mobile-menu').classList.toggle('open');
}

/** Standard particles background used on most pages */
function initParticles(opts) {
  const defaults = {
    number:  { value: 130, density: { enable: true, value_area: 800 } },
    color:   { value: ['#ff006e', '#8338ec', '#3a86ff'] },
    shape:   { type: 'circle' },
    opacity: { value: 0.5, random: true },
    size:    { value: 2.5, random: true },
    line_linked: { enable: true, distance: 130, color: '#8338ec', opacity: 0.15 },
    move:    { enable: true, speed: 1.5, out_mode: 'out' }
  };
  particlesJS('particles-js', { particles: Object.assign(defaults, opts || {}) });
}

/* ============================================================
   PAGE: index.html
   ============================================================ */
function initIndexPage() {
  /* Particles – home uses richer colour array + interactivity */
  particlesJS('particles-js', {
    particles: {
      number:  { value: 130, density: { enable: true, value_area: 800 } },
      color:   { value: ['#ff006e', '#8338ec', '#3a86ff', '#ffffff'] },
      shape:   { type: 'circle' },
      opacity: { value: 0.9, random: false, anim: { enable: true, speed: 1, opacity_min: 0.5, sync: false } },
      size:    { value: 4, random: true, anim: { enable: true, speed: 2, size_min: 1, sync: false } },
      line_linked: { enable: true, distance: 140, color: '#8338ec', opacity: 0.4, width: 1.5 },
      move:    { enable: true, speed: 3, out_mode: 'out' }
    },
    interactivity: {
      events: { onhover: { enable: true, mode: 'grab' }, onclick: { enable: true, mode: 'push' } },
      modes:  { grab: { distance: 200, line_linked: { opacity: 1 } } }
    },
    retina_detect: true
  });

  if (typeof lucide !== 'undefined') lucide.createIcons();

  /* AniList GraphQL – latest 3 trending anime for homepage news grid */
  const query = `query { Page(perPage: 3) { media(sort: TRENDING_DESC, type: ANIME) {
    title { english native } description averageScore coverImage { large } siteUrl } } }`;

  $.ajax({
    url: 'https://graphql.anilist.co',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    data: JSON.stringify({ query }),
    success: function (res) {
      const data = res.data.Page.media;
      const colors = ['#ff006e', '#8338ec', '#3a86ff'];
      let html = '';
      data.forEach((anime, i) => {
        const desc = anime.description
          ? anime.description.replace(/<[^>]*>?/gm, '').substring(0, 100)
          : 'No description.';
        html += `
          <div class="card-hover rounded-2xl overflow-hidden flex flex-col"
               style="background:rgba(26,26,62,0.6); border:1px solid ${colors[i % 3]}44;"
               onclick="location.href='news.html'">
            <img src="${anime.coverImage.large}" class="h-48 w-full object-cover">
            <div class="p-6">
              <h3 class="font-semibold text-white mb-2 line-clamp-1">${anime.title.english || anime.title.native}</h3>
              <p class="text-sm text-gray-400 line-clamp-3 mb-4">${desc}...</p>
              <span class="text-xs font-bold uppercase tracking-wider transition-colors"
                    style="color:${colors[i % 3]};">Read More —</span>
            </div>
          </div>`;
      });
      $('#home-news-grid').html(html);
    }
  });
}

/* ============================================================
   PAGE: about.html  (particles only – no extra logic)
   ============================================================ */
function initAboutPage() {
  if (typeof lucide !== 'undefined') lucide.createIcons();
  initParticles();
}

/* ============================================================
   PAGE: community.html
   ============================================================ */
const communityPosts = [
  { avatar: '🦊', user: 'CosplayQueen',   time: '30 min ago',  text: 'Just finished my Genshin Impact Furina cosplay! Took 3 months but so worth it 💙', likes: 47,  replies: 12, color: '#ff006e' },
  { avatar: '🐉', user: 'AnimeWatcher99', time: '2 hours ago', text: 'Who else is hyped for the new Jujutsu Kaisen movie? The trailer looks INSANE! 🔥',  likes: 89,  replies: 34, color: '#8338ec' },
  { avatar: '🌸', user: 'SakuraCrafter',  time: '5 hours ago', text: 'Any tips for working with Worbla for the first time? Making a full set of armor and feeling overwhelmed 😅', likes: 23, replies: 18, color: '#3a86ff' }
];

function renderCommunity() {
  const container = document.getElementById('community-posts');
  if (!container) return;
  container.innerHTML = communityPosts.map((p, i) => `
    <div class="rounded-2xl p-5 anim-slide-up"
         style="background:linear-gradient(135deg,#1a1a3e,#151530); border:1px solid rgba(255,255,255,0.06); animation-delay:${i * 0.1}s;">
      <div class="flex items-center gap-3 mb-3">
        <div class="w-10 h-10 rounded-full flex items-center justify-center text-lg" style="background:${p.color}33;">${p.avatar}</div>
        <div>
          <div class="font-semibold text-sm" style="color:${p.color};">${p.user}</div>
          <div class="text-xs" style="color:#606080;">${p.time}</div>
        </div>
      </div>
      <p class="text-sm mb-3" style="color:#c0c0d0;">${p.text}</p>
      <div class="flex gap-4 text-xs" style="color:#8080a0;">
        <span class="cursor-pointer hover:text-red-400"
              onclick="this.style.color='#ff006e';this.innerHTML='❤️ '+(${p.likes}+1)">♡ ${p.likes}</span>
        <span>💬 ${p.replies} replies</span>
      </div>
    </div>`).join('');
}

function postCommunity() {
  const input = document.getElementById('community-input');
  if (!input.value.trim()) return;
  communityPosts.unshift({ avatar: '😊', user: 'You', time: 'Just now', text: input.value.trim(), likes: 0, replies: 0, color: '#06d6a0' });
  input.value = '';
  renderCommunity();
}

function initCommunityPage() {
  if (typeof lucide !== 'undefined') lucide.createIcons();
  renderCommunity();
  initParticles();
}

/* ============================================================
   PAGE: contact.html
   ============================================================ */
function showSupport(type) {
  ['phone', 'email', 'chat'].forEach(t => document.getElementById('support-' + t).classList.add('hidden'));
  const el = document.getElementById('support-' + type);
  el.classList.remove('hidden');
  el.classList.add('anim-fade');
}

function submitEmail(e) {
  e.preventDefault();
  const status = document.getElementById('email-status');
  status.textContent = '✓ Message sent successfully!';
  e.target.reset();
  setTimeout(() => { status.textContent = ''; }, 4000);
}

const chatResponses = [
  "That's a great question! Let me look into that for you. 🔍",
  "I'd love to help with that! Here's what I suggest... ✨",
  "Thanks for reaching out! Our team specializes in exactly this. 💪",
  "Great to hear from you! Let me connect you with the right info. 🎯",
  "Awesome question! Many of our community members ask about this too. 🌟"
];

function sendChat() {
  const input = document.getElementById('chat-input');
  const msg = input.value.trim();
  if (!msg) return;
  const container = document.getElementById('chat-messages');
  container.innerHTML += `<div class="chat-bubble-right px-4 py-3 text-sm ml-auto"
    style="background:rgba(58,134,255,0.25); max-width:80%;">${msg}</div>`;
  input.value = '';
  container.scrollTop = container.scrollHeight;
  setTimeout(() => {
    const resp = chatResponses[Math.floor(Math.random() * chatResponses.length)];
    container.innerHTML += `<div class="chat-bubble px-4 py-3 text-sm anim-fade"
      style="background:rgba(58,134,255,0.15); max-width:80%;">${resp}</div>`;
    container.scrollTop = container.scrollHeight;
  }, 1000);
}

function initContactPage() {
  if (typeof lucide !== 'undefined') lucide.createIcons();
  window.showSupport  = showSupport;
  window.submitEmail  = submitEmail;
  window.sendChat     = sendChat;
  initParticles();
}

/* ============================================================
   PAGE: events.html
   ============================================================ */
const featuredData = [
  { id: 1, img: 'images/expo.jpg',           emoji: '🎪', title: 'Anime Expo 2026',           date: 'Jul 2-5, 2026',   location: 'Los Angeles, CA',  color: '#ff006e', type: 'Convention',  desc: 'The largest anime convention in North America with 300+ exhibitors.' },
  { id: 2, img: 'images/worldcossummit.jpg',  emoji: '🏆', title: 'World Cosplay Summit',      date: 'Aug 2-4, 2026',   location: 'Nagoya, Japan',    color: '#8338ec', type: 'Competition', desc: '40 countries compete in the ultimate cosplay championship.' },
  { id: 3, img: 'images/comiket.jpg',         emoji: '🎌', title: 'Comiket C104',              date: 'Aug 16-18, 2026', location: 'Tokyo, Japan',     color: '#3a86ff', type: 'Convention',  desc: "The world's largest doujinshi fair with 500,000+ attendees." },
  { id: 4, img: 'images/comiccon.jpg',        emoji: '🎭', title: 'Comic-Con International',   date: 'Jul 24-27, 2026', location: 'San Diego, CA',    color: '#fb5607', type: 'Convention',  desc: "Pop culture's biggest event with exclusive panels and cosplay contests." },
  { id: 5, img: 'images/cosplayconworkshop.jpg', emoji: '✂️', title: 'CosplayCon Workshop',   date: 'Sep 12-14, 2026', location: 'London, UK',       color: '#ffbe0b', type: 'Workshop',    desc: 'Hands-on cosplay crafting with industry professionals.' }
];

function createEventCard(e, index) {
  const saved = localStorage.getItem(`event-interest-${e.id}`) === 'true';
  return `
    <div class="event-card rounded-2xl overflow-hidden anim-slide-up flex flex-col md:flex-row" style="animation-delay:${index * 0.15}s;">
      <div class="h-48 md:h-auto md:w-64 flex-shrink-0 overflow-hidden relative bg-gray-900">
        <img src="${e.img}" class="w-full h-full object-cover transition duration-700 hover:scale-110"
             onerror="this.src='https://via.placeholder.com/400x300/1a1a3e/ffffff?text=Event+Update'">
        <div class="absolute top-4 left-4 px-3 py-1 rounded-full text-xs font-bold"
             style="background:${e.color}; color:white;">${e.type}</div>
      </div>
      <div class="p-6 flex flex-col justify-between flex-1">
        <div>
          <div class="flex items-center gap-2 mb-2">
            <span class="text-2xl">${e.emoji}</span>
            <span class="text-sm font-medium" style="color:#8080a0;">${e.location}</span>
          </div>
          <h3 class="font-display text-xl mb-2 text-white">${e.title}</h3>
          <p class="text-gray-400 text-sm leading-relaxed line-clamp-2">${e.desc}</p>
        </div>
        <div class="flex items-center justify-between mt-4">
          <div class="font-display text-md" style="color:${e.color};">${e.date}</div>
          <button class="px-6 py-2 rounded-xl text-xs font-bold text-white transition-all active:scale-95"
                  style="background:${saved ? '#06d6a0' : e.color};"
                  onclick="markInterested(this, '${e.id}', '${e.color}')">
            ${saved ? '✅ Interested' : 'Interested ✨'}
          </button>
        </div>
      </div>
    </div>`;
}

function markInterested(btn, id, color) {
  const key = `event-interest-${id}`;
  if (localStorage.getItem(key) === 'true') {
    localStorage.removeItem(key);
    btn.innerHTML = 'Interested ✨';
    btn.style.background = color;
  } else {
    localStorage.setItem(key, 'true');
    btn.innerHTML = '✅ Interested';
    btn.style.background = '#06d6a0';
  }
}

function fetchLiveEvents() {
  const endpoint = 'https://www.reddit.com/r/cosplay/search.json?q=flair%3AEvent+OR+Convention&restrict_sr=on&sort=new&limit=5&jsonp=?';
  $.getJSON(endpoint, function (response) {
    $('#api-loading').hide();
    const posts = response.data.children;
    let htmlContent = '';
    posts.forEach((post, i) => {
      const d = post.data;
      const cleanTitle = d.title.replace(/\[.*?\]/g, '').trim();
      const eventObj = {
        id: d.id,
        img: (d.thumbnail && d.thumbnail.startsWith('http')) ? d.thumbnail : 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=400&q=80',
        emoji: '📡', title: cleanTitle, date: 'LIVE Update',
        location: 'r/cosplay Community', color: '#3a86ff', type: 'Community',
        desc: d.selftext ? d.selftext.substring(0, 150) + '...' : 'Live discussion and announcement from the community.'
      };
      htmlContent += createEventCard(eventObj, i);
    });
    $('#live-events-list').html(htmlContent);
  }).fail(() => {
    $('#api-loading').html('<p class="text-red-400">Unable to load live feed.</p>');
  });
}

function initEventsPage() {
  if (typeof lucide !== 'undefined') lucide.createIcons();
  $('#featured-list').html(featuredData.map((e, i) => createEventCard(e, i)).join(''));
  fetchLiveEvents();
  particlesJS('particles-js', {
    particles: {
      number:  { value: 110, density: { enable: true, value_area: 800 } },
      color:   { value: ['#ff006e', '#8338ec', '#3a86ff'] },
      shape:   { type: 'circle' },
      opacity: { value: 0.5 },
      size:    { value: 2.5, random: true },
      line_linked: { enable: true, distance: 130, color: '#8338ec', opacity: 0.15 },
      move:    { enable: true, speed: 1.5 }
    }
  });
}

/* ============================================================
   PAGE: gallery.html
   ============================================================ */
function searchCosplay() {
  fetchCosplay($('#search-input').val().trim());
}

function fetchCosplay(query) {
  $('.genre-btn').removeClass('active-filter');
  if (query) { $(`.genre-btn[data-query="${query}"]`).addClass('active-filter'); }
  else        { $(`.genre-btn[data-query=""]`).addClass('active-filter'); }

  $('#api-gallery-grid').empty();
  $('#api-error').addClass('hidden');
  $('#api-loading').removeClass('hidden');

  let endpoint = 'https://www.reddit.com/r/cosplay/hot.json?jsonp=?&limit=40';
  if (query) { endpoint = `https://www.reddit.com/r/cosplay/search.json?q=${encodeURIComponent(query)}&restrict_sr=on&sort=relevance&limit=40&jsonp=?`; }

  $.getJSON(endpoint, function (response) {
    $('#api-loading').addClass('hidden');
    const posts = response.data.children;
    let htmlContent = '';
    let imageCount = 0;
    const themeColors = ['#ff006e', '#8338ec', '#3a86ff', '#fb5607', '#06d6a0'];

    posts.forEach(function (post) {
      const data = post.data;
      if (data.url && data.url.match(/\.(jpeg|jpg|png|webp)$/i) && !data.stickied && imageCount < 16) {
        const color = themeColors[imageCount % themeColors.length];
        htmlContent += `
          <a href="https://reddit.com${data.permalink}" target="_blank" class="block">
            <div class="gallery-item break-inside-avoid relative group anim-slide-up mb-4"
                 style="border:1px solid ${color}44; animation-delay:${imageCount * 0.05}s;">
              <img src="${data.url}" class="w-full h-auto object-cover transition duration-500 group-hover:scale-110">
              <div class="overlay absolute inset-0 flex flex-col items-center justify-center p-4 text-center"
                   style="background:rgba(10,10,26,0.85);">
                <div class="font-display text-lg mb-1 text-white line-clamp-2">${data.title}</div>
                <div class="text-sm mb-3" style="color:${color};">u/${data.author}</div>
                <div class="flex items-center gap-1 text-sm" style="color:#ff006e;">❤️ ${data.ups}</div>
              </div>
            </div>
          </a>`;
        imageCount++;
      }
    });
    $('#api-gallery-grid').html(htmlContent || '<p class="col-span-full text-center">No results found.</p>');
  }).fail(() => {
    $('#api-loading').addClass('hidden');
    $('#api-error').removeClass('hidden');
  });
}

function initGalleryPage() {
  if (typeof lucide !== 'undefined') lucide.createIcons();
  $('#search-input').on('keydown', function (e) { if (e.key === 'Enter') searchCosplay(); });
  fetchCosplay('');
  particlesJS('particles-js', {
    particles: {
      number:  { value: 110, density: { enable: true, value_area: 800 } },
      color:   { value: ['#ff006e', '#8338ec', '#3a86ff'] },
      shape:   { type: 'circle' },
      opacity: { value: 0.6, random: true },
      size:    { value: 3, random: true },
      line_linked: { enable: true, distance: 150, color: '#8338ec', opacity: 0.2, width: 1 },
      move:    { enable: true, speed: 2.2, out_mode: 'out' }
    }
  });
}

/* ============================================================
   PAGE: news.html
   ============================================================ */
function switchFeed(id) {
  $('.social-feed').removeClass('active');
  $('.feed-btn').removeClass('active-tab');
  $(`#feed-${id}`).addClass('active');
  $(`#btn-${id}`).addClass('active-tab');
}

function initNewsPage() {
  if (typeof lucide !== 'undefined') lucide.createIcons();

  const query = `query { Page(perPage: 6) { media(sort: TRENDING_DESC, type: ANIME) {
    title { english native } description averageScore coverImage { large } siteUrl } } }`;

  $.ajax({
    url: 'https://graphql.anilist.co',
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    data: JSON.stringify({ query }),
    success: function (res) {
      const data = res.data.Page.media;
      let html = '';
      data.forEach((anime, i) => {
        const desc = anime.description
          ? anime.description.replace(/<[^>]*>?/gm, '').substring(0, 80)
          : 'Latest news available on site.';
        html += `
          <a href="${anime.siteUrl}" target="_blank"
             class="glass-card rounded-[2.5rem] p-6 flex flex-col group anim-slide-up"
             style="animation-delay:${i * 0.1}s">
            <div class="h-56 rounded-[1.8rem] overflow-hidden mb-6 relative">
              <img src="${anime.coverImage.large}"
                   class="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700">
              <div class="absolute top-4 right-4 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full
                          text-[10px] font-black text-[#06d6a0] border border-[#06d6a0]/30">
                ⭐ ${anime.averageScore}%
              </div>
            </div>
            <h3 class="font-display text-white text-lg mb-2 line-clamp-1">${anime.title.english || anime.title.native}</h3>
            <p class="text-xs text-gray-400 leading-relaxed line-clamp-2 mb-4">${desc}...</p>
            <div class="mt-auto text-[10px] font-black uppercase tracking-widest text-[#8338ec]">Read Feed —</div>
          </a>`;
      });
      $('#api-news-grid').html(html);
    }
  });

  particlesJS('particles-js', {
    particles: {
      number:  { value: 110, density: { enable: true, value_area: 800 } },
      color:   { value: ['#ff006e', '#8338ec', '#3a86ff'] },
      shape:   { type: 'circle' },
      opacity: { value: 0.6, random: true, anim: { enable: true, speed: 1, opacity_min: 0.1, sync: false } },
      size:    { value: 3, random: true, anim: { enable: true, speed: 4, size_min: 0.3, sync: false } },
      line_linked: { enable: true, distance: 150, color: '#8338ec', opacity: 0.2, width: 1 },
      move:    { enable: true, speed: 2.5, direction: 'none', random: true, straight: false, out_mode: 'out', bounce: false }
    },
    interactivity: {
      detect_on: 'canvas',
      events: { onhover: { enable: true, mode: 'bubble' }, onclick: { enable: true, mode: 'push' }, resize: true },
      modes:  { bubble: { distance: 200, size: 6, duration: 2, opacity: 0.8, speed: 3 }, push: { particles_nb: 4 } }
    },
    retina_detect: true
  });
}

/* ============================================================
   PAGE: tutorials.html
   ============================================================ */
const tutorialsData = [
  { emoji: '🧵', title: "Beginner's Guide to EVA Foam",   difficulty: 'Beginner',     color: '#ff006e', duration: '45 min',  desc: 'Learn the basics of cutting, shaping, and painting EVA foam.',             link: 'https://www.instructables.com/Introduction-to-EVA-Foam/' },
  { emoji: '💇', title: 'Advanced Wig Styling',           difficulty: 'Intermediate', color: '#8338ec', duration: '30 min',  desc: 'Master spiking and gravity-defying hair techniques.',                       link: 'https://www.epiccosplay.com/pages/wigs' },
  { emoji: '🎨', title: 'Digital Anime Illustration',     difficulty: 'Beginner',     color: '#3a86ff', duration: '60 min',  desc: 'Introduction to digital drawing and shading tools.',                       link: 'https://www.youtube.com/playlist?list=PLWp4kPwtWDF24zrEYpiuNoX__nx0Vscl8' },
  { emoji: '⚔️', title: 'Realistic Prop Weaponry',        difficulty: 'Advanced',     color: '#fb5607', duration: '90 min',  desc: 'Build props using Worbla and resin casting.',                              link: 'https://www.worbla.com/?https://punishedprops.com/wp-content/uploads/2012/09/2012-04-04_PropMakingGuide_V1.pdf=14' },
  { emoji: '📸', title: 'Photography & Post-Processing',  difficulty: 'Beginner',     color: '#ffbe0b', duration: '20 min',  desc: 'Capture the perfect shot with lighting and editing.',                      link: 'https://www.lyricalvillaincosplay.com/post/cosplay-photography-101' },
  { emoji: '🪡', title: 'Pattern Drafting & Sewing',      difficulty: 'Advanced',     color: '#06d6a0', duration: '120 min', desc: 'Draft your own patterns for accurate costumes.',                           link: 'https://sewexpo.com/2018/01/17/sewing-techniques-applied-to-costuming-with-anna-he/' }
];

function filterTutorials() {
  const selected = document.getElementById('difficulty-filter').value;
  const filtered = selected === 'All' ? tutorialsData : tutorialsData.filter(t => t.difficulty === selected);
  const container = $('#tutorials-list');
  container.empty();
  document.getElementById('lesson-count').innerText = filtered.length;

  filtered.forEach((t, i) => {
    container.append(`
      <div class="tutorial-card rounded-3xl p-8 anim-slide-up flex gap-6" style="animation-delay:${i * 0.05}s;">
        <div class="hidden sm:flex flex-shrink-0 w-16 h-16 rounded-2xl items-center justify-center text-4xl"
             style="background:${t.color}15; border:1px solid ${t.color}33;">${t.emoji}</div>
        <div class="flex-1">
          <div class="flex flex-wrap gap-2 mb-3">
            <span class="px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest"
                  style="background:${t.color}; color:white;">${t.difficulty}</span>
            <span class="px-3 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest bg-white/5 text-gray-400">⏱️ ${t.duration}</span>
          </div>
          <h3 class="font-display text-xl mb-2 text-white">${t.title}</h3>
          <p class="text-sm text-gray-400 leading-relaxed mb-6">${t.desc}</p>
          <button onclick="window.open('${t.link}', '_blank')"
                  class="flex items-center gap-2 text-xs font-bold uppercase tracking-wider hover:gap-4 transition-all"
                  style="color:${t.color};">
            Start Module <i data-lucide="arrow-right" class="w-4 h-4"></i>
          </button>
        </div>
      </div>`);
  });

  if (typeof lucide !== 'undefined') lucide.createIcons();
}

function initTutorialsPage() {
  if (typeof lucide !== 'undefined') lucide.createIcons();
  filterTutorials();
  particlesJS('particles-js', {
    particles: {
      number:  { value: 120, density: { enable: true, value_area: 800 } },
      color:   { value: ['#ff006e', '#8338ec', '#3a86ff'] },
      shape:   { type: 'circle' },
      opacity: { value: 0.5, random: true },
      size:    { value: 2, random: true },
      line_linked: { enable: true, distance: 150, color: '#8338ec', opacity: 0.2 },
      move:    { enable: true, speed: 1.5, out_mode: 'out' }
    }
  });
}
