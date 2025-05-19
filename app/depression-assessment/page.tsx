"use client"

import { useState, useRef, useEffect } from "react"
import { ArrowLeft, ArrowRight, Download, FileText, Loader2, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { AnimatedContainer } from "@/components/ui/animated-container"
import { motion } from "framer-motion"
import jsPDF from "jspdf"

// PHQ-9 Questions (Standard depression assessment)
const questions = [
  "Little interest or pleasure in doing things",
  "Feeling down, depressed, or hopeless",
  "Trouble falling or staying asleep, or sleeping too much",
  "Feeling tired or having little energy",
  "Poor appetite or overeating",
  "Feeling bad about yourself - or that you are a failure or have let yourself or your family down",
  "Trouble concentrating on things, such as reading the newspaper or watching television",
  "Moving or speaking so slowly that other people could have noticed. Or the opposite - being so fidgety or restless that you have been moving around a lot more than usual",
  "Thoughts that you would be better off dead, or of hurting yourself in some way",
]

const options = [
  { value: 0, label: "Not at all", description: "Never experienced this" },
  { value: 1, label: "Several days", description: "Experienced for a few days" },
  { value: 2, label: "More than half the days", description: "Experienced most days" },
  { value: 3, label: "Nearly every day", description: "Experienced almost daily" },
]

// Motivational messages based on score
const getMotivationalMessage = (score: number) => {
  if (score >= 0 && score <= 4) {
    return "You're doing well! Continue practicing self-care and maintaining your healthy habits."
  } else if (score >= 5 && score <= 9) {
    return "Remember that small steps lead to big changes. Be kind to yourself during challenging times."
  } else if (score >= 10 && score <= 14) {
    return "You have the strength to overcome difficult moments. Reaching out for support is a sign of courage."
  } else if (score >= 15 && score <= 19) {
    return "You're not alone in this journey. Many have walked this path and found their way to better days."
  } else {
    return "Even in the darkest moments, there is hope. Professional support can help light the way forward."
  }
}

// Score interpretation
const interpretScore = (score: number) => {
  if (score >= 0 && score <= 4) {
    return {
      level: "Minimal depression",
      description: "Your symptoms suggest minimal or no depression.",
      recommendations: [
        "Continue monitoring your mental health",
        "Practice regular self-care activities",
        "Maintain healthy lifestyle habits",
      ],
      color: "#4CAF50",
    }
  } else if (score >= 5 && score <= 9) {
    return {
      level: "Mild depression",
      description: "Your symptoms suggest mild depression.",
      recommendations: [
        "Consider talking to a mental health professional",
        "Practice stress reduction techniques",
        "Maintain social connections",
        "Regular physical activity can help improve mood",
      ],
      color: "#FFC107",
    }
  } else if (score >= 10 && score <= 14) {
    return {
      level: "Moderate depression",
      description: "Your symptoms suggest moderate depression.",
      recommendations: [
        "Consult with a mental health professional",
        "Consider therapy or counseling",
        "Learn and practice coping strategies",
        "Maintain a routine and healthy lifestyle",
      ],
      color: "#FF9800",
    }
  } else if (score >= 15 && score <= 19) {
    return {
      level: "Moderately severe depression",
      description: "Your symptoms suggest moderately severe depression.",
      recommendations: [
        "Seek professional help soon",
        "Talk to a doctor or mental health specialist",
        "Consider both therapy and medication options",
        "Build a support network of trusted individuals",
      ],
      color: "#F44336",
    }
  } else {
    return {
      level: "Severe depression",
      description: "Your symptoms suggest severe depression. Please seek professional help immediately.",
      recommendations: [
        "Contact a mental health professional immediately",
        "Consider emergency services if you have thoughts of harming yourself",
        "Do not face this alone - reach out to trusted people",
        "Follow professional treatment recommendations closely",
      ],
      color: "#D32F2F",
    }
  }
}

export default function DepressionAssessmentPage() {
  const [currentStep, setCurrentStep] = useState(-1) // Start at -1 for disclaimer
  const [answers, setAnswers] = useState<number[]>(Array(questions.length).fill(-1))
  const [isCompleted, setIsCompleted] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [agreedToDisclaimer, setAgreedToDisclaimer] = useState(false)
  const resultRef = useRef<HTMLDivElement>(null)

  // Optimize the assessment loading by reducing unnecessary calculations
  // and adding a loading state indicator
  const [isLoading, setIsLoading] = useState(true)

  // Add useEffect to simulate faster loading
  useEffect(() => {
    // Simulate faster loading
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  const totalScore = answers.reduce((sum, answer) => (answer >= 0 ? sum + answer : sum), 0)
  const interpretation = interpretScore(totalScore)
  const motivationalMessage = getMotivationalMessage(totalScore)

  const handleOptionSelect = (questionIndex: number, value: number) => {
    const newAnswers = [...answers]
    newAnswers[questionIndex] = value
    setAnswers(newAnswers)
  }

  const goToNextQuestion = () => {
    if (currentStep === -1) {
      if (agreedToDisclaimer) {
        setCurrentStep(0)
      }
    } else if (answers[currentStep] >= 0) {
      if (currentStep < questions.length - 1) {
        setCurrentStep(currentStep + 1)
      } else {
        setIsCompleted(true)
      }
    }
  }

  const goToPreviousQuestion = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  // Update the generatePDF function to include Popya logo and contact info
  const generatePDF = async () => {
    setIsGenerating(true)

    try {
      // Wait for any animations to complete
      await new Promise((resolve) => setTimeout(resolve, 300))

      const doc = new jsPDF()

      // Add Popya logo (placeholder)
      doc.setFillColor(108, 99, 255) // Popya primary color
      doc.rect(20, 10, 40, 10, "F")
      doc.setTextColor(255, 255, 255)
      doc.setFontSize(12)
      doc.setFont("helvetica", "bold")
      doc.text("POPYA", 25, 17)

      // Add title
      doc.setFontSize(18)
      doc.setTextColor(33, 33, 33)
      doc.setFont("helvetica", "bold")
      doc.text("Depression Assessment Results", 105, 30, { align: "center" })

      // Add date
      doc.setFontSize(10)
      doc.setTextColor(100, 100, 100)
      doc.setFont("helvetica", "normal")
      doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 105, 38, { align: "center" })

      // Add score and formula used
      doc.setFontSize(14)
      doc.setTextColor(33, 33, 33)
      doc.setFont("helvetica", "bold")
      doc.text(`Your PHQ-9 Score: ${totalScore}/27`, 20, 50)

      doc.setFontSize(10)
      doc.setTextColor(100, 100, 100)
      doc.setFont("helvetica", "italic")
      doc.text("Formula: Sum of all question scores (0-3 points each)", 20, 58)

      // Add interpretation
      doc.setFontSize(14)
      doc.setTextColor(33, 33, 33)
      doc.setFont("helvetica", "bold")
      doc.text(`Assessment Result: ${interpretation.level}`, 20, 70)

      // Add "What is your mood like" section
      doc.setFontSize(14)
      doc.setTextColor(33, 33, 33)
      doc.setFont("helvetica", "bold")
      doc.text("What is your mood like?", 20, 85)

      doc.setFontSize(12)
      doc.setTextColor(60, 60, 60)
      doc.setFont("helvetica", "normal")
      doc.text(interpretation.description, 20, 95)

      // Add motivational message
      doc.setFontSize(14)
      doc.setTextColor(33, 33, 33)
      doc.setFont("helvetica", "bold")
      doc.text("Your Motivation", 20, 115)

      doc.setFontSize(12)
      doc.setTextColor(60, 60, 60)
      doc.setFont("helvetica", "italic")
      const splitMotivation = doc.splitTextToSize(motivationalMessage, 170)
      doc.text(splitMotivation, 20, 125)

      // Add Popya contact information
      doc.setFontSize(14)
      doc.setTextColor(33, 33, 33)
      doc.setFont("helvetica", "bold")
      doc.text("Popya Assistance Foundation Contact Information:", 20, 150)

      doc.setFontSize(12)
      doc.setTextColor(60, 60, 60)
      doc.setFont("helvetica", "normal")
      doc.text("Phone: +264 81 457 4899", 20, 165)
      doc.text("Email: info@popya.org", 20, 175)
      doc.text("Website: www.popya.org", 20, 185)
      doc.text("Physical Address: Erf 1298, Omuve Street, Oshakati, Namibia", 20, 195)

      // Add footer
      doc.setFontSize(8)
      doc.setTextColor(150, 150, 150)
      doc.text(
        "Note: This assessment is not a clinical diagnosis. Please consult with a healthcare professional for proper evaluation.",
        105,
        285,
        { align: "center" },
      )
      doc.text("© Popya Mental Health Support - Confidential", 105, 290, { align: "center" })

      // Save PDF
      doc.save("Popya-Depression-Assessment.pdf")
    } catch (error) {
      console.error("Error generating PDF:", error)
    } finally {
      setIsGenerating(false)
    }
  }

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <div className="sticky top-[56px] bg-white z-30 border-b px-4 py-2 flex items-center">
        <Link href="/" className="p-1 rounded-full hover:bg-gray-100">
          <ArrowLeft size={20} className="text-gray-600" />
        </Link>
        <h1 className="ml-3 text-lg font-semibold">Depression Assessment</h1>
      </div>

      <div className="p-4">
        {isLoading ? (
          <div className="flex flex-col items-center justify-center h-[60vh]">
            <div className="w-16 h-16 border-4 border-[#6C63FF] border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 text-gray-600">Loading assessment...</p>
          </div>
        ) : (
          <>
            {currentStep === -1 ? (
              <AnimatedContainer
                animation="fade"
                className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 mb-4"
              >
                <div className="flex items-center justify-center mb-4 text-amber-500">
                  <AlertTriangle size={40} />
                </div>
                <h2 className="text-xl font-bold text-center mb-4">Important Disclaimer</h2>
                <div className="space-y-4 text-gray-700">
                  <p>
                    This depression assessment is based on the PHQ-9 questionnaire, a screening tool used to assess the
                    severity of depression symptoms.
                  </p>
                  <p className="font-medium text-amber-700">
                    This assessment does NOT replace professional medical advice, diagnosis, or treatment.
                  </p>
                  <p>
                    The results are intended for informational purposes only and should not be used for self-diagnosis
                    or as a substitute for consultation with a qualified healthcare provider.
                  </p>
                  <p>
                    If you are experiencing thoughts of harming yourself or others, please contact emergency services
                    immediately or call the Popya Assistance Foundation at +264 81 457 4899.
                  </p>
                </div>

                <div className="mt-6 flex items-center">
                  <input
                    type="checkbox"
                    id="disclaimer-agreement"
                    checked={agreedToDisclaimer}
                    onChange={() => setAgreedToDisclaimer(!agreedToDisclaimer)}
                    className="w-5 h-5 rounded border-gray-300 text-[#6C63FF] focus:ring-[#6C63FF]"
                  />
                  <label htmlFor="disclaimer-agreement" className="ml-2 text-gray-700">
                    I understand that this is not a clinical diagnosis and agree to continue
                  </label>
                </div>

                <button
                  onClick={goToNextQuestion}
                  disabled={!agreedToDisclaimer}
                  className={`mt-6 w-full flex items-center justify-center px-4 py-3 rounded-lg text-white font-medium 
                    ${
                      agreedToDisclaimer
                        ? "bg-gradient-to-r from-[#6C63FF] to-[#8B5CF6]"
                        : "bg-gray-300 cursor-not-allowed"
                    }`}
                >
                  Continue to Assessment
                </button>
              </AnimatedContainer>
            ) : !isCompleted ? (
              <>
                {/* Progress Bar */}
                <AnimatedContainer className="mb-4">
                  <div className="h-1.5 w-full bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-[#6C63FF] to-[#8B5CF6]"
                      style={{ width: `${((currentStep + 1) / questions.length) * 100}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1 text-right">
                    Question {currentStep + 1} of {questions.length}
                  </p>
                </AnimatedContainer>

                {/* Question */}
                <AnimatedContainer
                  key={currentStep}
                  animation="fade"
                  className="bg-white rounded-xl shadow-sm p-4 border border-gray-100 mb-4"
                >
                  <h2 className="text-base font-medium text-gray-800 mb-1">
                    Over the last 2 weeks, how often have you been bothered by the following problem?
                  </h2>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">{questions[currentStep]}</h3>

                  <div className="space-y-3">
                    {options.map((option) => (
                      <motion.button
                        key={option.value}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.99 }}
                        onClick={() => handleOptionSelect(currentStep, option.value)}
                        className={`w-full text-left p-3 rounded-lg border flex items-center gap-3 ${
                          answers[currentStep] === option.value
                            ? "border-[#6C63FF] bg-[#6C63FF]/5"
                            : "border-gray-200 hover:border-gray-300"
                        }`}
                      >
                        <div
                          className={`w-5 h-5 rounded-full flex items-center justify-center border ${
                            answers[currentStep] === option.value ? "border-[#6C63FF] bg-[#6C63FF]" : "border-gray-300"
                          }`}
                        >
                          {answers[currentStep] === option.value && <div className="w-2 h-2 rounded-full bg-white" />}
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">{option.label}</p>
                          <p className="text-xs text-gray-500">{option.description}</p>
                        </div>
                      </motion.button>
                    ))}
                  </div>
                </AnimatedContainer>

                {/* Navigation Buttons */}
                <AnimatedContainer className="flex justify-between">
                  <button
                    onClick={goToPreviousQuestion}
                    disabled={currentStep === 0}
                    className={`flex items-center px-3 py-2 rounded-lg ${
                      currentStep === 0 ? "text-gray-400 cursor-not-allowed" : "text-gray-700 hover:bg-gray-100"
                    }`}
                  >
                    <ArrowLeft size={18} className="mr-1" />
                    Previous
                  </button>

                  <button
                    onClick={goToNextQuestion}
                    disabled={answers[currentStep] < 0}
                    className={`flex items-center px-4 py-2 rounded-lg text-white font-medium 
                      ${answers[currentStep] >= 0 ? "bg-gradient-to-r from-[#6C63FF] to-[#8B5CF6]" : "bg-gray-300"}`}
                  >
                    {currentStep < questions.length - 1 ? (
                      <>
                        Next
                        <ArrowRight size={18} className="ml-1" />
                      </>
                    ) : (
                      "Complete"
                    )}
                  </button>
                </AnimatedContainer>
              </>
            ) : (
              <div ref={resultRef}>
                {/* Results */}
                <AnimatedContainer
                  animation="slide"
                  className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 mb-4"
                >
                  <div className="text-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Your Assessment Results</h2>
                    <p className="text-gray-600 mt-1">Based on your PHQ-9 responses</p>
                  </div>

                  <div className="flex justify-center mb-6">
                    <div
                      className="w-32 h-32 rounded-full flex items-center justify-center"
                      style={{ backgroundColor: `${interpretation.color}20` }}
                    >
                      <div
                        className="w-24 h-24 rounded-full flex items-center justify-center"
                        style={{ backgroundColor: `${interpretation.color}30` }}
                      >
                        <div
                          className="w-16 h-16 rounded-full flex items-center justify-center"
                          style={{ backgroundColor: interpretation.color }}
                        >
                          <span className="text-2xl font-bold text-white">{totalScore}</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="text-center mb-6">
                    <h3 className="text-xl font-semibold" style={{ color: interpretation.color }}>
                      {interpretation.level}
                    </h3>
                    <p className="text-gray-700 mt-2">{interpretation.description}</p>
                  </div>

                  <div className="bg-gray-50 p-4 rounded-lg mb-6">
                    <h4 className="font-medium text-gray-800 mb-2">Your Motivation</h4>
                    <p className="text-gray-700 italic">{motivationalMessage}</p>
                  </div>

                  <div className="space-y-3">
                    <button
                      onClick={generatePDF}
                      disabled={isGenerating}
                      className="w-full flex items-center justify-center gap-2 p-3 rounded-lg bg-gradient-to-r from-[#6C63FF] to-[#8B5CF6] text-white font-medium"
                    >
                      {isGenerating ? (
                        <>
                          <Loader2 size={18} className="animate-spin" />
                          Generating PDF...
                        </>
                      ) : (
                        <>
                          <Download size={18} />
                          Download PDF Report
                        </>
                      )}
                    </button>

                    <Link href="/experts">
                      <button className="w-full flex items-center justify-center gap-2 p-3 rounded-lg border border-[#6C63FF] text-[#6C63FF] font-medium">
                        <FileText size={18} />
                        Connect With an Expert
                      </button>
                    </Link>
                  </div>
                </AnimatedContainer>

                <AnimatedContainer
                  animation="slide"
                  delay={0.2}
                  className="bg-white rounded-xl shadow-sm p-4 border border-gray-100"
                >
                  <div className="flex items-center">
                    <div className="w-10 h-10 rounded-full bg-[#6C63FF]/10 flex items-center justify-center flex-shrink-0">
                      <FileText size={20} className="text-[#6C63FF]" />
                    </div>
                    <div className="ml-3">
                      <h4 className="font-medium text-gray-800">Need Additional Support?</h4>
                      <p className="text-sm text-gray-600">
                        Remember that this assessment is not a clinical diagnosis. If you're struggling, please reach
                        out for help.
                      </p>
                    </div>
                  </div>
                </AnimatedContainer>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
