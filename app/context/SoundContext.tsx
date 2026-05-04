"use client";
import { createContext, useContext, useState } from "react";

const SoundContext = createContext({
  soundEnabled: true,
  setSoundEnabled: (_: boolean) => {},
});

export function SoundProvider({ children }: { children: React.ReactNode }) {
  const [soundEnabled, setSoundEnabled] = useState(true);
  return (
    <SoundContext.Provider value={{ soundEnabled, setSoundEnabled }}>
      {children}
    </SoundContext.Provider>
  );
}

export const useSoundEnabled = () => useContext(SoundContext);
