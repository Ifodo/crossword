Product Requirements Document (PRD)

Project: IGetHouse Crossword Puzzle Game
Type: Web Application (Front-End Only)
Tech: HTML5, JavaScript, TailwindCSS (no backend, no CDN)

1. 🎯 Purpose

The crossword puzzle game will engage IGetHouse website visitors through fun, interactive puzzles built around real estate, home interiors, architecture, and decor themes. It aims to:

Boost user engagement & retention.

Educate users about real estate concepts and home interiors.

Encourage brand recall through gamification.

Drive traffic to property listings via puzzle completion CTAs.

2. 🧩 Scope

Build a crossword game interface inspired by the sample provided.

Use real estate–related vocabulary instead of generic words.

Puzzle logic and word bank stored locally in JavaScript (JSON arrays).

Responsive design: works seamlessly on desktop, tablet, and mobile.

No backend, no server calls, no CDN (all self-contained).

3. 🎮 Game Mechanics
Crossword Layout

Grid-based design (similar to provided image).

Numbered cells for Across & Down clues.

Black cells to separate words.

White cells for user input (single uppercase letter).

Input & Interaction

Click/tap a white cell → highlights corresponding word.

On-screen keyboard for mobile (or native device keyboard).

Auto-move cursor to next cell when typing.

Arrow keys to navigate cells.

Clues

Across & Down clues displayed below grid.

Example (real estate version):

Across: Luxury high-rise apartment (9) → PENTHOUSE

Down: Large city estate in Lagos (5) → LEKKI

Win Condition

When puzzle is solved → popup modal with:

🎉 “Well done! You completed today’s IGetHouse crossword!”

Button → “🏡 View Homes Like These” (links to listings).

4. 📂 Categories & Word Bank

Words come from real estate and home decor themes.

Home Interiors & Decor: sofa, chandelier, wardrobe, tiles, ceiling, carpet, fridge.
Household Stuffs: blender, broom, stove, microwave, curtains.
Architecture: facade, dome, arch, balcony, terrace, column.
Home Types: bungalow, duplex, penthouse, mansion, studio.
Real Estate Terms: mortgage, equity, lease, rent, deed, title.
Places/States: Lagos, Lekki, Ikoyi, Ogun, Abeokuta, Abuja, Maitama.

Example JSON structure:

const crosswordData = {
  across: [
    { num: 1, clue: "Luxury high-rise apartment", answer: "PENTHOUSE" },
    { num: 5, clue: "Single-level detached home", answer: "BUNGALOW" }
  ],
  down: [
    { num: 1, clue: "Upscale Lagos area", answer: "LEKKI" },
    { num: 2, clue: "Housing loan", answer: "MORTGAGE" }
  ]
};

5. 🎨 UI/UX Requirements

Theme color: IGetHouse Green #025940.

Typography: Clean, sans-serif font (system default).

Layout:

Grid in center.

Clues below (mobile: collapsible).

Footer → “Powered by IGetHouse”.

Interactions:

Highlight word when selecting clue.

Auto-check correctness (optional toggle).

Responsive:

Grid resizes for small screens.

Touch-friendly input.

6. 🛠 Technical Requirements

HTML5: Structure (grid, input fields, clue lists).

TailwindCSS: Styling, responsiveness, theming (local file, no CDN).

JavaScript:

Crossword generator & renderer.

Input validation & navigation.

Win detection & popup modal.

No backend, no CDN, no external libs.

Entire game runs client-side.

7. 🚀 Future Enhancements (Optional)

Daily Puzzle Rotation → load new JSON set each day.

Category Selector → user chooses Real Estate, Home Decor, or States in Nigeria.

Hints System → reveal letter/word.

Leaderboard (if backend added later).

8. 📊 Success Metrics

Increase time on site by at least 20%.

Grow engagement rate (users playing puzzles weekly).

Generate property leads via post-completion CTA clicks.