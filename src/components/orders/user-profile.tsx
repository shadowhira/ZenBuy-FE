import Image from "next/image"
import { Button } from "@/src/components/ui/button"
import Link from "next/link"

export default function UserProfile() {
  return (
    <div className="flex items-center space-x-4 mb-8">
      <Image src="/user-avatar.jpg" alt="User Avatar" width={64} height={64} className="rounded-full" />
      <div>
        <h2 className="text-2xl font-bold">John Doe</h2>
        <Link href="/profile/edit">
          <Button variant="outline">Edit Profile</Button>
        </Link>
      </div>
    </div>
  )
}

