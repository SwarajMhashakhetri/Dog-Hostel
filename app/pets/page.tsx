"use client"
import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { AlertCircle } from "lucide-react"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

interface Pet {
  id: number
  name: string
  breed: string
  age: number
  status: string
}

export default function PetsPage() {
  const { data: session, status } = useSession()
  const [pets, setPets] = useState<Pet[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [newPet, setNewPet] = useState({ name: "", breed: "", age: "" })
  const router = useRouter()

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/signin")
    } else if (status === "authenticated") {
      fetchPets()
    }
  }, [status, router])

  const fetchPets = async () => {
    try {
      const response = await fetch("/api/pets")
      if (!response.ok) {
        throw new Error("Failed to fetch pets")
      }
      const data = await response.json()
      setPets(data)
    } catch (err) {
      setError("An error occurred while fetching pets. Please try again later.")
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddPet = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    if (!session?.user?.id) {
      setError("User ID not found. Please sign in again.")
      return
    }

    try {
      const response = await fetch("/api/pets", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ownerId: session.user.id,
          name: newPet.name,
          breed: newPet.breed,
          age: Number.parseInt(newPet.age),
        }),
      })

      if (!response.ok) {
        throw new Error("Failed to add pet")
      }

      const data = await response.json()
      setPets([...pets, data.pet])
      setNewPet({ name: "", breed: "", age: "" })
    } catch (err) {
      setError("An error occurred while adding the pet. Please try again later.")
    }
  }

  if (isLoading) {
    return <div className="container mx-auto px-4 py-8">Loading...</div>
  }

  if (error) {
    return <ErrorMessage message={error} />
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Pets</h1>

      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Add a New Pet</CardTitle>
          <CardDescription>Enter your pet's details below</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleAddPet} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={newPet.name}
                  onChange={(e:any) => setNewPet({ ...newPet, name: e.target.value })}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="breed">Breed</Label>
                <Input
                  id="breed"
                  value={newPet.breed}
                  onChange={(e:any) => setNewPet({ ...newPet, breed: e.target.value })}
                  required
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                type="number"
                value={newPet.age}
                onChange={(e:any) => setNewPet({ ...newPet, age: e.target.value })}
                required
              />
            </div>
            <Button type="submit">Add Pet</Button>
          </form>
        </CardContent>
      </Card>

      <h2 className="text-2xl font-bold mb-4">Available Pets</h2>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {pets.map((pet) => (
          <Card key={pet.id}>
            <CardHeader>
              <CardTitle>{pet.name}</CardTitle>
              <CardDescription>{pet.breed}</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Age: {pet.age}</p>
              <p>Status: {pet.status}</p>
            </CardContent>
            <CardFooter>
              <Button variant="outline">Request to Borrow</Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}

function ErrorMessage({ message }: { message: string }) {
  return (
    <Alert variant="destructive" className="max-w-md mx-auto">
      <AlertCircle className="h-4 w-4" />
      <AlertTitle>Error</AlertTitle>
      <AlertDescription>{message}</AlertDescription>
    </Alert>
  )
}

