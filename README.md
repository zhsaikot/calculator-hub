# 🧮 CalcHub – All-in-One Online Calculator Suite

[![GitHub Actions CI/CD](https://github.com/zhsaikot/calculator-hub/actions/workflows/deploy.yml/badge.svg)](https://github.com/zhsaikot/calculator-hub/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)
[![Vite](https://img.shields.io/badge/Vite-6.0-646CFF?logo=vite&logoColor=white)](https://vitejs.dev/)
[![React](https://img.shields.io/badge/React-18-61DAFB?logo=react&logoColor=black)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/TailwindCSS-3.4-06B6D4?logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)

CalcHub is a modern, ultra-fast, and privacy-focused suite of **11 precision calculators** built with React, TypeScript, and Tailwind CSS. Designed for everyday utility, financial planning, engineering computation, and health metrics.

Live Demo: **[https://zhsaikot.github.io/calculator-hub/](https://zhsaikot.github.io/calculator-hub/)**

---

## 🚀 Features

- **11 Precision Calculators**:
  1. 🔢 **Basic Calculator**: Quick everyday arithmetic with floating-point precision correction.
  2. 🔬 **Scientific Calculator**: Trigonometry (DEG/RAD), logarithms, powers, roots, and factorials.
  3. 🎂 **Age Calculator**: Exact age breakdown (years, months, days, hours) and next birthday countdown.
  4. 💪 **BMI Calculator**: Body Mass Index gauge meter with WHO health categories and ideal weight range.
  5. 🧾 **Income Tax Calculator**: Multi-currency net salary and effective tax rate estimator.
  6. 📈 **Profit & Loss Calculator**: Business margin analysis, COGS, revenue, and markup %.
  7. 🏦 **Loan / EMI Calculator**: Monthly loan installments, amortization schedule, and **CSV export**.
  8. 💰 **Compound Interest Calculator**: Investment future value forecasting with recurring deposits.
  9. 🏷️ **Discount & Sale Calculator**: Shopping markdowns, sales tax calculations, and net savings.
  10. 🎯 **Percentage Calculator**: 6 instant percentage calculation tools.
  11. 🔄 **All-in-One Unit Converter**: Length, Weight, Temperature, Area, and Speed conversion.

- **Marketing & UX Highlights**:
  - 🔗 **Deep-linking URL Routing**: Share direct pre-filled calculator links (e.g., `#/loan-emi?amt=500000&rate=8.5&term=5`).
  - 📋 **One-Click Share & Copy**: Instant social sharing to X/Twitter, WhatsApp, LinkedIn, and clipboard.
  - 🕒 **Calculation History**: Automatic local storage calculation history with restore capability.
  - 📱 **Progressive Web App (PWA)**: Works offline and can be installed on iOS, Android, and Desktop.
  - 🌓 **Dark & Light Mode**: Glassmorphism design tokens with persistent theme switcher.
  - 🔍 **Quick Command Palette (`Ctrl+K`)**: Instant fuzzy search across all tools.

---

## 🛠️ Architecture

```
calculator-hub/
├── .github/workflows/deploy.yml   # Automated GitHub Pages CI/CD
├── public/                       # PWA manifest, sitemap.xml, robots.txt, icons
├── src/
│   ├── components/
│   │   ├── calculators/          # 11 isolated calculator components
│   │   ├── common/               # GlassCard, ShareModal, HistoryDrawer, SearchModal
│   │   ├── home/                 # HomeHub, Hero, Filter grid
│   │   └── layout/               # Header, Sidebar, Footer
│   ├── context/                  # ThemeContext & HistoryContext
│   ├── hooks/                    # useHashRoute
│   ├── lib/calculators/          # Pure decoupled math engines & types
│   ├── App.tsx
│   ├── main.tsx
│   └── index.css
├── tests/                        # Vitest automated test suite (19+ tests)
├── vite.config.ts
├── tailwind.config.js
└── package.json
```

---

## 🧪 Testing & Verification

All math logic is decoupled from React and verified with automated unit tests using Vitest:

```bash
# Run automated tests
npm test

# Run tests in watch mode
npm run test:watch
```

---

## 💻 Local Development

```bash
# 1. Clone repository
git clone https://github.com/zhsaikot/calculator-hub.git
cd calculator-hub

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Type check & build for production
npm run build
```

---

## 🚢 Deployment

The repository includes a GitHub Actions workflow (`.github/workflows/deploy.yml`). Pushing commits to `main` automatically runs tests, builds the Vite production bundle, and deploys directly to **GitHub Pages**.

To enable in your GitHub repository:
1. Go to **Settings > Pages**.
2. Under **Build and deployment > Source**, select **GitHub Actions**.

---

## 📄 License

Distributed under the [MIT License](LICENSE).
