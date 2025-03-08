import { Bell, Settings, User } from "lucide-react"
import { Button } from "@components/ui/button"
import styles from "@styles/seller.module.scss"
import { SidebarTrigger } from "@components/ui/sidebar"

export default function SellerNavbar() {
  return (
    <nav className={styles.navbar}>
      <div className={styles.navbarLeft}>
        <SidebarTrigger />
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

