"use client"

import type React from "react"

import { useState } from "react"
import { Calendar, Clock, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

type Expert = {
  id: string
  name: string
  avatar: string
  specialty: string
}

interface CallSchedulingModalProps {
  expert: Expert
  isOpen: boolean
  onClose: () => void
  onSchedule: (date: Date, time: string, notes: string) => void
}

export function CallSchedulingModal({ expert, isOpen, onClose, onSchedule }: CallSchedulingModalProps) {
  const [date, setDate] = useState<Date | null>(null)
  const [time, setTime] = useState("")
  const [notes, setNotes] = useState("")
  const [errors, setErrors] = useState<{ date?: string; time?: string }>({})

  // Generate available time slots (9 AM to 5 PM, 30-minute intervals)
  const generateTimeSlots = () => {
    const slots = []
    for (let hour = 9; hour <= 17; hour++) {
      for (const minute of [0, 30]) {
        const formattedHour = hour.toString().padStart(2, "0")
        const formattedMinute = minute.toString().padStart(2, "0")
        slots.push(`${formattedHour}:${formattedMinute}`)
      }
    }
    return slots
  }

  const timeSlots = generateTimeSlots()

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    // Validate inputs
    const newErrors: { date?: string; time?: string } = {}
    if (!date) newErrors.date = "Please select a date"
    if (!time) newErrors.time = "Please select a time"

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    onSchedule(date!, time, notes)
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-xl w-[90%] max-w-md max-h-[90vh] overflow-y-auto"
          >
            <div className="p-4 border-b flex justify-between items-center">
              <h2 className="text-lg font-semibold">Schedule a Call</h2>
              <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100">
                <X size={20} className="text-gray-600" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-4 space-y-4">
              <div>
                <p className="text-sm text-gray-600 mb-2">
                  Schedule a call with <span className="font-medium">{expert.name}</span>
                </p>
                <p className="text-sm text-gray-600 mb-4">{expert.specialty}</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Date</label>
                <div className="relative">
                  <input
                    type="date"
                    min={new Date().toISOString().split("T")[0]}
                    onChange={(e) => {
                      setDate(e.target.value ? new Date(e.target.value) : null)
                      setErrors({ ...errors, date: undefined })
                    }}
                    className="w-full p-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#6C63FF] focus:border-[#6C63FF]"
                  />
                  <Calendar size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                </div>
                {errors.date && <p className="mt-1 text-sm text-red-500">{errors.date}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Select Time</label>
                <div className="relative">
                  <select
                    value={time}
                    onChange={(e) => {
                      setTime(e.target.value)
                      setErrors({ ...errors, time: undefined })
                    }}
                    className="w-full p-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#6C63FF] focus:border-[#6C63FF] appearance-none"
                  >
                    <option value="">Select a time</option>
                    {timeSlots.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                  <Clock size={18} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
                </div>
                {errors.time && <p className="mt-1 text-sm text-red-500">{errors.time}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes (Optional)</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Add any notes or topics you'd like to discuss..."
                  className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-1 focus:ring-[#6C63FF] focus:border-[#6C63FF] min-h-[100px]"
                />
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="w-full py-2 bg-[#6C63FF] text-white rounded-lg font-medium hover:bg-[#5A52D5] transition-colors"
                >
                  Schedule Call
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
