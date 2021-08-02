import React, { useEffect, useState } from 'react'
import { ThemeProvider } from 'styled-components'
import { ErrorBoundary, Themes } from '@sainsburys-tech/bolt'
import AllComponents, { components, GetComponent } from '@sainsburys-tech/bolt-cms-components'
import './App.scss'

function App() {
  const [AppContent, setContent] = useState({
    isError: false,
    isLoaded: false,
    data: []
  })
  const fetchData = async (url) => {
    try {
      const result = await fetch(url)
      if (!result.ok) {
        throw new Error(`There has been an error with (${result.status})`)
      }
      const response = await result.json()
      const { data } = response
      return setContent({
          isError: false,
          isLoaded: true,
          data
        })

    } catch (err) {
      console.error(err)
      return setContent({
        ...AppContent,
        isError: true,
        isLoading: false
      })
    }
  }

  const displayComponents = ( areaComponents ) => {
    return areaComponents.map((item, index) => {
      return (<ErrorBoundary key={`example-component${item.type}-${index}`}>
        <GetComponent  {...{ ...item }} />
        </ErrorBoundary>)
    })

  }

  useEffect(() => {
    const exampleDataURL = 'https://cms-public-staging.eu-west-1.staging.deveng.systems/tu/content/features/all-the-components.json'
    fetchData(exampleDataURL)
  }, [])
  return (
    <ThemeProvider theme={ Themes.NectarTheme }>
      <div className='app-container bolt-nectar'>
        <AllComponents components={components}>
          <ErrorBoundary>
            <main className='container'>
                {AppContent.data.map((area) => {
                  return displayComponents(area?.attributes)
                })}
            </main>
          </ErrorBoundary>
        </AllComponents>
      </div>
    </ThemeProvider>
    )
  }

export default App;
