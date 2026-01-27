import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Typography, Box, Paper, Button } from '@mui/material';
import { interpolateRgb, interpolateLab } from 'd3-interpolate'; // For color interpolation
import { addWorkoutToHistory } from '../utils/localStorage'; // Import addWorkoutToHistory

// Helper to format seconds into HH:MM:SS
const formatTime = (totalSeconds) => {
  if (totalSeconds < 0) totalSeconds = 0; // Ensure no negative display
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return [hours, minutes, seconds].map(v => v < 10 ? "0" + v : v).join(":");
};

// --- Workout Logic Helpers ---
const processWorkout = (workout) => {
  const intervals = [];
  if (!workout) return { totalEffectiveIntervals: 0, intervals: [] };

  switch (workout.type) {
    case 'single':
      intervals.push({ type: 'work', duration: workout.duration });
      break;
    case 'constant':
      if (workout.intervals.warmup) {
        intervals.push({ type: 'warmup', duration: 10 * 60 }); // Default 10 min warmup
      }
      for (let i = 0; i < workout.intervals.repetitions; i++) {
        intervals.push({ type: 'work', duration: workout.intervals.workDuration });
        if (workout.intervals.restDuration > 0 && i < workout.intervals.repetitions - 1) {
          intervals.push({ type: 'rest', duration: workout.intervals.restDuration });
        }
      }
      if (workout.intervals.cooldown) {
        intervals.push({ type: 'cooldown', duration: 5 * 60 }); // Default 5 min cooldown
      }
      break;
    case 'custom':
      workout.intervals.forEach((interval, index) => {
        intervals.push({ type: 'work', duration: interval.workDuration });
        if (interval.restDuration > 0 && index < workout.intervals.length - 1) {
          intervals.push({ type: 'rest', duration: interval.restDuration });
        }
      });
      break;
    default:
      break;
  }
  return { totalEffectiveIntervals: intervals.length, intervals };
};

function WorkoutScreen() {
  const location = useLocation();
  const navigate = useNavigate();
  const { workout } = location.state || {};

  // Timer State
  const [isRunning, setIsRunning] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const [remainingTime, setRemainingTime] = useState(0); // Current interval's remaining time
  const [workoutPhase, setWorkoutPhase] = useState('idle'); // 'idle', 'running', 'paused', 'finished'

  // Interval Tracking State
  const [currentIntervalIndex, setCurrentIntervalIndex] = useState(0); // Index in processed intervals array
  const [processedIntervals, setProcessedIntervals] = useState([]);
  const [totalEffectiveIntervals, setTotalEffectiveIntervals] = useState(0);
  const [currentIntervalInitialDuration, setCurrentIntervalInitialDuration] = useState(0); // Initial duration for draining effect

  // Ref for setInterval ID
  const timerRef = useRef(null);

  // --- Initialize Workout ---
  useEffect(() => {
    if (!workout) {
      console.warn("No workout found, redirecting to new workout page.");
      navigate('/new-workout'); // Redirect if no workout data
      return;
    }
    const { totalEffectiveIntervals, intervals } = processWorkout(workout);
    setProcessedIntervals(intervals);
    setTotalEffectiveIntervals(totalEffectiveIntervals);

    if (intervals.length > 0) {
      setRemainingTime(intervals[0].duration);
      setCurrentIntervalInitialDuration(intervals[0].duration); // Set initial duration
      setWorkoutPhase('idle');
    } else {
      console.error("Workout has no intervals!");
      navigate('/new-workout');
    }

    // Clear any previous timers
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [workout, navigate]);

  // --- Timer Countdown Logic ---
  useEffect(() => {
    if (isRunning && !isPaused && remainingTime > 0) {
      timerRef.current = setInterval(() => {
        setRemainingTime((prevTime) => prevTime - 1);
      }, 1000);
    } else if (remainingTime === 0 && isRunning) {
      // Current interval finished
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      handleIntervalTransition();
    } else if (!isRunning || isPaused) {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    }
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [isRunning, isPaused, remainingTime]); // Add remainingTime to dependency array for accurate stop at 0

  // --- Interval Transition Logic ---
  const handleIntervalTransition = useCallback(() => {
    const nextIndex = currentIntervalIndex + 1;
    if (nextIndex < processedIntervals.length) {
      setCurrentIntervalIndex(nextIndex);
      setRemainingTime(processedIntervals[nextIndex].duration);
      setCurrentIntervalInitialDuration(processedIntervals[nextIndex].duration); // Update initial duration
      setIsRunning(true); // Automatically start next interval
    } else {
      // Workout Finished
      setIsRunning(false);
      setWorkoutPhase('finished');
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      // Add workout to history (Task 20)
      if (workout) {
        addWorkoutToHistory({
          name: workout.name,
          date: new Date().toISOString().slice(0, 10), // YYYY-MM-DD
        });
      }
    }
  }, [currentIntervalIndex, processedIntervals, workout]);

  // --- Control Functions ---
  const handleStartPause = () => {
    if (workoutPhase === 'idle') {
      setWorkoutPhase('running');
      setIsRunning(true);
      setIsPaused(false);
    } else if (workoutPhase === 'running') {
      setWorkoutPhase('paused');
      setIsRunning(false);
      setIsPaused(true);
    } else if (workoutPhase === 'paused') {
      setWorkoutPhase('running');
      setIsRunning(true);
      setIsPaused(false);
    } else if (workoutPhase === 'finished') {
      // Optionally reset or navigate away
      console.log("Workout already finished.");
    }
  };

  const handleStopWorkout = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setIsRunning(false);
    setIsPaused(false);
    setWorkoutPhase('idle');
    setCurrentIntervalIndex(0);
    if (processedIntervals.length > 0) {
      setRemainingTime(processedIntervals[0].duration);
      setCurrentIntervalInitialDuration(processedIntervals[0].duration); // Reset initial duration
    }
    // TODO: Confirm stop and potentially save partial workout (later consideration)
    navigate('/'); // Go back to home or new workout page
  };

  // Determine current interval type for display/styling
  const currentIntervalType = processedIntervals[currentIntervalIndex]?.type || 'work';

  // --- Draining Hourglass Effect Logic ---
  const progressPercentage = currentIntervalInitialDuration > 0
    ? ((currentIntervalInitialDuration - remainingTime) / currentIntervalInitialDuration) * 100
    : 0;

  // Color interpolation
  // Work: Navy Blue (#000080) to White (#FFFFFF)
  // Rest: Dark Green (#006400) to White (#FFFFFF)
  const interpolateBg = (startColor, endColor) => interpolateRgb(startColor, endColor)(progressPercentage / 100);
  const interpolateText = (startColor, endColor) => interpolateLab(startColor, endColor)(progressPercentage / 100);

  let bgColor = 'white';
  let textColor = 'darkgrey'; // Default for inactive or idle state

  if (workoutPhase === 'running' || workoutPhase === 'paused') {
    if (currentIntervalType === 'work' || currentIntervalType === 'warmup' || currentIntervalType === 'cooldown') {
      bgColor = interpolateBg('#000080', '#FFFFFF'); // Navy to White
      textColor = interpolateText('#FFFFFF', '#000080'); // White to Navy
    } else if (currentIntervalType === 'rest') {
      bgColor = interpolateBg('#006400', '#FFFFFF'); // Dark Green to White
      textColor = interpolateText('#FFFFFF', '#006400'); // White to Dark Green
    }
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4, textAlign: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {workout?.name || "No Workout Loaded"}
        </Typography>

        <Paper
          elevation={3}
          sx={{
            p: 4,
            mb: 4,
            transition: 'background-color 1s linear, color 1s linear', // Smooth transition
            bgcolor: bgColor,
            color: textColor,
          }}
        >
          <Typography variant="h5" gutterBottom>
            {workoutPhase === 'idle' ? 'Ready' : (workoutPhase === 'finished' ? 'Finished!' :
              currentIntervalType.charAt(0).toUpperCase() + currentIntervalType.slice(1) + ' Interval'
            )}
          </Typography>
          <Typography variant="h2" component="div" sx={{ fontWeight: 'bold' }}>
            {formatTime(remainingTime)}
          </Typography>
          {totalEffectiveIntervals > 1 && (
            <Typography variant="h6">
              Interval {currentIntervalIndex + 1} of {totalEffectiveIntervals}
            </Typography>
          )}
          {workoutPhase === 'paused' && (
            <Typography variant="h5" sx={{ mt: 2 }}>
              Paused
            </Typography>
          )}
        </Paper>

        <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mb: 4 }}>
          <Button
            variant="contained"
            color={isRunning && !isPaused ? "warning" : "primary"}
            size="large"
            onClick={handleStartPause}
            disabled={workoutPhase === 'finished'}
          >
            {isRunning && !isPaused ? 'Pause' : (workoutPhase === 'finished' ? 'Finished' : 'Start')}
          </Button>
          <Button
            variant="contained"
            color="error"
            size="large"
            onClick={handleStopWorkout}
            disabled={workoutPhase === 'idle' || workoutPhase === 'finished'}
          >
            Stop Workout
          </Button>
        </Box>

        <Paper elevation={1} sx={{ p: 2 }}>
          <Typography variant="h6">Technique Reminder:</Typography>
          <Typography variant="body1" color="text.secondary">
            (Reminders will appear here)
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
}

export default WorkoutScreen;