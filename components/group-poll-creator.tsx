"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Plus, X, BarChart } from "lucide-react"
import { Progress } from "@/components/ui/progress"
import { useToast } from "@/hooks/use-toast"

interface GroupPollCreatorProps {
  groupId: string
  groupName: string
  onPollCreated?: () => void
}

export default function GroupPollCreator({ groupId, groupName, onPollCreated }: GroupPollCreatorProps) {
  const { toast } = useToast()
  const [isCreating, setIsCreating] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const [pollQuestion, setPollQuestion] = useState("")
  const [pollOptions, setPollOptions] = useState(["", ""])
  const [expiresIn, setExpiresIn] = useState("7")
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Sample poll results for demonstration
  const sampleResults = {
    totalVotes: 24,
    options: [
      { id: "opt1", text: "Option 1", votes: 10 },
      { id: "opt2", text: "Option 2", votes: 8 },
      { id: "opt3", text: "Option 3", votes: 6 },
    ],
  }

  const addOption = () => {
    setPollOptions([...pollOptions, ""])
  }

  const removeOption = (index: number) => {
    if (pollOptions.length <= 2) return
    const updatedOptions = [...pollOptions]
    updatedOptions.splice(index, 1)
    setPollOptions(updatedOptions)
  }

  const updateOption = (index: number, value: string) => {
    const updatedOptions = [...pollOptions]
    updatedOptions[index] = value
    setPollOptions(updatedOptions)
  }

  const handleCreatePoll = () => {
    setIsSubmitting(true)

    // Validate inputs
    if (!pollQuestion.trim()) {
      toast({
        title: "Error",
        description: "Please enter a question for the poll.",
        variant: "destructive",
      })
      setIsSubmitting(false)
      return
    }

    if (pollOptions.some((option) => !option.trim())) {
      toast({
        title: "Error",
        description: "Please fill in all poll options.",
        variant: "destructive",
      })
      setIsSubmitting(false)
      return
    }

    // In a real app, this would send data to your API
    console.log("Creating poll:", {
      question: pollQuestion,
      options: pollOptions,
      groupId,
      expiresIn,
    })

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false)
      setIsCreating(false)
      setPollQuestion("")
      setPollOptions(["", ""])
      setExpiresIn("7")

      toast({
        title: "Poll created",
        description: "Your poll has been created successfully.",
      })

      if (onPollCreated) {
        onPollCreated()
      }
    }, 1000)
  }

  if (showResults) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Poll Results</CardTitle>
          <CardDescription>Current results for the active poll</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <h3 className="font-medium">What topics would you like to discuss in our next session?</h3>
            <p className="text-sm text-gray-500">{sampleResults.totalVotes} votes total</p>

            <div className="space-y-3 mt-4">
              {sampleResults.options.map((option) => {
                const percentage = Math.round((option.votes / sampleResults.totalVotes) * 100)
                return (
                  <div key={option.id} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span>{option.text}</span>
                      <span className="font-medium">
                        {percentage}% ({option.votes})
                      </span>
                    </div>
                    <Progress value={percentage} className="h-2" />
                  </div>
                )
              })}
            </div>

            <div className="flex justify-between mt-4">
              <Button variant="outline" size="sm" onClick={() => setShowResults(false)}>
                Back
              </Button>
              <Button size="sm" onClick={() => setIsCreating(true)}>
                Create New Poll
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (isCreating) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Create Poll</CardTitle>
          <CardDescription>Create a new poll for {groupName}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="poll-question">Question</Label>
              <Input
                id="poll-question"
                placeholder="Enter your question"
                value={pollQuestion}
                onChange={(e) => setPollQuestion(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label>Options</Label>
              {pollOptions.map((option, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input
                    placeholder={`Option ${index + 1}`}
                    value={option}
                    onChange={(e) => updateOption(index, e.target.value)}
                  />
                  {pollOptions.length > 2 && (
                    <Button size="sm" variant="ghost" onClick={() => removeOption(index)}>
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={addOption} className="mt-2">
                <Plus className="h-4 w-4 mr-2" />
                Add Option
              </Button>
            </div>

            <div className="space-y-2">
              <Label htmlFor="poll-expires">Poll Expires In</Label>
              <Select value={expiresIn} onValueChange={setExpiresIn}>
                <SelectTrigger id="poll-expires">
                  <SelectValue placeholder="Select expiry" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1 day</SelectItem>
                  <SelectItem value="3">3 days</SelectItem>
                  <SelectItem value="7">1 week</SelectItem>
                  <SelectItem value="14">2 weeks</SelectItem>
                  <SelectItem value="30">1 month</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex justify-between mt-4">
              <Button variant="outline" onClick={() => setIsCreating(false)}>
                Cancel
              </Button>
              <Button onClick={handleCreatePoll} disabled={isSubmitting}>
                {isSubmitting ? "Creating..." : "Create Poll"}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg">Group Polls</CardTitle>
        <CardDescription>Create and manage polls for this group</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex justify-between">
            <Button variant="outline" onClick={() => setShowResults(true)}>
              <BarChart className="h-4 w-4 mr-2" />
              View Active Poll
            </Button>
            <Button onClick={() => setIsCreating(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Create Poll
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
