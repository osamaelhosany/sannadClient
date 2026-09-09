import { useEffect, useState } from "react";
import { AppProvider, useApp } from "./lib/store";
import ClientApp from "./client/ClientApp";
import AdminApp from "./admin/AdminApp";
import { Icon, SannadMark } from "./components/ui";
import { cn } from "./utils/cn";

function Switcher({ mode, setMode }: { mode: string; setMode: (m: string) => void }) {
  const { t, lang, toggleLang } = useApp();
  return (
    <div className="fixed bottom-4 left-1/2 z-[200] flex -translate-x-1/2 items-center gap-1 rounded-2xl border border-zinc-200 bg-white/95 p-1.5 shadow-xl backdrop-blur">
      <div className="flex items-center gap-1.5 px-2">
        <SannadMark className="h-5 w-5" />
      </div>
      {[
        { k: "client", icon: "home", label: t("clientMobileApp") },
        { k: "admin", icon: "grid", label: t("adminWeb") },
      ].map((m) => (
        <button
          key={m.k}
          onClick={() => setMode(m.k)}
          className={cn(
            "flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold transition",
            mode === m.k ? "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow" : "text-zinc-500 hover:bg-zinc-100"
          )}
        >
          <Icon name={m.icon} className="h-3.5 w-3.5" /> {m.label}
        </button>
      ))}
      <button
        onClick={toggleLang}
        className="flex items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold text-zinc-500 hover:bg-zinc-100"
      >
        <Icon name="globe" className="h-3.5 w-3.5" /> {lang === "en" ? "AR" : "EN"}
      </button>
    </div>
  );
}

function Root() {
  const { dir, lang } = useApp();
  const [mode, setMode] = useState("client");
  useEffect(() => {
    document.documentElement.dir = dir;
    document.documentElement.lang = lang;
  }, [dir, lang]);
  return (
    <div className="min-h-screen pb-20">
      {mode === "client" ? <ClientApp /> : <AdminApp />}
      <Switcher mode={mode} setMode={setMode} />
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <Root />
    </AppProvider>
  );
}
