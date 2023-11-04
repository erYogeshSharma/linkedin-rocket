import { BaseStorage, createStorage, StorageType } from "./base";

export type Tab = "prompts" | "feedback" | "plan";
export type Prompt = {
  _id: string;
  label: string;
  prompt: string;
  user: string;
  wordLimit: number;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  __v: number;
};
export type AppStorageType = {
  prompts: Prompt[];
  settingsModalProps: {
    open: boolean;
    tab: Tab;
  };

  promptForm: {
    prompt: Prompt;
    open: boolean;
    isEdit: boolean;
  };
};

const storeInit: AppStorageType = {
  prompts: [],
  settingsModalProps: {
    open: false,
    tab: "prompts",
  },
  promptForm: {
    prompt: {
      _id: "",
      label: "",
      prompt: "",
      user: "",
      wordLimit: 40,
      isActive: true,
      isDefault: false,
      createdAt: "",
      updatedAt: "",
      __v: 0,
    },
    open: false,
    isEdit: false,
  },
};

type appStorage = BaseStorage<AppStorageType> & {
  addPrompt: (s: Prompt) => void;
  removePrompt: (promptId: string) => void;
  openSettings: (tab: Tab) => void;
  closeSettings: () => void;
  getPrompts: (s: Prompt[]) => void;
  openPromptForm: (isEdit: boolean, prompt?: Prompt) => void;
  closePromptForm: () => void;
  updatePromptForm: (p: Prompt) => void;
  updatePrompt: (p: Prompt) => void;
  changeTab: (t: Tab) => void;
};

const storage = createStorage<AppStorageType>("app-store-key", storeInit, {
  storageType: StorageType.Local,
});

const appStorage: appStorage = {
  ...storage,

  addPrompt: (p: Prompt) => {
    storage.set((storage) => {
      return { ...storage, prompts: storage.prompts.concat(p) };
    });
  },
  updatePrompt: (prompt: Prompt) => {
    storage.set((storage) => {
      return {
        ...storage,
        prompts: storage.prompts.map((p) => (p._id === prompt._id ? prompt : p)),
      };
    });
  },

  removePrompt: (promptId: string) => {
    storage.set((storage) => {
      return { ...storage, prompts: storage.prompts.filter((prompt) => prompt._id !== promptId) };
    });
  },
  openSettings: (tab: Tab) => {
    storage.set((storage) => {
      return { ...storage, settingsModalProps: { open: true, tab: tab } };
    });
  },
  changeTab: (tab: Tab) => {
    storage.set((storage) => {
      return { ...storage, settingsModalProps: { ...storage.settingsModalProps, tab: tab } };
    });
  },
  closeSettings: () => {
    storage.set((storage) => {
      return { ...storage, settingsModalProps: { ...storage.settingsModalProps, open: false } };
    });
  },
  getPrompts: (prompts: Prompt[]) => {
    storage.set((storage) => {
      return { ...storage, prompts: prompts };
    });
  },

  openPromptForm: (isEdit: boolean, prompt?: Prompt) => {
    storage.set((storage) => {
      return {
        ...storage,
        promptForm: { open: true, isEdit: isEdit, prompt: prompt || storage.promptForm.prompt },
      };
    });
  },
  updatePromptForm: (prompt: Prompt) => {
    storage.set((storage) => {
      return {
        ...storage,
        promptForm: { ...storage.promptForm, prompt: prompt },
      };
    });
  },
  closePromptForm: () => {
    storage.set((storage) => {
      return {
        ...storage,
        promptForm: { open: false, isEdit: false, prompt: storeInit.promptForm.prompt },
      };
    });
  },
};

export default appStorage;
