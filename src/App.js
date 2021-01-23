import React, { useState, useEffect, useRef } from 'react'
import {
  getCurrentDate,
  formatDate,
  formatTime,
  formatDayLength,
  addDays,
  getCurrentGeoPosition,
  composeChart
} from './utils'
import { getSunsetSunriseData } from './api'
import './App.css'

const App = () => {
  const [date, setDate] = useState(getCurrentDate())
  const [latitude, setLatitude] = useState(null)
  const [longitude, setLongitude] = useState(null)

  const [sunset, setSunset] = useState(null)
  const [sunrise, setSunrise] = useState(null)
  const [dayLength, setDayLength] = useState(null)
  const [twilightBegin, setTwilightBegin] = useState(null)
  const [twilightEnd, setTwilightEnd] = useState(null)
  const [error, setError] = useState(null)

  const chartOverlay = useRef(null)

  const subtractWeek = () => {
    setDate(prevDate => addDays(prevDate , -7))
  }

  const subtractDay = () => {
    setDate(prevDate => addDays(prevDate , -1))
  }

  const addDay = () => {
    setDate(prevDate => addDays(prevDate , 1))
  }

  const addWeek = async () => {
    setDate(prevDate => addDays(prevDate, 7))
  }

  const animateChart = () => {
    if (!chartOverlay.current) {
      return
    }

    chartOverlay.current.style.opacity = 1
    setTimeout(() => {
      chartOverlay.current.style.opacity = 0
    }, 500)
  }

  useEffect(() => {
    getCurrentGeoPosition().then(coords => {
      setLatitude(coords.latitude)
      setLongitude(coords.longitude)
    })
  }, [])

  useEffect(() => {
    if (latitude == null || longitude == null) {
      return
    }

    setError(null)

    const params = {
      date: formatDate(date),
      latitude,
      longitude
    }

    getSunsetSunriseData(params).then(data => {
      const { results, status } = data

      if (status !== 'OK') {
        setError(status)

        return
      }

      animateChart()

      setSunrise(results.sunrise)
      setSunset(results.sunset)
      setDayLength(results.day_length)
      setTwilightBegin(results.civil_twilight_begin)
      setTwilightEnd(results.civil_twilight_end)
    })
  }, [date, latitude, longitude])

  return (
    <div className="app">
      <main className="main">
        <h1 className="date">{formatDate(date)}</h1>

        <span className="sunInfo"><span className="label">Sunrise: </span>{formatTime(sunrise)}</span>
        <span className="sunInfo"><span className="label">Sunset: </span>{formatTime(sunset)}</span>
        <span className="sunInfo"><span className="label">Length: </span>{formatDayLength(dayLength)}</span>

        <div>
          <button className="button" onClick={subtractWeek}>- 7 days</button>
          <button className="button" onClick={subtractDay}>- 1 day</button>
          <button className="button" onClick={addDay}>+ 1 day</button>
          <button className="button" onClick={addWeek}>+ 7 days</button>
        </div>

        <div
          className="chart"
          style={composeChart({ twilightBegin, sunrise, sunset, twilightEnd })}
        >
          <div
            className="chartOverlay"
            ref={chartOverlay}
          />
        </div>

        {error && <span className="error">Error: {error}</span>}
      </main>
    </div>
  )
}

export default App
