import React, { createContext, useCallback, useContext, useMemo, useState } from "react";
import { translate, type Lang } from "./i18n";
import {
  initialServices,
  initialInvoices,
  initialFiles,
  initialNotifs,
  initialThreads,
  initialProfile,
  defaultPerms,
  type Service,
  type Invoice,
  type FileItem,
  type Notif,
  type Thread,
  type Bi,
} from "./data";

type Toast = { id: number; text: string; kind: "success" | "info" | "error" };

type Ctx = {
  lang: Lang;
  dir: "ltr" | "rtl";
  setLang: (l: Lang) => void;
  toggleLang: () => void;
  t: (k: string) => string;
  b: (v: Bi) => string;
  services: Service[];
  invoices: Invoice[];
  files: FileItem[];
  notifs: Notif[];
  threads: Thread[];
  profile: typeof initialProfile;
  perms: Record<string, Record<string, boolean>>;
  toasts: Toast[];
  toast: (text: string, kind?: Toast["kind"]) => void;
  markRead: (id: string) => void;
  markAllRead: () => void;
  payInvoice: (id: string) => void;
  addInvoice: (inv: Invoice) => void;
  updateService: (id: string, patch: Partial<Service>) => void;
  sendMessage: (threadId: string, text: string, from?: "client" | "agent") => void;
  updateProfile: (p: Partial<typeof initialProfile>) => void;
  addNotif: (n: Notif) => void;
  togglePerm: (role: string, key: string) => void;
  unreadCount: number;
};

const C = createContext<Ctx>(null as unknown as Ctx);
export const useApp = () => useContext(C);

export function AppProvider({ children }: { children: React.ReactNode }) {
  const [lang, setLang] = useState<Lang>("en");
  const [services, setServices] = useState(initialServices);
  const [invoices, setInvoices] = useState(initialInvoices);
  const [files] = useState(initialFiles);
  const [notifs, setNotifs] = useState(initialNotifs);
  const [threads, setThreads] = useState(initialThreads);
  const [profile, setProfile] = useState(initialProfile);
  const [perms, setPerms] = useState(defaultPerms);
  const [toasts, setToasts] = useState<Toast[]>([]);

  const t = useCallback((k: string) => translate(k, lang), [lang]);
  const b = useCallback((v: Bi) => (v ? v[lang] : ""), [lang]);

  const toast = useCallback((text: string, kind: Toast["kind"] = "success") => {
    const id = Date.now() + Math.random();
    setToasts((s) => [...s, { id, text, kind }]);
    setTimeout(() => setToasts((s) => s.filter((x) => x.id !== id)), 2600);
  }, []);

  const value: Ctx = useMemo(
    () => ({
      lang,
      dir: lang === "ar" ? "rtl" : "ltr",
      setLang,
      toggleLang: () => setLang((l) => (l === "en" ? "ar" : "en")),
      t,
      b,
      services,
      invoices,
      files,
      notifs,
      threads,
      profile,
      perms,
      toasts,
      toast,
      unreadCount: notifs.filter((n) => !n.read).length,
      markRead: (id) => setNotifs((s) => s.map((n) => (n.id === id ? { ...n, read: true } : n))),
      markAllRead: () => setNotifs((s) => s.map((n) => ({ ...n, read: true }))),
      payInvoice: (id) => setInvoices((s) => s.map((i) => (i.id === id ? { ...i, status: "Paid" } : i))),
      addInvoice: (inv) => setInvoices((s) => [inv, ...s]),
      updateService: (id, patch) => setServices((s) => s.map((x) => (x.id === id ? { ...x, ...patch } : x))),
      sendMessage: (threadId, text, from = "client") =>
        setThreads((s) =>
          s.map((th) =>
            th.id === threadId
              ? {
                  ...th,
                  messages: [
                    ...th.messages,
                    {
                      id: "m" + Date.now(),
                      from,
                      text,
                      time: new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
                    },
                  ],
                }
              : th
          )
        ),
      updateProfile: (p) => setProfile((s) => ({ ...s, ...p })),
      addNotif: (n) => setNotifs((s) => [n, ...s]),
      togglePerm: (role, key) =>
        setPerms((s) => ({ ...s, [role]: { ...s[role], [key]: !s[role][key] } })),
    }),
    [lang, services, invoices, files, notifs, threads, profile, perms, toasts, t, b, toast]
  );

  return <C.Provider value={value}>{children}</C.Provider>;
}
