export function growthStatistics(users = [], music = [], days = 7, now = new Date()) {
  const valid = rows => rows.filter(row => row && typeof row === 'object' && !Array.isArray(row))
  const members = valid(users)
  const tracks = valid(music)
  const series = Array.from({ length: days }, (_, index) => {
    const start = new Date(now)
    start.setHours(0, 0, 0, 0)
    start.setDate(start.getDate() - days + index + 1)
    const end = new Date(start); end.setDate(end.getDate() + 1)
    const count = rows => rows.filter(row => {
      const time = Date.parse(row.createdAt)
      return time >= +start && time < +end && time <= +now
    }).length
    return { date: start.toLocaleDateString('es', { day: 'numeric', month: 'short' }), users: count(members), music: count(tracks) }
  })
  return {
    totalUsers: members.length, totalMusic: tracks.length,
    published: tracks.filter(row => row.status === 'published').length,
    drafts: tracks.filter(row => row.status === 'draft').length,
    newUsers: series.reduce((sum, day) => sum + day.users, 0),
    newMusic: series.reduce((sum, day) => sum + day.music, 0),
    missingDates: [...members, ...tracks].filter(row => !Number.isFinite(Date.parse(row.createdAt))).length,
    series,
  }
}
