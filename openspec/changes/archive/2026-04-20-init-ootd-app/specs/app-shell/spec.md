## ADDED Requirements

### Requirement: Mobile-only layout
The app SHALL constrain its maximum width to 480px and center itself on wider screens. No responsive breakpoints for desktop are needed.

#### Scenario: Content stays within 480px
- **WHEN** the app is opened on a screen wider than 480px
- **THEN** the content area SHALL not exceed 480px in width

---

### Requirement: Bottom navigation bar
The app SHALL display a persistent bottom navigation bar with two tabs: 衣櫥 (Wardrobe) and 穿搭 (Outfits).

#### Scenario: Navigate to Wardrobe
- **WHEN** the user taps 衣櫥 in the bottom nav
- **THEN** the router SHALL navigate to `/wardrobe`

#### Scenario: Navigate to Outfits
- **WHEN** the user taps 穿搭 in the bottom nav
- **THEN** the router SHALL navigate to `/outfits`

#### Scenario: Active tab highlighted
- **WHEN** the current route is `/wardrobe`
- **THEN** the 衣櫥 tab SHALL appear visually active

---

### Requirement: Page title in header
Each page SHALL display its title in a top header bar (衣櫥 or 穿搭).

#### Scenario: Wardrobe page title shown
- **WHEN** the user is on `/wardrobe`
- **THEN** the header SHALL display the text "衣櫥"

#### Scenario: Outfits page title shown
- **WHEN** the user is on `/outfits`
- **THEN** the header SHALL display the text "穿搭"

---

### Requirement: Light/Dark theme toggle
The app SHALL provide a button in the top-right corner to toggle between light and dark themes. Dark mode is the default. Light mode is activated by adding the class `light` to `<body>`; removing it reverts to dark.

#### Scenario: Toggle to light mode
- **WHEN** the user taps the theme toggle button while in dark mode
- **THEN** the app SHALL add the class `light` to `<body>` and persist the preference in localStorage

#### Scenario: Toggle to dark mode
- **WHEN** the user taps the theme toggle button while in light mode
- **THEN** the app SHALL remove the class `light` from `<body>` and persist the preference in localStorage

#### Scenario: Dark mode default on first visit
- **WHEN** the user opens the app for the first time with no saved preference
- **THEN** the app SHALL display in dark mode

#### Scenario: Preference restored on reload
- **WHEN** the user reloads the page
- **THEN** the previously saved theme SHALL be applied automatically

---

### Requirement: Design system CSS variables
The app SHALL define all visual tokens in `src/assets/base.css` using CSS custom properties. `:root` defines dark mode defaults; `body.light` overrides for light mode.

The token categories SHALL be:
- **Brand colors**: `--color-primary`, `--color-primary-hover`, `--color-secondary`
- **Text & background**: `--color-text-main`, `--color-text-muted`, `--color-bg-main`, `--color-bg-sub`
- **Spacing** (4px base): `--spacing-xs` (4px), `--spacing-sm` (8px), `--spacing-md` (16px), `--spacing-lg` (24px), `--spacing-xl` (32px)
- **Font sizes**: `--font-size-sm` (14px), `--font-size-base` (16px), `--font-size-lg` (18px), `--font-size-xl` (24px)
- **Border radius**: `--radius-sm` (4px), `--radius-md` (8px), `--radius-lg` (12px), `--radius-xl` (16px)

#### Scenario: Dark mode token values
- **WHEN** no `light` class is on `<body>`
- **THEN** `--color-bg-main` SHALL resolve to `#1F1F1F` and `--color-bg-sub` to `#181818`

#### Scenario: Light mode token values
- **WHEN** `body.light` is active
- **THEN** `--color-bg-main` SHALL resolve to `#FFFFFF` and `--color-bg-sub` to `#F8F8F8`

---

### Requirement: Filled Card visual style
The app SHALL use a Filled Card design approach: interface elements are distinguished by background color depth layers, not borders or shadows. No drop shadows. No box borders on cards or containers.

#### Scenario: Cards use background fill instead of borders
- **WHEN** a clothing item card is rendered
- **THEN** the card SHALL have a distinct background color (e.g., `--color-bg-sub`) and no visible border or box-shadow

---

### Requirement: No hover or transition effects
The app is touch-only. No hover states, hover color changes, or CSS transitions SHALL be applied to any interactive element.

#### Scenario: Buttons have no hover state
- **WHEN** a pointer hovers over a button on a desktop browser
- **THEN** the button's appearance SHALL not change

---

### Requirement: Default route redirect
The app SHALL redirect `/` to `/wardrobe`.

#### Scenario: Root path redirects
- **WHEN** the user navigates to `/`
- **THEN** the router SHALL redirect to `/wardrobe`
