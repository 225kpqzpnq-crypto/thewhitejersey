import React from 'react';
import { useTimer } from '../hooks/useTimer';
import { TimerDisplay } from '../components/TimerDisplay';

export const ActiveSessionScreen = ({ workout, onNavigate }) => {
    console.log('ActiveSessionScreen received workout:', workout);
    const {
        isRunning,
        currentIntervalType,
        currentRepetition,
        timeRemaining,
        totalTimeForInterval,
        toggle,
        stop,
    } = useTimer(workout);

    const handleStop = () => {
        stop();
        onNavigate('list');
    };

    const isWorkActive = currentIntervalType === 'WORK';

    return (
        <main id="active-session-screen" className="screen">
            <div id="landscape-container">
                <div className="work-group">
                    <TimerDisplay
                        type="work"
                        isWork={true}
                        isActive={isWorkActive}
                        time={isWorkActive ? timeRemaining : workout.work}
                        totalTime={workout.work}
                        repetition={currentRepetition}
                        totalRepetitions={workout.repetitions}
                    />
                    <button id="btn-toggle-timer" className="btn" onClick={toggle}>
                        {isRunning ? 'Pause' : 'Start'}
                    </button>
                </div>
                <div className="rest-group">
                    <TimerDisplay
                        type="rest"
                        isWork={false}
                        isActive={!isWorkActive}
                        time={!isWorkActive ? timeRemaining : workout.rest}
                        totalTime={workout.rest}
                    />
                    <button id="btn-stop-session" className="btn btn-secondary" onClick={handleStop}>
                        Stop
                    </button>
                </div>
            </div>
        </main>
    );
};
