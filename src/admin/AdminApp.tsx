import { useState } from "react";
import { useApp } from "../lib/store";
import { Button, Card, EmptyState, Field, Icon, LangToggle, Progress, SannadLogo, Status, Toasts } from "../components/ui";
import { clients, courses, packages, roleMatrix, type Client } from "../lib/data";
import { money, fileColor } from "../client/parts";
import { cn } from "../utils/cn";

type View = { module: string; id?: string; sub?: string };

const MENU = [
  { key: "dashboard", icon: "grid", label: "dashboard" },
  { key: "users", icon: "user", label: "users" },
  { key: "services", icon: "services", label: "services" },
  { key: "invoices", icon: "invoices", label: "invoices" },
  { key: "files", icon: "files", label: "files" },
  { key: "notifications", icon: "bell", label: "notifications" },
  { key: "chat", icon: "chat", label: "chatCenter" },
  { key: "finance", icon: "chart", label: "financialStats" },
  { key: "analytics", icon: "chart", label: "analytics" },
  { key: "academy", icon: "academy", label: "academy" },
  { key: "roles", icon: "shield", label: "roles" },
];

/* ---------- small charts ---------- */
function AreaChart({ data }: { data: number[] }) {
  const max = Math.max(...data);
  const pts = data.map((d, i) => `${(i / (data.length - 1)) * 100},${40 - (d / max) * 34}`).join(" ");
  return (
    <svg viewBox="0 0 100 40" preserveAspectRatio="none" className="h-40 w-full">
      <defs>
        <linearGradient id="ag" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#F97316" stopOpacity=".35" />
          <stop offset="100%" stopColor="#F97316" stopOpacity="0" />
        </linearGradient>
      </defs>
      <polygon points={`0,40 ${pts} 100,40`} fill="url(#ag)" />
      <polyline points={pts} fill="none" stroke="#F97316" strokeWidth="1.2" vectorEffect="non-scaling-stroke" />
    </svg>
  );
}

function Bars({ data }: { data: number[] }) {
  const max = Math.max(...data);
  return (
    <div className="flex h-40 items-end gap-2">
      {data.map((d, i) => (
        <div key={i} className="flex-1 rounded-t-md bg-gradient-to-t from-orange-500 to-amber-400" style={{ height: `${(d / max) * 100}%` }} />
      ))}
    </div>
  );
}

/* ---------- Login ---------- */
function AdminLogin({ onLogin }: { onLogin: () => void }) {
  const { t } = useApp();
  const [e, setE] = useState("admin@sannad.com");
  const [p, setP] = useState("admin123");
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-zinc-100 to-zinc-200 p-6">
      <div className="w-full max-w-sm rounded-3xl bg-white p-8 shadow-xl">
        <div className="mb-8 flex justify-center">
          <SannadLogo size="md" />
        </div>
        <div className="space-y-3">
          <Field value={e} onChange={setE} placeholder={t("emailPhone")} />
          <Field value={p} onChange={setP} type="password" placeholder={t("password")} />
          <div className="text-end">
            <span className="text-[11px] font-semibold text-orange-600">{t("forgotPassword")}</span>
          </div>
          <Button size="lg" onClick={onLogin}>
            {t("loginAdmin")}
          </Button>
        </div>
        <div className="mt-6 flex justify-center">
          <LangToggle />
        </div>
      </div>
    </div>
  );
}

/* ---------- Shell ---------- */
export default function AdminApp() {
  const [authed, setAuthed] = useState(false);
  const { t, b, dir } = useApp();
  const [view, setView] = useState<View>({ module: "dashboard" });
  const go = (module: string, id?: string, sub?: string) => setView({ module, id, sub });

  if (!authed) return <AdminLogin onLogin={() => setAuthed(true)} />;

  return (
    <div dir={dir} className="flex min-h-screen bg-zinc-100">
      <Toasts absolute={false} />
      {/* sidebar */}
      <aside className="sticky top-0 flex h-screen w-60 shrink-0 flex-col border-e border-zinc-200 bg-white">
        <div className="flex items-center gap-2 border-b border-zinc-100 px-5 py-4">
          <SannadLogo size="sm" horizontal />
        </div>
        <nav className="flex-1 space-y-1 overflow-y-auto p-3">
          {MENU.map((m) => (
            <button
              key={m.key}
              onClick={() => go(m.key)}
              className={cn(
                "flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-start text-xs font-semibold transition",
                view.module === m.key ? "bg-orange-50 text-orange-600" : "text-zinc-500 hover:bg-zinc-50"
              )}
            >
              <Icon name={m.icon} className="h-4 w-4" />
              {t(m.label)}
            </button>
          ))}
        </nav>
        <button
          onClick={() => setAuthed(false)}
          className="m-3 flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-xs font-semibold text-red-500 hover:bg-red-50"
        >
          <Icon name="logout" className="h-4 w-4 rtl:-scale-x-100" /> {t("logout")}
        </button>
      </aside>

      {/* main */}
      <div className="flex min-w-0 flex-1 flex-col">
        <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-zinc-200 bg-white px-6 py-3">
          <h1 className="text-sm font-bold text-zinc-900">{t(MENU.find((m) => m.key === view.module)?.label ?? "dashboard")}</h1>
          <div className="ms-auto flex items-center gap-3">
            <LangToggle />
            <button onClick={() => go("notifications")} className="relative text-zinc-500 hover:text-orange-600">
              <Icon name="bell" className="h-5 w-5" />
            </button>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-orange-600 text-[10px] font-bold text-white">
              SA
            </div>
          </div>
        </header>
        <main className="flex-1 p-6">
          <Module view={view} go={go} b={b} />
        </main>
      </div>
    </div>
  );
}

/* ---------- Modules ---------- */
function Module({ view, go }: { view: View; go: (m: string, id?: string, sub?: string) => void; b: (v: any) => string }) {
  switch (view.module) {
    case "users":
      return view.id ? <UserDetails id={view.id} go={go} /> : <Users go={go} />;
    case "services":
      return view.id ? <AdminServiceDetails id={view.id} go={go} sub={view.sub} /> : <AdminServices go={go} />;
    case "invoices":
      return view.sub === "create" ? <CreateInvoice go={go} /> : view.id ? <AdminInvoiceDetails id={view.id} go={go} /> : <AdminInvoices go={go} />;
    case "files":
      return view.id ? <AdminFileDetails id={view.id} go={go} /> : <AdminFiles go={go} />;
    case "notifications":
      return <AdminNotifications />;
    case "chat":
      return <AdminChat />;
    case "finance":
      return <Finance />;
    case "analytics":
      return <Analytics />;
    case "academy":
      return <AdminAcademy />;
    case "roles":
      return <Roles />;
    default:
      return <AdminDashboard go={go} />;
  }
}

function Crumb({ label, go }: { label: string; go: () => void }) {
  return (
    <button onClick={go} className="mb-4 inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-500 hover:text-orange-600">
      <Icon name="chevronL" className="h-3.5 w-3.5 rtl:rotate-180" /> {label}
    </button>
  );
}

function AdminDashboard({ go }: { go: (m: string, id?: string) => void }) {
  const { t, b, invoices, files, notifs, services, threads } = useApp();
  const stats = [
    { label: t("totalClients"), value: clients.length * 4993, icon: "user", to: "users" },
    { label: t("activeServices"), value: services.filter((s) => s.status !== "Completed").length * 699, icon: "services", to: "services" },
    { label: t("pendingInvoices"), value: invoices.filter((i) => i.status !== "Paid").length * 1070, icon: "invoices", to: "invoices" },
    { label: t("files"), value: files.length * 1137, icon: "files", to: "files" },
    { label: t("notifications"), value: notifs.length * 214, icon: "bell", to: "notifications" },
    { label: t("chat"), value: threads.length * 47, icon: "chat", to: "chat" },
  ];
  return (
    <div className="space-y-5">
      <div className="grid grid-cols-2 gap-4 xl:grid-cols-3 2xl:grid-cols-6">
        {stats.map((s) => (
          <Card key={s.label} onClick={() => go(s.to)}>
            <div className="mb-2 flex h-9 w-9 items-center justify-center rounded-xl bg-orange-50 text-orange-500">
              <Icon name={s.icon} className="h-4.5 w-4.5" />
            </div>
            <p className="text-xl font-bold text-zinc-900">{s.value.toLocaleString()}</p>
            <p className="text-[11px] text-zinc-500">{s.label}</p>
          </Card>
        ))}
      </div>
      <div className="grid gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <h3 className="mb-3 text-sm font-bold text-zinc-900">{t("revenue")}</h3>
          <AreaChart data={[20, 34, 28, 55, 42, 68, 60, 82, 74, 95]} />
        </Card>
        <Card>
          <h3 className="mb-3 text-sm font-bold text-zinc-900">{t("progress")}</h3>
          {services.map((s) => (
            <div key={s.id} className="mb-3">
              <div className="mb-1 flex justify-between text-[11px]">
                <span className="truncate text-zinc-600">{b(s.name)}</span>
                <span className="font-bold text-orange-600">{s.progress}%</span>
              </div>
              <Progress value={s.progress} className="h-1.5" />
            </div>
          ))}
        </Card>
      </div>
      <Card>
        <h3 className="mb-3 text-sm font-bold text-zinc-900">{t("recentActivity")}</h3>
        <table className="w-full text-xs">
          <thead>
            <tr className="text-start text-[11px] text-zinc-400">
              <th className="py-2 text-start font-semibold">{t("client")}</th>
              <th className="py-2 text-start font-semibold">{t("invoiceNumber")}</th>
              <th className="py-2 text-start font-semibold">{t("amount")}</th>
              <th className="py-2 text-start font-semibold">{t("status")}</th>
            </tr>
          </thead>
          <tbody>
            {invoices.map((i, k) => (
              <tr key={i.id} className="cursor-pointer border-t border-zinc-100 hover:bg-orange-50/40" onClick={() => go("invoices", i.id)}>
                <td className="py-2.5 font-semibold text-zinc-800">{b(clients[k % clients.length].name)}</td>
                <td className="py-2.5 text-zinc-600">{i.number}</td>
                <td className="py-2.5 text-zinc-600">{money(i.amount)}</td>
                <td className="py-2.5"><Status value={i.status} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

function Users({ go }: { go: (m: string, id?: string) => void }) {
  const { t, b } = useApp();
  const [q, setQ] = useState("");
  const list = clients.filter((c) => b(c.name).toLowerCase().includes(q.toLowerCase()) || c.code.includes(q));
  return (
    <Card>
      <div className="mb-4 flex items-center gap-3">
        <h3 className="text-sm font-bold text-zinc-900">{t("allClients")}</h3>
        <div className="ms-auto w-64">
          <Field value={q} onChange={setQ} placeholder={t("search")} />
        </div>
      </div>
      {list.length === 0 ? (
        <EmptyState icon="user" text="No clients match your search" />
      ) : (
        <table className="w-full text-xs">
          <thead>
            <tr className="text-[11px] text-zinc-400">
              {[t("client"), t("clientCode"), t("status"), t("services"), t("expiryDate"), t("actions")].map((h) => (
                <th key={h} className="py-2 text-start font-semibold">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {list.map((c) => (
              <tr key={c.id} className="border-t border-zinc-100 hover:bg-orange-50/40">
                <td className="py-3 font-semibold text-zinc-800">{b(c.name)}</td>
                <td className="py-3 text-zinc-600">{c.code}</td>
                <td className="py-3"><Status value={c.status} /></td>
                <td className="py-3 text-zinc-600">{c.services}</td>
                <td className="py-3 text-zinc-600">{c.expiry}</td>
                <td className="py-3">
                  <Button size="sm" variant="outline" onClick={() => go("users", c.id)}>
                    {t("open")}
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </Card>
  );
}

function UserDetails({ id, go }: { id: string; go: (m: string, i?: string) => void }) {
  const { t, b, services, invoices, toast } = useApp();
  const c = clients.find((x) => x.id === id) as Client;
  return (
    <div>
      <Crumb label={t("users")} go={() => go("users")} />
      <div className="grid gap-4 lg:grid-cols-3">
        <Card>
          <div className="flex items-center gap-3">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-orange-600 text-sm font-bold text-white">
              {b(c.name).slice(0, 2).toUpperCase()}
            </div>
            <div>
              <p className="text-sm font-bold text-zinc-900">{b(c.name)}</p>
              <p className="text-[11px] text-zinc-500">{c.code}</p>
              <Status value={c.status} className="mt-1" />
            </div>
          </div>
          <div className="mt-4 space-y-2 text-xs">
            {[[t("email"), c.email], [t("phone"), c.phone], [t("expiryDate"), c.expiry], [t("services"), String(c.services)]].map(([k, v]) => (
              <div key={k} className="flex justify-between"><span className="text-zinc-500">{k}</span><span className="font-semibold text-zinc-800">{v}</span></div>
            ))}
          </div>
          <div className="mt-4 flex gap-2">
            <Button size="sm" onClick={() => toast(t("saved"))}>{t("save")}</Button>
            <Button size="sm" variant="outline" onClick={() => go("chat")}>{t("chat")}</Button>
          </div>
        </Card>
        <Card className="lg:col-span-2">
          <h3 className="mb-3 text-sm font-bold text-zinc-900">{t("services")}</h3>
          {services.slice(0, c.services).map((s) => (
            <div key={s.id} className="mb-3 cursor-pointer rounded-xl border border-zinc-100 p-3 hover:border-orange-200" onClick={() => go("services", s.id)}>
              <div className="flex justify-between"><span className="text-xs font-semibold text-zinc-800">{b(s.name)}</span><Status value={s.status} /></div>
              <Progress value={s.progress} className="mt-2 h-1.5" />
            </div>
          ))}
          <h3 className="mb-2 mt-5 text-sm font-bold text-zinc-900">{t("invoices")}</h3>
          {invoices.slice(0, 3).map((i) => (
            <div key={i.id} className="flex cursor-pointer items-center justify-between border-t border-zinc-100 py-2 text-xs hover:bg-orange-50/40" onClick={() => go("invoices", i.id)}>
              <span className="font-semibold text-zinc-800">{i.number}</span>
              <span className="text-zinc-500">{money(i.amount)}</span>
              <Status value={i.status} />
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
}

function AdminServices({ go }: { go: (m: string, id?: string, sub?: string) => void }) {
  const { t, b, services } = useApp();
  return (
    <Card>
      <h3 className="mb-4 text-sm font-bold text-zinc-900">{t("services")}</h3>
      <table className="w-full text-xs">
        <thead>
          <tr className="text-[11px] text-zinc-400">
            {[t("client"), t("service"), t("status"), t("progress"), t("startDate"), t("deadline"), t("actions")].map((h) => (
              <th key={h} className="py-2 text-start font-semibold">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {services.map((s, k) => (
            <tr key={s.id} className="border-t border-zinc-100 hover:bg-orange-50/40">
              <td className="py-3 font-semibold text-zinc-800">{b(clients[k % clients.length].name)}</td>
              <td className="py-3 text-zinc-600">{b(s.name)}</td>
              <td className="py-3"><Status value={s.status} /></td>
              <td className="w-40 py-3">
                <div className="flex items-center gap-2">
                  <Progress value={s.progress} className="h-1.5 w-24" />
                  <span className="text-[10px] font-bold text-orange-600">{s.progress}%</span>
                </div>
              </td>
              <td className="py-3 text-zinc-600">{s.start}</td>
              <td className="py-3 text-zinc-600">{s.deadline}</td>
              <td className="py-3">
                <div className="flex gap-1.5">
                  <Button size="sm" variant="outline" onClick={() => go("services", s.id)}>{t("open")}</Button>
                  <Button size="sm" onClick={() => go("services", s.id, "edit")}>{t("editService")}</Button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}

function AdminServiceDetails({ id, go, sub }: { id: string; go: (m: string, i?: string, s?: string) => void; sub?: string }) {
  const { t, b, services, updateService, toast } = useApp();
  const s = services.find((x) => x.id === id)!;
  const [progress, setProgress] = useState(s.progress);
  const [status, setStatus] = useState(s.status);
  const [deadline, setDeadline] = useState(s.deadline);
  const editing = sub === "edit";

  return (
    <div>
      <Crumb label={t("services")} go={() => go("services")} />
      <div className="grid gap-4 lg:grid-cols-2">
        <Card>
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-zinc-900">{b(s.name)}</h3>
            <Status value={s.status} />
          </div>
          <p className="mt-2 text-xs text-zinc-500">{b(s.desc)}</p>
          <Progress value={s.progress} className="mt-4" />
          <div className="mt-2 flex justify-between text-[11px] text-zinc-500">
            <span>{t("startDate")}: {s.start}</span>
            <span>{t("deadline")}: {s.deadline}</span>
          </div>
          <div className="mt-4 space-y-2">
            {s.milestones.map((m, i) => (
              <div key={i} className="flex items-center gap-2 text-xs">
                <span className={cn("flex h-4 w-4 items-center justify-center rounded-full", m.done ? "bg-emerald-500 text-white" : "border border-zinc-300")}>
                  <Icon name="check" className="h-2.5 w-2.5" strokeWidth={3} />
                </span>
                <span className={m.done ? "text-zinc-800" : "text-zinc-400"}>{b(m.label)}</span>
              </div>
            ))}
          </div>
          {!editing && (
            <Button className="mt-4" size="sm" onClick={() => go("services", s.id, "edit")}>
              {t("editService")}
            </Button>
          )}
        </Card>

        {editing && (
          <Card>
            <h3 className="mb-3 text-sm font-bold text-zinc-900">{t("editService")}</h3>
            <label className="mb-1.5 block text-xs font-semibold text-zinc-500">{t("progress")}: {progress}%</label>
            <input type="range" min={0} max={100} value={progress} onChange={(e) => setProgress(+e.target.value)} className="mb-4 w-full accent-orange-500" />
            <label className="mb-1.5 block text-xs font-semibold text-zinc-500">{t("status")}</label>
            <select
              value={status}
              onChange={(e) => setStatus(e.target.value as typeof status)}
              className="mb-4 w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm outline-none focus:border-orange-400"
            >
              {["In Progress", "Completed", "Pending"].map((o) => (
                <option key={o} value={o}>{t(o)}</option>
              ))}
            </select>
            <Field label={t("deadline")} value={deadline} onChange={setDeadline} />
            <div className="mt-4 flex gap-2">
              <Button
                size="sm"
                onClick={() => {
                  updateService(s.id, { progress, status, deadline });
                  toast(t("saved"));
                  go("services", s.id);
                }}
              >
                {t("save")}
              </Button>
              <Button size="sm" variant="ghost" onClick={() => go("services", s.id)}>{t("cancel")}</Button>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
}

function AdminInvoices({ go }: { go: (m: string, id?: string, sub?: string) => void }) {
  const { t, b, invoices } = useApp();
  return (
    <Card>
      <div className="mb-4 flex items-center">
        <h3 className="text-sm font-bold text-zinc-900">{t("invoices")}</h3>
        <Button size="sm" className="ms-auto" onClick={() => go("invoices", undefined, "create")}>
          <Icon name="plus" className="h-3.5 w-3.5" /> {t("createInvoice")}
        </Button>
      </div>
      <table className="w-full text-xs">
        <thead>
          <tr className="text-[11px] text-zinc-400">
            {[t("client"), t("service"), t("invoiceNumber"), t("amount"), t("date"), t("status"), t("actions")].map((h) => (
              <th key={h} className="py-2 text-start font-semibold">{h}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {invoices.map((i, k) => (
            <tr key={i.id} className="border-t border-zinc-100 hover:bg-orange-50/40">
              <td className="py-3 font-semibold text-zinc-800">{b(clients[k % clients.length].name)}</td>
              <td className="py-3 text-zinc-600">{b(i.serviceName)}</td>
              <td className="py-3 text-zinc-600">{i.number}</td>
              <td className="py-3 text-zinc-600">{money(i.amount)}</td>
              <td className="py-3 text-zinc-600">{i.date}</td>
              <td className="py-3"><Status value={i.status} /></td>
              <td className="py-3">
                <Button size="sm" variant="outline" onClick={() => go("invoices", i.id)}>{t("open")}</Button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </Card>
  );
}

function AdminInvoiceDetails({ id, go }: { id: string; go: (m: string, i?: string) => void }) {
  const { t, b, invoices, payInvoice, toast } = useApp();
  const i = invoices.find((x) => x.id === id)!;
  return (
    <div>
      <Crumb label={t("invoices")} go={() => go("invoices")} />
      <Card className="max-w-xl">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-bold text-zinc-900">#{i.number}</h3>
          <Status value={i.status} />
        </div>
        <div className="mt-4 space-y-2 text-xs">
          {[[t("service"), b(i.serviceName)], [t("issuedDate"), i.date], [t("dueDate"), i.due]].map(([k, v]) => (
            <div key={k} className="flex justify-between"><span className="text-zinc-500">{k}</span><span className="font-semibold text-zinc-800">{v}</span></div>
          ))}
        </div>
        <div className="mt-4 space-y-2 border-t border-dashed border-zinc-200 pt-3 text-xs">
          {i.items.map((it, k) => (
            <div key={k} className="flex justify-between"><span className="text-zinc-600">{b(it.label)}</span><span className="font-semibold">{money(it.amount)}</span></div>
          ))}
        </div>
        <div className="mt-3 flex items-center justify-between border-t border-zinc-200 pt-3">
          <span className="text-sm font-bold">{t("amount")}</span>
          <span className="text-xl font-bold text-orange-600">{money(i.amount)}</span>
        </div>
        <div className="mt-4 flex gap-2">
          <Button size="sm" variant="outline" onClick={() => toast(t("pdfDownloaded"))}>
            <Icon name="download" className="h-3.5 w-3.5" /> {t("downloadPdf")}
          </Button>
          {i.status !== "Paid" && (
            <Button size="sm" variant="success" onClick={() => { payInvoice(i.id); toast(t("saved")); }}>
              {t("Paid")}
            </Button>
          )}
        </div>
      </Card>
    </div>
  );
}

function CreateInvoice({ go }: { go: (m: string, i?: string, s?: string) => void }) {
  const { t, b, services, addInvoice, toast } = useApp();
  const [client, setClient] = useState(clients[0].id);
  const [srv, setSrv] = useState(services[0].id);
  const [amount, setAmount] = useState("5000");
  const [due, setDue] = useState("28 Feb 2026");

  const submit = () => {
    const s = services.find((x) => x.id === srv)!;
    addInvoice({
      id: "inv-" + Date.now(),
      number: "INV-2026-" + String(Math.floor(Math.random() * 900) + 100),
      serviceId: s.id,
      serviceName: s.name,
      date: new Date().toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" }),
      due,
      amount: Number(amount) || 0,
      status: "Unpaid",
      items: [{ label: { en: "Service fee", ar: "رسوم الخدمة" }, amount: Number(amount) || 0 }],
    });
    toast(t("invoiceCreated"));
    go("invoices");
  };

  return (
    <div>
      <Crumb label={t("invoices")} go={() => go("invoices")} />
      <Card className="max-w-lg space-y-3">
        <h3 className="text-sm font-bold text-zinc-900">{t("createInvoice")}</h3>
        <label className="block text-xs font-semibold text-zinc-500">{t("client")}</label>
        <select value={client} onChange={(e) => setClient(e.target.value)} className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm outline-none focus:border-orange-400">
          {clients.map((c) => <option key={c.id} value={c.id}>{b(c.name)}</option>)}
        </select>
        <label className="block text-xs font-semibold text-zinc-500">{t("service")}</label>
        <select value={srv} onChange={(e) => setSrv(e.target.value)} className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm outline-none focus:border-orange-400">
          {services.map((s) => <option key={s.id} value={s.id}>{b(s.name)}</option>)}
        </select>
        <Field label={t("amount") + " (SAR)"} value={amount} onChange={setAmount} />
        <Field label={t("dueDate")} value={due} onChange={setDue} />
        <div className="flex gap-2 pt-1">
          <Button size="sm" onClick={submit}>{t("save")}</Button>
          <Button size="sm" variant="ghost" onClick={() => go("invoices")}>{t("cancel")}</Button>
        </div>
      </Card>
    </div>
  );
}

function AdminFiles({ go }: { go: (m: string, id?: string) => void }) {
  const { t, b, files } = useApp();
  const [client, setClient] = useState(clients[0].id);
  return (
    <div className="grid gap-4 lg:grid-cols-4">
      <Card className="lg:col-span-1">
        <h3 className="mb-3 text-sm font-bold text-zinc-900">{t("allClients")}</h3>
        {clients.map((c) => (
          <button
            key={c.id}
            onClick={() => setClient(c.id)}
            className={cn("mb-1 flex w-full items-center gap-2 rounded-xl px-3 py-2 text-start text-xs font-semibold", client === c.id ? "bg-orange-50 text-orange-600" : "text-zinc-600 hover:bg-zinc-50")}
          >
            <Icon name="user" className="h-3.5 w-3.5" /> {b(c.name)}
          </button>
        ))}
      </Card>
      <Card className="lg:col-span-3">
        <div className="mb-3 flex items-center gap-2">
          <h3 className="text-sm font-bold text-zinc-900">{b(clients.find((c) => c.id === client)!.name)}</h3>
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-600">
            <Icon name="drive" className="h-3 w-3" /> {t("syncedDrive")}
          </span>
        </div>
        <table className="w-full text-xs">
          <thead>
            <tr className="text-[11px] text-zinc-400">
              {["Name", t("fileType"), t("date"), t("fileSize"), t("status"), t("actions")].map((h) => <th key={h} className="py-2 text-start font-semibold">{h}</th>)}
            </tr>
          </thead>
          <tbody>
            {files.map((f) => (
              <tr key={f.id} className="border-t border-zinc-100 hover:bg-orange-50/40">
                <td className="py-3 font-semibold text-zinc-800">{b(f.name)}</td>
                <td className="py-3"><span className={cn("rounded px-1.5 py-0.5 text-[10px] font-bold", fileColor[f.type])}>{f.type}</span></td>
                <td className="py-3 text-zinc-600">{f.date}</td>
                <td className="py-3 text-zinc-600">{f.size}</td>
                <td className="py-3 text-[11px] font-semibold">
                  {f.sync === "synced" ? <span className="text-emerald-600">{t("syncedDrive")}</span> : f.sync === "syncing" ? <span className="text-amber-600">{t("syncing")}</span> : <span className="text-red-500">{t("notSynced")}</span>}
                </td>
                <td className="py-3"><Button size="sm" variant="outline" onClick={() => go("files", f.id)}>{t("open")}</Button></td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}

function AdminFileDetails({ id, go }: { id: string; go: (m: string, i?: string) => void }) {
  const { t, b, files, toast } = useApp();
  const f = files.find((x) => x.id === id)!;
  return (
    <div>
      <Crumb label={t("files")} go={() => go("files")} />
      <Card className="max-w-lg">
        <div className="flex items-center gap-4">
          <div className={cn("flex h-16 w-16 items-center justify-center rounded-2xl text-xs font-bold", fileColor[f.type])}>{f.type}</div>
          <div>
            <p className="text-sm font-bold text-zinc-900">{b(f.name)}</p>
            <p className="text-[11px] text-zinc-500">{f.size} · {f.date}</p>
          </div>
        </div>
        <div className="mt-4 space-y-2 text-xs">
          {[[t("category"), b(f.folder)], [t("status"), f.sync]].map(([k, v]) => (
            <div key={k} className="flex justify-between"><span className="text-zinc-500">{k}</span><span className="font-semibold text-zinc-800">{v}</span></div>
          ))}
        </div>
        <div className="mt-4 flex gap-2">
          <Button size="sm" onClick={() => toast("Opening in Google Drive… (prototype)", "info")}>{t("open")}</Button>
          <Button size="sm" variant="outline" onClick={() => toast(t("download") + " ✓")}>{t("download")}</Button>
        </div>
      </Card>
    </div>
  );
}

function AdminNotifications() {
  const { t, b, notifs, addNotif, toast } = useApp();
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [msg, setMsg] = useState("");
  const [aud, setAud] = useState("All clients");

  const send = () => {
    if (!title.trim()) return toast(t("invalidCreds"), "error");
    addNotif({
      id: "n-" + Date.now(),
      type: "announcement",
      title: { en: title, ar: title },
      body: { en: msg, ar: msg },
      time: new Date().toLocaleString("en-GB", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" }),
      read: false,
    });
    setTitle("");
    setMsg("");
    setOpen(false);
    toast(t("notifSent"));
  };

  return (
    <div className="grid gap-4 lg:grid-cols-3">
      <Card>
        <h3 className="mb-3 text-sm font-bold text-zinc-900">{t("compose")}</h3>
        <div className="space-y-3">
          <Field label={t("title")} value={title} onChange={setTitle} placeholder="Announcement title" />
          <label className="block">
            <span className="mb-1.5 block text-xs font-semibold text-zinc-500">{t("message")}</span>
            <textarea
              value={msg}
              onChange={(e) => setMsg(e.target.value)}
              rows={4}
              className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm outline-none focus:border-orange-400 focus:bg-white"
            />
          </label>
          <label className="block text-xs font-semibold text-zinc-500">{t("audience")}</label>
          <select value={aud} onChange={(e) => setAud(e.target.value)} className="w-full rounded-xl border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm outline-none focus:border-orange-400">
            <option>All clients</option>
            {clients.map((c) => <option key={c.id}>{b(c.name)}</option>)}
          </select>
          <Button size="md" className="w-full" onClick={() => setOpen(true)}>
            <Icon name="send" className="h-4 w-4" /> {t("sendNotification")}
          </Button>
        </div>
      </Card>
      <Card className="lg:col-span-2">
        <h3 className="mb-3 text-sm font-bold text-zinc-900">{t("history")}</h3>
        <div className="space-y-2">
          {notifs.map((n) => (
            <div key={n.id} className={cn("rounded-xl border p-3", n.read ? "border-zinc-100" : "border-orange-200 bg-orange-50/40")}>
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-zinc-900">{b(n.title)}</p>
                <span className="text-[10px] text-zinc-400">{n.time}</span>
              </div>
              <p className="mt-1 text-[11px] text-zinc-500">{b(n.body)}</p>
            </div>
          ))}
        </div>
      </Card>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-zinc-900/40 p-6">
          <div className="w-full max-w-sm rounded-2xl bg-white p-5 text-center shadow-2xl">
            <h3 className="text-sm font-bold text-zinc-900">{t("sendNotification")}</h3>
            <p className="mt-2 text-xs text-zinc-500">{aud} · {title || "—"}</p>
            <div className="mt-4 flex gap-2">
              <Button variant="ghost" className="flex-1" onClick={() => setOpen(false)}>{t("cancel")}</Button>
              <Button className="flex-1" onClick={send}>{t("confirm")}</Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function AdminChat() {
  const { t, b, threads, sendMessage } = useApp();
  const [active, setActive] = useState(threads[0].id);
  const [text, setText] = useState("");
  const th = threads.find((x) => x.id === active)!;
  const send = () => {
    if (!text.trim()) return;
    sendMessage(th.id, text, "agent");
    setText("");
  };
  return (
    <div className="grid h-[calc(100vh-140px)] gap-4 lg:grid-cols-4">
      <Card className="overflow-y-auto lg:col-span-1">
        <h3 className="mb-3 text-sm font-bold text-zinc-900">{t("conversations")}</h3>
        {threads.map((x) => (
          <button
            key={x.id}
            onClick={() => setActive(x.id)}
            className={cn("mb-1 flex w-full items-center gap-2 rounded-xl p-2.5 text-start", active === x.id ? "bg-orange-50" : "hover:bg-zinc-50")}
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-orange-600 text-[10px] font-bold text-white">{x.avatar}</span>
            <span className="min-w-0 flex-1">
              <span className="block text-xs font-bold text-zinc-800">{b(x.clientName)}</span>
              <span className="block truncate text-[10px] text-zinc-500">{b(x.dept)}</span>
            </span>
          </button>
        ))}
      </Card>
      <Card className="flex flex-col p-0 lg:col-span-3">
        <div className="border-b border-zinc-100 px-4 py-3">
          <p className="text-xs font-bold text-zinc-900">{b(th.clientName)}</p>
          <p className="text-[10px] text-zinc-500">{b(th.dept)}</p>
        </div>
        <div className="flex-1 space-y-3 overflow-y-auto bg-zinc-50 p-4">
          {th.messages.map((m) => (
            <div key={m.id} className={cn("flex", m.from === "agent" ? "justify-end" : "justify-start")}>
              <div className={cn("max-w-[60%] rounded-2xl px-3.5 py-2.5 text-xs shadow-sm", m.from === "agent" ? "bg-gradient-to-br from-orange-500 to-orange-600 text-white" : "bg-white text-zinc-700")}>
                <p>{m.text}</p>
                <p className={cn("mt-1 text-[9px]", m.from === "agent" ? "text-white/70" : "text-zinc-400")}>{m.time}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="flex items-center gap-2 border-t border-zinc-100 p-3">
          <input
            value={text}
            onChange={(e) => setText(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && send()}
            placeholder={t("typeMessage")}
            className="flex-1 rounded-full border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-xs outline-none focus:border-orange-400 focus:bg-white"
          />
          <Button size="md" onClick={send}>
            <Icon name="send" className="h-4 w-4 rtl:-scale-x-100" /> {t("reply")}
          </Button>
        </div>
      </Card>
    </div>
  );
}

function Finance() {
  const { t, invoices } = useApp();
  const paid = invoices.filter((i) => i.status === "Paid").reduce((a, c) => a + c.amount, 0);
  const due = invoices.filter((i) => i.status !== "Paid").reduce((a, c) => a + c.amount, 0);
  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-3">
        {[
          { l: "Collected", v: money(paid), c: "text-emerald-600" },
          { l: "Outstanding", v: money(due), c: "text-orange-600" },
          { l: "Total Invoiced", v: money(paid + due), c: "text-zinc-900" },
        ].map((x) => (
          <Card key={x.l}>
            <p className="text-[11px] text-zinc-500">{x.l}</p>
            <p className={cn("mt-1 text-2xl font-bold", x.c)}>{x.v}</p>
          </Card>
        ))}
      </div>
      <Card>
        <h3 className="mb-3 text-sm font-bold text-zinc-900">{t("revenue")}</h3>
        <Bars data={[40, 62, 51, 78, 66, 90, 72, 96, 84, 110, 98, 125]} />
      </Card>
    </div>
  );
}

function Analytics() {
  const { t } = useApp();
  return (
    <div className="grid gap-4 lg:grid-cols-2">
      <Card>
        <h3 className="mb-3 text-sm font-bold text-zinc-900">Client Growth</h3>
        <AreaChart data={[12, 19, 25, 30, 44, 52, 61, 78, 90, 112]} />
      </Card>
      <Card>
        <h3 className="mb-3 text-sm font-bold text-zinc-900">Service Completion</h3>
        <Bars data={[55, 70, 62, 88, 74, 92]} />
      </Card>
      <Card className="lg:col-span-2">
        <h3 className="mb-3 text-sm font-bold text-zinc-900">{t("packageInfo")}</h3>
        {packages.map((p) => (
          <div key={p.id} className="mb-3">
            <div className="mb-1 flex justify-between text-xs"><span className="text-zinc-600">{p.name.en}</span><span className="font-bold text-orange-600">{p.progress}%</span></div>
            <Progress value={p.progress} />
          </div>
        ))}
      </Card>
    </div>
  );
}

function AdminAcademy() {
  const { t, b, toast } = useApp();
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {courses.map((c) => (
        <Card key={c.id}>
          <div className={cn("mb-3 flex h-24 items-center justify-center rounded-xl bg-gradient-to-br text-white", c.color)}>
            <Icon name="academy" className="h-9 w-9" />
          </div>
          <p className="text-sm font-bold text-zinc-900">{b(c.title)}</p>
          <p className="text-[11px] text-zinc-500">{b(c.category)}</p>
          <Progress value={c.progress} className="mt-2 h-1.5" />
          <div className="mt-3 flex gap-2">
            <Button size="sm" variant="outline" onClick={() => toast(b(c.title), "info")}>{t("open")}</Button>
            <Button size="sm" onClick={() => toast(t("saved"))}>{t("save")}</Button>
          </div>
        </Card>
      ))}
    </div>
  );
}

function Roles() {
  const { t, b, perms, togglePerm, toast } = useApp();
  const [role, setRole] = useState(roleMatrix.roles[0]);
  return (
    <div className="grid gap-4 lg:grid-cols-4">
      <Card>
        <h3 className="mb-3 text-sm font-bold text-zinc-900">{t("roles")}</h3>
        {roleMatrix.roles.map((r) => (
          <button
            key={r}
            onClick={() => setRole(r)}
            className={cn("mb-1 flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-start text-xs font-semibold", role === r ? "bg-orange-50 text-orange-600" : "text-zinc-600 hover:bg-zinc-50")}
          >
            <Icon name="shield" className="h-3.5 w-3.5" /> {r}
          </button>
        ))}
      </Card>
      <Card className="lg:col-span-3">
        <div className="mb-4 flex items-center">
          <h3 className="text-sm font-bold text-zinc-900">{role}</h3>
          <Button size="sm" className="ms-auto" onClick={() => toast(t("saved"))}>{t("save")}</Button>
        </div>
        <table className="w-full text-xs">
          <thead>
            <tr className="text-[11px] text-zinc-400">
              <th className="py-2 text-start font-semibold">Permission</th>
              {roleMatrix.roles.map((r) => <th key={r} className="py-2 text-center font-semibold">{r}</th>)}
            </tr>
          </thead>
          <tbody>
            {roleMatrix.perms.map((p) => (
              <tr key={p.key} className="border-t border-zinc-100">
                <td className="py-3 font-semibold text-zinc-700">{b(p.label)}</td>
                {roleMatrix.roles.map((r) => (
                  <td key={r} className="py-3 text-center">
                    <button
                      onClick={() => togglePerm(r, p.key)}
                      className={cn(
                        "inline-flex h-5 w-9 items-center rounded-full p-0.5 transition",
                        perms[r][p.key] ? "bg-orange-500" : "bg-zinc-200"
                      )}
                    >
                      <span className={cn("h-4 w-4 rounded-full bg-white shadow transition", perms[r][p.key] ? "translate-x-4 rtl:-translate-x-4" : "")} />
                    </button>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
