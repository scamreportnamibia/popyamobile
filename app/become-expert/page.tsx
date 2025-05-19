"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Checkbox } from "@/components/ui/checkbox"
import { Switch } from "@/components/ui/switch"
import { ArrowLeft, Upload, Check, AlertCircle } from "lucide-react"
import Link from "next/link"
import Image from "next/image"
import { useAuth } from "@/contexts/auth-context"

// Define specialization areas
const specializationAreas = [
  { id: "anxiety", label: "Anxiety" },
  { id: "depression", label: "Depression" },
  { id: "trauma", label: "Trauma & PTSD" },
  { id: "grief", label: "Grief & Loss" },
  { id: "addiction", label: "Addiction" },
  { id: "stress", label: "Stress Management" },
  { id: "relationships", label: "Relationship Issues" },
  { id: "self_esteem", label: "Self-Esteem" },
  { id: "anger", label: "Anger Management" },
  { id: "eating_disorders", label: "Eating Disorders" },
  { id: "sleep", label: "Sleep Issues" },
  { id: "lgbtq", label: "LGBTQ+ Support" },
  { id: "youth", label: "Youth & Adolescent" },
  { id: "family", label: "Family Conflicts" },
  { id: "career", label: "Career Counseling" },
]

// Define regions in Namibia
const namibiaRegions = [
  "Erongo",
  "Hardap",
  "Karas",
  "Kavango East",
  "Kavango West",
  "Khomas",
  "Kunene",
  "Ohangwena",
  "Omaheke",
  "Omusati",
  "Oshana",
  "Oshikoto",
  "Otjozondjupa",
  "Zambezi",
]

export default function BecomeExpertPage() {
  const { user } = useAuth()
  const router = useRouter()
  const [activeStep, setActiveStep] = useState(1)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  // Form state
  const [formData, setFormData] = useState({
    // Personal Information
    fullName: user?.name || "",
    email: user?.email || "",
    phone: "",
    profileImage: null,
    profileImagePreview: "",

    // Professional Information
    expertType: "",
    institution: "",
    position: "",
    yearsOfExperience: "",
    region: "",
    town: "",
    licenseNumber: "",
    licenseDocument: null,
    licenseDocumentName: "",

    // Specialization
    specializations: [] as string[],
    languages: [] as string[],
    bio: "",

    // Availability
    availableDays: [] as string[],
    availableHours: "",
    offersFreeConsultation: false,
    consultationRate: "",

    // Terms
    agreeToTerms: false,
    agreeToCodeOfConduct: false,
    agreeToDataPolicy: false,
  })

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target
    setFormData({ ...formData, [name]: value })
  }

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value })
  }

  const handleCheckboxChange = (id: string, checked: boolean) => {
    if (id.startsWith("specialization-")) {
      const specializationId = id.replace("specialization-", "")
      setFormData({
        ...formData,
        specializations: checked
          ? [...formData.specializations, specializationId]
          : formData.specializations.filter((s) => s !== specializationId),
      })
    } else if (id.startsWith("language-")) {
      const language = id.replace("language-", "")
      setFormData({
        ...formData,
        languages: checked ? [...formData.languages, language] : formData.languages.filter((l) => l !== language),
      })
    } else if (id.startsWith("day-")) {
      const day = id.replace("day-", "")
      setFormData({
        ...formData,
        availableDays: checked ? [...formData.availableDays, day] : formData.availableDays.filter((d) => d !== day),
      })
    } else {
      setFormData({ ...formData, [id]: checked })
    }
  }

  const handleProfileImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    const reader = new FileReader()
    reader.onload = (event) => {
      const imagePreview = event.target?.result as string
      setFormData({ ...formData, profileImage: file, profileImagePreview: imagePreview })
    }
    reader.readAsDataURL(file)
  }

  const handleLicenseDocumentUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return
    setFormData({ ...formData, licenseDocument: file, licenseDocumentName: file.name })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    // In a real app, you would send the form data to your API
    console.log("Submitting expert application:", formData)

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      setIsSubmitted(true)
    }, 2000)
  }

  const nextStep = () => {
    setActiveStep(activeStep + 1)
    window.scrollTo(0, 0)
  }

  const prevStep = () => {
    setActiveStep(activeStep - 1)
    window.scrollTo(0, 0)
  }

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
        <div className="max-w-3xl mx-auto">
          <Card className="border-green-200 shadow-lg">
            <CardContent className="pt-6">
              <div className="flex flex-col items-center text-center">
                <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-6">
                  <Check className="h-10 w-10 text-green-600" />
                </div>
                <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-2">Application Submitted!</h1>
                <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-md">
                  Thank you for applying to become an expert on Popya. We've received your application and will review
                  it shortly.
                </p>
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-6 text-left w-full">
                  <div className="flex">
                    <AlertCircle className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2 flex-shrink-0" />
                    <div>
                      <h3 className="text-sm font-medium text-blue-800 dark:text-blue-300">What happens next?</h3>
                      <ul className="mt-2 text-sm text-blue-700 dark:text-blue-400 list-disc list-inside">
                        <li>Our team will review your application (typically within 2-3 business days)</li>
                        <li>We may contact you for additional information or verification</li>
                        <li>Once approved, you'll receive an email with instructions to set up your expert profile</li>
                      </ul>
                    </div>
                  </div>
                </div>
                <div className="flex gap-4">
                  <Button variant="outline" asChild>
                    <Link href="/">Return to Home</Link>
                  </Button>
                  <Button asChild>
                    <Link href="/profile">Go to Profile</Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <Link
            href="/"
            className="inline-flex items-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
          >
            <ArrowLeft className="h-4 w-4 mr-1" />
            Back to Home
          </Link>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mt-4">Become an Expert on Popya</h1>
          <p className="text-gray-600 dark:text-gray-400">
            Join our network of mental health professionals and help support those in need.
          </p>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4].map((step) => (
              <div key={step} className="flex flex-col items-center">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center ${
                    step < activeStep
                      ? "bg-green-500 text-white"
                      : step === activeStep
                        ? "bg-blue-600 text-white"
                        : "bg-gray-200 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                  }`}
                >
                  {step < activeStep ? <Check className="h-5 w-5" /> : step}
                </div>
                <span
                  className={`text-xs mt-2 ${
                    step <= activeStep ? "text-gray-800 dark:text-gray-200" : "text-gray-500 dark:text-gray-400"
                  }`}
                >
                  {step === 1
                    ? "Personal Info"
                    : step === 2
                      ? "Professional"
                      : step === 3
                        ? "Specialization"
                        : "Availability"}
                </span>
              </div>
            ))}
          </div>
          <div className="mt-2 h-1 bg-gray-200 dark:bg-gray-700 rounded-full">
            <div
              className="h-1 bg-blue-600 rounded-full transition-all duration-300"
              style={{ width: `${((activeStep - 1) / 3) * 100}%` }}
            ></div>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              {activeStep === 1
                ? "Personal Information"
                : activeStep === 2
                  ? "Professional Information"
                  : activeStep === 3
                    ? "Specialization & Experience"
                    : "Availability & Terms"}
            </CardTitle>
            <CardDescription>
              {activeStep === 1
                ? "Provide your basic contact information"
                : activeStep === 2
                  ? "Tell us about your professional background"
                  : activeStep === 3
                    ? "Share your areas of expertise and experience"
                    : "Set your availability and agree to our terms"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit}>
              {/* Step 1: Personal Information */}
              {activeStep === 1 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="fullName">Full Name</Label>
                      <Input
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleInputChange}
                        placeholder="Enter your full name"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email Address</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleInputChange}
                        placeholder="Enter your email address"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="phone">Phone Number</Label>
                    <Input
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      placeholder="Enter your phone number"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="profileImage">Profile Image</Label>
                    <div className="flex items-center gap-4">
                      {formData.profileImagePreview ? (
                        <div className="relative w-24 h-24 rounded-full overflow-hidden">
                          <Image
                            src={formData.profileImagePreview || "/placeholder.svg"}
                            alt="Profile preview"
                            fill
                            className="object-cover"
                          />
                        </div>
                      ) : (
                        <div className="w-24 h-24 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center">
                          <span className="text-gray-500 dark:text-gray-400 text-xl">
                            {formData.fullName.charAt(0) || "?"}
                          </span>
                        </div>
                      )}
                      <div className="flex-1">
                        <Input id="profileImage" type="file" accept="image/*" onChange={handleProfileImageUpload} />
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          Upload a professional photo. This will be visible to users seeking help.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Professional Information */}
              {activeStep === 2 && (
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expertType">Professional Type</Label>
                      <Select
                        value={formData.expertType}
                        onValueChange={(value) => handleSelectChange("expertType", value)}
                      >
                        <SelectTrigger id="expertType">
                          <SelectValue placeholder="Select your profession" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="psychologist">Psychologist</SelectItem>
                          <SelectItem value="therapist">Therapist</SelectItem>
                          <SelectItem value="counselor">Counselor</SelectItem>
                          <SelectItem value="social_worker">Social Worker</SelectItem>
                          <SelectItem value="police">Police Officer</SelectItem>
                          <SelectItem value="medical_doctor">Medical Doctor</SelectItem>
                          <SelectItem value="psychiatrist">Psychiatrist</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="institution">Institution/Organization</Label>
                      <Input
                        id="institution"
                        name="institution"
                        value={formData.institution}
                        onChange={handleInputChange}
                        placeholder="Where do you work?"
                        required
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="position">Position/Title</Label>
                      <Input
                        id="position"
                        name="position"
                        value={formData.position}
                        onChange={handleInputChange}
                        placeholder="Your job title"
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="yearsOfExperience">Years of Experience</Label>
                      <Select
                        value={formData.yearsOfExperience}
                        onValueChange={(value) => handleSelectChange("yearsOfExperience", value)}
                      >
                        <SelectTrigger id="yearsOfExperience">
                          <SelectValue placeholder="Select experience" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="0-2">0-2 years</SelectItem>
                          <SelectItem value="3-5">3-5 years</SelectItem>
                          <SelectItem value="6-10">6-10 years</SelectItem>
                          <SelectItem value="11-15">11-15 years</SelectItem>
                          <SelectItem value="16+">16+ years</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="region">Region</Label>
                      <Select value={formData.region} onValueChange={(value) => handleSelectChange("region", value)}>
                        <SelectTrigger id="region">
                          <SelectValue placeholder="Select region" />
                        </SelectTrigger>
                        <SelectContent>
                          {namibiaRegions.map((region) => (
                            <SelectItem key={region} value={region.toLowerCase()}>
                              {region}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="town">Town/City</Label>
                      <Input
                        id="town"
                        name="town"
                        value={formData.town}
                        onChange={handleInputChange}
                        placeholder="Your town or city"
                        required
                      />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="licenseNumber">License/Registration Number</Label>
                    <Input
                      id="licenseNumber"
                      name="licenseNumber"
                      value={formData.licenseNumber}
                      onChange={handleInputChange}
                      placeholder="Professional license or registration number"
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="licenseDocument">Upload License/Certification</Label>
                    <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-md p-4">
                      <div className="flex items-center justify-center">
                        <label
                          htmlFor="licenseDocument"
                          className="flex flex-col items-center justify-center w-full cursor-pointer"
                        >
                          <Upload className="h-8 w-8 text-gray-400 mb-2" />
                          <span className="text-sm text-gray-600 dark:text-gray-400">
                            {formData.licenseDocumentName || "Click to upload or drag and drop"}
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                            PDF, JPG, or PNG (max 5MB)
                          </span>
                          <Input
                            id="licenseDocument"
                            type="file"
                            accept=".pdf,.jpg,.jpeg,.png"
                            className="hidden"
                            onChange={handleLicenseDocumentUpload}
                          />
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Specialization & Experience */}
              {activeStep === 3 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-base">Areas of Specialization</Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                      Select all areas that you specialize in
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {specializationAreas.map((area) => (
                        <div key={area.id} className="flex items-center space-x-2">
                          <Checkbox
                            id={`specialization-${area.id}`}
                            checked={formData.specializations.includes(area.id)}
                            onCheckedChange={(checked) =>
                              handleCheckboxChange(`specialization-${area.id}`, checked as boolean)
                            }
                          />
                          <label
                            htmlFor={`specialization-${area.id}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {area.label}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label className="text-base">Languages Spoken</Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                      Select all languages you can provide services in
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {[
                        "English",
                        "Afrikaans",
                        "Oshiwambo",
                        "Otjiherero",
                        "Damara/Nama",
                        "Rukwangali",
                        "Portuguese",
                        "German",
                      ].map((language) => (
                        <div key={language} className="flex items-center space-x-2">
                          <Checkbox
                            id={`language-${language.toLowerCase()}`}
                            checked={formData.languages.includes(language.toLowerCase())}
                            onCheckedChange={(checked) =>
                              handleCheckboxChange(`language-${language.toLowerCase()}`, checked as boolean)
                            }
                          />
                          <label
                            htmlFor={`language-${language.toLowerCase()}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {language}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="bio">Professional Bio</Label>
                    <Textarea
                      id="bio"
                      name="bio"
                      value={formData.bio}
                      onChange={handleInputChange}
                      placeholder="Tell us about your background, approach, and experience..."
                      className="min-h-[150px]"
                      required
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      This will be displayed on your public profile. Include your approach to therapy/counseling,
                      relevant experience, and what clients can expect when working with you.
                    </p>
                  </div>
                </div>
              )}

              {/* Step 4: Availability & Terms */}
              {activeStep === 4 && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-base">Available Days</Label>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                      Select the days you're available for consultations
                    </p>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                      {["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"].map((day) => (
                        <div key={day} className="flex items-center space-x-2">
                          <Checkbox
                            id={`day-${day.toLowerCase()}`}
                            checked={formData.availableDays.includes(day.toLowerCase())}
                            onCheckedChange={(checked) =>
                              handleCheckboxChange(`day-${day.toLowerCase()}`, checked as boolean)
                            }
                          />
                          <label
                            htmlFor={`day-${day.toLowerCase()}`}
                            className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                          >
                            {day}
                          </label>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="availableHours">Available Hours</Label>
                    <Select
                      value={formData.availableHours}
                      onValueChange={(value) => handleSelectChange("availableHours", value)}
                    >
                      <SelectTrigger id="availableHours">
                        <SelectValue placeholder="Select hours" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="morning">Morning (8am - 12pm)</SelectItem>
                        <SelectItem value="afternoon">Afternoon (12pm - 5pm)</SelectItem>
                        <SelectItem value="evening">Evening (5pm - 9pm)</SelectItem>
                        <SelectItem value="full_day">Full Day (8am - 5pm)</SelectItem>
                        <SelectItem value="flexible">Flexible Hours</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="offersFreeConsultation" className="text-base">
                        Offer Free Initial Consultation
                      </Label>
                      <Switch
                        id="offersFreeConsultation"
                        checked={formData.offersFreeConsultation}
                        onCheckedChange={(checked) => handleCheckboxChange("offersFreeConsultation", checked)}
                      />
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Offering a free initial consultation can help users feel more comfortable reaching out.
                    </p>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="consultationRate">Consultation Rate (NAD)</Label>
                    <Input
                      id="consultationRate"
                      name="consultationRate"
                      type="number"
                      value={formData.consultationRate}
                      onChange={handleInputChange}
                      placeholder="Your hourly rate in Namibian Dollars"
                    />
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      This is for our information only. You can discuss actual rates with clients directly.
                    </p>
                  </div>
                  <div className="space-y-4 pt-4 border-t">
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="agreeToTerms"
                          checked={formData.agreeToTerms}
                          onCheckedChange={(checked) => handleCheckboxChange("agreeToTerms", checked as boolean)}
                          required
                        />
                        <label
                          htmlFor="agreeToTerms"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          I agree to the{" "}
                          <Link href="/terms" className="text-blue-600 hover:underline">
                            Terms of Service
                          </Link>
                        </label>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="agreeToCodeOfConduct"
                          checked={formData.agreeToCodeOfConduct}
                          onCheckedChange={(checked) =>
                            handleCheckboxChange("agreeToCodeOfConduct", checked as boolean)
                          }
                          required
                        />
                        <label
                          htmlFor="agreeToCodeOfConduct"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          I agree to follow the{" "}
                          <Link href="/code-of-conduct" className="text-blue-600 hover:underline">
                            Expert Code of Conduct
                          </Link>
                        </label>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id="agreeToDataPolicy"
                          checked={formData.agreeToDataPolicy}
                          onCheckedChange={(checked) => handleCheckboxChange("agreeToDataPolicy", checked as boolean)}
                          required
                        />
                        <label
                          htmlFor="agreeToDataPolicy"
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                        >
                          I understand and agree to the{" "}
                          <Link href="/privacy" className="text-blue-600 hover:underline">
                            Data Privacy Policy
                          </Link>
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              <div className="flex justify-between mt-8">
                {activeStep > 1 ? (
                  <Button type="button" variant="outline" onClick={prevStep}>
                    Previous
                  </Button>
                ) : (
                  <div></div>
                )}
                {activeStep < 4 ? (
                  <Button type="button" onClick={nextStep}>
                    Next
                  </Button>
                ) : (
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? "Submitting..." : "Submit Application"}
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
