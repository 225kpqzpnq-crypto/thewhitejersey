import { useState, useEffect, useRef, useCallback } from 'react';

const formatTime = (seconds) => {
    const rounded = Math.ceil(seconds);
    const mins = Math.floor(rounded / 60).toString().padStart(2, '0');
    const secs = (rounded % 60).toString().padStart(2, '0');
    return `${mins}:${secs}`;
};

export const useTimer = (workout) => {
    const [isRunning, setIsRunning] = useState(false);
    const [currentIntervalType, setCurrentIntervalType] = useState('WORK');
    const [currentRepetition, setCurrentRepetition] = useState(1);
    const [timeRemaining, setTimeRemaining] = useState(workout ? workout.work : 0);
    const [totalTimeForInterval, setTotalTimeForInterval] = useState(workout ? workout.work : 0);

    const animationFrameId = useRef(null);
    const startTime = useRef(0);
    const pauseTime = useRef(0);
    const beepSound = useRef(new Audio('/sounds/beep.mp3')); // User needs to provide this file
    const bellSound = useRef(new Audio('/sounds/bell.mp3')); // User needs to provide this file
    const lastBeepTime = useRef(0);
    
    const animationLoop = useCallback((timestamp) => {
        if (!startTime.current) {
            startTime.current = timestamp;
        }
        
        const elapsed = (timestamp - startTime.current) / 1000;
        const remaining = totalTimeForInterval - elapsed;

        setTimeRemaining(remaining);

        const roundedRemaining = Math.ceil(remaining);

        // Play beep sound for final three seconds
        if (isRunning && roundedRemaining > 0 && roundedRemaining <= 3 && roundedRemaining !== lastBeepTime.current) {
            beepSound.current.play();
            lastBeepTime.current = roundedRemaining;
        }

        if (remaining < 0) {
            bellSound.current.play(); // Play bell sound at interval end
            // Interval finished
            if (currentIntervalType === 'WORK') {
                if (currentRepetition >= workout.repetitions) {
                    setIsRunning(false); // Workout complete
                    lastBeepTime.current = 0; // Reset for next workout
                    return;
                }
                setCurrentIntervalType('REST');
                setTotalTimeForInterval(workout.rest);
                setTimeRemaining(workout.rest);
            } else {
                setCurrentRepetition(prev => prev + 1);
                setCurrentIntervalType('WORK');
                setTotalTimeForInterval(workout.work);
                setTimeRemaining(workout.work);
            }
            startTime.current = timestamp; // Reset start time for new interval
            lastBeepTime.current = 0; // Reset for new interval countdown
        }

        if(isRunning) {
          animationFrameId.current = requestAnimationFrame(animationLoop);
        }
    }, [isRunning, currentIntervalType, currentRepetition, workout, totalTimeForInterval]);

    const toggle = () => {
        setIsRunning(prev => !prev);
    };

    const stop = () => {
        setIsRunning(false);
        setCurrentRepetition(1);
        setCurrentIntervalType('WORK');
        if(workout) {
            setTimeRemaining(workout.work);
            setTotalTimeForInterval(workout.work);
        }
    };
    
    useEffect(() => {
        if(isRunning) {
            startTime.current = performance.now() - (pauseTime.current > 0 ? (pauseTime.current - startTime.current) : 0);
            pauseTime.current = 0;
            animationFrameId.current = requestAnimationFrame(animationLoop);
        } else {
            if(animationFrameId.current) {
                cancelAnimationFrame(animationFrameId.current);
                animationFrameId.current = null;
                pauseTime.current = performance.now();
            }
        }
        
        return () => {
            if(animationFrameId.current) {
                cancelAnimationFrame(animationFrameId.current);
            }
        };
    }, [isRunning, animationLoop]);

    return {
        isRunning,
        currentIntervalType,
        currentRepetition,
        timeRemaining,
        formattedTime: formatTime(timeRemaining),
        totalTimeForInterval,
        toggle,
        stop,
    };
};
