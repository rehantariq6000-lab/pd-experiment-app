import type { FC } from "react"
import "./NavList.css"

export interface NavListItem {
  id: string
  label: string
  sublabel?: string
}

interface NavListProps {
  items: NavListItem[]
  activeId?: string
  onSelect: (id: string) => void
}

// Vertical list of selectable items (used for exercises in a detail view).
const NavList: FC<NavListProps> = ({ items, activeId, onSelect }) => {
  return (
    <nav className="nav-list">
      {items.map((item) => (
        <button
          key={item.id}
          className={`nav-list-item ${activeId === item.id ? "nav-list-item--active" : ""}`}
          onClick={() => onSelect(item.id)}
        >
          <span className="nav-list-label">{item.label}</span>
          {item.sublabel && <span className="nav-list-sublabel">{item.sublabel}</span>}
        </button>
      ))}
    </nav>
  )
}

export default NavList
