// Database seeding script for Supabase
const { createClient } = require("@supabase/supabase-js")

// Get Supabase credentials from environment variables
const supabaseUrl = process.env.SUPABASE_URL
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!supabaseUrl || !supabaseServiceKey) {
  console.error("Missing Supabase environment variables")
  process.exit(1)
}

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseServiceKey)

async function seed() {
  console.log("Seeding database with Supabase...")

  try {
    // Clear existing data
    const tables = [
      "notifications",
      "mental_health_resources",
      "advertisements",
      "reports",
      "call_transcripts",
      "call_sessions",
      "chat_messages",
      "event_attendees",
      "events",
      "group_members",
      "support_groups",
      "diary_entries",
      "mood_entries",
      "expert_expertise_areas",
      "expert_profiles",
      "user_profiles",
      "users",
    ]

    for (const table of tables) {
      const { error } = await supabase.from(table).delete().neq("id", 0)
      if (error && error.code !== "PGRST116") {
        console.error(`Error clearing table ${table}:`, error)
      }
    }

    // Insert users
    const { data: users, error: usersError } = await supabase
      .from("users")
      .insert([
        {
          name: "Super Admin",
          email: "admin@popya.com",
          password_hash: "$2a$10$XDCXMOYlrqpxL4KlmQW3Z.9Pq.VXBn1L9CJcJJQiWJMFrZDGmhKPe",
          role: "super_admin",
          user_code: "12345",
          is_verified: true,
        },
        {
          name: "Dr. Sarah Johnson",
          email: "expert@popya.com",
          password_hash: "$2a$10$XDCXMOYlrqpxL4KlmQW3Z.9Pq.VXBn1L9CJcJJQiWJMFrZDGmhKPe",
          role: "expert",
          user_code: "23456",
          is_verified: true,
        },
        {
          name: "John Doe",
          email: "user@popya.com",
          password_hash: "$2a$10$XDCXMOYlrqpxL4KlmQW3Z.9Pq.VXBn1L9CJcJJQiWJMFrZDGmhKPe",
          role: "user",
          user_code: "34567",
          is_verified: true,
        },
      ])
      .select()

    if (usersError) {
      throw usersError
    }

    const adminId = users[0].id
    const expertId = users[1].id
    const userId = users[2].id

    // Insert expert profile
    const { data: expertProfiles, error: expertProfileError } = await supabase
      .from("expert_profiles")
      .insert([
        {
          user_id: expertId,
          specialization: "Clinical Psychology",
          institution: "Windhoek Central Hospital",
          qualification: "Ph.D. in Clinical Psychology",
          years_of_experience: 8,
          license_number: "PSY12345",
          is_verified: true,
        },
      ])
      .select()

    if (expertProfileError) {
      throw expertProfileError
    }

    const expertProfileId = expertProfiles[0].id

    // Insert expert expertise areas
    const { error: expertiseError } = await supabase.from("expert_expertise_areas").insert([
      {
        expert_profile_id: expertProfileId,
        expertise_area: "Anxiety & Depression",
      },
      {
        expert_profile_id: expertProfileId,
        expertise_area: "Trauma Recovery",
      },
    ])

    if (expertiseError) {
      throw expertiseError
    }

    // Insert user profiles
    const { error: userProfilesError } = await supabase.from("user_profiles").insert([
      {
        user_id: adminId,
        notifications_enabled: true,
        dark_mode_enabled: false,
      },
      {
        user_id: expertId,
        notifications_enabled: true,
        dark_mode_enabled: false,
      },
      {
        user_id: userId,
        notifications_enabled: true,
        dark_mode_enabled: false,
      },
    ])

    if (userProfilesError) {
      throw userProfilesError
    }

    // Insert mood entries for the user
    const moodEntries = [
      { emoji: "😊", value: 5 },
      { emoji: "😊", value: 5 },
      { emoji: "😐", value: 3 },
      { emoji: "😔", value: 2 },
      { emoji: "😊", value: 5 },
      { emoji: "😌", value: 4 },
      { emoji: "😊", value: 5 },
    ]

    for (let i = 0; i < moodEntries.length; i++) {
      const date = new Date()
      date.setDate(date.getDate() - (moodEntries.length - i - 1))

      const { error: moodError } = await supabase.from("mood_entries").insert([
        {
          user_id: userId,
          mood_value: moodEntries[i].value,
          mood_emoji: moodEntries[i].emoji,
          created_at: date.toISOString(),
        },
      ])

      if (moodError) {
        throw moodError
      }
    }

    // Insert support groups
    const { error: groupsError } = await supabase.from("support_groups").insert([
      {
        name: "Anxiety Support Group",
        description: "A safe space to discuss anxiety and coping strategies",
        category: "Anxiety",
        created_by: expertId,
        meeting_frequency: "Weekly",
        image_url: "/placeholder.svg?height=200&width=200",
      },
      {
        name: "Youth Mental Health",
        description: "Support group for young adults dealing with mental health challenges",
        category: "Youth",
        created_by: expertId,
        meeting_frequency: "Bi-weekly",
        image_url: "/placeholder.svg?height=200&width=200",
      },
      {
        name: "Women's Mental Health",
        description: "A group focused on women's mental health issues",
        category: "Women",
        created_by: expertId,
        meeting_frequency: "Weekly",
        image_url: "/placeholder.svg?height=200&width=200",
      },
    ])

    if (groupsError) {
      throw groupsError
    }

    // Insert events
    // await client.query(
    //   `
    //   INSERT INTO events (title, description, start_time, end_time, is_virtual, is_free, max_attendees, created_by, image_url)
    //   VALUES
    //   ('Anxiety Management Workshop', 'Learn practical techniques to manage anxiety', '2025-06-15 14:00:00+00', '2025-06-15 16:00:00+00', true, true, 50, $1, '/placeholder.svg?height=200&width=200'),
    //   ('Stress Relief Techniques', 'Discover effective stress relief methods', '2025-06-22 15:00:00+00', '2025-06-22 16:30:00+00', true, true, 30, $1, '/placeholder.svg?height=200&width=200'),
    //   ('Mental Health Awareness Day', 'Join us for a day of mental health awareness activities', '2025-07-10 10:00:00+00', '2025-07-10 17:00:00+00', false, true, 100, $1, '/placeholder.svg?height=200&width=200')
    // `,
    //   [expertId],
    // )

    // Insert mental health resources
    // await client.query(
    //   `
    //   INSERT INTO mental_health_resources (title, description, content, category, type, created_by)
    //   VALUES
    //   ('Mindfulness Meditation', 'A simple 5-minute mindfulness practice to reduce anxiety and stress', 'Find a quiet place to sit comfortably. Close your eyes and focus on your breath. Notice the sensation of breathing in and out. When your mind wanders, gently bring your attention back to your breath. Continue for 5 minutes.', 'anxiety', 'exercise', $1),
    //   ('Grounding Technique', 'A 5-4-3-2-1 grounding exercise for managing panic and anxiety', 'Name 5 things you can see, 4 things you can touch, 3 things you can hear, 2 things you can smell, and 1 thing you can taste. This helps bring you back to the present moment.', 'anxiety', 'exercise', $1),
    //   ('Sleep Hygiene Tips', 'Practical tips for improving sleep quality and mental health', 'Maintain a regular sleep schedule. Avoid screens before bed. Create a comfortable sleep environment. Limit caffeine and alcohol. Practice relaxation techniques before bedtime.', 'sleep', 'article', $1)
    // `,
    //   [expertId],
    // )

    // Insert sample reports for admin dashboard
    // await client.query(
    //   `
    //   INSERT INTO reports (reporter_id, problem_category, description, location_region, location_town, status, risk_level, assigned_to)
    //   VALUES
    //   ($1, 'Gender-Based Violence', 'Experiencing harassment and threats from an ex-partner', 'Khomas', 'Windhoek', 'new', 'high', null),
    //   ($1, 'Depression', 'Feeling increasingly hopeless and isolated. Having trouble sleeping and eating.', 'Erongo', 'Swakopmund', 'inProgress', 'medium', $2),
    //   ($1, 'Anxiety', 'Experiencing panic attacks at work and having trouble functioning day-to-day.', 'Oshana', 'Oshakati', 'resolved', 'low', $2)
    // `,
    //   [userId, expertId],
    // )

    // Insert sample advertisements
    // await client.query(
    //   `
    //   INSERT INTO advertisements (title, image_url, start_date, end_date, status, created_by)
    //   VALUES
    //   ('Mental Health Awareness Month', '/placeholder.svg?height=200&width=400', '2025-05-01', '2025-08-01', 'active', $1),
    //   ('Therapy Session Discount', '/placeholder.svg?height=200&width=400', '2025-06-15', '2025-09-15', 'scheduled', $1)
    // `,
    //   [adminId],
    // )

    // Insert sample notifications for the user
    // await client.query(
    //   `
    //   INSERT INTO notifications (user_id, title, body, type, is_read)
    //   VALUES
    //   ($1, 'Welcome to Popya', 'Thank you for joining our mental health community!', 'system', false),
    //   ($1, 'Daily Journal Reminder', 'Take a moment to record your thoughts and feelings in your journal.', 'reminder', false),
    //   ($1, 'New Event: Anxiety Management Workshop', 'A new event has been added that might interest you.', 'system', false)
    // `,
    //   [userId],
    // )

    console.log("Database seeded successfully!")
  } catch (error) {
    console.error("Seeding failed:", error)
    throw error
  }
}

// Run the seeding
seed().catch((err) => {
  console.error("Unhandled error:", err)
  process.exit(1)
})
