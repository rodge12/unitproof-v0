"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { useUser } from "@/contexts/user-context"
import { User, CreditCard, CheckCircle } from "lucide-react"

interface LoginModalProps {
  isOpen: boolean
  onClose: () => void
}

export function LoginModal({ isOpen, onClose }: LoginModalProps) {
  const [activeTab, setActiveTab] = useState("login")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [showPayment, setShowPayment] = useState(false)

  const { login } = useUser()
  const { toast } = useToast()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate login
    setTimeout(() => {
      login("free")
      toast({
        title: "Logged in successfully",
        description: "You now have access to basic features.",
      })
      setIsLoading(false)
      onClose()
    }, 1000)
  }

  const handleSignup = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    // Simulate signup
    setTimeout(() => {
      setIsLoading(false)
      setShowPayment(true)
    }, 1000)
  }

  const handlePayment = (plan: "free" | "paid") => {
    setIsLoading(true)

    // Simulate payment processing
    setTimeout(() => {
      login(plan)
      toast({
        title: plan === "paid" ? "Premium subscription activated" : "Account created",
        description:
          plan === "paid" ? "You now have full access to all features." : "You now have access to basic features.",
      })
      setIsLoading(false)
      onClose()
    }, 1500)
  }

  if (showPayment) {
    return (
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="bg-gray-900 border-gray-700 sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-white text-xl">Choose Your Plan</DialogTitle>
            <DialogDescription className="text-gray-400">Select a subscription plan to continue</DialogDescription>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div
                className="border border-gray-700 rounded-lg p-4 hover:border-cyan-400 cursor-pointer transition-colors"
                onClick={() => handlePayment("free")}
              >
                <h3 className="text-white font-semibold mb-2 flex items-center">
                  <User className="w-5 h-5 mr-2 text-cyan-400" />
                  Free Plan
                </h3>
                <p className="text-gray-400 text-sm mb-3">Basic access with limited features</p>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-400 mt-0.5" />
                    Access to 1 tower
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-400 mt-0.5" />
                    Basic unit information
                  </li>
                </ul>
                <p className="mt-4 text-white font-bold">Free</p>
              </div>

              <div
                className="border border-cyan-500 rounded-lg p-4 hover:border-cyan-400 cursor-pointer transition-colors bg-gradient-to-br from-gray-800 to-gray-900"
                onClick={() => handlePayment("paid")}
              >
                <h3 className="text-white font-semibold mb-2 flex items-center">
                  <CreditCard className="w-5 h-5 mr-2 text-cyan-400" />
                  Premium Plan
                </h3>
                <p className="text-gray-400 text-sm mb-3">Full access to all features</p>
                <ul className="space-y-2 text-sm text-gray-300">
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-400 mt-0.5" />
                    Access to all towers
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-400 mt-0.5" />
                    Detailed unit analytics
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-400 mt-0.5" />
                    Export data to CSV
                  </li>
                  <li className="flex items-start">
                    <CheckCircle className="w-4 h-4 mr-2 text-green-400 mt-0.5" />
                    Priority support
                  </li>
                </ul>
                <p className="mt-4 text-white font-bold">$99/month</p>
              </div>
            </div>

            <Button
              variant="outline"
              className="w-full border-gray-700 text-white hover:bg-gray-800"
              onClick={() => setShowPayment(false)}
            >
              Back to Login
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 border-gray-700 sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white text-xl">
            {activeTab === "login" ? "Sign In" : "Create Account"}
          </DialogTitle>
          <DialogDescription className="text-gray-400">
            {activeTab === "login"
              ? "Sign in to access tower data and analytics"
              : "Create an account to get started with UnitProof"}
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="login" value={activeTab} onValueChange={setActiveTab} className="mt-4">
          <TabsList className="grid grid-cols-2 bg-gray-800">
            <TabsTrigger value="login" className="data-[state=active]:bg-gray-700">
              Sign In
            </TabsTrigger>
            <TabsTrigger value="signup" className="data-[state=active]:bg-gray-700">
              Sign Up
            </TabsTrigger>
          </TabsList>

          <TabsContent value="login">
            <form onSubmit={handleLogin} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="email" className="text-white">
                  Email
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-white">
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-cyan-500 to-green-500 hover:from-cyan-600 hover:to-green-600 text-white"
                disabled={isLoading}
              >
                {isLoading ? "Signing in..." : "Sign In"}
              </Button>
            </form>
          </TabsContent>

          <TabsContent value="signup">
            <form onSubmit={handleSignup} className="space-y-4 mt-4">
              <div className="space-y-2">
                <Label htmlFor="signup-email" className="text-white">
                  Email
                </Label>
                <Input
                  id="signup-email"
                  type="email"
                  placeholder="name@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="signup-password" className="text-white">
                  Password
                </Label>
                <Input
                  id="signup-password"
                  type="password"
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="bg-gray-800 border-gray-700 text-white"
                />
              </div>
              <Button
                type="submit"
                className="w-full bg-gradient-to-r from-cyan-500 to-green-500 hover:from-cyan-600 hover:to-green-600 text-white"
                disabled={isLoading}
              >
                {isLoading ? "Creating account..." : "Create Account"}
              </Button>
            </form>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  )
}
