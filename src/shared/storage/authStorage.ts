import { BaseStorage, createStorage, StorageType } from "./base";
import * as browser from "webextension-polyfill";
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
  subscriptionId: string;
  renewsOn: string;
  updatedAt: string;
  __v: number;
};
export type AuthStorageType = {
  user: {
    _id: string;
    linkedInId: string;
    firstName: string;
    lastName: string;
    email: string;
    avatar: string;
    createdAt: string;
    updatedAt: string;
    disabledDefaultPrompts: string[];
    __v: number;
  };
  token: string;
  plan: Plan;
  isPlanRefreshing: boolean;
};

const storeInit: AuthStorageType = {
  user: {
    _id: "",
    linkedInId: "",
    firstName: "",
    lastName: "",
    email: "",
    avatar: "",
    createdAt: "",
    updatedAt: "",
    disabledDefaultPrompts: [],
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
    subscriptionId: "",
    renewsOn: "",
  },
  isPlanRefreshing: false,
};

type authStorage = BaseStorage<AuthStorageType> & {
  auth: (s: AuthStorageType) => void;
  logOut: () => void;
  creditUsed: () => void;
  updatePlan: (p: Plan) => void;
  updateDefaultPrompts: (p: string[]) => void;
  setIsPlanRefreshing: (s: boolean) => void;
};

const storage = createStorage<AuthStorageType>("auth-store-key", storeInit, {
  storageType: StorageType.Local,
});

const authStorage: authStorage = {
  ...storage,

  auth: (auth: AuthStorageType) => {
    storage.set(() => {
      return auth;
    });
  },

  logOut: async () => {
    await browser.storage.local.clear();
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
  setIsPlanRefreshing: (s: boolean) => {
    storage.set((state) => {
      return { ...state, isPlanRefreshing: s };
    });
  },
  updateDefaultPrompts: (p: string[]) => {
    storage.set((state) => {
      return { ...state, user: { ...state.user, disabledDefaultPrompts: p } };
    });
  },
};

export default authStorage;
