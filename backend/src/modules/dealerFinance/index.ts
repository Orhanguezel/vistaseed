// src/modules/dealerFinance/index.ts
export { registerDealerFinance } from './router';
export { registerDealerFinanceAdmin } from './admin.routes';

export type {
  DealerProfileRow,
  NewDealerProfileRow,
  DealerTransactionRow,
  NewDealerTransactionRow,
  TransactionType,
} from './schema';

export {
  checkCreditLimit,
  recordOrderTransaction,
  recordPayment,
} from './service';
