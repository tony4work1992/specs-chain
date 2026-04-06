import { useState } from "react";

const workflows = [
  {
    id: 1, name: "Product Foundation", color: "#6366f1", gradient: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
    docs: ["01-business-and-constraints.md","02-architecture-patterns.md","03-technology-stack.md","04-project-structure-and-conventions.md","05-infrastructure-and-cicd.md","06-networking-and-security.md","07-cost-management.md","08-design-system-and-ui.md","09-observability-and-monitoring.md"],
  },
  {
    id: 2, name: "Business Requirements", color: "#f59e0b", gradient: "linear-gradient(135deg, #f59e0b 0%, #f97316 100%)",
    docs: ["01-end-user-requirement.md","02-business-requirement-document.md"],
  },
  {
    id: 3, name: "Technical & Design", color: "#10b981", gradient: "linear-gradient(135deg, #10b981 0%, #06b6d4 100%)",
    subgroups: [
      { label: "Technical", docs: ["01-system-context.md","02-functional-requirement-document.md","03-functional-specifications.yaml"] },
      { label: "Design", docs: ["01-strategic-architecture.md","02-tactic-architecture.yaml","03-ui-component-architecture.yaml","04-flow-sequence.md"] },
    ],
  },
  {
    id: 4, name: "Testing", color: "#ef4444", gradient: "linear-gradient(135deg, #ef4444 0%, #f43f5e 100%)",
    docs: ["01-test-scope.yaml","02-test-impact.yaml","03-test-checklist.yaml","04-test-cases.yaml","05-test-steps.yaml"],
  },
];

const stateNodes = [
  { key: "created",        label: "Created",          color: "#0f766e", bg: "#f0fdfa", border: "#99f6e4", icon: "✦" },
  { key: "draft",          label: "Draft",            color: "#475569", bg: "#f8fafc", border: "#cbd5e1", icon: "✏" },
  { key: "pending_review", label: "Pending Review",   color: "#6d28d9", bg: "#f5f3ff", border: "#c4b5fd", icon: "⏳" },
  { key: "in_review",      label: "In Review",        color: "#b45309", bg: "#fffbeb", border: "#fcd34d", icon: "👁" },
  { key: "approved",       label: "Approved",         color: "#047857", bg: "#ecfdf5", border: "#6ee7b7", icon: "✓" },
  { key: "rejected",       label: "Rejected",         color: "#b91c1c", bg: "#fef2f2", border: "#fca5a5", icon: "✕" },
  { key: "on_hold",        label: "On Hold",          color: "#374151", bg: "#f9fafb", border: "#d1d5db", icon: "⏸" },
  { key: "change",         label: "Change Requested", color: "#0369a1", bg: "#f0f9ff", border: "#7dd3fc", icon: "↺" },
  { key: "deleted",        label: "Deleted",          color: "#9f1239", bg: "#fff1f2", border: "#fda4af", icon: "🗑" },
];

const actions = [
  { code: "initialize",     desc: "Bắt đầu soạn thảo tài liệu từ ticket mới tạo", side: "—", role: "executor", from: ["created"], to: "draft" },
  { code: "delete",         desc: "Xoá ticket vĩnh viễn",              side: "Hard delete — không thể khôi phục", role: "executor", from: ["created"], to: "deleted" },
  { code: "drafting",       desc: "Đưa workflow về trạng thái Draft",  side: "Truyền toàn bộ request body để cập nhật nội dung", role: "executor", from: ["rejected","change","on_hold"], to: "draft" },
  { code: "request-review", desc: "Gửi yêu cầu review",               side: "—", role: "executor", from: ["draft"], to: "pending_review" },
  { code: "cancel-review",  desc: "Hủy yêu cầu review đang chờ",      side: "—", role: "executor", from: ["pending_review"], to: "draft" },
  { code: "start-review",   desc: "Bắt đầu quá trình review",         side: "—", role: "manager",  from: ["pending_review"], to: "in_review" },
  { code: "approve",        desc: "Phê duyệt workflow",                side: "Publish event businessUpdated ra message broker", role: "manager", from: ["in_review"], to: "approved" },
  { code: "reject",         desc: "Từ chối",                           side: "—", role: "manager",  from: ["in_review"], to: "rejected" },
  { code: "on-hold",        desc: "Tạm giữ, chưa xử lý tiếp",        side: "—", role: "manager",  from: ["in_review","pending_review"], to: "on_hold" },
  { code: "track-back",     desc: "Quay về trạng thái trước",         side: "—", role: "manager",  from: ["in_review","pending_review","on_hold"], to: "draft" },
  { code: "change",         desc: "Đánh dấu cần thay đổi",            side: "—", role: "manager",  from: ["in_review","approved"], to: "change" },
];

// Planning zone node positions (compact, fits within planning zone x=0..870)
const nodePos: Record<string, { x: number; y: number }> = {
  created:        { x: 95,   y: 165 },
  draft:          { x: 255,  y: 165 },
  pending_review: { x: 435,  y: 165 },
  in_review:      { x: 615,  y: 165 },
  approved:       { x: 785,  y: 165 },
  deleted:        { x: 95,   y: 330 },
  on_hold:        { x: 435,  y: 330 },
  rejected:       { x: 615,  y: 330 },
  change:         { x: 785,  y: 330 },
};

const transitions = [
  { from: "created",        to: "draft",          label: "initialize",     color: "#0f766e" },
  { from: "created",        to: "deleted",        label: "delete",         color: "#9f1239" },
  { from: "draft",          to: "pending_review", label: "request-review", color: "#6d28d9" },
  { from: "pending_review", to: "draft",          label: "cancel-review",  color: "#94a3b8", dashed: true },
  { from: "pending_review", to: "in_review",      label: "start-review",   color: "#b45309" },
  { from: "in_review",      to: "approved",       label: "approve",        color: "#047857" },
  { from: "in_review",      to: "rejected",       label: "reject",         color: "#b91c1c" },
  { from: "rejected",       to: "draft",          label: "drafting",       color: "#94a3b8", dashed: true },
  { from: "in_review",      to: "on_hold",        label: "on-hold",        color: "#374151" },
  { from: "pending_review", to: "on_hold",        label: "on-hold",        color: "#374151" },
  { from: "on_hold",        to: "draft",          label: "track-back",     color: "#94a3b8", dashed: true },
  { from: "in_review",      to: "change",         label: "change",         color: "#0369a1" },
  { from: "approved",       to: "change",         label: "change",         color: "#0369a1" },
  { from: "change",         to: "draft",          label: "drafting",       color: "#94a3b8", dashed: true },
  { from: "in_review",      to: "draft",          label: "track-back",     color: "#94a3b8", dashed: true },
  { from: "pending_review", to: "draft",          label: "track-back",     color: "#94a3b8", dashed: true },
];

function Arrow({ x1, y1, x2, y2, label, color = "#94a3b8", dashed = false, active = false }: {
  x1: number; y1: number; x2: number; y2: number;
  label?: string; color?: string; dashed?: boolean; active?: boolean;
}) {
  const dx = x2 - x1, dy = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy);
  if (len === 0) return null;
  const ux = dx / len, uy = dy / len;
  const headLen = 9;
  const ax = x2 - ux * headLen, ay = y2 - uy * headLen;
  const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
  const stroke = active ? color : "#d1d5db";
  const sw = active ? 2 : 1.5;

  return (
    <g style={{ transition: "opacity .2s" }}>
      <line x1={x1} y1={y1} x2={ax} y2={ay}
        stroke={stroke} strokeWidth={sw}
        strokeDasharray={dashed ? "6 4" : undefined}
        style={{ transition: "stroke .2s" }}
      />
      <polygon
        points={`${x2},${y2} ${ax - uy * 5},${ay + ux * 5} ${ax + uy * 5},${ay - ux * 5}`}
        fill={stroke} style={{ transition: "fill .2s" }}
      />
      {label && active && (
        <text x={mx} y={my - 8} textAnchor="middle"
          fill={color} fontSize="9.5" fontWeight="600"
          style={{ pointerEvents: "none", userSelect: "none" }}>
          {label}
        </text>
      )}
    </g>
  );
}

const css = `
  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
  body { background: #f1f5f9; }
  @keyframes fadeUp { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
  .fade { animation: fadeUp .22s ease; }
  .tr-hover:hover { background: #f8fafc !important; }
  .perm-row:hover td { background: #f8fafc; }
  .doc-row:hover { background: #f1f5f9 !important; }
  .wf-card { transition: box-shadow .2s, transform .2s; }
  .wf-card:hover { box-shadow: 0 10px 40px rgba(0,0,0,.08); transform: translateY(-2px); }
  ::-webkit-scrollbar { height: 6px; width: 6px; }
  ::-webkit-scrollbar-track { background: #f1f5f9; }
  ::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 3px; }
`;

export default function App() {
  const [tab, setTab] = useState("lifecycle");
  const [hoveredAction, setHoveredAction] = useState<string | null>(null);

  const tabs = [
    { key: "lifecycle", label: "State Machine" },
    { key: "actions",   label: "Actions & Transitions" },
    { key: "roles",     label: "Roles & Permissions" },
    { key: "workflows", label: "Workflows" },
  ];

  return (
    <>
      <style>{css}</style>
      <div style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", background: "#f1f5f9", minHeight: "100vh" }}>

        {/* Top bar */}
        <div style={{ background: "#fff", borderBottom: "1px solid #e2e8f0", position: "sticky", top: 0, zIndex: 50 }}>
          <div style={{ padding: "0 40px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: 0, height: 56 }}>
              {/* Logo / title */}
              <div style={{ display: "flex", alignItems: "center", gap: 10, paddingRight: 40, borderRight: "1px solid #e2e8f0", height: "100%" }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: "linear-gradient(135deg,#6366f1,#8b5cf6)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>⚙</div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: "#0f172a", letterSpacing: "-0.2px" }}>SPECS System</div>
                  <div style={{ fontSize: 11, color: "#94a3b8" }}>Document Lifecycle</div>
                </div>
              </div>

              {/* Tabs */}
              <div style={{ display: "flex", alignItems: "center", height: "100%", paddingLeft: 8 }}>
                {tabs.map(t => (
                  <button key={t.key} onClick={() => setTab(t.key)} style={{
                    height: "100%", padding: "0 20px", border: "none", cursor: "pointer",
                    background: "transparent", fontSize: 13, fontWeight: tab === t.key ? 600 : 500,
                    color: tab === t.key ? "#6366f1" : "#64748b",
                    borderBottom: tab === t.key ? "2px solid #6366f1" : "2px solid transparent",
                    transition: "color .15s, border-color .15s",
                    whiteSpace: "nowrap",
                  }}>{t.label}</button>
                ))}
              </div>

              <div style={{ marginLeft: "auto", display: "flex", alignItems: "center", gap: 8 }}>
                <span style={{ fontSize: 11, color: "#94a3b8", background: "#f8fafc", border: "1px solid #e2e8f0", padding: "4px 10px", borderRadius: 20 }}>v1.0 · 4 workflows · 11 actions</span>
              </div>
            </div>
          </div>
        </div>

        {/* Page content */}
        <div style={{ padding: "32px 0" }}>

          {/* ── FULL PIPELINE ── */}
          {tab === "lifecycle" && (
            <div className="fade" style={{ padding: "0 40px" }}>
              <SectionHeader
                title="End-to-End Document Pipeline"
                sub={'Planning → Knowledge Base → Execution. Hover vào action ở tab "Actions" để highlight transition.'}
              />

              {/* Legend */}
              <div style={{ display: "flex", gap: 24, marginBottom: 20, flexWrap: "wrap" }}>
                {[
                  { label: "Executor action", color: "#6d28d9", dashed: false },
                  { label: "Manager action",  color: "#b45309", dashed: false },
                  { label: "Rollback",         color: "#94a3b8", dashed: true  },
                  { label: "System flow",      color: "#10b981", dashed: false  },
                ].map(l => (
                  <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 7, fontSize: 12, color: "#64748b" }}>
                    <svg width="28" height="10" style={{ flexShrink: 0 }}>
                      <line x1="0" y1="5" x2="24" y2="5" stroke={l.color} strokeWidth="2" strokeDasharray={l.dashed ? "5 4" : undefined} />
                      <polygon points="28,5 21,2 21,8" fill={l.color} />
                    </svg>
                    {l.label}
                  </div>
                ))}
              </div>

              <div style={{ margin: "0 -40px", background: "#fff", borderTop: "1px solid #e2e8f0", borderBottom: "1px solid #e2e8f0", boxShadow: "0 1px 6px rgba(0,0,0,.05)", overflow: "hidden" }}>
                <div style={{ overflowX: "auto", background: "#f8fafc", padding: "32px 40px" }}>
                  <svg width="100%" viewBox="0 0 1760 470" preserveAspectRatio="xMidYMid meet"
                    style={{ display: "block", minWidth: 1200 }}>
                    <defs>
                      <filter id="ns" x="-20%" y="-30%" width="140%" height="160%">
                        <feDropShadow dx="0" dy="1" stdDeviation="2.5" floodColor="#00000010"/>
                      </filter>
                      <marker id="arrow-teal" markerWidth="8" markerHeight="8" refX="7" refY="3.5" orient="auto">
                        <polygon points="0 0, 8 3.5, 0 7" fill="#10b981" />
                      </marker>
                      <marker id="arrow-violet" markerWidth="8" markerHeight="8" refX="7" refY="3.5" orient="auto">
                        <polygon points="0 0, 8 3.5, 0 7" fill="#7c3aed" />
                      </marker>
                    </defs>

                    {/* ═══ ZONE: PLANNING ═══ */}
                    <rect x="8" y="8" width="898" height="454" rx="14"
                      fill="#fafbff" stroke="#e0e7ff" strokeWidth="1.5" />
                    <rect x="8" y="8" width="175" height="26" rx="6" fill="#6366f1" />
                    <text x="22" y="25" fill="#fff" fontSize="11" fontWeight="700" letterSpacing="1">PLANNING PHASE</text>
                    <text x="820" y="25" textAnchor="end" fill="#a5b4fc" fontSize="10">9 states · 16 transitions</text>

                    {/* Planning transitions */}
                    {transitions.map((t, i) => {
                      const f = nodePos[t.from], to = nodePos[t.to];
                      if (!f || !to) return null;
                      const isActive = hoveredAction === t.label;
                      const offY =
                        t.from === "pending_review" && t.to === "draft" && t.label === "cancel-review" ? -14
                        : t.from === "pending_review" && t.to === "draft" && t.label === "track-back" ? 14
                        : t.from === "in_review" && t.to === "draft" ? -26
                        : 0;
                      return (
                        <Arrow key={i}
                          x1={f.x} y1={f.y + offY}
                          x2={to.x} y2={to.y + (to.y > f.y ? -24 : to.y < f.y ? 24 : offY)}
                          label={t.label} color={t.color} dashed={t.dashed} active={isActive}
                        />
                      );
                    })}

                    {/* Planning state nodes */}
                    {stateNodes.map(s => {
                      const p = nodePos[s.key];
                      if (!p) return null;
                      const nw = s.key === "change" ? 152 : s.key === "pending_review" ? 144 : 124;
                      const isTerminal = s.key === "deleted";
                      return (
                        <g key={s.key} filter="url(#ns)">
                          <rect x={p.x - nw / 2} y={p.y - 22} width={nw} height={44} rx="9"
                            fill={s.bg} stroke={s.border} strokeWidth={isTerminal ? 1.5 : 1.5}
                            strokeDasharray={isTerminal ? "5 3" : undefined} />
                          <text x={p.x - nw / 2 + 16} y={p.y} textAnchor="middle" dominantBaseline="middle" fontSize="14">{s.icon}</text>
                          <text x={p.x - nw / 2 + 34} y={p.y} dominantBaseline="middle"
                            fill={s.color} fontSize="11.5" fontWeight="600">{s.label}</text>
                        </g>
                      );
                    })}

                    {/* ═══ SYNC ARROW: approved → KB ═══ */}
                    {/* Curved path from approved (785,165) to KB (990,235) */}
                    <path d="M 850,165 C 900,165 920,200 960,228" fill="none"
                      stroke="#10b981" strokeWidth="2" markerEnd="url(#arrow-teal)" />
                    <rect x="852" y="142" width="92" height="18" rx="4" fill="#ecfdf5" stroke="#6ee7b7" strokeWidth="1" />
                    <text x="898" y="154" textAnchor="middle" fill="#047857" fontSize="9.5" fontWeight="600">sync on approve</text>
                    <text x="898" y="168" textAnchor="middle" fill="#94a3b8" fontSize="8.5">businessUpdated event</text>

                    {/* ═══ KNOWLEDGE BASE NODE ═══ */}
                    {/* DB cylinder: ellipse top + rect body + ellipse bottom */}
                    <rect x="940" y="205" width="104" height="62" fill="#f0fdf4" stroke="#6ee7b7" strokeWidth="1.5" filter="url(#ns)" />
                    <ellipse cx="992" cy="205" rx="52" ry="14" fill="#dcfce7" stroke="#6ee7b7" strokeWidth="1.5" />
                    <ellipse cx="992" cy="267" rx="52" ry="14" fill="#dcfce7" stroke="#6ee7b7" strokeWidth="1.5" />
                    {/* inner lines on cylinder */}
                    <ellipse cx="992" cy="220" rx="52" ry="8" fill="none" stroke="#86efac" strokeWidth="1" opacity="0.6" />
                    <ellipse cx="992" cy="234" rx="52" ry="8" fill="none" stroke="#86efac" strokeWidth="1" opacity="0.4" />
                    <text x="992" y="242" textAnchor="middle" dominantBaseline="middle" fill="#047857" fontSize="11" fontWeight="700">Knowledge</text>
                    <text x="992" y="256" textAnchor="middle" fill="#047857" fontSize="11" fontWeight="700">Base</text>
                    {/* KB label below */}
                    <text x="992" y="294" textAnchor="middle" fill="#94a3b8" fontSize="9.5">4 doc types indexed</text>

                    {/* ═══ READ ARROW: KB → Execution Agent ═══ */}
                    <path d="M 1044,236 C 1075,236 1080,200 1100,178" fill="none"
                      stroke="#7c3aed" strokeWidth="2" markerEnd="url(#arrow-violet)" />
                    <rect x="1048" y="215" width="60" height="18" rx="4" fill="#f5f3ff" stroke="#c4b5fd" strokeWidth="1" />
                    <text x="1078" y="227" textAnchor="middle" fill="#6d28d9" fontSize="9" fontWeight="600">reads docs</text>

                    {/* ═══ ZONE: EXECUTION ═══ */}
                    <rect x="1120" y="8" width="632" height="454" rx="14"
                      fill="#f0fdf9" stroke="#a7f3d0" strokeWidth="1.5" />
                    <rect x="1120" y="8" width="175" height="26" rx="6" fill="#059669" />
                    <text x="1134" y="25" fill="#fff" fontSize="11" fontWeight="700" letterSpacing="1">EXECUTION PHASE</text>
                    <text x="1738" y="25" textAnchor="end" fill="#6ee7b7" fontSize="10">autonomous · event-driven</text>

                    {/* Execution pipeline arrows */}
                    <Arrow x1={1215} y1={165} x2={1355} y2={165} color="#059669" active={true} />
                    <Arrow x1={1460} y1={165} x2={1570} y2={165} color="#059669" active={true} />
                    {/* Fan from dispatcher down to 4 agents */}
                    {[1165, 1300, 1450, 1600].map((ax, i) => (
                      <Arrow key={i} x1={1640} y1={189} x2={ax} y2={306} color="#10b981" active={true} />
                    ))}

                    {/* Execution: main pipeline nodes */}
                    {[
                      { x: 1168, y: 165, label: "AI Agent",       icon: "🤖", color: "#6d28d9", bg: "#f5f3ff", border: "#c4b5fd", w: 128 },
                      { x: 1410, y: 165, label: "Plan Generator",  icon: "📝", color: "#b45309", bg: "#fffbeb", border: "#fcd34d", w: 144 },
                      { x: 1640, y: 165, label: "Task Dispatcher", icon: "⚡", color: "#047857", bg: "#ecfdf5", border: "#6ee7b7", w: 148 },
                    ].map(n => (
                      <g key={n.label} filter="url(#ns)">
                        <rect x={n.x - n.w / 2} y={n.y - 22} width={n.w} height={44} rx="9"
                          fill={n.bg} stroke={n.border} strokeWidth="1.5" />
                        <text x={n.x - n.w / 2 + 16} y={n.y} textAnchor="middle" dominantBaseline="middle" fontSize="14">{n.icon}</text>
                        <text x={n.x - n.w / 2 + 34} y={n.y} dominantBaseline="middle"
                          fill={n.color} fontSize="11.5" fontWeight="600">{n.label}</text>
                      </g>
                    ))}

                    {/* Execution: sub-agent nodes */}
                    {[
                      { x: 1165, y: 330, label: "Architecture",  icon: "🏗", color: "#6366f1", bg: "#eef2ff", border: "#a5b4fc", w: 126 },
                      { x: 1300, y: 330, label: "Business",      icon: "📊", color: "#b45309", bg: "#fffbeb", border: "#fcd34d", w: 112 },
                      { x: 1450, y: 330, label: "Technical",     icon: "⚙",  color: "#0369a1", bg: "#f0f9ff", border: "#7dd3fc", w: 112 },
                      { x: 1600, y: 330, label: "Testing",       icon: "🧪", color: "#b91c1c", bg: "#fef2f2", border: "#fca5a5", w: 104 },
                    ].map(n => (
                      <g key={n.label} filter="url(#ns)">
                        <rect x={n.x - n.w / 2} y={n.y - 22} width={n.w} height={44} rx="9"
                          fill={n.bg} stroke={n.border} strokeWidth="1.5" />
                        <text x={n.x - n.w / 2 + 16} y={n.y} textAnchor="middle" dominantBaseline="middle" fontSize="13">{n.icon}</text>
                        <text x={n.x - n.w / 2 + 34} y={n.y} dominantBaseline="middle"
                          fill={n.color} fontSize="11.5" fontWeight="600">{n.label}</text>
                        {/* Agent label */}
                        <text x={n.x} y={n.y + 34} textAnchor="middle" fill="#94a3b8" fontSize="9.5">Agent</text>
                      </g>
                    ))}

                    {/* Step labels */}
                    <text x="1168" y="200" textAnchor="middle" fill="#94a3b8" fontSize="9">① Read KB</text>
                    <text x="1410" y="200" textAnchor="middle" fill="#94a3b8" fontSize="9">② Generate Plan</text>
                    <text x="1640" y="200" textAnchor="middle" fill="#94a3b8" fontSize="9">③ Dispatch Tasks</text>
                  </svg>
                </div>
              </div>
            </div>
          )}

          {/* ── ACTIONS ── */}

          {tab === "actions" && (
            <div className="fade" style={{ padding: "0 40px" }}>
              <SectionHeader
                title="Actions & State Transitions"
                sub="Hover vào một row để highlight transition tương ứng trên State Machine"
              />
              <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e2e8f0", boxShadow: "0 1px 4px rgba(0,0,0,.04)", overflow: "hidden" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                  <thead>
                    <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
                      {["Action Code", "Role", "Description", "From States", "To State", "Side Effect"].map(h => (
                        <th key={h} style={{ textAlign: "left", padding: "13px 20px", color: "#64748b", fontWeight: 600, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.6px", whiteSpace: "nowrap" }}>{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {actions.map((a, i) => {
                      const isHov = hoveredAction === a.code;
                      const toNode = stateNodes.find(s => s.key === a.to)!;
                      return (
                        <tr key={i} className="tr-hover"
                          onMouseEnter={() => setHoveredAction(a.code)}
                          onMouseLeave={() => setHoveredAction(null)}
                          style={{ borderBottom: "1px solid #f1f5f9", background: isHov ? "#fafbff" : "#fff", cursor: "default", transition: "background .12s" }}
                        >
                          <td style={{ padding: "14px 20px" }}>
                            <code style={{
                              background: isHov ? "#ede9fe" : "#f1f5f9",
                              color: isHov ? "#5b21b6" : "#334155",
                              border: `1px solid ${isHov ? "#c4b5fd" : "#e2e8f0"}`,
                              padding: "3px 10px", borderRadius: 6, fontWeight: 600, fontSize: 12,
                              transition: "all .15s", display: "inline-block"
                            }}>{a.code}</code>
                          </td>
                          <td style={{ padding: "14px 20px" }}>
                            <RoleBadge role={a.role} />
                          </td>
                          <td style={{ padding: "14px 20px", color: "#475569", lineHeight: 1.5 }}>{a.desc}</td>
                          <td style={{ padding: "14px 20px" }}>
                            <div style={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
                              {a.from.map(f => {
                                const node = stateNodes.find(s => s.key === f)!;
                                return (
                                  <span key={f} style={{ background: node.bg, color: node.color, border: `1px solid ${node.border}`, padding: "2px 8px", borderRadius: 5, fontSize: 11, fontWeight: 500 }}>{f}</span>
                                );
                              })}
                            </div>
                          </td>
                          <td style={{ padding: "14px 20px" }}>
                            <span style={{ background: toNode.bg, color: toNode.color, border: `1px solid ${toNode.border}`, padding: "2px 8px", borderRadius: 5, fontSize: 11, fontWeight: 600 }}>{a.to}</span>
                          </td>
                          <td style={{ padding: "14px 20px", fontSize: 12 }}>
                            {a.side === "—"
                              ? <span style={{ color: "#cbd5e1" }}>—</span>
                              : <span style={{ background: "#f0fdf4", color: "#15803d", border: "1px solid #bbf7d0", padding: "3px 10px", borderRadius: 6, fontSize: 11, fontWeight: 500 }}>{a.side}</span>
                            }
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
                <div style={{ padding: "12px 24px", background: "#fffbeb", borderTop: "1px solid #fde68a", fontSize: 12, color: "#92400e", display: "flex", alignItems: "center", gap: 8 }}>
                  <span>⚠</span>
                  Task Executor gọi action của Task Manager → hệ thống trả về
                  <code style={{ background: "#fef3c7", border: "1px solid #fcd34d", padding: "1px 7px", borderRadius: 5, color: "#b45309", fontWeight: 700 }}>403 Forbidden</code>
                </div>
              </div>
            </div>
          )}

          {/* ── ROLES ── */}
          {tab === "roles" && (
            <div className="fade" style={{ padding: "0 40px" }}>
              <SectionHeader title="Roles & Permissions" sub="Phân quyền theo role — Task Executor và Task Manager" />

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, marginBottom: 24 }}>
                {[
                  {
                    role: "Task Executor", icon: "👤", accent: "#6d28d9", light: "#f5f3ff", border: "#ddd6fe",
                    actions: ["drafting", "request-review", "cancel-review"],
                    desc: "Người tạo và chỉnh sửa tài liệu. Generate nội dung, self-review, và gửi yêu cầu review lên Manager.",
                  },
                  {
                    role: "Task Manager", icon: "👑", accent: "#b45309", light: "#fffbeb", border: "#fde68a",
                    actions: ["start-review", "approve", "reject", "on-hold", "track-back", "change"],
                    desc: "Lead của role. Review tài liệu, đưa ra quyết định phê duyệt hoặc yêu cầu chỉnh sửa.",
                  },
                ].map(r => (
                  <div key={r.role} style={{ background: "#fff", border: `1px solid ${r.border}`, borderRadius: 16, overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,.04)" }}>
                    <div style={{ background: r.light, padding: "24px 28px", borderBottom: `1px solid ${r.border}` }}>
                      <div style={{ display: "flex", alignItems: "center", gap: 14, marginBottom: 10 }}>
                        <div style={{ width: 48, height: 48, borderRadius: 12, background: "#fff", border: `2px solid ${r.border}`, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 24, boxShadow: "0 2px 8px rgba(0,0,0,.06)" }}>
                          {r.icon}
                        </div>
                        <div>
                          <div style={{ fontWeight: 700, color: r.accent, fontSize: 16 }}>{r.role}</div>
                          <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 2 }}>{r.actions.length} actions allowed</div>
                        </div>
                      </div>
                      <p style={{ fontSize: 13, color: "#64748b", lineHeight: 1.6 }}>{r.desc}</p>
                    </div>
                    <div style={{ padding: "20px 28px" }}>
                      <div style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "1px", marginBottom: 12 }}>Allowed Actions</div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 8 }}>
                        {r.actions.map(a => (
                          <code key={a} style={{ background: "#f8fafc", border: "1px solid #e2e8f0", padding: "5px 12px", borderRadius: 8, fontSize: 12, color: "#334155", fontWeight: 500 }}>{a}</code>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div style={{ background: "#fff", borderRadius: 16, border: "1px solid #e2e8f0", boxShadow: "0 1px 4px rgba(0,0,0,.04)", overflow: "hidden" }}>
                <div style={{ padding: "18px 28px", borderBottom: "1px solid #f1f5f9" }}>
                  <div style={{ fontSize: 15, fontWeight: 600, color: "#0f172a" }}>Permission Matrix</div>
                  <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 3 }}>Tổng hợp quyền thực thi theo từng action</div>
                </div>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                  <thead>
                    <tr style={{ background: "#f8fafc", borderBottom: "1px solid #e2e8f0" }}>
                      <th style={{ textAlign: "left", padding: "12px 28px", color: "#64748b", fontWeight: 600, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.6px" }}>Action</th>
                      <th style={{ textAlign: "center", padding: "12px 28px", color: "#6d28d9", fontWeight: 600, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.6px" }}>👤 Task Executor</th>
                      <th style={{ textAlign: "center", padding: "12px 28px", color: "#b45309", fontWeight: 600, fontSize: 11, textTransform: "uppercase", letterSpacing: "0.6px" }}>👑 Task Manager</th>
                    </tr>
                  </thead>
                  <tbody>
                    {actions.map((a, i) => (
                      <tr key={i} className="perm-row" style={{ borderBottom: "1px solid #f1f5f9", transition: "background .12s" }}>
                        <td style={{ padding: "13px 28px" }}>
                          <code style={{ background: "#f1f5f9", border: "1px solid #e2e8f0", padding: "3px 10px", borderRadius: 6, fontSize: 12, color: "#334155", fontWeight: 600 }}>{a.code}</code>
                        </td>
                        <td style={{ padding: "13px 28px", textAlign: "center" }}>
                          {a.role === "executor"
                            ? <span style={{ background: "#f0fdf4", color: "#15803d", border: "1px solid #bbf7d0", padding: "4px 14px", borderRadius: 20, fontSize: 12, fontWeight: 600 }}>✓ Allow</span>
                            : <span style={{ background: "#fef2f2", color: "#dc2626", border: "1px solid #fecaca", padding: "4px 14px", borderRadius: 20, fontSize: 12, fontWeight: 500 }}>✕ 403</span>
                          }
                        </td>
                        <td style={{ padding: "13px 28px", textAlign: "center" }}>
                          {a.role === "manager"
                            ? <span style={{ background: "#f0fdf4", color: "#15803d", border: "1px solid #bbf7d0", padding: "4px 14px", borderRadius: 20, fontSize: 12, fontWeight: 600 }}>✓ Allow</span>
                            : <span style={{ color: "#e2e8f0", fontSize: 20 }}>—</span>
                          }
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ── WORKFLOWS ── */}
          {tab === "workflows" && (
            <div className="fade" style={{ padding: "0 40px" }}>
              <SectionHeader title="4 Workflow Phases" sub="Tổng quan các phase và danh sách tài liệu thuộc từng workflow" />
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20 }}>
                {workflows.map(w => {
                  const docCount = (w as any).subgroups
                    ? (w as any).subgroups.reduce((a: number, g: any) => a + g.docs.length, 0)
                    : (w as any).docs.length;
                  return (
                    <div key={w.id} className="wf-card" style={{ background: "#fff", borderRadius: 16, border: "1px solid #e2e8f0", overflow: "hidden", boxShadow: "0 1px 4px rgba(0,0,0,.04)" }}>
                      {/* Card header */}
                      <div style={{ background: w.gradient, padding: "20px 24px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                          <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(255,255,255,.22)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, fontWeight: 700, color: "#fff", flexShrink: 0 }}>
                            {w.id}
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{ color: "#fff", fontWeight: 700, fontSize: 15, letterSpacing: "-0.2px" }}>Phase {w.id} — {w.name}</div>
                            <div style={{ color: "rgba(255,255,255,.7)", fontSize: 12, marginTop: 2 }}>{docCount} documents</div>
                          </div>
                          <div style={{ background: "rgba(255,255,255,.2)", color: "#fff", borderRadius: 20, padding: "4px 12px", fontSize: 12, fontWeight: 600, backdropFilter: "blur(4px)" }}>
                            {docCount} docs
                          </div>
                        </div>
                      </div>

                      {/* Doc list */}
                      <div style={{ padding: "16px 20px" }}>
                        {(w as any).subgroups ? (w as any).subgroups.map((sg: any, si: number) => (
                          <div key={sg.label} style={{ marginBottom: si < (w as any).subgroups.length - 1 ? 16 : 0 }}>
                            <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 8 }}>
                              <span style={{ fontSize: 10, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "1px" }}>{sg.label}</span>
                              <span style={{ flex: 1, height: 1, background: "#f1f5f9" }} />
                            </div>
                            {sg.docs.map((d: string) => <DocRow key={d} d={d} accent={w.color} />)}
                          </div>
                        )) : (
                          (w as any).docs.map((d: string) => <DocRow key={d} d={d} accent={w.color} />)
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

        </div>
      </div>
    </>
  );
}

function SectionHeader({ title, sub }: { title: string; sub: string }) {
  return (
    <div style={{ marginBottom: 20 }}>
      <h2 style={{ fontSize: 20, fontWeight: 700, color: "#0f172a", letterSpacing: "-0.3px" }}>{title}</h2>
      <p style={{ fontSize: 13, color: "#94a3b8", marginTop: 4 }}>{sub}</p>
    </div>
  );
}

function RoleBadge({ role }: { role: string }) {
  const isManager = role === "manager";
  return (
    <span style={{
      background: isManager ? "#fffbeb" : "#f5f3ff",
      color: isManager ? "#b45309" : "#6d28d9",
      border: `1px solid ${isManager ? "#fde68a" : "#ddd6fe"}`,
      padding: "4px 10px", borderRadius: 20, fontSize: 11, fontWeight: 600, whiteSpace: "nowrap",
    }}>
      {isManager ? "👑 Manager" : "👤 Executor"}
    </span>
  );
}

function DocRow({ d }: { d: string; accent: string }) {
  const isYaml = d.endsWith(".yaml");
  return (
    <div className="doc-row" style={{
      display: "flex", alignItems: "center", gap: 10,
      padding: "7px 10px", borderRadius: 8, marginBottom: 4,
      background: "#fafbfc", cursor: "default", transition: "background .12s",
    }}>
      <div style={{ width: 28, height: 28, borderRadius: 6, flexShrink: 0, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 13,
        background: isYaml ? "#f0fdf4" : "#f8fafc",
        border: `1px solid ${isYaml ? "#bbf7d0" : "#e2e8f0"}`
      }}>
        {isYaml ? "📋" : "📄"}
      </div>
      <code style={{ fontSize: 12, color: "#475569", lineHeight: 1.4 }}>{d}</code>
      <span style={{ marginLeft: "auto", fontSize: 10, color: "#cbd5e1", fontWeight: 500, textTransform: "uppercase", letterSpacing: "0.5px" }}>{isYaml ? "yaml" : "md"}</span>
    </div>
  );
}
