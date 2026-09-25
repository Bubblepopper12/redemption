"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { strings, type Lang, type Strings } from "./strings";

type AppState = {
  lang: Lang;
  t: Strings;
  setLang: (l: Lang) => void;
  helper: boolean;
  setHelper: (on: boolean) => void;
};

const AppContext = createContext<AppState | null>(null);

// Language and helper mode are the only settings we remember, and only until
// the browser tab is closed (sessionStorage). They say nothing about the person.
// Names and locations are NEVER stored anywhere.
function readSession(key: string): string | null {
  try {
    return window.sessionStorage.getItem(key);
  } catch {
    return null;
  }
}
function writeSession(key: string, value: string) {
  try {
    window.sessionStorage.setItem(key, value);
  } catch {
    /* storage blocked: the setting just won't carry over */
  }
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");
  const [helper, setHelperState] = useState(false);

  useEffect(() => {
    const saved = readSession("lang");
    if (saved === "es" || saved === "en") setLangState(saved);
    if (readSession("helper") === "1") setHelperState(true);
  }, []);

  useEffect(() => {
    document.documentElement.lang = lang;
  }, [lang]);

  const setLang = (l: Lang) => {
    setLangState(l);
    writeSession("lang", l);
  };
  const setHelper = (on: boolean) => {
    setHelperState(on);
    writeSession("helper", on ? "1" : "0");
  };

  return (
    <AppContext.Provider value={{ lang, t: strings[lang], setLang, helper, setHelper }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp(): AppState {
  const ctx = useContext(AppContext);
  if (!ctx) throw new Error("useApp must be used inside <AppProvider>");
  return ctx;
}
