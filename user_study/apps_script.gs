// =============================================================
// Google Apps Script web app for receiving user-study submissions
//
// Setup steps (10 minutes total):
//   1. Create a new Google Sheet. Name it whatever you like.
//   2. In the Sheet, open  Extensions → Apps Script.
//   3. Delete any boilerplate code in the editor.
//   4. Paste ALL of this file into the editor and save.
//   5. Click  Deploy → New deployment.
//        Type: Web app
//        Description: User study endpoint
//        Execute as: Me
//        Who has access: Anyone
//      Click Deploy. Authorize the script when prompted (one-time).
//   6. Copy the displayed Web app URL.
//      Paste it as APPS_SCRIPT_URL in index.html.
//
// Re-deployment: If you edit the code later, you MUST run
//   Deploy → Manage deployments → (edit, new version) → Deploy
// otherwise the live endpoint keeps using the old version.
// =============================================================

const SUBMISSIONS_SHEET = 'submissions';     // one row per rater (summary)
const RESPONSES_SHEET   = 'responses';       // one row per trial response (denormalised)

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const ss = SpreadsheetApp.getActiveSpreadsheet();

    // --- Sheet 1: one summary row per submission
    let summary = ss.getSheetByName(SUBMISSIONS_SHEET);
    if (!summary) summary = ss.insertSheet(SUBMISSIONS_SHEET);
    if (summary.getLastRow() === 0) {
      summary.appendRow([
        'submitted_at', 'prolific_pid', 'study_id', 'session_id',
        'started_at', 'completion_code', 'n_trials', 'user_agent'
      ]);
    }
    summary.appendRow([
      data.submitted_at, data.prolific_pid, data.study_id, data.session_id,
      data.started_at, data.completion_code, data.n_trials, data.user_agent
    ]);

    // --- Sheet 2: one row per individual response (long format)
    let responses = ss.getSheetByName(RESPONSES_SHEET);
    if (!responses) responses = ss.insertSheet(RESPONSES_SHEET);
    if (responses.getLastRow() === 0) {
      responses.appendRow([
        'submitted_at', 'prolific_pid',
        'trial_index', 'kind', 'ref_id', 'pair_type',
        'ours_side', 'raw_choice', 'signed_score', 'response_time_ms'
      ]);
    }
    const rows = (data.responses || []).map(r => ([
      data.submitted_at, data.prolific_pid,
      r.trial_index, r.kind, r.ref_id, r.pair_type,
      r.ours_side, r.raw_choice, r.signed_score, r.response_time_ms
    ]));
    if (rows.length > 0) {
      responses.getRange(responses.getLastRow() + 1, 1, rows.length, rows[0].length).setValues(rows);
    }

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (err) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

// Optional: a GET endpoint so you can sanity-check the deployment in a browser.
function doGet() {
  return ContentService
    .createTextOutput('OK — user-study endpoint is alive.')
    .setMimeType(ContentService.MimeType.TEXT);
}
