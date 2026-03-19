"use client";
import { useState } from "react";
import AppLayout from "../../components/AppLayout";
import { ToastContainer, useToast } from "../../components/Toast";

interface Order {
  id: string; customer: string; items: string; qty: number;
  total: number; status: "Pending"|"Processing"|"Shipped"|"Delivered"|"Cancelled";
  date: string; destination: string;
}

const INITIAL_ORDERS: Order[] = [
  { id:"WMS-0048", customer:"Reliance Industries", items:"Steel Brackets, Bolts M12", qty:340, total:42500, status:"Processing", date:"2025-07-01", destination:"Mumbai" },
  { id:"WMS-0047", customer:"L&T Construction", items:"Safety Helmets, Gloves", qty:120, total:18000, status:"Shipped", date:"2025-06-29", destination:"Pune" },
  { id:"WMS-0046", customer:"BHEL Ltd", items:"PVC Pipes 4in, Couplings", qty:80, total:9600, status:"Delivered", date:"2025-06-27", destination:"Hyderabad" },
  { id:"WMS-0045", customer:"Tata Projects", items:"Electrical Cables 4mm", qty:500, total:75000, status:"Pending", date:"2025-06-26", destination:"Chennai" },
  { id:"WMS-0044", customer:"Adani Ports", items:"Welding Rods, Flux", qty:200, total:12400, status:"Delivered", date:"2025-06-24", destination:"Ahmedabad" },
  { id:"WMS-0043", customer:"DLF Ltd", items:"Plywood 18mm, Screws", qty:60, total:5400, status:"Cancelled", date:"2025-06-22", destination:"Delhi" },
  { id:"WMS-0042", customer:"Infosys Campus", items:"Floor Tiles, Adhesive", qty:1200, total:96000, status:"Delivered", date:"2025-06-20", destination:"Bengaluru" },
];

const STATUSES = ["Pending","Processing","Shipped","Delivered","Cancelled"] as const;
const EMPTY_FORM = { customer:"", items:"", qty:"", total:"", destination:"", status: "Pending" as Order["status"] };

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>(INITIAL_ORDERS);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState(EMPTY_FORM);
  const [editOrder, setEditOrder] = useState<Order | null>(null);
  const { toasts, addToast } = useToast();

  const statusClass = (s: string) => s.toLowerCase().replace(" ","-");

  const addOrder = () => {
    if (!form.customer.trim()) return addToast("Customer name required", "warning");
    const newOrder: Order = {
      id: `WMS-${String(orders.length + 49).padStart(4,"0")}`,
      customer: form.customer,
      items: form.items,
      qty: Number(form.qty)||0,
      total: Number(form.total)||0,
      status: form.status,
      date: new Date().toISOString().split("T")[0],
      destination: form.destination,
    };
    setOrders([newOrder, ...orders]);
    setForm(EMPTY_FORM);
    setShowAdd(false);
    addToast(`Order ${newOrder.id} created`);
  };

  const saveEdit = () => {
    if (!editOrder) return;
    setOrders(orders.map(o => o.id === editOrder.id ? editOrder : o));
    addToast("Order updated");
    setEditOrder(null);
  };

  const deleteOrder = (id: string) => {
    setOrders(orders.filter(o => o.id !== id));
    addToast(`Order ${id} removed`, "warning");
  };

  const filtered = orders.filter(o => {
    const ms = o.customer.toLowerCase().includes(search.toLowerCase()) ||
      o.id.toLowerCase().includes(search.toLowerCase()) ||
      o.destination.toLowerCase().includes(search.toLowerCase());
    const mf = filterStatus === "all" || o.status === filterStatus;
    return ms && mf;
  });

  const counts = { total: orders.length, pending: orders.filter(o=>o.status==="Pending").length, shipped: orders.filter(o=>o.status==="Shipped").length, delivered: orders.filter(o=>o.status==="Delivered").length };

  return (
    <AppLayout title="Orders" subtitle="Order Management">
      <div className="stats-grid" style={{ gridTemplateColumns:"repeat(4,1fr)", marginBottom:24 }}>
        <div className="stat-card accent"><div className="stat-value">{counts.total}</div><div className="stat-label">Total Orders</div></div>
        <div className="stat-card warning"><div className="stat-value">{counts.pending}</div><div className="stat-label">Pending</div></div>
        <div className="stat-card info"><div className="stat-value">{counts.shipped}</div><div className="stat-label">Shipped</div></div>
        <div className="stat-card success"><div className="stat-value">{counts.delivered}</div><div className="stat-label">Delivered</div></div>
      </div>

      <div className="table-wrapper">
        <div className="table-toolbar">
          <div className="table-toolbar-left">
            <span className="panel-title" style={{ fontSize:13 }}>{filtered.length} orders</span>
            <select className="form-select" style={{ width:150, padding:"8px 32px 8px 12px", fontSize:13 }}
              value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
              <option value="all">All Status</option>
              {STATUSES.map(s => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div className="table-toolbar-right">
            <div className="search-wrap">
              <span className="search-icon">⌕</span>
              <input className="search-input" placeholder="Search orders..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <button className="btn btn-secondary" style={{ padding:"9px 16px" }} onClick={() => setShowAdd(true)}>
              ＋ New Order
            </button>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="empty-state"><div className="empty-icon">⊟</div><div className="empty-text">No orders found</div></div>
        ) : (
          <table>
            <thead>
              <tr><th>Order ID</th><th>Customer</th><th>Items</th><th>Qty</th><th>Total</th><th>Destination</th><th>Date</th><th>Status</th><th></th></tr>
            </thead>
            <tbody>
              {filtered.map(o => (
                <tr key={o.id}>
                  <td><span className="mono" style={{ color:"var(--accent)" }}>#{o.id}</span></td>
                  <td><div className="product-name" style={{ fontSize:14 }}>{o.customer}</div></td>
                  <td><span style={{ color:"var(--text-secondary)", fontSize:13 }}>{o.items}</span></td>
                  <td><span className="qty-value">{o.qty}</span></td>
                  <td><span className="price-value">₹{o.total.toLocaleString()}</span></td>
                  <td><span style={{ color:"var(--text-secondary)", fontSize:13 }}>{o.destination}</span></td>
                  <td><span className="mono" style={{ fontSize:11, color:"var(--text-muted)" }}>{o.date}</span></td>
                  <td><span className={`status-badge ${statusClass(o.status)}`}>{o.status}</span></td>
                  <td>
                    <div className="row-actions">
                      <button className="btn btn-ghost btn-icon" onClick={() => setEditOrder({...o})}>✎</button>
                      <button className="btn btn-danger btn-icon" onClick={() => deleteOrder(o.id)}>✕</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Add Order Modal */}
      {showAdd && (
        <div className="modal-overlay" onClick={e => e.target===e.currentTarget && setShowAdd(false)}>
          <div className="modal modal-lg">
            <div className="modal-title">＋ New Order</div>
            <div className="form-row">
              <div className="form-group" style={{ marginBottom:0 }}>
                <label className="form-label">Customer *</label>
                <input className="form-input" placeholder="Company name" value={form.customer} onChange={e => setForm({...form, customer: e.target.value})} />
              </div>
              <div className="form-group" style={{ marginBottom:0 }}>
                <label className="form-label">Destination</label>
                <input className="form-input" placeholder="City" value={form.destination} onChange={e => setForm({...form, destination: e.target.value})} />
              </div>
            </div>
            <div className="form-group" style={{ marginTop:15 }}>
              <label className="form-label">Items Description</label>
              <input className="form-input" placeholder="e.g. Steel Brackets, Bolts M12" value={form.items} onChange={e => setForm({...form, items: e.target.value})} />
            </div>
            <div className="form-row">
              <div>
                <label className="form-label">Quantity</label>
                <input className="form-input" type="number" min="0" placeholder="0" value={form.qty} onChange={e => setForm({...form, qty: e.target.value})} />
              </div>
              <div>
                <label className="form-label">Total (₹)</label>
                <input className="form-input" type="number" min="0" placeholder="0" value={form.total} onChange={e => setForm({...form, total: e.target.value})} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Status</label>
              <select className="form-select" value={form.status} onChange={e => setForm({...form, status: e.target.value as Order["status"]})}>
                {STATUSES.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="modal-footer">
              <button className="btn btn-primary" style={{ flex:1 }} onClick={addOrder}>Create Order</button>
              <button className="btn btn-ghost" onClick={() => setShowAdd(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editOrder && (
        <div className="modal-overlay" onClick={e => e.target===e.currentTarget && setEditOrder(null)}>
          <div className="modal modal-lg">
            <div className="modal-title">✎ Edit Order #{editOrder.id}</div>
            <div className="form-row">
              <div className="form-group" style={{ marginBottom:0 }}>
                <label className="form-label">Customer</label>
                <input className="form-input" value={editOrder.customer} onChange={e => setEditOrder({...editOrder, customer: e.target.value})} />
              </div>
              <div className="form-group" style={{ marginBottom:0 }}>
                <label className="form-label">Destination</label>
                <input className="form-input" value={editOrder.destination} onChange={e => setEditOrder({...editOrder, destination: e.target.value})} />
              </div>
            </div>
            <div className="form-group" style={{ marginTop:15 }}>
              <label className="form-label">Items</label>
              <input className="form-input" value={editOrder.items} onChange={e => setEditOrder({...editOrder, items: e.target.value})} />
            </div>
            <div className="form-row">
              <div>
                <label className="form-label">Quantity</label>
                <input className="form-input" type="number" value={editOrder.qty} onChange={e => setEditOrder({...editOrder, qty: Number(e.target.value)})} />
              </div>
              <div>
                <label className="form-label">Total (₹)</label>
                <input className="form-input" type="number" value={editOrder.total} onChange={e => setEditOrder({...editOrder, total: Number(e.target.value)})} />
              </div>
            </div>
            <div className="form-group">
              <label className="form-label">Status</label>
              <select className="form-select" value={editOrder.status} onChange={e => setEditOrder({...editOrder, status: e.target.value as Order["status"]})}>
                {STATUSES.map(s => <option key={s}>{s}</option>)}
              </select>
            </div>
            <div className="modal-footer">
              <button className="btn btn-primary" style={{ flex:1 }} onClick={saveEdit}>Save Changes</button>
              <button className="btn btn-ghost" onClick={() => setEditOrder(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer toasts={toasts} />
    </AppLayout>
  );
}
