"use client"

import { useSession, signIn, signOut } from "next-auth/react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"

export function Navbar() {
  const { data: session } = useSession()
  const router = useRouter()

  const handleSignIn = async () => {
    await signIn()
  }

  const handleSignOut = async () => {
    const data = await signOut({ redirect: false, callbackUrl: "/" })
    router.push(data.url)
  }


  return (
    <nav className="flex items-center justify-between p-4 bg-primary text-primary-foreground">
      <div className="flex items-center space-x-4">
        <Link href="/" className="text-2xl font-bold">
          Dog Hostel
        </Link>

        {session && (
          <>
            <Link href="/me" className="hover:underline">
              Me
            </Link>
            <Link href="/pets" className="hover:underline">
              Pets
            </Link>
          </>
        )}
      </div>
      <div>
        {session ? (
          <Button onClick={handleSignOut} variant="default">
            Sign Out
          </Button>
        ) : (
          <Button onClick={handleSignIn} variant="default">
            Sign In
          </Button>
        )}
      </div>
    </nav>
  )
}
