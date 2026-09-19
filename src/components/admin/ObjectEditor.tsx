import MediaPicker from "./MediaPicker";
import { FIELD_GUIDE } from "../../pages/admin/guide";

export type JsonValue = string | number | boolean | null | JsonValue[] | { [key: string]: JsonValue };

const MEDIA_IMAGE_RE = /image|photo|logo|poster|avatar|thumbnail/i;
const MEDIA_VIDEO_RE = /video/i;
const LONG_TEXT_RE = /body|intro|detail|description|motto|note|message|address|scope/i;

function labelize(key: string): string {
  return key
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .replace(/^./, (c) => c.toUpperCase());
}

function isPlainObject(v: unknown): v is Record<string, JsonValue> {
  return typeof v === "object" && v !== null && !Array.isArray(v);
}

export default function ObjectEditor({
  value,
  onChange,
  depth = 0,
}: {
  value: Record<string, JsonValue>;
  onChange: (next: Record<string, JsonValue>) => void;
  depth?: number;
}) {
  const setField = (key: string, fieldValue: JsonValue) => {
    onChange({ ...value, [key]: fieldValue });
  };

  return (
    <div className={depth > 0 ? "space-y-4 pl-4 border-l border-neutral-800" : "space-y-5"}>
      {Object.entries(value).map(([key, fieldValue]) => (
        <Field key={key} fieldKey={key} value={fieldValue} onChange={(v) => setField(key, v)} depth={depth} />
      ))}
    </div>
  );
}

function Field({
  fieldKey,
  value,
  onChange,
  depth,
}: {
  fieldKey: string;
  value: JsonValue;
  onChange: (v: JsonValue) => void;
  depth: number;
}) {
  const label = labelize(fieldKey);

  if (typeof value === "string") {
    if (MEDIA_IMAGE_RE.test(fieldKey)) {
      return (
        <div>
          <FieldLabel hintKey={fieldKey}>{label}</FieldLabel>
          <MediaPicker value={value} onChange={onChange} kind="image" />
        </div>
      );
    }
    if (MEDIA_VIDEO_RE.test(fieldKey)) {
      return (
        <div>
          <FieldLabel hintKey={fieldKey}>{label}</FieldLabel>
          <MediaPicker value={value} onChange={onChange} kind="video" />
        </div>
      );
    }
    const useTextarea = LONG_TEXT_RE.test(fieldKey) || value.length > 90;
    return (
      <div>
        <FieldLabel hintKey={fieldKey}>{label}</FieldLabel>
        {useTextarea ? (
          <textarea
            value={value}
            onChange={(e) => onChange(e.target.value)}
            rows={Math.min(8, Math.max(3, Math.ceil(value.length / 60)))}
            className="w-full bg-neutral-900 border border-neutral-700 rounded px-3 py-2 text-sm text-neutral-100 resize-y"
          />
        ) : (
          <input
            type="text"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="w-full bg-neutral-900 border border-neutral-700 rounded px-3 py-2 text-sm text-neutral-100"
          />
        )}
      </div>
    );
  }

  if (typeof value === "number") {
    return (
      <div>
        <FieldLabel hintKey={fieldKey}>{label}</FieldLabel>
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="w-full bg-neutral-900 border border-neutral-700 rounded px-3 py-2 text-sm text-neutral-100"
        />
      </div>
    );
  }

  if (typeof value === "boolean") {
    // Checkboxes render their own label rather than going through FieldLabel,
    // so the hint has to be repeated here — and these are the switches most
    // worth explaining ("show" hides a whole section from visitors).
    const hint = FIELD_GUIDE[fieldKey];
    return (
      <div>
        <label className="flex items-center gap-2.5 cursor-pointer">
          <input
            type="checkbox"
            checked={value}
            onChange={(e) => onChange(e.target.checked)}
            className="w-4 h-4 accent-[color:var(--color-rust,#b8531f)]"
          />
          <span className="text-sm text-neutral-200">{label}</span>
        </label>
        {hint && <p className="mt-1 ml-[1.625rem] text-[11px] text-neutral-500/90 leading-snug">{hint}</p>}
      </div>
    );
  }

  if (Array.isArray(value)) {
    const allStrings = value.every((v) => typeof v === "string");
    if (allStrings || value.length === 0) {
      return (
        <div>
          <FieldLabel hintKey={fieldKey}>{label}</FieldLabel>
          <StringListEditor value={value as string[]} onChange={(v) => onChange(v)} />
        </div>
      );
    }
    return (
      <div>
        <FieldLabel hintKey={fieldKey}>{label}</FieldLabel>
        <ListEditor value={value as Record<string, JsonValue>[]} onChange={(v) => onChange(v)} depth={depth} />
      </div>
    );
  }

  if (isPlainObject(value)) {
    return (
      <div>
        <FieldLabel hintKey={fieldKey}>{label}</FieldLabel>
        <ObjectEditor value={value} onChange={(v) => onChange(v)} depth={depth + 1} />
      </div>
    );
  }

  return null;
}

function FieldLabel({ children, hintKey }: { children: React.ReactNode; hintKey?: string }) {
  // Looked up on the raw field name, not the displayed label — the label is
  // humanised ("heroVideo" -> "Hero Video") and would never match. Field names
  // repeat across sections ("heading" exists nearly everywhere), so one entry
  // per name covers the whole panel.
  const hint = hintKey ? FIELD_GUIDE[hintKey] : undefined;
  return (
    <div className="mb-1.5">
      <p className="text-[11px] font-mono uppercase tracking-wide text-neutral-500">{children}</p>
      {hint && <p className="mt-0.5 text-[11px] text-neutral-500/90 leading-snug normal-case">{hint}</p>}
    </div>
  );
}

export function StringListEditor({ value, onChange }: { value: string[]; onChange: (v: string[]) => void }) {
  return (
    <div className="space-y-2">
      {value.map((item, i) => (
        <div key={i} className="flex gap-2">
          <input
            type="text"
            value={item}
            onChange={(e) => {
              const next = [...value];
              next[i] = e.target.value;
              onChange(next);
            }}
            className="flex-1 bg-neutral-900 border border-neutral-700 rounded px-3 py-1.5 text-sm text-neutral-100"
          />
          <button
            type="button"
            onClick={() => onChange(value.filter((_, idx) => idx !== i))}
            className="px-2 text-neutral-500 hover:text-red-400 text-sm"
            aria-label="Remove"
          >
            ✕
          </button>
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...value, ""])}
        className="text-xs px-2.5 py-1 border border-neutral-600 text-neutral-300 rounded hover:border-neutral-400"
      >
        + Add item
      </button>
    </div>
  );
}

export function ListEditor({
  value,
  onChange,
  depth = 0,
}: {
  value: Record<string, JsonValue>[];
  onChange: (v: Record<string, JsonValue>[]) => void;
  depth?: number;
}) {
  const blankLike = (item: Record<string, JsonValue> | undefined): Record<string, JsonValue> => {
    if (!item) return {};
    const blank: Record<string, JsonValue> = {};
    for (const [k, v] of Object.entries(item)) {
      if (typeof v === "string") blank[k] = "";
      else if (typeof v === "number") blank[k] = 0;
      else if (typeof v === "boolean") blank[k] = false;
      else if (Array.isArray(v)) blank[k] = [];
      else if (isPlainObject(v)) blank[k] = blankLike(v);
      else blank[k] = v;
    }
    return blank;
  };

  const move = (i: number, dir: -1 | 1) => {
    const j = i + dir;
    if (j < 0 || j >= value.length) return;
    const next = [...value];
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
  };

  return (
    <div className="space-y-3">
      {value.map((item, i) => (
        <div key={i} className="border border-neutral-700 rounded p-3 bg-neutral-950/40">
          <div className="flex items-center justify-between mb-3">
            <span className="text-[11px] font-mono text-neutral-500">#{i + 1}</span>
            <div className="flex gap-1">
              <button type="button" onClick={() => move(i, -1)} className="text-xs px-1.5 text-neutral-400 hover:text-neutral-100">
                ↑
              </button>
              <button type="button" onClick={() => move(i, 1)} className="text-xs px-1.5 text-neutral-400 hover:text-neutral-100">
                ↓
              </button>
              <button
                type="button"
                onClick={() => onChange(value.filter((_, idx) => idx !== i))}
                className="text-xs px-1.5 text-neutral-400 hover:text-red-400"
              >
                Remove
              </button>
            </div>
          </div>
          <ObjectEditor
            value={item}
            onChange={(next) => {
              const copy = [...value];
              copy[i] = next;
              onChange(copy);
            }}
            depth={depth + 1}
          />
        </div>
      ))}
      <button
        type="button"
        onClick={() => onChange([...value, blankLike(value[value.length - 1])])}
        className="text-xs px-2.5 py-1.5 bg-rust text-white rounded hover:bg-rust-dark"
      >
        + Add item
      </button>
    </div>
  );
}
