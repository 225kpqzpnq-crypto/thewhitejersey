import { useState, useEffect } from 'react';

const WORKOUTS_STORAGE_KEY = 'workouts';

export const useWorkouts = () => {
  const [workouts, setWorkouts] = useState([]);

      useEffect(() => {
        // Load workouts from local storage on initial render
        try {
          const storedWorkouts = localStorage.getItem(WORKOUTS_STORAGE_KEY);
          if (storedWorkouts) {
            const parsedWorkouts = JSON.parse(storedWorkouts);
            // Ensure that parsedWorkouts is an array before setting the state
            if (Array.isArray(parsedWorkouts)) {
              setWorkouts(parsedWorkouts);
            } else {
              console.error("Data in local storage is not an array. Resetting workouts.");
              setWorkouts([]);
              // Optionally, clear the malformed data from localStorage
              localStorage.removeItem(WORKOUTS_STORAGE_KEY);
            }
          } else {
            setWorkouts([]); // No data in storage, initialize as empty array
          }
        } catch (error) {
          console.error("Failed to parse workouts from local storage:", error);
          setWorkouts([]); // Reset to empty array on any parsing error
          // Optionally, clear the corrupted data from localStorage
          localStorage.removeItem(WORKOUTS_STORAGE_KEY);
        }
      }, []);
  const _saveWorkouts = (newWorkouts) => {
    try {
      localStorage.setItem(WORKOUTS_STORAGE_KEY, JSON.stringify(newWorkouts));
      setWorkouts(newWorkouts);
    } catch (error) {
      console.error("Failed to save workouts to local storage", error);
    }
  };

  const addWorkout = (workout) => {
    const newWorkouts = [...workouts, workout];
    _saveWorkouts(newWorkouts);
  };

  const deleteWorkout = (workoutId) => {
    const newWorkouts = workouts.filter((_, index) => index !== workoutId);
    _saveWorkouts(newWorkouts);
  };

  return { workouts, addWorkout, deleteWorkout };
};
