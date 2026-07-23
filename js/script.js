// Find our date picker inputs on the page
const startInput = document.getElementById('startDate');
const endInput = document.getElementById('endDate');

// Call the setupDateInputs function from dateRange.js
// This sets up the date pickers to:
// - Default to a range of 9 days (from 9 days ago to today)
// - Restrict dates to NASA's image archive (starting from 1995)
setupDateInputs(startInput, endInput);

// ------- Custom app logic below -------

// Your NASA API key (get a free one at https://api.nasa.gov/)
const API_KEY = 'aifdNSi0gRW3Wp8E8ImrsVf682wchZJQQF64DQWj';
const APOD_URL = 'https://api.nasa.gov/planetary/apod';

// Elements from index.html
const getBtn = document.getElementById('getBtn');
const gallery = document.getElementById('gallery');
const loadingMsg = document.getElementById('loading-msg');
const factBox = document.getElementById('fact-box');
const modal = document.getElementById('modal');
const modalBody = document.getElementById('modal-body');
const modalClose = document.getElementById('modal-close');

// ---------- LevelUp: Random "Did You Know?" space fact ----------
const spaceFacts = [
  "Did you know? A day on Venus is longer than its year.",
  "Did you know? Neutron stars can spin at a rate of 600 rotations per second.",
  "Did you know? The footprints left on the Moon will likely stay there for millions of years.",
  "Did you know? One million Earths could fit inside the Sun.",
  "Did you know? The Milky Way and Andromeda galaxies are on a collision course.",
  "Did you know? Space is completely silent because sound needs a medium to travel through.",
  "Did you know? The largest known star, UY Scuti, is over 1,700 times the size of our Sun.",
  "Did you know? There are more stars in the universe than grains of sand on every beach on Earth.",
  "Did you know? Saturn could float in water because it is mostly made of gas.",
  "Did you know? A year on Mercury is just 88 Earth days long."
];

function showRandomFact() {
  const fact = spaceFacts[Math.floor(Math.random() * spaceFacts.length)];
  factBox.textContent = fact;
}

// ---------- Fetching data from NASA's APOD API ----------
async function fetchApodRange(startDateStr, endDateStr) {
  const url = APOD_URL + '?api_key=' + API_KEY + '&start_date=' + startDateStr + '&end_date=' + endDateStr;
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error('NASA API responded with status ' + response.status);
  }

  const data = await response.json();

  // When start and end date are the same, the API returns a single object
  // instead of an array, so we normalize it here.
  const items = Array.isArray(data) ? data : [data];

  // Show newest first
  items.sort((a, b) => new Date(b.date) - new Date(a.date));

  return items;
}

// ---------- LevelUp: Detect & handle video entries ----------
function isEmbeddableVideo(url) {
  return /youtube\.com|youtu\.be|vimeo\.com/i.test(url);
}

function buildVideoElement(item, isModal) {
  if (isEmbeddableVideo(item.url)) {
    const iframe = document.createElement('iframe');
    iframe.src = item.url;
    iframe.title = item.title;
    iframe.frameBorder = '0';
    iframe.allowFullscreen = true;
    iframe.className = isModal ? 'modal-video' : 'video-thumb';
    return iframe;
  }

  // Fallback: show a clickable link for videos we can't embed
  const link = document.createElement('a');
  link.href = item.url;
  link.target = '_blank';
  link.rel = 'noopener noreferrer';
  link.textContent = 'Watch video';
  link.className = 'video-link';
  return link;
}

// ---------- Building gallery items ----------
function createGalleryItem(item) {
  const card = document.createElement('div');
  card.className = 'gallery-item';

  if (item.media_type === 'video') {
    card.appendChild(buildVideoElement(item, false));
  } else {
    const img = document.createElement('img');
    img.src = item.url;
    img.alt = item.title;
    card.appendChild(img);
  }

  const title = document.createElement('h3');
  title.textContent = item.title;

  const date = document.createElement('p');
  date.textContent = item.date;

  card.appendChild(title);
  card.appendChild(date);

  card.addEventListener('click', () => openModal(item));

  return card;
}

// ---------- Modal view ----------
function openModal(item) {
  modalBody.innerHTML = '';

  if (item.media_type === 'video') {
    modalBody.appendChild(buildVideoElement(item, true));
  } else {
    const img = document.createElement('img');
    img.src = item.hdurl || item.url;
    img.alt = item.title;
    modalBody.appendChild(img);
  }

  const title = document.createElement('h2');
  title.textContent = item.title;

  const date = document.createElement('p');
  date.className = 'modal-date';
  date.textContent = item.date;

  const explanation = document.createElement('p');
  explanation.textContent = item.explanation;

  modalBody.appendChild(title);
  modalBody.appendChild(date);
  modalBody.appendChild(explanation);

  modal.classList.remove('hidden');
}

function closeModal() {
  modal.classList.add('hidden');
  modalBody.innerHTML = '';
}

modalClose.addEventListener('click', closeModal);

modal.addEventListener('click', (event) => {
  if (event.target === modal) {
    closeModal();
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && !modal.classList.contains('hidden')) {
    closeModal();
  }
});

// ---------- Loading & rendering the gallery ----------
async function loadGallery(startDateStr, endDateStr) {
  loadingMsg.classList.remove('hidden');
  gallery.innerHTML = '';

  try {
    const items = await fetchApodRange(startDateStr, endDateStr);

    gallery.innerHTML = '';
    items.forEach((item) => {
      gallery.appendChild(createGalleryItem(item));
    });
  } catch (error) {
    gallery.innerHTML = '<p class="error">Something went wrong loading space images: ' + error.message + '</p>';
  } finally {
    loadingMsg.classList.add('hidden');
  }
}

// ---------- Wire up the "Get Space Images" button ----------
getBtn.addEventListener('click', () => {
  loadGallery(startInput.value, endInput.value);
});

// ---------- Initial page load ----------
showRandomFact();
loadGallery(startInput.value, endInput.value);
