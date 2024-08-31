import { getToken } from './getToken'

const burnedUrl = 'https://thegoodegg.vercel.app/burned'

export async function fetchBurnedIds() {
  const token = await getToken()

  try {
    const response = await fetch(burnedUrl, {
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
    console.error('Error fetching burned IDs:', error)
    throw error
  }
}

export async function updateBurnedIds(tokenIdsToAdd, tokenIdsToRemove) {
  const token = await getToken()

  try {
    const response = await fetch(`${burnedUrl}/4`, {
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
    console.error('Error fetching burned IDs:', error)
    throw error
  }
}
