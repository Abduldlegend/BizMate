
import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { LayoutList, ListOrdered, User, LogOut, Menu, X } from "lucide-react";

const NavLink = ({ to, icon: Icon, label }) => {
  const { pathname } = useLocation();
  const active = pathname === to;
  return (
    <Link
      to={to}
      className={`flex items-center gap-3 rounded-xl px-3 py-2 font-medium hover:bg-gray-100 ${
        active ? "bg-gray-100" : ""
      }`}
    >
      <Icon size={18} /> {label}
    </Link>
  );
};

export default function Sidebar() {
  const [open, setOpen] = useState(false);

  // Close sidebar automatically on window resize to desktop
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setOpen(false);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      {/* Mobile header with logo + toggle */}
      <div className="md:hidden flex items-center justify-between p-4 border-b bg-white">
        <div className="text-xl font-extrabold">
          <span className="text-googleBlue">Biz</span>
          <span className="text-googleGreen">Mate</span>
        </div>
        <button
          onClick={() => setOpen(!open)}
          aria-label={open ? "Close menu" : "Open menu"}
          className="p-2 rounded-md hover:bg-gray-100"
        >
          {open ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Overlay (mobile only) */}
      <div
        className={`fixed inset-0 bg-black/40 z-30 transition-opacity md:hidden ${
          open ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setOpen(false)}
      />

      {/* Sidebar */}
      <aside
        className={`fixed md:static inset-y-0 left-0 w-64 p-4 border-r bg-white z-40 transform transition-transform duration-300 ease-in-out
          ${open ? "translate-x-0" : "-translate-x-full md:translate-x-0"}`}
      >
        {/* Desktop logo */}
        <div className="hidden md:block text-2xl font-extrabold mb-6">
          <span className="text-googleBlue">Biz</span>
          <span className="text-googleGreen">Mate</span>
        </div>

        <nav className="flex flex-col gap-2">
          <NavLink to="/dashboard" icon={LayoutList} label="Dashboard" />
          <NavLink to="/quotation" icon={ListOrdered} label="Create Quotation" />
          <NavLink to="/stocklist" icon={ListOrdered} label="Create Stock List" />
          <NavLink to="/profile" icon={User} label="Profile" />
          <a
            href="/"
            onClick={() => {
              localStorage.removeItem("token");
            }}
            className="flex items-center gap-3 rounded-xl px-3 py-2 font-medium hover:bg-gray-100"
          >
            <LogOut size={18} /> Logout
          </a>
        </nav>
      </aside>
    </>
  );
}
