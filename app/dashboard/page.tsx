import { getServerSession } from "next-auth/next"
import { redirect } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PawPrint, Calendar, Users, ArrowRight } from "lucide-react"
import { authOptions } from "../lib/auth"
import { DashboardHeader } from "@/components/dashboard/header"
import { DashboardShell } from "@/components/dashboard/shell"

export default async function DashboardPage() {
  const session = await getServerSession(authOptions)

  if (!session) {
    redirect("/signin")
  }

  return (
    <DashboardShell>
      <DashboardHeader heading="Welcome to Dog Hostel" text="A place where pet owners and pet lovers come together" />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader>
            <CardTitle>Our Motivation</CardTitle>
            <CardDescription>Why we created Dog Hostel</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground">
              We understand that sometimes pet owners need to travel or have commitments that make it difficult to care
              for their pets. At the same time, there are many animal lovers who would love to spend time with a pet but
              cant commit to full-time ownership. Dog Hostel bridges this gap, creating a community of pet owners and
              pet lovers.
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>How It Works</CardTitle>
            <CardDescription>For Pet Owners</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-4 space-y-2 text-sm text-muted-foreground">
              <li>Register your pet on our platform</li>
              <li>Set your pets availability</li>
              <li>Review requests from potential pet sitters</li>
              <li>Arrange meet-and-greets</li>
              <li>Enjoy peace of mind while youre away</li>
            </ul>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>How It Works</CardTitle>
            <CardDescription>For Pet Sitters</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="list-disc pl-4 space-y-2 text-sm text-muted-foreground">
              <li>Create your profile</li>
              <li>Browse available pets in your area</li>
              <li>Send sitting requests</li>
              <li>Meet the pets and their owners</li>
              <li>Enjoy your time with your furry friend</li>
            </ul>
          </CardContent>
        </Card>
      </div>
      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Register Pet</CardTitle>
            <PawPrint className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Step 1</div>
            <p className="text-xs text-muted-foreground">Add your pets details</p>
            <Button className="mt-4 w-full" variant="outline">
              Add Pet <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Set Availability</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Step 2</div>
            <p className="text-xs text-muted-foreground">Choose when your pet is available</p>
            <Button className="mt-4 w-full" variant="outline">
              Set Dates <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Review Sitters</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Step 3</div>
            <p className="text-xs text-muted-foreground">Choose the perfect sitter for your pet</p>
            <Button className="mt-4 w-full" variant="outline">
              View Requests <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Enjoy</CardTitle>
            <PawPrint className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">Step 4</div>
            <p className="text-xs text-muted-foreground">Relax knowing your pet is in good hands</p>
            <Button className="mt-4 w-full" variant="outline">
              View Bookings <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </DashboardShell>
  )
}

