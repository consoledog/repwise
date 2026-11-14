# Repwise — Vercel deployment cheat sheet

Radni folder: `/Users/aleksandarkomazec/Documents/freelance_projects/repwise`.
GitHub repo: `consoledog/repwise`. Predviđena produkcijska grana: `main`.

## 1. Jednokratna provera Vercel projekta

Otvori Vercel dashboard i izaberi postojeći Repwise projekat.

- Settings → Git: proveri da je povezan repo `consoledog/repwise`.
- Settings → Environments → Production → Branch Tracking: proveri da se prati `main`.
- Framework Preset: Next.js.
- Root Directory: koren GitHub repozitorijuma, gde je `package.json` (`.` / podrazumevana vrednost).
- Install Command: podrazumevana vrednost ili `npm ci`.
- Build Command za postojeći projekat: `npm run build`.
- Output Directory: podrazumevana Next.js vrednost.

Push na povezanu produkcijsku granu pokreće produkcijski deploy. Ostale grane služe za Preview deploye. [Vercel Git dokumentacija](https://vercel.com/docs/git)

U Settings → Environment Variables, za Production, treba da postoje:

| Varijabla               | Namena                                                                 |
| ----------------------- | ---------------------------------------------------------------------- |
| `DATABASE_URL`          | Konekcija sa produkcijskim PostgreSQL-om                               |
| `AUTH_SECRET`           | Tajna za autentikaciju; zadrži postojeću vrednost pri redovnom deployu |
| `AUTH_TRUST_HOST`       | `true`                                                                 |
| `BLOB_READ_WRITE_TOKEN` | Vercel Blob upload                                                     |

`REPWISE_SEED_USER_*` služe našoj seed skripti za kreiranje ili promenu naloga. Login proverava email i hash lozinke iz tabele `User`.

## 2. Lokalna provera pre svakog deploya

```bash
cd /Users/aleksandarkomazec/Documents/freelance_projects/repwise
git branch --show-current
git status --short
```

Za direktan produkcijski deploy ovim Git postupkom treba da budeš na `main`.
Ako radiš na feature grani, uradi Preview i spoji je u `main` nakon provere.

Na novom checkout-u ili nakon promene zavisnosti:

```bash
npm ci
```

Pokreni provere i nastavi tek kada sve prođu:

```bash
npm run type-check
npm run lint
npm run test:run
npm run build
```

Workout integracioni testovi se pokreću posebno, uz lokalni migrirani Docker PostgreSQL:

```bash
docker compose up -d postgres
TEST_DATABASE_URL='postgresql://postgres:postgres@localhost:5432/repwise?schema=public' npm run test:run -- tests/workouts/database.test.ts
```

## 3. Commit i push

Pregledaj promene, pa dodaj relevantne putanje. Sledeći `git add` je primer za workout izmene; prilagodi listu stvarnim promenama:

```bash
git diff
git add -- app features/workouts tests/workouts README.md IMPLEMENTATION_PLAN.md
git diff --cached
git commit -m "feat(workouts): describe the change"
git push origin main
```

Za izmene u `lib`, `components`, Prisma migracijama ili konfiguraciji dodaj i te putanje.
U staging uključi i `package.json` i `package-lock.json` kada se menjaju zavisnosti.
Za ovaj dokument koristi `git add -- DEPLOYMENT_CHEATSHEET.md`.
`.env*`, `.vercel/`, `node_modules/`, `.next/` i lokalna `.idea/` podešavanja ostaju van commita.

Ako je implementacija već commitovana, dovoljan je `git push origin main`.
Poruka `Everything up-to-date` znači da nema novih commitova za slanje; tada proveri Vercel deployment i Git povezivanje.

## 4. Proveri rezultat na Vercelu

1. Otvori Repwise → Deployments.
2. Izaberi deploy pokrenut za novi commit na `main`.
3. Proveri da je okruženje Production i da commit odgovara izlazu `git log -1 --oneline`.
4. Sačekaj status Ready i proveri da deployment služi produkcijski domen (Current / Production Deployment).
5. Ako build padne, otvori Build Logs tog deploymenta i proveri prvu stvarnu grešku.
6. Otvori produkcijski domen i proveri prijavu, biblioteku vežbi i novu funkcionalnost.

Za Phase 7 proveri `/workouts` → New workout → izbor vežbi → ciljevi → Save draft → Edit → Planned sa datumom → Save changes.
Proveri i broj treninga na dashboardu. Koristi podatke koje možeš zadržati kao svoj prvi trening.

## 5. Kada se menja baza

Phase 7 koristi postojeću šemu, pa za nju nije potrebna nova migracija.
Postojeći `npm run build` izvršava `prisma generate` i `next build`; ne primenjuje migracije.

Za buduću izmenu `prisma/schema.prisma`, kreiraj i proveri migraciju lokalno:

```bash
npm run prisma:migrate -- --name describe_schema_change
git add -- prisma
```

Primenu commitovanih migracija uključi u deployment pipeline za ciljnu bazu, pre pokretanja novog koda:

```bash
npm run prisma:deploy
```

Za ovaj mali projekat to može biti Build Command na Vercelu:

```bash
npm run prisma:deploy && npm run build
```

To je opcija za buduće podešavanje, nije promena već primenjena ovim cheat sheetom. Pre uključivanja proveri da Production i Preview imaju odgovarajući `DATABASE_URL`. Ako isti build command važi za Preview, koristi zasebnu Preview bazu. Migracije treba da ostanu kompatibilne sa trenutno aktivnim kodom tokom builda. [Prisma v6 deployment dokumentacija](https://docs.prisma.io/docs/orm/v6/prisma-client/deployment/deploy-database-changes-with-prisma-migrate)

`prisma migrate dev` koristi se lokalno, a `prisma migrate deploy` za produkciju. Nemoj koristiti `prisma migrate reset` nad produkcijom.
`npm run db:seed` nije deo redovnog deploya: naša skripta može da zameni lozinke postojećih naloga.

## 6. Kada se menjaju environment varijable

1. Repwise → Settings → Environment Variables.
2. Dodaj ili izmeni varijablu za Production.
3. Pokreni novi deploy: novim pushom ili preko Deployments → izaberi odgovarajući deployment → ⋯ → Redeploy.

Promena varijable važi za nove deploye. Redeploy izabranog deploymenta ponovo gradi njegov kod; proveri commit da ne objaviš stariju verziju. [Vercel environment dokumentacija](https://vercel.com/docs/environment-variables/managing-environment-variables), [redeploy dokumentacija](https://vercel.com/docs/deployments/managing-deployments)

Promena `REPWISE_SEED_USER_*` varijabli sama po sebi ne menja lozinku u bazi.

## 7. Ručni deploy preko CLI-ja

Koristi ga kao alternativu Git deployu. Iz projektnog foldera, kada je potrebno prijavljivanje i povezivanje:

```bash
npx vercel login
npx vercel link
```

Pri povezivanju izaberi postojeći Repwise projekat i odgovarajući Vercel nalog/tim.
Ovaj checkout već ima lokalni `.vercel/project.json`; zadrži postojeće povezivanje ako je ispravno.

Produkcija:

```bash
npx vercel --prod
```

Preview postojećeg projekta:

```bash
npx vercel
```

CLI deployuje lokalni sadržaj foldera. Commituj i pošalji iste izmene u Git radi evidencije. Za jedan release izaberi Git ili CLI putanju da ne pokrećeš nepotrebne duple deploye. [Vercel CLI dokumentacija](https://vercel.com/docs/cli/deploy)

## 8. Ako nova verzija pravi problem

Ako build nije uspeo, proveri Build Logs; obično prethodna uspešna verzija nastavlja da služi domen.
Ako je problem u već objavljenom kodu, otvori Production Deployment → Instant Rollback i potvrdi prethodni deploy. Hobby plan podržava vraćanje na neposredno prethodni produkcijski deploy.

Rollback vraća aplikacioni deploy; bazu i promene podataka rešavaš zasebno. Posle Instant Rollback-a Vercel zaustavlja automatsko dodeljivanje produkcijskih domena novim deployima. Nakon popravke koristi Manage / Promote odgovarajućeg deploymenta da ponovo uključiš normalan tok. [Vercel rollback dokumentacija](https://vercel.com/docs/instant-rollback)
