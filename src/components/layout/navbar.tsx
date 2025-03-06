"use client"

import { useEffect, useState } from "react"
import { Bell, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import Image from "next/image"
import LanguageChanger from "../utils/languague-changer"
import ThemeChanger from "../utils/theme-changer"
import { getCategories } from "@/apis"
import Link from "next/link"
import { ShoppingCart, Search } from "lucide-react"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import logo from "@images/zenBuy.webp"
import { redirect } from "next/navigation"
import { useTranslation } from "react-i18next"
import styles from "@/styles/navbar.module.scss"
import { cn } from "@/lib/utils"

type Category = {
  id: number
  name: string
  image: string
}

export default function Navbar() {
  const { t } = useTranslation("navbar-general")
  const [openCategory, setOpenCategory] = useState<string | null>(null)
  const [categories, setCategories] = useState<Category[]>([])
  const [isCartOpen, setIsCartOpen] = useState(false)
  
  useEffect(() => {
    const fetchCategories = async () => {
      const categories = await getCategories()
      setCategories(categories)
    }

    fetchCategories()
  }, [])

  const onGoHome = () => {
    redirect('/')
  }

  const onGoSeller = () => {
    redirect('/seller/inventory')
  }

  return (
    <nav className={styles.navbar}>
      <div className={styles.container}>
        <div onClick={() => onGoSeller()} className={styles.sellerChannel}>
          <span>{t('sellerChannel')}</span>
        </div>
        <div className={styles.mainNav}>
          <div className={cn('hover:scale-110 transition"',styles.logo)} onClick={() => onGoHome()}>
            <Image src={logo} alt="Zen Buy Logo" width={60} height={60} />
          </div>
          <div 
            className={styles.productsDropdown}
            onMouseEnter={() => setOpenCategory('products')} 
            onMouseLeave={() => setOpenCategory(null)}
          >
            <button className={styles.dropdownButton}>
              <span>{t('products')}</span>
              <ChevronDown className="h-4 w-4" />
            </button>
            <div className={`${styles.dropdownContent} ${openCategory === 'products' ? styles.open : ''}`}>
              {categories.map((category) => (
                <div key={category.id} className={styles.categoryItem}>
                  <Image src={category.image} alt={category.name} width={8} height={8} />
                  <span>{category.name}</span>
                </div>
              ))}
            </div>
          </div>
          <div className={styles.searchBar}>
            <div className={styles.searchInput}>
              <Input type="search" placeholder={t('searchProducts')} />
              <Search className={styles.searchIcon} />
            </div>
          </div>
          <div className={styles.cartDropdown}>
            <DropdownMenu open={isCartOpen} onOpenChange={setIsCartOpen}>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  onMouseEnter={() => setIsCartOpen(true)}
                  onMouseLeave={() => setIsCartOpen(false)}
                  className={styles.cartButton}
                >
                  <ShoppingCart className="h-5 w-5 mr-2" />
                  {t('cart')}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className={`${styles.cartContent} ${isCartOpen ? styles.open : ''}`}
                onMouseEnter={() => setIsCartOpen(true)}
                onMouseLeave={() => setIsCartOpen(false)}
              >
                {cartItems.map((item) => (
                  <DropdownMenuItem key={item.id} className={styles.cartItem}>
                    <Image
                      src={item.images[0]}
                      alt={item.title}
                      width={40}
                      height={40}
                    />
                    <div className={styles.itemDetails}>
                      <p>{item.title}</p>
                      <p className={styles.price}>1 x ${item.price}</p>
                    </div>
                  </DropdownMenuItem>
                ))}
                <DropdownMenuItem>
                  <Link href="/cart" className={styles.viewCartButton}>
                    <Button className="w-full">{t('viewCart')}</Button>
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <Button variant="ghost" size="icon" className={styles.notificationButton}>
            <Bell className="h-5 w-5" />
          </Button>
          <ThemeChanger />
          <LanguageChanger />
        </div>
      </div>
    </nav>
  )
}

// Mock data for cart items
const cartItems = [
  {
    "id": 1,
    "title": "Majestic Mountain Graphic T-Shirt",
    "slug": "majestic-mountain-graphic-t-shirt",
    "price": 44,
    "description": "Elevate your wardrobe with this stylish black t-shirt featuring a striking monochrome mountain range graphic. Perfect for those who love the outdoors or want to add a touch of nature-inspired design to their look, this tee is crafted from soft, breathable fabric ensuring all-day comfort. Ideal for casual outings or as a unique gift, this t-shirt is a versatile addition to any collection.",
    "category": {
      "id": 1,
      "name": "Clothes",
      "slug": "clothes",
      "image": "https://i.imgur.com/QkIa5tT.jpeg",
      "creationAt": "2025-02-23T07:52:28.000Z",
      "updatedAt": "2025-02-23T07:52:28.000Z"
    },
    "images": [
      "https://i.imgur.com/QkIa5tT.jpeg",
      "https://i.imgur.com/jb5Yu0h.jpeg",
      "https://i.imgur.com/UlxxXyG.jpeg"
    ],
    "creationAt": "2025-02-23T07:52:28.000Z",
    "updatedAt": "2025-02-23T07:52:28.000Z"
  },
  {
    "id": 4,
    "title": "Classic Grey Hooded Sweatshirt",
    "slug": "classic-grey-hooded-sweatshirt",
    "price": 90,
    "description": "Elevate your casual wear with our Classic Grey Hooded Sweatshirt. Made from a soft cotton blend, this hoodie features a front kangaroo pocket, an adjustable drawstring hood, and ribbed cuffs for a snug fit. Perfect for those chilly evenings or lazy weekends, it pairs effortlessly with your favorite jeans or joggers.",
    "category": {
      "id": 1,
      "name": "Clothes",
      "slug": "clothes",
      "image": "https://i.imgur.com/QkIa5tT.jpeg",
      "creationAt": "2025-02-23T07:52:28.000Z",
      "updatedAt": "2025-02-23T07:52:28.000Z"
    },
    "images": [
      "https://i.imgur.com/R2PN9Wq.jpeg",
      "https://i.imgur.com/IvxMPFr.jpeg",
      "https://i.imgur.com/7eW9nXP.jpeg"
    ],
    "creationAt": "2025-02-23T07:52:28.000Z",
    "updatedAt": "2025-02-23T07:52:28.000Z"
  },
  {
    "id": 5,
    "title": "Classic Black Hooded Sweatshirt",
    "slug": "classic-black-hooded-sweatshirt",
    "price": 79,
    "description": "Elevate your casual wardrobe with our Classic Black Hooded Sweatshirt. Made from high-quality, soft fabric that ensures comfort and durability, this hoodie features a spacious kangaroo pocket and an adjustable drawstring hood. Its versatile design makes it perfect for a relaxed day at home or a casual outing.",
    "category": {
      "id": 1,
      "name": "Clothes",
      "slug": "clothes",
      "image": "https://i.imgur.com/QkIa5tT.jpeg",
      "creationAt": "2025-02-23T07:52:28.000Z",
      "updatedAt": "2025-02-23T07:52:28.000Z"
    },
    "images": [
      "https://i.imgur.com/cSytoSD.jpeg",
      "https://i.imgur.com/WwKucXb.jpeg",
      "https://i.imgur.com/cE2Dxh9.jpeg"
    ],
    "creationAt": "2025-02-23T07:52:28.000Z",
    "updatedAt": "2025-02-23T07:52:28.000Z"
  },
]