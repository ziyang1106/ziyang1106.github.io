"use strict";

const copyButton = document.getElementById("copy-citation");
copyButton.addEventListener("click", async () => {
  const citation = document.getElementById("bibtex");
  const status = document.getElementById("copy-status");
  try {
    await navigator.clipboard.writeText(citation.textContent);
    copyButton.textContent = "Copied!";
    status.textContent = "Citation copied to clipboard.";
    setTimeout(() => { copyButton.textContent = "Copy citation"; }, 2200);
  } catch {
    const range = document.createRange();
    range.selectNodeContents(citation);
    const selection = window.getSelection();
    selection.removeAllRanges();
    selection.addRange(range);
    copyButton.textContent = "Select & copy";
    status.textContent = "Citation selected. Use your browser's copy command.";
  }
});

// Autoplay only the two featured examples, once, when visible. Native controls
// always remain available, and reduced-motion preferences disable autoplay.
if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const observer = new IntersectionObserver(entries => {
    for (const entry of entries) {
      if (entry.isIntersecting) {
        entry.target.play().catch(() => {});
        observer.unobserve(entry.target);
      }
    }
  }, { threshold: 0.35 });
  document.querySelectorAll(".featured-video").forEach(video => observer.observe(video));
}

// Avoid continuing video playback when the page is in a background tab.
document.addEventListener("visibilitychange", () => {
  if (document.hidden) document.querySelectorAll("video").forEach(video => video.pause());
});
