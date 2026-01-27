import React, { useState, useEffect, useCallback } from 'react';
import { TextField, Box, Button, Checkbox, FormControlLabel, Grid, Typography } from '@mui/material';

// Helper component for duration input to reduce repetition
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
          error={!!errors.hours || (isWorkDuration && !!errors.workTotal)}
          helperText={errors.hours || (isWorkDuration && errors.workTotal && "Must be > 0")}
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
          error={!!errors.minutes || (isWorkDuration && !!errors.workTotal)}
          helperText={errors.minutes || (isWorkDuration && errors.workTotal && "Must be > 0")}
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
          error={!!errors.seconds || (isWorkDuration && !!errors.workTotal)}
          helperText={errors.seconds || (isWorkDuration && errors.workTotal && "Must be > 0")}
        />
      </Grid>
    </Grid>
  );
};


function ConstantIntervalsForm({
  workHours, setWorkHours, workMinutes, setWorkMinutes, workSeconds, setWorkSeconds,
  restHours, setRestHours, restMinutes, setRestMinutes, restSeconds, setRestSeconds,
  repetitions, setRepetitions, warmup, setWarmup, cooldown, setCooldown,
  onValidationChange
}) {
  const [validationErrors, setValidationErrors] = useState({});

  const validate = useCallback(() => {
    const errors = {};
    const wh = parseInt(workHours || 0);
    const wm = parseInt(workMinutes || 0);
    const ws = parseInt(workSeconds || 0);
    const rh = parseInt(restHours || 0);
    const rm = parseInt(restMinutes || 0);
    const rs = parseInt(restSeconds || 0);
    const reps = parseInt(repetitions || 0);

    // Work duration validation
    if (wh < 0) errors.workHours = "Cannot be negative";
    if (wm < 0 || wm > 59) errors.workMinutes = "0-59";
    if (ws < 0 || ws > 59) errors.workSeconds = "0-59";
    const workTotalSeconds = (wh * 3600) + (wm * 60) + (ws);
    if (workTotalSeconds <= 0 && Object.keys(errors).length === 0) { // Only if no other error
      errors.workTotal = "Work duration must be > 0";
    }

    // Rest duration validation
    if (rh < 0) errors.restHours = "Cannot be negative";
    if (rm < 0 || rm > 59) errors.restMinutes = "0-59";
    if (rs < 0 || rs > 59) errors.restSeconds = "0-59";

    // Repetitions validation
    if (reps <= 0) errors.repetitions = "Must be at least 1";

    setValidationErrors(errors);
    const isValid = Object.keys(errors).length === 0;
    onValidationChange(isValid);
  }, [
    workHours, workMinutes, workSeconds,
    restHours, restMinutes, restSeconds,
    repetitions, warmup, cooldown,
    onValidationChange
  ]);

  useEffect(() => {
    validate();
  }, [validate]);

  return (
    <Grid container spacing={2} direction="column" alignItems="center">
      <Grid item>
        <DurationInput
          label="Work"
          hours={workHours} setHours={setWorkHours}
          minutes={workMinutes} setMinutes={setWorkMinutes}
          seconds={workSeconds} setSeconds={setWorkSeconds}
          errors={{
            hours: validationErrors.workHours,
            minutes: validationErrors.workMinutes,
            seconds: validationErrors.workSeconds,
            workTotal: validationErrors.workTotal,
          }}
          isWorkDuration={true}
        />
      </Grid>
      <Grid item>
        <DurationInput
          label="Rest"
          hours={restHours} setHours={setRestHours}
          minutes={restMinutes} setMinutes={setRestMinutes}
          seconds={restSeconds} setSeconds={setRestSeconds}
          errors={{
            hours: validationErrors.restHours,
            minutes: validationErrors.restMinutes,
            seconds: validationErrors.restSeconds,
          }}
        />
      </Grid>
      <Grid item>
        <TextField
          label="Repetitions"
          variant="outlined"
          type="number"
          value={repetitions}
          onChange={(e) => {
            const value = e.target.value;
            if (/^\d*$/.test(value) || value === '') {
              setRepetitions(value);
            }
          }}
          inputProps={{ min: "1" }}
          error={!!validationErrors.repetitions}
          helperText={validationErrors.repetitions}
          sx={{ width: 150 }}
        />
      </Grid>
      <Grid item>
        <FormControlLabel
          control={<Checkbox checked={warmup} onChange={(e) => setWarmup(e.target.checked)} />}
          label="Warm-up"
        />
        <FormControlLabel
          control={<Checkbox checked={cooldown} onChange={(e) => setCooldown(e.target.checked)} />}
          label="Cool-down"
        />
      </Grid>
    </Grid>
  );
}

export default ConstantIntervalsForm;
