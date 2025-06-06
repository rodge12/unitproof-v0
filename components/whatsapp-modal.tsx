"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/components/ui/use-toast"
import { MessageSquare, Send } from "lucide-react"

interface WhatsAppModalProps {
  isOpen: boolean
  onClose: () => void
  towerName: string
}

export function WhatsAppModal({ isOpen, onClose, towerName }: WhatsAppModalProps) {
  const [name, setName] = useState("")
  const [phone, setPhone] = useState("")
  const [message, setMessage] = useState(`Hi, I'd like the full vacancy report for ${towerName}.`)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const { toast } = useToast()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Prepare WhatsApp message
    const whatsappMessage = encodeURIComponent(`Name: ${name}\nTower: ${towerName}\n\n${message}`)
    const whatsappNumber = "971501234567" // Replace with your actual WhatsApp number
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`

    // Open WhatsApp in a new tab
    window.open(whatsappUrl, "_blank")

    // Show success toast
    toast({
      title: "Request sent",
      description: "Your request has been sent via WhatsApp.",
    })

    setIsSubmitting(false)
    onClose()
  }

  const handleDirectWhatsApp = () => {
    // Prepare WhatsApp message
    const whatsappMessage = encodeURIComponent(`Hi, I'd like the full vacancy report for ${towerName}.`)
    const whatsappNumber = "971501234567" // Replace with your actual WhatsApp number
    const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`

    // Open WhatsApp in a new tab
    window.open(whatsappUrl, "_blank")

    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-gray-900 border-gray-700 sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-white text-xl flex items-center">
            <MessageSquare className="w-5 h-5 mr-2 text-cyan-400" />
            Request Vacancy Report
          </DialogTitle>
          <DialogDescription className="text-gray-400">Get a detailed vacancy report for {towerName}</DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          <div className="bg-gray-800 p-4 rounded-lg mb-4">
            <h3 className="text-white font-semibold mb-2">What You'll Get:</h3>
            <ul className="space-y-2 text-sm text-gray-300">
              <li className="flex items-start">
                <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2 mr-3 flex-shrink-0" />
                Complete list of vacant units in {towerName}
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-green-400 rounded-full mt-2 mr-3 flex-shrink-0" />
                Detailed vacancy duration and rental history
              </li>
              <li className="flex items-start">
                <div className="w-2 h-2 bg-cyan-400 rounded-full mt-2 mr-3 flex-shrink-0" />
                Owner contact information (where available)
              </li>
            </ul>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-white">
                Your Name
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter your name"
                required
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone" className="text-white">
                Phone Number
              </Label>
              <Input
                id="phone"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Enter your phone number"
                required
                className="bg-gray-800 border-gray-700 text-white"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="message" className="text-white">
                Message
              </Label>
              <Textarea
                id="message"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Enter your message"
                className="bg-gray-800 border-gray-700 text-white min-h-[100px]"
              />
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <Button
                type="submit"
                className="flex-1 bg-gradient-to-r from-cyan-500 to-green-500 hover:from-cyan-600 hover:to-green-600 text-white"
                disabled={isSubmitting}
              >
                <Send className="w-4 h-4 mr-2" />
                {isSubmitting ? "Sending..." : "Send Request"}
              </Button>

              <Button
                type="button"
                variant="outline"
                className="flex-1 border-gray-700 text-white hover:bg-gray-800"
                onClick={handleDirectWhatsApp}
              >
                <MessageSquare className="w-4 h-4 mr-2" />
                Open WhatsApp Directly
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
