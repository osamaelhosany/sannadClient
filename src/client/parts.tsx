import React from "react";
import { useApp } from "../lib/store";
import { Icon } from "../components/ui";

export type Nav = {
  push: (name: string, param?: string) => void;
  pop: () => void;
  goTab: (tab: string) => void;
  home: () => void;
  canBack: boolean;
};

export function ScreenHeader({
  title,
  nav,
  right,
  onBack,
}: {
  title: string;
  nav: Nav;
  right?: React.ReactNode;
  onBack?: () => void;
}) {
  const { dir } = useApp();
  return (
    <div className="sticky top-0 z-20 flex items-center gap-2 border-b border-zinc-100 bg-white/95 px-3 py-3 backdrop-blur">
      <button
        onClick={onBack ?? nav.pop}
        className="flex h-9 w-9 items-center justify-center rounded-xl text-zinc-700 transition hover:bg-zinc-100"
        aria-label="back"
      >
        <Icon name={dir === "rtl" ? "chevronR" : "chevronL"} className="h-5 w-5" />
      </button>
      <h1 className="flex-1 truncate text-center text-sm font-bold uppercase tracking-wide text-zinc-900">
        {title}
      </h1>
      <div className="flex h-9 min-w-9 items-center justify-end gap-1">
        {right ?? (
          <button
            onClick={nav.home}
            className="flex h-9 w-9 items-center justify-center rounded-xl text-zinc-500 transition hover:bg-zinc-100"
            aria-label="home"
          >
            <Icon name="home" className="h-4.5 w-4.5" />
          </button>
        )}
      </div>
    </div>
  );
}

export function Body({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`screen-enter space-y-3 p-4 pb-28 ${className}`}>{children}</div>;
}

export function SectionTitle({ text, onAction, actionText }: { text: string; onAction?: () => void; actionText?: string }) {
  return (
    <div className="flex items-center justify-between pt-1">
      <h2 className="text-sm font-bold text-zinc-900">{text}</h2>
      {onAction && (
        <button onClick={onAction} className="text-xs font-semibold text-orange-600 hover:underline">
          {actionText}
        </button>
      )}
    </div>
  );
}

export const fileColor: Record<string, string> = {
  PDF: "bg-red-50 text-red-600",
  DOCX: "bg-blue-50 text-blue-600",
  XLSX: "bg-emerald-50 text-emerald-600",
  IMG: "bg-purple-50 text-purple-600",
};

export function money(n: number) {
  return "SAR " + n.toLocaleString("en-US");
}
