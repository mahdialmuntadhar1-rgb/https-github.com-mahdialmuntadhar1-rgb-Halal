You are working ONLY on the Zawaj Al Araqi / زواج العراقي Halal marriage application.

Live site:
https://zawaj.kaniq.org/

GitHub repo:
https://github.com/mahdialmuntadhar1-rgb/https-github.com-mahdialmuntadhar1-rgb-Halal

IMPORTANT:
Do NOT mix this with Shaku Maku, Talaba, StudentHUB, directory, hotel, university, or any other project.
This task is ONLY for the Halal / serious marriage app: Zawaj Al Araqi / زواج العراقي.

Goal:
Update the application visual branding to a bright, premium neon pink and neon purple style with strong contrast, clean white/light background, and postcard-style cards.

Brand color palette:

* Primary Neon Pink: #FF4FD8
* Primary Neon Purple: #9D4DFF
* Secondary Soft Purple: #C77DFF
* Highlight Pink: #FF8AE2
* Background White: #FFFFFF
* Light Lavender Background: #F8F5FF
* Dark Text / Charcoal: #1E1E2F
* White text on dark/gradient areas: #FFFFFF

Design direction:

* Bright, clean, premium, modern.
* Neon pink and purple gradients.
* Good contrast and readable text.
* Do NOT make it dark, nightclub, gaming, or too heavy.
* Use white or very light lavender backgrounds.
* Use dark charcoal text on light backgrounds.
* Use white text only on strong neon purple/pink gradient sections.
* Add soft glow effects around buttons, important CTAs, icons, and postcard cards.
* Use rounded corners, glassmorphism, gentle shadows, and subtle neon lighting.
* The app should still feel serious, respectful, and suitable for marriage, not casual dating.

Specific implementation tasks:

1. Update global theme colors
Find the global CSS/theme file, especially:
src/index.css

Replace the old warm/coral/blue theme colors with the new Zawaj brand color system.

Add or update CSS variables / Tailwind theme tokens for:
--color-brand-pink: #FF4FD8;
--color-brand-purple: #9D4DFF;
--color-brand-soft-purple: #C77DFF;
--color-brand-highlight-pink: #FF8AE2;
--color-brand-bg: #F8F5FF;
--color-brand-white: #FFFFFF;
--color-brand-charcoal: #1E1E2F;

Keep fonts and existing animations unless they conflict with readability.

2. Create reusable brand utility classes
Add reusable classes such as:

.brand-page-bg

* white/light lavender background
* very subtle pink/purple radial glow

.brand-gradient

* gradient from #FF4FD8 to #9D4DFF with #C77DFF as optional middle

.brand-card

* white or glass white background
* rounded-2xl / rounded-3xl
* soft border using rgba purple/pink
* gentle shadow
* readable dark text

.brand-postcard

* postcard-style card
* bright, clean, premium
* gradient border or neon top accent
* suitable for profile cards, feature cards, and landing sections

.brand-button-primary

* neon pink to neon purple gradient
* white text
* strong contrast
* soft glow
* hover effect but not too aggressive

.brand-button-secondary

* white/light background
* purple/pink border
* dark charcoal text
* hover glow

.brand-glow

* soft pink/purple glow only, not too much
3. Update visible UI components
Search the codebase for old colors such as:
warm-ivory
warm-charcoal
accent-coral
accent-pink
accent-blue
coral
blue
ivory

Replace them carefully with the new brand colors.

Focus especially on:

* Landing page
* Hero section
* Gender selection screen
* Match/profile cards
* Postcards/cards
* CTA buttons
* Header/navigation
* Install button
* Onboarding screen
* Login/register screen
* Trust/privacy cards
4. Postcard/card design
Make profile cards and homepage cards look like premium postcards:
* white/light lavender card base
* neon pink/purple gradient accent
* rounded corners
* good spacing
* soft shadow
* readable text
* subtle badge/pill style
* do not overcrowd the cards
5. Contrast and accessibility
Make sure:
* No light pink text on white background.
* No purple text on dark purple background unless contrast is strong.
* Body text uses #1E1E2F on light backgrounds.
* Buttons with gradient backgrounds use white text.
* Arabic and Kurdish text remain readable and not too small.
* Mobile screens remain clean and not crowded.
6. Preserve application logic
Do NOT change:
* Authentication logic
* API calls
* Database logic
* Matching logic
* Language logic
* Admin logic
* User data structure
* Routing logic

Only change visual design, theme classes, and styling.

7. Keep the serious marriage positioning
The design must support this message:
“Zawaj Al Araqi / زواج العراقي — للزواج الجاد بطريقة محترمة تناسب مجتمعنا”

Avoid:

* Tinder-like casual dating feeling
* nightclub/dark gaming style
* childish colors
* too much animation
* fake promises
* any unrelated project text
8. Test before finishing
After changes, run:

npm install
npm run build

Fix any TypeScript, Tailwind, or build errors.

9. Final response
After completing, provide:
* Files changed
* Main color updates
* Any components updated
* Build result
* Any remaining notes

Expected result:
The app should look brighter, more modern, more premium, and clearly branded with neon pink and neon purple, while keeping a respectful serious-marriage feeling for Iraq.

