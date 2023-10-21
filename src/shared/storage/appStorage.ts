import { BaseStorage, createStorage, StorageType } from "./base";

export type Plan = {
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
};
export type AppStoreType = {
  user: {
    _id: string;
    linkedInId: string;
    firstName: string;
    lastName: string;
    email: string;
    avatar: string;
    createdAt: string;
    updatedAt: string;
    __v: number;
  };
  token: string;
  plan: Plan;
};

const storeInit: AppStoreType = {
  user: {
    _id: "",
    linkedInId: "",
    firstName: "",
    lastName: "",
    email: "",
    avatar: "",
    createdAt: "",
    updatedAt: "",
    __v: 0,
  },
  token: "",
  plan: {
    _id: "",
    plan: "",
    user: "",
    amount: 0,
    isActive: false,
    expiresOn: "",
    totalCredits: 0,
    creditsUsed: 0,
    createdAt: "",
    updatedAt: "",
    __v: 0,
  },
};

type AppStorage = BaseStorage<AppStoreType> & {
  auth: (s: AppStoreType) => void;
  logOut: () => void;
  creditUsed: () => void;
  updatePlan: (p: Plan) => void;
};

const storage = createStorage<AppStoreType>("app-store-key", storeInit, {
  storageType: StorageType.Local,
});

const appStore: AppStorage = {
  ...storage,

  auth: (auth: AppStoreType) => {
    storage.set(() => {
      return auth;
    });
  },

  logOut: () => {
    storage.set(() => {
      return storeInit;
    });
  },

  creditUsed: () => {
    storage.set((state) => {
      return { ...state, plan: { ...state.plan, creditsUsed: state.plan.creditsUsed + 1 } };
    });
  },
  updatePlan: (plan: Plan) => {
    storage.set((state) => {
      return { ...state, plan: plan };
    });
  },
};

export default appStore;
