import { Routes, Route } from 'react-router-dom';
import WelcomePage from './screens/WelcomePage';
import NewWorkoutPage from './screens/NewWorkoutPage';
import WorkoutScreen from './screens/WorkoutScreen'; // Import WorkoutScreen

function App() {
  return (
    <Routes>
        <Route path="/" element={<WelcomePage />} />
        <Route path="/new-workout" element={<NewWorkoutPage />} />
        <Route path="/workout" element={<WorkoutScreen />} />
        {/* Add more routes here as needed */}
      </Routes>
  )
}

export default App



