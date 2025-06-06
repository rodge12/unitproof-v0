"use client"

import { useState } from "react"
import { Search, Filter, Menu, User, LogOut, Loader2, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Alert, AlertDescription } from "@/components/ui/alert"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { LoginModal } from "@/components/modals/login-modal"
import { useUser } from "@/contexts/user-context"

export function Header() {
  const [isOpen, setIsOpen] = useState(false)
  const [showLogin, setShowLogin] = useState(false)
  const { user, profile, isLoading, error, signOut } = useUser()

  const areas = [
    "All Areas",
    "Dubai Marina",
    "Downtown Dubai",
    "Jumeirah Beach Residence",
    "Business Bay",
    "Dubai Hills Estate",
    "Dubai South",
  ]

  const handleSignOut = async () => {
    try {
      await signOut()
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  return (
    <>
      <header className="sticky top-0 z-50 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800">
        {/* Error Alert */}
        {error && (
          <div className="bg-red-900/20 border-b border-red-800">
            <div className="container mx-auto px-4 py-2">
              <Alert className="border-red-800 bg-red-900/20">
                <AlertCircle className="h-4 w-4 text-red-400" />
                <AlertDescription className="text-red-300">Connection Error: {error}</AlertDescription>
              </Alert>
            </div>
          </div>
        )}

        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            {/* Logo */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded border-2 border-cyan-400 flex items-center justify-center">
                <span className="text-cyan-400 font-bold text-lg">U</span>
              </div>
              <span className="text-white font-bold text-xl">UnitProof</span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden lg:flex items-center space-x-4 flex-1 max-w-2xl mx-8">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search towers or units..."
                  className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-400 focus:border-cyan-400"
                />
              </div>
              <Select>
                <SelectTrigger className="w-48 bg-gray-800 border-gray-700 text-white">
                  <SelectValue placeholder="Select Area" />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-700">
                  {areas.map((area) => (
                    <SelectItem
                      key={area}
                      value={area.toLowerCase().replace(" ", "-")}
                      className="text-white hover:bg-gray-700"
                    >
                      {area}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                variant="outline"
                size="icon"
                className="border-gray-700 text-gray-400 hover:text-white hover:border-cyan-400"
              >
                <Filter className="w-4 h-4" />
              </Button>
            </div>

            {/* User Authentication */}
            <div className="flex items-center space-x-2">
              {isLoading ? (
                <Button variant="outline" className="border-gray-700 text-white" disabled>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Loading...
                </Button>
              ) : user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="border-gray-700 text-white hover:bg-gray-800">
                      <User className="w-4 h-4 mr-2" />
                      {profile?.role === "premium" ? "Premium" : profile?.role === "admin" ? "Admin" : "Free User"}
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="bg-gray-800 border-gray-700">
                    <DropdownMenuLabel className="text-white">{user.email}</DropdownMenuLabel>
                    <DropdownMenuSeparator className="bg-gray-700" />
                    <DropdownMenuItem
                      className="text-white hover:bg-gray-700 cursor-pointer"
                      onClick={() => {
                        if (profile?.role === "free") {
                          setShowLogin(true)
                        }
                      }}
                    >
                      {profile?.role === "premium" ? "Subscription" : "Upgrade to Premium"}
                    </DropdownMenuItem>
                    {profile?.role === "admin" && (
                      <DropdownMenuItem className="text-white hover:bg-gray-700 cursor-pointer">
                        <a href="/admin">Admin Panel</a>
                      </DropdownMenuItem>
                    )}
                    <DropdownMenuItem className="text-white hover:bg-gray-700 cursor-pointer" onClick={handleSignOut}>
                      <LogOut className="w-4 h-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button
                  className="bg-gradient-to-r from-cyan-500 to-green-500 hover:from-cyan-600 hover:to-green-600 text-white font-semibold"
                  onClick={() => setShowLogin(true)}
                  disabled={!!error}
                >
                  Sign In
                </Button>
              )}

              {/* Mobile Menu */}
              <Sheet open={isOpen} onOpenChange={setIsOpen}>
                <SheetTrigger asChild>
                  <Button variant="ghost" size="icon" className="lg:hidden text-white">
                    <Menu className="w-6 h-6" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="right" className="bg-gray-900 border-gray-800 w-80">
                  <div className="flex flex-col space-y-4 mt-8">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <Input
                        placeholder="Search towers or units..."
                        className="pl-10 bg-gray-800 border-gray-700 text-white placeholder-gray-400"
                      />
                    </div>
                    <Select>
                      <SelectTrigger className="bg-gray-800 border-gray-700 text-white">
                        <SelectValue placeholder="Select Area" />
                      </SelectTrigger>
                      <SelectContent className="bg-gray-800 border-gray-700">
                        {areas.map((area) => (
                          <SelectItem key={area} value={area.toLowerCase().replace(" ", "-")} className="text-white">
                            {area}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {user ? (
                      <div className="space-y-2">
                        <p className="text-white">
                          Signed in as{" "}
                          <span className="font-semibold">
                            {profile?.role === "premium"
                              ? "Premium User"
                              : profile?.role === "admin"
                                ? "Admin"
                                : "Free User"}
                          </span>
                        </p>
                        {profile?.role === "free" && (
                          <Button
                            className="w-full bg-gradient-to-r from-cyan-500 to-green-500 hover:from-cyan-600 hover:to-green-600 text-white"
                            onClick={() => {
                              setIsOpen(false)
                              setShowLogin(true)
                            }}
                          >
                            Upgrade to Premium
                          </Button>
                        )}
                        <Button
                          variant="outline"
                          className="w-full border-gray-700 text-white hover:bg-gray-800"
                          onClick={() => {
                            handleSignOut()
                            setIsOpen(false)
                          }}
                        >
                          Sign Out
                        </Button>
                      </div>
                    ) : (
                      <Button
                        className="bg-gradient-to-r from-cyan-500 to-green-500 hover:from-cyan-600 hover:to-green-600 text-white"
                        onClick={() => {
                          setIsOpen(false)
                          setShowLogin(true)
                        }}
                        disabled={!!error}
                      >
                        Sign In
                      </Button>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </div>
      </header>

      <LoginModal isOpen={showLogin} onClose={() => setShowLogin(false)} />
    </>
  )
}
