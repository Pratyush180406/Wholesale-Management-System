"use client";
import { useState } from "react";
import AppLayout from "../../components/AppLayout";

const MONTHLY = [
  { month:"Jan", value:320000, orders:38 },
  { month:"Feb", value:280000, orders:31 },
  { month:"Mar", value:410000, orders:47 },
  { month:"Apr", value:390000, orders:44 },
  { month:"May", value:460000, orders:52 },
  { month:"Jun", value:530000, orders:61 },
];

const CATEGORY_DATA = [
  { name:"Raw Materials", value:42, color:"var(--accent)" },
  { name:"Electronics", value:28, color:"var(--info)" },
  { name:"Packaging", value:15, color:"var(--success)" },
  { name:"Tools", value:9, color:"var(--warning)" },
  { name:"Apparel", value:6, color:"var(--danger)" },
];

const TOP_PRODUCTS = [
  { name:"Steel Bracket 40mm", qty:1240, revenue:186000 },
  { name:"Electrical Cable 4mm", qty:820, revenue:164000 },
  { name:"Safety Helmet ISI", qty:640, revenue:96000 },
  { name:"PVC Pipe 4in", qty:580, revenue:46400 },
  { name:"Welding Rod 3.15mm", qty:420, revenue:25200 },
];

const TOP_SUPPLIERS = [
  { name:"Tata Steel Ltd", orders:42, value:620000 },
  { name:"Havells India", orders:33, value:495000 },
  { name:"Schneider Electric", orders:28, value:350000 },
  { name:"Ambuja Cements", orders:19, value:190000 },
  { name:"Supreme Industries", orders:15, value:112500 },
];

export default function ReportsPage() {
  const [period, setPeriod] = useState("6M");
  const maxVal = Math.max(...MONTHLY.map(m => m.value));

  const fmtRs = (v: number) => v >= 100000 ? `₹${(v/100000).toFixed(1)}L` : `₹${(v/1000).toFixed(0)}K`;

  return (
    <AppLayout title="Reports" subtitle="Analytics & Insights">
      {/* Period selector */}
      <div style={{ display:"flex", justifyContent:"flex-end", marginBottom:20, gap:8 }}>
        {["1M","3M","6M","1Y"].map(p => (
          <button key={p} onClick={() => setPeriod(p)}
            className="btn" style={{
              padding:"8px 18px", fontSize:12,
              background: period===p ? "var(--accent-dim)" : "var(--surface)",
              color: period===p ? "var(--accent)" : "var(--text-secondary)",
              boxShadow: period===p
                ? "4px 4px 10px var(--shadow-dark), -2px -2px 8px rgba(0,194,255,0.04), inset 0 0 0 1px rgba(0,194,255,0.25)"
                : "4px 4px 10px var(--shadow-dark), -3px -3px 8px var(--shadow-light)",
            }}>
            {p}
          </button>
        ))}
      </div>

      {/* KPI Row */}
      <div className="stats-grid" style={{ marginBottom:24 }}>
        <div className="stat-card success"><span className="stat-icon">₹</span><div className="stat-value">₹23.9L</div><div className="stat-label">Total Revenue (6M)</div></div>
        <div className="stat-card accent"><span className="stat-icon">⊟</span><div className="stat-value">273</div><div className="stat-label">Total Orders (6M)</div></div>
        <div className="stat-card info"><span className="stat-icon">◫</span><div className="stat-value">₹8,754</div><div className="stat-label">Avg. Order Value</div></div>
        <div className="stat-card warning"><span className="stat-icon">◈</span><div className="stat-value">96.2%</div><div className="stat-label">Fulfillment Rate</div></div>
      </div>

      <div className="content-grid-wide" style={{ marginBottom:22 }}>
        {/* Monthly Revenue Bar Chart */}
        <div className="panel">
          <div className="panel-header">
            <div className="panel-icon">⊞</div>
            <div className="panel-title">Monthly Revenue</div>
          </div>
          <div style={{ marginTop:8 }}>
            {MONTHLY.map(m => (
              <div key={m.month} className="chart-bar-row">
                <div className="chart-bar-label">{m.month}</div>
                <div className="chart-bar-track">
                  <div className="chart-bar-fill" style={{ width:`${(m.value/maxVal)*100}%` }} />
                </div>
                <div className="chart-bar-val">{fmtRs(m.value)}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Monthly Orders */}
        <div className="panel">
          <div className="panel-header">
            <div className="panel-icon">⊟</div>
            <div className="panel-title">Monthly Orders</div>
          </div>
          <div style={{ marginTop:8 }}>
            {MONTHLY.map(m => (
              <div key={m.month} className="chart-bar-row">
                <div className="chart-bar-label">{m.month}</div>
                <div className="chart-bar-track">
                  <div className="chart-bar-fill" style={{ width:`${(m.orders/61)*100}%`, background:"linear-gradient(90deg, var(--success), rgba(0,229,160,0.5))" }} />
                </div>
                <div className="chart-bar-val" style={{ color:"var(--success)" }}>{m.orders}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="content-grid-wide">
        {/* Top Products */}
        <div className="panel">
          <div className="panel-header">
            <div className="panel-icon">◫</div>
            <div className="panel-title">Top Products</div>
          </div>
          <table style={{ width:"100%" }}>
            <thead>
              <tr>
                <th style={{ padding:"8px 0", fontSize:9 }}>#</th>
                <th style={{ padding:"8px 0", fontSize:9 }}>PRODUCT</th>
                <th style={{ padding:"8px 0", fontSize:9 }}>QTY SOLD</th>
                <th style={{ padding:"8px 0", fontSize:9 }}>REVENUE</th>
              </tr>
            </thead>
            <tbody>
              {TOP_PRODUCTS.map((p, i) => (
                <tr key={i}>
                  <td style={{ padding:"10px 0 10px", borderTop:"1px solid var(--border)" }}>
                    <span className="mono" style={{ color:"var(--text-muted)", fontSize:11 }}>0{i+1}</span>
                  </td>
                  <td style={{ padding:"10px 8px", borderTop:"1px solid var(--border)", fontSize:14, fontWeight:600 }}>{p.name}</td>
                  <td style={{ padding:"10px 0", borderTop:"1px solid var(--border)" }}>
                    <span className="qty-value" style={{ fontSize:13 }}>{p.qty}</span>
                  </td>
                  <td style={{ padding:"10px 0", borderTop:"1px solid var(--border)" }}>
                    <span className="price-value" style={{ fontSize:13 }}>{fmtRs(p.revenue)}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div>
          {/* Category Distribution */}
          <div className="panel" style={{ marginBottom:22 }}>
            <div className="panel-header">
              <div className="panel-icon">◎</div>
              <div className="panel-title">Category Split</div>
            </div>
            {CATEGORY_DATA.map(c => (
              <div key={c.name} className="chart-bar-row">
                <div className="chart-bar-label" style={{ width:130 }}>{c.name}</div>
                <div className="chart-bar-track">
                  <div className="chart-bar-fill" style={{ width:`${c.value}%`, background: `linear-gradient(90deg, ${c.color}, ${c.color}88)` }} />
                </div>
                <div className="chart-bar-val" style={{ color: c.color }}>{c.value}%</div>
              </div>
            ))}
          </div>

          {/* Top Suppliers */}
          <div className="panel">
            <div className="panel-header">
              <div className="panel-icon">◈</div>
              <div className="panel-title">Top Suppliers</div>
            </div>
            {TOP_SUPPLIERS.map((s, i) => (
              <div key={i} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"10px 0", borderBottom: i < TOP_SUPPLIERS.length-1 ? "1px solid var(--border)" : "none" }}>
                <div style={{ display:"flex", alignItems:"center", gap:10 }}>
                  <span className="mono" style={{ color:"var(--text-muted)", fontSize:10, width:20 }}>0{i+1}</span>
                  <span style={{ fontSize:14, fontWeight:600 }}>{s.name}</span>
                </div>
                <div style={{ display:"flex", gap:16, alignItems:"center" }}>
                  <span className="mono" style={{ fontSize:11, color:"var(--accent)" }}>{s.orders} orders</span>
                  <span className="price-value" style={{ fontSize:12 }}>{fmtRs(s.value)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
