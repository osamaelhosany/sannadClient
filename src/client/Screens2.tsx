import { useEffect, useRef, useState } from "react";
import { useApp } from "../lib/store";
import { Button, Card, EmptyState, Field, Icon, Modal, Progress, Spinner, Status } from "../components/ui";
import { Body, ScreenHeader, SectionTitle, fileColor, type Nav } from "./parts";
import { courses } from "../lib/data";

/* ================= FILES ================= */
function SyncBadge({ sync }: { sync: string }) {
  const { t } = useApp();
  if (sync === "synced")
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-600">
        <Icon name="drive" className="h-3 w-3" /> {t("syncedDrive")}
      </span>
    );
  if (sync === "syncing")
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2 py-0.5 text-[10px] font-semibold text-amber-600">
        <Icon name="refresh" className="h-3 w-3" /> {t("syncing")}
      </span>
    );
  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-red-50 px-2 py-0.5 text-[10px] font-semibold text-red-600">
      <Icon name="x" className="h-3 w-3" /> {t("notSynced")}
    </span>
  );
}

export function FilesList({ nav }: { nav: Nav }) {
  const { t, b, files } = useApp();
  const [q, setQ] = useState("");
  const list = files.filter((f) => b(f.name).toLowerCase().includes(q.toLowerCase()));
  return (
    <>
      <ScreenHeader title={t("filesLibrary")} nav={nav} />
      <Body>
        <div className="flex items-center justify-center gap-2 rounded-xl bg-amber-50 py-2 text-[11px] font-semibold text-amber-700">
          <Icon name="drive" className="h-3.5 w-3.5" /> {t("syncedDrive")}
        </div>
        <Field value={q} onChange={setQ} placeholder={t("search")} />
        {list.length === 0 ? (
          <EmptyState icon="files" text={t("noFiles")} />
        ) : (
          list.map((f) => (
            <Card key={f.id} onClick={() => nav.push("file", f.id)} className="flex items-center gap-3 p-3">
              <div className={`flex h-10 w-10 items-center justify-center rounded-xl text-[9px] font-bold ${fileColor[f.type]}`}>
                {f.type}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-xs font-bold text-zinc-900">{b(f.name)}</p>
                <p className="text-[10px] text-zinc-500">{f.date} · {f.size}</p>
                <div className="mt-1"><SyncBadge sync={f.sync} /></div>
              </div>
              <Icon name="chevronR" className="h-4 w-4 text-zinc-300 rtl:rotate-180" />
            </Card>
          ))
        )}
      </Body>
    </>
  );
}

export function FileDetails({ nav, id }: { nav: Nav; id: string }) {
  const { t, b, files, toast } = useApp();
  const f = files.find((x) => x.id === id)!;
  const [openPreview, setOpenPreview] = useState(false);
  return (
    <>
      <ScreenHeader title={t("fileDetails")} nav={nav} />
      <Body>
        <Card className="flex flex-col items-center py-7">
          <div className={`flex h-20 w-20 items-center justify-center rounded-2xl text-sm font-bold ${fileColor[f.type]}`}>
            {f.type}
          </div>
          <p className="mt-3 text-center text-sm font-bold text-zinc-900">{b(f.name)}</p>
          <div className="mt-2"><SyncBadge sync={f.sync} /></div>
        </Card>
        <Card className="space-y-2.5 text-xs">
          {[
            [t("fileType"), f.type],
            [t("fileSize"), f.size],
            [t("date"), f.date],
            [t("category"), b(f.folder)],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between">
              <span className="text-zinc-500">{k}</span>
              <span className="font-semibold text-zinc-900">{v}</span>
            </div>
          ))}
        </Card>
        <div className="flex gap-2">
          <Button size="lg" onClick={() => setOpenPreview(true)}>
            <Icon name="eye" className="h-4 w-4" /> {t("open")}
          </Button>
          <Button variant="outline" size="lg" onClick={() => toast(t("download") + " ✓")}>
            <Icon name="download" className="h-4 w-4" /> {t("download")}
          </Button>
        </div>

        <Modal open={openPreview} onClose={() => setOpenPreview(false)} title={t("preview")}>
          <div className="space-y-3">
            <div className="h-56 space-y-2 overflow-hidden rounded-xl border border-zinc-200 bg-zinc-50 p-4">
              <div className="h-3 w-2/3 rounded bg-zinc-200" />
              <div className="h-2 w-full rounded bg-zinc-200/70" />
              <div className="h-2 w-11/12 rounded bg-zinc-200/70" />
              <div className="h-2 w-4/5 rounded bg-zinc-200/70" />
              <div className="mt-4 h-20 rounded bg-zinc-200/50" />
              <div className="h-2 w-3/4 rounded bg-zinc-200/70" />
            </div>
            <p className="text-center text-[11px] text-zinc-400">{t("previewNote")}</p>
            <Button size="lg" variant="ghost" onClick={() => setOpenPreview(false)}>
              {t("close")}
            </Button>
          </div>
        </Modal>
      </Body>
    </>
  );
}

/* ================= NOTIFICATIONS ================= */
const notifIcon: Record<string, string> = {
  invoice: "invoices",
  invoice_update: "invoices",
  service: "services",
  file: "files",
  announcement: "megaphone",
};

export function NotificationsList({ nav }: { nav: Nav }) {
  const { t, b, notifs, markAllRead, unreadCount } = useApp();
  return (
    <>
      <ScreenHeader
        title={t("notificationsList")}
        nav={nav}
        right={
          <button onClick={markAllRead} className="whitespace-nowrap px-2 text-[11px] font-semibold text-orange-600">
            {t("markAllRead")}
          </button>
        }
      />
      <Body>
        {unreadCount > 0 && (
          <p className="text-[11px] text-zinc-500">
            {unreadCount} {t("unread")}
          </p>
        )}
        {notifs.length === 0 ? (
          <EmptyState icon="bell" text={t("noNotifications")} />
        ) : (
          notifs.map((n) => (
            <Card
              key={n.id}
              onClick={() => nav.push("notification", n.id)}
              className={`flex items-start gap-3 p-3 ${!n.read ? "border-orange-200 bg-orange-50/40" : ""}`}
            >
              <div className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl ${n.read ? "bg-zinc-100 text-zinc-400" : "bg-orange-100 text-orange-600"}`}>
                <Icon name={notifIcon[n.type]} className="h-4 w-4" />
              </div>
              <div className="min-w-0 flex-1">
                <p className={`text-xs ${n.read ? "font-medium text-zinc-600" : "font-bold text-zinc-900"}`}>{b(n.title)}</p>
                <p className="line-clamp-1 text-[11px] text-zinc-500">{b(n.body)}</p>
                <p className="mt-0.5 text-[10px] text-zinc-400">{n.time}</p>
              </div>
              {!n.read && <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-orange-500" />}
            </Card>
          ))
        )}
      </Body>
    </>
  );
}

export function NotificationDetails({ nav, id }: { nav: Nav; id: string }) {
  const { t, b, notifs, markRead, toast } = useApp();
  const n = notifs.find((x) => x.id === id)!;
  return (
    <>
      <ScreenHeader title={t("notificationDetails")} nav={nav} />
      <Body>
        <Card>
          <div className="flex items-start gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-orange-50 text-orange-500">
              <Icon name={notifIcon[n.type]} className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-zinc-900">{b(n.title)}</p>
              <p className="text-[10px] text-zinc-400">{n.time}</p>
            </div>
            <span className={`rounded-full px-2 py-0.5 text-[10px] font-semibold ${n.read ? "bg-zinc-100 text-zinc-500" : "bg-orange-100 text-orange-600"}`}>
              {n.read ? t("readLabel") : t("unread")}
            </span>
          </div>
          <p className="mt-4 text-xs leading-relaxed text-zinc-600">{b(n.body)}</p>
        </Card>

        {!n.read ? (
          <Button
            size="lg"
            onClick={() => {
              markRead(n.id);
              toast(t("markAsRead") + " ✓");
            }}
          >
            <Icon name="check" className="h-4 w-4" /> {t("markAsRead")}
          </Button>
        ) : (
          <div className="flex items-center justify-center gap-2 rounded-xl bg-emerald-50 py-3 text-xs font-semibold text-emerald-600">
            <Icon name="check" className="h-4 w-4" /> {t("readLabel")}
          </div>
        )}

        {n.type === "invoice" && (
          <Button variant="outline" size="lg" onClick={() => nav.push("invoice", "inv-1")}>
            {t("invoiceDetails")}
          </Button>
        )}
        {n.type === "service" && (
          <Button variant="outline" size="lg" onClick={() => nav.push("service", "srv-1")}>
            {t("serviceDetails")}
          </Button>
        )}
        {n.type === "file" && (
          <Button variant="outline" size="lg" onClick={() => nav.push("file", "f-1")}>
            {t("fileDetails")}
          </Button>
        )}
      </Body>
    </>
  );
}

/* ================= CHAT ================= */
export function ChatList({ nav }: { nav: Nav }) {
  const { t, b, threads } = useApp();
  return (
    <>
      <ScreenHeader title={t("conversations")} nav={nav} />
      <Body>
        {threads.map((th) => {
          const last = th.messages[th.messages.length - 1];
          return (
            <Card key={th.id} onClick={() => nav.push("conversation", th.id)} className="flex items-center gap-3 p-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-orange-600 text-xs font-bold text-white">
                {th.avatar}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-xs font-bold text-zinc-900">{b(th.dept)}</p>
                <p className="truncate text-[11px] text-zinc-500">{last.text}</p>
              </div>
              <span className="text-[10px] text-zinc-400">{last.time}</span>
            </Card>
          );
        })}
      </Body>
    </>
  );
}

export function Conversation({ nav, id }: { nav: Nav; id: string }) {
  const { t, b, threads, sendMessage } = useApp();
  const th = threads.find((x) => x.id === id)!;
  const [text, setText] = useState("");
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [th.messages.length]);

  const send = () => {
    if (!text.trim()) return;
    const msg = text;
    setText("");
    sendMessage(th.id, msg, "client");
    setTimeout(() => sendMessage(th.id, t("routed"), "agent"), 900);
  };

  return (
    <div className="flex h-full flex-col">
      <ScreenHeader title={b(th.dept)} nav={nav} />
      <div className="flex-1 space-y-3 overflow-y-auto bg-zinc-50 p-4">
        <div className="mx-auto w-fit rounded-full bg-white px-3 py-1 text-[10px] text-zinc-400 shadow-sm">
          {t("sannadSupport")}
        </div>
        {th.messages.map((m) => (
          <div key={m.id} className={`flex ${m.from === "client" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[78%] rounded-2xl px-3.5 py-2.5 text-xs leading-relaxed shadow-sm ${
                m.from === "client"
                  ? "rounded-br-md bg-gradient-to-br from-orange-500 to-orange-600 text-white"
                  : "rounded-bl-md bg-white text-zinc-700"
              }`}
            >
              <p>{m.text}</p>
              <p className={`mt-1 text-[9px] ${m.from === "client" ? "text-white/70" : "text-zinc-400"}`}>{m.time}</p>
            </div>
          </div>
        ))}
        <div ref={endRef} />
      </div>
      <div className="flex items-center gap-2 border-t border-zinc-100 bg-white p-3 pb-4">
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && send()}
          placeholder={t("typeMessage")}
          className="flex-1 rounded-full border border-zinc-200 bg-zinc-50 px-4 py-2.5 text-xs outline-none focus:border-orange-400 focus:bg-white"
        />
        <button
          onClick={send}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/25 active:scale-95"
        >
          <Icon name="send" className="h-4 w-4 rtl:-scale-x-100" />
        </button>
      </div>
    </div>
  );
}

/* ================= PROFILE ================= */
export function Profile({ nav }: { nav: Nav }) {
  const { t, b, profile, toggleLang, lang, toast } = useApp();
  return (
    <>
      <ScreenHeader title={t("profile")} nav={nav} />
      <Body>
        <Card className="flex flex-col items-center py-6">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-orange-400 to-orange-600 text-xl font-bold text-white">
            {b(profile.name).slice(0, 2).toUpperCase()}
          </div>
          <p className="mt-3 text-base font-bold text-zinc-900">{b(profile.name)}</p>
          <p className="text-xs text-zinc-500">{b(profile.company)}</p>
          <Status value={profile.status} className="mt-2" />
          <p className="mt-2 rounded-lg bg-zinc-100 px-3 py-1 text-[11px] font-semibold text-zinc-600">
            {profile.code}
          </p>
        </Card>

        <Card className="space-y-2.5 text-xs">
          {[
            [t("accountStatus"), t(profile.status)],
            [t("createdDate"), profile.created],
            [t("expiryDate"), profile.expiry],
            [t("email"), profile.email],
          ].map(([k, v]) => (
            <div key={k} className="flex justify-between gap-3">
              <span className="text-zinc-500">{k}</span>
              <span className="truncate font-semibold text-zinc-900">{v}</span>
            </div>
          ))}
        </Card>

        <SectionTitle text={t("phoneNumbers")} />
        <Card className="space-y-2">
          {profile.phones.map((p) => (
            <div key={p} className="flex items-center gap-2 text-xs text-zinc-700">
              <Icon name="user" className="h-3.5 w-3.5 text-orange-500" /> {p}
            </div>
          ))}
        </Card>

        <SectionTitle text={t("driveLinks")} />
        <Card className="space-y-2">
          {profile.drive.map((d) => (
            <button
              key={d.url}
              onClick={() => toast("Opening Google Drive… (prototype)", "info")}
              className="flex w-full items-center gap-2 rounded-lg p-1.5 text-start text-xs text-zinc-700 hover:bg-zinc-50"
            >
              <Icon name="drive" className="h-4 w-4 text-emerald-500" />
              <span className="flex-1">{b(d.label)}</span>
              <Icon name="chevronR" className="h-3.5 w-3.5 text-zinc-300 rtl:rotate-180" />
            </button>
          ))}
        </Card>

        <div className="space-y-2 pt-1">
          {[
            { label: t("editProfile"), icon: "edit", go: () => nav.push("editProfile") },
            { label: t("changePassword"), icon: "lock", go: () => nav.push("changePassword") },
            { label: t("academy"), icon: "academy", go: () => nav.push("academy") },
            { label: t("chat"), icon: "chat", go: () => nav.push("chat") },
            { label: lang === "en" ? "العربية / Arabic" : "English / الإنجليزية", icon: "globe", go: toggleLang },
          ].map((r) => (
            <button
              key={r.label}
              onClick={r.go}
              className="flex w-full items-center gap-3 rounded-2xl border border-zinc-200 bg-white p-3.5 text-start transition hover:border-orange-300"
            >
              <Icon name={r.icon} className="h-4.5 w-4.5 text-orange-500" />
              <span className="flex-1 text-xs font-semibold text-zinc-800">{r.label}</span>
              <Icon name="chevronR" className="h-4 w-4 text-zinc-300 rtl:rotate-180" />
            </button>
          ))}
          <button
            onClick={() => nav.push("logout")}
            className="flex w-full items-center gap-3 rounded-2xl border border-red-100 bg-red-50/60 p-3.5 text-start"
          >
            <Icon name="logout" className="h-4.5 w-4.5 text-red-500 rtl:-scale-x-100" />
            <span className="flex-1 text-xs font-semibold text-red-600">{t("logout")}</span>
          </button>
        </div>
      </Body>
    </>
  );
}

export function EditProfile({ nav }: { nav: Nav }) {
  const { t, b, lang, profile, updateProfile, toast } = useApp();
  const [name, setName] = useState(b(profile.name));
  const [company, setCompany] = useState(b(profile.company));
  const [email, setEmail] = useState(profile.email);
  const [phones, setPhones] = useState<string[]>(profile.phones);
  const [saving, setSaving] = useState(false);

  const save = () => {
    setSaving(true);
    setTimeout(() => {
      updateProfile({
        name: { ...profile.name, [lang]: name },
        company: { ...profile.company, [lang]: company },
        email,
        phones: phones.filter((p) => p.trim()),
      });
      setSaving(false);
      toast(t("profileUpdated"));
      nav.pop();
    }, 700);
  };

  return (
    <>
      <ScreenHeader title={t("editProfile")} nav={nav} />
      <Body>
        <Card className="space-y-3">
          <Field label={t("fullName")} value={name} onChange={setName} />
          <Field label={t("companyName")} value={company} onChange={setCompany} />
          <Field label={t("email")} value={email} onChange={setEmail} />
          {phones.map((p, i) => (
            <Field
              key={i}
              label={`${t("phone")} ${i + 1}`}
              value={p}
              onChange={(v) => setPhones(phones.map((x, k) => (k === i ? v : x)))}
            />
          ))}
          {phones.length < 3 && (
            <button
              onClick={() => setPhones([...phones, ""])}
              className="text-xs font-semibold text-orange-600 hover:underline"
            >
              {t("addPhone")}
            </button>
          )}
        </Card>
        <Button size="lg" onClick={save} disabled={saving}>
          {saving ? <Spinner className="h-4 w-4" /> : t("save")}
        </Button>
        <Button variant="ghost" size="lg" onClick={nav.pop}>
          {t("cancel")}
        </Button>
      </Body>
    </>
  );
}

export function ChangePassword({ nav }: { nav: Nav }) {
  const { t, toast } = useApp();
  const [cur, setCur] = useState("");
  const [np, setNp] = useState("");
  const [cp, setCp] = useState("");
  const [done, setDone] = useState(false);

  const save = () => {
    if (!cur || !np) return toast(t("invalidCreds"), "error");
    if (np !== cp) return toast(t("passwordsNoMatch"), "error");
    setDone(true);
  };

  return (
    <>
      <ScreenHeader title={t("changePassword")} nav={nav} />
      <Body>
        {done ? (
          <div className="flex flex-col items-center gap-3 py-16 text-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-500 text-white">
              <Icon name="check" className="h-10 w-10" strokeWidth={3} />
            </div>
            <p className="text-base font-bold text-zinc-900">{t("passwordUpdated")}</p>
            <Button size="lg" className="mt-3" onClick={nav.pop}>
              {t("back")}
            </Button>
          </div>
        ) : (
          <>
            <Card className="space-y-3">
              <Field label={t("currentPassword")} type="password" value={cur} onChange={setCur} placeholder="••••••••" />
              <Field label={t("newPassword")} type="password" value={np} onChange={setNp} placeholder="••••••••" />
              <Field label={t("confirmPassword")} type="password" value={cp} onChange={setCp} placeholder="••••••••" />
            </Card>
            <Button size="lg" onClick={save}>
              {t("save")}
            </Button>
          </>
        )}
      </Body>
    </>
  );
}

/* ================= ACADEMY ================= */
export function Academy({ nav }: { nav: Nav }) {
  const { t, b } = useApp();
  return (
    <>
      <ScreenHeader title={t("academy")} nav={nav} />
      <Body>
        {courses.map((c) => (
          <Card key={c.id} onClick={() => nav.push("course", c.id)} className="flex gap-3 p-3">
            <div className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${c.color} text-white`}>
              <Icon name="academy" className="h-7 w-7" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-zinc-900">{b(c.title)}</p>
              <p className="text-[11px] text-zinc-500">{b(c.category)}</p>
              <Progress value={c.progress} className="mt-2 h-1.5" />
              <p className="mt-1 text-[10px] font-semibold text-orange-600">{c.progress}%</p>
            </div>
          </Card>
        ))}
      </Body>
    </>
  );
}

export function CourseDetails({ nav, id }: { nav: Nav; id: string }) {
  const { t, b, toast } = useApp();
  const c = courses.find((x) => x.id === id)!;
  return (
    <>
      <ScreenHeader title={t("courseDetails")} nav={nav} />
      <Body>
        <div className={`rounded-3xl bg-gradient-to-br ${c.color} p-6 text-white`}>
          <Icon name="academy" className="h-9 w-9" />
          <h2 className="mt-3 text-lg font-bold">{b(c.title)}</h2>
          <p className="text-xs text-white/80">{b(c.category)}</p>
          <div className="mt-4 h-2 w-full overflow-hidden rounded-full bg-white/30">
            <div className="h-full rounded-full bg-white transition-all" style={{ width: `${c.progress}%` }} />
          </div>
          <p className="mt-1.5 text-[11px] text-white/90">{c.progress}% {t("progress")}</p>
        </div>
        <SectionTitle text={`${t("lessons")} (${c.lessons.length})`} />
        {c.lessons.map((l, i) => (
          <Card key={i} onClick={() => toast(b(l.title), "info")} className="flex items-center gap-3 p-3">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-orange-50 text-xs font-bold text-orange-600">
              {i + 1}
            </span>
            <span className="flex-1 text-xs font-semibold text-zinc-800">{b(l.title)}</span>
            <span className="text-[10px] text-zinc-400">{l.min} min</span>
          </Card>
        ))}
        <Button size="lg" onClick={() => toast(t("continueCourse"), "info")}>
          {t("continueCourse")}
        </Button>
      </Body>
    </>
  );
}
