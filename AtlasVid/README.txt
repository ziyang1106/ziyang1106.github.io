AtlasVid project page

The dist folder is a complete static website with no build step or external dependencies.

GitHub Pages:
Copy the contents of dist into AtlasVid/ in ziyang1106.github.io.
The expected project URL will be https://ziyang1106.github.io/AtlasVid/ after committing and deploying that repository.
Alternatively, place dist contents in the publishing root of a separate repository.
All local links are relative, so subdirectory hosting works.

Files:
index.html — page content and video captions
style.css — responsive white/green academic design
script.js — copy citation, accessible autoplay behavior
assets/videos — six embedded PowerPoint videos, compressed to approximately 720p for web playback
assets/method.png — original method figure from the paper
assets/ablation-attention.png — Figure 4, attention design ablation
assets/ablation-finetuning.png — Figure 5, optional 4K fine-tuning ablation

Video sources:
AI@70 - AtlasVid.pptx, slide 1: media2 (purple bird, 3840x2176, 161 frames), media1 (wild dog, 2560x1440, 321 frames).
Slide 13: media3 (crab), media4 (ocean), media5 (forest), media6 (interior), each 3840x2176 and 161 frames.
Video compression: H.264 CRF 27, approximately 720p; 800 Kbps maximum for the five 4K sources, 450 Kbps for the 2K long-video source. Frame counts and playback duration are preserved. Source files remain unchanged in the original presentation.

Verified references:
https://ziyang1106.github.io/ — authors, equal contribution, NeurIPS 2026
https://arxiv.org/abs/2605.16649 — title, abstract and citation
https://arxiv.org/html/2605.16649v1 — Dartmouth affiliations and method figure
https://wileewang.github.io/MotionInversion/ — design reference only; no template code copied

The Code button links to https://github.com/ziyang1106/AtlasVid. The repository is currently empty; model code has not been uploaded.
The BibTeX entry cites the arXiv version; replace with proceedings metadata once the official entry is available.
The _headers file applies on compatible static hosts; GitHub Pages does not apply it. The HTML CSP remains active there.
