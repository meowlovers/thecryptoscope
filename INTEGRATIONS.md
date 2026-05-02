# Pending Integrations — TheChartScope

## User Accounts + Credits System

### Services to set up (all free tier)

#### 1. Clerk (Authentication)
- URL: https://clerk.com
- Create application → "TheChartScope" → Email + Password
- Keys needed:
  - NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
  - CLERK_SECRET_KEY

#### 2. Supabase (Database)
- URL: https://supabase.com
- New project → "thechartscope"
- Keys needed:
  - DATABASE_URL (Settings → Database → Connection string → URI)

#### 3. NOWPayments (Crypto Payments)
- URL: https://nowpayments.io
- Add your USDT wallet address in Store Settings
- Enable IPN (webhook) and set a secret
- Keys needed:
  - NOWPAYMENTS_API_KEY
  - NOWPAYMENTS_IPN_SECRET
  - NOWPAYMENTS_WALLET (your receiving USDT wallet address)
  - NEXT_PUBLIC_APP_URL (e.g. https://thechartscope.com)

### Once keys are ready
Paste all keys into .env.local and run:
  npx prisma db push

That's it — everything else is already wired up.

---

## Admin Panel + PDF Delivery System (build later)

### How it works
- Every 6 hours you publish fresh analysis per pair
- One-time delivery per order (not recurring)
- Two delivery channels: in-account dashboard + Telegram bot

### Admin flow
1. Go to /admin (password protected, only you)
2. See orders grouped by pair: BTC (12 pending), XRP (8 pending), etc.
3. Click pair → upload PDF → hit "Send to X customers"
4. System automatically:
   - Saves PDF to Supabase Storage
   - Shows download button in each customer's dashboard
   - Sends PDF via Telegram bot to customers who connected Telegram
   - Marks all orders as Delivered

### Services needed
- Supabase Storage (free) — PDF file hosting
- Telegram Bot (free) — BotFather → create bot → get bot token
  - User connects Telegram in dashboard (one click → opens bot → bot saves chat ID)
  - Bot sends PDF directly to user's Telegram on delivery

### What to build
1. Supabase Storage bucket for PDFs
2. Admin panel (/admin) with order list grouped by pair + PDF upload
3. Dashboard: "Download Report" button when order is Delivered
4. Telegram bot: connect account flow + auto-send PDF on delivery

### Keys needed (when ready)
- TELEGRAM_BOT_TOKEN (from BotFather)
- ADMIN_PASSWORD (a password you choose for /admin access)
