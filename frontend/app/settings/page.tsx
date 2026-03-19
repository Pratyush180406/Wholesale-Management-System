"use client";
import { useState } from "react";
import AppLayout from "../../components/AppLayout";
import { ToastContainer, useToast } from "../../components/Toast";
import { getAuth, setAuth } from "../../lib/auth";

export default function SettingsPage() {
  const auth = getAuth();
  const [profile, setProfile] = useState({
    username: auth?.username || "admin",
    displayName: "Admin User",
    email: "admin@warehouse.in",
    phone: "+91 98200 00000",
    role: auth?.role || "Administrator",
  });

  const [toggles, setToggles] = useState({
    emailAlerts: true,
    lowStockAlert: true,
    orderUpdates: true,
    weeklyReport: false,
    smsAlerts: false,
    autoLogout: true,
    twoFactor: false,
    auditLog: true,
  });

  const [warehouseSettings, setWarehouseSettings] = useState({
    warehouseName: "WMS Central Warehouse",
    address: "Plot 42, MIDC Industrial Area, Pune 411018",
    timezone: "Asia/Kolkata",
    currency: "INR",
    lowStockThreshold: "10",
    sessionTimeout: "480",
  });

  const [pwForm, setPwForm] = useState({ current:"", newPw:"", confirm:"" });
  const { toasts, addToast } = useToast();

  const saveProfile = () => {
    if (auth) {
      setAuth({ ...auth, username: profile.username });
    }
    addToast("Profile saved");
  };

  const saveWarehouse = () => addToast("Warehouse settings saved");

  const changePassword = () => {
    if (!pwForm.current) return addToast("Enter current password", "warning");
    if (pwForm.newPw.length < 6) return addToast("New password must be 6+ characters", "warning");
    if (pwForm.newPw !== pwForm.confirm) return addToast("Passwords do not match", "error");
    setPwForm({ current:"", newPw:"", confirm:"" });
    addToast("Password changed successfully");
  };

  const toggle = (key: keyof typeof toggles) => setToggles(t => ({ ...t, [key]: !t[key] }));

  const Toggle = ({ name, label, desc }: { name: keyof typeof toggles; label: string; desc: string }) => (
    <div className="toggle-row">
      <div>
        <div className="toggle-label">{label}</div>
        <div className="toggle-desc">{desc}</div>
      </div>
      <label className="toggle">
        <input type="checkbox" checked={toggles[name]} onChange={() => toggle(name)} />
        <span className="toggle-slider" />
      </label>
    </div>
  );

  return (
    <AppLayout title="Settings" subtitle="System Configuration">
      <div className="content-grid-wide">
        {/* Left column */}
        <div>
          {/* Profile */}
          <div className="panel" style={{ marginBottom:22 }}>
            <div className="panel-header">
              <div className="panel-icon">◈</div>
              <div className="panel-title">Profile</div>
            </div>

            <div style={{ display:"flex", alignItems:"center", gap:16, marginBottom:22 }}>
              <div style={{
                width:60, height:60, borderRadius:16,
                background:"var(--accent-dim)",
                display:"flex", alignItems:"center", justifyContent:"center",
                fontSize:26, fontWeight:700, color:"var(--accent)",
                boxShadow:"0 0 20px var(--accent-glow)",
                flexShrink:0,
              }}>
                {profile.username[0].toUpperCase()}
              </div>
              <div>
                <div style={{ fontSize:18, fontWeight:700 }}>{profile.displayName}</div>
                <div style={{ fontFamily:"JetBrains Mono, monospace", fontSize:10, color:"var(--accent)", letterSpacing:2, textTransform:"uppercase" }}>{profile.role}</div>
              </div>
            </div>

            <div className="form-row">
              <div>
                <label className="form-label">Username</label>
                <input className="form-input" value={profile.username} onChange={e=>setProfile({...profile,username:e.target.value})} />
              </div>
              <div>
                <label className="form-label">Display Name</label>
                <input className="form-input" value={profile.displayName} onChange={e=>setProfile({...profile,displayName:e.target.value})} />
              </div>
            </div>
            <div className="form-row">
              <div>
                <label className="form-label">Email</label>
                <input className="form-input" type="email" value={profile.email} onChange={e=>setProfile({...profile,email:e.target.value})} />
              </div>
              <div>
                <label className="form-label">Phone</label>
                <input className="form-input" value={profile.phone} onChange={e=>setProfile({...profile,phone:e.target.value})} />
              </div>
            </div>
            <button className="btn btn-primary" onClick={saveProfile}>Save Profile</button>
          </div>

          {/* Change Password */}
          <div className="panel">
            <div className="panel-header">
              <div className="panel-icon">◎</div>
              <div className="panel-title">Change Password</div>
            </div>
            <div className="form-group">
              <label className="form-label">Current Password</label>
              <input className="form-input" type="password" placeholder="••••••••" value={pwForm.current}
                onChange={e=>setPwForm({...pwForm,current:e.target.value})} />
            </div>
            <div className="form-row">
              <div>
                <label className="form-label">New Password</label>
                <input className="form-input" type="password" placeholder="Min 6 chars" value={pwForm.newPw}
                  onChange={e=>setPwForm({...pwForm,newPw:e.target.value})} />
              </div>
              <div>
                <label className="form-label">Confirm Password</label>
                <input className="form-input" type="password" placeholder="Repeat password" value={pwForm.confirm}
                  onChange={e=>setPwForm({...pwForm,confirm:e.target.value})} />
              </div>
            </div>
            <button className="btn btn-primary" onClick={changePassword}>Update Password</button>
          </div>
        </div>

        {/* Right column */}
        <div>
          {/* Warehouse Settings */}
          <div className="panel" style={{ marginBottom:22 }}>
            <div className="panel-header">
              <div className="panel-icon">⬡</div>
              <div className="panel-title">Warehouse Settings</div>
            </div>
            <div className="form-group">
              <label className="form-label">Warehouse Name</label>
              <input className="form-input" value={warehouseSettings.warehouseName}
                onChange={e=>setWarehouseSettings({...warehouseSettings,warehouseName:e.target.value})} />
            </div>
            <div className="form-group">
              <label className="form-label">Address</label>
              <textarea className="form-textarea" value={warehouseSettings.address}
                onChange={e=>setWarehouseSettings({...warehouseSettings,address:e.target.value})} />
            </div>
            <div className="form-row">
              <div>
                <label className="form-label">Timezone</label>
                <select className="form-select" value={warehouseSettings.timezone}
                  onChange={e=>setWarehouseSettings({...warehouseSettings,timezone:e.target.value})}>
                  <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                  <option value="UTC">UTC</option>
                  <option value="America/New_York">US Eastern</option>
                </select>
              </div>
              <div>
                <label className="form-label">Currency</label>
                <select className="form-select" value={warehouseSettings.currency}
                  onChange={e=>setWarehouseSettings({...warehouseSettings,currency:e.target.value})}>
                  <option>INR</option><option>USD</option><option>EUR</option>
                </select>
              </div>
            </div>
            <div className="form-row">
              <div>
                <label className="form-label">Low Stock Threshold</label>
                <input className="form-input" type="number" min="1" value={warehouseSettings.lowStockThreshold}
                  onChange={e=>setWarehouseSettings({...warehouseSettings,lowStockThreshold:e.target.value})} />
              </div>
              <div>
                <label className="form-label">Session Timeout (min)</label>
                <input className="form-input" type="number" value={warehouseSettings.sessionTimeout}
                  onChange={e=>setWarehouseSettings({...warehouseSettings,sessionTimeout:e.target.value})} />
              </div>
            </div>
            <button className="btn btn-primary" onClick={saveWarehouse}>Save Settings</button>
          </div>

          {/* Notifications */}
          <div className="panel" style={{ marginBottom:22 }}>
            <div className="panel-header">
              <div className="panel-icon">⊟</div>
              <div className="panel-title">Notifications</div>
            </div>
            <Toggle name="emailAlerts" label="Email Alerts" desc="Receive alerts via email" />
            <Toggle name="lowStockAlert" label="Low Stock Alert" desc="Alert when product falls below threshold" />
            <Toggle name="orderUpdates" label="Order Updates" desc="Notify on order status changes" />
            <Toggle name="weeklyReport" label="Weekly Report" desc="Auto-send weekly summary every Monday" />
            <Toggle name="smsAlerts" label="SMS Alerts" desc="Send critical alerts via SMS" />
          </div>

          {/* Security */}
          <div className="panel">
            <div className="panel-header">
              <div className="panel-icon">◎</div>
              <div className="panel-title">Security</div>
            </div>
            <Toggle name="autoLogout" label="Auto Logout" desc="Logout after session timeout" />
            <Toggle name="twoFactor" label="Two-Factor Auth" desc="Enable 2FA for extra security" />
            <Toggle name="auditLog" label="Audit Logging" desc="Record all admin actions" />
          </div>
        </div>
      </div>

      <ToastContainer toasts={toasts} />
    </AppLayout>
  );
}
