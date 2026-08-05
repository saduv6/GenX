// ============================================================
// Settings Context - provides site-wide settings with live updates
// ============================================================

import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Settings } from '@/types';
import { subscribeToSettings, updateSettings as updateSettingsDb } from '@/lib/firebase';

type SettingsContextType = {
  settings: Settings | null;
  loading: boolean;
  updateSettings: (partial: Partial<Settings>) => Promise<void>;
};

const SettingsContext = createContext<SettingsContextType>({
  settings: null,
  loading: true,
  updateSettings: async () => {},
});

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToSettings((s) => {
      setSettings(s);
      setLoading(false);
    });
    return unsubscribe;
  }, []);

  const updateSettings = async (partial: Partial<Settings>) => {
    await updateSettingsDb(partial);
  };

  return (
    <SettingsContext.Provider value={{ settings, loading, updateSettings }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}
