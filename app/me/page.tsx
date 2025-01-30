"use client"

import { useEffect, useState } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import { AlertCircle, UserIcon } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"

interface UserData {
  id: number
  name: string
  email: string
  role: string
}

export default function MePage() {
  const { data: session, status } = useSession()
  const [userData, setUserData] = useState<UserData | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [newRole, setNewRole] = useState<string>("")
  const [isUpdating, setIsUpdating] = useState(false)
  const router = useRouter()

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/signin")
    } else if (status === "authenticated") {
      fetchUserData()
    }
  }, [status, router])

  const fetchUserData = async () => {
    try {
      const response = await fetch("/api/auth/me")
      if (!response.ok) {
        throw new Error("Failed to fetch user data")
      }
      const data = await response.json()
      setUserData(data)
      setNewRole(data.role)
    } catch (err) {
      setError("An error occurred while fetching your data. Please try again later.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleRoleChange = async () => {
    if (!newRole || newRole === userData?.role) return

    setIsUpdating(true)
    setError(null)

    try {
      const response = await fetch("/api/auth/updateRole", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ newRole }),
      })

      if (!response.ok) {
        throw new Error("Failed to update role")
      }

      const data = await response.json()
      setUserData(data.user)
      setNewRole(data.user.role)
    } catch (err) {
      setError("An error occurred while updating your role. Please try again later.")
    } finally {
      setIsUpdating(false)
    }
  }

  if (status === "loading" || isLoading) {
    return <LoadingSkeleton />
  }

  if (error) {
    return <ErrorMessage message={error} />
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <div className="flex items-center space-x-4">
            <div className="bg-primary rounded-full p-2">
              <UserIcon className="h-6 w-6 text-primary-foreground" />
            </div>
            <div>
              <CardTitle>My Profile</CardTitle>
              <CardDescription>Your personal information</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {userData && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Name</h3>
                <p className="text-lg">{userData.name}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground">Email</h3>
                <p className="text-lg">{userData.email}</p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="role">Role</Label>
                <Select value={newRole} onValueChange={setNewRole}>
                  <SelectTrigger id="role">
                    <SelectValue placeholder="Select a role" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="OWNER">Owner</SelectItem>
                    <SelectItem value="LENDER">Lender</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button className="w-full" onClick={handleRoleChange} disabled={isUpdating || newRole === userData.role}>
                {isUpdating ? "Updating..." : "Update Role"}
              </Button>
              <Button className="w-full" onClick={() => router.push("/dashboard")}>
                Go to Dashboard
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

function LoadingSkeleton() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Card className="max-w-md mx-auto">
        <CardHeader>
          <div className="flex items-center space-x-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[200px]" />
              <Skeleton className="h-4 w-[160px]" />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i}>
                <Skeleton className="h-4 w-[100px] mb-2" />
                <Skeleton className="h-6 w-full" />
              </div>
            ))}
            <Skeleton className="h-10 w-full" />
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function ErrorMessage({ message }: { message: string }) {
  return (
    <div className="container mx-auto px-4 py-8">
      <Alert variant="destructive" className="max-w-md mx-auto">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{message}</AlertDescription>
      </Alert>
    </div>
  )
}

