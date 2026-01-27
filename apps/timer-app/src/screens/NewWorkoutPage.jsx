import React, { useState, useCallback } from 'react';
import { Container, Typography, Box, RadioGroup, FormControlLabel, Radio, FormControl, FormLabel, TextField, Paper, Button } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import SingleDurationForm from '../components/forms/SingleDurationForm';
import ConstantIntervalsForm from '../components/forms/ConstantIntervalsForm';
import CustomWorkoutForm from '../components/forms/CustomWorkoutForm';

// Helper function to format duration to HH:MM:SS
const formatDuration = (totalSeconds) => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return [hours, minutes, seconds].map(v => v < 10 ? "0" + v : v).join(":");
};

// Helper function to convert total seconds to { hours, minutes, seconds } object
const secondsToHMS = (totalSeconds) => {
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;
  return { hours: String(hours), minutes: String(minutes), seconds: String(seconds) };
};

function NewWorkoutPage() {
  const [workoutType, setWorkoutType] = useState('single');
  const [workoutName, setWorkoutName] = useState('');
  const [singleHours, setSingleHours] = useState('');
  const [singleMinutes, setSingleMinutes] = useState('');
  const [singleSeconds, setSingleSeconds] = useState('');
  // States for constant intervals form controlled by NewWorkoutPage
  const [workHours, setWorkHours] = useState('');
  const [workMinutes, setWorkMinutes] = useState('');
  const [workSeconds, setWorkSeconds] = useState('');
  const [restHours, setRestHours] = useState('');
  const [restMinutes, setRestMinutes] = useState('');
  const [restSeconds, setRestSeconds] = useState('');
  const [repetitions, setRepetitions] = useState('');
  const [warmup, setWarmup] = useState(false);
  const [cooldown, setCooldown] = useState(false);

  const [customIntervals, setCustomIntervals] = useState([]);
  const [isSingleDurationFormValid, setIsSingleDurationFormValid] = useState(false);
  const [isConstantIntervalsFormValid, setIsConstantIntervalsFormValid] = useState(false);
  const [isCustomWorkoutFormValid, setIsCustomWorkoutFormValid] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const handleWorkoutTypeChange = (event) => {
    setWorkoutType(event.target.value);
  };

  const handleSingleDurationValidationChange = useCallback((isValid) => {
    setIsSingleDurationFormValid(isValid);
  }, [setIsSingleDurationFormValid]);

  const handleSingleHoursChange = useCallback((value) => setSingleHours(value), []);
  const handleSingleMinutesChange = useCallback((value) => setSingleMinutes(value), []);
  const handleSingleSecondsChange = useCallback((value) => setSingleSeconds(value), []);

  // Handlers for constant intervals form
  const handleWorkHoursChange = useCallback((value) => setWorkHours(value), []);
  const handleWorkMinutesChange = useCallback((value) => setWorkMinutes(value), []);
  const handleWorkSecondsChange = useCallback((value) => setWorkSeconds(value), []);
  const handleRestHoursChange = useCallback((value) => setRestHours(value), []);
  const handleRestMinutesChange = useCallback((value) => setRestMinutes(value), []);
  const handleRestSecondsChange = useCallback((value) => setRestSeconds(value), []);
  const handleRepetitionsChange = useCallback((value) => setRepetitions(value), []);
  const handleWarmupChange = useCallback((value) => setWarmup(value), []);
  const handleCooldownChange = useCallback((value) => setCooldown(value), []);

  const handleConstantIntervalsValidationChange = useCallback((isValid) => {
    setIsConstantIntervalsFormValid(isValid);
  }, [setIsConstantIntervalsFormValid]);

  const calculateConstantIntervals = useCallback(() => {
    const wh = parseInt(workHours || 0);
    const wm = parseInt(workMinutes || 0);
    const ws = parseInt(workSeconds || 0);
    const rh = parseInt(restHours || 0);
    const rm = parseInt(restMinutes || 0);
    const rs = parseInt(restSeconds || 0);
    const reps = parseInt(repetitions || 0);

    return {
      workDuration: (wh * 3600) + (wm * 60) + (ws),
      restDuration: (rh * 3600) + (rm * 60) + (rs),
      repetitions: reps,
      warmup,
      cooldown,
    };
  }, [workHours, workMinutes, workSeconds, restHours, restMinutes, restSeconds, repetitions, warmup, cooldown]);

  const handleCustomIntervalsChange = useCallback((data) => {
    setCustomIntervals(data);
  }, [setCustomIntervals]);

  const handleCustomIntervalsValidationChange = useCallback((isValid) => {
    setIsCustomWorkoutFormValid(isValid);
  }, [setIsCustomWorkoutFormValid]);

  // useEffect to handle incoming program data
  useEffect(() => {
    const { program } = location.state || {};
    if (program) {
      setWorkoutName(program.name || '');
      setWorkoutType(program.type);

      if (program.type === 'single') {
        const { hours: sh, minutes: sm, seconds: ss } = secondsToHMS(program.duration);
        setSingleHours(sh);
        setSingleMinutes(sm);
        setSingleSeconds(ss);
        setIsSingleDurationFormValid(true);
        // Auto-start single duration workout
        setTimeout(() => {
          handleStartWorkout();
        }, 0); // Small delay to ensure state updates
      } else if (program.type === 'constant') {
        const { hours: wh, minutes: wm, seconds: ws } = secondsToHMS(program.workDuration);
        setWorkHours(wh);
        setWorkMinutes(wm);
        setWorkSeconds(ws);

        const { hours: rh, minutes: rm, seconds: rs } = secondsToHMS(program.restDuration);
        setRestHours(rh);
        setRestMinutes(rm);
        setRestSeconds(rs);

        setRepetitions(String(program.repetitions));
        setWarmup(program.warmup);
        setCooldown(program.cooldown);
        setIsConstantIntervalsFormValid(true);

        // Auto-start constant interval workout
        setTimeout(() => {
          handleStartWorkout();
        }, 0); // Small delay to ensure state updates
      }
      // Clear location state after use to prevent re-triggering on subsequent renders
      navigate(location.pathname, { replace: true });
    }
  }, [location.state, handleStartWorkout, navigate, location.pathname, setIsSingleDurationFormValid, setIsConstantIntervalsFormValid, setSingleHours, setSingleMinutes, setSingleSeconds, setWorkHours, setWorkMinutes, setWorkSeconds, setRestHours, setRestMinutes, setRestSeconds, setRepetitions, setWarmup, setCooldown, setWorkoutType, setWorkoutName]);

  const handleStartWorkout = () => {
    let workoutToStart = {
      type: workoutType,
      name: workoutName,
    };

    if (!workoutName) {
      switch (workoutType) {
        case 'single':
          const totalSingleSeconds = (parseInt(singleHours || 0) * 3600) + (parseInt(singleMinutes || 0) * 60) + (parseInt(singleSeconds || 0));
          workoutToStart.name = `Single Duration (${formatDuration(totalSingleSeconds)})`;
          break;
        case 'constant':
          const { repetitions, workDuration, restDuration, warmup, cooldown } = calculateConstantIntervals();
          let nameParts = [];
          if (warmup) nameParts.push('Warm-up');
          nameParts.push(`${repetitions}x ${formatDuration(workDuration)} / ${formatDuration(restDuration)}`);
          if (cooldown) nameParts.push('Cool-down');
          workoutToStart.name = `Interval: ${nameParts.join(', ')}`;
          break;
        case 'custom':
          workoutToStart.name = `Custom Workout (${customIntervals.length} intervals)`;
          break;
        default:
          workoutToStart.name = "Unnamed Workout";
      }
    }

    switch (workoutType) {
      case 'single':
        workoutToStart.duration = (parseInt(singleHours || 0) * 3600) + (parseInt(singleMinutes || 0) * 60) + (parseInt(singleSeconds || 0));
        break;
      case 'constant':
        workoutToStart.intervals = calculateConstantIntervals();
        break;
      case 'custom':
        workoutToStart.intervals = customIntervals;
        break;
      default:
        // Handle error or default case
    }

    navigate('/workout', { state: { workout: workoutToStart } });
  };

  const renderWorkoutForm = () => {
    switch (workoutType) {
      case 'single':
        return <SingleDurationForm
                  hours={singleHours} setHours={handleSingleHoursChange}
                  minutes={singleMinutes} setMinutes={handleSingleMinutesChange}
                  seconds={singleSeconds} setSeconds={handleSingleSecondsChange}
                  onValidationChange={handleSingleDurationValidationChange}
                />;
      case 'constant':
        return <ConstantIntervalsForm
                  workHours={workHours} setWorkHours={handleWorkHoursChange}
                  workMinutes={workMinutes} setWorkMinutes={handleWorkMinutesChange}
                  workSeconds={workSeconds} setWorkSeconds={handleWorkSecondsChange}
                  restHours={restHours} setRestHours={handleRestHoursChange}
                  restMinutes={restMinutes} setRestMinutes={handleRestMinutesChange}
                  restSeconds={restSeconds} setRestSeconds={handleRestSecondsChange}
                  repetitions={repetitions} setRepetitions={handleRepetitionsChange}
                  warmup={warmup} setWarmup={handleWarmupChange}
                  cooldown={cooldown} setCooldown={handleCooldownChange}
                  onValidationChange={handleConstantIntervalsValidationChange}
                />;
      case 'custom':
        return <CustomWorkoutForm onCustomIntervalsChange={handleCustomIntervalsChange} onValidationChange={handleCustomIntervalsValidationChange} />;
      default:
        return null;
    }
  };

  // Determine if the Start Workout button should be disabled
  let isStartButtonDisabled = true; // Default to disabled
  if (workoutType === 'single') {
    isStartButtonDisabled = !isSingleDurationFormValid;
  } else if (workoutType === 'constant') {
    isStartButtonDisabled = !isConstantIntervalsFormValid;
  } else if (workoutType === 'custom') {
    isStartButtonDisabled = !isCustomWorkoutFormValid;
  }

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4, textAlign: 'center' }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Create New Workout
        </Typography>

        <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
          <TextField
            label="Workout Name (Optional)"
            variant="outlined"
            fullWidth
            value={workoutName}
            onChange={(e) => setWorkoutName(e.target.value)}
            sx={{ mb: 3 }}
          />

          <FormControl component="fieldset" fullWidth>
            <FormLabel component="legend">Select Workout Type</FormLabel>
            <RadioGroup
              row
              aria-label="workout type"
              name="row-radio-buttons-group"
              value={workoutType}
              onChange={handleWorkoutTypeChange}
              sx={{ justifyContent: 'center' }}
            >
              <FormControlLabel value="single" control={<Radio />} label="Single Duration" />
              <FormControlLabel value="constant" control={<Radio />} label="Constant Intervals" />
              <FormControlLabel value="custom" control={<Radio />} label="Custom Workout" />
            </RadioGroup>
          </FormControl>
        </Paper>

        <Paper elevation={3} sx={{ p: 3, mb: 2 }}>
          {renderWorkoutForm()}
        </Paper>

        <Button
          variant="contained"
          color="secondary"
          size="large"
          onClick={handleStartWorkout}
          sx={{ mt: 2 }}
          disabled={isStartButtonDisabled}
        >
          Start Workout
        </Button>
      </Box>
    </Container>
  );
}

export default NewWorkoutPage;



