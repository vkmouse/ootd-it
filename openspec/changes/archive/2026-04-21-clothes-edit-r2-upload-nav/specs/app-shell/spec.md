## MODIFIED Requirements

### Requirement: Page title in header
AppHeader SHALL NOT display any page title text. The header SHALL only contain the theme toggle button.

#### Scenario: Header shows no title text
- **WHEN** the user is on any page
- **THEN** the header SHALL display only the theme toggle button, with no title text on the left side

---

### Requirement: Bottom navigation bar
The app SHALL display a persistent bottom navigation bar with two tabs: 衣櫥 (Wardrobe) and 穿搭 (Outfits). Tab clicks SHALL use `router.replace()` to avoid pushing new history entries. The bottom nav SHALL NOT be visible on the clothes add/edit pages (`/wardrobe/new`, `/wardrobe/:id/edit`).

#### Scenario: Navigate to Wardrobe
- **WHEN** the user taps 衣櫥 in the bottom nav
- **THEN** the router SHALL call `router.replace('/wardrobe')`, replacing the current history entry

#### Scenario: Navigate to Outfits
- **WHEN** the user taps 穿搭 in the bottom nav
- **THEN** the router SHALL call `router.replace('/outfits')`, replacing the current history entry

#### Scenario: Active tab highlighted
- **WHEN** the current route is `/wardrobe`
- **THEN** the 衣櫥 tab SHALL appear visually active

#### Scenario: Tab switch does not create back history
- **WHEN** the user switches from 衣櫥 to 穿搭 and presses browser back
- **THEN** the browser SHALL NOT navigate back to 衣櫥; it SHALL navigate to the page before the app was opened (or stay if no prior history)

#### Scenario: Bottom nav hidden on detail pages
- **WHEN** the user is on `/wardrobe/new` or `/wardrobe/:id/edit`
- **THEN** the bottom navigation bar SHALL NOT be visible
