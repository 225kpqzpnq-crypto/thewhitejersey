import React, { useState } from 'react';
import { useWorkouts } from '../hooks/useWorkouts';

export const NewWorkoutScreen = ({ onWorkoutAdded }) => {
    const { addWorkout } = useWorkouts();
    const [name, setName] = useState('');
    const [workMinutes, setWorkMinutes] = useState('1');
    const [workSeconds, setWorkSeconds] = useState('0');
    const [restMinutes, setRestMinutes] = useState('2');
    const [restSeconds, setRestSeconds] = useState('0');
    const [repetitions, setRepetitions] = useState('3');

    const handleSubmit = (e) => {
        e.preventDefault();
        const newWorkout = {
            name,
            work: parseInt(workMinutes, 10) * 60 + parseInt(workSeconds, 10),
            rest: parseInt(restMinutes, 10) * 60 + parseInt(restSeconds, 10),
            repetitions: parseInt(repetitions, 10),
        };
        addWorkout(newWorkout);
        onWorkoutAdded(); // Navigate back
    };

    return (
        <main id="new-workout-screen" className="screen">
            <h2>New Workout</h2>
            <form id="new-workout-form" onSubmit={handleSubmit}>
                {/* Input fields remain the same */}
                <div className="input-group">
                    <label htmlFor="workout-name">Workout Name (optional)</label>
                    <input type="text" id="workout-name" placeholder="e.g., Tabata" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="input-group">
                    <label>Work Interval</label>
                    <div className="time-input-group">
                        <div>
                            <label htmlFor="work-minutes">Minutes</label>
                            <select id="work-minutes" value={workMinutes} onChange={(e) => setWorkMinutes(e.target.value)}>
                                {Array.from({ length: 60 }, (_, i) => i).map((num) => (
                                    <option key={num} value={num}>{num}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="work-seconds">Seconds</label>
                            <select id="work-seconds" value={workSeconds} onChange={(e) => setWorkSeconds(e.target.value)}>
                                {Array.from({ length: 60 }, (_, i) => i).map((num) => (
                                    <option key={num} value={num}>{num}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
                <div className="input-group">
                    <label>Rest Interval</label>
                    <div className="time-input-group">
                        <div>
                            <label htmlFor="rest-minutes">Minutes</label>
                            <select id="rest-minutes" value={restMinutes} onChange={(e) => setRestMinutes(e.target.value)}>
                                {Array.from({ length: 60 }, (_, i) => i).map((num) => (
                                    <option key={num} value={num}>{num}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="rest-seconds">Seconds</label>
                            <select id="rest-seconds" value={restSeconds} onChange={(e) => setRestSeconds(e.target.value)}>
                                {Array.from({ length: 60 }, (_, i) => i).map((num) => (
                                    <option key={num} value={num}>{num}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>
                <div className="input-group">
                    <label htmlFor="repetitions">Repetitions</label>
                    <input type="number" id="repetitions" min="1" max="20" value={repetitions} onChange={(e) => setRepetitions(e.target.value)} />
                </div>
                <button type="submit" className="btn">Save Workout</button>
                <button type="button" className="btn btn-secondary" onClick={onWorkoutAdded}>Cancel</button>
            </form>
        </main>
    );
};

