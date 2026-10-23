import type { ReactNode } from 'react';

export const inputClass =
  'mt-2 w-full rounded-lg border border-slate-300 bg-white px-3 py-3 text-base focus:border-brand focus:outline-none focus:ring-2 focus:ring-brand/30';

export function FieldError({ id, message }: { id: string; message?: string }) {
  if (!message) return null;
  return (
    <p id={id} className="mt-2 text-sm font-medium text-red-600">
      {message}
    </p>
  );
}

export function CheckCard({
  checked,
  onChange,
  children,
  name,
  value,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  children: ReactNode;
  name: string;
  value: string;
}) {
  return (
    <label
      className={`flex min-h-12 cursor-pointer items-center gap-3 rounded-xl border px-4 py-3 transition ${
        checked ? 'border-brand bg-blue-50' : 'border-slate-300 bg-white hover:border-brand'
      }`}
    >
      <input
        type="checkbox"
        name={name}
        value={value}
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-5 w-5 accent-brand"
      />
      <span>{children}</span>
    </label>
  );
}
