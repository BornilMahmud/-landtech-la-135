# SetuLand (সেতু-ল্যান্ড)
### Smart e-Mutation & Unified Registry Engine
**LandTech 2026 Innovation Hackathon — Track P4: Digital Land Records, Verification & Digitization**

[![Next.js 14](https://img.shields.io/badge/Next.js-14.2-black?style=flat&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue?style=flat&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=flat&logo=tailwind-css)](https://tailwindcss.com/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![LandTech 2026](https://img.shields.io/badge/Hackathon-LandTech_2026_Track_P4-006a4e)](https://land.gov.bd)

---

## 🏛️ Executive Summary

In Bangladesh, deed registration at the **Sub-Registry Office** (Ministry of Law) and record mutation at the **AC Land Office** (Ministry of Land) operate in disconnected silos. This creates a dangerous 45-to-180 day gap where land remains in the seller's name on official Khatians (Porcha), enabling **fraudulent double-selling**, transfer of mortgaged properties, and millions of costly court battles.

**SetuLand (সেতু-ল্যান্ড)** solves **Problem P4** by creating a unified, zero-touch bridge:
1. **Automated 5-Point Consensus Verification:** Audits ownership, 4-stage title chain (CS -> SA -> RS -> BS), available area, bank liens, and court stays in 1 click before deed execution.
2. **Instant Anti-Double-Selling Escrow Lock:** The second a deed is registered, the transferred decimals are digitally locked on the parent Khatian. Any attempt to sell those decimals again is hard-blocked!
3. **Zero-Touch e-Mutation Trigger:** Registers the deed, generates a cryptographic **SHA-256 signature**, and auto-pushes the case into the AC Land queue (`status: AUTO_INITIATED`) with zero paperwork or separate applications required from citizens.
4. **Automated Khatian Splitting:** When AC Land approves, decimals are deducted from the seller and a **Brand-New Digital Khatian (Porcha)** row (e.g., `BS-1001/A`) is created for the buyer with a fresh SHA-256 seal.
5. **Interactive DLRS Cadastral Mouza Map:** SVG cadastral parcel polygons dynamically color-coded:
   - 🟢 **Emerald Green:** Clean Title (Ready for sale)
   - 🟠 **Amber Orange:** Partial Decimals Locked in Pending e-Mutation
   - 🔴 **Crimson Red:** Blocked (Bank Mortgage, Court Stay, or DC Land Acquisition)
6. **Live Cryptographic Tamper Simulator:** Prove forgery detection by simulating manual changes to deed decimals or owner names, witnessing immediate SHA-256 hash mismatch rejection.
7. **DC Office Land Acquisition & Compensation Calculator (Rulebook Section 4):** Validates genuine owners and calculates statutory compensation with automatic bank mortgage deductions into escrow.

---

## ⚡ Zero-Config Quick Start (Run Locally in 60 Seconds)

SetuLand is engineered to run 100% out-of-the-box with **zero external API keys or cloud dependencies**. All state is managed via a persistent React Context + `localStorage` engine pre-seeded with rich synthetic dummy data.

```bash
# 1. Clone the repository
git clone https://github.com/your-username/setuland-smart-emutation.git
cd setuland-smart-emutation

# 2. Install dependencies
npm install

# 3. Start local development server
npm run dev

# 4. Open in browser
# Visit http://localhost:3000
```

### Production Build
```bash
npm run build
npm run start
```

---

## 🧑‍⚖️ 60-Second Judge Quick Tour (Role Switcher Guide)

Use the sleek **Judge Role Switcher Bar** at the top of the application to test all perspectives:

### 1. Sub-Registrar Office (`/` ➔ Sub-Registrar Tab)
* Use the **1-Click Test Scenarios** buttons in the header:
  - **Scenario 1 (Clean Title):** Select Plot 1 (`BS-1001`), click *"Run 5-Point Verification"*, verify all green ticks, and click *"Register Deed & Auto-Trigger e-Mutation"*. Inspect the official digital deed receipt with embedded SVG QR Code!
  - **Scenario 2 (Double-Selling):** Select Plot 2 (`BS-1002`). Notice 7 of 10 decimals are already locked. Attempting to sell 5 decimals triggers a dramatic red **"DOUBLE-SELLING FRAUD BLOCKED"** modal!
  - **Scenario 3 (Bank Mortgage):** Select Plot 3 (`BS-1003`). Triggers **"ACTIVE BANK MORTGAGE BLOCKED"** modal.
  - **Scenario 4 (Court Injunction):** Select Plot 4 (`BS-1004`). Triggers **"JUDICIAL INJUNCTION BLOCKED"** modal.
* Notice the real-time **Unified Fee Calculator** itemizing Stamp Duty (1.5%), Reg Fee (1.0%), Local Tax (3.0%), Gain Tax (2.0%), and the bundled BDT 1,170 e-Mutation fee.

### 2. AC Land Office (AC Land Tab)
* View the incoming e-Mutation queue (containing cases automatically received from the Sub-Registry).
* Select a case and inspect the linked deed, parent Khatian, and transfer decimals.
* Click **"Step 1: Verify Union Land (Tahsil) Report"** (`TAHSIL_VERIFIED`).
* Click **"Step 2: Approve e-Mutation & Split Khatian"** (`MUTATION_APPROVED`).
* Watch celebratory confetti fire and inspect the newly generated **Digital Khatian (Porcha)** row issued to the buyer!

### 3. Citizen & Buyer Portal (Citizen Tab)
* **Tab A (Live Mutation Tracker):** Enter any Tracking ID (e.g., `MUT-2026-5001`) or click a test button to see the 5-stage progress journey. Print or download the official Porcha when approved.
* **Tab B ("Check Before You Buy"):** Select any plot to inspect Total Area, Locked Area, Net Available Area, Bank Liens, Court Stays, and full 4-generation unbroken CS -> SA -> RS -> BS title lineage!

### 4. Bank, Court & DC Office Controller (Bank/Court Tab)
* Toggle **"Bank Mortgage Lock"** or **"Court Injunction"** ON/OFF in real time.
* Switch back to Sub-Registrar to verify the instant cross-registry block.
* Test the **DC Office Compensation Calculator** to disburse public project compensation while automatically deducting bank liens.

### 5. DLRS Cadastral Mouza Map (Mouza Map Tab)
* View interactive SVG cadastral parcels for Savar & Ashulia.
* Click any polygon to inspect plot details and jump directly to deed registration or citizen inspection.

### 6. Cryptographic Tamper Simulator (Tamper Test Tab)
* Select any registered Deed.
* Click **"⚡ Simulate Forgery"** to tamper with the document's decimals.
* Observe the live side-by-side SHA-256 hash comparison instantly alert: **"⚠️ CRYPTOGRAPHIC INTEGRITY VIOLATION: FORGERY REJECTED"**.
* Click **"Restore Authentic Ledger State"** to verify cryptographic consensus restoration.

---

## 📊 Pre-Seeded Synthetic Dataset (100% Synthetic Dummy Data)

| Plot ID | Khatian No | Dag No | Mouza | Total Decimals | Locked Decimals | Status / Demo Scenario |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| `plot-1` | `BS-1001` | `405` | Savar | 12.00 Dec | 0.00 Dec | **Clean Title.** Ready for valid sale and auto-mutation demo. Owner: Karim Mia (`DUMMY-NID-2026-1001`). |
| `plot-2` | `BS-1002` | `512` | Ashulia | 10.00 Dec | **7.00 Dec** | **Double-Selling Prevention.** 7 decimals already locked in `MUT-2026-5001`. Selling 5 decimals triggers fraud alert! Owner: Abdul Jabbar (`DUMMY-NID-2026-1002`). |
| `plot-3` | `BS-1003` | `209` | Dhamrai | 8.00 Dec | 0.00 Dec | **Bank Mortgage Lien.** Active mortgage with Sonali Bank PLC (BDT 4,500,000). Triggers mortgage block! Owner: Rahima Begum (`DUMMY-NID-2026-1003`). |
| `plot-4` | `BS-1004` | `881` | Gazipur | 15.00 Dec | 0.00 Dec | **Civil Court Injunction.** Active stay order in Case #`DUMMY-CIV-404`. Triggers judicial dispute block! Owner: Nurul Islam (`DUMMY-NID-2026-1004`). |

---

## 🗄️ Relational Database Schema (`database/schema.sql`)

The application state directly mirrors a production **PostgreSQL 15+ / Supabase** schema located in `database/schema.sql`:
* `mouzas`, `khatians`, `chain_of_title`
* `bank_mortgages`, `court_injunctions`, `dc_acquisitions`
* `deeds`, `emutations`, `emutation_workflow_steps`, `audit_ledger`
* **Automated Database Triggers:**
  - `trg_enforce_anti_double_selling()`: Raises exception if `transferArea > (totalArea - lockedArea)` or if liens exist.
  - `trg_lock_decimals_on_deed()`: Automatically updates `locked_area_decimals` on deed execution.
  - `trg_execute_khatian_split()`: Automatically deducts decimals and marks deeds mutated upon AC Land approval.

---

## ⚠️ Hackathon Compliance Notice

* **Compliance Mode:** In accordance with LandTech 2026 rules, this application operates strictly with **100% Synthetic Dummy Data**.
* **Zero Real Personally Identifiable Information:** All names, National IDs (`DUMMY-NID-2026-XXXX`), phone numbers (`01700-00000X`), and land records are synthetic mock representations.
* **Top Banner:** A persistent compliance banner is present throughout the entire user interface.

---

## 🤖 Disclosure of AI Tools Used

In accordance with LandTech 2026 Hackathon Rulebook transparency guidelines:
* **AI Tool Employed:** Google DeepMind Antigravity (Advanced Agentic AI Coding Assistant).
* **Scope of Assistance:** Acceleration of TypeScript definitions, full-stack Next.js component creation, Tailwind layout styling, and PostgreSQL trigger drafting.
* **Human Engineering:** System architecture, legal workflow alignment with the Registration Act 1908 and State Acquisition and Tenancy Act 1950, anti-double-selling logic, and test cases were designed and validated by the hackathon engineering team.

---

## 🎨 GovTech Trust + Civic Emerald Design System Overhaul

* **Palette:** Sovereign Emerald (`#064E3B`), Action Mint (`#059669`), Pending Amber (`#F59E0B`), Fraud Block Crimson (`#E11D48`), and Institutional Slate (`#0F172A`).
* **Bilingual Hierarchy:** Integrated Google Font `Hind Siliguri` for Bengali typography paired with `Inter` and `JetBrains Mono` (`tabular-nums` for land decimals, NIDs, and hashes).
* **Segmented Linear-Style Role Switcher:** Floating glass pill bar with smooth active states and live pending/blocked badge counts.
* **Executive KPI Ribbon:** 4 compact real-time metric cards (Total Verified Plots, Area Locked in Mutation, Queued e-Mutations, and Blocked Fraud Attempts).
* **Interactive 5-Point Radar:** Diagnostic pipeline with connected horizontal lineage nodes, stacked area progress bar, subtle card shake on rejection, and forensic alert banners.
* **Smart Land Certificate Authenticity:** Guilloche geometric backgrounds, official emerald double borders, embedded high-contrast QR codes, copyable SHA-256 seals, and clean 1-page PDF print output.
* **Citizen "Pizza-Tracker" Stepper:** Glowing 5-stage progress journey with responsible office badges and live Before-vs-After Khatian Split comparison card.

---

## 📜 Changelog

### v1.1.0 (UI/UX Design System Overhaul — @ui-ux-pro-max & @impeccable)
* Implemented GovTech Trust + Civic Emerald visual design system.
* Added Executive KPI Ribbon directly below header with real-time reactive metrics.
* Upgraded Sub-Registrar view with 1-Click Judge Demo Scenarios and connected lineage nodes.
* Redesigned Citizen Portal with horizontal glowing 5-Stage "Pizza-Tracker" and Before-vs-After Khatian Split card.
* Upgraded DLRS Mouza Map with CAD/GIS coordinate grid, compass, and zoom toolbar.
* Enhanced Digital Deed and Porcha modals with authentic guilloche pattern backgrounds and copyable SHA-256 seals.

### v1.0.0 (Hackathon Release — LandTech 2026)
* Initial prototype submission for Track P4: Smart e-Mutation & Registry.
* Single-page 4-role switcher navigation bar.
* 5-point consensus verification engine.
* Automated anti-double-selling escrow locks.
* AC Land 2-step automated mutation queue and Khatian splitting.
* Citizen live 5-stage progress tracker and "Check Before You Buy" parcel inspector.
* Bank mortgage lien and court stay toggle controller.
* Interactive DLRS Cadastral Mouza Map (SVG color-coded polygons).
* Live Cryptographic Tamper Simulator with SHA-256 side-by-side mismatch detection.
* DC Office Land Acquisition and statutory compensation calculator (Section 4 coverage).
* Full bilingual `English | বাংলা` switcher.
* High-contrast official PDF printing with `"SYNTHETIC DUMMY RECORD — LANDTECH 2026"` watermark.

---
# -landtech-la-135
