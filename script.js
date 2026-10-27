const moodData = {
  dreamy: {
    color: '#bd8bff',
    title: 'A softer kind of <span>night.</span>',
    description: 'Slow down. Let your thoughts drift somewhere beautiful.',
    label: 'THE NIGHT EDIT',
    playlist: 'Clouds on the Ceiling',
    subtitle: 'A little space to exhale.',
    tracks: [
      ['Velvet Skies', 'Low Tide', '3:42'],
      ['Half Asleep', 'June Atlas', '4:10'],
      ['Blue Hour', 'Little North', '5:03'],
      ['Slow Orbit', 'Somewhere Else', '5:15']
    ]
  },

  focused: {
    color: '#78d8ff',
    title: 'Quiet mind, <span>clear direction.</span>',
    description: 'Find your rhythm and get into flow.',
    label: 'THE DEEP WORK EDIT',
    playlist: 'In the Zone',
    subtitle: 'A soundtrack for getting things done.',
    tracks: [
      ['Signal & Noise', 'Northbound', '3:18'],
      ['Clean Slate', 'Mono Park', '4:02'],
      ['Soft Momentum', 'Dayframe', '4:36'],
      ['One Thing', 'The Outline', '5:01']
    ]
  },

  sunny: {
    color: '#ffc77d',
    title: 'A little more <span>golden.</span>',
    description: 'Open the windows in your mind and let some light in.',
    label: 'THE SUNLIT EDIT',
    playlist: 'Pocketful of Sun',
    subtitle: 'For the bright bits of an ordinary day.',
    tracks: [
      ['Peach Skies', 'Sunday Club', '3:26'],
      ['Easy Does It', 'Milo June', '3:54'],
      ['Lemonade Day', 'Honey Arcade', '4:12'],
      ['Good Things', 'The Little Hours', '4:48']
    ]
  },

  wild: {
    color: '#ff83c8',
    title: 'Out of orbit, <span>out of routine.</span>',
    description: 'Shake off the routine and follow the spark.',
    label: 'THE RESET EDIT',
    playlist: 'Somewhere Else',
    subtitle: 'A little adventure for your mind.',
    tracks: [
      ['Electric Bloom', 'Neon Fern', '3:31'],
      ['Side Quest', 'Static Youth', '3:59'],
      ['No Map Needed', 'Wildflower Radio', '4:27'],
      ['After the After', 'Pink Comet', '4:51']
    ]
  }
};

const moodCards = document.querySelectorAll('.mood-card');
const collectionTitle = document.getElementById('collectionTitle');
const collectionDescription =
  document.getElementById('collectionDescription');
const playlistLabel = document.getElementById('playlistLabel');
const playlistTitle = document.getElementById('playlistTitle');
const playlistDescription =
  document.getElementById('playlistDescription');
const tracksContainer = document.getElementById('tracks');

let currentMood = 'dreamy';
let previewing = false;

function renderTracks(tracks) {
  tracksContainer.innerHTML = tracks.map((track, index) => `
    <button class="track">
      <span>${String(index + 1).padStart(2, '0')}</span>
      <span>${track[0]}<small>${track[1]}</small></span>
      <span>${track[2]}</span>
    </button>
  `).join('');

  tracksContainer.querySelectorAll('.track').forEach(track => {
    track.addEventListener('click', () => {
      tracksContainer.querySelectorAll('.track')
        .forEach(item => item.classList.remove('playing'));

      track.classList.add('playing');
    });
  });
}

function setMood(mood) {
  const data = moodData[mood];

  if (!data) return;

  currentMood = mood;

  document.documentElement.style.setProperty(
    '--accent',
    data.color
  );

  moodCards.forEach(card => {
    const selected = card.dataset.mood === mood;

    card.classList.toggle('active', selected);
    card.setAttribute('aria-pressed', String(selected));
  });

  collectionTitle.innerHTML = data.title;
  collectionDescription.textContent = data.description;
  playlistLabel.textContent = data.label;
  playlistTitle.textContent = data.playlist;
  playlistDescription.textContent = data.subtitle;

  previewing = false;
  document.getElementById('previewBtn').textContent =
    '▶ Preview vibe';

  renderTracks(data.tracks);
}

moodCards.forEach(card => {
  card.addEventListener('click', () => {
    setMood(card.dataset.mood);
  });
});

// Switch between light and dark themes
document.getElementById('themeBtn').addEventListener('click', () => {
  document.body.classList.toggle('light-mode');
});

// Choose a random mood
document.getElementById('surpriseBtn').addEventListener('click', () => {
  const moods = Object.keys(moodData).filter(
    mood => mood !== currentMood
  );

  const randomMood = moods[
    Math.floor(Math.random() * moods.length)
  ];

  setMood(randomMood);

  document.querySelector('.playlist').animate(
    [
      { opacity: 0.5, transform: 'translateY(10px)' },
      { opacity: 1, transform: 'translateY(0)' }
    ],
    { duration: 400, easing: 'ease-out' }
  );
});

// Visual preview button; no real audio is played
document.getElementById('previewBtn').addEventListener('click', event => {
  previewing = !previewing;

  event.currentTarget.textContent = previewing
    ? 'Ⅱ Previewing vibe'
    : '▶ Preview vibe';

  if (!previewing) {
    tracksContainer.querySelectorAll('.track')
      .forEach(track => track.classList.remove('playing'));
  } else {
    const firstTrack = tracksContainer.querySelector('.track');

    if (firstTrack) {
      firstTrack.classList.add('playing');
    }
  }
});

// Animate sections as they appear on screen
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

document.querySelectorAll('.section, .quote-section').forEach(section => {
  section.style.transition = 'opacity .7s ease, transform .7s ease';
  section.style.opacity = '0';
  section.style.transform = 'translateY(20px)';

  observer.observe(section);
});

const animatedSections = document.querySelectorAll(
  '.section, .quote-section'
);

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.05 });

animatedSections.forEach(section => revealObserver.observe(section));

// Set the initial mood
setMood('dreamy');