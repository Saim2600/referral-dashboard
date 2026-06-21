# Go Business — Referral Dashboard

## Setup

npm install
npm run dev

## Test Credentials

Email: admin@example.com
Password: admin123

## Stack

- React 18 + Vite
- React Router v6
- js-cookie
- Plain CSS (BEM naming)

## Structure

src/
├── App.jsx                        # BrowserRouter + all routes
├── main.jsx                       # Entry — renders <App /> only
├── index.css                      # CSS variables + resets
├── App.css                        # Shared layout helpers
├── components/
│   ├── Navbar/                    # Sticky top nav with logout
│   └── ProtectedRoute/            # JWT cookie guard
├── pages/
│   ├── Login/                     # Auth page
│   ├── Dashboard/                 # Main dashboard (all sections)
│   ├── ReferralDetails/           # Single referral view
│   └── NotFound/                  # 404
└── utils/
    └── constants.js               # API URLs, cookie name, page size

