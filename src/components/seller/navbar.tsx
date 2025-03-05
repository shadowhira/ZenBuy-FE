import { Bell, Settings, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import styles from "@/styles/seller.module.scss"

export default function Navbar({ toggleSidebar }: { toggleSidebar: () => void }) {
  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarLeft}>
        <Button variant="ghost" size="icon" onClick={toggleSidebar}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
          </svg>
        </Button>
        <h1 className={styles.navbarTitle}>Seller Channel</h1>
      </div>
      <div className={styles.navbarRight}>
        <Button variant="ghost" size="icon">
          <Bell size={20} />
        </Button>
        <Button variant="ghost" size="icon">
          <Settings size={20} />
        </Button>
        <Button variant="ghost" size="icon">
          <User size={20} />
        </Button>
      </div>
    </nav>
  )
}

