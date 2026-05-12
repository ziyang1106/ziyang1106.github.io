// ============================================================
// TRIAL DATA — fill in the URLs to your 30 reference images
// and their corresponding generated videos.
//
// Host the media on any HTTPS-accessible location (R2, S3,
// github.io itself, your institutional CDN, etc.) and paste
// the public URLs below.
//
// Each REFERENCES entry produces 2 trials:
//   - Ours vs Phantom
//   - Ours vs VACE
// So 30 references => 60 real trials.
// ============================================================

const REFERENCES = [
  // -------- replace these 30 entries with your real data --------
  {
    id: 'ref01',
    image:   'https://YOUR-CDN/refs/ref01.png',
    prompt:  'The same man is walking through a sunlit garden, smiling gently.',
    ours:    'https://YOUR-CDN/videos/ref01_ours.mp4',
    phantom: 'https://YOUR-CDN/videos/ref01_phantom.mp4',
    vace:    'https://YOUR-CDN/videos/ref01_vace.mp4',
  },
  {
    id: 'ref02',
    image:   'https://YOUR-CDN/refs/ref02.png',
    prompt:  'The same woman is sitting at a small wooden table on a sunlit balcony.',
    ours:    'https://YOUR-CDN/videos/ref02_ours.mp4',
    phantom: 'https://YOUR-CDN/videos/ref02_phantom.mp4',
    vace:    'https://YOUR-CDN/videos/ref02_vace.mp4',
  },
  // ... add ref03 ... ref30 ...
];

// ============================================================
// ATTENTION CHECKS — 4 trials sprinkled across the study.
// Each shows the reference next to (a) the matching person and
// (b) an obviously wrong person (different gender / ethnicity /
// age). Any honest rater will pick the matching one.
//
// `correct_video` = URL of the matching video (this is the one
//   that visually matches the reference).
// `wrong_video`   = URL of the obviously different person.
// ============================================================

const ATTENTION_CHECKS = [
  {
    id: 'ac1',
    image: 'https://YOUR-CDN/ac/ac1_ref.png',
    prompt: 'The same person is standing in a quiet park.',
    correct_video: 'https://YOUR-CDN/ac/ac1_correct.mp4',
    wrong_video:   'https://YOUR-CDN/ac/ac1_wrong.mp4',
  },
  {
    id: 'ac2',
    image: 'https://YOUR-CDN/ac/ac2_ref.png',
    prompt: 'The same person is reading a book in a cozy library.',
    correct_video: 'https://YOUR-CDN/ac/ac2_correct.mp4',
    wrong_video:   'https://YOUR-CDN/ac/ac2_wrong.mp4',
  },
  {
    id: 'ac3',
    image: 'https://YOUR-CDN/ac/ac3_ref.png',
    prompt: 'The same person is walking along a beach at sunset.',
    correct_video: 'https://YOUR-CDN/ac/ac3_correct.mp4',
    wrong_video:   'https://YOUR-CDN/ac/ac3_wrong.mp4',
  },
  {
    id: 'ac4',
    image: 'https://YOUR-CDN/ac/ac4_ref.png',
    prompt: 'The same person is preparing a meal in a kitchen.',
    correct_video: 'https://YOUR-CDN/ac/ac4_correct.mp4',
    wrong_video:   'https://YOUR-CDN/ac/ac4_wrong.mp4',
  },
];
