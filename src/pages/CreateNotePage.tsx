import type { Note } from '../types'
import { type SubmitHandler, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router'
import Button from '../components/Button.tsx'
import { cardClass, checkboxLabelClass, inputClass } from '../styles/ui.ts'
import { useAuthContext } from '../hooks/useAuthContext.tsx'
import { API_URL, mapNoteToDTO } from '../utils.ts'

export default function CreateNotePage() {
  const { user } = useAuthContext()
  const navigate = useNavigate()

  type CreateNoteFormValues = {
    title: string
    content: string
    tags: string
    hidden: boolean
  }

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<CreateNoteFormValues>({ mode: 'all' })

  const handleFormSubmit: SubmitHandler<CreateNoteFormValues> = (data) => {
    const note = {
      title: data.title.trim(),
      authorId: user!.id,
      content: data.content.trim(),
      createdAt: new Date(),
      hidden: data.hidden,
      tags: data.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0),
    } satisfies Omit<Note, 'id'>

    fetch(`${API_URL}/notes`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(mapNoteToDTO(note)),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        navigate('/notes')
      })
      .catch((error) => {
        console.error('Error creating note:', error)
      })
  }

  return (
    <div className="mx-auto flex max-w-160 flex-col gap-6 px-5 pt-12 pb-16">
      <h1 className="text-2xl font-semibold tracking-[-0.01em]">New Note</h1>
      <form
        className={`flex flex-col gap-3 ${cardClass}`}
        onSubmit={handleSubmit(handleFormSubmit)}
      >
        <div className="flex flex-col gap-1">
          <input
            className={inputClass}
            type="text"
            placeholder="Title"
            {...register('title', {
              validate: (value) => {
                return value.trim().length > 0 || 'Title is required'
              },
            })}
          />
          {errors.title && (
            <p className="text-meta text-danger">{errors.title.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <textarea
            className={`${inputClass} min-h-20 resize-y`}
            placeholder="Content"
            {...register('content')}
          />
        </div>

        <div className="flex flex-col gap-1">
          <input
            className={inputClass}
            type="text"
            placeholder="Tags"
            {...register('tags', {
              validate: (value) => {
                const Tags = value
                  .split(',')
                  .map((tag) => tag.trim())
                  .filter((tag) => tag.length > 0)
                return Tags.length <= 5 || 'You can only add up to 5 tags'
              },
            })}
          />
          {errors.tags && (
            <p className="text-meta text-danger">{errors.tags.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <label className={checkboxLabelClass}>
            <input
              className="accent-ink"
              type="checkbox"
              {...register('hidden')}
            />
            Hidden
          </label>
        </div>

        <Button className="self-end" type="submit" disabled={!isValid}>
          Add Note
        </Button>
      </form>
    </div>
  )
}
