import { useState } from 'react';
import './style.css';
import { WorkoutListScreen } from './screens/WorkoutList';
import { NewWorkoutScreen } from './screens/NewWorkout';

import { ActiveSessionScreen } from './screens/ActiveSession';


function App() {
  const [screen, setScreen] = useState('list'); // 'list', 'new', 'session'
  const [activeWorkout, setActiveWorkout] = useState(null);

  const handleNavigate = (targetScreen) => {
    setScreen(targetScreen);
  };

  const handleStartWorkout = (workout) => {
    setActiveWorkout(workout);
    setScreen('session');
  };

  const renderScreen = () => {
    switch (screen) {
      case 'new':
        return <NewWorkoutScreen onWorkoutAdded={() => handleNavigate('list')} />;
      case 'session':
        console.log('Rendering ActiveSessionScreen with workout:', activeWorkout);
        return <ActiveSessionScreen workout={activeWorkout} onNavigate={handleNavigate} />;
      case 'list':
      default:
        return <WorkoutListScreen onNavigate={handleNavigate} onStartWorkout={handleStartWorkout} />;
    }
  };

  return (
    <div id="app">
      <h1>ergify</h1>
      {renderScreen()}
    </div>
  );
}

export default App;