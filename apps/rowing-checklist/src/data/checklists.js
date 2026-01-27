export const checklists = {
  pre: {
    title: 'Pre-Rowing Warm-Up',
    subtitle: '10–15 minutes',
    phases: [
      {
        name: 'Phase 1: General Warm-Up',
        time: '3–5 min',
        description: 'Raise core temperature before any stretching or mobilisation.',
        items: [
          { id: 'pre-1-0', label: 'Light aerobic activity', detail: 'Jogging, skipping, or easy rowing at very low intensity' },
          { id: 'pre-1-1', label: 'Target: slight HR & temp increase', detail: 'Should feel warmer but not fatigued' },
        ],
      },
      {
        name: 'Phase 2: Dynamic Mobility — Lower Body',
        time: '5–8 min total',
        items: [
          { id: 'pre-2a-0', label: '3-Way Ankle Mobility', detail: '10 reps each direction per ankle (circles, dorsiflexion rocks, lateral tilts)' },
          { id: 'pre-2a-1', label: 'Bodyweight Squats', detail: '10–15 reps, focus on depth and control' },
          { id: 'pre-2a-2', label: 'Hip Hinges', detail: '10–12 reps, practice body-over movement pattern' },
          { id: 'pre-2a-3', label: 'Walking Lunges with Rotation', detail: '6–8 per side (step forward, rotate torso toward front leg)' },
          { id: 'pre-2a-4', label: 'Leg Swings', detail: '10 forward/back, 10 side-to-side per leg' },
          { id: 'pre-2a-5', label: '3-Way Hip Opener', detail: '10 reps per position (hip circles, 90/90 transitions, pigeon rocks)' },
        ],
      },
      {
        name: 'Phase 2: Dynamic Mobility — Upper Body & Spine',
        items: [
          { id: 'pre-2b-0', label: 'Arm Circles', detail: '10 forward, 10 backward (controlled)' },
          { id: 'pre-2b-1', label: 'Shoulder Rolls', detail: '10 forward, 10 backward' },
          { id: 'pre-2b-2', label: 'Thoracic Rotations', detail: '8–10 per side (thread-the-needle on all fours)' },
          { id: 'pre-2b-3', label: 'Cat-Cow', detail: '10 cycles for spinal mobility' },
          { id: 'pre-2b-4', label: 'Band Pull-Aparts', detail: '15 reps (if band available)' },
          { id: 'pre-2b-5', label: 'Pushup-Plus', detail: '10 reps (protract shoulder blades at top)' },
        ],
      },
      {
        name: 'Phase 2: Dynamic Mobility — Rowing-Specific',
        items: [
          { id: 'pre-2c-0', label: 'Hip Flexor Stretch (dynamic)', detail: '30s per side — deep lunge, gentle pulses. Critical for catch compression.' },
          { id: 'pre-2c-1', label: "World's Greatest Stretch", detail: '5–6 per side (lunge, elbow to instep, rotate and reach)' },
          { id: 'pre-2c-2', label: 'Hands-Overhead Hinge', detail: '10 reps — arms extended overhead, hinge at hips, neutral spine' },
        ],
      },
      {
        name: 'Phase 3: On-Erg Progression',
        time: '5–10 min',
        description: 'Gradual build to working intensity — do not skip.',
        items: [
          { id: 'pre-3-0', label: 'Arms Only', detail: '1–2 min at very low pressure' },
          { id: 'pre-3-1', label: 'Arms + Body Swing', detail: '1–2 minutes' },
          { id: 'pre-3-2', label: 'Half Slide', detail: '1–2 minutes' },
          { id: 'pre-3-3', label: 'Three-Quarter Slide', detail: '1–2 minutes' },
          { id: 'pre-3-4', label: 'Full Slide at Low Intensity', detail: '2–4 minutes' },
          { id: 'pre-3-5', label: 'Build Pieces', detail: '3–4 × 10 strokes with progressive intensity' },
        ],
      },
    ],
  },

  post: {
    title: 'Post-Rowing Recovery',
    subtitle: '15–30 minutes',
    phases: [
      {
        name: 'Cool-Down: On-Erg',
        time: '5–10 min',
        items: [
          { id: 'post-1-0', label: 'Easy rowing', detail: '3–5 min at decreasing intensity, SR 16–20' },
          { id: 'post-1-1', label: 'Technique focus', detail: 'Refine technique while heart rate drops' },
          { id: 'post-1-2', label: 'Light walking', detail: '2–3 min transition (avoid going straight to sedentary)' },
        ],
      },
      {
        name: 'Static Stretching',
        time: '5–10 min',
        description: 'Hold each stretch 20–30 seconds, no bouncing. Muscles are warm — optimal for flexibility.',
        items: [
          { id: 'post-2-0', label: 'Hamstrings', detail: 'Lying or seated stretch, 30s per leg. Critical for catch position.' },
          { id: 'post-2-1', label: 'Hip Flexors', detail: 'Kneeling lunge stretch, 30s per side. Counteracts catch compression.' },
          { id: 'post-2-2', label: 'Glutes / Piriformis', detail: 'Figure-4 stretch or pigeon pose, 30s per side' },
          { id: 'post-2-3', label: 'Quadriceps', detail: 'Standing or side-lying quad stretch, 30s per leg' },
          { id: 'post-2-4', label: 'Calves', detail: 'Wall stretch or step drop, 30s per leg' },
          { id: 'post-2-5', label: 'Lower Back', detail: "Child's pose or knees-to-chest, 30–60s" },
          { id: 'post-2-6', label: 'Thoracic Spine', detail: 'Open book stretch (lying on side, rotating arm), 10 reps per side' },
          { id: 'post-2-7', label: 'Lats / Shoulders', detail: 'Doorway stretch or overhead reach with side bend, 30s per side' },
          { id: 'post-2-8', label: 'Chest / Pectorals', detail: 'Doorway stretch (arms at varying heights), 30s' },
          { id: 'post-2-9', label: 'Neck', detail: 'Gentle lateral neck stretches (ear to shoulder), 20s per side' },
        ],
      },
      {
        name: 'Foam Rolling',
        time: '5–10 min',
        description: 'Roll slowly — ~1 min per muscle group. Pause on tender spots for 30s.',
        optional: true,
        items: [
          { id: 'post-3-0', label: 'Quadriceps', detail: 'Roll from hip to just above knee' },
          { id: 'post-3-1', label: 'Hamstrings', detail: 'Roll from glutes to above knee (cross legs for more pressure)' },
          { id: 'post-3-2', label: 'IT Band', detail: 'Roll from hip to knee on lateral thigh' },
          { id: 'post-3-3', label: 'Calves', detail: 'Roll from ankle to below knee' },
          { id: 'post-3-4', label: 'Glutes', detail: 'Sit on roller, cross one ankle over opposite knee' },
          { id: 'post-3-5', label: 'Upper Back / Thoracic', detail: 'Roll from mid-back to shoulders (arms crossed)' },
          { id: 'post-3-6', label: 'Lats', detail: 'Lie on side, roller under armpit, roll toward hip' },
        ],
      },
    ],
  },

  mvpPre: {
    title: 'Quick Pre-Rowing',
    subtitle: '5 minutes minimum',
    phases: [
      {
        name: 'Minimum Viable Warm-Up',
        items: [
          { id: 'mvp-pre-0', label: '2 min light cardio' },
          { id: 'mvp-pre-1', label: 'Hip flexor stretch', detail: '30s each side' },
          { id: 'mvp-pre-2', label: "World's Greatest Stretch", detail: '5 each side' },
          { id: 'mvp-pre-3', label: 'Bodyweight squats', detail: '10 reps' },
          { id: 'mvp-pre-4', label: 'Arm circles & shoulder rolls' },
          { id: 'mvp-pre-5', label: 'Pick drill progression on erg', detail: '3 minutes' },
        ],
      },
    ],
  },

  mvpPost: {
    title: 'Quick Post-Rowing',
    subtitle: '5 minutes minimum',
    phases: [
      {
        name: 'Minimum Viable Recovery',
        items: [
          { id: 'mvp-post-0', label: '3 min easy rowing cool-down' },
          { id: 'mvp-post-1', label: 'Hamstring stretch', detail: '30s each side' },
          { id: 'mvp-post-2', label: 'Hip flexor stretch', detail: '30s each side' },
          { id: 'mvp-post-3', label: "Child's pose", detail: '30s' },
          { id: 'mvp-post-4', label: 'Drink 500ml fluid immediately' },
          { id: 'mvp-post-5', label: 'Eat carb + protein snack', detail: 'Within 30 minutes' },
        ],
      },
    ],
  },
}

/** Get all item IDs for a checklist type (excluding optional sections by default) */
export function getRequiredItemIds(type) {
  const checklist = checklists[type]
  if (!checklist) return []
  return checklist.phases
    .filter((phase) => !phase.optional)
    .flatMap((phase) => phase.items.map((item) => item.id))
}

/** Get all item IDs including optional */
export function getAllItemIds(type) {
  const checklist = checklists[type]
  if (!checklist) return []
  return checklist.phases.flatMap((phase) => phase.items.map((item) => item.id))
}
