import React from "react";
import { cn } from "../utils/cn";
import { useApp } from "../lib/store";

/* ---------------- Sannad Logo ---------------- */
export function SannadMark({ className = "h-10 w-10" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none">
      <defs>
        <linearGradient id="sng" x1="0" y1="1" x2="1" y2="0">
          <stop offset="0%" stopColor="#FF3D00" />
          <stop offset="55%" stopColor="#F97316" />
          <stop offset="100%" stopColor="#FBBF24" />
        </linearGradient>
      </defs>
      <path
        d="M76 22 A24 24 0 1 0 58 62"
        stroke="url(#sng)"
        strokeWidth="15"
        strokeLinecap="butt"
      />
      <path d="M62 66 L45 60 L60 46 Z" fill="url(#sng)" />
      <path
        d="M24 78 A24 24 0 1 0 42 38"
        stroke="url(#sng)"
        strokeWidth="15"
        strokeLinecap="butt"
      />
      <path d="M38 34 L55 40 L40 54 Z" fill="url(#sng)" />
    </svg>
  );
}

export function SannadLogo({
  size = "md",
  light = false,
  horizontal = false,
}: {
  size?: "sm" | "md" | "lg";
  light?: boolean;
  horizontal?: boolean;
}) {
  const m = size === "lg" ? "h-20 w-20" : size === "sm" ? "h-7 w-7" : "h-12 w-12";
  const txt = size === "lg" ? "text-3xl" : size === "sm" ? "text-sm" : "text-xl";
  const sub = size === "lg" ? "text-[10px]" : "text-[7px]";
  return (
    <div className={cn("flex items-center gap-2", horizontal ? "flex-row" : "flex-col")}>
      <SannadMark className={m} />
      <div className={cn(horizontal ? "text-start" : "text-center", "leading-none")}>
        <div className={cn(txt, "font-bold tracking-[0.18em]", light ? "text-white" : "text-zinc-900")}>
          SANNAD
        </div>
        <div className={cn(sub, "mt-1 tracking-[0.3em]", light ? "text-white/70" : "text-zinc-500")}>
          BUSINESS SOLUTIONS
        </div>
      </div>
    </div>
  );
}

/* ---------------- Icons ---------------- */
const paths: Record<string, React.ReactNode> = {
  home: <path d="M3 10.5 12 3l9 7.5M5.5 9.5V20h13V9.5" />,
  services: <><rect x="3" y="4" width="18" height="16" rx="2" /><path d="M7 9h10M7 13h7" /></>,
  invoices: <><path d="M6 2h12v20l-3-2-3 2-3-2-3 2z" /><path d="M9 8h6M9 12h6" /></>,
  files: <><path d="M4 6a2 2 0 0 1 2-2h4l2 2h6a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2z" /></>,
  bell: <><path d="M18 8a6 6 0 1 0-12 0c0 7-3 8-3 8h18s-3-1-3-8" /><path d="M13.7 21a2 2 0 0 1-3.4 0" /></>,
  chat: <path d="M21 12a8 8 0 0 1-8 8H7l-4 3v-6.5A8 8 0 1 1 21 12z" />,
  user: <><circle cx="12" cy="8" r="4" /><path d="M4 21a8 8 0 0 1 16 0" /></>,
  academy: <><path d="M2 8l10-5 10 5-10 5z" /><path d="M6 11v5c0 1.5 3 3 6 3s6-1.5 6-3v-5" /></>,
  chevronR: <path d="M9 5l7 7-7 7" />,
  chevronL: <path d="M15 5l-7 7 7 7" />,
  chevronD: <path d="M6 9l6 6 6-6" />,
  check: <path d="M4 12.5 9.5 18 20 6.5" />,
  x: <path d="M6 6l12 12M18 6 6 18" />,
  download: <><path d="M12 3v12" /><path d="M7 11l5 5 5-5" /><path d="M4 21h16" /></>,
  plus: <path d="M12 5v14M5 12h14" />,
  search: <><circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" /></>,
  send: <path d="M4 12 21 3l-7 18-3-7z" />,
  lock: <><rect x="4" y="10" width="16" height="11" rx="2" /><path d="M8 10V7a4 4 0 0 1 8 0v3" /></>,
  edit: <><path d="M4 20h4L20 8l-4-4L4 16z" /></>,
  whatsapp: <><path d="M20 12a8 8 0 0 1-11.9 7L4 20l1.1-3.9A8 8 0 1 1 20 12z" /><path d="M9 9.5c0 3 2.5 5.5 5.5 5.5" /></>,
  drive: <><path d="M8 3h8l6 10H14z" /><path d="m8 3-6 10 4 7 6-10z" /><path d="m6 20h12l4-7H10z" /></>,
  card: <><rect x="2" y="5" width="20" height="14" rx="2" /><path d="M2 10h20" /></>,
  clock: <><circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" /></>,
  logout: <><path d="M10 4H6a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h4" /><path d="m16 16 4-4-4-4M20 12H10" /></>,
  chart: <><path d="M4 20V10M10 20V4M16 20v-7M22 20H2" /></>,
  shield: <path d="M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z" />,
  grid: <><rect x="3" y="3" width="7" height="7" /><rect x="14" y="3" width="7" height="7" /><rect x="3" y="14" width="7" height="7" /><rect x="14" y="14" width="7" height="7" /></>,
  eye: <><path d="M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z" /><circle cx="12" cy="12" r="3" /></>,
  globe: <><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c2.5 3 2.5 15 0 18M12 3c-2.5 3-2.5 15 0 18" /></>,
  dots: <><circle cx="5" cy="12" r="1.5" /><circle cx="12" cy="12" r="1.5" /><circle cx="19" cy="12" r="1.5" /></>,
  megaphone: <><path d="M3 11v2a1 1 0 0 0 1 1h3l7 4V6L7 10H4a1 1 0 0 0-1 1z" /><path d="M18 9a4 4 0 0 1 0 6" /></>,
  refresh: <><path d="M20 11a8 8 0 1 0-1 5" /><path d="M20 5v6h-6" /></>,
};

export function Icon({
  name,
  className = "h-5 w-5",
  strokeWidth = 1.8,
}: {
  name: keyof typeof paths | string;
  className?: string;
  strokeWidth?: number;
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      {paths[name] ?? paths.grid}
    </svg>
  );
}

/* ---------------- Buttons ---------------- */
export function Button({
  children,
  variant = "primary",
  size = "md",
  className,
  ...rest
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "outline" | "ghost" | "dark" | "danger" | "success";
  size?: "sm" | "md" | "lg";
}) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition active:scale-[.98] disabled:opacity-50 disabled:pointer-events-none";
  const sizes = { sm: "px-3 py-1.5 text-xs", md: "px-4 py-2.5 text-sm", lg: "px-5 py-3.5 text-[15px] w-full" };
  const variants = {
    primary:
      "bg-gradient-to-r from-orange-500 to-orange-600 text-white shadow-lg shadow-orange-500/25 hover:brightness-105",
    outline: "border border-orange-300 text-orange-600 bg-white hover:bg-orange-50",
    ghost: "text-zinc-600 hover:bg-zinc-100",
    dark: "bg-zinc-900 text-white hover:bg-zinc-800",
    danger: "bg-red-500 text-white hover:bg-red-600",
    success: "bg-emerald-500 text-white hover:bg-emerald-600",
  };
  return (
    <button className={cn(base, sizes[size], variants[variant], className)} {...rest}>
      {children}
    </button>
  );
}

/* ---------------- Card ---------------- */
export function Card({
  children,
  className,
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={cn(
        "rounded-2xl border border-zinc-200/80 bg-white p-4 shadow-sm",
        onClick && "cursor-pointer transition hover:border-orange-300 hover:shadow-md active:scale-[.995]",
        className
      )}
    >
      {children}
    </div>
  );
}

/* ---------------- Status badge ---------------- */
const statusStyle: Record<string, string> = {
  "In Progress": "bg-orange-100 text-orange-700",
  Completed: "bg-emerald-100 text-emerald-700",
  Pending: "bg-amber-100 text-amber-700",
  Paid: "bg-emerald-100 text-emerald-700",
  Unpaid: "bg-orange-100 text-orange-700",
  Overdue: "bg-red-100 text-red-600",
  Active: "bg-emerald-100 text-emerald-700",
  Expired: "bg-zinc-200 text-zinc-600",
};

export function Status({ value, className }: { value: string; className?: string }) {
  const { t } = useApp();
  return (
    <span
      className={cn(
        "inline-flex shrink-0 items-center rounded-full px-2.5 py-1 text-[11px] font-semibold",
        statusStyle[value] ?? "bg-zinc-100 text-zinc-600",
        className
      )}
    >
      {t(value)}
    </span>
  );
}

/* ---------------- Progress ---------------- */
export function Progress({ value, className }: { value: number; className?: string }) {
  return (
    <div className={cn("h-2 w-full overflow-hidden rounded-full bg-zinc-200/80", className)}>
      <div
        className="h-full rounded-full bg-gradient-to-r from-orange-400 to-orange-600 transition-all duration-700"
        style={{ width: `${value}%` }}
      />
    </div>
  );
}

export function Ring({ value, size = 128 }: { value: number; size?: number }) {
  const r = size / 2 - 10;
  const c = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} className="-rotate-90">
      <circle cx={size / 2} cy={size / 2} r={r} stroke="#F1F1F3" strokeWidth="11" fill="none" />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        stroke="url(#ringg)"
        strokeWidth="11"
        fill="none"
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={c - (c * value) / 100}
        className="transition-all duration-700"
      />
      <defs>
        <linearGradient id="ringg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#FBBF24" />
          <stop offset="100%" stopColor="#F43F00" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/* ---------------- Field ---------------- */
export function Field({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
  className,
}: {
  label?: string;
  value: string;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
  className?: string;
}) {
  return (
    <label className={cn("block", className)}>
      {label && <span className="mb-1.5 block text-xs font-semibold text-zinc-500">{label}</span>}
      <input
        type={type}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-xl border border-zinc-200 bg-zinc-50/70 px-3.5 py-2.5 text-sm text-zinc-900 outline-none transition placeholder:text-zinc-400 focus:border-orange-400 focus:bg-white focus:ring-2 focus:ring-orange-100"
      />
    </label>
  );
}

/* ---------------- Empty / Loading ---------------- */
export function EmptyState({ icon = "files", text, action }: { icon?: string; text: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-14 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-orange-50 text-orange-400">
        <Icon name={icon} className="h-8 w-8" />
      </div>
      <p className="text-sm text-zinc-500">{text}</p>
      {action}
    </div>
  );
}

export function Spinner({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg className={cn("animate-spin text-orange-500", className)} viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity=".2" strokeWidth="3" />
      <path d="M22 12a10 10 0 0 0-10-10" stroke="currentColor" strokeWidth="3" strokeLinecap="round" />
    </svg>
  );
}

/* ---------------- Modal ---------------- */
export function Modal({
  open,
  onClose,
  children,
  title,
}: {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
}) {
  if (!open) return null;
  return (
    <div className="absolute inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0 bg-zinc-900/40 backdrop-blur-[2px]" onClick={onClose} />
      <div className="relative w-full animate-[slideup_.25s_ease-out] rounded-t-3xl bg-white p-5 shadow-2xl">
        <div className="mx-auto mb-4 h-1 w-10 rounded-full bg-zinc-200" />
        {title && <h3 className="mb-3 text-center text-base font-bold text-zinc-900">{title}</h3>}
        {children}
      </div>
    </div>
  );
}

/* ---------------- Toasts ---------------- */
export function Toasts({ absolute = true }: { absolute?: boolean }) {
  const { toasts } = useApp();
  return (
    <div
      className={cn(
        "pointer-events-none z-[100] flex flex-col items-center gap-2 px-4",
        absolute ? "absolute inset-x-0 top-3" : "fixed inset-x-0 top-4"
      )}
    >
      {toasts.map((t) => (
        <div
          key={t.id}
          className={cn(
            "animate-[slidedown_.2s_ease-out] rounded-xl px-4 py-2.5 text-xs font-semibold text-white shadow-lg",
            t.kind === "error" ? "bg-red-500" : t.kind === "info" ? "bg-zinc-800" : "bg-emerald-500"
          )}
        >
          {t.text}
        </div>
      ))}
    </div>
  );
}

export function LangToggle({ compact = false }: { compact?: boolean }) {
  const { lang, toggleLang } = useApp();
  return (
    <button
      onClick={toggleLang}
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full border border-zinc-200 bg-white px-3 py-1.5 text-xs font-semibold text-zinc-600 transition hover:border-orange-300 hover:text-orange-600",
        compact && "px-2 py-1"
      )}
    >
      <Icon name="globe" className="h-3.5 w-3.5" />
      {lang === "en" ? "العربية" : "English"}
    </button>
  );
}
