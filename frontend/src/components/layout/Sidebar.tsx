import type { FC } from "react"
import { useLocation } from "wouter"
import NavList, { type NavListItem } from "../ui/NavList"
import "./Sidebar.css"

const NAV_ITEMS = [
  { label: "Home", path: "/home" },
  { label: "Experiments", path: "/experiments" },
  { label: "Reports", path: "/reports" },
]

// Which nav entry should look active for the current URL.
// Note: check "/experiments" (the list) before "/experiment" (a single detail).
function activePath(location: string): string {
  if (location.startsWith("/reports")) return "/reports"
  if (location.startsWith("/experiments") || location.startsWith("/recording")) return "/experiments"
  // Clicking a participant opens their experiment detail — keep Home active.
  if (location.startsWith("/home") || location.startsWith("/experiment")) return "/home"
  return location
}

const Sidebar: FC = () => {
  const [location, navigate] = useLocation()

  const items: NavListItem[] = NAV_ITEMS.map((item) => ({ id: item.path, label: item.label }))

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <span className="sidebar-title">Clinical Research</span>
      </div>
      <NavList items={items} activeId={activePath(location)} onSelect={(path) => navigate(path)} />
    </aside>
  )
}

export default Sidebar
