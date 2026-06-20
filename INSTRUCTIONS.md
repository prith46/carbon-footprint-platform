# Build Instructions for Claude Code

## Goal
Score 100/100 across all evaluation areas. Every decision must be made with the scoring rubric in mind. Do not cut corners anywhere.

## Problem Statement
Design a solution that helps individuals **understand, track, and reduce** their carbon footprint through simple actions and personalized insights.

## Important Rules
- Maximum 3 submission attempts allowed
- Repository size must be under 10 MB
- GitHub repository must be public
- Repository must contain only one branch
- Failure to follow these rules means the submission will not be evaluated

## Challenge Expectations
The solution must demonstrate:
- Ability to build a smart, dynamic assistant
- Logical decision making based on user context
- Practical and real-world usability
- Clean and maintainable code

## What to Submit
- A public GitHub repository link
- Complete project code inside the repository
- A README explaining:
  - Your chosen vertical
  - Approach and logic
  - How the solution works
  - Any assumptions made

## Evaluation Focus Areas
| Area | Impact Level |
|---|---|
| Code Quality — structure, readability, maintainability | High Impact |
| Security — safe and responsible implementation | High Impact |
| Efficiency — optimal use of resources | High Impact |
| Testing — validation of functionality | Medium Impact |
| Accessibility — inclusive and usable design | Medium Impact |
| Problem Statement Alignment | High Impact |

**High Impact**: Most important. Doing great here heavily drives a high overall score. Missing these drastically lowers standing.

**Medium Impact**: Checks how well the solution works under the surface. Doing great steadily elevates the score. A miss moderately lowers standing.

**Low Impact**: Final layers of polish. Excelling gives a small boost but still needed for a perfect score.

## Multi-Agent Build Strategy
Spawn 5 specialized agents. Agents must collaborate, review each other's work, and challenge each other's decisions before finalizing any output. No agent's output is final until at least one other agent has reviewed and approved it.

### Agent 1 — Architect
Design the entire system from scratch. Define the architecture, data models, folder structure, and conventions. Every other agent must follow your decisions.

### Agent 2 — UI Engineer
Build the complete user interface based on the Architect's design. Focus on usability, responsiveness, and visual clarity. Every screen must serve the problem statement.

### Agent 3 — State and Logic Engineer
Build all state management, business logic, data persistence, and calculation engines. Focus on correctness, security, and performance.

### Agent 4 — Test Engineer
Write comprehensive automated tests covering all logic, state, UI flows, and edge cases. Minimum 60 tests. All must pass.

### Agent 5 — Quality Auditor
Review all output from Agents 1-4. Find and fix every flaw before the final build. Run all tooling checks. Nothing ships until lint, build, and tests all pass with zero errors and zero warnings.

## What Agents Must Achieve Together
- A fully functional web application addressing all three pillars: understand, track, reduce
- Clean, maintainable, well-structured code with zero duplication
- Secure data handling with full input validation
- Optimal performance with no unnecessary re-renders or wasted computation
- Full WCAG AA accessibility compliance
- Comprehensive test coverage including edge cases
- A complete README explaining the vertical, approach, logic, assumptions, and how to run it

## Self-Evaluation and Auto-Fix Loop
After building the project, before considering the work done, run this loop:

### Step 1 — Self-Evaluate
Act as a strict judge. Evaluate the entire codebase against every evaluation area:

**Code Quality:**
- Any file over 150 lines?
- Any function over 30 lines?
- Any unused imports, variables, or exports?
- Any hardcoded values that should be constants?
- Any duplicated logic or JSX?
- Any index-based keys in .map() calls?
- Any console.log, console.error, console.warn left in?
- Does npm run lint pass with exit code 0 and zero errors?
- Are all React best practices followed?
- Are all useEffect dependency arrays correct?

**Security:**
- Is all localStorage data validated on load?
- Are all user inputs bounded and sanitized?
- Are all enum fields validated against allowed values?
- Could any null or undefined value cause a crash?
- Is there any dangerouslySetInnerHTML anywhere?

**Efficiency:**
- Are all context values wrapped in useMemo?
- Are all mutators wrapped in useCallback?
- Are expensive calculations memoized?
- Is new Date() inside a useMemo tied to [logs]?
- Are leaf components wrapped in React.memo?
- Does npm run build produce zero warnings?
- Is the JS bundle under 500kb (use React.lazy for routes)?

**Testing:**
- Do all 60+ tests pass?
- Are edge cases covered: null, undefined, NaN, empty arrays, negative numbers?
- Are all pages and components tested?
- Are all custom hooks tested?
- Are localStorage round-trip tests present?

**Accessibility:**
- Do all form inputs have htmlFor/id pairs?
- Do all icon-only buttons have unique descriptive aria-label?
- Do all charts have role="img" and descriptive aria-label?
- Does the mobile menu button have aria-expanded and aria-controls?
- Do all tables have sr-only caption and scope="col" on th?
- Is the aria-live region always in the DOM?
- Is there a skip-to-content link?
- Are all decorative SVGs aria-hidden="true"?
- Is color contrast WCAG AA on all text?
- Are focus rings visible on all interactive elements?

**Problem Statement Alignment:**
- Does the app genuinely address understand, track, AND reduce?
- Is the emission calculation based on real-world data?
- Is the UX simple and actionable?
- Does the app provide meaningful feedback on user progress?

### Step 2 — Score Each Area
Give yourself an honest score out of 100 for each area. List every issue found with [CRITICAL], [MAJOR], or [MINOR] labels.

### Step 3 — Fix Everything
Fix every single issue found, no matter how small. Do not skip anything.

### Step 4 — Repeat
Go back to Step 1 and evaluate again. Keep repeating this loop until:
- Every area scores 100/100
- npm run lint exits with code 0
- npm run build produces zero warnings
- npm test passes all tests

Only then is the project ready to submit.

## Definition of Done
- [ ] npm run lint → exit code 0, zero errors
- [ ] npm run build → zero warnings, bundle under 500kb
- [ ] npm test → all 60+ tests passing
- [ ] Self-evaluation scores 100/100 on all 6 areas
- [ ] Live URL accessible and fully functional
- [ ] Single branch (main), repo under 10 MB
- [ ] README complete
- [ ] No .env committed, node_modules and dist in .gitignore
