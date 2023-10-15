export interface Plan {
  _id: string;
  plan: string;
  user: string;
  amount: number;
  isActive: boolean;
  expiresOn: string;
  totalCredits: number;
  creditsUsed: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
}
