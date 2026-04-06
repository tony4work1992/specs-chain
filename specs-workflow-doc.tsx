import { useState } from "react";

const workflows = [
  {
    id: 1, name: "Product Foundation", color: "#6366f1",
    docs: ["01-business-and-constraints.md","02-architecture-patterns.md","03-technology-stack.md","04-project-structure-and-conventions.md","05-infrastructure-and-cicd.md","06-networking-and-security.md","07-cost-management.md","08-design-system-and-ui.md","09-observability-and-monitoring.md"],
  },
  {
    id: 2, name: "Business Requirements", color: "#f59e0b",
    docs: ["01-end-user-requirement.md","02-business-requirement-document.md"],
  },
  {
    id: 3, name: "Technical & Design", color: "#10b981",
    subgroups: [
      { label: "Technical", docs: ["01-system-context.md","02-functional-requirement-document.md","03-functional-specifications.yaml"] },
      { label: "Design", docs: ["01-strategic-architecture.md","02-tactic-architecture.yaml","03-ui-component-architecture.yaml","04-flow-sequence.md"] },
    ],
  },
  {
    id: 4, name: "Testing", color: "#ef4444",
    docs: ["01-test-scope.yaml","02-test-impact.yaml","03-test-checklist.yaml","04-test-cases.yaml","05-test-steps.yaml"],
  },
];

const stateNodes = [
  { key: "draft", label: "Draft", color: "#94a3b8", bg: "#f1f5f9", icon: "✏️" },
  { key: "pending_review", label: "Pending Review", color: "#a78bfa", bg: "#f5f3ff", icon: "⏳" },
  { key: "in_review", label: "In Review", color: "#f59e0b", bg: "#fef9c3", icon: "👁️" },
  { key: "approved", label: "Approved", color: "#10b981", bg: "#ecfdf5", icon: "✓" },
  { key: "rejected", label: "Rejected", color: "#ef4444", bg: "#fef2f2", icon: "✕" },
  { key: "on_hold", label: "On Hold", color: "#64748b", bg: "#f1f5f9", icon: "⏸" },
  { key: "change", label: "Change Requested", color: "#0ea5e9", bg: "#f0f9ff", icon: "🔄" },
];

const actions = [
  { code: "drafting", desc: "Đưa workflow về trạng thái Draft", side: "Truyền toàn bộ request body xuống để cập nhật nội dung", role: "executor", from: ["rejected","change","on_hold"], to: "draft" },
  { code: "request-review", desc: "Gửi yêu cầu review", side: "—", role: "executor", from: ["draft"], to: "pending_review" },
  { code: "cancel-review", desc: "Hủy yêu cầu review đang chờ", side: "—", role: "executor", from: ["pending_review"], to: "draft" },
  { code: "start-review", desc: "Bắt đầu quá trình review", side: "—", role: "manager", from: ["pending_review"], to: "in_review" },
  { code: "approve", desc: "Phê duyệt workflow", side: "Publish event businessUpdated ra message broker", role: "manager", from: ["in_review"], to: "approved" },
  { code: "reject", desc: "Từ chối", side: "—", role: "manager", from: ["in_review"], to: "rejected" },
  { code: "on-hold", desc: "Tạm giữ, chưa xử lý tiếp", side: "—", role: "manager", from: ["in_review","pending_review"], to: "on_hold" },
  { code: "track-back", desc: "Quay về trạng thái trước", side: "—", role: "manager", from: ["in_review","pending_review","on_hold"], to: "draft" },
  { code: "change", desc: "Đánh dấu cần thay đổi", side: "—", role: "manager", from: ["in_review","approved"], to: "change" },
];

const Badge = ({ children, bg, color }) => (
  <span style={{ background: bg, color, padding: "2px 8px", borderRadius: 4, fontSize: 11, fontWeight: 600, whiteSpace: "nowrap" }}>{children}</span>
);

const StateBox = ({ s, small }) => (
  <div style={{
    background: s.bg, border: `2px solid ${s.color}`, borderRadius: small ? 8 : 10,
    padding: small ? "6px 12px" : "10px 18px", display: "flex", alignItems: "center", gap: 6,
    justifyContent: "center", whiteSpace: "nowrap"
  }}>
    <span style={{ fontSize: small ? 14 : 18 }}>{s.icon}</span>
    <span style={{ fontWeight: 600, color: s.color, fontSize: small ? 12 : 14 }}>{s.label}</span>
  </div>
);

const SvgArrow = ({ x1, y1, x2, y2, label, color = "#94a3b8", dashed }) => {
  const dx = x2 - x1, dy = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy);
  const ux = dx / len, uy = dy / len;
  const ax = x2 - ux * 8, ay = y2 - uy * 8;
  const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
  return (
    <g>
      <line x1={x1} y1={y1} x2={ax} y2={ay} stroke={color} strokeWidth="1.5" strokeDasharray={dashed ? "4 3" : "none"} />
      <polygon points={`${x2},${y2} ${ax - uy * 4},${ay + ux * 4} ${ax + uy * 4},${ay - ux * 4}`} fill={color} />
      {label && (
        <text x={mx} y={my - 6} textAnchor="middle" fill="#64748b" fontSize="9" fontWeight="500">{label}</text>
      )}
    </g>
  );
};

export default function App() {
  const [tab, setTab] = useState("lifecycle");
  const [hoveredAction, setHoveredAction] = useState(null);

  const tabs = [
    { key: "lifecycle", label: "State Machine" },
    { key: "actions", label: "Actions & Transitions" },
    { key: "roles", label: "Roles & Permissions" },
    { key: "workflows", label: "4 Workflows" },
  ];

  const nodePos = {
    draft: { x: 100, y: 80 },
    pending_review: { x: 320, y: 80 },
    in_review: { x: 540, y: 80 },
    approved: { x: 700, y: 80 },
    rejected: { x: 540, y: 220 },
    on_hold: { x: 320, y: 220 },
    change: { x: 700, y: 220 },
  };

  const transitions = [
    { from: "draft", to: "pending_review", label: "request-review", color: "#6366f1" },
    { from: "pending_review", to: "draft", label: "cancel-review", color: "#94a3b8", dashed: true },
    { from: "pending_review", to: "in_review", label: "start-review", color: "#f59e0b" },
    { from: "in_review", to: "approved", label: "approve", color: "#10b981" },
    { from: "in_review", to: "rejected", label: "reject", color: "#ef4444" },
    { from: "rejected", to: "draft", label: "drafting", color: "#94a3b8", dashed: true },
    { from: "in_review", to: "on_hold", label: "on-hold", color: "#64748b" },
    { from: "pending_review", to: "on_hold", label: "on-hold", color: "#64748b" },
    { from: "on_hold", to: "draft", label: "track-back", color: "#94a3b8", dashed: true },
    { from: "in_review", to: "change", label: "change", color: "#0ea5e9" },
    { from: "approved", to: "change", label: "change", color: "#0ea5e9" },
    { from: "change", to: "draft", label: "drafting", color: "#94a3b8", dashed: true },
    { from: "in_review", to: "draft", label: "track-back", color: "#94a3b8", dashed: true },
    { from: "pending_review", to: "draft", label: "track-back", color: "#94a3b8", dashed: true },
  ];

  return (
    <div style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif", background: "#fafbfc", minHeight: "100vh", padding: "24px 16px" }}>
      <div style={{ maxWidth: 960, margin: "0 auto" }}>
        <h1 style={{ fontSize: 22, fontWeight: 700, color: "#1e293b", marginBottom: 4 }}>SPECS Generation System</h1>
        <p style={{ color: "#64748b", fontSize: 14, marginBottom: 20 }}>Document Lifecycle & Workflow Visualization</p>

        <div style={{ display: "flex", gap: 4, marginBottom: 24, background: "#e2e8f0", borderRadius: 8, padding: 3, width: "fit-content", flexWrap: "wrap" }}>
          {tabs.map(t => (
            <button key={t.key} onClick={() => setTab(t.key)} style={{
              padding: "8px 14px", borderRadius: 6, border: "none", cursor: "pointer", fontSize: 13, fontWeight: 500,
              background: tab === t.key ? "#fff" : "transparent", color: tab === t.key ? "#1e293b" : "#64748b",
              boxShadow: tab === t.key ? "0 1px 3px rgba(0,0,0,.1)" : "none", transition: "all .2s"
            }}>{t.label}</button>
          ))}
        </div>

        {tab === "lifecycle" && (
          <div style={{ background: "#fff", borderRadius: 12, padding: 24, border: "1px solid #e2e8f0" }}>
            <h2 style={{ fontSize: 16, fontWeight: 600, color: "#1e293b", marginBottom: 8 }}>Document State Machine</h2>
            <p style={{ fontSize: 12, color: "#94a3b8", marginBottom: 16 }}>Hover action trong tab "Actions" để highlight transition tương ứng</p>

            <div style={{ overflowX: "auto" }}>
              <svg width="820" height="300" viewBox="0 0 820 300" style={{ display: "block", margin: "0 auto" }}>
                <defs>
                  <filter id="shadow"><feDropShadow dx="0" dy="1" stdDeviation="2" floodOpacity="0.1"/></filter>
                </defs>

                {transitions.map((t, i) => {
                  const f = nodePos[t.from], to = nodePos[t.to];
                  const offY = t.from === "pending_review" && t.to === "draft" && t.label === "cancel-review" ? -15
                    : t.from === "pending_review" && t.to === "draft" && t.label === "track-back" ? 15
                    : t.from === "pending_review" && t.to === "on_hold" ? 10
                    : t.from === "in_review" && t.to === "draft" ? -25
                    : 0;
                  const offX = t.from === "on_hold" && t.to === "draft" ? 0 : 0;
                  return (
                    <SvgArrow key={i} x1={f.x} y1={f.y + offY} x2={to.x + offX} y2={to.y + (to.y > f.y ? -20 : to.y < f.y ? 20 : offY)}
                      label={t.label} color={hoveredAction === t.label ? t.color : "#cbd5e1"} dashed={t.dashed}
                    />
                  );
                })}

                {stateNodes.map(s => {
                  const p = nodePos[s.key];
                  if (!p) return null;
                  return (
                    <g key={s.key} filter="url(#shadow)">
                      <rect x={p.x - 55} y={p.y - 18} width="110" height="36" rx="8" fill={s.bg} stroke={s.color} strokeWidth="2" />
                      <text x={p.x} y={p.y + 1} textAnchor="middle" dominantBaseline="middle" fill={s.color} fontSize="12" fontWeight="600">
                        {s.icon} {s.label}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center", marginTop: 16 }}>
              {[
                { label: "Executor action", color: "#6366f1", dashed: false },
                { label: "Manager action", color: "#f59e0b", dashed: false },
                { label: "Return / Rollback", color: "#94a3b8", dashed: true },
              ].map(l => (
                <div key={l.label} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 12, color: "#64748b" }}>
                  <svg width="30" height="10">
                    <line x1="0" y1="5" x2="30" y2="5" stroke={l.color} strokeWidth="2" strokeDasharray={l.dashed ? "4 3" : "none"} />
                  </svg>
                  {l.label}
                </div>
              ))}
            </div>
          </div>
        )}

        {tab === "actions" && (
          <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0", overflow: "hidden" }}>
            <div style={{ padding: "16px 20px", borderBottom: "1px solid #e2e8f0" }}>
              <h2 style={{ fontSize: 16, fontWeight: 600, color: "#1e293b", margin: 0 }}>Actions & State Transitions</h2>
            </div>
            <div style={{ overflowX: "auto" }}>
              <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                <thead>
                  <tr style={{ background: "#f8fafc" }}>
                    {["Action Code", "Role", "Description", "From → To", "Side Effect"].map(h => (
                      <th key={h} style={{ textAlign: "left", padding: "10px 14px", borderBottom: "2px solid #e2e8f0", color: "#475569", fontWeight: 600, whiteSpace: "nowrap" }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {actions.map((a, i) => (
                    <tr key={i}
                      onMouseEnter={() => setHoveredAction(a.code)}
                      onMouseLeave={() => setHoveredAction(null)}
                      style={{ borderBottom: "1px solid #f1f5f9", background: hoveredAction === a.code ? "#f8fafc" : "transparent", cursor: "pointer", transition: "background .15s" }}
                    >
                      <td style={{ padding: "10px 14px" }}>
                        <code style={{ background: "#f1f5f9", padding: "2px 8px", borderRadius: 4, fontWeight: 600, color: "#334155", fontSize: 12 }}>{a.code}</code>
                      </td>
                      <td style={{ padding: "10px 14px" }}>
                        <Badge bg={a.role === "manager" ? "#fef9c3" : "#ede9fe"} color={a.role === "manager" ? "#b45309" : "#6d28d9"}>
                          {a.role === "manager" ? "Task Manager" : "Task Executor"}
                        </Badge>
                      </td>
                      <td style={{ padding: "10px 14px", color: "#475569" }}>{a.desc}</td>
                      <td style={{ padding: "10px 14px" }}>
                        <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                          {a.from.map(f => (
                            <span key={f} style={{ fontSize: 12, color: "#64748b" }}>
                              <span style={{ color: "#94a3b8" }}>{f}</span> → <span style={{ color: stateNodes.find(s => s.key === a.to)?.color, fontWeight: 600 }}>{a.to}</span>
                            </span>
                          ))}
                        </div>
                      </td>
                      <td style={{ padding: "10px 14px", color: a.side === "—" ? "#cbd5e1" : "#475569", fontSize: 12 }}>
                        {a.side === "—" ? "—" : (
                          <span style={{ background: "#ecfdf5", color: "#059669", padding: "2px 6px", borderRadius: 4, fontSize: 11 }}>
                            {a.side}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div style={{ padding: "12px 20px", background: "#fffbeb", borderTop: "1px solid #fde68a", fontSize: 12, color: "#92400e" }}>
              ⚠️ Task Executor gọi action của Task Manager → hệ thống trả về <code style={{ fontWeight: 700 }}>403 Forbidden</code>
            </div>
          </div>
        )}

        {tab === "roles" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
              {[
                {
                  role: "Task Executor", icon: "👤", color: "#6d28d9", bg: "#ede9fe",
                  actions: ["drafting", "request-review", "cancel-review"],
                  desc: "Người tạo và chỉnh sửa tài liệu. Generate nội dung, self-review, và gửi yêu cầu review."
                },
                {
                  role: "Task Manager", icon: "👑", color: "#b45309", bg: "#fef9c3",
                  actions: ["start-review", "approve", "reject", "on-hold", "track-back", "change"],
                  desc: "Lead của role. Review tài liệu, đưa ra quyết định phê duyệt hoặc yêu cầu chỉnh sửa."
                },
              ].map(r => (
                <div key={r.role} style={{ flex: 1, minWidth: 280, background: "#fff", border: "1px solid #e2e8f0", borderRadius: 12, overflow: "hidden" }}>
                  <div style={{ background: r.bg, padding: "16px 20px", display: "flex", alignItems: "center", gap: 10 }}>
                    <span style={{ fontSize: 28 }}>{r.icon}</span>
                    <div>
                      <div style={{ fontWeight: 700, color: r.color, fontSize: 16 }}>{r.role}</div>
                      <div style={{ fontSize: 12, color: "#64748b", marginTop: 2 }}>{r.desc}</div>
                    </div>
                  </div>
                  <div style={{ padding: 16 }}>
                    <div style={{ fontSize: 11, fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: 1, marginBottom: 8 }}>Allowed Actions</div>
                    <div style={{ display: "flex", flexWrap: "wrap", gap: 6 }}>
                      {r.actions.map(a => (
                        <code key={a} style={{ background: "#f1f5f9", padding: "4px 10px", borderRadius: 6, fontSize: 12, color: "#334155", fontWeight: 500 }}>{a}</code>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0", overflow: "hidden" }}>
              <div style={{ padding: "16px 20px", borderBottom: "1px solid #e2e8f0" }}>
                <h2 style={{ fontSize: 16, fontWeight: 600, color: "#1e293b", margin: 0 }}>Permission Matrix</h2>
              </div>
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
                  <thead>
                    <tr style={{ background: "#f8fafc" }}>
                      <th style={{ textAlign: "left", padding: "10px 14px", borderBottom: "2px solid #e2e8f0", color: "#475569", fontWeight: 600 }}>Action</th>
                      <th style={{ textAlign: "center", padding: "10px 14px", borderBottom: "2px solid #e2e8f0", color: "#6d28d9", fontWeight: 600 }}>Task Executor</th>
                      <th style={{ textAlign: "center", padding: "10px 14px", borderBottom: "2px solid #e2e8f0", color: "#b45309", fontWeight: 600 }}>Task Manager</th>
                    </tr>
                  </thead>
                  <tbody>
                    {actions.map((a, i) => (
                      <tr key={i} style={{ borderBottom: "1px solid #f1f5f9" }}>
                        <td style={{ padding: "10px 14px" }}>
                          <code style={{ fontSize: 12, fontWeight: 600, color: "#334155" }}>{a.code}</code>
                        </td>
                        <td style={{ padding: "10px 14px", textAlign: "center" }}>
                          {a.role === "executor"
                            ? <span style={{ color: "#10b981", fontSize: 18, fontWeight: 700 }}>✓</span>
                            : <span style={{ color: "#fca5a5", fontSize: 14 }}>✕ 403</span>}
                        </td>
                        <td style={{ padding: "10px 14px", textAlign: "center" }}>
                          {a.role === "manager"
                            ? <span style={{ color: "#10b981", fontSize: 18, fontWeight: 700 }}>✓</span>
                            : <span style={{ color: "#e2e8f0", fontSize: 18 }}>—</span>}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

        {tab === "workflows" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {workflows.map(w => (
              <div key={w.id} style={{ background: "#fff", borderRadius: 12, border: "1px solid #e2e8f0", overflow: "hidden" }}>
                <div style={{ background: w.color, padding: "12px 20px", display: "flex", alignItems: "center", gap: 10 }}>
                  <span style={{ background: "rgba(255,255,255,.25)", color: "#fff", borderRadius: 6, padding: "2px 10px", fontSize: 13, fontWeight: 700 }}>
                    {w.id}
                  </span>
                  <span style={{ color: "#fff", fontWeight: 600, fontSize: 15 }}>{w.name}</span>
                  <span style={{ marginLeft: "auto", color: "rgba(255,255,255,.8)", fontSize: 12 }}>
                    {w.subgroups ? w.subgroups.reduce((a, g) => a + g.docs.length, 0) : w.docs.length} documents
                  </span>
                </div>
                <div style={{ padding: 16 }}>
                  {w.subgroups ? w.subgroups.map(sg => (
                    <div key={sg.label} style={{ marginBottom: 12 }}>
                      <div style={{ fontSize: 12, fontWeight: 600, color: "#64748b", textTransform: "uppercase", letterSpacing: 1, marginBottom: 6 }}>{sg.label}</div>
                      <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                        {sg.docs.map(d => (
                          <div key={d} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 10px", background: "#f8fafc", borderRadius: 6 }}>
                            <span style={{ fontSize: 14 }}>{d.endsWith(".yaml") ? "📋" : "📄"}</span>
                            <code style={{ fontSize: 13, color: "#334155" }}>{d}</code>
                          </div>
                        ))}
                      </div>
                    </div>
                  )) : (
                    <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                      {w.docs.map(d => (
                        <div key={d} style={{ display: "flex", alignItems: "center", gap: 8, padding: "6px 10px", background: "#f8fafc", borderRadius: 6 }}>
                          <span style={{ fontSize: 14 }}>{d.endsWith(".yaml") ? "📋" : "📄"}</span>
                          <code style={{ fontSize: 13, color: "#334155" }}>{d}</code>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
