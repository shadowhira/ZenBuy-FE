import Image from "next/image"
import { Button } from "@components/ui/button"
import Link from "next/link"

export default function UserProfile() {
  return (
    <div className="flex items-center space-x-4 mb-8">
      <Image src="https://www.wallpaperflare.com/static/409/952/920/dragon-ball-z-son-goku-portrait-display-son-wallpaper.jpg" alt="User Avatar" width={64} height={64} className="rounded-full min-h-[64px] hover:scale-[140%] transition-transform" />
      <div>
        <h2 className="text-2xl font-bold">Goku</h2>
        <Link href="/profile/edit">
          <Button variant="outline">Edit Profile</Button>
        </Link>
      </div>
    </div>
  )
}

