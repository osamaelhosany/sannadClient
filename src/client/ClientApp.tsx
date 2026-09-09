import { useEffect, useState } from "react";
import { useApp } from "../lib/store";
import { Button, Field, Icon, LangToggle, SannadLogo, SannadMark, Toasts } from "../components/ui";
import { Body, ScreenHeader, type Nav } from "./parts";
import {
  Dashboard,
  ServicesList,
  ServiceDetails,
  PackageDetails,
  RequestService,
  InvoiceList,
  InvoiceDetails,
  PayFlow,
} from "./Screens1";
import {
  Academy,
  ChangePassword,
  ChatList,
  Conversation,
  CourseDetails,
  EditProfile,
  FileDetails,
  FilesList,
  NotificationDetails,
  NotificationsList,
  Profile,
} from "./Screens2";

type Entry = { name: string; param?: string };

/* ---------- Phone frame ---------- */
export function Phone({ children }: { children: React.ReactNode }) {
  const { dir } = useApp();
  return (
    <div className="flex min-h-screen items-center justify-center p-4">
      <div className="relative h-[812px] w-[390px] overflow-hidden rounded-[2.75rem] border-[10px] border-zinc-900 bg-white shadow-2xl">
        <div className="absolute inset-x-0 top-0 z-40 flex h-9 items-center justify-between px-6 text-[11px] font-semibold text-zinc-800">
          <span>9:41</span>
          <div className="absolute left-1/2 top-1.5 h-6 w-28 -translate-x-1/2 rounded-full bg-zinc-900" />
          <span className="flex items-center gap-1">
            <Icon name="chart" className="h-3 w-3" /> 100%
          </span>
        </div>
        <div dir={dir} className="relative flex h-full flex-col overflow-hidden pt-9">
          {children}
        </div>
      </div>
    </div>
  );
}

/* ---------- Auth ---------- */
function Splash({ onDone }: { onDone: () => void }) {
  useEffect(() => {
    const id = setTimeout(onDone, 1900);
    return () => clearTimeout(id);
  }, []);
  return (
    <div className="flex h-full flex-col items-center justify-center bg-white">
      <div className="animate-[fadein_.6s_ease-out]">
        <SannadLogo size="lg" />
      </div>
      <div className="mt-10 h-1 w-32 overflow-hidden rounded-full bg-zinc-100">
        <div className="h-full w-1/2 animate-[slidedown_1.6s_linear_infinite] bg-gradient-to-r from-orange-400 to-orange-600" />
      </div>
    </div>
  );
}

function Login({ go, onLogin }: { go: (s: string) => void; onLogin: () => void }) {
  const { t, toast } = useApp();
  const [email, setEmail] = useState("ahmed.hassan@example.com");
  const [pass, setPass] = useState("sannad123");
  const [busy, setBusy] = useState(false);
  const submit = () => {
    if (!email.trim() || !pass.trim()) return toast(t("invalidCreds"), "error");
    setBusy(true);
    setTimeout(() => {
      setBusy(false);
      onLogin();
    }, 800);
  };
  return (
    <div className="flex h-full flex-col justify-between bg-white px-7 py-10">
      <div className="flex flex-1 flex-col justify-center">
        <div className="mb-10 flex justify-center">
          <SannadLogo size="md" />
        </div>
        <div className="space-y-3">
          <Field value={email} onChange={setEmail} placeholder={t("emailPhone")} />
          <Field value={pass} onChange={setPass} type="password" placeholder={t("password")} />
          <button onClick={() => go("forgot")} className="block w-full text-end text-[11px] font-semibold text-orange-600">
            {t("forgotPassword")}
          </button>
          <Button size="lg" onClick={submit} disabled={busy}>
            {busy ? "..." : t("login")}
          </Button>
          <p className="text-center text-[10px] text-zinc-400">{t("loginHint")}</p>
        </div>
      </div>
      <div className="flex justify-center">
        <LangToggle />
      </div>
    </div>
  );
}

function Forgot({ go }: { go: (s: string) => void }) {
  const { t } = useApp();
  const [v, setV] = useState("");
  return (
    <div className="flex h-full flex-col bg-white">
      <div className="flex items-center px-3 py-3">
        <button onClick={() => go("login")} className="flex h-9 w-9 items-center justify-center rounded-xl hover:bg-zinc-100">
          <Icon name="chevronL" className="h-5 w-5 rtl:rotate-180" />
        </button>
      </div>
      <div className="flex flex-1 flex-col justify-center px-7 pb-20">
        <SannadMark className="mx-auto mb-6 h-12 w-12" />
        <h1 className="text-center text-xl font-bold text-zinc-900">{t("forgotPassword")}</h1>
        <p className="mx-auto mt-2 max-w-[16rem] text-center text-xs text-zinc-500">{t("resetInstructions")}</p>
        <div className="mt-6 space-y-3">
          <Field value={v} onChange={setV} placeholder={t("emailPhone")} />
          <Button size="lg" onClick={() => go("recovery")}>
            {t("continueBtn")}
          </Button>
          <button onClick={() => go("login")} className="block w-full text-center text-xs font-semibold text-zinc-500">
            {t("backToLogin")}
          </button>
        </div>
      </div>
    </div>
  );
}

function Recovery({ go }: { go: (s: string) => void }) {
  const { t } = useApp();
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 bg-white px-8 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-500/30">
        <Icon name="check" className="h-10 w-10" strokeWidth={3} />
      </div>
      <h1 className="mt-2 text-xl font-bold text-zinc-900">{t("recoverySent")}</h1>
      <p className="text-xs text-zinc-500">{t("checkInbox")}</p>
      <Button size="lg" className="mt-6" onClick={() => go("login")}>
        {t("returnToLogin")}
      </Button>
    </div>
  );
}

/* ---------- Bottom nav ---------- */
const TABS = [
  { key: "home", icon: "home", label: "home" },
  { key: "services", icon: "services", label: "services" },
  { key: "invoices", icon: "invoices", label: "invoices" },
  { key: "files", icon: "files", label: "files" },
  { key: "notifications", icon: "bell", label: "notifications" },
];

function BottomNav({ tab, onTab }: { tab: string; onTab: (t: string) => void }) {
  const { t, unreadCount } = useApp();
  return (
    <div className="absolute inset-x-0 bottom-0 z-30 flex items-center justify-around border-t border-zinc-100 bg-white/95 px-2 pb-5 pt-2 backdrop-blur">
      {TABS.map((x) => {
        const active = tab === x.key;
        return (
          <button
            key={x.key}
            onClick={() => onTab(x.key)}
            className={`relative flex flex-1 flex-col items-center gap-1 rounded-xl py-1 transition ${
              active ? "text-orange-600" : "text-zinc-400"
            }`}
          >
            <span className={`flex h-8 w-12 items-center justify-center rounded-xl ${active ? "bg-orange-50" : ""}`}>
              <Icon name={x.icon} className="h-5 w-5" />
              {x.key === "notifications" && unreadCount > 0 && (
                <span className="absolute right-3 top-0 flex h-4 min-w-4 items-center justify-center rounded-full bg-orange-500 px-1 text-[9px] font-bold text-white">
                  {unreadCount}
                </span>
              )}
            </span>
            <span className="text-[9px] font-semibold">{t(x.label)}</span>
          </button>
        );
      })}
    </div>
  );
}

/* ---------- Shell ---------- */
function Shell({ onLogout }: { onLogout: () => void }) {
  const { t } = useApp();
  const [tab, setTab] = useState("home");
  const [stack, setStack] = useState<Entry[]>([]);

  const nav: Nav = {
    push: (name, param) => setStack((s) => [...s, { name, param }]),
    pop: () => setStack((s) => s.slice(0, -1)),
    goTab: (x) => {
      setStack([]);
      setTab(x);
    },
    home: () => {
      setStack([]);
      setTab("home");
    },
    canBack: stack.length > 0,
  };

  const top = stack[stack.length - 1];

  const renderTab = () => {
    switch (tab) {
      case "services":
        return <ServicesList nav={nav} />;
      case "invoices":
        return <InvoiceList nav={nav} />;
      case "files":
        return <FilesList nav={nav} />;
      case "notifications":
        return <NotificationsList nav={nav} />;
      default:
        return <Dashboard nav={nav} />;
    }
  };

  const renderTop = () => {
    if (!top) return null;
    const p = top.param ?? "";
    switch (top.name) {
      case "service":
        return <ServiceDetails nav={nav} id={p} />;
      case "package":
        return <PackageDetails nav={nav} id={p} />;
      case "request":
        return <RequestService nav={nav} />;
      case "invoice":
        return <InvoiceDetails nav={nav} id={p} />;
      case "pay":
        return <PayFlow nav={nav} id={p} />;
      case "file":
        return <FileDetails nav={nav} id={p} />;
      case "notification":
        return <NotificationDetails nav={nav} id={p} />;
      case "chat":
        return <ChatList nav={nav} />;
      case "conversation":
        return <Conversation nav={nav} id={p} />;
      case "profile":
        return <Profile nav={nav} />;
      case "editProfile":
        return <EditProfile nav={nav} />;
      case "changePassword":
        return <ChangePassword nav={nav} />;
      case "academy":
        return <Academy nav={nav} />;
      case "course":
        return <CourseDetails nav={nav} id={p} />;
      case "logout":
        return (
          <>
            <ScreenHeader title={t("logout")} nav={nav} />
            <Body>
              <div className="flex flex-col items-center gap-3 py-20 text-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-red-50 text-red-500">
                  <Icon name="logout" className="h-8 w-8" />
                </div>
                <p className="text-sm font-bold text-zinc-900">{t("logout")}?</p>
                <div className="mt-4 flex w-full gap-2">
                  <Button variant="ghost" className="flex-1" onClick={nav.pop}>
                    {t("cancel")}
                  </Button>
                  <Button variant="danger" className="flex-1" onClick={onLogout}>
                    {t("confirm")}
                  </Button>
                </div>
              </div>
            </Body>
          </>
        );
      default:
        return null;
    }
  };

  const hideNav = top?.name === "conversation";

  return (
    <div className="relative flex h-full flex-col overflow-hidden bg-zinc-50">
      <div className="no-scrollbar flex-1 overflow-y-auto">{top ? renderTop() : renderTab()}</div>
      {!hideNav && <BottomNav tab={tab} onTab={(x) => nav.goTab(x)} />}
    </div>
  );
}

export default function ClientApp() {
  const [screen, setScreen] = useState("splash");
  return (
    <Phone>
      <Toasts />
      {screen === "splash" && <Splash onDone={() => setScreen("login")} />}
      {screen === "login" && <Login go={setScreen} onLogin={() => setScreen("app")} />}
      {screen === "forgot" && <Forgot go={setScreen} />}
      {screen === "recovery" && <Recovery go={setScreen} />}
      {screen === "app" && <Shell onLogout={() => setScreen("login")} />}
    </Phone>
  );
}
