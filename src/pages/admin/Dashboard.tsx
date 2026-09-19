import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useContent, useContentSetLocal } from "../../lib/content";
import { logout, saveContent } from "../../lib/adminApi";
import ObjectEditor, { ListEditor, StringListEditor, type JsonValue } from "../../components/admin/ObjectEditor";

const GROUPS: { title: string; keys: { key: keyof ReturnType<typeof useContent>; label: string }[] }[] = [
  {
    title: "Site Settings",
    keys: [
      { key: "siteSettings", label: "General & Hero Video" },
      { key: "footerContent", label: "Footer" },
      { key: "nav", label: "Navigation Menu" },
    ],
  },
  {
    title: "Home Page",
    keys: [{ key: "home", label: "Hero, Stats & Sections" }],
  },
  {
    title: "Page Headers",
    keys: [{ key: "pageHeroes", label: "All Page Titles/Intros" }],
  },
  {
    title: "About Page",
    keys: [
      { key: "aboutContent", label: "Section Headings" },
      { key: "timeline", label: "Company Timeline" },
      { key: "methodology", label: "Our Approach Steps" },
      { key: "commitment", label: "Commitment Statement" },
    ],
  },
  {
    title: "Company Info",
    keys: [{ key: "company", label: "Legal Details, Contact, Partners" }],
  },
  {
    title: "Services",
    keys: [{ key: "specializations", label: "Specializations" }],
  },
  {
    title: "Projects",
    keys: [
      { key: "projectsContent", label: "Section Headings" },
      { key: "concurrentCommitments", label: "Concurrent Commitments" },
      { key: "projects", label: "Project Archive (15)" },
      { key: "projectFilters", label: "Project Filters" },
    ],
  },
  {
    title: "Capabilities",
    keys: [
      { key: "capabilitiesContent", label: "Section Headings" },
      { key: "team", label: "Execution Team" },
      { key: "equipment", label: "Equipment List" },
      { key: "equipmentHighlights", label: "Equipment Highlights" },
      { key: "financials", label: "Financial Track Record" },
      { key: "financialNote", label: "Financial Note" },
    ],
  },
  {
    title: "Quality & Safety",
    keys: [
      { key: "qualitySafetyContent", label: "Section Headings & Images" },
      { key: "hsePolicy", label: "HSE Policy" },
      { key: "qualityPolicy", label: "Quality Policy" },
    ],
  },
  {
    title: "Certifications",
    keys: [
      { key: "certificationsContent", label: "Section Headings" },
      { key: "certifications", label: "ISO Certifications" },
      { key: "statutoryRegistrations", label: "Statutory Registrations" },
      { key: "awards", label: "Awards" },
      { key: "completionCertificate", label: "Completion Certificate" },
    ],
  },
  {
    title: "Clients",
    keys: [{ key: "clients", label: "Client Logos & Marquee" }],
  },
  {
    title: "Gallery",
    keys: [{ key: "galleryItems", label: "Gallery Photos" }],
  },
  {
    title: "Contact",
    keys: [{ key: "contactContent", label: "Section Headings & WhatsApp" }],
  },
];

export default function AdminDashboard() {
  const content = useContent();
  const setLocal = useContentSetLocal();
  const navigate = useNavigate();
  const [activeKey, setActiveKey] = useState<string>("siteSettings");
  const [draft, setDraft] = useState<JsonValue>(content[activeKey as keyof typeof content] as JsonValue);
  const [dirty, setDirty] = useState(false);
  const [status, setStatus] = useState<"idle" | "saving" | "saved" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    setDraft(content[activeKey as keyof typeof content] as JsonValue);
    setDirty(false);
    setStatus("idle");
  }, [activeKey, content]);

  const onSave = async () => {
    setStatus("saving");
    setErrorMsg(null);
    try {
      await saveContent(activeKey, draft);
      setStatus("saved");
      setDirty(false);
      setLocal(activeKey, draft);
      setTimeout(() => setStatus("idle"), 2000);
    } catch (e) {
      setStatus("error");
      setErrorMsg(e instanceof Error ? e.message : "Save failed");
    }
  };

  const onLogout = async () => {
    await logout().catch(() => {});
    navigate("/admin/login", { replace: true });
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100 flex">
      <aside className="w-72 shrink-0 border-r border-neutral-800 h-screen sticky top-0 overflow-y-auto">
        <div className="p-5 border-b border-neutral-800">
          <p className="text-xs font-mono uppercase tracking-widest text-rust-light">Anand Techno-Fab</p>
          <p className="text-sm text-neutral-400 mt-0.5">Admin Panel</p>
        </div>
        <nav className="p-3">
          {GROUPS.map((group) => (
            <div key={group.title} className="mb-4">
              <p className="px-2 py-1 text-[10px] font-mono uppercase tracking-widest text-neutral-600">{group.title}</p>
              {group.keys.map(({ key, label }) => (
                <button
                  key={String(key)}
                  onClick={() => setActiveKey(String(key))}
                  className={`w-full text-left px-2.5 py-2 rounded text-sm transition-colors ${
                    activeKey === key ? "bg-rust text-white" : "text-neutral-300 hover:bg-neutral-900"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          ))}
        </nav>
      </aside>

      <main className="flex-1 min-w-0">
        <header className="sticky top-0 z-10 bg-neutral-950/95 backdrop-blur border-b border-neutral-800 px-6 py-4 flex items-center justify-between">
          <div>
            <p className="text-xs font-mono uppercase tracking-wide text-neutral-500">{activeKey}</p>
            {dirty && <p className="text-xs text-amber-400">Unsaved changes</p>}
            {status === "saved" && <p className="text-xs text-emerald-400">Saved</p>}
            {status === "error" && <p className="text-xs text-red-400">{errorMsg}</p>}
          </div>
          <div className="flex items-center gap-3">
            <a
              href="/"
              target="_blank"
              rel="noreferrer"
              className="text-xs px-3 py-2 border border-neutral-700 rounded text-neutral-300 hover:border-neutral-500"
            >
              View Site
            </a>
            <button
              onClick={onSave}
              disabled={!dirty || status === "saving"}
              className="text-xs px-4 py-2 bg-rust hover:bg-rust-dark text-white rounded disabled:opacity-40"
            >
              {status === "saving" ? "Saving…" : "Save Changes"}
            </button>
            <button onClick={onLogout} className="text-xs px-3 py-2 text-neutral-400 hover:text-neutral-100">
              Log Out
            </button>
          </div>
        </header>

        <div className="p-6 max-w-3xl">
          <SectionEditor value={draft} onChange={(v) => { setDraft(v); setDirty(true); }} />
        </div>
      </main>
    </div>
  );
}

function SectionEditor({ value, onChange }: { value: JsonValue; onChange: (v: JsonValue) => void }) {
  if (Array.isArray(value)) {
    const allStrings = value.every((v) => typeof v === "string");
    if (allStrings) {
      return <StringListEditor value={value as string[]} onChange={onChange} />;
    }
    return <ListEditor value={value as Record<string, JsonValue>[]} onChange={onChange} />;
  }
  if (typeof value === "object" && value !== null) {
    return <ObjectEditor value={value as Record<string, JsonValue>} onChange={onChange} />;
  }
  if (typeof value === "string") {
    return (
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={6}
        className="w-full bg-neutral-900 border border-neutral-700 rounded px-3 py-2 text-sm text-neutral-100"
      />
    );
  }
  return <p className="text-neutral-500 text-sm">Unsupported content type.</p>;
}
