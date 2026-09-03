'use server'

import { Prisma } from '@prisma/client'
import { revalidatePath } from 'next/cache'
import { notFound, redirect } from 'next/navigation'
import { prisma } from '@/lib/db/prisma'
import { getCurrentUserOrThrow } from '@/lib/auth/guards'
import { exerciseFormSchema, exerciseIdSchema } from './schemas'

function readExerciseForm(formData: FormData) {
  return exerciseFormSchema.safeParse({
    name: formData.get('name'),
    description: formData.get('description'),
    category: formData.get('category'),
    imageBlobUrl: formData.get('imageBlobUrl') ?? '',
  })
}

function getPrismaErrorCode(error: unknown) {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    return error.code
  }

  return null
}

export async function createExerciseAction(formData: FormData) {
  const user = await getCurrentUserOrThrow()
  const parsedExercise = readExerciseForm(formData)

  if (!parsedExercise.success) {
    redirect('/exercises/new?error=invalid-input')
  }

  let exerciseId: string

  try {
    const exercise = await prisma.exercise.create({
      data: {
        userId: user.id,
        name: parsedExercise.data.name,
        description: parsedExercise.data.description,
        category: parsedExercise.data.category,
        imageBlobUrl: parsedExercise.data.imageBlobUrl,
        source: 'MANUAL',
      },
      select: {
        id: true,
      },
    })

    exerciseId = exercise.id
  } catch (error) {
    if (getPrismaErrorCode(error) === 'P2002') {
      redirect('/exercises/new?error=duplicate-name')
    }

    throw error
  }

  revalidatePath('/exercises')
  redirect(`/exercises/${exerciseId}`)
}

export async function updateExerciseAction(exerciseId: string, formData: FormData) {
  const user = await getCurrentUserOrThrow()
  const parsedExerciseId = exerciseIdSchema.safeParse(exerciseId)
  const parsedExercise = readExerciseForm(formData)

  if (!parsedExerciseId.success) {
    notFound()
  }

  if (!parsedExercise.success) {
    redirect(`/exercises/${parsedExerciseId.data}/edit?error=invalid-input`)
  }

  const existingExercise = await prisma.exercise.findFirst({
    where: {
      id: parsedExerciseId.data,
      userId: user.id,
    },
    select: {
      id: true,
    },
  })

  if (!existingExercise) {
    notFound()
  }

  try {
    await prisma.exercise.update({
      where: {
        id: existingExercise.id,
      },
      data: {
        name: parsedExercise.data.name,
        description: parsedExercise.data.description,
        category: parsedExercise.data.category,
        imageBlobUrl: parsedExercise.data.imageBlobUrl,
      },
    })
  } catch (error) {
    if (getPrismaErrorCode(error) === 'P2002') {
      redirect(`/exercises/${parsedExerciseId.data}/edit?error=duplicate-name`)
    }

    throw error
  }

  revalidatePath('/exercises')
  revalidatePath(`/exercises/${existingExercise.id}`)
  redirect(`/exercises/${existingExercise.id}`)
}

export async function deleteExerciseAction(exerciseId: string) {
  const user = await getCurrentUserOrThrow()
  const parsedExerciseId = exerciseIdSchema.safeParse(exerciseId)

  if (!parsedExerciseId.success) {
    notFound()
  }

  const exercise = await prisma.exercise.findFirst({
    where: {
      id: parsedExerciseId.data,
      userId: user.id,
    },
    select: {
      id: true,
      _count: {
        select: {
          workoutExercises: true,
        },
      },
    },
  })

  if (!exercise) {
    notFound()
  }

  if (exercise._count.workoutExercises > 0) {
    redirect(`/exercises/${exercise.id}?error=in-use`)
  }

  await prisma.exercise.delete({
    where: {
      id: exercise.id,
    },
  })

  revalidatePath('/exercises')
  redirect('/exercises?deleted=1')
}
