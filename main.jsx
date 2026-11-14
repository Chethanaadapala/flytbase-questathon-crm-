import React, { useEffect, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import "./style.css";

const accounts = [
  {
    id: "A", name: "Eastern Counties Police Alliance", sector: "Public safety · UK",
    value: "£1.5m + £250k + £180k + £60k + £45k (separate items; not a committed total)",
    deals: [
      { name: "300-dock framework tender", value: "Up to £1.5m", status: "At risk", basis: "Opportunity value supplied in account data", source: "get_my_accounts → Eastern Counties → opportunities" },
      { name: "Westmere scale to 30 docks", value: "Up to £250,000", status: "Blocked", basis: "Opportunity value supplied in account data", source: "get_my_accounts → Eastern Counties → opportunities" },
      { name: "Metro Central extra docks", value: "£180,000", status: "Open offer", basis: "Offer listed as open", source: "get_my_accounts → Eastern Counties → offers" },
      { name: "Priority support for drone units", value: "£60,000", status: "Open offer", basis: "Offer listed as open", source: "get_my_accounts → Eastern Counties → offers" },
      { name: "Operator training", value: "£45,000", status: "Declined", basis: "Offer listed as declined; exclude from active pipeline", source: "get_my_accounts → Eastern Counties → offers" },
      { name: "Alliance renewal · 35 docks", value: "Value not supplied", status: "Out of reach", basis: "No supported value in supplied account summary", source: "get_my_accounts → Eastern Counties → opportunities" }
    ],
    people: [
      ["Hannah Doyle", "Procurement lead", "Warm", "Procurement / tender process"],
      ["Ewan Brooks", "Metro Central finance partner", "Warm", "Finance / cost approval"],
      ["Karen Mbeki", "Westmere drone unit inspector", "Neutral", "Operational user; urgent support request"],
      ["Rhys Calder", "Alliance drone programme lead", "Warm · leaving Jan 2027", "Current champion; single-threaded relationship risk"]
    ],
    moves: [
      ["1", "Reply to Karen on ticket FB-11206: confirm training dates and event-day failure contact / response route.", "Proposed owner: customer success lead + Karen", "This week; before 5 Dec event", "get_signals → urgent_request (18 Nov); Karen Mbeki"],
      ["2", "Secure introductions to Hannah, Ewan and Karen; identify Rhys's successor and document handover.", "Proposed owner: account lead", "Before Rhys leaves in Jan 2027", "get_signals → champion_leaves (17 Nov); Rhys Calder"],
      ["3", "Build a cost-per-flight and staffing model for 300 docks; compare with helicopter air support and confirm each force's funding / CFO approval.", "Proposed owner: finance + operations", "Before formal tender clarification / submission window", "get_my_accounts → Ewan Brooks; Karen Mbeki; tender evaluation facts"]
    ],
    risks: [
      ["Critical", "Karen's urgent request has no reply; public event is 5 Dec.", "Respond this week; confirm named on-call contact and training plan.", "get_signals → urgent_request; ticket FB-11206"],
      ["High", "Rhys leaves in Jan 2027; no successor named and calls were only with him.", "Multi-thread relationships and complete handover.", "get_signals → champion_leaves; Rhys Calder"],
      ["High", "300-dock tender lacks a costed operating model and staffing plan.", "Cost per flight, operator numbers, shift coverage and force-by-force funding.", "get_my_accounts → tender / Karen / Ewan facts"],
      ["High", "Four forces do not share a pooled budget; each CFO approves its own call-off.", "Validate each force's budget and approval route.", "get_my_accounts → Rhys Calder / Ewan Brooks facts"]
    ],
    gaps: [
      ["Actual cost per drone flight and comparable overtime cost", "Ewan Brooks + finance", "Needed for CFO comparison against ~£1,500 helicopter hour; Ewan said figures could be pulled in a week.", "get_my_accounts → Ewan Brooks"],
      ["Named successor to Rhys Calder", "Rhys Calder / Hannah Doyle", "Programme continuity and relationship coverage before January 2027.", "get_signals → champion_leaves"],
      ["300-dock staffing model, operator capacity and shift coverage", "Karen Mbeki + operations", "Tender operating-model score is 40%; no agreed plan is on file.", "get_my_accounts → tender / Karen facts"],
      ["Per-force budget and CFO approval status", "Ewan Brooks + each force finance lead", "No pooled funding; each force has separate budget approval.", "get_my_accounts → Ewan Brooks / Rhys facts"]
    ]
  },
  {
    id: "B", name: "Aldermoor Industrial Group", sector: "Industrial · Europe",
    value: "€140k + €180k + €160k (won) + €50k open; €1.2m savings claim is unverified and excluded",
    deals: [
      { name: "Renew Aldermoor contract · 14 docks", value: "Up to 140,000 (currency not stated in supplied summary)", status: "Blocked", basis: "Opportunity value supplied; finance cannot verify savings", source: "get_my_accounts → Aldermoor → opportunities" },
      { name: "Bring idle plants into regular patrol", value: "Up to 180,000 (currency not stated in supplied summary)", status: "Blocked", basis: "Opportunity value supplied; network / adoption blockers", source: "get_my_accounts → Aldermoor → opportunities" },
      { name: "Docks for Plant 15 and two idle plants", value: "160,000 (currency not stated in supplied summary)", status: "Won", basis: "Offer listed as won", source: "get_my_accounts → Aldermoor → offers" },
      { name: "Plant 7 night-time priority support", value: "€50,000", status: "Open offer", basis: "Offer listed as open", source: "get_my_accounts → Aldermoor → offers" },
      { name: "Flight-log reporting by plant", value: "€70,000", status: "Declined", basis: "Offer listed as declined; exclude from active pipeline", source: "get_my_accounts → Aldermoor → offers" }
    ],
    people: [
      ["Stefan Roy", "Group head of security", "Ally", "Champion; €1.2m savings estimate is his spreadsheet, not booked savings"],
      ["Beatriz Alonso", "Plant 7 manager", "Neutral", "Site operator contact; alerts reach her phone"],
      ["Julian Tate", "Insurance / risk manager", "Guarded", "Potential risk / insurer stakeholder"],
      ["Nadia Rahman", "Finance controller", "Neutral", "Finance validation / savings approval"]
    ],
    moves: [
      ["1", "Contact Plant 7 to agree who receives alerts and how guards respond; resolve contract exclusion.", "Proposed owner: Beatriz Alonso + security / contract owner", "Immediate", "get_my_accounts → Plant 7 facts"],
      ["2", "Investigate three formerly active docks that stopped flying; check flight logs, network changes and adoption with site owners.", "Proposed owner: customer success + site operations", "Immediate; live event window reported as last two weeks", "briefing live event → Aldermoor 3 docks; get_signals"],
      ["3", "Validate actual savings with Nadia; separate measured savings from Stefan's €1.2m estimate before renewal / case study.", "Proposed owner: Nadia Rahman + Stefan Roy", "Before renewal / 40-plant case study", "get_my_accounts → Stefan Roy / Nadia Rahman facts"]
    ],
    risks: [
      ["Critical", "Three docks that previously flew most nights stopped flying; all online, with no tickets or complaints.", "Proactive outreach and investigate network / usage / site ownership.", "Live event in briefing; get_signals"],
      ["High", "Plant 7 guards do not respond to drone alerts because their contract excludes it; alerts go to Beatriz's phone.", "Agree response protocol and contract responsibility.", "get_my_accounts → Beatriz Alonso / Plant 7"],
      ["High", "€1.2m annual savings is Stefan's estimate; no guard contracts reduced and finance booked no savings.", "Do not present as realised savings; validate with Nadia.", "get_my_accounts → Stefan Roy / Nadia Rahman"],
      ["High", "Deputy who knows rollout setup is leaving soon; process is undocumented; some plant managers resent the rollout.", "Document playbook and assign plant-level adoption owners.", "get_my_accounts → Aldermoor operational facts"]
    ],
    gaps: [
      ["Verified savings and actual reduction in guard costs", "Nadia Rahman + Stefan Roy", "The €1.2m figure is an unverified estimate; no savings booked.", "get_my_accounts → Stefan Roy / Nadia Rahman"],
      ["Root cause of three docks stopping flights", "Site managers + technical support", "All are online; no tickets or complaints explain the drop.", "Live event in briefing; get_signals"],
      ["Network project's impact and named owner for adoption", "Plant managers + network project lead", "Idle plants may lose connectivity; no adoption owner identified.", "get_my_accounts → Aldermoor opportunities / facts"],
      ["Documented rollout process and deputy handover", "Stefan Roy + departing deputy", "Setup knowledge is mostly in one person's head.", "get_my_accounts → Aldermoor operational facts"]
    ]
  }
];

const toolNames = ["whoami", "get_my_accounts", "get_signals", "get_feature_requests", "get_release_notes", "get_flytbase_team", "get_data_format", "list_notes"];
function App() {
  const [status, setStatus] = useState({ data: {}, notes: [] });
  const [busy, setBusy] = useState("");
  const [message, setMessage] = useState("");
  const [note, setNote] = useState("");
  const [account, setAccount] = useState("A");
  const [kind, setKind] = useState("next_step");
  const [tab, setTab] = useState("A");
  async function refresh() { const r = await fetch("/api/status"); setStatus(await r.json()); }
  useEffect(() => { refresh().catch(e => setMessage(e.message)); }, []);
  async function fetchTool(name) {
    setBusy(name); setMessage(`Fetching ${name}…`);
    try { const r = await fetch("/api/sync", { method:"POST", headers:{"content-type":"application/json"}, body:JSON.stringify({name}) }); const j=await r.json(); if(!r.ok) throw new Error(j.error||"Request failed"); await refresh(); setMessage(`${name} saved.`); }
    catch(e){setMessage(e.message); await refresh();} finally{setBusy("");}
  }
  async function sendNote(e) {
    e.preventDefault(); setBusy("note");
    try { const r=await fetch("/api/notes",{method:"POST",headers:{"content-type":"application/json"},body:JSON.stringify({text:note,account,kind})}); const j=await r.json(); if(!r.ok) throw new Error(j.error||"Could not save note"); setNote(""); await refresh(); setMessage("Note sent successfully."); }
    catch(e){setMessage(e.message);} finally{setBusy("");}
  }
  const selected = accounts.find(a=>a.id===tab);
  const saved = Object.keys(status.data||{}).length;
  return <main>
    <header className="hero"><div><span className="eyebrow">FLYTBASE QUESTATHON · CUSTOMER SUCCESS</span><h1>Account command centre</h1><p>Evidence-led account review for Monday. Two accounts, five manager questions, clear next actions.</p></div><span className={status.configured?"pill good":"pill warn"}>{status.configured?"Server token configured":"Token setup needed"}</span></header>
    <section className="scorebar"><div><b>2</b><span>Accounts covered</span></div><div><b>5</b><span>Manager questions answered</span></div><div><b>{saved}/8</b><span>Data tools saved</span></div><div><b>{status.notes?.length||0}</b><span>Notes sent</span></div></section>
    <nav className="tabs">{accounts.map(a=><button className={tab===a.id?"active":"secondary"} onClick={()=>setTab(a.id)} key={a.id}>{a.id} · {a.name}</button>)}</nav>
    <section className="account-head"><div><span className="eyebrow">ACCOUNT {selected.id} · {selected.sector}</span><h2>{selected.name}</h2></div><div className="valuebox"><small>Book view · evidence-backed items only</small><b>{selected.value}</b></div></section>
    <section><div className="section-title"><span>01</span><div><h2>What is the book worth?</h2><p>Separate open opportunities, won / declined offers and unverified claims. Do not add these into one forecast.</p></div></div><div className="dealgrid">{selected.deals.map((d,i)=><article className="deal" key={i}><div className="deal-top"><b>{d.name}</b><span className="status">{d.status}</span></div><strong>{d.value}</strong><p>{d.basis}</p><small>Source: {d.source}</small></article>)}</div></section>
    <section><div className="section-title"><span>02</span><div><h2>Who holds the power?</h2><p>Decision, finance, users and blockers — not just a contact list.</p></div></div><div className="peoplegrid">{selected.people.map((p,i)=><article className="person" key={i}><b>{p[0]}</b><span>{p[1]}</span><em>{p[2]}</em><p>{p[3]}</p></article>)}</div></section>
    <section><div className="section-title"><span>03</span><div><h2>What do you do first?</h2><p>Ranked actions. Owners are proposed assignments, not confirmed commitments.</p></div></div><div className="actionlist">{selected.moves.map((m,i)=><article className="action" key={i}><div className="rank">{m[0]}</div><div><b>{m[1]}</b><p><strong>Owner:</strong> {m[2]}<br/><strong>When:</strong> {m[3]}</p><small>Evidence: {m[4]}</small></div></article>)}</div></section>
    <section><div className="section-title"><span>04</span><div><h2>What is about to go wrong?</h2><p>Prioritised risks with a practical response.</p></div></div><div className="risklist">{selected.risks.map((r,i)=><article className="risk" key={i}><span className={r[0]==="Critical"?"critical":"high"}>{r[0]}</span><div><b>{r[1]}</b><p>{r[2]}</p><small>Source: {r[3]}</small></div></article>)}</div></section>
    <section><div className="section-title"><span>05</span><div><h2>What do you still not know?</h2><p>Explicit gaps, why they matter and who can answer them.</p></div></div><div className="gaplist">{selected.gaps.map((g,i)=><article className="gap" key={i}><b>{g[0]}</b><p><strong>Ask:</strong> {g[1]}</p><p>{g[2]}</p><small>Source / context: {g[3]}</small></article>)}</div></section>
    <section className="method"><h2>Evidence and limitations</h2><ul><li>Evidence labels point to the fetched account data, named contacts, signals and briefing live event. The current export shown in this starter does not expose individual record IDs, so this dashboard does not invent them.</li><li>Values labelled “up to” or “open” are opportunity / offer ceilings, not booked revenue. Declined offers are excluded from active pipeline.</li><li>Stefan Roy's €1.2m annual savings estimate is unverified and is not counted as realised savings.</li><li>Owners are proposed roles for action planning, not confirmed task assignments. Currency is not inferred where the account summary did not specify it.</li><li>Live refresh / automatic background sync and public hosting still need deployment and verification. Stored data is a snapshot; refresh from the server only when permitted by the one-call-per-minute rule.</li></ul></section>
    <section><h2>Live data and sync</h2><p>Previously fetched responses are saved on the server. Do not refresh tools unnecessarily; the challenge allows one call per minute per token.</p><div className="toolgrid">{toolNames.map(n=><div className="tool" key={n}><div><b>{n}</b><small>{status.data?.[n]?`Saved ${new Date(status.data[n].fetchedAt).toLocaleString()}`:"Not saved on this server"}</small></div><button className="secondary" disabled={!status.configured||Boolean(busy)} onClick={()=>fetchTool(n)}>{busy===n?"Fetching…":status.data?.[n]?"Refresh":"Fetch"}</button></div>)}</div><details><summary>Inspect saved source responses</summary>{Object.entries(status.data||{}).map(([n,v])=><details key={n}><summary>{n}</summary><pre>{JSON.stringify(v.value,null,2)}</pre></details>)}</details></section>
    <section><h2>Write a note back to Questathon</h2><form onSubmit={sendNote}><label>Account<select value={account} onChange={e=>setAccount(e.target.value)}><option value="A">A · Eastern Counties Police Alliance</option><option value="B">B · Aldermoor Industrial Group</option></select></label><label>Type<select value={kind} onChange={e=>setKind(e.target.value)}><option value="next_step">next_step</option><option value="risk">risk</option><option value="task">task</option><option value="note">note</option></select></label><label>Note<textarea rows="3" value={note} onChange={e=>setNote(e.target.value)} placeholder="Evidence-based customer-success note…"/></label><button disabled={!status.configured||Boolean(busy)||!note.trim()}>{busy==="note"?"Sending…":"Send note"}</button></form><h3>Notes sent ({status.notes?.length||0})</h3>{(status.notes||[]).map((n,i)=><p className="sentnote" key={i}><b>{n.kind} · {n.account||"Account not specified"}</b><br/>{n.text}</p>)}</section>
    {message&&<aside>{message}</aside>}<footer>Questathon CRM · Keep the token on the server. Never commit .env or publish secrets.</footer>
  </main>;
}
createRoot(document.getElementById("root")).render(<App/>);
