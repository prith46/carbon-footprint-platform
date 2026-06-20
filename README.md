# CarbonTrack — Personal Carbon Footprint Tracker

A web application that helps individuals **understand**, **track**, and **reduce** their carbon footprint through daily activity logging, data visualization, and personalized reduction tips.

## Chosen Vertical

**Personal Sustainability** — empowering individuals to take measurable action on climate change by making carbon emissions visible, trackable, and reducible through a simple daily workflow.

## Approach and Logic

### Three Pillars

1. **Understand** — The Dashboard shows total emissions, category breakdowns (transport, food, energy, shopping), and trend analysis through interactive charts. An educational section explains what a carbon footprint is and how daily activities contribute.

2. **Track** — Users log activities (e.g., driving 20 km, eating a beef meal, using 5 kWh of electricity) and the app calculates CO2 emissions using real-world emission factors sourced from EPA, DEFRA, and IPCC data.

3. **Reduce** — The Insights page provides 12+ actionable tips personalized by the user's highest emission category. Users set daily and weekly goals, and the Progress page shows how they're tracking against those targets.

### Smart Recommendation Engine (the dynamic assistant)

The Dashboard features a context-aware recommendation engine (`src/utils/recommendations.ts`) that performs logical decision-making based on the user's actual data:

- **Goal overage** — if the recent daily average exceeds the user's goal, it computes the exact overage and surfaces a high-priority alert with the kg/day reduction needed.
- **Trend detection** — if emissions are rising week-over-week, it warns and names the category driving the increase.
- **Dominant category** — if one category exceeds 40% of the footprint, it recommends the single highest-saving action for that category, with quantified CO2 savings.
- **Positive reinforcement** — if the user is improving or within goal, it acknowledges progress and nudges toward a more ambitious target.

Recommendations are prioritized (high → low) and capped, so the advice is always the most relevant to the user's current context.

### Emission Calculation

Every activity maps to a scientifically-backed emission factor (kg CO2 per unit):
- **Transport**: Car (0.21/km), Bus (0.089/km), Train (0.041/km), Flight (0.255/km)
- **Food**: Beef (6.61/serving), Chicken (3.0/serving), Vegan meal (0.4/serving)
- **Energy**: Electricity (0.233/kWh), Natural gas (0.184/kWh)
- **Shopping**: Electronics (50/item), Clothing (10/item)

### Architecture

- **React 19** with TypeScript for type safety
- **React Router** for client-side routing with lazy-loaded pages
- **React Context** for state management with memoized computations
- **Recharts** for data visualization (bar charts, pie charts)
- **localStorage** for data persistence with validation on load
- **Vitest + React Testing Library** for 65+ automated tests

### Key Design Decisions

- **No backend required** — All data stored in localStorage with full input validation, making it instantly usable without signup
- **Lazy-loaded routes** — Each page is code-split to keep initial bundle under 250KB
- **Memoized computations** — All derived data (daily totals, category breakdowns, trends) are wrapped in `useMemo` to prevent unnecessary recalculation
- **WCAG AA accessibility** — Skip links, ARIA labels, keyboard navigation, screen reader support, sufficient color contrast

## How the Solution Works

1. **Log Activities** — Navigate to the Track page, select a category and activity, enter the amount, and submit
2. **View Dashboard** — See today's emissions, weekly average, monthly total, trend direction, and visual breakdowns
3. **Get Insights** — Browse personalized reduction tips sorted by your highest emission category, filter by difficulty
4. **Set Goals** — Define daily and weekly CO2 limits on the Insights page
5. **Track Progress** — View 30-day emission history and goal completion on the Progress page

## Assumptions

- Emission factors represent global averages; actual values vary by region
- A "serving" of food is a single meal portion (~200-300g)
- Users log activities manually (no automatic tracking)
- Data persists in the browser's localStorage (cleared if browser data is cleared)
- The average person produces approximately 16 kg CO2 per day

## Running the Project

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Run tests
npm test

# Build for production
npm run build

# Lint
npm run lint
```

## Tech Stack

| Technology | Purpose |
|---|---|
| React 19 | UI framework |
| TypeScript | Type safety |
| Vite 5 | Build tool |
| React Router 7 | Client-side routing |
| Recharts | Charts and data visualization |
| Vitest | Test runner |
| React Testing Library | Component testing |

## Project Structure

```
src/
├── __tests__/          # Test files (65+ tests)
├── components/         # Reusable UI components
│   ├── ActivityForm    # Activity logging form
│   ├── CategoryPieChart # Emission breakdown chart
│   ├── EmissionChart   # Daily emission bar chart
│   ├── EntryList       # Activity entry table
│   ├── GoalSetter      # Goal configuration form
│   ├── Layout          # App shell with navigation
│   ├── StatCard        # Reusable stat display
│   └── TipCard         # Reduction tip display
├── constants/          # Emission factors and tips
├── context/            # React Context for state
├── hooks/              # Custom React hooks
├── pages/              # Route-level page components
├── types/              # TypeScript type definitions
└── utils/              # Calculation and storage utilities
```
