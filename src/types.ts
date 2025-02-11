export interface Transaction {
  date: Date;
  amount: number;
  balance: number;
}

export type Action = 'deposit' | 'withdraw' | 'statement' | 'quit';
