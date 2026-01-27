// src/utils/localStorage.js

const WORKOUT_HISTORY_KEY = 'ergTimerWorkoutHistory';

/**
 * Retrieves the workout history from local storage.
 * @returns {Array<Object>} An array of workout history objects, or an empty array if none exists.
 */
export const getWorkoutHistory = () => {
  try {
    const history = localStorage.getItem(WORKOUT_HISTORY_KEY);
    return history ? JSON.parse(history) : [];
  } catch (error) {
    console.error("Error reading workout history from local storage:", error);
    return [];
  }
};

/**
 * Adds a new workout entry to the history in local storage.
 * @param {Object} workout - The workout object to add. Must contain at least `name` and `date`.
 */
export const addWorkoutToHistory = (workout) => {
  try {
    const history = getWorkoutHistory();
    // Prepend new workout to keep most recent at the top
    const newHistory = [workout, ...history];
    localStorage.setItem(WORKOUT_HISTORY_KEY, JSON.stringify(newHistory));
  } catch (error) {
    console.error("Error saving workout history to local storage:", error);
  }
};
