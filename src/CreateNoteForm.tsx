import type { Note } from './types'
import { type SubmitHandler, useForm } from 'react-hook-form'

interface Props {
  onSubmit: (note: Omit<Note, 'id'>) => void
}

export default function CreateNoteForm({ onSubmit }: Props) {
  type CreateNoteFormValues = {
    title: string
    content: string
    tags: string
    hidden: boolean
  }

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isValid },
  } = useForm<CreateNoteFormValues>({ mode: 'all' })

  const HandleFormSubmit: SubmitHandler<CreateNoteFormValues> = (data) => {
    onSubmit({
      title: data.title.trim(),
      content: data.content.trim(),
      createdAt: new Date(),
      hidden: data.hidden,
      tags: data.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0),
    })
    reset()
  }

  return (
    <form onSubmit={handleSubmit(HandleFormSubmit)}>
      <div>
        <input
          type="text"
          placeholder="Title"
          {...register('title', {
            validate: (value) => {
              return value.trim().length > 0 || 'Title is required'
            },
          })}
        />
        {errors.title && <p>{errors.title.message}</p>}
      </div>

      <div>
        <textarea placeholder="Content" {...register('content')} />
      </div>

      <div>
        <input
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
        {errors.tags && <p>{errors.tags.message}</p>}
      </div>

      <div>
        <label>
          <input type="checkbox" {...register('hidden')} />
          Hidden
        </label>
      </div>

      <button type="submit" disabled={!isValid}>
        Add Note
      </button>
    </form>
  )
}
