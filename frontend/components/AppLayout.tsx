"use client";
import { useEffect, useState, ReactNode } from "react";
import { useRouter, usePathname } from "next/navigation";
import { getAuth, clearAuth, isAuthenticated } from "../lib/auth";

interface AppLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

const NAV_ITEMS = [
  { id: "dashboard", href: "/", icon: "⬡", label: "Dashboard" },
  { id: "inventory", href: "/inventory", icon: "◫", label: "Inventory" },
  { id: "orders", href: "/orders", icon: "⊟", label: "Orders" },
  { id: "suppliers", href: "/suppliers", icon: "◈", label: "Suppliers" },
  { id: "reports", href: "/reports", icon: "⊞", label: "Reports" },
  { id: "settings", href: "/settings", icon: "◎", label: "Settings" },
];

export default function AppLayout({ children, title, subtitle }: AppLayoutProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<{ username: string; role: string } | null>(null);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!isAuthenticated()) {
      router.replace("/login");
      return;
    }
    const auth = getAuth();
    if (auth) setUser({ username: auth.username, role: auth.role });
  }, [router]);

  const handleLogout = () => {
    clearAuth();
    router.replace("/login");
  };

  const activeId =
    pathname === "/" ? "dashboard"
    : pathname.startsWith("/inventory") ? "inventory"
    : pathname.startsWith("/orders") ? "orders"
    : pathname.startsWith("/suppliers") ? "suppliers"
    : pathname.startsWith("/reports") ? "reports"
    : pathname.startsWith("/settings") ? "settings"
    : "";

  return (
    <div className="wms-layout">
      {/* Sidebar */}
      <aside className={`sidebar ${sidebarOpen ? "sidebar-open" : ""}`}>
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">📦</div>
          <div>
            <div className="sidebar-logo-text">WMS</div>
            <div className="sidebar-logo-sub">Warehouse OS</div>
          </div>
        </div>

        <div className="nav-section-label">Main</div>

        {NAV_ITEMS.slice(0, 4).map((item) => (
          <button
            key={item.id}
            className={`nav-item ${activeId === item.id ? "active" : ""}`}
            onClick={() => { router.push(item.href); setSidebarOpen(false); }}
          >
            <span className="nav-item-icon">{item.icon}</span>
            {item.label}
          </button>
        ))}

        <div className="nav-section-label">System</div>

        {NAV_ITEMS.slice(4).map((item) => (
          <button
            key={item.id}
            className={`nav-item ${activeId === item.id ? "active" : ""}`}
            onClick={() => { router.push(item.href); setSidebarOpen(false); }}
          >
            <span className="nav-item-icon">{item.icon}</span>
            {item.label}
          </button>
        ))}

        <div style={{ flex: 1 }} />

        {/* User Card */}
        <div className="sidebar-user">
          <div className="sidebar-user-avatar">
            {user?.username?.[0]?.toUpperCase() ?? "A"}
          </div>
          <div className="sidebar-user-info">
            <div className="sidebar-user-name">{user?.username ?? "admin"}</div>
            <div className="sidebar-user-role">{user?.role ?? "Administrator"}</div>
          </div>
          <button className="btn-logout" title="Logout" onClick={handleLogout}>⏻</button>
        </div>
      </aside>

      {/* Header */}
      <header className="header">
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <button className="btn-hamburger" onClick={() => setSidebarOpen(!sidebarOpen)}>☰</button>
          <div>
            <div className="header-title">{title}</div>
            {subtitle && <div className="header-subtitle">{subtitle}</div>}
          </div>
        </div>
        <div className="header-actions">
          <span className="badge-live">System Online</span>
        </div>
      </header>

      {/* Main */}
      <main className="main">
        {children}
      </main>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div className="sidebar-overlay" onClick={() => setSidebarOpen(false)} />
      )}
    </div>
  );
}
