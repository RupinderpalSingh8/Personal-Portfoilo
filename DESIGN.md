# Design

Manifesto structure, from Inspo's named page shapes: one sequence of chapters, one text column, type on a solid field. The photographs stay in the room, not in a card grid.

## Readers

A recruiter moving station by station, or someone who switches to Read and goes straight down the page.

## Color

- Ink `#1c3548` for the reading column
- Void `#0e1a24` for the workshop
- Gold `#cc8e3c` for the path, frames, and the resume button
- Gold text `#f0c27a` for labels on ink
- Paper `#f3efe6` for body text and logo backings

No purple, no gradient fills, no glass.

## Type

Georgia, roman, for titles. system-ui for everything else. Titles are not italic. Body measure stays inside the column.

## Shape

Sharp corners. One filled button, the resume. Text sits on ink, never on a photograph.

## Motion

Scroll position drives the camera through GSAP ScrollTrigger (`scrub`). The camera and the panels move on transforms and opacity. Pixel ratio is capped. Reduced motion opens the reading layout.
