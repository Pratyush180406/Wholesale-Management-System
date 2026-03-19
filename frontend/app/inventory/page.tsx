"use client";
import { useEffect, useState, useCallback } from "react";
import AppLayout from "../../components/AppLayout";
import { ToastContainer, useToast } from "../../components/Toast";

const API = "http://localhost:5000";
const CATEGORIES = ["General","Electronics","Apparel","Food","Tools","Raw Materials","Packaging"];

interface Product {
  _id: string; name: string; sku: string; category: string;
  quantity: number; price: number; status: string;
}

const EMPTY_FORM = { name:"", sku:"", category:"General", quantity:"", price:"" };

export default function InventoryPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [form, setForm] = useState(EMPTY_FORM);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const { toasts, addToast } = useToast();

  const fetchProducts = useCallback(async () => {
    try {
      const res = await fetch(`${API}/products`);
      setProducts(await res.json());
    } catch { addToast("Failed to load products", "error"); }
  }, [addToast]);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);

  const addProduct = async () => {
    if (!form.name.trim()) return addToast("Product name is required", "warning");
    try {
      await fetch(`${API}/products`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name.trim(),
          sku: form.sku.trim() || `SKU-${Date.now().toString(36).toUpperCase()}`,
          category: form.category,
          quantity: Number(form.quantity) || 0,
          price: Number(form.price) || 0,
        }),
      });
      setForm(EMPTY_FORM);
      addToast(`"${form.name}" added`);
      fetchProducts();
    } catch { addToast("Failed to add product", "error"); }
  };

  const saveEdit = async () => {
    if (!editProduct) return;
    try {
      await fetch(`${API}/products/${editProduct._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editProduct),
      });
      addToast("Product updated");
      setEditProduct(null);
      fetchProducts();
    } catch { addToast("Failed to update", "error"); }
  };

  const deleteProduct = async (id: string, name: string) => {
    try {
      await fetch(`${API}/products/${id}`, { method: "DELETE" });
      addToast(`"${name}" removed`, "warning");
      fetchProducts();
    } catch { addToast("Failed to delete", "error"); }
  };

  const filtered = products.filter((p) => {
    const matchSearch =
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku?.toLowerCase().includes(search.toLowerCase()) ||
      p.category?.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === "all" || p.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const statusClass = (s: string) => s === "In Stock" ? "in-stock" : s === "Low Stock" ? "low-stock" : "out-of-stock";
  const total = products.length;
  const inStock = products.filter(p => p.status === "In Stock").length;
  const lowStock = products.filter(p => p.status === "Low Stock").length;
  const outOfStock = products.filter(p => p.status === "Out of Stock").length;

  return (
    <AppLayout title="Inventory" subtitle="Product Management">
      {/* Mini stats */}
      <div className="stats-grid" style={{ gridTemplateColumns: "repeat(4,1fr)", marginBottom: 24 }}>
        {[
          { label: "Total", value: total, cls: "accent" },
          { label: "In Stock", value: inStock, cls: "success" },
          { label: "Low Stock", value: lowStock, cls: "warning" },
          { label: "Out of Stock", value: outOfStock, cls: "danger" },
        ].map(s => (
          <div key={s.label} className={`stat-card ${s.cls}`}>
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="content-grid">
        {/* Add Form */}
        <div className="panel">
          <div className="panel-header">
            <div className="panel-icon">＋</div>
            <div className="panel-title">New Product</div>
          </div>
          <div className="form-group">
            <label className="form-label">Product Name *</label>
            <input className="form-input" placeholder="e.g. Steel Bracket 40mm" value={form.name}
              onChange={e => setForm({...form, name: e.target.value})}
              onKeyDown={e => e.key === "Enter" && addProduct()} />
          </div>
          <div className="form-group">
            <label className="form-label">SKU</label>
            <input className="form-input" placeholder="Auto-generated if empty" value={form.sku}
              onChange={e => setForm({...form, sku: e.target.value})} />
          </div>
          <div className="form-group">
            <label className="form-label">Category</label>
            <select className="form-select" value={form.category} onChange={e => setForm({...form, category: e.target.value})}>
              {CATEGORIES.map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
          <div className="form-row">
            <div>
              <label className="form-label">Quantity</label>
              <input className="form-input" type="number" min="0" placeholder="0" value={form.quantity}
                onChange={e => setForm({...form, quantity: e.target.value})} />
            </div>
            <div>
              <label className="form-label">Price (₹)</label>
              <input className="form-input" type="number" min="0" step="0.01" placeholder="0.00" value={form.price}
                onChange={e => setForm({...form, price: e.target.value})} />
            </div>
          </div>
          <button className="btn btn-primary" onClick={addProduct}>＋ &nbsp;Add to Inventory</button>
        </div>

        {/* Table */}
        <div className="table-wrapper">
          <div className="table-toolbar">
            <div className="table-toolbar-left">
              <span className="panel-title" style={{ fontSize:13 }}>{filtered.length} items</span>
              <select className="form-select" style={{ width:140, padding:"8px 32px 8px 12px", fontSize:13 }}
                value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                <option value="all">All Status</option>
                <option>In Stock</option>
                <option>Low Stock</option>
                <option>Out of Stock</option>
              </select>
            </div>
            <div className="search-wrap">
              <span className="search-icon">⌕</span>
              <input className="search-input" placeholder="Search..." value={search} onChange={e => setSearch(e.target.value)} />
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="empty-state">
              <div className="empty-icon">◫</div>
              <div className="empty-text">{search ? "No results found" : "No products yet"}</div>
            </div>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Product</th><th>Category</th><th>Qty</th><th>Price</th><th>Value</th><th>Status</th><th></th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(p => (
                  <tr key={p._id}>
                    <td><div className="product-name">{p.name}</div><div className="product-sku">{p.sku||"—"}</div></td>
                    <td><span className="chip">{p.category||"General"}</span></td>
                    <td><span className="qty-value">{p.quantity}</span></td>
                    <td><span className="price-value">₹{p.price.toFixed(2)}</span></td>
                    <td><span className="mono" style={{ color:"var(--text-secondary)" }}>₹{(p.price*p.quantity).toFixed(2)}</span></td>
                    <td><span className={`status-badge ${statusClass(p.status)}`}>{p.status}</span></td>
                    <td>
                      <div className="row-actions">
                        <button className="btn btn-ghost btn-icon" onClick={() => setEditProduct({...p})}>✎</button>
                        <button className="btn btn-danger btn-icon" onClick={() => deleteProduct(p._id, p.name)}>✕</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Edit Modal */}
      {editProduct && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setEditProduct(null)}>
          <div className="modal">
            <div className="modal-title">✎ &nbsp;Edit Product</div>
            <div className="form-group">
              <label className="form-label">Product Name</label>
              <input className="form-input" value={editProduct.name} onChange={e => setEditProduct({...editProduct, name: e.target.value})} />
            </div>
            <div className="form-group">
              <label className="form-label">SKU</label>
              <input className="form-input" value={editProduct.sku} onChange={e => setEditProduct({...editProduct, sku: e.target.value})} />
            </div>
            <div className="form-group">
              <label className="form-label">Category</label>
              <select className="form-select" value={editProduct.category} onChange={e => setEditProduct({...editProduct, category: e.target.value})}>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-row">
              <div>
                <label className="form-label">Quantity</label>
                <input className="form-input" type="number" min="0" value={editProduct.quantity}
                  onChange={e => setEditProduct({...editProduct, quantity: Number(e.target.value)})} />
              </div>
              <div>
                <label className="form-label">Price (₹)</label>
                <input className="form-input" type="number" min="0" step="0.01" value={editProduct.price}
                  onChange={e => setEditProduct({...editProduct, price: Number(e.target.value)})} />
              </div>
            </div>
            <div className="modal-footer">
              <button className="btn btn-primary" style={{ flex:1 }} onClick={saveEdit}>Save Changes</button>
              <button className="btn btn-ghost" onClick={() => setEditProduct(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}

      <ToastContainer toasts={toasts} />
    </AppLayout>
  );
}
