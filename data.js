/* FORGE — Static Data: Exercise Library & Food Database */

const EXERCISE_LIBRARY = [
  {
    id: 'bench-press',
    name: 'Bench Press',
    primaryMuscles: ['Chest'],
    secondaryMuscles: ['Triceps', 'Front Delts'],
    equipment: 'Barbell',
    difficulty: 'Intermediate',
    instructions: [
      'Lie on a flat bench with feet planted firmly on the floor.',
      'Grip the bar slightly wider than shoulder-width.',
      'Unrack the bar and hold it above your chest with arms extended.',
      'Lower the bar controlled to mid-chest (eccentric).',
      'Press the bar back up explosively until arms are locked out.',
      'Repeat for the target reps.'
    ],
    commonMistakes: [
      'Bouncing the bar off the chest',
      'Flaring elbows too wide (risk to shoulders)',
      'Lifting hips off the bench',
      'Incomplete range of motion'
    ],
    defaultSets: 4,
    defaultReps: 8,
    defaultRest: 90
  },
  {
    id: 'squat',
    name: 'Squat',
    primaryMuscles: ['Quads', 'Glutes'],
    secondaryMuscles: ['Hamstrings', 'Core'],
    equipment: 'Barbell',
    difficulty: 'Intermediate',
    instructions: [
      'Place the bar on your upper traps (high-bar) or rear delts (low-bar).',
      'Stand with feet shoulder-width, toes slightly out.',
      'Brace your core, keep chest up.',
      'Sit back and down until thighs are at least parallel to the floor.',
      'Drive through mid-foot to stand back up.',
      'Keep knees tracking over toes throughout.'
    ],
    commonMistakes: [
      'Knees caving inward',
      'Rounding the lower back',
      'Heels lifting off the floor',
      'Not reaching depth'
    ],
    defaultSets: 4,
    defaultReps: 6,
    defaultRest: 120
  },
  {
    id: 'deadlift',
    name: 'Deadlift',
    primaryMuscles: ['Hamstrings', 'Glutes', 'Back'],
    secondaryMuscles: ['Traps', 'Core', 'Forearms'],
    equipment: 'Barbell',
    difficulty: 'Advanced',
    instructions: [
      'Stand with feet hip-width, bar over mid-foot.',
      'Hinge at hips, grip the bar just outside knees.',
      'Flatten your back, brace core, pull slack out of the bar.',
      'Drive through the floor, extending hips and knees together.',
      'Stand tall at the top, then lower controlled.',
      'Reset and repeat.'
    ],
    commonMistakes: [
      'Rounding the back',
      'Bar drifting away from the body',
      'Hyperextending at the top',
      'Jerking the bar off the floor'
    ],
    defaultSets: 3,
    defaultReps: 5,
    defaultRest: 150
  },
  {
    id: 'romanian-deadlift',
    name: 'Romanian Deadlift',
    primaryMuscles: ['Hamstrings', 'Glutes'],
    secondaryMuscles: ['Lower Back', 'Core'],
    equipment: 'Barbell',
    difficulty: 'Intermediate',
    instructions: [
      'Hold bar at hip height with shoulder-width grip.',
      'Soft knees, hinge at the hips pushing them back.',
      'Lower the bar along your legs until you feel a strong hamstring stretch.',
      'Keep back flat and bar close to the body.',
      'Drive hips forward to return to standing.'
    ],
    commonMistakes: [
      'Rounding the back',
      'Bending the knees too much (turns into squat)',
      'Bar drifting forward',
      'Not feeling the hamstring stretch'
    ],
    defaultSets: 3,
    defaultReps: 8,
    defaultRest: 90
  },
  {
    id: 'overhead-press',
    name: 'Overhead Press',
    primaryMuscles: ['Shoulders'],
    secondaryMuscles: ['Triceps', 'Upper Chest', 'Core'],
    equipment: 'Barbell',
    difficulty: 'Intermediate',
    instructions: [
      'Stand with bar at upper chest, hands just outside shoulders.',
      'Brace core, glutes tight.',
      'Press the bar straight up overhead until arms lock out.',
      'Lower controlled back to the starting position.',
      'Keep the bar path close to your face.'
    ],
    commonMistakes: [
      'Excessive lower-back arch',
      'Pressing the bar forward instead of up',
      'Not locking out fully',
      'Using leg drive (unless push-press)'
    ],
    defaultSets: 4,
    defaultReps: 6,
    defaultRest: 90
  },
  {
    id: 'incline-bench-press',
    name: 'Incline Bench Press',
    primaryMuscles: ['Upper Chest'],
    secondaryMuscles: ['Front Delts', 'Triceps'],
    equipment: 'Barbell',
    difficulty: 'Intermediate',
    instructions: [
      'Set bench to 30–45 degrees incline.',
      'Grip slightly wider than shoulder-width.',
      'Lower bar to upper chest with control.',
      'Press up until arms are extended.',
      'Keep shoulder blades retracted.'
    ],
    commonMistakes: [
      'Setting the incline too high (becomes shoulder press)',
      'Flaring elbows excessively',
      'Bouncing the bar'
    ],
    defaultSets: 3,
    defaultReps: 8,
    defaultRest: 90
  },
  {
    id: 'dumbbell-bench-press',
    name: 'Dumbbell Bench Press',
    primaryMuscles: ['Chest'],
    secondaryMuscles: ['Triceps', 'Front Delts'],
    equipment: 'Dumbbells',
    difficulty: 'Beginner',
    instructions: [
      'Lie on flat bench holding dumbbells at chest level.',
      'Press dumbbells up until arms are extended.',
      'Lower with control until elbows are about 90 degrees or slightly deeper.',
      'Keep wrists stacked over elbows.'
    ],
    commonMistakes: [
      'Going too deep and stressing shoulders',
      'Uneven press between sides',
      'Arching excessively'
    ],
    defaultSets: 3,
    defaultReps: 10,
    defaultRest: 75
  },
  {
    id: 'push-up',
    name: 'Push-Up',
    primaryMuscles: ['Chest'],
    secondaryMuscles: ['Triceps', 'Front Delts', 'Core'],
    equipment: 'Bodyweight',
    difficulty: 'Beginner',
    instructions: [
      'Start in high plank, hands slightly wider than shoulders.',
      'Body in a straight line from head to heels.',
      'Lower chest toward the floor by bending elbows.',
      'Push back up to the starting position.',
      'Keep core braced throughout.'
    ],
    commonMistakes: [
      'Hips sagging or piking up',
      'Partial range of motion',
      'Flaring elbows to 90 degrees'
    ],
    defaultSets: 3,
    defaultReps: 12,
    defaultRest: 60
  },
  {
    id: 'pull-up',
    name: 'Pull-Up',
    primaryMuscles: ['Lats', 'Upper Back'],
    secondaryMuscles: ['Biceps', 'Rear Delts'],
    equipment: 'Pull-up Bar',
    difficulty: 'Advanced',
    instructions: [
      'Hang from the bar with an overhand grip, hands slightly wider than shoulders.',
      'Pull yourself up until chin clears the bar.',
      'Lower with control to a full hang.',
      'Avoid swinging or kipping.'
    ],
    commonMistakes: [
      'Incomplete range of motion',
      'Using momentum',
      'Shrugging shoulders at the bottom'
    ],
    defaultSets: 3,
    defaultReps: 6,
    defaultRest: 90
  },
  {
    id: 'chin-up',
    name: 'Chin-Up',
    primaryMuscles: ['Lats', 'Biceps'],
    secondaryMuscles: ['Upper Back'],
    equipment: 'Pull-up Bar',
    difficulty: 'Intermediate',
    instructions: [
      'Hang from the bar with an underhand (supinated) grip, hands shoulder-width.',
      'Pull up until chin clears the bar.',
      'Lower controlled to full hang.',
      'Keep core engaged.'
    ],
    commonMistakes: [
      'Incomplete range',
      'Swinging',
      'Not fully extending at the bottom'
    ],
    defaultSets: 3,
    defaultReps: 8,
    defaultRest: 90
  },
  {
    id: 'lat-pulldown',
    name: 'Lat Pulldown',
    primaryMuscles: ['Lats'],
    secondaryMuscles: ['Biceps', 'Rear Delts'],
    equipment: 'Cable',
    difficulty: 'Beginner',
    instructions: [
      'Sit at the lat pulldown machine, adjust thigh pads.',
      'Grip the bar wider than shoulder-width.',
      'Pull the bar down to upper chest while leaning slightly back.',
      'Squeeze shoulder blades together at the bottom.',
      'Return controlled to the start.'
    ],
    commonMistakes: [
      'Pulling behind the neck',
      'Using too much momentum',
      'Not achieving a full stretch at the top'
    ],
    defaultSets: 3,
    defaultReps: 10,
    defaultRest: 75
  },
  {
    id: 'barbell-row',
    name: 'Barbell Row',
    primaryMuscles: ['Upper Back', 'Lats'],
    secondaryMuscles: ['Biceps', 'Rear Delts'],
    equipment: 'Barbell',
    difficulty: 'Intermediate',
    instructions: [
      'Hinge forward at hips, back flat, knees soft.',
      'Grip bar slightly wider than shoulder-width.',
      'Pull the bar to your lower chest / upper abs.',
      'Squeeze shoulder blades at the top.',
      'Lower controlled.'
    ],
    commonMistakes: [
      'Rounding the back',
      'Using too much momentum',
      'Standing too upright'
    ],
    defaultSets: 4,
    defaultReps: 8,
    defaultRest: 90
  },
  {
    id: 'one-arm-dumbbell-row',
    name: 'One-Arm Dumbbell Row',
    primaryMuscles: ['Lats', 'Upper Back'],
    secondaryMuscles: ['Biceps', 'Rear Delts'],
    equipment: 'Dumbbells',
    difficulty: 'Beginner',
    instructions: [
      'Place one knee and hand on a bench for support.',
      'Hold dumbbell in the opposite hand, arm hanging straight.',
      'Pull the dumbbell to your hip, keeping elbow close to body.',
      'Squeeze at the top, then lower controlled.',
      'Complete all reps then switch sides.'
    ],
    commonMistakes: [
      'Rotating the torso excessively',
      'Pulling with the arm instead of the back',
      'Shrugging the shoulder'
    ],
    defaultSets: 3,
    defaultReps: 10,
    defaultRest: 60
  },
  {
    id: 'cable-row',
    name: 'Cable Row',
    primaryMuscles: ['Upper Back', 'Lats'],
    secondaryMuscles: ['Biceps', 'Rear Delts'],
    equipment: 'Cable',
    difficulty: 'Beginner',
    instructions: [
      'Sit at the cable row station, feet on platform.',
      'Grip the handle, sit upright with slight knee bend.',
      'Pull the handle to your torso, squeezing shoulder blades.',
      'Return with control, feeling a stretch in the lats.'
    ],
    commonMistakes: [
      'Rounding the back',
      'Using momentum',
      'Shrugging shoulders up'
    ],
    defaultSets: 3,
    defaultReps: 10,
    defaultRest: 75
  },
  {
    id: 'biceps-curl',
    name: 'Biceps Curl',
    primaryMuscles: ['Biceps'],
    secondaryMuscles: ['Forearms'],
    equipment: 'Dumbbells',
    difficulty: 'Beginner',
    instructions: [
      'Stand holding dumbbells at sides, palms facing forward.',
      'Curl the weights up by flexing the elbows.',
      'Squeeze at the top, then lower controlled.',
      'Keep upper arms stationary.'
    ],
    commonMistakes: [
      'Swinging the weights',
      'Moving the elbows forward',
      'Incomplete range of motion'
    ],
    defaultSets: 3,
    defaultReps: 12,
    defaultRest: 60
  },
  {
    id: 'hammer-curl',
    name: 'Hammer Curl',
    primaryMuscles: ['Biceps', 'Brachialis'],
    secondaryMuscles: ['Forearms'],
    equipment: 'Dumbbells',
    difficulty: 'Beginner',
    instructions: [
      'Hold dumbbells at sides with neutral grip (palms facing each other).',
      'Curl the weights up without rotating the wrists.',
      'Squeeze at the top, lower controlled.'
    ],
    commonMistakes: [
      'Using momentum',
      'Letting elbows drift forward'
    ],
    defaultSets: 3,
    defaultReps: 12,
    defaultRest: 60
  },
  {
    id: 'triceps-pushdown',
    name: 'Triceps Pushdown',
    primaryMuscles: ['Triceps'],
    secondaryMuscles: [],
    equipment: 'Cable',
    difficulty: 'Beginner',
    instructions: [
      'Stand at a cable station with a straight or V-bar attachment.',
      'Elbows pinned at sides, push the bar down until arms are fully extended.',
      'Squeeze the triceps at the bottom.',
      'Return controlled to the start.'
    ],
    commonMistakes: [
      'Letting elbows flare out',
      'Leaning forward excessively',
      'Incomplete lockout'
    ],
    defaultSets: 3,
    defaultReps: 12,
    defaultRest: 60
  },
  {
    id: 'lateral-raise',
    name: 'Lateral Raise',
    primaryMuscles: ['Side Delts'],
    secondaryMuscles: ['Front Delts'],
    equipment: 'Dumbbells',
    difficulty: 'Beginner',
    instructions: [
      'Stand holding dumbbells at sides.',
      'Raise arms out to the sides until parallel to the floor (or slightly higher).',
      'Lead with the elbows, slight bend in the arms.',
      'Lower controlled.'
    ],
    commonMistakes: [
      'Using momentum / swinging',
      'Raising arms too high',
      'Shrugging the traps'
    ],
    defaultSets: 3,
    defaultReps: 12,
    defaultRest: 60
  },
  {
    id: 'face-pull',
    name: 'Face Pull',
    primaryMuscles: ['Rear Delts', 'Upper Back'],
    secondaryMuscles: ['Rotator Cuff'],
    equipment: 'Cable',
    difficulty: 'Beginner',
    instructions: [
      'Set cable at upper chest or face height with rope attachment.',
      'Pull the rope toward your face, externally rotating the shoulders.',
      'Squeeze the rear delts and upper back at the end.',
      'Return controlled.'
    ],
    commonMistakes: [
      'Using too much weight',
      'Not externally rotating',
      'Pulling too low (to the chest)'
    ],
    defaultSets: 3,
    defaultReps: 15,
    defaultRest: 60
  },
  {
    id: 'leg-press',
    name: 'Leg Press',
    primaryMuscles: ['Quads', 'Glutes'],
    secondaryMuscles: ['Hamstrings'],
    equipment: 'Machine',
    difficulty: 'Beginner',
    instructions: [
      'Sit in the leg press with feet shoulder-width on the platform.',
      'Lower the platform by bending the knees until about 90 degrees.',
      'Press back up without locking the knees hard.',
      'Keep lower back against the pad.'
    ],
    commonMistakes: [
      'Going too deep and rounding the lower back',
      'Locking out aggressively',
      'Feet placement too high or too low'
    ],
    defaultSets: 3,
    defaultReps: 10,
    defaultRest: 90
  },
  {
    id: 'leg-extension',
    name: 'Leg Extension',
    primaryMuscles: ['Quads'],
    secondaryMuscles: [],
    equipment: 'Machine',
    difficulty: 'Beginner',
    instructions: [
      'Sit in the leg extension machine, adjust the pad to sit on your lower shins.',
      'Extend the knees fully, squeezing the quads at the top.',
      'Lower controlled without letting the weight stack slam.'
    ],
    commonMistakes: [
      'Using momentum',
      'Hyperextending the knees',
      'Lifting the hips off the seat'
    ],
    defaultSets: 3,
    defaultReps: 12,
    defaultRest: 60
  },
  {
    id: 'leg-curl',
    name: 'Leg Curl',
    primaryMuscles: ['Hamstrings'],
    secondaryMuscles: [],
    equipment: 'Machine',
    difficulty: 'Beginner',
    instructions: [
      'Lie face down (or sit) on the leg curl machine.',
      'Curl the pad toward your glutes by flexing the knees.',
      'Squeeze the hamstrings at the top.',
      'Lower controlled.'
    ],
    commonMistakes: [
      'Using momentum',
      'Lifting the hips',
      'Incomplete range'
    ],
    defaultSets: 3,
    defaultReps: 12,
    defaultRest: 60
  },
  {
    id: 'calf-raise',
    name: 'Calf Raise',
    primaryMuscles: ['Calves'],
    secondaryMuscles: [],
    equipment: 'Machine / Bodyweight',
    difficulty: 'Beginner',
    instructions: [
      'Stand on a raised surface or calf raise machine with the balls of your feet.',
      'Lower heels below the platform for a stretch.',
      'Raise up onto your toes as high as possible.',
      'Squeeze at the top, then lower controlled.'
    ],
    commonMistakes: [
      'Bouncing',
      'Incomplete range of motion',
      'Using too much weight and losing control'
    ],
    defaultSets: 4,
    defaultReps: 15,
    defaultRest: 45
  },
  {
    id: 'lunge',
    name: 'Lunge',
    primaryMuscles: ['Quads', 'Glutes'],
    secondaryMuscles: ['Hamstrings', 'Core'],
    equipment: 'Bodyweight / Dumbbells',
    difficulty: 'Beginner',
    instructions: [
      'Stand tall, step one foot forward.',
      'Lower until both knees are about 90 degrees.',
      'Front knee tracks over the mid-foot.',
      'Push through the front foot to return to standing.',
      'Alternate legs or complete all reps on one side.'
    ],
    commonMistakes: [
      'Front knee caving inward',
      'Trailing knee slamming the floor',
      'Torso leaning too far forward'
    ],
    defaultSets: 3,
    defaultReps: 10,
    defaultRest: 60
  },
  {
    id: 'bulgarian-split-squat',
    name: 'Bulgarian Split Squat',
    primaryMuscles: ['Quads', 'Glutes'],
    secondaryMuscles: ['Hamstrings', 'Core'],
    equipment: 'Dumbbells / Bodyweight',
    difficulty: 'Intermediate',
    instructions: [
      'Place rear foot on a bench or elevated surface.',
      'Front foot far enough forward so the knee stays over the mid-foot.',
      'Lower until the front thigh is parallel to the floor.',
      'Drive through the front foot to stand.',
      'Complete all reps then switch legs.'
    ],
    commonMistakes: [
      'Front foot too close (knee travels past toes excessively)',
      'Leaning too far forward',
      'Not going deep enough'
    ],
    defaultSets: 3,
    defaultReps: 8,
    defaultRest: 75
  },
  {
    id: 'hip-thrust',
    name: 'Hip Thrust',
    primaryMuscles: ['Glutes'],
    secondaryMuscles: ['Hamstrings', 'Core'],
    equipment: 'Barbell / Bodyweight',
    difficulty: 'Beginner',
    instructions: [
      'Sit on the floor with upper back against a bench.',
      'Roll a barbell over your hips (use a pad).',
      'Drive through the heels, thrusting hips up until fully extended.',
      'Squeeze glutes hard at the top.',
      'Lower controlled.'
    ],
    commonMistakes: [
      'Hyperextending the lower back at the top',
      'Not achieving full hip extension',
      'Pushing through the toes instead of heels'
    ],
    defaultSets: 3,
    defaultReps: 10,
    defaultRest: 75
  },
  {
    id: 'plank',
    name: 'Plank',
    primaryMuscles: ['Core'],
    secondaryMuscles: ['Shoulders', 'Glutes'],
    equipment: 'Bodyweight',
    difficulty: 'Beginner',
    instructions: [
      'Start in a forearm plank position.',
      'Body in a straight line from head to heels.',
      'Brace the core, squeeze glutes.',
      'Hold for the prescribed time without sagging or piking.'
    ],
    commonMistakes: [
      'Hips sagging',
      'Hips too high',
      'Holding breath'
    ],
    defaultSets: 3,
    defaultReps: 30,
    defaultRest: 45
  },
  {
    id: 'hanging-knee-raise',
    name: 'Hanging Knee Raise',
    primaryMuscles: ['Abs'],
    secondaryMuscles: ['Hip Flexors'],
    equipment: 'Pull-up Bar',
    difficulty: 'Intermediate',
    instructions: [
      'Hang from a pull-up bar with an overhand grip.',
      'Raise your knees toward your chest by flexing the hips and abs.',
      'Lower controlled without swinging.',
      'Avoid using momentum.'
    ],
    commonMistakes: [
      'Swinging / kipping',
      'Not controlling the descent',
      'Only using hip flexors'
    ],
    defaultSets: 3,
    defaultReps: 10,
    defaultRest: 60
  },
  {
    id: 'crunch',
    name: 'Crunch',
    primaryMuscles: ['Abs'],
    secondaryMuscles: [],
    equipment: 'Bodyweight',
    difficulty: 'Beginner',
    instructions: [
      'Lie on your back, knees bent, feet flat.',
      'Hands lightly behind the head or across the chest.',
      'Curl the upper back off the floor by contracting the abs.',
      'Lower controlled. Do not pull on the neck.'
    ],
    commonMistakes: [
      'Pulling on the neck',
      'Using momentum',
      'Coming up too high (becomes a sit-up)'
    ],
    defaultSets: 3,
    defaultReps: 15,
    defaultRest: 45
  }
,

  {
    id: 'goblet-squat',
    name: 'Goblet Squat',
    primaryMuscles: ['Quads', 'Glutes'],
    secondaryMuscles: ['Core'],
    equipment: 'Dumbbells',
    difficulty: 'Beginner',
    instructions: [
      'Hold one dumbbell vertically at chest height (goblet position).',
      'Stand with feet about shoulder-width, toes slightly out.',
      'Brace your core and sit down between your hips.',
      'Descend until thighs are at least parallel to the floor.',
      'Drive through mid-foot to stand tall without leaning forward.'
    ],
    commonMistakes: [
      'Letting the elbows flare and the weight drift forward',
      'Heels lifting off the floor',
      'Rounding the upper back'
    ],
    defaultSets: 3,
    defaultReps: 10,
    defaultRest: 90
  },
  {
    id: 'dumbbell-rdl',
    name: 'Dumbbell Romanian Deadlift',
    primaryMuscles: ['Hamstrings', 'Glutes'],
    secondaryMuscles: ['Lower Back', 'Core'],
    equipment: 'Dumbbells',
    difficulty: 'Beginner',
    instructions: [
      'Hold dumbbells at your sides with a neutral grip.',
      'Soft knees, hinge at the hips pushing them back.',
      'Lower the weights along your legs until you feel a hamstring stretch.',
      'Keep the back flat and dumbbells close to the body.',
      'Drive the hips forward to return to standing.'
    ],
    commonMistakes: [
      'Rounding the lower back',
      'Turning it into a squat by bending the knees too much',
      'Letting the weights drift away from the legs'
    ],
    defaultSets: 3,
    defaultReps: 10,
    defaultRest: 90
  },
  {
    id: 'dumbbell-overhead-press',
    name: 'Dumbbell Overhead Press',
    primaryMuscles: ['Shoulders'],
    secondaryMuscles: ['Triceps', 'Upper Chest', 'Core'],
    equipment: 'Dumbbells',
    difficulty: 'Beginner',
    instructions: [
      'Stand or sit holding dumbbells at shoulder height, palms forward or neutral.',
      'Brace your core and glutes.',
      'Press the dumbbells overhead until arms are locked out.',
      'Lower with control back to the shoulders.',
      'Avoid excessive lower-back arch.'
    ],
    commonMistakes: [
      'Pressing the weights forward instead of up',
      'Flaring the ribs and overarching the low back',
      'Incomplete lockout'
    ],
    defaultSets: 3,
    defaultReps: 8,
    defaultRest: 90
  },
  {
    id: 'incline-dumbbell-press',
    name: 'Incline Dumbbell Press',
    primaryMuscles: ['Upper Chest'],
    secondaryMuscles: ['Front Delts', 'Triceps'],
    equipment: 'Dumbbells',
    difficulty: 'Beginner',
    instructions: [
      'Set a bench to about 30–45 degrees.',
      'Hold dumbbells at chest level with palms facing forward.',
      'Press up until arms are extended without locking aggressively.',
      'Lower with control until elbows are about 90 degrees or slightly deeper.',
      'Keep shoulder blades lightly retracted against the bench.'
    ],
    commonMistakes: [
      'Setting the incline too steep (becomes a shoulder press)',
      'Bouncing at the bottom',
      'Flaring elbows excessively'
    ],
    defaultSets: 3,
    defaultReps: 10,
    defaultRest: 75
  },
  {
    id: 'dumbbell-lunges',
    name: 'Dumbbell Lunge',
    primaryMuscles: ['Quads', 'Glutes'],
    secondaryMuscles: ['Hamstrings', 'Core'],
    equipment: 'Dumbbells',
    difficulty: 'Beginner',
    instructions: [
      'Hold dumbbells at your sides.',
      'Step one foot forward and lower until both knees are about 90 degrees.',
      'Front knee tracks over the mid-foot.',
      'Push through the front foot to return to standing.',
      'Alternate legs or finish all reps on one side first.'
    ],
    commonMistakes: [
      'Front knee caving inward',
      'Short stepping so the knee shoots past the toes excessively',
      'Torso collapsing forward'
    ],
    defaultSets: 3,
    defaultReps: 10,
    defaultRest: 60
  },
,

  {
    id: 'chest-supported-db-row',
    name: 'Chest-Supported Dumbbell Row',
    primaryMuscles: ['Lats', 'Upper Back'],
    secondaryMuscles: ['Biceps', 'Rear Delts'],
    equipment: 'Dumbbells',
    difficulty: 'Intermediate',
    instructions: [
      'Lie chest-down on an incline bench set around 30–45 degrees.',
      'Hold dumbbells with arms hanging straight down.',
      'Row the weights toward your hips, squeezing your shoulder blades.',
      'Lower under control without bouncing.',
      'Keep your chest glued to the pad.'
    ],
    commonMistakes: ['Using momentum', 'Shrugging the traps heavily', 'Short range of motion'],
    defaultSets: 3, defaultReps: 10, defaultRest: 90
  },
  {
    id: 'seated-db-shoulder-press',
    name: 'Seated Dumbbell Shoulder Press',
    primaryMuscles: ['Shoulders'],
    secondaryMuscles: ['Triceps', 'Upper Chest'],
    equipment: 'Dumbbells',
    difficulty: 'Beginner',
    instructions: [
      'Sit on a bench with back support holding dumbbells at shoulder height.',
      'Press overhead until arms are nearly locked out.',
      'Lower with control to the shoulders.',
      'Keep ribs down and avoid excessive arching.'
    ],
    commonMistakes: ['Overarching the lower back', 'Pressing forward instead of up'],
    defaultSets: 3, defaultReps: 8, defaultRest: 120
  },
  {
    id: 'alternating-db-curl',
    name: 'Alternating Dumbbell Curl',
    primaryMuscles: ['Biceps'],
    secondaryMuscles: ['Forearms'],
    equipment: 'Dumbbells',
    difficulty: 'Beginner',
    instructions: [
      'Stand holding dumbbells at your sides, palms forward or neutral.',
      'Curl one arm up while keeping the elbow close to your torso.',
      'Lower under control and switch arms.',
      'Avoid swinging the torso.'
    ],
    commonMistakes: ['Using momentum', 'Elbows drifting forward'],
    defaultSets: 2, defaultReps: 12, defaultRest: 60
  },
  {
    id: 'lying-db-tricep-extension',
    name: 'Lying Dumbbell Triceps Extension',
    primaryMuscles: ['Triceps'],
    secondaryMuscles: [],
    equipment: 'Dumbbells',
    difficulty: 'Intermediate',
    instructions: [
      'Lie on a flat bench holding dumbbells above your chest, arms extended.',
      'Bend only at the elbows to lower the weights toward your forehead or beside your head.',
      'Extend the elbows to return to the start.',
      'Keep upper arms relatively fixed.'
    ],
    commonMistakes: ['Flaring elbows excessively', 'Moving the shoulders instead of the elbows'],
    defaultSets: 2, defaultReps: 12, defaultRest: 60
  },
  {
    id: 'db-glute-bridge',
    name: 'Dumbbell Glute Bridge',
    primaryMuscles: ['Glutes'],
    secondaryMuscles: ['Hamstrings', 'Core'],
    equipment: 'Dumbbells',
    difficulty: 'Beginner',
    instructions: [
      'Lie on your back, knees bent, feet flat, dumbbell resting on hips.',
      'Drive through the heels to raise hips until torso and thighs align.',
      'Squeeze glutes at the top, then lower with control.',
      'Do not hyperextend the lower back.'
    ],
    commonMistakes: ['Pushing through the toes', 'Overarching the low back'],
    defaultSets: 3, defaultReps: 10, defaultRest: 90
  },
  {
    id: 'weighted-crunch',
    name: 'Weighted Crunch',
    primaryMuscles: ['Abs'],
    secondaryMuscles: ['Core'],
    equipment: 'Dumbbells',
    difficulty: 'Beginner',
    instructions: [
      'Lie on your back holding a light dumbbell on your chest or behind your head.',
      'Curl the ribcage toward the pelvis, lifting shoulders slightly off the floor.',
      'Lower under control without yanking the neck.'
    ],
    commonMistakes: ['Pulling on the neck', 'Using only hip flexors'],
    defaultSets: 3, defaultReps: 12, defaultRest: 60
  },
  {
    id: 'rear-delt-fly',
    name: 'Rear-Delt Fly',
    primaryMuscles: ['Rear Delts'],
    secondaryMuscles: ['Upper Back'],
    equipment: 'Dumbbells',
    difficulty: 'Beginner',
    instructions: [
      'Hinge at the hips with a slight knee bend, dumbbells hanging below.',
      'Raise arms out to the sides with a soft elbow bend, squeezing rear delts.',
      'Lower under control.',
      'Avoid swinging or using the lower back.'
    ],
    commonMistakes: ['Using too much weight', 'Shrugging traps'],
    defaultSets: 3, defaultReps: 15, defaultRest: 60
  },
  {
    id: 'seated-db-tricep-extension',
    name: 'Seated Dumbbell Triceps Extension',
    primaryMuscles: ['Triceps'],
    secondaryMuscles: [],
    equipment: 'Dumbbells',
    difficulty: 'Beginner',
    instructions: [
      'Sit holding one or two dumbbells overhead with arms extended.',
      'Bend the elbows to lower the weight behind the head.',
      'Extend the elbows to lock out without flaring excessively.'
    ],
    commonMistakes: ['Elbows flaring wide', 'Incomplete range of motion'],
    defaultSets: 3, defaultReps: 12, defaultRest: 60
  },
  {
    id: 'db-wrist-curl',
    name: 'Dumbbell Wrist Curl',
    primaryMuscles: ['Forearms'],
    secondaryMuscles: [],
    equipment: 'Dumbbells',
    difficulty: 'Beginner',
    instructions: [
      'Sit with forearms on thighs, wrists hanging past the knees, palms up.',
      'Curl the weights up by flexing the wrists, then lower slowly.'
    ],
    commonMistakes: ['Using the arms instead of the wrists', 'Rushing the eccentric'],
    defaultSets: 2, defaultReps: 15, defaultRest: 45
  },
  {
    id: 'db-reverse-wrist-curl',
    name: 'Reverse Wrist Curl',
    primaryMuscles: ['Forearms'],
    secondaryMuscles: [],
    equipment: 'Dumbbells',
    difficulty: 'Beginner',
    instructions: [
      'Same setup as wrist curls but palms face down.',
      'Extend the wrists to lift the weights, then lower under control.'
    ],
    commonMistakes: ['Too much weight', 'Elbow movement'],
    defaultSets: 2, defaultReps: 15, defaultRest: 45
  },
  {
    id: 'dead-bug',
    name: 'Dead Bug',
    primaryMuscles: ['Core'],
    secondaryMuscles: ['Abs'],
    equipment: 'Bodyweight',
    difficulty: 'Beginner',
    instructions: [
      'Lie on your back, arms up, knees bent 90 degrees.',
      'Press low back into the floor.',
      'Extend opposite arm and leg slowly, then return and switch sides.',
      'Keep the core braced the entire time.'
    ],
    commonMistakes: ['Arching the low back', 'Moving too fast'],
    defaultSets: 3, defaultReps: 10, defaultRest: 45
  },
  {
    id: 'front-loaded-db-squat',
    name: 'Front-Loaded Dumbbell Squat',
    primaryMuscles: ['Quads', 'Glutes'],
    secondaryMuscles: ['Core'],
    equipment: 'Dumbbells',
    difficulty: 'Intermediate',
    instructions: [
      'Hold dumbbells at shoulder height (front rack) or in a goblet position.',
      'Squat down with upright torso until thighs are at least parallel.',
      'Drive up through mid-foot to stand.',
      'Keep elbows high if using a front rack.'
    ],
    commonMistakes: ['Torso collapsing forward', 'Heels rising'],
    defaultSets: 4, defaultReps: 8, defaultRest: 120
  },
  {
    id: 'db-reverse-lunge',
    name: 'Dumbbell Reverse Lunge',
    primaryMuscles: ['Quads', 'Glutes'],
    secondaryMuscles: ['Hamstrings', 'Core'],
    equipment: 'Dumbbells',
    difficulty: 'Beginner',
    instructions: [
      'Hold dumbbells at your sides.',
      'Step one foot back and lower until both knees are about 90 degrees.',
      'Drive through the front foot to stand.',
      'Alternate legs or complete one side at a time.'
    ],
    commonMistakes: ['Front knee caving in', 'Short stepping'],
    defaultSets: 3, defaultReps: 8, defaultRest: 90
  },
  {
    id: 'single-leg-glute-bridge',
    name: 'Single-Leg Glute Bridge',
    primaryMuscles: ['Glutes'],
    secondaryMuscles: ['Hamstrings', 'Core'],
    equipment: 'Bodyweight',
    difficulty: 'Intermediate',
    instructions: [
      'Lie on your back, one knee bent, other leg extended or bent in the air.',
      'Drive through the planted heel to lift the hips.',
      'Squeeze the glute at the top, lower with control.',
      'Complete all reps on one side, then switch.'
    ],
    commonMistakes: ['Hips rotating', 'Pushing through the toes'],
    defaultSets: 3, defaultReps: 10, defaultRest: 60
  },
  {
    id: 'side-plank',
    name: 'Side Plank',
    primaryMuscles: ['Core', 'Obliques'],
    secondaryMuscles: ['Shoulders'],
    equipment: 'Bodyweight',
    difficulty: 'Beginner',
    instructions: [
      'Lie on one side, elbow under shoulder, legs stacked.',
      'Lift hips so body forms a straight line.',
      'Hold for the prescribed time, then switch sides.',
      'Do not let the hips sag.'
    ],
    commonMistakes: ['Hips dropping', 'Rolling forward or back'],
    defaultSets: 3, defaultReps: 30, defaultRest: 45
  },
  {
    id: 'db-pullover',
    name: 'Dumbbell Pullover',
    primaryMuscles: ['Lats', 'Chest'],
    secondaryMuscles: ['Triceps', 'Serratus'],
    equipment: 'Dumbbells',
    difficulty: 'Intermediate',
    instructions: [
      'Lie on a bench holding one dumbbell over your chest with both hands.',
      'With a slight elbow bend, lower the weight behind your head in an arc.',
      'Pull the weight back over the chest by engaging the lats.',
      'Keep ribs down and avoid excessive lower-back arch.'
    ],
    commonMistakes: ['Going too deep with a weak shoulder position', 'Using only the arms'],
    defaultSets: 3, defaultReps: 10, defaultRest: 90
  },
  {
    id: 'cross-body-hammer-curl',
    name: 'Cross-Body Hammer Curl',
    primaryMuscles: ['Biceps', 'Brachialis'],
    secondaryMuscles: ['Forearms'],
    equipment: 'Dumbbells',
    difficulty: 'Beginner',
    instructions: [
      'Stand with dumbbells at your sides, neutral grip.',
      'Curl one weight across the body toward the opposite shoulder.',
      'Lower under control and alternate sides.'
    ],
    commonMistakes: ['Swinging the torso', 'Shrugging the shoulder'],
    defaultSets: 2, defaultReps: 12, defaultRest: 60
  },
  {
    id: 'db-tricep-extension',
    name: 'Dumbbell Triceps Extension',
    primaryMuscles: ['Triceps'],
    secondaryMuscles: [],
    equipment: 'Dumbbells',
    difficulty: 'Beginner',
    instructions: [
      'Hold a dumbbell overhead with both hands or one in each hand.',
      'Bend the elbows to lower behind the head.',
      'Extend fully without locking out aggressively.'
    ],
    commonMistakes: ['Elbows flaring', 'Incomplete range'],
    defaultSets: 2, defaultReps: 12, defaultRest: 60
  },
,

  {
    id: 'brisk-walk',
    name: 'Brisk Walk',
    primaryMuscles: ['Cardio'],
    secondaryMuscles: ['Legs'],
    equipment: 'Bodyweight',
    difficulty: 'Beginner',
    instructions: [
      'Walk at a pace that raises your heart rate but still allows conversation.',
      'Aim for continuous movement for the prescribed time.',
      'Use comfortable shoes and flat or gently rolling terrain.',
      'This is recovery-oriented — keep effort moderate.'
    ],
    commonMistakes: ['Going too hard (turns into a workout day)', 'Skipping entirely when optional'],
    defaultSets: 1, defaultReps: 30, defaultRest: 0
  },
  {
    id: 'easy-bike',
    name: 'Easy Bike / Cycle',
    primaryMuscles: ['Cardio'],
    secondaryMuscles: ['Legs'],
    equipment: 'Machine',
    difficulty: 'Beginner',
    instructions: [
      'Cycle at an easy, sustainable pace.',
      'Keep resistance light — conversational effort.',
      'Focus on smooth cadence, not max power.',
      'Optional recovery session only.'
    ],
    commonMistakes: ['Hard intervals on a rest day', 'Skipping warm-up if joints feel stiff'],
    defaultSets: 1, defaultReps: 25, defaultRest: 0
  },
  {
    id: 'light-mobility',
    name: 'Gentle Mobility Flow',
    primaryMuscles: ['Full Body'],
    secondaryMuscles: [],
    equipment: 'Bodyweight',
    difficulty: 'Beginner',
    instructions: [
      'Move through light hip, shoulder, and spine mobility for the prescribed time.',
      'Examples: cat-cow, hip circles, shoulder openers, easy bodyweight squats.',
      'Stay pain-free and relaxed — no max stretches.',
      'Breathe steadily throughout.'
    ],
    commonMistakes: ['Forcing deep stretches when sore', 'Turning mobility into a hard workout'],
    defaultSets: 1, defaultReps: 15, defaultRest: 0
  },
];

const FOOD_DATABASE = [
  { id: 'chicken-breast', name: 'Chicken Breast', serving: '4 oz', servingGrams: 113, calories: 187, protein: 35, carbs: 0, fat: 4 },
  { id: 'chicken-thighs', name: 'Chicken Thighs', serving: '4 oz', servingGrams: 113, calories: 229, protein: 24, carbs: 0, fat: 14 },
  { id: 'ground-beef', name: 'Ground Beef (90% lean)', serving: '4 oz', servingGrams: 113, calories: 240, protein: 28, carbs: 0, fat: 14 },
  { id: 'turkey', name: 'Turkey Breast', serving: '4 oz', servingGrams: 113, calories: 170, protein: 34, carbs: 0, fat: 2 },
  { id: 'salmon', name: 'Salmon', serving: '4 oz', servingGrams: 113, calories: 230, protein: 25, carbs: 0, fat: 14 },
  { id: 'eggs', name: 'Eggs (large)', serving: '1 egg', servingGrams: 50, calories: 72, protein: 6, carbs: 0, fat: 5 },
  { id: 'greek-yogurt', name: 'Greek Yogurt (plain, nonfat)', serving: '1 cup', servingGrams: 245, calories: 130, protein: 23, carbs: 9, fat: 0 },
  { id: 'milk', name: 'Milk (2%)', serving: '1 cup', servingGrams: 244, calories: 122, protein: 8, carbs: 12, fat: 5 },
  { id: 'cheese', name: 'Cheddar Cheese', serving: '1 oz', servingGrams: 28, calories: 113, protein: 7, carbs: 0, fat: 9 },
  { id: 'rice', name: 'White Rice (cooked)', serving: '1 cup', servingGrams: 158, calories: 205, protein: 4, carbs: 45, fat: 0 },
  { id: 'oatmeal', name: 'Oatmeal (dry)', serving: '1/2 cup', servingGrams: 40, calories: 150, protein: 5, carbs: 27, fat: 3 },
  { id: 'bread', name: 'Whole Wheat Bread', serving: '1 slice', servingGrams: 28, calories: 80, protein: 4, carbs: 14, fat: 1 },
  { id: 'pasta', name: 'Pasta (cooked)', serving: '1 cup', servingGrams: 140, calories: 220, protein: 8, carbs: 43, fat: 1 },
  { id: 'potatoes', name: 'Potato (baked)', serving: '1 medium', servingGrams: 173, calories: 161, protein: 4, carbs: 37, fat: 0 },
  { id: 'banana', name: 'Banana', serving: '1 medium', servingGrams: 118, calories: 105, protein: 1, carbs: 27, fat: 0 },
  { id: 'apple', name: 'Apple', serving: '1 medium', servingGrams: 182, calories: 95, protein: 0, carbs: 25, fat: 0 },
  { id: 'peanut-butter', name: 'Peanut Butter', serving: '2 tbsp', servingGrams: 32, calories: 188, protein: 8, carbs: 6, fat: 16 },
  { id: 'olive-oil', name: 'Olive Oil', serving: '1 tbsp', servingGrams: 14, calories: 119, protein: 0, carbs: 0, fat: 14 },
  { id: 'avocado', name: 'Avocado', serving: '1/2 medium', servingGrams: 68, calories: 114, protein: 1, carbs: 6, fat: 10 },
  { id: 'broccoli', name: 'Broccoli (cooked)', serving: '1 cup', servingGrams: 156, calories: 55, protein: 4, carbs: 11, fat: 0 },
  { id: 'spinach', name: 'Spinach (raw)', serving: '2 cups', servingGrams: 60, calories: 14, protein: 2, carbs: 2, fat: 0 },
  { id: 'sweet-potato', name: 'Sweet Potato (baked)', serving: '1 medium', servingGrams: 114, calories: 103, protein: 2, carbs: 24, fat: 0 },
  { id: 'whey-protein', name: 'Whey Protein Powder', serving: '1 scoop', servingGrams: 30, calories: 120, protein: 24, carbs: 3, fat: 1 },
  { id: 'almonds', name: 'Almonds', serving: '1 oz (23 nuts)', servingGrams: 28, calories: 160, protein: 6, carbs: 6, fat: 14 },
  { id: 'tuna', name: 'Canned Tuna (in water)', serving: '1 can (3 oz)', servingGrams: 85, calories: 73, protein: 16, carbs: 0, fat: 1 },
  { id: 'cottage-cheese', name: 'Cottage Cheese (low-fat)', serving: '1/2 cup', servingGrams: 113, calories: 90, protein: 14, carbs: 4, fat: 2 },
  { id: 'protein-bar', name: 'Protein Bar (generic)', serving: '1 bar', servingGrams: 60, calories: 200, protein: 20, carbs: 22, fat: 6 },
  { id: 'brown-rice', name: 'Brown Rice (cooked)', serving: '1 cup', servingGrams: 195, calories: 215, protein: 5, carbs: 45, fat: 2 }
];

// Starter "My Workouts" when user has none
const DEFAULT_WORKOUTS = [
  {
    id: 'default-upper',
    name: 'Upper Strength',
    exercises: [
      { exerciseId: 'bench-press', sets: 4, reps: 8, weight: 0, rest: 90 },
      { exerciseId: 'overhead-press', sets: 3, reps: 8, weight: 0, rest: 90 },
      { exerciseId: 'barbell-row', sets: 4, reps: 8, weight: 0, rest: 90 },
      { exerciseId: 'lat-pulldown', sets: 3, reps: 10, weight: 0, rest: 75 },
      { exerciseId: 'biceps-curl', sets: 3, reps: 12, weight: 0, rest: 60 }
    ]
  },
  {
    id: 'default-lower',
    name: 'Lower Strength',
    exercises: [
      { exerciseId: 'squat', sets: 4, reps: 6, weight: 0, rest: 120 },
      { exerciseId: 'romanian-deadlift', sets: 3, reps: 8, weight: 0, rest: 90 },
      { exerciseId: 'leg-press', sets: 3, reps: 10, weight: 0, rest: 90 },
      { exerciseId: 'leg-curl', sets: 3, reps: 12, weight: 0, rest: 60 },
      { exerciseId: 'calf-raise', sets: 4, reps: 15, weight: 0, rest: 45 }
    ]
  }
];

/* ============================================================
   WORKOUT LIBRARY — browseable templates (not user data)
   ============================================================ */
const WORKOUT_LIBRARY = [
  // —— STRENGTH ——
  {
    id: 'lib-upper-strength',
    name: 'Upper Strength',
    category: 'Strength',
    dumbbellVariantId: 'lib-upper-strength-db',
    goal: 'Strength',
    difficulty: 'Intermediate',
    duration: 55,
    equipment: ['Barbell', 'Cable', 'Bench'],
    description: 'Heavy compound focus for upper-body strength. Prioritize progressive overload on the main lifts.',
    muscles: ['Chest', 'Back', 'Shoulders', 'Arms'],
    exercises: [
      { exerciseId: 'bench-press', sets: 4, reps: 6, repsMax: 8, rest: 120 },
      { exerciseId: 'barbell-row', sets: 4, reps: 6, repsMax: 8, rest: 120 },
      { exerciseId: 'overhead-press', sets: 3, reps: 6, repsMax: 8, rest: 90 },
      { exerciseId: 'lat-pulldown', sets: 3, reps: 8, repsMax: 10, rest: 90 },
      { exerciseId: 'biceps-curl', sets: 3, reps: 8, repsMax: 12, rest: 60 },
      { exerciseId: 'triceps-pushdown', sets: 3, reps: 8, repsMax: 12, rest: 60 }
    ]
  },
  {
    id: 'lib-lower-strength',
    name: 'Lower Strength',
    category: 'Strength',
    dumbbellVariantId: 'lib-lower-strength-db',
    goal: 'Strength',
    difficulty: 'Intermediate',
    duration: 60,
    equipment: ['Barbell', 'Machine'],
    description: 'Squat and hinge focused lower-body strength session with accessory work.',
    muscles: ['Quads', 'Glutes', 'Hamstrings', 'Calves'],
    exercises: [
      { exerciseId: 'squat', sets: 4, reps: 5, repsMax: 6, rest: 150 },
      { exerciseId: 'romanian-deadlift', sets: 3, reps: 6, repsMax: 8, rest: 120 },
      { exerciseId: 'leg-press', sets: 3, reps: 8, repsMax: 10, rest: 90 },
      { exerciseId: 'leg-curl', sets: 3, reps: 8, repsMax: 12, rest: 75 },
      { exerciseId: 'calf-raise', sets: 4, reps: 10, repsMax: 15, rest: 60 }
    ]
  },
  {
    id: 'lib-full-strength',
    name: 'Full Body Strength',
    category: 'Strength',
    dumbbellVariantId: 'lib-full-strength-db',
    goal: 'Strength',
    difficulty: 'Intermediate',
    duration: 65,
    equipment: ['Barbell', 'Cable'],
    description: 'One heavy session hitting major movement patterns: squat, hinge, push, pull.',
    muscles: ['Full Body'],
    exercises: [
      { exerciseId: 'squat', sets: 4, reps: 5, repsMax: 6, rest: 150 },
      { exerciseId: 'bench-press', sets: 4, reps: 5, repsMax: 6, rest: 120 },
      { exerciseId: 'deadlift', sets: 3, reps: 3, repsMax: 5, rest: 180 },
      { exerciseId: 'barbell-row', sets: 3, reps: 6, repsMax: 8, rest: 90 },
      { exerciseId: 'overhead-press', sets: 3, reps: 6, repsMax: 8, rest: 90 }
    ]
  },
  {
    id: 'lib-push-strength',
    name: 'Push Strength',
    category: 'Strength',
    dumbbellVariantId: 'lib-push-strength-db',
    goal: 'Strength',
    difficulty: 'Intermediate',
    duration: 50,
    equipment: ['Barbell', 'Dumbbells', 'Cable'],
    description: 'Horizontal and vertical pressing with triceps finishers.',
    muscles: ['Chest', 'Shoulders', 'Triceps'],
    exercises: [
      { exerciseId: 'bench-press', sets: 4, reps: 5, repsMax: 6, rest: 120 },
      { exerciseId: 'overhead-press', sets: 4, reps: 5, repsMax: 6, rest: 120 },
      { exerciseId: 'incline-bench-press', sets: 3, reps: 6, repsMax: 8, rest: 90 },
      { exerciseId: 'triceps-pushdown', sets: 3, reps: 8, repsMax: 12, rest: 60 }
    ]
  },
  {
    id: 'lib-pull-strength',
    name: 'Pull Strength',
    category: 'Strength',
    dumbbellVariantId: 'lib-pull-strength-db',
    goal: 'Strength',
    difficulty: 'Intermediate',
    duration: 50,
    equipment: ['Barbell', 'Pull-up Bar', 'Cable'],
    description: 'Heavy rows, pulls, and hinge work for back thickness and strength.',
    muscles: ['Back', 'Lats', 'Biceps'],
    exercises: [
      { exerciseId: 'deadlift', sets: 3, reps: 3, repsMax: 5, rest: 180 },
      { exerciseId: 'pull-up', sets: 4, reps: 5, repsMax: 8, rest: 120 },
      { exerciseId: 'barbell-row', sets: 4, reps: 6, repsMax: 8, rest: 90 },
      { exerciseId: 'face-pull', sets: 3, reps: 12, repsMax: 15, rest: 60 },
      { exerciseId: 'biceps-curl', sets: 3, reps: 8, repsMax: 12, rest: 60 }
    ]
  },
  {
    id: 'lib-leg-strength',
    name: 'Leg Strength',
    category: 'Strength',
    dumbbellVariantId: 'lib-leg-strength-db',
    goal: 'Strength',
    difficulty: 'Advanced',
    duration: 60,
    equipment: ['Barbell', 'Machine'],
    description: 'High-intensity lower-body strength with unilateral and posterior emphasis.',
    muscles: ['Quads', 'Glutes', 'Hamstrings'],
    exercises: [
      { exerciseId: 'squat', sets: 5, reps: 5, repsMax: 5, rest: 180 },
      { exerciseId: 'romanian-deadlift', sets: 4, reps: 6, repsMax: 8, rest: 120 },
      { exerciseId: 'bulgarian-split-squat', sets: 3, reps: 6, repsMax: 8, rest: 90 },
      { exerciseId: 'leg-curl', sets: 3, reps: 8, repsMax: 10, rest: 75 },
      { exerciseId: 'calf-raise', sets: 4, reps: 10, repsMax: 12, rest: 60 }
    ]
  },

  // —— HYPERTROPHY ——
  {
    id: 'lib-upper-hyper',
    name: 'Upper Hypertrophy',
    category: 'Hypertrophy',
    dumbbellVariantId: 'lib-upper-hyper-db',
    goal: 'Muscle',
    difficulty: 'Intermediate',
    duration: 55,
    equipment: ['Barbell', 'Dumbbells', 'Cable'],
    description: 'Moderate loads, higher volume for upper-body muscle growth.',
    muscles: ['Chest', 'Back', 'Shoulders', 'Arms'],
    exercises: [
      { exerciseId: 'bench-press', sets: 4, reps: 8, repsMax: 12, rest: 90 },
      { exerciseId: 'incline-bench-press', sets: 3, reps: 10, repsMax: 12, rest: 75 },
      { exerciseId: 'barbell-row', sets: 4, reps: 8, repsMax: 12, rest: 90 },
      { exerciseId: 'lat-pulldown', sets: 3, reps: 10, repsMax: 12, rest: 75 },
      { exerciseId: 'lateral-raise', sets: 3, reps: 12, repsMax: 15, rest: 60 },
      { exerciseId: 'biceps-curl', sets: 3, reps: 10, repsMax: 15, rest: 45 },
      { exerciseId: 'triceps-pushdown', sets: 3, reps: 10, repsMax: 15, rest: 45 }
    ]
  },
  {
    id: 'lib-lower-hyper',
    name: 'Lower Hypertrophy',
    category: 'Hypertrophy',
    dumbbellVariantId: 'lib-lower-hyper-db',
    goal: 'Muscle',
    difficulty: 'Intermediate',
    duration: 55,
    equipment: ['Barbell', 'Machine', 'Dumbbells'],
    description: 'Volume-focused leg day for quads, glutes, and hamstrings.',
    muscles: ['Quads', 'Glutes', 'Hamstrings', 'Calves'],
    exercises: [
      { exerciseId: 'squat', sets: 4, reps: 8, repsMax: 12, rest: 120 },
      { exerciseId: 'romanian-deadlift', sets: 3, reps: 10, repsMax: 12, rest: 90 },
      { exerciseId: 'leg-press', sets: 3, reps: 10, repsMax: 15, rest: 90 },
      { exerciseId: 'leg-extension', sets: 3, reps: 12, repsMax: 15, rest: 60 },
      { exerciseId: 'leg-curl', sets: 3, reps: 12, repsMax: 15, rest: 60 },
      { exerciseId: 'calf-raise', sets: 4, reps: 12, repsMax: 20, rest: 45 }
    ]
  },
  {
    id: 'lib-push-hyper',
    name: 'Push Hypertrophy',
    category: 'Hypertrophy',
    dumbbellVariantId: 'lib-push-hyper-db',
    goal: 'Muscle',
    difficulty: 'Intermediate',
    duration: 50,
    equipment: ['Barbell', 'Dumbbells', 'Cable'],
    description: 'Chest, shoulders, and triceps volume work.',
    muscles: ['Chest', 'Shoulders', 'Triceps'],
    exercises: [
      { exerciseId: 'bench-press', sets: 4, reps: 8, repsMax: 12, rest: 90 },
      { exerciseId: 'incline-bench-press', sets: 3, reps: 10, repsMax: 12, rest: 75 },
      { exerciseId: 'dumbbell-bench-press', sets: 3, reps: 10, repsMax: 12, rest: 75 },
      { exerciseId: 'overhead-press', sets: 3, reps: 8, repsMax: 12, rest: 75 },
      { exerciseId: 'lateral-raise', sets: 3, reps: 12, repsMax: 15, rest: 45 },
      { exerciseId: 'triceps-pushdown', sets: 3, reps: 12, repsMax: 15, rest: 45 }
    ]
  },
  {
    id: 'lib-pull-hyper',
    name: 'Pull Hypertrophy',
    category: 'Hypertrophy',
    dumbbellVariantId: 'lib-pull-hyper-db',
    goal: 'Muscle',
    difficulty: 'Intermediate',
    duration: 50,
    equipment: ['Barbell', 'Dumbbells', 'Cable', 'Pull-up Bar'],
    description: 'Back width and thickness with biceps accessories.',
    muscles: ['Lats', 'Upper Back', 'Biceps'],
    exercises: [
      { exerciseId: 'pull-up', sets: 4, reps: 6, repsMax: 10, rest: 90 },
      { exerciseId: 'barbell-row', sets: 4, reps: 8, repsMax: 12, rest: 90 },
      { exerciseId: 'one-arm-dumbbell-row', sets: 3, reps: 10, repsMax: 12, rest: 75 },
      { exerciseId: 'cable-row', sets: 3, reps: 10, repsMax: 12, rest: 75 },
      { exerciseId: 'face-pull', sets: 3, reps: 15, repsMax: 20, rest: 45 },
      { exerciseId: 'hammer-curl', sets: 3, reps: 10, repsMax: 15, rest: 45 }
    ]
  },
  {
    id: 'lib-leg-hyper',
    name: 'Leg Hypertrophy',
    category: 'Hypertrophy',
    dumbbellVariantId: 'lib-leg-hyper-db',
    goal: 'Muscle',
    difficulty: 'Intermediate',
    duration: 55,
    equipment: ['Barbell', 'Machine', 'Dumbbells'],
    description: 'High-volume lower body for muscle growth.',
    muscles: ['Quads', 'Glutes', 'Hamstrings'],
    exercises: [
      { exerciseId: 'squat', sets: 4, reps: 8, repsMax: 12, rest: 120 },
      { exerciseId: 'hip-thrust', sets: 3, reps: 10, repsMax: 15, rest: 90 },
      { exerciseId: 'bulgarian-split-squat', sets: 3, reps: 10, repsMax: 12, rest: 75 },
      { exerciseId: 'leg-extension', sets: 3, reps: 12, repsMax: 15, rest: 60 },
      { exerciseId: 'leg-curl', sets: 3, reps: 12, repsMax: 15, rest: 60 },
      { exerciseId: 'calf-raise', sets: 4, reps: 15, repsMax: 20, rest: 45 }
    ]
  },

  // —— BEGINNER ——
  {
    id: 'lib-beginner-3day',
    name: '3-Day Full Body',
    category: 'Beginner',
    goal: 'General fitness',
    difficulty: 'Beginner',
    duration: 45,
    equipment: ['Barbell', 'Dumbbells', 'Machine'],
    description: 'Simple full-body template. Run 3× per week with a rest day between sessions.',
    muscles: ['Full Body'],
    exercises: [
      { exerciseId: 'squat', sets: 3, reps: 8, repsMax: 10, rest: 120 },
      { exerciseId: 'bench-press', sets: 3, reps: 8, repsMax: 10, rest: 90 },
      { exerciseId: 'barbell-row', sets: 3, reps: 8, repsMax: 10, rest: 90 },
      { exerciseId: 'overhead-press', sets: 2, reps: 8, repsMax: 10, rest: 75 },
      { exerciseId: 'plank', sets: 3, reps: 30, repsMax: 45, rest: 45 }
    ]
  },
  {
    id: 'lib-beginner-4day',
    name: '4-Day Beginner',
    category: 'Beginner',
    goal: 'General fitness',
    difficulty: 'Beginner',
    duration: 40,
    equipment: ['Barbell', 'Dumbbells', 'Cable'],
    description: 'Upper/Lower split for beginners. Alternate Upper A / Lower A / Upper B / Lower B.',
    muscles: ['Full Body'],
    exercises: [
      { exerciseId: 'bench-press', sets: 3, reps: 8, repsMax: 10, rest: 90 },
      { exerciseId: 'barbell-row', sets: 3, reps: 8, repsMax: 10, rest: 90 },
      { exerciseId: 'overhead-press', sets: 2, reps: 8, repsMax: 10, rest: 75 },
      { exerciseId: 'lat-pulldown', sets: 3, reps: 10, repsMax: 12, rest: 75 },
      { exerciseId: 'biceps-curl', sets: 2, reps: 10, repsMax: 12, rest: 60 },
      { exerciseId: 'triceps-pushdown', sets: 2, reps: 10, repsMax: 12, rest: 60 }
    ]
  },
  {
    id: 'lib-beginner-full',
    name: 'Full Body Beginner',
    category: 'Beginner',
    goal: 'General fitness',
    difficulty: 'Beginner',
    duration: 40,
    equipment: ['Dumbbells', 'Machine', 'Bodyweight'],
    description: 'Machine and dumbbell friendly intro session.',
    muscles: ['Full Body'],
    exercises: [
      { exerciseId: 'leg-press', sets: 3, reps: 10, repsMax: 12, rest: 90 },
      { exerciseId: 'dumbbell-bench-press', sets: 3, reps: 10, repsMax: 12, rest: 75 },
      { exerciseId: 'one-arm-dumbbell-row', sets: 3, reps: 10, repsMax: 12, rest: 75 },
      { exerciseId: 'lateral-raise', sets: 2, reps: 12, repsMax: 15, rest: 45 },
      { exerciseId: 'plank', sets: 3, reps: 20, repsMax: 40, rest: 45 }
    ]
  },

  // —— HOME ——
  {
    id: 'lib-home-full',
    name: 'Home Full Body',
    category: 'At Home',
    goal: 'General fitness',
    difficulty: 'Beginner',
    duration: 35,
    equipment: ['Bodyweight', 'Dumbbells'],
    description: 'Minimal-equipment full body you can do at home.',
    muscles: ['Full Body'],
    exercises: [
      { exerciseId: 'squat', sets: 3, reps: 12, repsMax: 15, rest: 75 },
      { exerciseId: 'push-up', sets: 3, reps: 10, repsMax: 15, rest: 60 },
      { exerciseId: 'one-arm-dumbbell-row', sets: 3, reps: 10, repsMax: 12, rest: 60 },
      { exerciseId: 'lunge', sets: 3, reps: 10, repsMax: 12, rest: 60 },
      { exerciseId: 'plank', sets: 3, reps: 30, repsMax: 45, rest: 45 },
      { exerciseId: 'crunch', sets: 3, reps: 15, repsMax: 20, rest: 30 }
    ]
  },
  {
    id: 'lib-home-upper',
    name: 'Home Upper',
    category: 'At Home',
    goal: 'Muscle',
    difficulty: 'Beginner',
    duration: 30,
    equipment: ['Bodyweight', 'Dumbbells'],
    description: 'Upper-body session with minimal equipment.',
    muscles: ['Chest', 'Back', 'Shoulders', 'Arms'],
    exercises: [
      { exerciseId: 'push-up', sets: 4, reps: 10, repsMax: 15, rest: 60 },
      { exerciseId: 'one-arm-dumbbell-row', sets: 3, reps: 10, repsMax: 12, rest: 60 },
      { exerciseId: 'dumbbell-bench-press', sets: 3, reps: 10, repsMax: 12, rest: 75 },
      { exerciseId: 'lateral-raise', sets: 3, reps: 12, repsMax: 15, rest: 45 },
      { exerciseId: 'biceps-curl', sets: 3, reps: 12, repsMax: 15, rest: 45 }
    ]
  },
  {
    id: 'lib-home-lower',
    name: 'Home Lower',
    category: 'At Home',
    goal: 'Muscle',
    difficulty: 'Beginner',
    duration: 30,
    equipment: ['Bodyweight', 'Dumbbells'],
    description: 'Legs and glutes at home.',
    muscles: ['Quads', 'Glutes', 'Hamstrings'],
    exercises: [
      { exerciseId: 'squat', sets: 4, reps: 12, repsMax: 15, rest: 75 },
      { exerciseId: 'lunge', sets: 3, reps: 10, repsMax: 12, rest: 60 },
      { exerciseId: 'romanian-deadlift', sets: 3, reps: 10, repsMax: 12, rest: 75 },
      { exerciseId: 'hip-thrust', sets: 3, reps: 12, repsMax: 15, rest: 60 },
      { exerciseId: 'calf-raise', sets: 3, reps: 15, repsMax: 20, rest: 45 }
    ]
  },
  {
    id: 'lib-home-minimal',
    name: 'Minimal Equipment',
    category: 'At Home',
    goal: 'General fitness',
    difficulty: 'Beginner',
    duration: 25,
    equipment: ['Bodyweight'],
    description: 'No equipment required. Use tempo and range of motion to increase difficulty.',
    muscles: ['Full Body'],
    exercises: [
      { exerciseId: 'push-up', sets: 3, reps: 10, repsMax: 20, rest: 60 },
      { exerciseId: 'squat', sets: 3, reps: 15, repsMax: 20, rest: 60 },
      { exerciseId: 'lunge', sets: 3, reps: 10, repsMax: 15, rest: 45 },
      { exerciseId: 'plank', sets: 3, reps: 30, repsMax: 60, rest: 45 },
      { exerciseId: 'crunch', sets: 3, reps: 15, repsMax: 25, rest: 30 }
    ]
  },

  // —— ATHLETIC ——
  {
    id: 'lib-athletic-full',
    name: 'Athletic Full Body',
    category: 'Athletic',
    dumbbellVariantId: 'lib-athletic-full-db',
    goal: 'Athletic performance',
    difficulty: 'Intermediate',
    duration: 50,
    equipment: ['Barbell', 'Dumbbells', 'Bodyweight'],
    description: 'Strength and control across major patterns for general athleticism.',
    muscles: ['Full Body'],
    exercises: [
      { exerciseId: 'squat', sets: 4, reps: 5, repsMax: 6, rest: 120 },
      { exerciseId: 'bench-press', sets: 3, reps: 5, repsMax: 6, rest: 90 },
      { exerciseId: 'romanian-deadlift', sets: 3, reps: 6, repsMax: 8, rest: 90 },
      { exerciseId: 'pull-up', sets: 3, reps: 5, repsMax: 8, rest: 90 },
      { exerciseId: 'plank', sets: 3, reps: 40, repsMax: 60, rest: 45 }
    ]
  },
  {
    id: 'lib-lower-power',
    name: 'Lower Body Power',
    category: 'Athletic',
    goal: 'Athletic performance',
    difficulty: 'Advanced',
    duration: 45,
    equipment: ['Barbell', 'Dumbbells'],
    description: 'Explosive lower-body strength with unilateral stability work.',
    muscles: ['Quads', 'Glutes', 'Hamstrings'],
    exercises: [
      { exerciseId: 'squat', sets: 4, reps: 4, repsMax: 6, rest: 150 },
      { exerciseId: 'romanian-deadlift', sets: 3, reps: 5, repsMax: 6, rest: 120 },
      { exerciseId: 'bulgarian-split-squat', sets: 3, reps: 6, repsMax: 8, rest: 90 },
      { exerciseId: 'hip-thrust', sets: 3, reps: 6, repsMax: 8, rest: 90 },
      { exerciseId: 'calf-raise', sets: 3, reps: 10, repsMax: 12, rest: 45 }
    ]
  },
  {
    id: 'lib-upper-performance',
    name: 'Upper Body Performance',
    category: 'Athletic',
    dumbbellVariantId: 'lib-upper-performance-db',
    goal: 'Athletic performance',
    difficulty: 'Intermediate',
    duration: 45,
    equipment: ['Barbell', 'Pull-up Bar', 'Cable'],
    description: 'Pressing and pulling strength with scapular health work.',
    muscles: ['Chest', 'Back', 'Shoulders'],
    exercises: [
      { exerciseId: 'bench-press', sets: 4, reps: 5, repsMax: 6, rest: 120 },
      { exerciseId: 'pull-up', sets: 4, reps: 5, repsMax: 8, rest: 90 },
      { exerciseId: 'overhead-press', sets: 3, reps: 5, repsMax: 6, rest: 90 },
      { exerciseId: 'barbell-row', sets: 3, reps: 6, repsMax: 8, rest: 90 },
      { exerciseId: 'face-pull', sets: 3, reps: 15, repsMax: 20, rest: 45 }
    ]
  },
  {
    id: 'lib-core-stability',
    name: 'Core & Stability',
    category: 'Athletic',
    goal: 'Athletic performance',
    difficulty: 'Beginner',
    duration: 25,
    equipment: ['Bodyweight', 'Pull-up Bar'],
    description: 'Core endurance and anti-extension work.',
    muscles: ['Core', 'Abs'],
    exercises: [
      { exerciseId: 'plank', sets: 4, reps: 30, repsMax: 60, rest: 45 },
      { exerciseId: 'hanging-knee-raise', sets: 3, reps: 8, repsMax: 12, rest: 60 },
      { exerciseId: 'crunch', sets: 3, reps: 15, repsMax: 20, rest: 30 },
      { exerciseId: 'push-up', sets: 3, reps: 10, repsMax: 15, rest: 60 }
    ]
  },

  // —— DUMBBELL OPTIONS ——
  {
    id: 'lib-upper-strength-db',
    name: 'Upper Strength (Dumbbells)',
    category: 'Strength',
    goal: 'Strength',
    difficulty: 'Intermediate',
    duration: 50,
    equipment: ['Dumbbells', 'Bench'],
    description: 'Barbell-free upper strength using dumbbells only. Great when a rack is not available.',
    muscles: ['Chest', 'Back', 'Shoulders', 'Arms'],
    exercises: [
      { exerciseId: 'dumbbell-bench-press', sets: 4, reps: 6, repsMax: 8, rest: 120 },
      { exerciseId: 'one-arm-dumbbell-row', sets: 4, reps: 6, repsMax: 8, rest: 90 },
      { exerciseId: 'dumbbell-overhead-press', sets: 3, reps: 6, repsMax: 8, rest: 90 },
      { exerciseId: 'incline-dumbbell-press', sets: 3, reps: 8, repsMax: 10, rest: 75 },
      { exerciseId: 'biceps-curl', sets: 3, reps: 8, repsMax: 12, rest: 60 },
      { exerciseId: 'hammer-curl', sets: 3, reps: 8, repsMax: 12, rest: 60 }
    ]
  },
  {
    id: 'lib-lower-strength-db',
    name: 'Lower Strength (Dumbbells)',
    category: 'Strength',
    goal: 'Strength',
    difficulty: 'Intermediate',
    duration: 50,
    equipment: ['Dumbbells'],
    description: 'Lower-body strength with goblet squats, RDLs, and unilateral work — no barbell required.',
    muscles: ['Quads', 'Glutes', 'Hamstrings', 'Calves'],
    exercises: [
      { exerciseId: 'goblet-squat', sets: 4, reps: 6, repsMax: 8, rest: 120 },
      { exerciseId: 'dumbbell-rdl', sets: 3, reps: 6, repsMax: 8, rest: 120 },
      { exerciseId: 'bulgarian-split-squat', sets: 3, reps: 6, repsMax: 8, rest: 90 },
      { exerciseId: 'hip-thrust', sets: 3, reps: 8, repsMax: 10, rest: 75 },
      { exerciseId: 'calf-raise', sets: 4, reps: 10, repsMax: 15, rest: 45 }
    ]
  },
  {
    id: 'lib-full-strength-db',
    name: 'Full Body Strength (Dumbbells)',
    category: 'Strength',
    goal: 'Strength',
    difficulty: 'Intermediate',
    duration: 55,
    equipment: ['Dumbbells', 'Bench'],
    description: 'Full-body strength session using only dumbbells and a bench.',
    muscles: ['Full Body'],
    exercises: [
      { exerciseId: 'goblet-squat', sets: 4, reps: 6, repsMax: 8, rest: 120 },
      { exerciseId: 'dumbbell-bench-press', sets: 4, reps: 6, repsMax: 8, rest: 90 },
      { exerciseId: 'dumbbell-rdl', sets: 3, reps: 6, repsMax: 8, rest: 90 },
      { exerciseId: 'one-arm-dumbbell-row', sets: 3, reps: 6, repsMax: 8, rest: 90 },
      { exerciseId: 'dumbbell-overhead-press', sets: 3, reps: 6, repsMax: 8, rest: 75 }
    ]
  },
  {
    id: 'lib-push-strength-db',
    name: 'Push Strength (Dumbbells)',
    category: 'Strength',
    goal: 'Strength',
    difficulty: 'Intermediate',
    duration: 45,
    equipment: ['Dumbbells', 'Bench'],
    description: 'Horizontal and vertical pressing with dumbbells only.',
    muscles: ['Chest', 'Shoulders', 'Triceps'],
    exercises: [
      { exerciseId: 'dumbbell-bench-press', sets: 4, reps: 5, repsMax: 6, rest: 120 },
      { exerciseId: 'dumbbell-overhead-press', sets: 4, reps: 5, repsMax: 6, rest: 90 },
      { exerciseId: 'incline-dumbbell-press', sets: 3, reps: 6, repsMax: 8, rest: 90 },
      { exerciseId: 'lateral-raise', sets: 3, reps: 10, repsMax: 15, rest: 60 }
    ]
  },
  {
    id: 'lib-pull-strength-db',
    name: 'Pull Strength (Dumbbells)',
    category: 'Strength',
    goal: 'Strength',
    difficulty: 'Intermediate',
    duration: 45,
    equipment: ['Dumbbells'],
    description: 'Rows, hinges, and arm work with dumbbells. Add a pull-up bar if you have one.',
    muscles: ['Back', 'Lats', 'Biceps'],
    exercises: [
      { exerciseId: 'dumbbell-rdl', sets: 3, reps: 5, repsMax: 6, rest: 120 },
      { exerciseId: 'one-arm-dumbbell-row', sets: 4, reps: 6, repsMax: 8, rest: 90 },
      { exerciseId: 'pull-up', sets: 3, reps: 5, repsMax: 8, rest: 90 },
      { exerciseId: 'biceps-curl', sets: 3, reps: 8, repsMax: 12, rest: 60 },
      { exerciseId: 'hammer-curl', sets: 3, reps: 8, repsMax: 12, rest: 60 }
    ]
  },
  {
    id: 'lib-leg-strength-db',
    name: 'Leg Strength (Dumbbells)',
    category: 'Strength',
    goal: 'Strength',
    difficulty: 'Intermediate',
    duration: 50,
    equipment: ['Dumbbells'],
    description: 'Heavy-ish lower body with dumbbells: squat pattern, hinge, and single-leg work.',
    muscles: ['Quads', 'Glutes', 'Hamstrings'],
    exercises: [
      { exerciseId: 'goblet-squat', sets: 4, reps: 5, repsMax: 6, rest: 150 },
      { exerciseId: 'dumbbell-rdl', sets: 4, reps: 6, repsMax: 8, rest: 120 },
      { exerciseId: 'bulgarian-split-squat', sets: 3, reps: 6, repsMax: 8, rest: 90 },
      { exerciseId: 'dumbbell-lunges', sets: 3, reps: 8, repsMax: 10, rest: 75 },
      { exerciseId: 'calf-raise', sets: 4, reps: 10, repsMax: 12, rest: 45 }
    ]
  },
  {
    id: 'lib-upper-hyper-db',
    name: 'Upper Hypertrophy (Dumbbells)',
    category: 'Hypertrophy',
    goal: 'Muscle',
    difficulty: 'Intermediate',
    duration: 50,
    equipment: ['Dumbbells', 'Bench'],
    description: 'Volume upper-body work using dumbbells for chest, back, shoulders, and arms.',
    muscles: ['Chest', 'Back', 'Shoulders', 'Arms'],
    exercises: [
      { exerciseId: 'dumbbell-bench-press', sets: 4, reps: 8, repsMax: 12, rest: 90 },
      { exerciseId: 'incline-dumbbell-press', sets: 3, reps: 10, repsMax: 12, rest: 75 },
      { exerciseId: 'one-arm-dumbbell-row', sets: 4, reps: 8, repsMax: 12, rest: 75 },
      { exerciseId: 'dumbbell-overhead-press', sets: 3, reps: 8, repsMax: 12, rest: 75 },
      { exerciseId: 'lateral-raise', sets: 3, reps: 12, repsMax: 15, rest: 45 },
      { exerciseId: 'biceps-curl', sets: 3, reps: 10, repsMax: 15, rest: 45 },
      { exerciseId: 'hammer-curl', sets: 3, reps: 10, repsMax: 15, rest: 45 }
    ]
  },
  {
    id: 'lib-lower-hyper-db',
    name: 'Lower Hypertrophy (Dumbbells)',
    category: 'Hypertrophy',
    goal: 'Muscle',
    difficulty: 'Intermediate',
    duration: 50,
    equipment: ['Dumbbells'],
    description: 'Leg and glute hypertrophy with dumbbells only.',
    muscles: ['Quads', 'Glutes', 'Hamstrings', 'Calves'],
    exercises: [
      { exerciseId: 'goblet-squat', sets: 4, reps: 8, repsMax: 12, rest: 90 },
      { exerciseId: 'dumbbell-rdl', sets: 3, reps: 10, repsMax: 12, rest: 90 },
      { exerciseId: 'bulgarian-split-squat', sets: 3, reps: 10, repsMax: 12, rest: 75 },
      { exerciseId: 'hip-thrust', sets: 3, reps: 10, repsMax: 15, rest: 75 },
      { exerciseId: 'dumbbell-lunges', sets: 3, reps: 10, repsMax: 12, rest: 60 },
      { exerciseId: 'calf-raise', sets: 4, reps: 12, repsMax: 20, rest: 45 }
    ]
  },
  {
    id: 'lib-push-hyper-db',
    name: 'Push Hypertrophy (Dumbbells)',
    category: 'Hypertrophy',
    goal: 'Muscle',
    difficulty: 'Intermediate',
    duration: 45,
    equipment: ['Dumbbells', 'Bench'],
    description: 'Chest, shoulders, and triceps volume with dumbbells.',
    muscles: ['Chest', 'Shoulders', 'Triceps'],
    exercises: [
      { exerciseId: 'dumbbell-bench-press', sets: 4, reps: 8, repsMax: 12, rest: 90 },
      { exerciseId: 'incline-dumbbell-press', sets: 3, reps: 10, repsMax: 12, rest: 75 },
      { exerciseId: 'dumbbell-overhead-press', sets: 3, reps: 8, repsMax: 12, rest: 75 },
      { exerciseId: 'lateral-raise', sets: 3, reps: 12, repsMax: 15, rest: 45 },
      { exerciseId: 'push-up', sets: 3, reps: 10, repsMax: 15, rest: 60 }
    ]
  },
  {
    id: 'lib-pull-hyper-db',
    name: 'Pull Hypertrophy (Dumbbells)',
    category: 'Hypertrophy',
    goal: 'Muscle',
    difficulty: 'Intermediate',
    duration: 45,
    equipment: ['Dumbbells'],
    description: 'Back and biceps hypertrophy focused on dumbbell rows and curls.',
    muscles: ['Lats', 'Upper Back', 'Biceps'],
    exercises: [
      { exerciseId: 'one-arm-dumbbell-row', sets: 4, reps: 8, repsMax: 12, rest: 75 },
      { exerciseId: 'dumbbell-rdl', sets: 3, reps: 10, repsMax: 12, rest: 90 },
      { exerciseId: 'pull-up', sets: 3, reps: 6, repsMax: 10, rest: 90 },
      { exerciseId: 'biceps-curl', sets: 3, reps: 10, repsMax: 15, rest: 45 },
      { exerciseId: 'hammer-curl', sets: 3, reps: 10, repsMax: 15, rest: 45 }
    ]
  },
  {
    id: 'lib-leg-hyper-db',
    name: 'Leg Hypertrophy (Dumbbells)',
    category: 'Hypertrophy',
    goal: 'Muscle',
    difficulty: 'Intermediate',
    duration: 50,
    equipment: ['Dumbbells'],
    description: 'High-volume legs and glutes with dumbbells.',
    muscles: ['Quads', 'Glutes', 'Hamstrings'],
    exercises: [
      { exerciseId: 'goblet-squat', sets: 4, reps: 10, repsMax: 12, rest: 90 },
      { exerciseId: 'hip-thrust', sets: 3, reps: 10, repsMax: 15, rest: 75 },
      { exerciseId: 'dumbbell-lunges', sets: 3, reps: 10, repsMax: 12, rest: 60 },
      { exerciseId: 'dumbbell-rdl', sets: 3, reps: 10, repsMax: 12, rest: 75 },
      { exerciseId: 'bulgarian-split-squat', sets: 3, reps: 10, repsMax: 12, rest: 60 },
      { exerciseId: 'calf-raise', sets: 4, reps: 15, repsMax: 20, rest: 45 }
    ]
  },
  {
    id: 'lib-athletic-full-db',
    name: 'Athletic Full Body (Dumbbells)',
    category: 'Athletic',
    goal: 'Athletic performance',
    difficulty: 'Intermediate',
    duration: 45,
    equipment: ['Dumbbells'],
    description: 'Athletic full-body patterns with dumbbells only.',
    muscles: ['Full Body'],
    exercises: [
      { exerciseId: 'goblet-squat', sets: 4, reps: 5, repsMax: 6, rest: 120 },
      { exerciseId: 'dumbbell-bench-press', sets: 3, reps: 5, repsMax: 6, rest: 90 },
      { exerciseId: 'dumbbell-rdl', sets: 3, reps: 6, repsMax: 8, rest: 90 },
      { exerciseId: 'one-arm-dumbbell-row', sets: 3, reps: 6, repsMax: 8, rest: 75 },
      { exerciseId: 'plank', sets: 3, reps: 40, repsMax: 60, rest: 45 }
    ]
  },
  {
    id: 'lib-upper-performance-db',
    name: 'Upper Performance (Dumbbells)',
    category: 'Athletic',
    goal: 'Athletic performance',
    difficulty: 'Intermediate',
    duration: 40,
    equipment: ['Dumbbells', 'Bench'],
    description: 'Pressing and pulling performance work with dumbbells.',
    muscles: ['Chest', 'Back', 'Shoulders'],
    exercises: [
      { exerciseId: 'dumbbell-bench-press', sets: 4, reps: 5, repsMax: 6, rest: 120 },
      { exerciseId: 'one-arm-dumbbell-row', sets: 4, reps: 5, repsMax: 8, rest: 90 },
      { exerciseId: 'dumbbell-overhead-press', sets: 3, reps: 5, repsMax: 6, rest: 90 },
      { exerciseId: 'lateral-raise', sets: 3, reps: 12, repsMax: 15, rest: 45 }
    ]
  },
,

  // —— PERSONAL PLAN (Jack) ——
  {
    id: 'plan-mon-upper-a',
    name: 'Upper Body A',
    category: 'Program',
    goal: 'All-around fitness',
    difficulty: 'Intermediate',
    duration: 65,
    intensity: 'medium',
    scheduleDay: 1,
    personal: true,
    equipment: ['Dumbbells', 'Bench'],
    description: 'Monday — Upper Body A. Chest, back, shoulders, and arms.',
    muscles: ['Chest', 'Back', 'Shoulders', 'Arms'],
    exercises: [
      { exerciseId: 'dumbbell-bench-press', sets: 4, reps: 8, repsMax: 10, rest: 120 },
      { exerciseId: 'one-arm-dumbbell-row', sets: 4, reps: 8, repsMax: 10, rest: 90, note: 'Per side' },
      { exerciseId: 'incline-dumbbell-press', sets: 3, reps: 10, repsMax: 12, rest: 90 },
      { exerciseId: 'chest-supported-db-row', sets: 3, reps: 10, repsMax: 12, rest: 90 },
      { exerciseId: 'seated-db-shoulder-press', sets: 3, reps: 8, repsMax: 12, rest: 120 },
      { exerciseId: 'alternating-db-curl', sets: 3, reps: 10, repsMax: 12, rest: 60, note: 'Per arm' },
      { exerciseId: 'lying-db-tricep-extension', sets: 3, reps: 10, repsMax: 12, rest: 60 }
    ]
  },
  {
    id: 'plan-tue-lower-a',
    name: 'Lower Body A',
    category: 'Program',
    goal: 'All-around fitness',
    difficulty: 'Intermediate',
    duration: 65,
    intensity: 'medium',
    scheduleDay: 2,
    personal: true,
    equipment: ['Dumbbells', 'Bench'],
    description: 'Tuesday — Lower Body A. Squats, hinge, single-leg, calves, and core.',
    muscles: ['Quads', 'Glutes', 'Hamstrings', 'Core'],
    exercises: [
      { exerciseId: 'goblet-squat', sets: 4, reps: 8, repsMax: 10, rest: 120 },
      { exerciseId: 'dumbbell-rdl', sets: 4, reps: 8, repsMax: 10, rest: 120 },
      { exerciseId: 'bulgarian-split-squat', sets: 3, reps: 8, repsMax: 10, rest: 105, note: 'Per leg' },
      { exerciseId: 'db-glute-bridge', sets: 3, reps: 10, repsMax: 12, rest: 90 },
      { exerciseId: 'calf-raise', sets: 4, reps: 12, repsMax: 15, rest: 60 },
      { exerciseId: 'weighted-crunch', sets: 3, reps: 12, repsMax: 15, rest: 60 }
    ]
  },
  {
    id: 'plan-wed-shoulders-arms',
    name: 'Shoulders, Arms & Core',
    category: 'Program',
    goal: 'All-around fitness',
    difficulty: 'Intermediate',
    duration: 55,
    intensity: 'light',
    scheduleDay: 3,
    personal: true,
    equipment: ['Dumbbells'],
    description: 'Wednesday — Shoulders, arms, forearms, and core.',
    muscles: ['Shoulders', 'Arms', 'Forearms', 'Core'],
    exercises: [
      { exerciseId: 'lateral-raise', sets: 3, reps: 12, repsMax: 15, rest: 60 },
      { exerciseId: 'rear-delt-fly', sets: 3, reps: 12, repsMax: 15, rest: 60 },
      { exerciseId: 'hammer-curl', sets: 3, reps: 10, repsMax: 12, rest: 75 },
      { exerciseId: 'seated-db-tricep-extension', sets: 3, reps: 10, repsMax: 12, rest: 75 },
      { exerciseId: 'db-wrist-curl', sets: 3, reps: 12, repsMax: 15, rest: 50 },
      { exerciseId: 'db-reverse-wrist-curl', sets: 2, reps: 12, repsMax: 15, rest: 50 },
      { exerciseId: 'plank', sets: 3, reps: 30, repsMax: 60, rest: 60, note: 'Seconds hold' },
      { exerciseId: 'dead-bug', sets: 3, reps: 8, repsMax: 12, rest: 50, note: 'Per side' }
    ]
  },
  {
    id: 'plan-thu-lower-b',
    name: 'Lower Body B',
    category: 'Program',
    goal: 'All-around fitness',
    difficulty: 'Intermediate',
    duration: 60,
    intensity: 'medium',
    scheduleDay: 4,
    personal: true,
    equipment: ['Dumbbells'],
    description: 'Thursday — Lower Body B. Front-loaded squats, lunges, hinge, and unilateral glute work.',
    muscles: ['Quads', 'Glutes', 'Hamstrings', 'Core'],
    exercises: [
      { exerciseId: 'front-loaded-db-squat', sets: 4, reps: 10, repsMax: 12, rest: 120 },
      { exerciseId: 'db-reverse-lunge', sets: 3, reps: 8, repsMax: 10, rest: 105, note: 'Per leg' },
      { exerciseId: 'dumbbell-rdl', sets: 3, reps: 10, repsMax: 12, rest: 120 },
      { exerciseId: 'single-leg-glute-bridge', sets: 3, reps: 10, repsMax: 12, rest: 75, note: 'Per leg' },
      { exerciseId: 'calf-raise', sets: 3, reps: 12, repsMax: 15, rest: 60 },
      { exerciseId: 'side-plank', sets: 3, reps: 30, repsMax: 45, rest: 50, note: 'Seconds per side' }
    ]
  },
  {
    id: 'plan-fri-upper-b',
    name: 'Upper Body B',
    category: 'Program',
    goal: 'All-around fitness',
    difficulty: 'Intermediate',
    duration: 65,
    intensity: 'medium',
    scheduleDay: 5,
    personal: true,
    equipment: ['Dumbbells', 'Bench'],
    description: 'Friday — Upper Body B. Incline emphasis, rows, pullovers, and arm finishers.',
    muscles: ['Chest', 'Back', 'Shoulders', 'Arms'],
    exercises: [
      { exerciseId: 'incline-dumbbell-press', sets: 4, reps: 8, repsMax: 10, rest: 120 },
      { exerciseId: 'chest-supported-db-row', sets: 4, reps: 8, repsMax: 10, rest: 120 },
      { exerciseId: 'dumbbell-bench-press', sets: 3, reps: 10, repsMax: 12, rest: 90 },
      { exerciseId: 'db-pullover', sets: 3, reps: 10, repsMax: 12, rest: 90 },
      { exerciseId: 'lateral-raise', sets: 3, reps: 12, repsMax: 15, rest: 60 },
      { exerciseId: 'cross-body-hammer-curl', sets: 3, reps: 10, repsMax: 12, rest: 60, note: 'Per arm' },
      { exerciseId: 'db-tricep-extension', sets: 2, reps: 12, rest: 60 }
    ]
  },
  {
    id: 'plan-sat-cardio',
    name: 'Saturday Optional Cardio',
    category: 'Program',
    goal: 'Recovery',
    difficulty: 'Beginner',
    duration: 40,
    intensity: 'recovery',
    scheduleDay: 6,
    optional: true,
    personal: true,
    equipment: ['Bodyweight'],
    description: 'Optional recovery: easy walk or light activity, gentle mobility. Skip for full rest if needed. Eat enough to support training.',
    muscles: ['Cardio', 'Full Body'],
    exercises: [
      { exerciseId: 'brisk-walk', sets: 1, reps: 25, repsMax: 45, rest: 0, note: 'Minutes — easy pace' },
      { exerciseId: 'easy-bike', sets: 1, reps: 15, repsMax: 30, rest: 0, note: 'Minutes — optional alternative' },
      { exerciseId: 'light-mobility', sets: 1, reps: 10, repsMax: 20, rest: 0, note: 'Minutes — gentle only' }
    ]
  },
  {
    id: 'plan-sun-cardio',
    name: 'Sunday Optional Cardio / Rest',
    category: 'Program',
    goal: 'Recovery',
    difficulty: 'Beginner',
    duration: 30,
    intensity: 'recovery',
    scheduleDay: 0,
    optional: true,
    personal: true,
    equipment: ['Bodyweight', 'Machine'],
    description: 'Prefer full rest and sleep. Optional light cardio only if you feel good. Prepare for next week.',
    muscles: ['Cardio'],
    exercises: [
      { exerciseId: 'brisk-walk', sets: 1, reps: 20, repsMax: 35, rest: 0, note: 'Minutes — easy, or skip for full rest' },
      { exerciseId: 'easy-bike', sets: 1, reps: 15, repsMax: 25, rest: 0, note: 'Minutes — optional' },
      { exerciseId: 'light-mobility', sets: 1, reps: 8, repsMax: 15, rest: 0, note: 'Minutes — optional' }
    ]
  }
];

const PROGRAMS = [
  {
    id: 'db-5day-strength',
    name: 'My Dumbbell + Bench Plan',
    description: 'Your personal all-around fitness plan. Adjustable dumbbells (50+ lb) and bench. Mon–Fri lifting, Sat/Sun optional cardio or full rest. Progress by adding reps, then the smallest weight increase.',
    goal: 'Strength',
    equipment: ['Dumbbells', 'Bench'],
    daysPerWeek: 5,
    experience: 'Some experience',
    sessionLength: '60+ min',
    schedule: {
      0: 'plan-sun-cardio', // Sunday optional cardio / rest
      1: 'plan-mon-upper-a',
      2: 'plan-tue-lower-a',
      3: 'plan-wed-shoulders-arms',
      4: 'plan-thu-lower-b',
      5: 'plan-fri-upper-b',
      6: 'plan-sat-cardio'  // Saturday optional cardio
    },
    dayLabels: {
      0: 'Optional Cardio / Rest',
      1: 'Upper Body A (Medium)',
      2: 'Lower Body A (Heavy)',
      3: 'Shoulders, Arms & Core (Light)',
      4: 'Lower Body B (Medium)',
      5: 'Upper Body B (Heavy)',
      6: 'Optional Cardio / Mobility'
    }
  }
];
