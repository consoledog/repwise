# Repwise Project Specification

## Overview

Repwise is a workout tracking application focused on planning, recording, and reviewing training sessions. The application allows users to build workouts from an exercise database, track sets, repetitions, and weights, and organize multiple workouts into mesocycles.

The product should support both structured workout preparation before training and live data entry during training. It should also provide a flexible exercise database that can either start empty, be populated manually by the user, or optionally be extended through a free external exercise API if a suitable source is available.

## Goals

- Allow users to create and maintain a reusable exercise database.
- Allow users to build workouts by selecting exercises from the database.
- Allow users to enter training details such as sets, repetitions, and weight.
- Support different exercise categories, including aerobic, anaerobic, and flexibility exercises.
- Allow users to create mesocycles made of a defined number of workouts.
- Allow users to upload body progress photos before and after a mesocycle.
- Keep the system flexible enough for both beginner and advanced workout tracking workflows.

## Core Features

### Exercise Database

The application must include an exercise database that stores reusable exercises. The database may initially be empty and should allow users to manually add, edit, and remove exercises.

Each exercise should include:

- Exercise name.
- Exercise description.
- Exercise category.
- Optional exercise image.

Supported exercise categories should include:

- Aerobic exercises.
- Anaerobic exercises.
- Flexibility and stretching exercises.

The application may optionally integrate with a free exercise API to preload or search for exercises. If an API is used, users should still be able to create and manage their own custom exercises.

### Workout Creation

Users should be able to create a workout by selecting one or more exercises from the exercise database.

For each exercise inside a workout, the user should be able to define or record:

- Number of sets.
- Number of repetitions per set.
- Weight used per set, when applicable.

Workout values should be editable before the workout starts and during the workout session.

### Workout Tracking

During a workout, users should be able to record actual performance data for each exercise. The application should support updating sets, repetitions, and weight as the workout progresses.

The system should preserve completed workout data so users can review previous training sessions and compare progress over time.

### Mesocycle Management

Users should be able to create mesocycles that group multiple workouts into a larger training block.

A mesocycle should include:

- Mesocycle name.
- Number of planned workouts, for example 10 workouts.
- List of workouts assigned to the mesocycle.
- Start date.
- Optional end date or completion date.
- Optional notes.

The application should track mesocycle progress based on completed workouts.

### Progress Photos

Users should be able to upload body progress photos related to a mesocycle.

Each mesocycle should support:

- Before photos, uploaded before or at the start of the mesocycle.
- After photos, uploaded after the mesocycle is completed.

These photos should be associated with the mesocycle and available for later review.

## Data Model Draft

### Exercise

- `id`
- `name`
- `description`
- `category`
- `imageUrl` or uploaded image reference
- `createdAt`
- `updatedAt`

### Workout

- `id`
- `name`
- `date`
- `status`
- `exercises`
- `notes`
- `createdAt`
- `updatedAt`

### Workout Exercise

- `id`
- `exerciseId`
- `sets`
- `repetitions`
- `weight`
- `order`
- `notes`

### Mesocycle

- `id`
- `name`
- `plannedWorkoutCount`
- `workouts`
- `startDate`
- `endDate`
- `status`
- `beforePhotoUrls`
- `afterPhotoUrls`
- `notes`
- `createdAt`
- `updatedAt`

## Future Considerations

- Exercise search and filtering by category.
- Workout templates.
- Personal records and progress charts.
- Volume tracking by exercise, muscle group, or workout.
- Support for body measurements in addition to photos.
- Support for cardio-specific fields such as duration, distance, pace, or heart rate.
- Authentication and cloud synchronization.
- Offline workout tracking.

## Success Criteria

The first usable version of Repwise should allow a user to:

1. Add exercises to the exercise database.
2. Create a workout from existing exercises.
3. Enter sets, repetitions, and weight for workout exercises.
4. Complete and save a workout.
5. Create a mesocycle with a planned number of workouts.
6. Attach before and after body photos to a mesocycle.
