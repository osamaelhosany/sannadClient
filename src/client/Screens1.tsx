import { useEffect, useState } from "react";
import { useApp } from "../lib/store";
import { Button, Card, EmptyState, Icon, Progress, Ring, Spinner, Status, Modal } from "../components/ui";
import { Body, ScreenHeader, SectionTitle, fileColor, money, type Nav } from "./parts";
import { packages, courses } from "../lib/data";

/* ================= DASHBOARD ================= */
export function Dashboard({ nav }: { nav: Nav }) {
  const { t, b, profile, services, invoices, files, notifs, unreadCount } = useApp();
  const active = services.filter((s) => s.status !== "Completed");
  const latest = invoices.find((i) => i.status !== "Paid") ?? invoices[0];

  return (
    <div className="screen-enter pb-28">
      {/* header */}
      <div className="bg-gradient-to-br from-orange-500 via-orange-500 to-amber-500 px-4 pb-14 pt-5 text-white">
        <div className="flex items-center gap-3">
          <button
            onClick={() => nav.push("profile")}
            className="flex h-11 w-11 items-center justify-center rounded-full bg-white/20 text-sm font-bold ring-2 ring-white/40"
          >
            {b(profile.name).slice(0, 2).toUpperCase()}
          </button>
          <div className="flex-1">
            <p className="text-xs text-white/80">{t("hello")}</p>
            <p className="text-base font-bold">{b(profile.name)}</p>
          </div>
          <button
            onClick={() => nav.push("chat")}
            className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/15"
          >
            <Icon name="chat" className="h-5 w-5" />
          </button>
          <button
            onClick={() => nav.goTab("notifications")}
            className="relative flex h-9 w-9 items-center justify-center rounded-xl bg-white/15"
          >
            <Icon name="bell" className="h-5 w-5" />
            {unreadCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-white px-1 text-[9px] font-bold text-orange-600">
                {unreadCount}
              </span>
            )}
          </button>
        </div>
        <p className="mt-3 text-[11px] text-white/80">
          {t("clientCode")}: <span className="font-semibold text-white">{profile.code}</span> · {t(profile.status)}
        </p>
      </div>

      <div className="-mt-10 space-y-4 px-4">
        {/* stat cards */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { k: "services", v: active.length, tab: "services", icon: "services" },
            { k: "invoices", v: invoices.filter((i) => i.status !== "Paid").length, tab: "invoices", icon: "invoices" },
            { k: "files", v: files.length, tab: "files", icon: "files" },
          ].map((s) => (
            <button
              key={s.k}
              onClick={() => nav.goTab(s.tab)}
              className="rounded-2xl border border-zinc-100 bg-white p-3 text-start shadow-sm transition active:scale-95"
            >
              <div className="mb-1.5 flex h-7 w-7 items-center justify-center rounded-lg bg-orange-50 text-orange-500">
                <Icon name={s.icon} className="h-4 w-4" />
              </div>
              <p className="text-lg font-bold leading-none text-zinc-900">{s.v}</p>
              <p className="mt-1 text-[10px] text-zinc-500">{t(s.k)}</p>
            </button>
          ))}
        </div>

        <SectionTitle text={t("activeServices")} onAction={() => nav.goTab("services")} actionText={t("seeAll")} />
        <div className="no-scrollbar -mx-4 flex snap-x gap-3 overflow-x-auto px-4 pb-1">
          {active.map((s) => (
            <button
              key={s.id}
              onClick={() => nav.push("service", s.id)}
              className="w-56 shrink-0 snap-start rounded-2xl border border-zinc-100 bg-white p-4 text-start shadow-sm transition active:scale-[.98]"
            >
              <div className="mb-2 flex items-start justify-between gap-2">
                <p className="line-clamp-2 text-sm font-bold text-zinc-900">{b(s.name)}</p>
                <Status value={s.status} />
              </div>
              <Progress value={s.progress} />
              <div className="mt-2 flex justify-between text-[11px] text-zinc-500">
                <span>{t("deadline")}: {s.deadline}</span>
                <span className="font-bold text-orange-600">{s.progress}%</span>
              </div>
            </button>
          ))}
        </div>

        <SectionTitle text={t("latestInvoice")} onAction={() => nav.goTab("invoices")} actionText={t("seeAll")} />
        <Card onClick={() => nav.push("invoice", latest.id)}>
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-orange-500">
              <Icon name="invoices" className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-zinc-900">{latest.number}</p>
              <p className="text-[11px] text-zinc-500">{b(latest.serviceName)}</p>
            </div>
            <div className="text-end">
              <p className="text-sm font-bold text-zinc-900">{money(latest.amount)}</p>
              <Status value={latest.status} className="mt-1" />
            </div>
          </div>
          {latest.status !== "Paid" && (
            <Button
              className="mt-3 w-full"
              onClick={(e) => {
                e.stopPropagation();
                nav.push("pay", latest.id);
              }}
            >
              {t("payNow")}
            </Button>
          )}
        </Card>

        <SectionTitle text={t("recentFiles")} onAction={() => nav.goTab("files")} actionText={t("seeAll")} />
        <div className="grid grid-cols-4 gap-2">
          {files.slice(0, 4).map((f) => (
            <button
              key={f.id}
              onClick={() => nav.push("file", f.id)}
              className="rounded-2xl border border-zinc-100 bg-white p-2.5 text-center shadow-sm transition active:scale-95"
            >
              <div className={`mx-auto mb-1.5 flex h-8 w-8 items-center justify-center rounded-lg text-[9px] font-bold ${fileColor[f.type]}`}>
                {f.type}
              </div>
              <p className="line-clamp-2 text-[9px] leading-tight text-zinc-600">{b(f.name)}</p>
            </button>
          ))}
        </div>

        <SectionTitle text={t("academy")} onAction={() => nav.push("academy")} actionText={t("seeAll")} />
        <Card onClick={() => nav.push("course", courses[0].id)} className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-orange-400 to-orange-600 text-white">
            <Icon name="academy" className="h-6 w-6" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-bold text-zinc-900">{b(courses[0].title)}</p>
            <p className="mb-1.5 text-[11px] text-zinc-500">{b(courses[0].category)}</p>
            <Progress value={courses[0].progress} className="h-1.5" />
          </div>
          <Icon name="chevronR" className="h-4 w-4 text-zinc-300 rtl:rotate-180" />
        </Card>

        <SectionTitle text={t("recentNotifications")} onAction={() => nav.goTab("notifications")} actionText={t("seeAll")} />
        <div className="space-y-2">
          {notifs.slice(0, 3).map((n) => (
            <Card key={n.id} onClick={() => nav.push("notification", n.id)} className="flex items-center gap-3 p-3">
              <div className={`flex h-9 w-9 items-center justify-center rounded-xl ${n.read ? "bg-zinc-100 text-zinc-400" : "bg-orange-50 text-orange-500"}`}>
                <Icon name={n.type === "file" ? "files" : n.type === "service" ? "services" : n.type === "announcement" ? "megaphone" : "invoices"} className="h-4 w-4" />
              </div>
              <div className="flex-1">
                <p className={`text-xs ${n.read ? "font-medium text-zinc-600" : "font-bold text-zinc-900"}`}>{b(n.title)}</p>
                <p className="text-[10px] text-zinc-400">{n.time}</p>
              </div>
              {!n.read && <span className="h-2 w-2 rounded-full bg-orange-500" />}
            </Card>
          ))}
        </div>

        <Button variant="outline" size="lg" className="mt-2" onClick={() => nav.push("request")}>
          <Icon name="plus" className="h-4 w-4" /> {t("requestNewService")}
        </Button>
      </div>
    </div>
  );
}

/* ================= SERVICES ================= */
export function ServicesList({ nav }: { nav: Nav }) {
  const { t, b, services } = useApp();
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const id = setTimeout(() => setLoading(false), 550);
    return () => clearTimeout(id);
  }, []);

  return (
    <>
      <ScreenHeader title={t("servicesList")} nav={nav} />
      <Body>
        {loading ? (
          <div className="flex flex-col items-center gap-3 py-20">
            <Spinner className="h-8 w-8" />
            <p className="text-xs text-zinc-400">{t("loading")}</p>
          </div>
        ) : services.length === 0 ? (
          <EmptyState icon="services" text={t("noServices")} />
        ) : (
          <>
            <Card onClick={() => nav.push("package", packages[0].id)} className="bg-gradient-to-br from-orange-50 to-amber-50">
              <div className="flex items-center gap-2">
                <span className="rounded-lg bg-orange-500 px-2 py-1 text-[10px] font-bold text-white">
                  {t("packageInfo")}
                </span>
                <Status value={packages[0].status} />
                <Icon name="chevronR" className="ms-auto h-4 w-4 text-orange-400 rtl:rotate-180" />
              </div>
              <p className="mt-2 text-sm font-bold text-zinc-900">{b(packages[0].name)}</p>
              <Progress value={packages[0].progress} className="mt-2" />
              <p className="mt-1.5 text-[11px] text-zinc-500">
                {packages[0].serviceIds.length} {t("includedServices")} · {packages[0].progress}%
              </p>
            </Card>

            {services.map((s) => (
              <Card key={s.id} onClick={() => nav.push("service", s.id)}>
                <div className="flex items-start justify-between gap-2">
                  <p className="text-sm font-bold text-zinc-900">{b(s.name)}</p>
                  <Status value={s.status} />
                </div>
                <Progress value={s.progress} className="mt-2.5" />
                <div className="mt-2 flex items-center justify-between text-[11px] text-zinc-500">
                  <span>{t("startDate")}: {s.start}</span>
                  <span className="font-bold text-orange-600">{s.progress}%</span>
                </div>
                <div className="mt-1 text-[11px] text-zinc-500">{t("deadline")}: {s.deadline}</div>
              </Card>
            ))}
            <Button variant="outline" size="lg" onClick={() => nav.push("request")}>
              <Icon name="plus" className="h-4 w-4" /> {t("requestNewService")}
            </Button>
          </>
        )}
      </Body>
    </>
  );
}

export function ServiceDetails({ nav, id }: { nav: Nav; id: string }) {
  const { t, b, services, invoices } = useApp();
  const s = services.find((x) => x.id === id);
  if (!s) return <EmptyState text="Not found" />;
  const pkg = packages.find((p) => p.id === s.packageId);
  const related = invoices.filter((i) => i.serviceId === s.id);

  return (
    <>
      <ScreenHeader title={t("serviceDetails")} nav={nav} />
      <Body>
        <Card className="flex flex-col items-center py-6">
          <p className="mb-3 text-center text-base font-bold text-zinc-900">{b(s.name)}</p>
          <div className="relative">
            <Ring value={s.progress} />
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-2xl font-bold text-zinc-900">{s.progress}%</span>
              <span className="text-[10px] text-zinc-400">{t("progress")}</span>
            </div>
          </div>
          <Status value={s.status} className="mt-3" />
          <p className="mt-3 px-4 text-center text-xs text-zinc-500">{b(s.desc)}</p>
        </Card>

        <div className="grid grid-cols-2 gap-3">
          <Card className="p-3">
            <p className="text-[11px] text-zinc-500">{t("startDate")}</p>
            <p className="mt-1 text-sm font-bold text-zinc-900">{s.start}</p>
          </Card>
          <Card className="p-3">
            <p className="text-[11px] text-zinc-500">{t("deadline")}</p>
            <p className="mt-1 text-sm font-bold text-zinc-900">{s.deadline}</p>
          </Card>
        </div>

        {pkg && (
          <Card onClick={() => nav.push("package", pkg.id)}>
            <p className="text-[11px] text-zinc-500">{t("packageInfo")}</p>
            <div className="mt-1 flex items-center justify-between">
              <p className="text-sm font-bold text-zinc-900">{b(pkg.name)}</p>
              <Icon name="chevronR" className="h-4 w-4 text-zinc-300 rtl:rotate-180" />
            </div>
          </Card>
        )}

        <SectionTitle text={t("includedServices")} />
        <Card className="space-y-2.5">
          {s.milestones.map((m, i) => (
            <div key={i} className="flex items-center gap-2.5">
              <span
                className={`flex h-5 w-5 items-center justify-center rounded-full ${
                  m.done ? "bg-emerald-500 text-white" : "border border-zinc-300 text-transparent"
                }`}
              >
                <Icon name="check" className="h-3 w-3" strokeWidth={3} />
              </span>
              <span className={`text-xs ${m.done ? "text-zinc-900" : "text-zinc-400"}`}>{b(m.label)}</span>
            </div>
          ))}
        </Card>

        {related.length > 0 && (
          <>
            <SectionTitle text={t("invoices")} />
            {related.map((i) => (
              <Card key={i.id} onClick={() => nav.push("invoice", i.id)} className="flex items-center gap-3 p-3">
                <div className="flex-1">
                  <p className="text-xs font-bold text-zinc-900">{i.number}</p>
                  <p className="text-[10px] text-zinc-500">{i.date}</p>
                </div>
                <span className="text-xs font-bold">{money(i.amount)}</span>
                <Status value={i.status} />
              </Card>
            ))}
          </>
        )}
      </Body>
    </>
  );
}

export function PackageDetails({ nav, id }: { nav: Nav; id: string }) {
  const { t, b, services } = useApp();
  const pkg = packages.find((p) => p.id === id)!;
  const list = services.filter((s) => pkg.serviceIds.includes(s.id));
  return (
    <>
      <ScreenHeader title={t("packageDetails")} nav={nav} />
      <Body>
        <Card className="bg-gradient-to-br from-orange-50 to-amber-50">
          <div className="flex items-center justify-between">
            <p className="text-base font-bold text-zinc-900">{b(pkg.name)}</p>
            <Status value={pkg.status} />
          </div>
          <p className="mt-2 text-xs text-zinc-500">{b(pkg.desc)}</p>
          <Progress value={pkg.progress} className="mt-3" />
          <p className="mt-1.5 text-end text-[11px] font-bold text-orange-600">{pkg.progress}%</p>
        </Card>
        <SectionTitle text={t("includedServices")} />
        {list.map((s) => (
          <Card key={s.id} onClick={() => nav.push("service", s.id)}>
            <div className="flex items-center justify-between gap-2">
              <p className="text-sm font-bold text-zinc-900">{b(s.name)}</p>
              <Status value={s.status} />
            </div>
            <Progress value={s.progress} className="mt-2" />
            <div className="mt-1.5 flex justify-between text-[11px] text-zinc-500">
              <span>{s.deadline}</span>
              <span className="font-bold text-orange-600">{s.progress}%</span>
            </div>
          </Card>
        ))}
      </Body>
    </>
  );
}

export function RequestService({ nav }: { nav: Nav }) {
  const { t, toast } = useApp();
  const [leaving, setLeaving] = useState(false);
  return (
    <>
      <ScreenHeader title={t("requestNewService")} nav={nav} />
      <Body>
        <div className="rounded-3xl bg-gradient-to-br from-orange-500 to-amber-500 p-6 text-center text-white shadow-xl shadow-orange-500/20">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-white/20">
            <Icon name="whatsapp" className="h-7 w-7" />
          </div>
          <h2 className="text-xl font-bold">{t("needNewService")}</h2>
          <p className="mx-auto mt-2 max-w-[16rem] text-xs text-white/85">{t("leavingApp")}</p>
          <button
            onClick={() => setLeaving(true)}
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white px-4 py-3 text-sm font-bold text-orange-600 shadow-lg active:scale-95"
          >
            <Icon name="whatsapp" className="h-4 w-4" /> {t("requestViaWhatsapp")}
          </button>
        </div>
        <Card>
          <p className="text-xs font-bold text-zinc-900">{t("contactCS")}</p>
          <p className="mt-1 text-[11px] text-zinc-500">+966 55 000 1122 · Sannad Customer Success</p>
        </Card>

        <Modal open={leaving} onClose={() => setLeaving(false)} title={t("contactCS")}>
          <div className="flex flex-col items-center gap-3 pb-2 text-center">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-500">
              <Icon name="whatsapp" className="h-7 w-7" />
            </div>
            <p className="text-xs text-zinc-500">{t("leavingApp")}</p>
            <div className="mt-2 flex w-full gap-2">
              <Button variant="ghost" className="flex-1" onClick={() => setLeaving(false)}>
                {t("cancel")}
              </Button>
              <Button
                variant="success"
                className="flex-1"
                onClick={() => {
                  setLeaving(false);
                  toast("Opening WhatsApp… (prototype)", "info");
                  nav.pop();
                }}
              >
                {t("continueBtn")}
              </Button>
            </div>
          </div>
        </Modal>
      </Body>
    </>
  );
}

/* ================= INVOICES ================= */
export function InvoiceList({ nav }: { nav: Nav }) {
  const { t, b, invoices } = useApp();
  const [filter, setFilter] = useState("All");
  const filters = ["All", "Unpaid", "Paid", "Overdue"];
  const list = invoices.filter((i) => filter === "All" || i.status === filter);
  return (
    <>
      <ScreenHeader title={t("invoiceList")} nav={nav} />
      <Body>
        <div className="no-scrollbar -mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
          {filters.map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`shrink-0 rounded-full px-3.5 py-1.5 text-xs font-semibold transition ${
                filter === f ? "bg-orange-500 text-white shadow" : "bg-white text-zinc-500 border border-zinc-200"
              }`}
            >
              {f === "All" ? (t("seeAll") === "عرض الكل" ? "الكل" : "All") : t(f)}
            </button>
          ))}
        </div>
        {list.length === 0 ? (
          <EmptyState icon="invoices" text={t("noInvoices")} />
        ) : (
          list.map((i) => (
            <Card key={i.id} onClick={() => nav.push("invoice", i.id)}>
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-bold text-zinc-900">{i.number}</p>
                  <p className="mt-0.5 text-[11px] text-zinc-500">{b(i.serviceName)}</p>
                </div>
                <Status value={i.status} />
              </div>
              <div className="mt-3 flex items-end justify-between border-t border-dashed border-zinc-100 pt-2.5">
                <span className="text-[11px] text-zinc-500">{i.date}</span>
                <span className="text-base font-bold text-zinc-900">{money(i.amount)}</span>
              </div>
            </Card>
          ))
        )}
      </Body>
    </>
  );
}

export function InvoiceDetails({ nav, id }: { nav: Nav; id: string }) {
  const { t, b, invoices, toast } = useApp();
  const inv = invoices.find((i) => i.id === id)!;
  return (
    <>
      <ScreenHeader title={t("invoiceDetails")} nav={nav} />
      <Body>
        <Card>
          <div className="flex items-center justify-between">
            <p className="text-lg font-bold text-zinc-900">#{inv.number}</p>
            <Status value={inv.status} />
          </div>
          <div className="mt-4 space-y-2.5 text-xs">
            {[
              [t("service"), b(inv.serviceName)],
              [t("issuedDate"), inv.date],
              [t("dueDate"), inv.due],
              [t("clientCode"), "SND-10245"],
            ].map(([k, v]) => (
              <div key={k} className="flex justify-between">
                <span className="text-zinc-500">{k}</span>
                <span className="font-semibold text-zinc-900">{v}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 space-y-2 border-t border-dashed border-zinc-200 pt-3 text-xs">
            {inv.items.map((it, k) => (
              <div key={k} className="flex justify-between">
                <span className="text-zinc-600">{b(it.label)}</span>
                <span className="font-semibold text-zinc-900">{money(it.amount)}</span>
              </div>
            ))}
          </div>
          <div className="mt-3 flex items-center justify-between border-t border-zinc-200 pt-3">
            <span className="text-sm font-bold text-zinc-900">{t("amount")}</span>
            <span className="text-xl font-bold text-orange-600">{money(inv.amount)}</span>
          </div>
        </Card>

        <Button variant="outline" size="lg" onClick={() => toast(t("pdfDownloaded"))}>
          <Icon name="download" className="h-4 w-4" /> {t("downloadPdf")}
        </Button>

        {inv.status !== "Paid" ? (
          <>
            <Button size="lg" onClick={() => nav.push("pay", inv.id)}>
              {t("payInvoice")}
            </Button>
            <p className="text-center text-[11px] text-zinc-400">
              {t("viaInstapay")} <span className="font-bold text-orange-600">InstaPay</span>
            </p>
          </>
        ) : (
          <div className="flex items-center justify-center gap-2 rounded-xl bg-emerald-50 py-3 text-xs font-semibold text-emerald-600">
            <Icon name="check" className="h-4 w-4" /> {t("Paid")}
          </div>
        )}
      </Body>
    </>
  );
}

export function PayFlow({ nav, id }: { nav: Nav; id: string }) {
  const { t, b, invoices, payInvoice } = useApp();
  const inv = invoices.find((i) => i.id === id)!;
  const [step, setStep] = useState<"confirm" | "handoff" | "loading" | "done">("confirm");

  useEffect(() => {
    if (step === "loading") {
      const to = setTimeout(() => {
        payInvoice(inv.id);
        setStep("done");
      }, 1800);
      return () => clearTimeout(to);
    }
  }, [step]);

  return (
    <>
      <ScreenHeader title={t("paymentConfirmation")} nav={nav} onBack={() => (step === "confirm" ? nav.pop() : setStep("confirm"))} />
      <Body>
        {step === "confirm" && (
          <>
            <Card className="text-center">
              <div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-50 text-orange-500">
                <Icon name="card" className="h-7 w-7" />
              </div>
              <p className="text-xs text-zinc-500">{t("confirmPayText")}</p>
              <p className="mt-4 text-3xl font-bold text-zinc-900">{money(inv.amount)}</p>
              <p className="mt-1 text-xs text-zinc-500">
                {inv.number} · {b(inv.serviceName)}
              </p>
            </Card>
            <Card className="flex items-center gap-3">
              <div className="flex h-10 w-16 items-center justify-center rounded-lg bg-gradient-to-r from-orange-500 to-amber-500 text-[10px] font-bold text-white">
                InstaPay
              </div>
              <div>
                <p className="text-xs font-bold text-zinc-900">InstaPay</p>
                <p className="text-[10px] text-zinc-500">{t("externalPayment")}</p>
              </div>
              <Icon name="check" className="ms-auto h-5 w-5 text-emerald-500" />
            </Card>
            <Button size="lg" onClick={() => setStep("handoff")}>
              {t("continueToInstapay")}
            </Button>
            <Button variant="ghost" size="lg" onClick={() => nav.pop()}>
              {t("cancel")}
            </Button>
          </>
        )}

        {step === "handoff" && (
          <div className="rounded-3xl border border-zinc-200 bg-white p-6 text-center">
            <div className="mx-auto mb-4 flex h-16 w-28 items-center justify-center rounded-xl bg-gradient-to-r from-orange-500 to-amber-500 text-sm font-bold text-white">
              InstaPay
            </div>
            <p className="text-sm font-bold text-zinc-900">{t("externalPayment")}</p>
            <p className="mx-auto mt-2 max-w-[15rem] text-xs text-zinc-500">
              You will be redirected to the InstaPay application to complete a transfer of {money(inv.amount)} to Sannad
              Business Solutions.
            </p>
            <div className="mt-4 rounded-xl bg-zinc-50 p-3 text-start text-[11px]">
              <div className="flex justify-between py-0.5"><span className="text-zinc-500">Beneficiary</span><span className="font-semibold">SANNAD@instapay</span></div>
              <div className="flex justify-between py-0.5"><span className="text-zinc-500">Reference</span><span className="font-semibold">{inv.number}</span></div>
              <div className="flex justify-between py-0.5"><span className="text-zinc-500">{t("amount")}</span><span className="font-semibold">{money(inv.amount)}</span></div>
            </div>
            <Button size="lg" className="mt-5" onClick={() => setStep("loading")}>
              {t("continueToInstapay")}
            </Button>
            <Button variant="ghost" size="lg" className="mt-1" onClick={() => setStep("confirm")}>
              {t("cancel")}
            </Button>
          </div>
        )}

        {step === "loading" && (
          <div className="flex flex-col items-center gap-4 py-24">
            <Spinner className="h-10 w-10" />
            <p className="text-xs text-zinc-500">{t("redirecting")}</p>
          </div>
        )}

        {step === "done" && (
          <div className="flex flex-col items-center gap-3 py-14 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500 text-white shadow-lg shadow-emerald-500/30">
              <Icon name="check" className="h-10 w-10" strokeWidth={3} />
            </div>
            <p className="text-lg font-bold text-zinc-900">{t("paymentSuccess")}</p>
            <p className="max-w-[15rem] text-xs text-zinc-500">{t("paymentSuccessText")}</p>
            <div className="mt-4 w-full space-y-2">
              <Button size="lg" onClick={() => nav.goTab("invoices")}>
                {t("backToInvoices")}
              </Button>
              <Button variant="ghost" size="lg" onClick={nav.home}>
                {t("home")}
              </Button>
            </div>
          </div>
        )}
      </Body>
    </>
  );
}
