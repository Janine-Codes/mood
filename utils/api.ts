const createURL = (path: any) => {
  return window.location.origin + path
}

export const updateEntry = async (id: any, content: any) => {
  try {
    const res = await fetch(
      new Request(createURL(`/api/journal/${id}`), {
        method: 'PATCH',
        body: JSON.stringify({ content }),
      })
    )

    if (res.ok) {
      const data = await res.json()
      return data.data
    }
  } catch (error) {
    console.log('update entry error:', error)
  }
}

export const createNewEntry = async () => {
  try {
    const res = await fetch(
      new Request(createURL('/api/journal'), {
        method: 'POST',
      })
    )
    console.log('ghelpp kmr du hit?!', res)
    if (res.ok) {
      const data = await res.json()
      console.log({ data })
      return data.data
    } else {
      console.log('kill me')
    }
  } catch (error) {
    console.log('ERROR: ', error)
  }
}

export const askQuestion = async (question: string) => {
  const res = await fetch('/api/question', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ question }),
  })

  if (res.ok) {
    const data = await res.json()
    console.log('Svar från servern:', data)
    return data.data
  }

  console.error('Misslyckades med att hämta AI-svar:', res.status)
  return 'Kunde inte hämta svar från AI.'
}
