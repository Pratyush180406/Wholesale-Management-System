"use client";
import { useState } from "react";
import AppLayout from "../../components/AppLayout";
import { ToastContainer, useToast } from "../../components/Toast";

interface Supplier {
  id: string; name: string; contact: string; phone: string;
  email: string; category: string; city: string;
  status: "Active"|"Inactive"; orders: number; rating: number;
}

const INITIAL_SUPPLIERS: Supplier[] = [
  { id:"SUP-001", name:"Tata Steel Ltd", contact:"Ravi Sharma", phone:"+91 98200 00001", email:"procurement@tatasteel.com", category:"Raw Materials", city:"Mumbai", status:"Active", orders:42, rating:5 },
  { id:"SUP-002", name:"Schneider Electric", contact:"Priya Mehta", phone:"+91 98200 00002", email:"orders@schneider.in", category:"Electronics", city:"Bengaluru", status:"Active", orders:28, rating:4 },
  { id:"SUP-003", name:"Supreme Industries", contact:"Arun Patel", phone:"+91 98200 00003", email:"sales@supreme.co.in", category:"Packaging", city:"Pune", status:"Active", orders:15, rating:4 },
  { id:"SUP-004", name:"Havells India", contact:"Sonal Jain", phone:"+91 98200 00004", email:"bulk@havells.com", category:"Electronics", city:"Delhi", status:"Active", orders:33, rating:5 },
  { id:"SUP-005", name:"Pidilite Industries", contact:"Kiran Nair", phone:"+91 98200 00005", email:"b2b@pidilite.com", category:"Tools", city:"Mumbai", status:"Inactive", orders:7, rating:3 },
  { id:"SUP-006", name:"Ambuja Cements", contact:"Rohit Gupta", phone:"+91 98200 00006", email:"trade@ambuja.com", category:"Raw Materials", city:"Ahmedabad", status:"Active", orders:19, rating:4 },
];

const CATS = ["All","Raw Materials","Electronics","Packaging","Tools","Apparel","Food"];
const EMPTY_FORM = { name:"", contact:"", phone:"", email:"", category:"Raw Materials", city:"", status:"Active" as Supplier["status"], rating:4 };

export default function SuppliersPage() {
  const [suppliers, setSuppliers] = useState<Supplier[]>(INITIAL_SUPPLIERS);
  const [search, setSearch] = useState("");
  const [filterCat, setFilterCat] = useState("All");
  const [showAdd, setShowAdd] = useState(false);
  const [editSupplier, setEditSupplier] = useState<Supplier | null>(null);
  const [form, setForm] = useState(EMPTY_FORM);
  const { toasts, addToast } = useToast();

  const addSupplier = () => {
    if (!form.name.trim()) return addToast("Supplier name required", "warning");
    const s: Supplier = {
      ...form,
      id: `SUP-${String(suppliers.length + 7).padStart(3,"0")}`,
      orders: 0,
    };
    setSuppliers([s, ...suppliers]);
    setForm(EMPTY_FORM);
    setShowAdd(false);
    addToast(`Supplier "${form.name}" added`);
  };

  const saveEdit = () => {
    if (!editSupplier) return;
    setSuppliers(suppliers.map(s => s.id === editSupplier.id ? editSupplier : s));
    addToast("Supplier updated");
    setEditSupplier(null);
  };

  const deleteSupplier = (id: string, name: string) => {
    setSuppliers(suppliers.filter(s => s.id !== id));
    addToast(`"${name}" removed`, "warning");
  };

  const filtered = suppliers.filter(s => {
    const ms = s.name.toLowerCase().includes(search.toLowerCase()) ||
      s.contact.toLowerCase().includes(search.toLowerCase()) ||
      s.city.toLowerCase().includes(search.toLowerCase());
    const mf = filterCat === "All" || s.category === filterCat;
    return ms && mf;
  });

  const active = suppliers.filter(s => s.status === "Active").length;

  const StarRating = ({ n }: { n: number }) => (
    <span style={{ fontSize: 12, letterSpacing: 1 }}>
      {[1,2,3,4,5].map(i => (
        <span key={i} style={{ color: i <= n ? "var(--warning)" : "var(--text-muted)" }}>★</span>
      ))}
    </span>
  );

  return (
    <AppLayout title="Suppliers" subtitle="Vendor Management">
      <div className="stats-grid" style={{ gridTemplateColumns:"repeat(3,1fr)", marginBottom:24 }}>
        <div className="stat-card accent"><div className="stat-value">{suppliers.length}</div><div className="stat-label">Total Suppliers</div></div>
        <div className="stat-card success"><div className="stat-value">{active}</div><div className="stat-label">Active</div></div>
        <div className="stat-card danger"><div className="stat-value">{suppliers.length - active}</div><div className="stat-label">Inactive</div></div>
      </div>

      <div className="table-wrapper">
        <div className="table-toolbar">
          <div className="table-toolbar-left">
            <span className="panel-title" style={{ fontSize:13 }}>{filtered.length} suppliers</span>
            <select className="form-select" style={{ width:160, padding:"8px 32px 8px 12px", fontSize:13 }}
              value={filterCat} onChange={e => setFilterCat(e.target.value)}>
              {CATS.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="table-toolbar-right">
            <div className="search-wrap">
              <span className="search-icon">⌕</span>
              <input className="search-input" placeholder="Search suppliers..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
            <button className="btn btn-secondary" style={{ padding:"9px 16px" }} onClick={() => setShowAdd(true)}>
              ＋ Add Supplier
            </button>
          </div>
        </div>

        {filtered.length === 0 ? (
          <div className="empty-state"><div className="empty-icon">◈</div><div className="empty-text">No suppliers found</div></div>
        ) : (
          <table>
            <thead>
              <tr><th>Supplier</th><th>Contact</th><th>Category</th><th>City</th><th>Orders</th><th>Rating</th><th>Status</th><th></th></tr>
            </thead>
            <tbody>
              {filtered.map(s => (
                <tr key={s.id}>
                  <td>
                    <div className="product-name" style={{ fontSize:14 }}>{s.name}</div>
                    <div className="product-sku">{s.id}</div>
                  </td>
                  <td>
                    <div style={{ fontSize:14, color:"var(--text-primary)" }}>{s.contact}</div>
                    <div style={{ fontSize:11, color:"var(--text-muted)", fontFamily:"JetBrains Mono, monospace" }}>{s.email}</div>
                  </td>
                  <td><span className="chip">{s.category}</span></td>
                  <td><span style={{ color:"var(--text-secondary)", fontSize:13 }}>{s.city}</span></td>
                  <td><span className="mono" style={{ color:"var(--accent)" }}>{s.orders}</span></td>
                  <td><StarRating n={s.rating} /></td>
                  <td><span className={`status-badge ${s.status.toLowerCase()}`}>{s.status}</span></td>
                  <td>
                    <div className="row-actions">
                      <button className="btn btn-ghost btn-icon" onClick={() => setEditSupplier({...s})}>✎</button>
                      <button className="btn btn-danger btn-icon" onClick={() => deleteSupplier(s.id, s.name)}>✕</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Add Modal */}
      {showAdd && (
        <div className="modal-overlay" onClick={e => e.target===e.currentTarget && setShowAdd(false)}>
          <div className="modal modal-lg">
            <div className="modal-title">◈ Add Supplier</div>
            <div className="form-row">
              <div><label className="form-label">Company Name *</label><input className="form-input" placeholder="Company" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} /></div>
              <div><label className="form-label">Contact Person</label><input className="form-input" placeholder="Full name" value={form.contact} onChange={e=>setForm({...form,contact:e.target.value})} /></div>
            </div>
            <div className="form-row">
              <div><label className="form-label">Phone</label><input className="form-input" placeholder="+91 XXXXX XXXXX" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} /></div>
              <div><label className="form-label">Email</label><input className="form-input" placeholder="email@company.com" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} /></div>
            </div>
            <div className="form-row">
              <div>
                <label className="form-label">Category</label>
                <select className="form-select" value={form.category} onChange={e=>setForm({...form,category:e.target.value})}>
                  {CATS.slice(1).map(c=><option key={c}>{c}</option>)}
                </select>
              </div>
              <div><label className="form-label">City</label><input className="form-input" placeholder="City" value={form.city} onChange={e=>setForm({...form,city:e.target.value})} /></div>
            </div>
            <div className="form-row">
              <div>
                <label className="form-label">Status</label>
                <select className="form-select" value={form.status} onChange={e=>setForm({...form,status:e.target.value as Supplier["status"]})}>
                  <option>Active</option><option>Inactive</option>
                </select>
              </div>
              <div>
                <label className="form-label">Rating (1–5)</label>
                <input className="form-input" type="number" min="1" max="5" value={form.rating} onChange={e=>setForm({...form,rating:Number(e.target.value)})} />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-primary" style={{ flex:1 }} onClick={addSupplier}>Add Supplier</button>
              <button className="btn btn-ghost" onClick={() => setShowAdd(false)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Modal */}
      {editSupplier && (
        <div className="modal-overlay" onClick={e => e.target===e.currentTarget && setEditSupplier(null)}>
          <div className="modal modal-lg">
            <div className="modal-title">✎ Edit Supplier</div>
            <div className="form-row">
              <div><label className="form-label">Company Name</label><input className="form-input" value={editSupplier.name} onChange={e=>setEditSupplier({...editSupplier,name:e.target.value})} /></div>
              <div><label className="form-label">Contact Person</label><input className="form-input" value={editSupplier.contact} onChange={e=>setEditSupplier({...editSupplier,contact:e.target.value})} /></div>
            </div>
            <div className="form-row">
              <div><label className="form-label">Phone</label><input className="form-input" value={editSupplier.phone} onChange={e=>setEditSupplier({...editSupplier,phone:e.target.value})} /></div>
              <div><label className="form-label">Email</label><input className="form-input" value={editSupplier.email} onChange={e=>setEditSupplier({...editSupplier,email:e.target.value})} /></div>
            </div>
            <div className="form-row">
              <div>
                <label className="form-label">Category</label>
                <select className="form-select" value={editSupplier.category} onChange={e=>setEditSupplier({...editSupplier,category:e.target.value})}>
                  {CATS.slice(1).map(c=><option key={c}>{c}</option>)}
                </select>
              </div>
              <div><label className="form-label">City</label><input className="form-input" value={editSupplier.city} onChange={e=>setEditSupplier({...editSupplier,city:e.target.value})} /></div>
            </div>
            <div className="form-row">
              <div>
                <label className="form-label">Status</label>
                <select className="form-select" value={editSupplier.status} onChange={e=>setEditSupplier({...editSupplier,status:e.target.value as Supplier["status"]})}>
                  <option>Active</option><option>Inactive</option>
                </select>
              </div>
              <div>
                <label className="form-label">Rating</label>
                <input className="form-input" type="number" min="1" max="5" value={editSupplier.rating} onChange={e=>setEditSupplier({...editSupplier,rating:Number(e.target.value)})} />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-primary" style={{ flex:1 }} onClick={saveEdit}>Save Changes</button>
              <button className="btn btn-ghost" onClick={() => setEditSupplier(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer toasts={toasts} />
    </AppLayout>
  );
}
