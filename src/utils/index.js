export const getCurrentDate = () =>  {
  return new Date()
}

const padZero = (value) => value.toString().padStart(2, '0')

export const formatDate = (dateObj) =>  {
  const mm = padZero(dateObj.getMonth() + 1)
  const dd = padZero(dateObj.getDate())
  const yyyy = dateObj.getFullYear()

  return `${mm}/${dd}/${yyyy}`
}

export const formatTime = (isoDate) =>  {
  if (isoDate == null) {
    return '—'
  }

  const dateObj = new Date(isoDate)
  const hh = padZero(dateObj.getHours())
  const mm = padZero(dateObj.getMinutes())

  return `${hh}:${mm}`
}

export const formatDayLength = (dayLength) =>  {
  if (dayLength == null) {
    return '—'
  }

  const totalMinutes = Math.floor(dayLength / 60)
  const hours = Math.floor(totalMinutes / 60)
  const minutes = totalMinutes - hours * 60

  const hh = padZero(hours)
  const mm = padZero(minutes)

  return `${hh}:${mm}`
}

export const addDays = (date, offset) =>  {
  const result = new Date(date)
  const newDays = result.getDate() + offset
  result.setDate(newDays)

  return result
}

export const getCurrentGeoPosition = async () => (
  new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      ({ coords }) => resolve(coords),
      reject,
      { enableHighAccuracy: true}
    )
  })
)

const getMinutes = (isoDate) =>  {
  if (isoDate == null) {
    return null
  }

  const dateObj = new Date(isoDate)
  const hours = dateObj.getHours()
  const minutes = dateObj.getMinutes()

  return hours * 60 + minutes
}

const dayChartWidth = 24 * 60 // minutes in day

const getDayMinutesPercent = (isoDate) =>  {
  if (isoDate == null) {
    return null
  }

  const minutes = getMinutes(isoDate)

  return minutes / dayChartWidth * 100
}

const nightColor = '#1C1248'
const dayColor = '#3DCDEC'

export const composeChart = ({ twilightBegin, sunrise, sunset, twilightEnd }) => {
  const twilightBeginPercent = getDayMinutesPercent(twilightBegin)
  const sunrisePercent = getDayMinutesPercent(sunrise)
  const sunsetPercent = getDayMinutesPercent(sunset)
  const twilightEndPercent = getDayMinutesPercent(twilightEnd)

  return { background: `linear-gradient(90deg, 
    ${nightColor} 0%, ${nightColor} ${twilightBeginPercent}%, 
    ${dayColor} ${sunrisePercent}%, ${dayColor} ${sunsetPercent}%, 
    ${nightColor} ${twilightEndPercent}%, ${nightColor} 100%)`
  }
}
