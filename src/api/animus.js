import { getToken } from './getToken'

const animusUrl = 'https://thegoodegg.vercel.app/animus'

export async function fetchAnimus(maxPages) {
  const token = await getToken()

  let allAnimus = [];
  let currentPage = 1;

  try {
    while (currentPage <= maxPages) {
      const response = await fetch(`${animusUrl}?page=${currentPage}&limit=100`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();
      allAnimus = allAnimus.concat(result.data);

      if (currentPage >= result.totalPages) {
        break;
      }

      currentPage++;
    }

    return allAnimus;

  } catch (error) {
    console.error('Error fetching animus:', error);
    throw error;
  }
}

export async function createAnimus(animus) {
  const token = await getToken()

  try {
    const response = await fetch(`${animusUrl}/`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(animus)
    })

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`)
    }

    return response.json();
  } catch (error) {
    console.error('Error fetching burned IDs:', error)
    throw error
  }
}
