import Image from "next/image"
import { Button } from "@/src/components/ui/button"
import Link from "next/link"

export default function UserProfile() {
  return (
    <div className="flex items-center space-x-4 mb-8">
      <Image src="https://th.bing.com/th/id/OIP.C4slh7FWDqcGGD0cC8BpUQHaEo?w=272&h=180&c=7&r=0&o=5&dpr=2&pid=1.7" alt="User Avatar" width={64} height={64} className="rounded-full" />
      <div>
        <h2 className="text-2xl font-bold">Goku</h2>
        <Link href="/profile/edit">
          <Button variant="outline">Edit Profile</Button>
        </Link>
      </div>
    </div>
  )
}

