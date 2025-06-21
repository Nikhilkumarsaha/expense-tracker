export interface Income {
  _id?: string;
  name: string;
  amount: number;
  date: string;
  createdAt?: Date;
}

export interface Expense {
  _id?: string;
  title: string;
  amount: number;
  date: string;
  category: string;
  createdAt?: Date;
}

export interface Subscription {
  _id: string;
  title: string;
  amount: number;
  category: string;
  date: number; // Day of month
  isSubscribed: boolean;
  createdAt?: Date;
  lastProcessedDate?: Date;
}

export interface CategoryTotal {
  category: string;
  total: number;
}

export interface MonthlyData {
  month: string;
  expenses: number;
  income: number;
  savings: number;
  categoryTotals: Record<string, number>;
}

export const EXPENSE_CATEGORIES = [
  'Rent & Housing',
  'Shopping',
  'Transport',
  'Food & Dining',
  'Entertainment',
  'Healthcare',
  'Education',
  'Utilities',
  'Grocery',
  'Other'
];

export const SUBSCRIPTION_TITLES = [
  'Netflix',
  'Rent',
  'Gym',
  'SIP',
  'Amazon Prime',
  'Spotify',
  'Disney+',
  'Internet',
  'Phone',
  'Insurance',
  'Other'
];