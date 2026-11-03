# GreenLedger ESG & Carbon Accounting Platform

[![Next.js](https://img.shields.io/badge/Next.js-16.2.2-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![React](https://img.shields.io/badge/React-19.2.4-blue?style=for-the-badge&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue?style=for-the-badge&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-v4-38B2AC?style=for-the-badge&logo=tailwind-css)](https://tailwindcss.com/)
[![pnpm](https://img.shields.io/badge/pnpm-workspace-orange?style=for-the-badge&logo=pnpm)](https://pnpm.io/)
[![License](https://img.shields.io/badge/License-Proprietary-red?style=for-the-badge)](#)

---

## 1. Executive Overview

**GreenLedger** is an enterprise-grade SaaS platform built for audit-ready Greenhouse Gas (GHG) accounting, environmental disclosure, and cross-border regulatory compliance. Designed for industrial conglomerates, multi-site manufacturers, and multinational enterprises, GreenLedger streamlines the entire lifecycle of carbon data—from meter and invoice ingestion to verifiable, tamper-evident statutory disclosures.

### Key Regulatory & Standard Alignments
- **GHG Protocol Corporate Standard & Scope 3 Standard**: Comprehensive accounting across Scope 1 (direct combustion & process), Scope 2 (purchased electricity, heat, steam), and Scope 3 (15 upstream and downstream value chain categories).
- **EU CBAM (Carbon Border Adjustment Mechanism)**: Native support for European Union Regulation (EU) 2023/956 and Implementing Regulation 2023/1773, covering official communication templates across Sheet `A_InstData` and Sheet `B_EmInst`.
- **SEBI BRSR (Business Responsibility and Sustainability Reporting)**: Pre-configured reporting matrices for Indian statutory disclosures across Energy, Water, Waste, and Air pollutants.
- **IPCC 2006 Guidelines**: Embedded catalog of default Net Calorific Values (NCV), emission factors, and carbon oxidation factors for fossil and biogenic fuels.
- **ISO 14064-1 / 14064-3 Readiness**: Verifier sign-offs, evidence attachment linkage, and append-only forensic audit logging.

---

## 2. System Architecture

GreenLedger is engineered as a monorepo workspace leveraging the Next.js 16 App Router with React 19 Server and Client Components.

```
                              ┌───────────────────────────────────────────────┐
                              │            GreenLedger Architecture           │
                              └───────────────────────────────────────────────┘
                                                      │
                       ┌──────────────────────────────┴──────────────────────────────┐
                       ▼                                                             ▼
         ┌───────────────────────────┐                                 ┌───────────────────────────┐
         │     Public / Marketing    │                                 │    Authenticated Tenant   │
         │         (App Layer)       │                                 │          Software         │
         └─────────────┬─────────────┘                                 └─────────────┬─────────────┘
                       │                                                             │
        ┌──────────────┴──────────────┐                               ┌──────────────┴──────────────┐
        ▼                             ▼                               ▼                             ▼
  Landing Page                 Insights CMS                     Edge Middleware               Tenant Shell
  - Hero WebGL SoftAurora      - Educational Guides             (Session & Auth Gate)         - Responsive Sidebar
  - Interactive Frameworks     - Regulatory Updates             - Cookie Validation           - Facility Switcher
  - ROI / Cost Estimator       - Deep Dives                     - 401 Interceptors            - Active FY Selector
                                                                                                    │
                                      ┌─────────────────────────────────────────────────────────────┴────────────────┐
                                      ▼                              ▼                               ▼               ▼
                               Executive Dashboards          Scope 1 & 2 Activities              EU CBAM Suite    Scope 3 Value Chain
                               - Multi-Year Trends           - Fuel Ingestion (Stationary/Mobile)- Installation   - 15 Categories
                               - Gas Segregation Matrix      - Electricity & Renewable Tracking  - Source Streams - Spend & Activity Engines
                               - Energy Hierarchy & Mix      - Custom Fuels & Emission Factors   - Excel Pipeline - Document Evidence
```

### Monorepo & Package Structure
The application belongs to a workspace managed via `pnpm-workspace.yaml`:
- **`my-app`**: The primary tenant and enterprise frontend application (Next.js 16 App Router).
- **`packages/shared`**: Internal TypeScript package exportable across applications, providing unified API base URL resolution (`buildUrl`, `API_BASE_URL`).
- **`gl-admin`**: Administrative control center for platform super-administrators.

---

## 3. Technology Stack

| Layer | Technology | Description |
| :--- | :--- | :--- |
| **Framework** | **Next.js 16.2.2** | App Router, React Server Components (RSC), Turbopack compilation |
| **Runtime / UI** | **React 19.2.4** | Latest React primitives with production-enabled `babel-plugin-react-compiler` |
| **Language** | **TypeScript 5.x** | Strict typing across API contracts, domain models, and UI props |
| **Package Manager** | **pnpm** | Strict workspace dependency management and fast deterministic symlinking |
| **Styling** | **Tailwind CSS v4** | CSS variables-driven theming with `@tailwindcss/postcss` |
| **State Management** | **TanStack React Query v5** | Server-state caching, automatic background refetching, and optimistic mutations |
| **Local State** | **Zustand v5** | Ultra-lightweight reactive client stores (`sidebar-store`, `cookie-consent-store`) |
| **Visualizations** | **Recharts v3.8.1** | Responsive SVG charts (Sankey, Donut, Stacked Bar, Multi-axis Line) |
| **3D & Shaders** | **OGL v1.0.11** | High-performance WebGL shader animations (`SoftAurora`) for visual storytelling |
| **Animation** | **Framer Motion v12** | Layout transitions, animated KPI counters, modal mount sequences |
| **Form & Inputs** | **React Select & React Day Picker** | Accessible cascading select pickers, date-range selectors, custom calendars |
| **HTTP Client** | **Axios v1.15.0** | Configured with JWT interceptors, auto token eviction, and unified error wrappers |
| **Date Processing** | **Date-fns v4.3.0** | ISO date handling, fiscal calendar formatting, and timeline sorting |

---

## 4. Key Functional Modules

### 4.1 Authentication & Session Management
- **Token Dual-Storage**: Persisted securely in both browser `localStorage` and HTTP cookies (`AUTH_COOKIE_NAME`) with `SameSite=Lax` and protocol-aware `Secure` flags.
- **Edge Route Protection (`middleware.ts`)**: Intercepts requests to all internal tenant routes (`/dashboard`, `/tenant-cbam`, `/facilities`, `/emissions`, `/activities`, `/reporting-period`, `/team-members`, `/tenant`, `/brsr`, `/scope-3`, `/audit-logs`).
- **Auto-Eviction Interceptor**: Global Axios response interceptor detects `401 Unauthorized`, clears local storage and cookies, and redirects the user to `/login` with return URL preservation.
- **Tenant Initialization Flow**: New accounts are routed through `/initializing` to configure company metadata, baseline year, and industrial sector before accessing the workspace.

---

### 4.2 Facility & Organizational Hierarchy
- **Multi-Facility Topology**: Model complex organizations with parent facilities, operational boundaries, and geographically distributed sites.
- **Facility Sub-Units (`FacilitySubUnitsModal`)**: Granular segmentation into operational units (e.g., Boilers, Captive Power Plants, Kilns, Smelters, Administrative Blocks).
- **Geo-Tagging & Grid Mapping**: Latitude/longitude coordinates for location-based Scope 2 regional grid factors.
- **Active Facility Switching**: Dynamic global context lets users analyze site-specific metrics or consolidated corporate totals.

---

### 4.3 Reporting Periods
- **Fiscal Calendar Customization**: Set financial reporting periods (e.g., FY 2024–25, calendar year 2025).
- **Lifecycle Immutability State Machine**:
  - `OPEN`: Active data collection, manual/bulk ingestion, and modification.
  - `CLOSED`: Submissions locked; pending executive sign-off or external verification.
  - `LOCKED`: Tamper-proof, archived state. All mutations (`PUT`/`PATCH`/`DELETE`) are blocked at both client and API gateway levels.

---

### 4.4 Scope 1 & Scope 2 Activity Emissions

#### Fuel Consumption (`/activities/fuel`)
- **Stationary & Mobile Combustion**: Track fuels consumed in stationary equipment (furnaces, boilers, generators) and company-owned mobile fleets.
- **Bulk & Batch Ingestion (`/activities/fuel/bulk`)**: High-throughput tabular ingestion of utility bills, fuel delivery invoices, and fuel logs.
- **Custom Fuels & Emission Factors (`CustomFuelSection`)**: Overrides for bespoke fuel mixes, enabling custom Gross Calorific Value (GCV), Net Calorific Value (NCV), carbon content %, and oxidation factors.
- **Verification Workflow**:
  ```
  [ DRAFT ] ──(Submit)──> [ SUBMITTED ] ──(Auditor Review)──> [ VERIFIED ] (Locked)
                                  │
                                  └──(Reject with notes)───> [ REJECTED ]
  ```
  *Attempting to mutate or delete a `VERIFIED` record returns HTTP 400 with `ACTIVITY_IMMUTABLE`.*

#### Electricity Activities (`/activities/electricity`)
- **Grid vs. Renewable Tracking**: Separate tracking for national/regional grid electricity, captive solar/wind installations, and wheeling power Purchase Agreements (PPAs).
- **Market-Based vs. Location-Based Scope 2**: Compliant with GHG Protocol Scope 2 Guidance, tracking supplier-specific emission rates and Renewable Energy Certificates (RECs).
- **Transmission & Distribution (T&D) Losses**: Automated calculation of upstream grid losses feeding into Scope 3 Category 3.

---

### 4.5 Scope 3 (Value Chain) Accounting
GreenLedger provides complete coverage across all 15 categories defined by the GHG Protocol Corporate Value Chain (Scope 3) Standard:

| Category | Category Name | Methodology Supported | Key Data Inputs & Calculators |
| :--- | :--- | :--- | :--- |
| **Cat 1** | Purchased Goods & Services | Spend-based (US EPA USEEIO) | Currency normalization (INR/USD), margin deductions, economic input-output emission factors |
| **Cat 2** | Capital Goods | Spend-based & Asset classification | Capex expenditures, machinery acquisitions, building construction spend |
| **Cat 3** | Fuel- & Energy-Related Activities | Activity-based | Well-to-Tank (WTT) fuels, T&D losses for purchased electricity |
| **Cat 4** | Upstream Transportation & Distribution | Distance-based & Spend-based | Tonne-kilometres (tkm), road freight, rail freight, marine vessels, air cargo |
| **Cat 5** | Waste Generated in Operations | Mass & Disposal pathway | Landfill, open burning, incineration, closed-loop recycling, composting |
| **Cat 6** | Business Travel | Multi-modal travel calculator | Flight haul (short/medium/long), cabin class, radiative forcing, car rentals, hotel nights |
| **Cat 7** | Employee Commuting | Survey & Average-data method | Mode of transport (bus, metro, motorcycle, ICE car, EV), remote working days offset |
| **Cat 9** | Downstream Transportation | Distance & Logistics route | Outbound third-party shipping, warehouse storage energy |
| **Cat 15**| Investments | PCAF / Financed Emissions | Equity share, debt financing, asset management portfolio emissions |
| **Cat 1-15**| Dynamic Category Support | Custom Slugs (`[categorySlug]`) | Extensible architecture for industry-specific categories |

- **Scope 3 Document Evidence Vault (`documents`)**: Attach supplier declarations, shipping bills of lading, and verified supplier carbon foot-printing documents directly to activity records.

---

### 4.6 EU CBAM Compliance Suite (`/tenant-cbam`)

GreenLedger contains an implementation of the official **EU CBAM Communication Template**:

#### Sheet `A_InstData` (Installation Profile & Master Data)
- **Installation Profile**: Company name, facility address, UN/LOCODE, English name, geographic coordinates, and accredited verifier details.
- **Aggregated Goods Categories**: Automatic classification across the 6 CBAM sectors:
  - `IRON_AND_STEEL` (Crude steel, pig iron, iron ore pellets, finished bars, wire rod, tubes)
  - `ALUMINIUM` (Unwrought aluminium, aluminium alloys, extruded products, foil)
  - `CEMENT` (Cement clinker, grey cement, white cement)
  - `FERTILISERS` (Nitric acid, ammonia, urea, mixed NPK)
  - `CHEMICALS` (Hydrogen)
  - `ELECTRICITY`
- **8-Digit Combined Nomenclature (CN Codes)**: Cascading guided selector linking Category $\to$ Production Route $\to$ Product Name $\to$ Specification $\to$ Official 8-Digit CN Code.
- **Process Hierarchy**: Declarations for Production Processes (P1..P10), Produced Goods (G1..G10), and Purchased Precursors (PP1..PP20).

#### Sheet `B_EmInst` Section a (Source Streams & Calculations)
- **75 Dedicated Stream Slots**: Support for all fuel and material streams fueling CBAM processes.
- **Deterministic Calculation Engines**:
  - **Standard Combustion**:
    $$\text{Emissions } (\text{tCO}_2) = \text{Activity Data} \times \text{NCV} \times \text{Emission Factor} \times \text{Oxidation Factor} \times (1 - \text{Biomass Fraction})$$
  - **Mass Balance**:
    $$\text{Emissions } (\text{tCO}_2) = \text{Activity Data} \times \text{Carbon Content} \times 3.664$$
    *(using the official stoichiometric factor $\frac{44.01}{12.011} \approx 3.664$)*
- **Live Calculation Preview**: Real-time validation endpoint (`POST /source-streams/calculate-preview`) computes TJ energy and fossil/biogenic emissions before committing changes to the database.
- **IPCC Fuel Fallbacks**: Integrated IPCC emission factor picker for rapid parameter population.
- **Excel Export Pipeline**: Native OpenXML generation outputting official `.xlsx` files with formulas, sheet linking, and cell validation intact.

---

### 4.7 SEBI BRSR (Business Responsibility and Sustainability Reporting)
Specialized reporting views conforming to SEBI BRSR Core requirements:
- **BRSR Energy**: Renewable vs non-renewable fuel split, captive generation, grid purchases, total joules (GJ), and turnover-based energy intensity.
- **BRSR Water**: Withdrawal by source (surface water, groundwater, seawater, municipal), total water consumed, and volume recycled/reused.
- **BRSR Waste**: Hazardous vs non-hazardous waste generation, recovery operations (recycled, re-used, other recovery), and disposal breakdown (landfilling, incineration).
- **BRSR Air Pollutants**: Quantification of particulate matter (PM), sulfur dioxide (SOx), nitrogen oxides (NOx), carbon monoxide (CO), and volatile organic compounds (VOCs).

---

### 4.8 Executive Dashboards & Analytics
- **Executive Overview Dashboard (`/dashboard`)**:
  - Gross GHG Emissions (tCO₂e) split into Scope 1, Scope 2, and Scope 3.
  - Multi-year emissions trend analysis with baseline year comparison.
  - **Gas Segregation Matrix**: Deconstructs carbon inventory into individual greenhouse gases ($\text{CO}_2, \text{CH}_4, \text{N}_2\text{O}, \text{HFCs}, \text{PFCs}, \text{SF}_6, \text{NF}_3$).
  - Top 5 emission sources and site-level emission rankings.
- **Energy Dashboard (`/energy-dashboard`)**:
  - Fuel mix breakdown across boilers, furnaces, and captive power plants.
  - Energy Sankey/Hierarchy visualization illustrating energy flow from input fuel to end-use power.
  - Renewable energy percentage and progress toward RE100 targets.

---

### 4.9 Forensic Audit Trail & Immutability
- **Forensic Diff Viewer (`AuditForensicDiffModal`)**: Compares previous state versus new state for any updated entity, detailing changed fields, user ID, user agent, IP address, and timestamp.
- **Audit Categories**: `auth`, `data_action`, `system_event`, `compliance`, `security`.
- **Exportable Evidence**: Filter by module, actor, date range, or severity (`info`, `warning`, `critical`) for auditor hand-offs.

---

### 4.10 Public Landing Page & Insights CMS
- **Interactive Visual Storytelling**: Built with WebGL shaders (`SoftAurora`), framer-motion scroll-triggered reveals, and framework comparison carousels.
- **Educational Insights Engine (`/insights`, `/insights/[slug]`)**: In-depth articles covering carbon tax mechanisms, CSRD, CBAM updates, and ESG best practices with SEO metadata.

---

## 5. Complete Directory Tree

```
my-app/
├── app/                                # Next.js App Router root
│   ├── (app)/                          # Public auth route group
│   │   ├── login/                      # User authentication & token creation
│   │   │   └── page.tsx
│   │   └── register/                   # Organization & user registration
│   │       └── page.tsx
│   ├── (tenant)/                       # Authenticated tenant application
│   │   ├── layout.tsx                  # Shared tenant layout (theme, sidebar, topbar)
│   │   ├── activities/                 # Scope 1 & 2 activity root
│   │   │   ├── page.tsx
│   │   │   ├── electricity/            # Grid & renewable power ingestion
│   │   │   │   ├── page.tsx
│   │   │   │   └── create/page.tsx
│   │   │   └── fuel/                   # Fuel combustion activities
│   │   │       ├── page.tsx
│   │   │       ├── bulk/page.tsx       # Batch invoice & log upload
│   │   │       ├── create/page.tsx     # Single fuel activity entry
│   │   │       └── [id]/page.tsx       # Activity forensic detail & audit view
│   │   ├── audit-logs/                 # Forensic audit log explorer
│   │   │   └── page.tsx
│   │   ├── brsr/                       # SEBI BRSR compliance modules
│   │   │   ├── air/page.tsx            # Air pollutants (PM, NOx, SOx)
│   │   │   ├── energy/page.tsx         # Energy intensity & renewable split
│   │   │   ├── waste/page.tsx          # Hazardous & non-hazardous waste
│   │   │   └── water/page.tsx          # Withdrawal, consumption & recycling
│   │   ├── dashboard/                  # Executive ESG overview dashboard
│   │   │   └── page.tsx
│   │   ├── emissions/                  # Emissions summary & KPI views
│   │   ├── energy-dashboard/           # Deep-dive energy & captive power analytics
│   │   │   └── page.tsx
│   │   ├── facilities/                 # Site portfolio management
│   │   │   ├── page.tsx
│   │   │   └── create/page.tsx
│   │   ├── initializing/               # Post-signup tenant onboarding wizard
│   │   │   └── page.tsx
│   │   ├── reporting-period/           # Fiscal period definition & status locking
│   │   │   ├── page.tsx
│   │   │   └── create/page.tsx
│   │   ├── scope-3/                    # Scope 3 Value Chain platform
│   │   │   ├── page.tsx                # Scope 3 hub & category overview
│   │   │   ├── category-1/page.tsx     # Purchased Goods & Services (spend-based)
│   │   │   ├── category-2/page.tsx     # Capital Goods
│   │   │   ├── category-3/page.tsx     # Fuel & Energy-Related Activities
│   │   │   ├── category-4/page.tsx     # Upstream Transportation
│   │   │   ├── category-5/page.tsx     # Waste Generated in Operations
│   │   │   ├── category-6/page.tsx     # Business Travel
│   │   │   ├── category-7/page.tsx     # Employee Commuting
│   │   │   ├── category-9/page.tsx     # Downstream Transportation
│   │   │   ├── category-15/page.tsx    # Investments & Financed Emissions
│   │   │   └── [categorySlug]/page.tsx # Dynamic category route handler
│   │   ├── team-members/               # User management & RBAC assignments
│   │   │   ├── page.tsx
│   │   │   └── create/page.tsx
│   │   ├── tenant/                     # Organization profile & settings
│   │   │   └── page.tsx
│   │   ├── tenant-cbam/                # EU CBAM workspace
│   │   │   ├── page.tsx                # Executive overview & stream metrics
│   │   │   ├── catalog/page.tsx        # Cascading CN code & goods catalog
│   │   │   ├── installation/page.tsx   # Sheet A installation setup
│   │   │   └── source-streams/page.tsx # Sheet B source stream management
│   │   └── user/                       # User profile & preferences
│   │       └── page.tsx
│   ├── api/media/                      # Next.js media optimization stream routes
│   │   ├── cbam/route.ts
│   │   ├── green-earth/route.ts
│   │   ├── industry-animation/route.ts
│   │   ├── landing-intro/route.ts
│   │   └── logo-animation/route.ts
│   ├── insights/                       # Public insights CMS
│   │   └── [slug]/page.tsx
│   ├── 404/page.tsx                    # Custom fallback not-found view
│   ├── globals.css                     # Tailwind v4 styles & theme design tokens
│   ├── layout.tsx                      # Root HTML layout with font bindings
│   ├── not-found.tsx                   # Global 404 handler
│   └── page.tsx                        # Public marketing homepage
├── assets/                             # Static brand assets, diagrams & illustrations
├── components/                         # Modular component library
│   ├── activity/                       # Fuel & electricity tables, detail modals
│   ├── audit-logs/                     # Timeline views, filter bars, diff modals
│   ├── auth/                           # Login and registration form components
│   ├── brsr/                           # BRSR Air, Energy, Waste, and Water modals
│   ├── cbam/                           # CBAM guided catalog, installation form, stream modal
│   ├── dashboard/                      # KPI cards, Recharts visualizations, gas matrix
│   ├── designs/                        # WebGL shaders (SoftAurora) and UI canvases
│   ├── facility/                       # Facility portfolio tables and subunit modals
│   ├── icons/                          # SVG icons and Google Material Symbol wrappers
│   ├── insights/                       # Editorial layouts for insights articles
│   ├── landing/                        # Hero, framework grid, feature carousel, pricing
│   ├── layout/                         # TenantShell, TopBar, Sidebar, and navigation config
│   ├── providers/                      # TanStack QueryClientProvider & ThemeProvider
│   ├── reportingPeriod/                # Reporting period tables and creation forms
│   ├── scope3/                         # Scope 3 category calculators and document drawers
│   ├── teamMembers/                    # Team invitation and permission management
│   ├── tenantProfile/                  # Organization settings summary components
│   └── ui/                             # Buttons, inputs, modals, cards, tabs, badges
├── context/                            # Integration guides and domain specifications
│   ├── CBAM_api_guide.txt              # Complete EU CBAM backend integration manual
│   └── scope3_api_guide.txt            # Scope 3 backend specification & calculations
├── lib/                                # Domain logic, API clients, and React Query hooks
│   ├── activity/                       # Fuel/Electricity API calls, queries, mutations
│   ├── audit-logs/                     # Forensic audit API bindings and diff formatters
│   ├── auth/                           # Auth cookies, tokens, and storage helpers
│   ├── brsr/                           # BRSR reporting endpoints and response types
│   ├── cbam/                           # CBAM catalog, installation, and stream hooks
│   ├── customFuel/                     # Custom emission factor hooks
│   ├── dashboard/                      # Aggregated metric queries and chart formatters
│   ├── facility/                       # Facility and sub-unit API services
│   ├── http/                           # Axios client with request/response interceptors
│   ├── reportingPeriods/               # Reporting period hooks and mutations
│   ├── scope3/                         # Categorized Scope 3 services (Cat 1 to 15)
│   ├── teamMembers/                    # RBAC and user team endpoints
│   ├── tenantProfile/                  # Tenant metadata queries
│   └── utils/                          # `cn` helper, error parser, cookie utilities
├── packages/                           # Internal workspace packages
│   └── shared/                         # Shared URL resolution and constants
│       ├── index.ts
│       └── package.json
├── public/                             # Public static assets (favicons, fonts, media)
├── stores/                             # Zustand state stores
│   ├── cookie-consent-store.ts         # User cookie banner consent state
│   └── sidebar-store.ts                # Sidebar collapse/expanded drawer state
├── middleware.ts                       # Next.js edge route protection & auth gate
├── next.config.ts                      # Turbopack, React compiler, and image optimization
├── package.json                        # Root dependencies and build scripts
├── pnpm-lock.yaml                      # Deterministic dependency lockfile
├── pnpm-workspace.yaml                 # Monorepo configuration
└── tsconfig.json                       # TypeScript compiler options
```

---

## 6. API Architecture & Backend Contracts

GreenLedger uses a RESTful API with standardized JSON response envelopes.

### Standard Response Envelope
All API endpoints return responses in this unified structure:

```json
{
  "success": true,
  "status_code": 200,
  "message": "Operation completed successfully",
  "data": { ... },
  "error": null,
  "method": "POST",
  "path": "/api/v1/tenant/cbam/installation/...",
  "timestamp": "2026-11-03T10:00:00.000Z"
}
```

### Key API Service Endpoints

#### Authentication & Organization
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/api/v1/auth/login` | Authenticate user, receive JWT Bearer token |
| `POST` | `/api/v1/auth/register` | Register new organization and tenant admin |
| `GET` | `/api/v1/tenant/profile` | Retrieve active tenant organization metadata |
| `PUT` | `/api/v1/tenant/profile` | Update company registration and sector classification |

#### Facilities & Reporting Periods
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/v1/tenant/facilities` | List all operational facilities |
| `POST` | `/api/v1/tenant/facilities` | Register new production site or facility |
| `GET` | `/api/v1/tenant/facilities/{id}/sub-units` | List sub-units (boilers, kilns, production lines) |
| `GET` | `/api/v1/tenant/reporting-periods` | List all fiscal and calendar reporting periods |
| `POST` | `/api/v1/tenant/reporting-periods` | Create a new reporting period |

#### Scope 1 & Scope 2 Activities
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/v1/tenant/activities/fuel` | List fuel activities with filter by facility & period |
| `POST` | `/api/v1/tenant/activities/fuel` | Record stationary or mobile fuel consumption |
| `POST` | `/api/v1/tenant/activities/fuel/bulk` | Bulk ingestion of fuel logs and invoice records |
| `GET` | `/api/v1/tenant/activities/electricity` | List electricity consumption entries |
| `POST` | `/api/v1/tenant/activities/electricity` | Record grid or captive electricity consumption |
| `GET` | `/api/v1/tenant/custom-fuels` | List tenant-defined custom fuels and factors |
| `POST` | `/api/v1/tenant/custom-fuels` | Register custom fuel with specific NCV and emission factor |

#### Scope 3 Value Chain
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/v1/tenant/scope3/category1/spend` | List Cat 1 spend-based activities |
| `POST` | `/api/v1/tenant/scope3/category1/spend` | Calculate & store Cat 1 emissions via USEEIO factors |
| `GET` | `/api/v1/tenant/scope3/category3/wtt` | Upstream Well-to-Tank (WTT) fuel activities |
| `GET` | `/api/v1/tenant/scope3/category4/freight` | Upstream freight transport entries |
| `GET` | `/api/v1/tenant/scope3/category5/waste` | Operational waste activity records |
| `GET` | `/api/v1/tenant/scope3/category6/travel` | Multi-modal business travel records |
| `GET` | `/api/v1/tenant/scope3/category7/commute` | Employee commute calculations |
| `POST` | `/api/v1/tenant/scope3/documents` | Upload verification documents & vendor invoices |

#### EU CBAM Integration
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/v1/tenant/cbam/catalog/categories` | List 6 CBAM aggregated goods categories |
| `GET` | `/api/v1/tenant/cbam/catalog/categories/{id}/routes` | Production routes for a CBAM category |
| `GET` | `/api/v1/tenant/cbam/catalog/cn-codes` | Search 8-digit Combined Nomenclature codes |
| `GET` | `/api/v1/tenant/cbam/catalog/ipcc-fuels` | Search IPCC fallback fuel emission factors |
| `GET` | `/api/v1/tenant/cbam/installation` | Get active CBAM installation profile (Sheet A) |
| `POST` | `/api/v1/tenant/cbam/installation` | Create or update CBAM installation profile |
| `GET` | `/api/v1/tenant/cbam/installation/{id}/source-streams` | List all source streams (Sheet B Section a) |
| `POST` | `/api/v1/tenant/cbam/installation/{id}/source-streams` | Add stream and compute emissions |
| `POST` | `/api/v1/tenant/cbam/installation/{id}/source-streams/calculate-preview` | Live calculation preview without saving |
| `GET` | `/api/v1/tenant/cbam/installation/{id}/export-excel` | Generate and download official CBAM `.xlsx` |

#### Audit Logs & Forensic Diff
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/api/v1/tenant/audit/trails` | Timeline view of all system, compliance, and data events |
| `GET` | `/api/v1/tenant/audit/logs` | Deep forensic view with field-level before/after JSON diffs |

---

## 7. Configuration & Environment Variables

Create a `.env` file in the root of `my-app/` based on the following reference:

```env
# ==============================================================================
# GreenLedger ESG Client - Environment Configuration
# ==============================================================================

# Backend REST API Base URL
# Local Development:
NEXT_PUBLIC_BASE_URL=http://localhost:8080/api/v1

# Staging Environment:
# NEXT_PUBLIC_BASE_URL=https://dev.greenledgeresg.com/api/v1

# Production Environment:
# NEXT_PUBLIC_BASE_URL=https://api.greenledgeresg.com/api/v1
```

### Next.js Configuration (`next.config.ts`)
- **React Compiler**: Dynamically enabled for production builds (`NODE_ENV === "production"`) to eliminate dev-mode compilation overhead while delivering fine-grained memoization in production.
- **Transpiled Packages**: `@greenledger/shared` is natively transpiled by Next.js from within the monorepo workspace.
- **Image Optimization**: Remote domains allowed for avatar and media hosting (`lh3.googleusercontent.com`), serving high-efficiency modern image formats (`image/avif`, `image/webp`).
- **Turbopack Package Optimization**: Package imports for `framer-motion`, `recharts`, `react-icons`, `date-fns`, `react-select`, and `ogl` are pre-bundled to accelerate hot module replacement (HMR).

---

## 8. Development & Workflow Guide

### Prerequisites
- **Node.js**: `v20.x` or higher LTS
- **pnpm**: `v9.x` or higher (`corepack enable && corepack prepare pnpm@latest --activate`)

> [!IMPORTANT]
> **Strict Package Manager Rule**: Per workspace policy, always use `pnpm` for all script executions and package installations. Never run `npm` or `yarn`.

### 1. Installation
Install workspace dependencies:
```bash
pnpm install
```

### 2. Local Development Server
Start the Next.js development server with Turbopack:
```bash
pnpm dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 3. Type Checking
Perform strict TypeScript compilation checks across all routes and components:
```bash
pnpm run typecheck
```

### 4. Code Linting
Run ESLint 9 checks to verify code quality and rule compliance:
```bash
pnpm run lint
```

### 5. Production Build
Build the application with Turbopack and the React Compiler:
```bash
pnpm run build
```

### 6. Production Preview
Launch the optimized production build locally:
```bash
pnpm start
```

---

## 9. Security, Governance & Verification

1. **Tamper-Evident Immutability**:
   Once an activity record or reporting period transition reaches `VERIFIED` or `LOCKED`, client modification controls are disabled, and backend attempts to modify or delete the record result in HTTP 400 rejection (`IMMUTABLE_RECORD`).
2. **Role-Based Access Control (RBAC)**:
   - `Admin`: Full organizational control, facility creation, user assignment, and billing.
   - `Manager`: Activity approvals, reporting period locking, custom fuel creation.
   - `Submitter`: Data entry, invoice uploading, draft creation, and batch submission.
   - `Auditor`: Read-only access to forensic audit logs, evidence attachments, and emission calculation chains.
   - `Viewer`: Read-only access to executive dashboards.
3. **Audit Evidence Preservation**:
   All files uploaded to the Scope 3 or Scope 1/2 evidence repositories are linked to records with SHA checksums and user attribution metadata.
4. **Cookie Security**:
   Session tokens are saved with `SameSite=Lax` and conditional `Secure` flags, mitigating cross-site request forgery (CSRF) risks while ensuring reliable server-side middleware verification.

---

## 10. Contributing & Coding Guidelines

- **Next.js Conventions**: This project uses Next.js 16 with Turbopack. When authoring new components or pages, consult `node_modules/next/dist/docs/` for updated App Router standards.
- **Client vs. Server Components**: Mark interactive components (using hooks, state, or browser APIs) explicitly with `"use client";`. Keep layout scaffolding and data wrappers as Server Components wherever possible.
- **Icon Standardization**: Use the centralized `@/components/icons/MaterialIcon` component or `@material-symbols/font-400` to maintain iconography consistency across views.
- **Utility Styling**: Combine Tailwind utility classes using the `cn(...)` helper located at `@/lib/utils/cn` to resolve class name conflicts predictably.
- **Error Handling**: Standardize API error notifications using the `getErrorMessage` utility from `@/lib/utils/error`.

---

## 11. License

Copyright © 2026 GreenLedger ESG Inc. All rights reserved.
Unauthorized copying, modification, or distribution of this software and its associated documentation is strictly prohibited.
