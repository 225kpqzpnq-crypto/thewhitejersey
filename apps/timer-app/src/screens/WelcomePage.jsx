import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Typography, Box, Button, List, ListItem, ListItemText, ListItemButton } from '@mui/material';
import { getWorkoutHistory } from '../utils/localStorage'; // Import the utility function

function WelcomePage() {
  const defaultPrograms = [
    { name: '10-minute Steady State', type: 'single', duration: 600 }, // 10 minutes
    { name: '30-minute Steady State', type: 'single', duration: 1800 }, // 30 minutes
    { name: '1-hour Steady State', type: 'single', duration: 3600 }, // 1 hour
    { name: '3 x 20 min / 2 min rest', type: 'constant', repetitions: 3, workDuration: 1200, restDuration: 120, warmup: false, cooldown: false },
    { name: '10 x 1 min / 1 min rest', type: 'constant', repetitions: 10, workDuration: 60, restDuration: 60, warmup: false, cooldown: false },
    { name: '10 x 20s ON / 40s OFF (W/U & C/D)', type: 'constant', repetitions: 10, workDuration: 20, restDuration: 40, warmup: true, cooldown: true },
  ];

  const [workoutHistory, setWorkoutHistory] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    setWorkoutHistory(getWorkoutHistory());
  }, []); // Load history once on component mount

  const handleProgramClick = (program) => {
    navigate('/new-workout', { state: { program } });
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4, textAlign: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Welcome to Erg Timer
        </Typography>

        <Box sx={{ mt: 4, mb: 6 }}>
          <Typography variant="h5" gutterBottom>
            Default Programs
          </Typography>
          <List sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 0 }}>
            {defaultPrograms.map((program, index) => (
              <ListItem key={program.name} disablePadding sx={{ width: 'auto' }}>
                <ListItemButton onClick={() => handleProgramClick(program)}>
                  <ListItemText primary={program.name} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>

        <Button
          variant="contained"
          color="primary"
          size="large"
          sx={{ mb: 4 }}
          component={Link}
          to="/new-workout"
        >
          Create New Workout
        </Button>

        <Box sx={{ mt: 4 }}>
          <Typography variant="h5" gutterBottom>
            Workout History
          </Typography>
          {workoutHistory.length > 0 ? (
            <List sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', p: 0 }}>
              {workoutHistory.map((workout, index) => (
                <ListItem key={index} disablePadding sx={{ width: 'auto' }}>
                  <ListItemText primary={`${workout.name} - ${workout.date}`} />
                </ListItem>
              ))}
            </List>
          ) : (
            <Typography variant="body1" color="text.secondary">
              No workouts completed yet.
            </Typography>
          )}
        </Box>
      </Box>
    </Container>
  );
}

export default WelcomePage;

