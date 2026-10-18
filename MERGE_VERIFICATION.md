# Landing page and admin merge

The GitHub landing page at `1320d01cb6bcb5d4190b0abf14c90e15cbebe182` is the visual reference. Its original root `index.html` and `assets/` remain in the repository. The Next.js app serves that design with assets under `public/`, locally bundled fonts, and lifecycle-managed home animations.

## Validation completed

- Production build and TypeScript checking pass.
- ESLint reports no errors; inherited dashboard typing and other advisory warnings remain.
- Four Node test entries pass, including a PostgreSQL/PGlite migration and authorization regression suite.
- Browser checks pass at 1440px desktop and 390px mobile: 8-second video loads and plays muted; offscreen images wait for scrolling; process progress changes; homepage effects reinitialize after navigating back twice; mobile drawer opens and Escape closes it; no horizontal overflow.
- Reduced-motion users receive the poster without autoplaying video.
- Browser reported no uncaught page errors.
- Without database credentials, admin shows configuration required and inquiry submission returns 503 without false success.

## Database repairs

Apply `202610180003_merge_repairs.sql` after the first two migrations. It repairs quotation draft calculations, revokes former client access on project reassignment or membership removal, and overrides broad default grants for private application data and protected role/profile fields.

The regression suite uses PostgreSQL running locally through PGlite with simulated Auth and Storage schemas. It verifies reassignment, file metadata access, role and profile-email protection, draft quotation totals, issuance, and issued-content immutability. It is not a live Supabase integration test.

## Setup still required on the target environment

Preserve your existing `.env.local`; do not commit it. Configure Supabase, apply migrations, and use the existing admin bootstrap instructions in README.md. Live sign-in, invitation email delivery, actual Storage uploads/signed URLs, and authenticated dashboard operations require a configured Supabase project and remain to be verified there.

The homepage inquiry CTA now opens `/request-quote`; it does not show a fake submission success. Published managed portfolio content is available under `/projects`.
