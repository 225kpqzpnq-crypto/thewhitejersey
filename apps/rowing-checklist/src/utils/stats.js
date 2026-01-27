/**
 * Statistics calculation utilities for rowing checklist app
 */

/**
 * Get ISO week number for a given date
 * ISO 8601 week starts on Monday
 */
export function getISOWeek(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 4 - (d.getDay() || 7));
  const yearStart = new Date(d.getFullYear(), 0, 1);
  return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
}

/**
 * Get the year for a given ISO week
 * Handles edge case where week 1 might be in previous year
 */
export function getISOWeekYear(date) {
  const d = new Date(date);
  d.setDate(d.getDate() + 4 - (d.getDay() || 7));
  return d.getFullYear();
}

/**
 * Get start and end dates for an ISO week
 */
export function getWeekDateRange(year, week) {
  const jan4 = new Date(year, 0, 4);
  const monday = new Date(jan4);
  monday.setDate(jan4.getDate() - (jan4.getDay() || 7) + 1 + (week - 1) * 7);

  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);

  return { start: monday, end: sunday };
}

/**
 * Calculate stats for a specific week
 */
export function calculateWeekStats(log, year, weekNumber) {
  const { start, end } = getWeekDateRange(year, weekNumber);

  const stats = {
    preRowingSessions: 0,
    postRowingSessions: 0,
    rowingSessions: 0,
    totalDistance: 0, // meters
    totalTime: 0, // seconds
  };

  if (!log || typeof log !== 'object') return stats;

  // Iterate through all dates in the log
  Object.keys(log).forEach(dateKey => {
    if (dateKey === 'version') return;

    const date = new Date(dateKey);
    if (date >= start && date <= end) {
      const dayData = log[dateKey];
      if (dayData?.sessions) {
        dayData.sessions.forEach(session => {
          const sessionType = session.sessionType || 'checklist';

          if (sessionType === 'checklist') {
            if (session.type === 'pre' || session.type === 'mvpPre') {
              stats.preRowingSessions++;
            } else if (session.type === 'post' || session.type === 'mvpPost') {
              stats.postRowingSessions++;
            }
          } else if (sessionType === 'rowing') {
            stats.rowingSessions++;
            stats.totalDistance += session.distance || 0;
            stats.totalTime += session.duration || 0;
          }
        });
      }
    }
  });

  return stats;
}

/**
 * Calculate stats for a specific month
 */
export function calculateMonthStats(log, year, month) {
  const stats = {
    preRowingSessions: 0,
    postRowingSessions: 0,
    rowingSessions: 0,
    totalDistance: 0, // meters
    totalTime: 0, // seconds
  };

  if (!log || typeof log !== 'object') return stats;

  // Iterate through all dates in the log
  Object.keys(log).forEach(dateKey => {
    if (dateKey === 'version') return;

    const date = new Date(dateKey);
    if (date.getFullYear() === year && date.getMonth() === month) {
      const dayData = log[dateKey];
      if (dayData?.sessions) {
        dayData.sessions.forEach(session => {
          const sessionType = session.sessionType || 'checklist';

          if (sessionType === 'checklist') {
            if (session.type === 'pre' || session.type === 'mvpPre') {
              stats.preRowingSessions++;
            } else if (session.type === 'post' || session.type === 'mvpPost') {
              stats.postRowingSessions++;
            }
          } else if (sessionType === 'rowing') {
            stats.rowingSessions++;
            stats.totalDistance += session.distance || 0;
            stats.totalTime += session.duration || 0;
          }
        });
      }
    }
  });

  return stats;
}

/**
 * Calculate all-time stats
 */
export function calculateAllTimeStats(log) {
  const stats = {
    preRowingSessions: 0,
    postRowingSessions: 0,
    rowingSessions: 0,
    totalDistance: 0, // meters
    totalTime: 0, // seconds
  };

  if (!log || typeof log !== 'object') return stats;

  // Iterate through all dates in the log
  Object.keys(log).forEach(dateKey => {
    if (dateKey === 'version') return;

    const dayData = log[dateKey];
    if (dayData?.sessions) {
      dayData.sessions.forEach(session => {
        const sessionType = session.sessionType || 'checklist';

        if (sessionType === 'checklist') {
          if (session.type === 'pre' || session.type === 'mvpPre') {
            stats.preRowingSessions++;
          } else if (session.type === 'post' || session.type === 'mvpPost') {
            stats.postRowingSessions++;
          }
        } else if (sessionType === 'rowing') {
          stats.rowingSessions++;
          stats.totalDistance += session.distance || 0;
          stats.totalTime += session.duration || 0;
        }
      });
    }
  });

  return stats;
}

/**
 * Format duration in seconds to human-readable string
 * Returns "Xh Ym" or "Xm Ys"
 */
export function formatDuration(seconds) {
  if (!seconds || seconds < 0) return "0s";

  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  } else if (minutes > 0) {
    return `${minutes}m ${secs}s`;
  } else {
    return `${secs}s`;
  }
}

/**
 * Format distance in meters to human-readable string
 * Returns "X.X km" or "XXX m"
 */
export function formatDistance(meters) {
  if (!meters || meters < 0) return "0 m";

  if (meters >= 1000) {
    const km = (meters / 1000).toFixed(1);
    return `${km} km`;
  } else {
    return `${meters} m`;
  }
}
