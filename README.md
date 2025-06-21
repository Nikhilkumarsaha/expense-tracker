# Expense Tracker

A comprehensive expense tracking application built with Next.js, MongoDB, and Tailwind CSS. Track your income, expenses, subscriptions, and view detailed financial analytics through an intuitive dashboard.

![Expense Tracker Dashboard](https://images.pexels.com/photos/53621/calculator-calculation-insurance-finance-53621.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1)

## Features

- 📊 **Interactive Dashboard**
  - Monthly expense breakdown
  - Category-wise expense distribution
  - Savings trends
  - Recent transactions

- 💰 **Income Management**
  - Track multiple income sources
  - Historical income records
  - Total earnings overview

- 💳 **Expense Tracking**
  - Categorized expenses
  - Date-wise tracking
  - Real-time balance updates
  - Detailed expense history

- 📅 **Subscription Management**
  - Automated recurring payments
  - Subscription status toggle
  - Category-based organization
  - Due date tracking

- 📈 **Monthly Summary**
  - Detailed monthly breakdowns
  - Category-wise analysis
  - Income vs. Expense comparison
  - Savings calculations

## Tech Stack

- **Frontend**: Next.js, React, Tailwind CSS, shadcn/ui
- **Backend**: Next.js API Routes
- **Database**: MongoDB
- **Charts**: Recharts
- **Forms**: React Hook Form, Zod
- **Icons**: Lucide React

## Prerequisites

Before running the application, ensure you have:

- Node.js 18.x or later
- MongoDB database (local or Atlas)
- Git (for cloning the repository)

## Environment Setup

1. Create a `.env.local` file in the root directory:

```env
MONGODB_URI=your_mongodb_connection_string
```

Replace `your_mongodb_connection_string` with your actual MongoDB connection string.

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd expense-tracker
```

2. Install dependencies:
```bash
npm install
```

3. Build the application:
```bash
npm run build
```

4. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`

## Project Structure

```
expense-tracker/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   ├── dashboard/         # Dashboard page
│   ├── expenses/          # Expenses page
│   ├── income/           # Income page
│   ├── subscriptions/    # Subscriptions page
│   └── summary/          # Monthly summary page
├── components/            # React components
│   ├── dashboard/        # Dashboard components
│   ├── expenses/         # Expense components
│   ├── income/          # Income components
│   ├── subscriptions/   # Subscription components
│   └── ui/              # UI components
├── lib/                  # Utility functions
│   ├── db.ts            # Database connection
│   ├── types.ts         # TypeScript types
│   └── utils.ts         # Helper functions
└── public/              # Static files
```

## Database Collections

The application uses the following MongoDB collections:

- `expenses`: Stores expense records
- `incomes`: Stores income records
- `subscriptions`: Stores subscription records

## Running Locally

1. Start the development server:
```bash
npm run dev
```

2. Build for production:
```bash
npm run build
```

3. Start production server:
```bash
npm start
```

## Deployment

To deploy the application:

1. Build the project:
```bash
npm run build
```

2. The static output will be in the `out` directory, which can be deployed to any static hosting service like Vercel, Netlify, or GitHub Pages.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.