import React, { useState, useEffect, useCallback } from 'react';
import { TextField, Box, Button } from '@mui/material';

function SingleDurationForm({ hours, setHours, minutes, setMinutes, seconds, setSeconds, onValidationChange }) {
  const [validationErrors, setValidationErrors] = useState({});

  const validate = useCallback(() => {
    const errors = {};
    const h = parseInt(hours || 0);
    const m = parseInt(minutes || 0);
    const s = parseInt(seconds || 0);

    if (h < 0) errors.hours = "Cannot be negative";
    if (m < 0 || m > 59) errors.minutes = "0-59";
    if (s < 0 || s > 59) errors.seconds = "0-59";

    const totalSeconds = (h * 3600) + (m * 60) + (s);
    if (totalSeconds <= 0 && Object.keys(errors).length === 0) {
      errors.total = "Duration must be greater than 0";
    }

    setValidationErrors(errors);
    onValidationChange(Object.keys(errors).length === 0);
  }, [hours, minutes, seconds, onValidationChange]);

  useEffect(() => {
    validate();
  }, [validate]);

  const handleInputChange = (setter) => (event) => {
    const value = event.target.value;
    if (/^\d*$/.test(value) || value === '') {
      setter(value);
    }
  };

  return (
    <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center' }}>
      <TextField
        label="Hours"
        variant="outlined"
        type="number"
        value={hours}
        onChange={handleInputChange(setHours)}
        inputProps={{ min: "0" }}
        error={!!validationErrors.hours || !!validationErrors.total}
        helperText={validationErrors.hours || (validationErrors.total && "Must be > 0")}
        sx={{ width: 100 }}
      />
      <TextField
        label="Minutes"
        variant="outlined"
        type="number"
        value={minutes}
        onChange={handleInputChange(setMinutes)}
        inputProps={{ min: "0", max: "59" }}
        error={!!validationErrors.minutes || !!validationErrors.total}
        helperText={validationErrors.minutes || (validationErrors.total && "Must be > 0")}
        sx={{ width: 100 }}
      />
      <TextField
        label="Seconds"
        variant="outlined"
        type="number"
        value={seconds}
        onChange={handleInputChange(setSeconds)}
        inputProps={{ min: "0", max: "59" }}
        error={!!validationErrors.seconds || !!validationErrors.total}
        helperText={validationErrors.seconds || (validationErrors.total && "Must be > 0")}
        sx={{ width: 100 }}
      />
    </Box>
  );
}

export default SingleDurationForm;
