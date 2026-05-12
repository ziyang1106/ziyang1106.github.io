# User Study — deployment guide

A self-contained static user-study site for the ContextAnyone paper.
Hosts on GitHub Pages, submits to a Google Sheet via Google Apps Script.

## File layout

| File             | What it is |
|------------------|-----------|
| `index.html`     | The study UI (HTML + CSS + JS, single file) |
| `trials.js`      | Trial data: 30 reference entries + 4 attention checks |
| `apps_script.gs` | Backend code to paste into Google Apps Script |
| `README.md`      | This file |

## Setup — one-time, ~30 minutes

### Step 1. Create the Google Sheet + Apps Script endpoint

1. Create a new Google Sheet (any name).
2. In the Sheet: **Extensions → Apps Script**.
3. Delete the boilerplate, paste **all of `apps_script.gs`**, click save.
4. **Deploy → New deployment**:
   - Type: **Web app**
   - Execute as: **Me**
   - Who has access: **Anyone**
   - Click **Deploy**, authorize when prompted.
5. Copy the **Web app URL** (looks like `https://script.google.com/macros/s/XXXXXX/exec`).

You can sanity-check by pasting that URL into a browser — you should see "OK — user-study endpoint is alive."

### Step 2. Host your video and image files

You need **publicly readable HTTPS URLs** for:
- 30 reference images
- 90 generated videos (30 refs × {Ours, Phantom, VACE})
- 4 attention-check reference images + 8 attention-check videos

Recommended host: **Cloudflare R2** (free 10 GB, no egress fee). Other options: AWS S3, Backblaze B2, or your institutional file server. GitHub Pages can host these too if the total stays under ~1 GB, but loading is slower.

After uploading, each file should be reachable as e.g. `https://your-bucket.r2.dev/refs/ref01.png`.

### Step 3. Fill in `trials.js`

Open `trials.js` and replace the placeholder URLs:

- The `REFERENCES` array needs 30 entries. Each entry maps `id` → `image` + `prompt` + `ours` + `phantom` + `vace`.
- The `ATTENTION_CHECKS` array has 4 entries. For each, `correct_video` is the matching video, `wrong_video` is the obviously-different person.

### Step 4. Wire the endpoint into `index.html`

Open `index.html` and find the `CONFIGURATION` block near the top of the `<script>`:

```js
const APPS_SCRIPT_URL = 'PASTE_YOUR_APPS_SCRIPT_WEB_APP_URL_HERE';
const COMPLETION_CODE = 'YOUR_PROLIFIC_COMPLETION_CODE';
const PROLIFIC_RETURN_URL = 'https://app.prolific.com/submissions/complete?cc=' + 'YOUR_PROLIFIC_COMPLETION_CODE';
```

- Paste the Apps Script web-app URL from Step 1 as `APPS_SCRIPT_URL`.
- On Prolific, create a study with a completion code. Paste that code as `COMPLETION_CODE` (and also into the URL string).

### Step 5. Deploy to GitHub Pages

Drop this `user_study/` folder into your `<username>.github.io` repo:

```
<username>.github.io/
└── user_study/
    ├── index.html
    └── trials.js
```

After pushing to `main`, the study is live at
`https://<username>.github.io/user_study/`.

### Step 6. Configure the Prolific study

- **External study URL** (paste exactly):
  ```
  https://<username>.github.io/user_study/?PROLIFIC_PID={{%PROLIFIC_PID%}}&STUDY_ID={{%STUDY_ID%}}&SESSION_ID={{%SESSION_ID%}}
  ```
- **How do participants confirm completion?** Selectivity: "I'll redirect them using a URL". Completion URL:
  ```
  https://app.prolific.com/submissions/complete?cc=<YOUR_COMPLETION_CODE>
  ```
- Estimated study duration: **25 minutes**.
- Reward: ~£5 (≈ $12/hour).

## How the data lands

After every submission, two sheets are updated in your Google Sheet:

- **`submissions`** — one row per rater, with metadata (Prolific ID, timestamps, user agent, etc.).
- **`responses`** — one row per individual trial response (long / tidy format), with `pair_type`, `ref_id`, `signed_score`, `response_time_ms`, etc.

Use `File → Download → CSV` (or the `pandas` Google Sheets connector) to pull the data for analysis.

## Computing the headline numbers

For each baseline (Phantom or VACE):

```python
import pandas as pd
df = pd.read_csv('responses.csv')
df = df[df['kind'] == 'real']                 # drop attention checks
g  = df[df['pair_type'] == 'Ours_vs_Phantom']  # one baseline at a time

# signed_score: +2 / +1 = Ours wins, 0 = tie, -1 / -2 = baseline wins
n      = len(g)
wins   = (g['signed_score'] > 0).sum()
ties   = (g['signed_score'] == 0).sum()
losses = (g['signed_score'] < 0).sum()

strict_win    = wins / n
inclusive_win = (wins + 0.5 * ties) / n

# Spearman correlation against metric difference (per-trial):
# join responses with a table of per-(ref_id, pair_type) metric diffs
# then use scipy.stats.spearmanr
```

## Local testing

Before deploying, you can test locally:

```bash
cd user_study
python -m http.server 8000
```

Open `http://localhost:8000/?PROLIFIC_PID=test_pid` in your browser. The site
runs entirely client-side; submissions still POST to your Apps Script endpoint,
so make sure it is deployed before you click Submit.

A localStorage key (`video_study_state_v1`) preserves progress across refreshes.
Click "Reset and restart" on the final screen, or clear the key in DevTools to
start fresh.

## Quality control

The frontend records `response_time_ms` per trial and the attention-check kind
inline with each response. Standard exclusion criteria you can apply after
data collection:

- **Attention-check failure**: rater with `< 80%` accuracy on `kind == 'attention_check'` trials (i.e., missed more than one of four).
- **Speeding**: rater whose median `response_time_ms` is below ~3000 ms.
- **Completion**: rater whose `n_trials` in the `submissions` sheet differs from the expected total.

These checks should be done in post-processing; the frontend records the raw
data without filtering.

## Costs

- Google Apps Script: free, no quota for our use.
- Google Sheets: free.
- GitHub Pages: free.
- Cloudflare R2: free for 10 GB / 1M ops per month.
- Prolific: 30 raters × £5 ≈ £150 + 33% platform fee ≈ **£200 total**.
