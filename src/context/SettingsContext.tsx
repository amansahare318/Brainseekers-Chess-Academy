"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { fetchSettings, type AcademySettings } from "@/lib/settings";

const empty: AcademySettings = {
  academyName: "",
  tagline: "",
  description: "",
  logo: {},
  mobile: "",
  whatsapp: "",
  email: "",
  address: "",
  city: "",
  state: "",
  country: "",
  facebook: "",
  instagram: "",
  youtube: "",
  linkedin: "",
  signatureName: "",
  signatureTitle: "",
  certificateTemplate: {},
};

const SettingsContext = createContext<AcademySettings>(empty);

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<AcademySettings>(empty);

  useEffect(() => {
    fetchSettings()
      .then(setSettings)
      .catch(() => setSettings(empty));
  }, []);

  return <SettingsContext.Provider value={settings}>{children}</SettingsContext.Provider>;
}

export function useSettings() {
  return useContext(SettingsContext);
}
