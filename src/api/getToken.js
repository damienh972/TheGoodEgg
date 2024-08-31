export async function getToken() {
  try {
    const response = await fetch('http://localhost:3000/auth/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }

    const data = await response.json()
    return data.access_token
  } catch (error) {
    console.error('Error fetching token:', error)
    throw error
  }
}
