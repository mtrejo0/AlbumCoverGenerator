# Reusable prompt: write Product Hunt launch copy

Paste the block below into a fresh chat in this repo. Edit the **Context**
section if anything has changed (new features, screenshots, audience, link).

---

I'm launching **AlbumCoverGenerator** on Product Hunt. The repo's launch
constraints and current draft live here:

- `product-hunt/spec.yml` — field-level character limits and tone guidance
  (hard limits Product Hunt enforces, soft limits from community best
  practice). Treat `type: hard` rules as non-negotiable.
- `product-hunt/launch.yml` — the working draft (name, tagline,
  description, topics, first_comment, links).
- `npm run validate:ph` — validates `launch.yml` against `spec.yml`.

## Context

- **What it does:** Client-side Next.js app that generates album covers
  from emojis, gradients, and a text overlay. Pure browser canvas, no
  backend, no AI.
- **Audience:** Musicians, podcasters, and playlist makers who don't
  want to fight Photoshop or get bland AI output.
- **Differentiators:** Deterministic generative output (no AI hallucinations),
  Shuffle Everything button, debounced auto-regenerate while you tweak,
  3000x3000 export as JPEG or PNG.
- **Stage / link:** <fill in the live URL and any current screenshots>.

## What I want you to do

1. Read `product-hunt/spec.yml` and `product-hunt/launch.yml`.
2. Generate **three alternative versions** of each of the following, each
   labeled and with its exact character (or word) count in brackets:
   - `tagline` (≤ 60 chars, hard)
   - `description` (≤ 260 chars, hard)
   - `first_comment` (150–250 words, soft)
3. For each field, recommend the version you'd ship and one sentence on
   why.
4. Update `product-hunt/launch.yml` with the recommended versions.
5. Run `npm run validate:ph` and paste the output. If anything fails or
   warns, fix it and re-run until it's a clean pass.

## Style guardrails

- Tagline: outcome-driven, not clever. No wordplay. Plain language about
  what it does and for whom.
- Description: lead with the problem, then the primary benefit, then one
  specific credible detail (a number, feature, or use case).
- First comment: greeting → problem → origin story → what it does →
  differentiators → optional offer → specific CTA question. Keep it
  human; no marketing-speak; no emojis unless they're part of the actual
  product output.
- Never exceed a hard limit. If you're at 59/60 chars and the wording
  reads awkward, prefer rewriting to fit cleanly rather than trimming a
  word.

---
