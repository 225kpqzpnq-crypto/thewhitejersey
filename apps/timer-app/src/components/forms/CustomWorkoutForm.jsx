import React, { useState, useEffect, useCallback } from 'react';
import { TextField, Box, Button, IconButton, Grid, Typography, Paper } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import DeleteIcon from '@mui/icons-material/Delete';

// Re-using the DurationInput helper component (modified to accept errors prop)
const DurationInput = ({ label, hours, setHours, minutes, setMinutes, seconds, setSeconds, errors = {}, isWorkDuration = false }) => {
  const handleHoursChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value) || value === '') {
      setHours(value);
    }
  };
  const handleMinutesChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value) || value === '') {
      setMinutes(value);
    }
  };
  const handleSecondsChange = (e) => {
    const value = e.target.value;
    if (/^\d*$/.test(value) || value === '') {
      setSeconds(value);
    }
  };

  return (
    <Grid container spacing={1} alignItems="center">
      <Grid item xs={12} sm={3}>
        <Typography variant="body2" sx={{ textAlign: { xs: 'left', sm: 'right' } }}>{label}:</Typography>
      </Grid>
      <Grid item xs={4} sm={3}>
        <TextField
          label="H"
          variant="outlined"
          type="number"
          size="small"
          fullWidth
          value={hours}
          onChange={handleHoursChange}
          inputProps={{ min: "0" }}
          error={!!errors.hours || (isWorkDuration && !!errors.total)}
          helperText={errors.hours || (isWorkDuration && errors.total && "Must be > 0")}
        />
      </Grid>
      <Grid item xs={4} sm={3}>
        <TextField
          label="M"
          variant="outlined"
          type="number"
          size="small"
          fullWidth
          value={minutes}
          onChange={handleMinutesChange}
          inputProps={{ min: "0", max: "59" }}
          error={!!errors.minutes || (isWorkDuration && !!errors.total)}
          helperText={errors.minutes || (isWorkDuration && errors.total && "Must be > 0")}
        />
      </Grid>
      <Grid item xs={4} sm={3}>
        <TextField
          label="S"
          variant="outlined"
          type="number"
          size="small"
          fullWidth
          value={seconds}
          onChange={handleSecondsChange}
          inputProps={{ min: "0", max: "59" }}
          error={!!errors.seconds || (isWorkDuration && !!errors.total)}
          helperText={errors.seconds || (isWorkDuration && errors.total && "Must be > 0")}
        />
      </Grid>
    </Grid>
  );
};


function CustomWorkoutForm({ onCustomIntervalsChange, onValidationChange }) {
  const [intervals, setIntervals] = useState([
    { id: 1, workHours: '', workMinutes: '', workSeconds: '', restHours: '', restMinutes: '', restSeconds: '' }
  ]);
  const [nextId, setNextId] = useState(2); // For unique keys
  const [validationErrors, setValidationErrors] = useState({}); // Stores errors per interval { id: { workHours: '...', total: '...' }, ... }

  const validate = useCallback(() => {
    let formIsValid = true;
    const allIntervalErrors = {};

    if (intervals.length === 0) {
      formIsValid = false;
    }

    intervals.forEach(interval => {
      const intervalErrors = {};
      const wh = parseInt(interval.workHours || 0);
      const wm = parseInt(interval.workMinutes || 0);
      const ws = parseInt(interval.workSeconds || 0);
      const rh = parseInt(interval.restHours || 0);
      const rm = parseInt(interval.restMinutes || 0);
      const rs = parseInt(interval.restSeconds || 0);

      // Work duration validation
      if (wh < 0) intervalErrors.workHours = "Cannot be negative";
      if (wm < 0 || wm > 59) intervalErrors.workMinutes = "0-59";
      if (ws < 0 || ws > 59) intervalErrors.workSeconds = "0-59";
      const workTotalSeconds = (wh * 3600) + (wm * 60) + (ws);
      if (workTotalSeconds <= 0 && Object.keys(intervalErrors).length === 0) {
        intervalErrors.workTotal = "Work duration must be > 0";
      }

      // Rest duration validation
      if (rh < 0) intervalErrors.restHours = "Cannot be negative";
      if (rm < 0 || rm > 59) intervalErrors.restMinutes = "0-59";
      if (rs < 0 || rs > 59) intervalErrors.restSeconds = "0-59";

      if (Object.keys(intervalErrors).length > 0) {
        allIntervalErrors[interval.id] = intervalErrors;
        formIsValid = false;
      }
    });

    setValidationErrors(allIntervalErrors);
    onValidationChange(formIsValid && intervals.length > 0); // Form is valid only if all intervals are valid and at least one exists

    const formattedIntervals = intervals.map(interval => {
      const workDuration = (parseInt(interval.workHours || 0) * 3600) +
                           (parseInt(interval.workMinutes || 0) * 60) +
                           (parseInt(interval.workSeconds || 0));
      const restDuration = (parseInt(interval.restHours || 0) * 3600) +
                           (parseInt(interval.restMinutes || 0) * 60) +
                           (parseInt(interval.restSeconds || 0));
      return { workDuration, restDuration };
    });
    onCustomIntervalsChange(formattedIntervals);
  }, [intervals, onCustomIntervalsChange, onValidationChange]);

  useEffect(() => {
    validate();
  }, [validate, intervals]);


  const addInterval = () => {
    setIntervals([...intervals, { id: nextId, workHours: '', workMinutes: '', workSeconds: '', restHours: '', restMinutes: '', restSeconds: '' }]);
    setNextId(nextId + 1);
  };

  const removeInterval = (id) => {
    setIntervals(intervals.filter(interval => interval.id !== id));
  };

  const handleIntervalChange = (id, field, value) => {
    setIntervals(intervals.map(interval =>
      interval.id === id ? { ...interval, [field]: value } : interval
    ));
  };


  return (
    <Box>
      <Typography variant="h6" gutterBottom>Define Custom Intervals</Typography>
      {intervals.length === 0 && (
        <Typography color="error" variant="body2" sx={{ mb: 2 }}>
          At least one interval is required.
        </Typography>
      )}
      {intervals.map((interval, index) => (
        <Paper key={interval.id} elevation={1} sx={{ p: 2, mb: 2, display: 'flex', flexDirection: 'column', gap: 2 }}>
          <Typography variant="subtitle1">Interval {index + 1}</Typography>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={12} sm={6}>
              <DurationInput
                label="Work"
                hours={interval.workHours} setHours={(val) => handleIntervalChange(interval.id, 'workHours', val)}
                minutes={interval.workMinutes} setMinutes={(val) => handleIntervalChange(interval.id, 'workMinutes', val)}
                seconds={interval.workSeconds} setSeconds={(val) => handleIntervalChange(interval.id, 'workSeconds', val)}
                errors={validationErrors[interval.id] ? {
                  hours: validationErrors[interval.id].workHours,
                  minutes: validationErrors[interval.id].workMinutes,
                  seconds: validationErrors[interval.id].workSeconds,
                  total: validationErrors[interval.id].workTotal,
                } : {}}
                isWorkDuration={true}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <DurationInput
                label="Rest"
                hours={interval.restHours} setHours={(val) => handleIntervalChange(interval.id, 'restHours', val)}
                minutes={interval.restMinutes} setMinutes={(val) => handleIntervalChange(interval.id, 'restMinutes', val)}
                seconds={interval.restSeconds} setSeconds={(val) => handleIntervalChange(interval.id, 'restSeconds', val)}
                errors={validationErrors[interval.id] ? {
                  hours: validationErrors[interval.id].restHours,
                  minutes: validationErrors[interval.id].restMinutes,
                  seconds: validationErrors[interval.id].restSeconds,
                } : {}}
              />
            </Grid>
          </Grid>
          {intervals.length > 0 && ( // Allow removing even if only one, but show error if none exist
            <Button
              variant="outlined"
              color="error"
              startIcon={<DeleteIcon />}
              onClick={() => removeInterval(interval.id)}
              sx={{ mt: 1 }}
            >
              Remove Interval
            </Button>
          )}
        </Paper>
      ))}
      <Button
        variant="contained"
        startIcon={<AddIcon />}
        onClick={addInterval}
        sx={{ mt: 2 }}
      >
        Add Interval
      </Button>
    </Box>
  );
}

export default CustomWorkoutForm;
