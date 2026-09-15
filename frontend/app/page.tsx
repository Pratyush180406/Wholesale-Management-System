"use client";
import { useEffect, useState, useCallback } from "react";
import AppLayout from "../components/AppLayout";
import { ToastContainer, useToast } from "../components/Toast";

const API = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000";

interface Stats { total: number; outOfStock: number; lowStock: number; totalValue: number; }
interface Product { _id: string; name: string; quantity: number; price: number; status: string; category: string; }

const ACTIVITY = [
  { text: "New shipment received — 240 units Steel Bracket", time: "2 min ago", color: "var(--success)" },
  { text: "Low stock alert — Safety Helmet below threshold", time: "18 min ago", color: "var(--warning)" },
  { text: "Order #WMS-0042 dispatched to Site B", time: "1 hr ago", color: "var(--accent)" },
  { text: "Supplier Tata Steel updated contact info", time: "3 hr ago", color: "var(--info)" },
  { text: "Product 'PVC Pipe 4in' marked Out of Stock", time: "5 hr ago", color: "var(--danger)" },
  { text: "Monthly report exported by admin", time: "Yesterday", color: "var(--text-muted)" },
];

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats>({ total: 0, outOfStock: 0, lowStock: 0, totalValue: 0 });
  const [recentProducts, setRecentProducts] = useState<Product[]>([]);
  const { toasts } = useToast();

  const fetchData = useCallback(async () => {
    try {
      const [sr, pr] = await Promise.all([fetch(`${API}/stats`), fetch(`${API}/products`)]);
      setStats(await sr.json());
      setRecentProducts((await pr.json()).slice(0, 5));
    } catch {}
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const statusClass = (s: string) => s === "In Stock" ? "in-stock" : s === "Low Stock" ? "low-stock" : "out-of-stock";
  const fmtVal = (v: number) => v >= 100000 ? `₹${(v/100000).toFixed(1)}L` : v >= 1000 ? `₹${(v/1000).toFixed(1)}K` : `₹${v}`;

  return (
    <AppLayout title="Dashboard" subtitle="Overview & Activity">
      <div className="stats-grid">
        <div className="stat-card accent">
          <span className="stat-icon">◫</span>
          <div className="stat-value">{stats.total}</div>
          <div className="stat-label">Total Products</div>
        </div>
        <div className="stat-card success">
          <span className="stat-icon">₹</span>
          <div className="stat-value">{fmtVal(stats.totalValue)}</div>
          <div className="stat-label">Inventory Value</div>
        </div>
        <div className="stat-card warning">
          <span className="stat-icon">⚠</span>
          <div className="stat-value">{stats.lowStock}</div>
          <div className="stat-label">Low Stock</div>
        </div>
        <div className="stat-card danger">
          <span className="stat-icon">✕</span>
          <div className="stat-value">{stats.outOfStock}</div>
          <div className="stat-label">Out of Stock</div>
        </div>
      </div>

      <div className="content-grid-wide">
        <div className="panel">
          <div className="panel-header">
            <div className="panel-icon">◫</div>
            <div className="panel-title">Recent Inventory</div>
          </div>
          {recentProducts.length === 0 ? (
            <div className="empty-state"><div className="empty-icon">◫</div><div className="empty-text">No products yet</div></div>
          ) : (
            recentProducts.map((p) => (
              <div key={p._id} style={{ display:"flex", alignItems:"center", justifyContent:"space-between", padding:"10px 0", borderBottom:"1px solid var(--border)" }}>
                <div>
                  <div className="product-name" style={{ fontSize: 14 }}>{p.name}</div>
                  <div className="product-sku">{p.category}</div>
                </div>
                <div style={{ display:"flex", alignItems:"center", gap: 12 }}>
                  <span className="price-value">₹{p.price}</span>
                  <span className={`status-badge ${statusClass(p.status)}`}>{p.status}</span>
                </div>
              </div>
            ))
          )}
        </div>

        <div className="panel">
          <div className="panel-header">
            <div className="panel-icon">⊟</div>
            <div className="panel-title">Activity Feed</div>
          </div>
          {ACTIVITY.map((item, i) => (
            <div className="activity-item" key={i}>
              <div className="activity-dot" style={{ background: item.color, boxShadow: `0 0 6px ${item.color}` }} />
              <div>
                <div className="activity-text">{item.text}</div>
                <div className="activity-time">{item.time}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <ToastContainer toasts={toasts} />
    </AppLayout>
  );
}
