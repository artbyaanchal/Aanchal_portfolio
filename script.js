// Scale the fixed 1440px design down to fit narrower windows.
const DESIGN_WIDTH = 1440;
const page = document.querySelector('.page');
const modal = document.getElementById('modal');
const card = modal.querySelector('.modal-card');
function fitPage() {
  const scale = Math.min(1, document.documentElement.clientWidth / DESIGN_WIDTH);
  page.style.zoom = scale;
  modal.style.zoom = scale;
  fitModal();
}

// Pop-ups never scroll: shrink the card until it fits inside the window.
const MODAL_GAP = 40;
function fitModal() {
  if (modal.hidden) return;
  const zoom = parseFloat(modal.style.zoom) || 1;
  card.style.transform = '';
  const availW = window.innerWidth / zoom - MODAL_GAP * 2;
  const availH = window.innerHeight / zoom - MODAL_GAP * 2;
  const s = Math.min(1, availW / card.offsetWidth, availH / card.offsetHeight);
  if (s < 1) card.style.transform = `scale(${s})`;
}
window.addEventListener('resize', fitPage);
fitPage();

const esc = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

/* ---------- Wall of wins ---------- */

// medal: trophy | first | second | third (the ink drawing inside the frame and on the card badge)
const AWARDS = [
  { title: "Dean's Merit Award 2025", tag: '1st rank · B.Sc Animation & Multimedia', medal: 'trophy',
    rank: "1st Rank · Dean's Merit", type: 'Academic',
    detail: 'B.Sc Animation & Multimedia · J.C. Bose University of Science & Technology, YMCA · CGPA 8.76',
    photo: 'assets/awards/award-01.jpg' },
  { title: 'National Mathematics Day Rangoli', tag: '1st · Team · National', medal: 'first',
    rank: '1st Rank', type: 'Team Work', heading: 'Rangoli Competition on National Mathematics Day',
    detail: 'National-level competition', photo: 'assets/awards/award-02.jpg' },
  { title: 'State Level Drawing, Mission Jagriti', tag: '1st Runner-up · Individual · 2023', medal: 'second',
    rank: '1st Runner-up', type: 'Individual', heading: 'State Level Drawing Competition',
    detail: 'Organised by Mission Jagriti · 2023' },
  { title: 'District Level Drawing, Mission Jagriti', tag: '2nd · Individual · Nov 2024', medal: 'second',
    rank: '2nd Rank', type: 'Individual', heading: 'District Level Drawing Competition',
    detail: 'Organised by Mission Jagriti · Nov 2024' },
  { title: 'G20 Anti-Corruption Poster', tag: '1st · Individual', medal: 'first',
    rank: '1st Rank', type: 'Individual', heading: 'Poster Making on G20 Anti-Corruption',
    detail: 'Poster making competition', photo: 'assets/awards/award-06.jpg' },
  { title: 'Kargil Vijay Diwas Poster', tag: '1st · Team', medal: 'first',
    rank: '1st Rank', type: 'Team Work', heading: 'Poster Making on Kargil Vijay Diwas',
    detail: 'Poster making competition' },
  { title: 'Diwali Rangoli, Vivekanand Club', tag: '1st · Team', medal: 'first',
    rank: '1st Rank', type: 'Team Work', heading: 'Diwali Rangoli Competition',
    detail: 'Organised by Vivekanand Club', photo: 'assets/awards/award-04.jpg' },
  { title: 'Diwali Rangoli, Department', tag: '1st · Team', medal: 'first',
    rank: '1st Rank', type: 'Team Work', heading: 'Diwali Rangoli Competition',
    detail: 'Organised by the department', photo: 'assets/awards/award-05.jpg' },
  { title: 'Jashan-e-Azadi Rangoli', tag: '1st · Team', medal: 'first',
    rank: '1st Rank', type: 'Team Work', heading: 'Rangoli Competition at Jashan-e-Azadi',
    detail: 'Rangoli competition', photo: 'assets/awards/award-07.jpg' },
  { title: 'Cartoonist Hunt, National Press Day', tag: '2nd', medal: 'second',
    rank: '2nd Rank', type: 'Cartooning', heading: 'Cartoonist Hunt on National Press Day',
    detail: 'Cartooning competition' },
  { title: 'Geeta Mahotsav Drawing', tag: '2nd · Individual', medal: 'second',
    rank: '2nd Rank', type: 'Individual', heading: 'Drawing Competition at Geeta Mahotsav',
    detail: 'Individual drawing competition' },
  { title: 'NSS Handmade Poster', tag: '3rd · Team', medal: 'third',
    rank: '3rd Rank', type: 'Team Work', heading: 'Handmade Poster Making',
    detail: 'Organised by the NSS Cell', photo: 'assets/awards/award-12.jpg' },
  { title: 'International Yoga Day Poster', tag: '3rd · Individual', medal: 'third',
    rank: '3rd Rank', type: 'Individual', heading: 'Poster Making on International Yoga Day',
    detail: 'Poster making competition', photo: 'assets/awards/award-13.jpg' },
];

const PER_PAGE = 4;
const PAGES = Math.ceil(AWARDS.length / PER_PAGE);
// Each position on the wall hangs at its own slight angle, as in the design.
const HANG = [{ rot: '1.5deg', y: '14px' }, { rot: '-1.2deg', y: '2px' }, { rot: '1deg', y: '14px' }, { rot: '-1.5deg', y: '1px' }];

const slots = document.querySelector('.slots');
const dots = document.querySelector('.carousel-dots');
let current = 0;

function renderPage() {
  const items = AWARDS.slice(current * PER_PAGE, current * PER_PAGE + PER_PAGE);
  slots.innerHTML = items.map((a, i) => `
    <button class="slot" style="--rot:${HANG[i].rot};--y:${HANG[i].y}" data-award="${current * PER_PAGE + i}" aria-haspopup="dialog">
      <span class="award">
        <span class="award-art">
          <span class="award-mat"></span>
          <span class="ink ink--frame award-frame"></span>
          <span class="ink ink--${a.medal} award-medal"></span>
        </span>
        <span class="award-tag"><b>${esc(a.title)}</b><span>${esc(a.tag)}</span></span>
      </span>
    </button>`).join('');
  dots.innerHTML = Array.from({ length: PAGES }, (_, i) =>
    `<button class="carousel-dot" role="tab" aria-selected="${i === current}" aria-label="Page ${i + 1} of ${PAGES}" data-page="${i}"></button>`).join('');
}

function goTo(next) {
  next = (next + PAGES) % PAGES;
  if (next === current) return;
  slots.classList.add('is-sliding');
  setTimeout(() => { current = next; renderPage(); slots.classList.remove('is-sliding'); }, 200);
}

document.querySelectorAll('.carousel-btn').forEach((btn) =>
  btn.addEventListener('click', () => goTo(current + Number(btn.dataset.dir))));
dots.addEventListener('click', (e) => {
  const dot = e.target.closest('[data-page]');
  if (dot) goTo(Number(dot.dataset.page));
});
slots.addEventListener('click', (e) => {
  const slot = e.target.closest('[data-award]');
  if (slot) openAward(AWARDS[Number(slot.dataset.award)], slot);
});
renderPage();

/* ---------- Pop-ups ---------- */

let lastFocus = null;

function openModal(html, className, opener) {
  lastFocus = opener || document.activeElement;
  card.className = 'modal-card ' + className;
  card.innerHTML = html;
  modal.hidden = false;
  document.body.classList.add('modal-open');
  fitModal();
  // Re-fit once photos have loaded, since they can change the card's height.
  card.querySelectorAll('img').forEach((img) => { if (!img.complete) img.addEventListener('load', fitModal, { once: true }); });
  card.focus({ preventScroll: true });
}

function closeModal() {
  if (modal.hidden) return;
  modal.hidden = true;
  document.body.classList.remove('modal-open');
  card.innerHTML = '';
  card.style.transform = '';
  // Return focus without drawing a focus ring after a mouse click.
  if (lastFocus) lastFocus.focus({ preventScroll: true, focusVisible: false });
}

modal.addEventListener('click', (e) => { if (e.target.closest('[data-close]')) closeModal(); });
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

function openAward(a, opener) {
  openModal(`
    <button class="modal-close" data-close aria-label="Close"><img src="assets/close-white.svg" alt="" width="44" height="44" /></button>
    <div class="award-badge"><span class="ink ink--${a.medal}"></span></div>
    <div class="award-pills"><span class="pill pill--dark">${esc(a.rank)}</span><span class="pill">${esc(a.type)}</span></div>
    <h2 id="modal-title">${esc(a.heading || a.title)}</h2>
    <p class="award-sub">${esc(a.detail)}</p>
    ${a.photo ? `<div class="award-divider"></div><div class="award-photo"><img src="${a.photo}" alt="${esc(a.title)}" /></div>` : ''}
  `, 'award-card', opener);
}

/* ---------- Things I love ---------- */

const moonPhotos = Array.from({ length: 14 }, (_, i) => ({ src: `assets/moon/moon-${i + 1}.jpg`, w: 153, h: 217, alt: 'Moon photo' }));

const HOBBIES = {
  art: {
    title: 'Making art',
    sub: 'Rangoli, posters and paintings · my favourite way to switch off',
    icon: '<span class="ink ink--art-icon"></span>',
    photos: [
      ['kathakali-dancer', 'Kathakali Dancer', 111, 168], ['still-life-blue-vase', 'Still Life: Blue Vase and Pomegranates', 242, 168],
      ['teddy-and-doll', 'Teddy and Doll', 116, 168], ['pine-lake-at-dusk', 'Pine Lake at Dusk', 139, 168],
      ['autumn-tree-landscape', 'Autumn Tree Landscape', 224, 168], ['man-with-yellow-turban', 'Man with Yellow Turban', 125, 168],
      ['village-scene-1', 'Village Scene', 116, 168], ['pug', 'Pug', 281, 204], ['still-life-with-bowls', 'Still Life with Bowls', 271, 204],
      ['warli-village-life', 'Warli Village Life', 279, 204], ['warli-harvest-and-birds', 'Warli Harvest and Birds', 285, 204],
      ['fight-against-corruption', 'Fight Against Corruption', 238, 165], ['equality', 'Equality, Reducing Inequalities', 228, 165],
      ['mother-child-village', 'Mother, Child and the Village', 114, 165],
    ].map(([f, alt, w, h]) => ({ src: `assets/art/${f}.jpg`, alt, w, h })),
  },
  moon: {
    title: 'Capturing the moon',
    sub: 'A little hobby of mine that turned into a habit. My phone gallery has a special place for the moon.',
    icon: '<img src="assets/icon-moon.svg" alt="" width="56" height="56" />',
    photos: moonPhotos,
  },
  cooking: {
    title: 'Cooking',
    sub: 'Trying new recipes and spending time with family and feed them',
    icon: '<img src="assets/icon-cooking.svg" alt="" width="60" height="60" />',
    photos: [
      ['cooking-1', 171, '50% 65%'], ['cooking-2', 177, '50% 63%'], ['cooking-3', 164, '50% 81%'], ['cooking-4', 139, '50% 49%'],
    ].map(([f, w, pos]) => ({ src: `assets/cooking/${f}.jpg`, alt: 'Home cooking', w, h: 210, pos })),
  },
  teach: {
    title: 'Teach art',
    sub: 'Teaching drawing to kids and watching them find their own style',
    icon: '<img src="assets/icon-teach.svg" alt="" width="60" height="60" />',
    photos: [
      ['teach-1', 173, 254, '50% 58%'], ['teach-2', 420, 254, '100% 50%'], ['teach-3', 380, 254, '50% 63%'],
      ['teach-4', 368, 210, '50% 0%'], ['teach-5', 374, 210, '50% 50%'],
    ].map(([f, w, h, pos]) => ({ src: `assets/teach/${f}.jpg`, alt: 'Online drawing class with kids', w, h, pos })),
  },
};

function openHobby(key, opener) {
  const h = HOBBIES[key];
  const grid = h.photos.length
    ? `<div class="gallery-grid">${h.photos.map((p) =>
        `<div class="gallery-photo" style="width:${p.w}px;height:${p.h}px"><img src="${p.src}" alt="${esc(p.alt)}"${p.pos ? ` style="object-position:${p.pos}"` : ''} /></div>`).join('')}</div>`
    : '<p class="gallery-empty">Photos coming soon.</p>';
  openModal(`
    <button class="modal-close" data-close aria-label="Close"><img src="assets/close-orange.svg" alt="" width="44" height="44" /></button>
    <div class="gallery-head">
      <div class="gallery-icon">${h.icon}</div>
      <div><h2 id="modal-title">${esc(h.title)}</h2><p>${esc(h.sub)}</p></div>
    </div>
    ${grid}
  `, 'gallery-card', opener);
}

document.querySelectorAll('[data-hobby]').forEach((btn) =>
  btn.addEventListener('click', () => openHobby(btn.dataset.hobby, btn)));
