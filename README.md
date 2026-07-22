# Weighbridge Ticketing — Eng Heng Steel

A small Next.js 14 (App Router) + TypeScript system for keying in weighbridge
tickets, printing a slip that matches your physical Eng Heng Steel weighing
slip book, and searching past records.

## What's inside

- **New Ticket** (`/`) — single form to key in vehicle, driver, product,
  weigh-in/out times and weights. On save, a random unique serial number is
  generated server-side and the slip is shown ready to print.
- **Print slip** — sized exactly to 220mm × 140mm (22cm × 14cm), matching
  your continuous-feed stationery, laid out like the Eng Heng Steel slip.
- **Records** (`/receipts`) — advanced search/filter (keyword, vehicle no.,
  product, transaction type, date range, nett-weight range) with sortable,
  paginated results. Click any row to view/reprint that ticket.

## Which database should I use?

**Go with SQL (Neon Postgres)** — this project is already wired for it via
Prisma. Reasoning:

- Your data is uniformly structured (fixed columns: weights, dates, vehicle
  no., serial no.) — a relational table is a natural fit, no schema-less
  flexibility is needed.
- Your "advanced search filters" (date ranges, weight ranges, exact serial
  lookups, sorting) are exactly what SQL indexes and `WHERE`/`ORDER BY`
  clauses are built for.
- Serial numbers need a hard uniqueness guarantee — a SQL `UNIQUE` constraint
  gives you that for free; a NoSQL store makes you build it yourself.
- Neon gives you a generous free tier, branching for testing, and pairs
  cleanly with Vercel deployments.

If you ever outgrow this, Postgres scales far past what a small weighbridge
operation needs, so there's no real ceiling here.

## Setup

1. **Create a Neon project** at [neon.tech](https://neon.tech) and grab both
   connection strings from the dashboard (pooled + direct).

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Configure environment variables** — copy `.env.example` to `.env` and
   paste in your Neon connection strings:

   ```bash
   cp .env.example .env
   ```

4. **Push the schema to your database**

   ```bash
   npx prisma db push
   ```

5. **Run the dev server**

   ```bash
   npm run dev
   ```

   Visit `http://localhost:3000`.

6. **(Optional) Browse your data** with Prisma Studio:

   ```bash
   npm run db:studio
   ```

## Printing

The "Print Slip" button calls the browser's native print dialog. The page
CSS sets `@page { size: 220mm 140mm; margin: 0; }` so it lines up with your
slip stationery — in the print dialog, set paper size to "Custom" if your
printer driver doesn't pick this up automatically, and turn off any
"fit to page" scaling.

## Customizing the slip fields

- Fields live in `prisma/schema.prisma` (`Receipt` model). Add a column,
  run `npx prisma db push` again, then wire the new field into
  `components/ReceiptForm.tsx` (input) and `components/ReceiptPrint.tsx`
  (printed layout).
- The company header block (name, registration no., address, phone/fax) is
  hardcoded at the top of `components/ReceiptPrint.tsx` — edit the text
  directly there if the letterhead ever changes.

## Deploying

This deploys cleanly to Vercel:

1. Push this project to a GitHub repo.
2. Import it in Vercel, add the same `DATABASE_URL` / `DIRECT_URL` env vars.
3. Deploy — Vercel will run `npm install` (which runs `prisma generate`
   automatically via the `postinstall` script) and `npm run build`.

## Project structure

```
app/
  page.tsx                  New ticket entry (home page)
  receipts/page.tsx         Search + list past tickets
  receipts/[id]/page.tsx    View / reprint a single ticket
  api/receipts/route.ts     GET (list+filter), POST (create)
  api/receipts/[id]/route.ts GET, PUT, DELETE for one ticket
components/
  ReceiptForm.tsx           Data-entry form
  ReceiptPrint.tsx          Print-accurate slip layout
  SearchFilters.tsx         Filter controls for the records page
lib/
  prisma.ts                 Prisma client singleton
  serial.ts                 Random unique serial number generator
prisma/schema.prisma        Database schema
```
