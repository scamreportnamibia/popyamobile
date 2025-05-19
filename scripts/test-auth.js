#!/usr/bin/env node

/**
 * Popya Mobile App Authentication Test Script
 *
 * This script tests the authentication system by:
 * 1. Registering a test user
 * 2. Logging in with the test user
 * 3. Accessing a protected route
 * 4. Changing the password
 * 5. Logging out
 */

const fetch = require("node-fetch")
const readline = require("readline")

// Create readline interface
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
})

// Configuration
let baseUrl = "http://localhost:3000"
let token = null

// Ask for base URL
rl.question("Enter the base URL (default: http://localhost:3000): ", (answer) => {
  if (answer) {
    baseUrl = answer
  }

  console.log(`Using base URL: ${baseUrl}`)
  runTests()
})

// Test functions
async function registerUser() {
  console.log("\n🔐 Testing user registration...")

  const testUser = {
    name: "Test User",
    email: `test-${Date.now()}@example.com`,
    password: "TestPassword123!",
    phone: "+1234567890",
  }

  console.log(`Creating test user: ${testUser.email}`)

  try {
    const response = await fetch(`${baseUrl}/api/auth/register`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(testUser),
    })

    const data = await response.json()

    if (response.ok) {
      console.log("✅ Registration successful")
      console.log("User:", data.user)
      token = data.token
      return testUser
    } else {
      console.error("❌ Registration failed:", data.error)
      return null
    }
  } catch (err) {
    console.error("❌ Registration request failed:", err.message)
    return null
  }
}

async function loginUser(email, password) {
  console.log("\n🔑 Testing user login...")

  try {
    const response = await fetch(`${baseUrl}/api/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ email, password }),
    })

    const data = await response.json()

    if (response.ok) {
      console.log("✅ Login successful")
      console.log("User:", data.user)
      token = data.token
      return true
    } else {
      console.error("❌ Login failed:", data.error)
      return false
    }
  } catch (err) {
    console.error("❌ Login request failed:", err.message)
    return false
  }
}

async function accessProtectedRoute() {
  console.log("\n🔒 Testing protected route access...")

  try {
    const response = await fetch(`${baseUrl}/api/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    const data = await response.json()

    if (response.ok) {
      console.log("✅ Protected route access successful")
      console.log("User:", data.user)
      return true
    } else {
      console.error("❌ Protected route access failed:", data.error)
      return false
    }
  } catch (err) {
    console.error("❌ Protected route request failed:", err.message)
    return false
  }
}

async function changePassword(currentPassword, newPassword) {
  console.log("\n🔄 Testing password change...")

  try {
    const response = await fetch(`${baseUrl}/api/auth/change-password`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ currentPassword, newPassword }),
    })

    const data = await response.json()

    if (response.ok) {
      console.log("✅ Password change successful")
      return true
    } else {
      console.error("❌ Password change failed:", data.error)
      return false
    }
  } catch (err) {
    console.error("❌ Password change request failed:", err.message)
    return false
  }
}

async function logout() {
  console.log("\n🚪 Testing logout...")

  try {
    const response = await fetch(`${baseUrl}/api/auth/logout`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })

    const data = await response.json()

    if (response.ok) {
      console.log("✅ Logout successful")
      token = null
      return true
    } else {
      console.error("❌ Logout failed:", data.error)
      return false
    }
  } catch (err) {
    console.error("❌ Logout request failed:", err.message)
    return false
  }
}

// Run all tests
async function runTests() {
  try {
    // Register user
    const testUser = await registerUser()
    if (!testUser) {
      console.error("❌ Tests aborted due to registration failure")
      rl.close()
      return
    }

    // Login
    const loginSuccess = await loginUser(testUser.email, testUser.password)
    if (!loginSuccess) {
      console.error("❌ Tests aborted due to login failure")
      rl.close()
      return
    }

    // Access protected route
    const accessSuccess = await accessProtectedRoute()
    if (!accessSuccess) {
      console.error("❌ Tests aborted due to protected route access failure")
      rl.close()
      return
    }

    // Change password
    const newPassword = "NewTestPassword123!"
    const passwordChangeSuccess = await changePassword(testUser.password, newPassword)
    if (!passwordChangeSuccess) {
      console.error("❌ Tests aborted due to password change failure")
      rl.close()
      return
    }

    // Login with new password
    const newLoginSuccess = await loginUser(testUser.email, newPassword)
    if (!newLoginSuccess) {
      console.error("❌ Tests aborted due to login with new password failure")
      rl.close()
      return
    }

    // Logout
    const logoutSuccess = await logout()
    if (!logoutSuccess) {
      console.error("❌ Tests aborted due to logout failure")
      rl.close()
      return
    }

    console.log("\n🎉 All authentication tests passed successfully!")
  } catch (err) {
    console.error("❌ Tests failed with error:", err.message)
  } finally {
    rl.close()
  }
}
