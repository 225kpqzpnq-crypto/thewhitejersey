import React from 'react';
import { useWorkouts } from '../hooks/useWorkouts';

const defaultWorkouts = [
    { name: '3x20 min UT2', work: 1200, rest: 300, repetitions: 3 },
    { name: '1 min on 1 min off (x10)', work: 60, rest: 60, repetitions: 10 },
    { name: '5k Time Trial', work: 1140, rest: 0, repetitions: 1 },
    { name: '30 min Steady State', work: 1800, rest: 0, repetitions: 1 },
    { name: '3x 5min hard, 2min easy', work: 300, rest: 120, repetitions: 3 },
    { name: '10x 2 min hard / 1min rest', work: 120, rest: 60, repetitions: 10 },
];

const WorkoutItem = ({ workout, index, onStart, onDelete }) => {
    const workoutName = workout.name || `${Math.floor(workout.work/60)}m ${workout.work%60}s on / ${Math.floor(workout.rest/60)}m ${workout.rest%60}s off x ${workout.repetitions}`;

    return (
        <li>
            <span>{workoutName}</span>
            <div>
                <button className="btn-start btn-delete" onClick={() => onDelete(index)}>Delete</button>
                <button className="btn-start" onClick={() => onStart(workout)}>Start</button>
            </div>
        </li>
    );
};

const DefaultWorkoutItem = ({ workout, onStart }) => {
    return (
        <button className="default-workout-btn" onClick={() => onStart(workout)}>
            {workout.name}
        </button>
    );
};


export const WorkoutListScreen = ({ onNavigate, onStartWorkout }) => {
    const { workouts, deleteWorkout } = useWorkouts();

    const handleDelete = (workoutId) => {
        if (confirm('Are you sure you want to delete this workout?')) {
            deleteWorkout(workoutId);
        }
    };

    return (
        <main id="workout-list-screen" className="screen">
            <h2>Default Workouts</h2>
            <div className="default-workouts-grid">
                {defaultWorkouts.map((workout, index) => (
                    <DefaultWorkoutItem
                        key={index}
                        workout={workout}
                        onStart={onStartWorkout}
                    />
                ))}
            </div>

            <h2>My Custom Workouts</h2>
            <ul id="workout-list">
                {workouts.length > 0 ? (
                    workouts.map((workout, index) => (
                        <WorkoutItem
                            key={index}
                            index={index}
                            workout={workout}
                            onStart={onStartWorkout}
                            onDelete={handleDelete}
                        />
                    ))
                ) : (
                    <li>No workouts yet. Create one!</li>
                )}
            </ul>
            <button id="btn-new-workout" className="btn" onClick={() => onNavigate('new')}>
                Create New Workout
            </button>
        </main>
    );
};
