Referral Dashboard Assessment

A responsive Referral Dashboard built using React.js that allows users to authenticate, view referral statistics, manage referral information, and track referral earnings.

Features

Authentication

* User Login
* JWT Token Authentication
* Protected Routes
* Logout Functionality

Dashboard

* Overview Metrics
    * Total Balance
    * Discount Percentage
    * Total Referrals
    * Discount Amount
    * Commission Amount
    * Total Earnings
    * Commission Discount
    * Total Bank Transfer

Service Summary

* Service Information
* Referral Counts
* Active Referrals
* Total Referral Earnings

Referral Sharing

* Copy Referral Link
* Copy Referral Code

Referral Management

* Search Referrals
* Sort by Date
* Pagination
* View Referral Details

Additional Features

* Responsive UI
* Error Handling
* Loading States
* Footer Navigation

Tech Stack

* React.js
* React Router DOM
* JavaScript (ES6+)
* CSS3
* Fetch API
* js-cookie

Project Structure

src
│
├── assets
│
├── components
│   ├── Navbar
│   └── ProtectedRoute
│
├── pages
│   ├── Login
│   ├── Dashboard
│   ├── ReferralDetails
│   └── NotFound
│
├── utils
│   └── constants.js
│
├── App.jsx
├── main.jsx
└── index.css

Installation

Clone the repository:

git clone <repository-url>

Navigate to project folder:

cd referral-dashboard

Install dependencies:

npm install

Run the project:

npm run dev

Open:

http://localhost:5173

Login Credentials

Email: admin@example.com
Password: admin

API Endpoints

Login

POST /api/auth/signin

Referrals

GET /api/referrals

Referral Details

GET /api/referrals/:id

Author

Sai Mhapasekar
saimhapasekar2600@gmail.com

License

This project was developed as part of the Referral Dashboard Assessment.
