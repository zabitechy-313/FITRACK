export type TabType = 'dashboard' | 'transactions' | 'analytics' | 'budget' | 'settings';

export type TransactionType = 'income' | 'expense';

export type TransactionCategory = 
  | 'Technology & Electronics'
  | 'Income & Wages'
  | 'Dining & Entertainment'
  | 'Housing & Bills'
  | 'Groceries'
  | 'Transportation'
  | 'Shopping'
  | 'Healthcare'
  | 'Travel'
  | 'Other';

export interface Transaction {
  id: string;
  title: string;
  category: TransactionCategory;
  date: string; // e.g. "Oct 28, 2023"
  time: string; // e.g. "10:45 AM"
  amount: number; // positive for income, negative for expense
  type: TransactionType;
  icon: string; // Material Symbol name
  iconBg: string;
  iconColor: string;
}

export interface BudgetCategoryItem {
  id: string;
  name: string;
  category: TransactionCategory;
  allocated: number;
  spent: number;
  icon: string;
  color: string;
  containerBg: string;
}

export interface UserProfile {
  name: string;
  email: string;
  plan: string;
  avatar: string;
  initials: string;
  currency?: string;
}
