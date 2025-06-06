"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { useToast } from "@/components/ui/use-toast"
import { MessageCircle, Send, CheckCircle, Phone, Mail } from "lucide-react"
import { dataService } from "@/lib/services/data-service"

interface LeadFormProps {
  towerName?: string
  onSuccess?: () => void
}

export function LeadForm({ towerName, onSuccess }: LeadFormProps) {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    towerName: towerName || "",
    message: "",
    preferredContact: "email",
    agreeToTerms: false,
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSuccess, setIsSuccess] = useState(false)

  const { toast } = useToast()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.agreeToTerms) {
      toast({
        title: "Terms Required",
        description: "Please agree to the terms and conditions.",
        variant: "destructive",
      })
      return
    }

    setIsSubmitting(true)

    try {
      await dataService.submitLead({
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        towerName: formData.towerName,
        message: formData.message,
      })

      setIsSuccess(true)
      toast({
        title: "Request Submitted",
        description: "We'll get back to you within 24 hours with your vacancy report.",
      })

      // Reset form after success
      setTimeout(() => {
        setIsSuccess(false)
        setFormData({
          name: "",
          email: "",
          phone: "",
          towerName: towerName || "",
          message: "",
          preferredContact: "email",
          agreeToTerms: false,
        })
        onSuccess?.()
      }, 3000)
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "Please try again or contact us directly.",
        variant: "destructive",
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleWhatsApp = () => {
    const message = encodeURIComponent(
      `Hi! I'm interested in getting a vacancy report${towerName ? ` for ${towerName}` : ""}.\n\nName: ${formData.name}\nEmail: ${formData.email}\n\n${formData.message}`,
    )
    const whatsappUrl = `https://wa.me/971581965830?text=${message}`
    window.open(whatsappUrl, "_blank")
  }

  const handleChange = (field: string, value: any) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  if (isSuccess) {
    return (
      <Card className="bg-gray-800 border-gray-700">
        <CardContent className="p-8 text-center">
          <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h3 className="text-white text-xl font-semibold mb-2">Request Received!</h3>
          <p className="text-gray-400 mb-4">
            Thank you for your interest. We'll prepare your vacancy report and get back to you within 24 hours.
          </p>
          <div className="space-y-2 text-sm text-gray-300">
            <p>📧 Check your email for confirmation</p>
            <p>📱 We may call you for additional details</p>
            <p>📊 Your custom report will include detailed analytics</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="bg-gray-800 border-gray-700">
      <CardHeader>
        <CardTitle className="text-white flex items-center">
          <MessageCircle className="w-5 h-5 mr-2 text-cyan-400" />
          Request Your Free Vacancy Report
        </CardTitle>
        <p className="text-gray-400">
          Get detailed insights into vacant units, rental prices, and market opportunities.
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="name" className="text-white">
                Full Name *
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleChange("name", e.target.value)}
                placeholder="Your full name"
                required
                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-cyan-400"
              />
            </div>
            <div>
              <Label htmlFor="email" className="text-white">
                Email Address *
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleChange("email", e.target.value)}
                placeholder="your.email@example.com"
                required
                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-cyan-400"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="phone" className="text-white">
                Phone Number
              </Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleChange("phone", e.target.value)}
                placeholder="+971 58 196 5830"
                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-cyan-400"
              />
            </div>
            <div>
              <Label htmlFor="tower" className="text-white">
                Tower of Interest
              </Label>
              <Input
                id="tower"
                value={formData.towerName}
                onChange={(e) => handleChange("towerName", e.target.value)}
                placeholder="e.g., Princess Tower, Burj Khalifa"
                className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-cyan-400"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="contact-preference" className="text-white">
              Preferred Contact Method
            </Label>
            <Select
              value={formData.preferredContact}
              onValueChange={(value) => handleChange("preferredContact", value)}
            >
              <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-gray-800 border-gray-700">
                <SelectItem value="email" className="text-white">
                  Email
                </SelectItem>
                <SelectItem value="phone" className="text-white">
                  Phone Call
                </SelectItem>
                <SelectItem value="whatsapp" className="text-white">
                  WhatsApp
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="message" className="text-white">
              Additional Requirements
            </Label>
            <Textarea
              id="message"
              value={formData.message}
              onChange={(e) => handleChange("message", e.target.value)}
              placeholder="Tell us about your specific requirements, budget range, or any questions you have..."
              className="bg-gray-700 border-gray-600 text-white placeholder-gray-400 focus:border-cyan-400 min-h-[100px]"
            />
          </div>

          <div className="flex items-start space-x-2">
            <Checkbox
              id="terms"
              checked={formData.agreeToTerms}
              onCheckedChange={(checked) => handleChange("agreeToTerms", checked)}
              className="data-[state=checked]:bg-cyan-500 data-[state=checked]:border-cyan-500 mt-1"
            />
            <Label htmlFor="terms" className="text-gray-300 text-sm leading-relaxed">
              I agree to receive communications about vacancy reports and real estate opportunities. I understand that
              UnitProof will use my information to provide personalized market insights.
            </Label>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <Button
              type="submit"
              disabled={isSubmitting || !formData.agreeToTerms}
              className="flex-1 bg-gradient-to-r from-cyan-500 to-green-500 hover:from-cyan-600 hover:to-green-600 text-white font-semibold transform hover:scale-105 transition-all duration-200"
            >
              <Send className="w-4 h-4 mr-2" />
              {isSubmitting ? "Submitting..." : "Send Request"}
            </Button>

            <Button
              type="button"
              variant="outline"
              onClick={handleWhatsApp}
              className="flex-1 border-green-600 text-green-400 hover:bg-green-600 hover:text-white transform hover:scale-105 transition-all duration-200"
            >
              <MessageCircle className="w-4 h-4 mr-2" />
              WhatsApp Us
            </Button>
          </div>
        </form>

        {/* Contact Information */}
        <div className="mt-6 pt-6 border-t border-gray-700">
          <h4 className="text-white font-semibold mb-3">Or Contact Us Directly:</h4>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-sm">
            <div className="flex items-center text-gray-300">
              <Mail className="w-4 h-4 mr-2 text-cyan-400" />
              <a href="mailto:info@unitproof.com" className="hover:text-cyan-400 transition-colors">
                unitproof@outlook.com
              </a>
            </div>
            <div className="flex items-center text-gray-300">
              <Phone className="w-4 h-4 mr-2 text-green-400" />
              <a href="tel:+971501234567" className="hover:text-green-400 transition-colors">
                +971 58 196 5830
              </a>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
