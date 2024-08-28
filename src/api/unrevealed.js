import { getToken } from './getToken'

const unrevealedUrl = 'https://thegoodegg.vercel.app/unrevealed'

export async function fetchUnrevealedIds() {
  const token = await getToken()

  try {
    const response = await fetch(unrevealedUrl, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    })

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }

    const data = await response.json()
    return data[0].tokenIds
  } catch (error) {
    console.error('Error fetching unrevealed IDs:', error)
    throw error
  }
}

export async function updateUnrevealedIds(tokenIdsToAdd, tokenIdsToRemove) {
  const token = await getToken()

  try {
    const response = await fetch(`${unrevealedUrl}/1`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ tokenIdsToAdd, tokenIdsToRemove })
    })

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }

    const data = await response.json()
    return data.tokenIds
  } catch (error) {
    console.error('Error fetching unrevealed IDs:', error)
    throw error
  }
}
