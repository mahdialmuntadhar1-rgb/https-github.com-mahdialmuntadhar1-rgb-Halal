# HALAL / ZAWAJ Development Instructions & Rules

These rules apply to all AI models and coding agents working on this workspace. They are injected into the system instructions to ensure safety, reliability, and architectural discipline.

---

## 🛡️ SAFETY & AUDITING
- **Minimal Invasive Changes**: Do not rewrite the whole app. Do not break stable screens or existing user journeys.
- **Pre-Flight Inspection**: Before editing, inspect the existing `AuthScreen`, `apiClient`, `App` routing/state flow, and onboarding components. Modify only the minimum files required.
- **Do Not Push Unrequested Features**: Keep implementation strictly focused on the requested tasks.

---

## 👤 AUTHENTICATION & ONBOARDING FLOW
- **Simple Registration**: Registration must stay simple (Email, Password, Confirm Password, Username/Name). Do not demand extensive profile details during the initial signup step.
- **Post-Auth Gender Selection**: Gender selection must move to the step *after* login/register or inside the onboarding wizard, never pre-authentication.
- **Onboarding Trigger**: The profile onboarding wizard must start ONLY after successful authentication (sign up or login).
- **Confirm Password**: The "Confirm Password" validation must be frontend-only. Do not include it in the backend signup payload.

---

## 🗺️ GOVERNORATE REQUIREMENTS
- **Mandatory Governorate Selection**: The governorate selection is required for a complete profile.
- **Full Coverage**: Include all 19 Iraqi governorates, including Halabja:
  1. Baghdad (بغداد / بەغداد)
  2. Erbil (أربيل / هەولێر)
  3. Sulaymaniyah (السليمانية / سلێمانی)
  4. Duhok (دهوك / دهۆک)
  5. Halabja (حلبجة / هەڵەبجە)
  6. Kirkuk (كركوك / کەرکوک)
  7. Nineveh (نينوى / نەینەوا)
  8. Basra (البصرة / بەسرە)
  9. Najaf (النجف / نەجەف)
  10. Karbala (كربلاء / کەربەلا)
  11. Babel (بابل / بابل)
  12. Anbar (الأنبار / ئەنبار)
  13. Diyala (ديالى / دیالە)
  14. Salah al-Din (صلاح الدين / سەڵاحەدین)
  15. Wasit (واسط / واسیت)
  16. Maysan (ميسان / میسان)
  17. Dhi Qar (ذي قار / زیقار)
  18. Muthanna (المثنى / موتەنا)
  19. Qadisiyah (القادسية / قادسیە)

---

## 🔌 API & BACKEND payload CONTRACT
- **Exact Payload Delivery**: Backend API payloads must match the server expectations precisely. Do not send arbitrary or unvalidated fields.
- **Graceful Error Handling**: Fall back to state-based navigation or client-side storage gracefully if the server is offline or returns error codes.
