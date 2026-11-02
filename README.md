# 🧾 BillGenius Pro — Multi-Shop POS & Khatabook Invoicing Site

[![Next.js](https://img.shields.io/badge/Next.js-15-black?style=for-the-badge&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Netlify Status](https://img.shields.io/badge/Deploy-Netlify-00C7B7?style=for-the-badge&logo=netlify&logoColor=white)](https://www.netlify.com/)

A modern, full-featured **Cloud Point-of-Sale (POS) & Khata Ledger Engine** designed for retail shopkeepers, wholesalers, and small businesses. Inspired by the functionality of **Khatabook & Vyapar**, it features multi-tenant shopkeeper authentication, NPCI-compliant dynamic UPI QR generation, dual print layouts (A4 GST & 80mm POS slip), and instant bill dispatch via WhatsApp & SMS.

---

## 🚀 Live Demo
🔗 **Live Application URL:** [https://your-netlify-site.netlify.app](https://your-netlify-site.netlify.app)  
*(Apna actual Netlify link yahan paste karein)*

---

## ✨ Key Features

### 🏪 1. Multi-Tenant Shopkeeper Authentication
* **Independent Shop Accounts:** Separate accounts for multiple owners (e.g., Kirana Store, Sweets Shop, Hardware).
* **Persistent Session:** Client-side local storage auto-loads shop profile, landmark, address, and QR configurations without re-entry.
* **Security & UX:** Password visibility toggle (`Show/Hide`) with input sanitization.

### 💳 2. NPCI-Compliant Dynamic UPI QR Engine
* **Universal UPI Compatibility:** Works with PhonePe, Google Pay, Paytm, BHIM, and Navi without parsing errors.
* **Auto-Sanitized Payee Meta:** Strips illegal characters from merchant names to adhere strictly to NPCI URI specs.
* **Dynamic Settle Amount:** QR code updates dynamically to bill either the **Full Amount** or the **Pending Udhaar Balance**.
* **Custom Standee Upload:** Allows merchants to upload their own physical QR code sticker.

### 📄 3. Dual-Format Print Engine
* **A4 GST Tax Invoice:** Full compliance layout with HSN/SAC codes, CGST + SGST breakdown, and banking/RTGS settlement fields.
* **80mm POS Thermal Slip:** Compact, high-contrast receipt layout engineered specifically for thermal receipt printers.
* **Zero CSS Rasterization Bugs:** Pure `@media print` rules generating vector-sharp PDFs without DOM blurring.

### 📒 4. Khatabook-Style Ledger & Settlement
* **Jama vs. Udhaar Tracking:** Visual balance cards highlighting *You Got (Paid)* vs. *You Gave (Udhaar)*.
* **Multi-Payment Modes:** Supports Cash, UPI, Split, and Khata (Credit).
* **Change Calculator:** Auto-calculates cash change to return when customers pay higher currency denominations.
* **Flexible Discounts:** Instant toggle between Flat Rupee (₹) and Percentage (%) discounts.

### 📲 5. Instant WhatsApp & SMS Dispatch
* **1-Click WhatsApp Delivery:** Sends formatted itemized receipts with live UPI payment links directly to customer WhatsApp chats.
* **Native SMS Trigger:** Deep-links into the mobile SMS messaging client for non-smartphone or offline customers.

---

## 🛠️ Tech Stack

* **Framework:** Next.js (App Router)
* **Language:** TypeScript
* **Styling:** Tailwind CSS
* **Icons:** Lucide React
* **Deployment:** Netlify / Vercel

---

## 📂 Project Structure

```text
├── app/
│   ├── layout.tsx         # Global fonts, metadata & scripts
│   ├── page.tsx           # Complete POS & Invoicing dashboard engine
│   └── globals.css        # Print media queries & custom utility styles
├── public/                # Static assets & icons
├── .gitignore             # Ignored directories (node_modules, .next)
├── package.json           # Dependencies & scripts
├── tsconfig.json          # TypeScript configuration
└── README.md              # Project documentation