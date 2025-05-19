type Greeting = {
  text: string
  subtext: string
}

const morningGreetings: Greeting[] = [
  { text: "Good morning", subtext: "How are you feeling today?" },
  { text: "Rise and shine", subtext: "Today is a new opportunity" },
  { text: "Hello sunshine", subtext: "Hope you slept well" },
  { text: "Good day", subtext: "Remember you're not alone" },
  { text: "Morning", subtext: "Take a deep breath and smile" },
]

const afternoonGreetings: Greeting[] = [
  { text: "Good afternoon", subtext: "How's your day going?" },
  { text: "Hey there", subtext: "Hope your day is going well" },
  { text: "Afternoon", subtext: "Remember to take breaks" },
  { text: "Hi", subtext: "You're doing great today" },
  { text: "Hello", subtext: "Keep going, you're doing well" },
]

const eveningGreetings: Greeting[] = [
  { text: "Good evening", subtext: "How was your day?" },
  { text: "Evening", subtext: "Time to wind down" },
  { text: "Hey", subtext: "Hope you had a good day" },
  { text: "Hello", subtext: "Remember to relax tonight" },
  { text: "Hi there", subtext: "You made it through another day" },
]

export const getRandomGreeting = (username: string): Greeting => {
  const hour = new Date().getHours()
  let greetings: Greeting[]

  if (hour < 12) {
    greetings = morningGreetings
  } else if (hour < 18) {
    greetings = afternoonGreetings
  } else {
    greetings = eveningGreetings
  }

  const randomIndex = Math.floor(Math.random() * greetings.length)
  return {
    text: `${greetings[randomIndex].text}, ${username}`,
    subtext: greetings[randomIndex].subtext,
  }
}
