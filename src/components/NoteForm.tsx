import type { Note } from '../types'
import { type SubmitHandler, useForm } from 'react-hook-form'
import Button from './Button.tsx'
import { checkboxLabelClass, inputClass } from '../styles/ui.ts'

type NoteFormValues = {
  title: string
  content: string
  tags: string
  hidden: boolean
}

export type NoteFormData = Pick<Note, 'title' | 'content' | 'tags' | 'hidden'>

interface Props {
  defaultValues?: NoteFormData
  submitLabel: string
  onSubmit: (data: NoteFormData) => void
}

export default function NoteForm({
  defaultValues,
  submitLabel,
  onSubmit,
}: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<NoteFormValues>({
    mode: 'all',
    defaultValues: defaultValues && {
      ...defaultValues,
      tags: defaultValues.tags.join(', '),
    },
  })

  const handleFormSubmit: SubmitHandler<NoteFormValues> = (values) => {
    const data: NoteFormData = {
      ...values,
      title: values.title.trim(),
      content: values.content.trim(),
      tags: values.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0),
    }
    onSubmit(data)
  }

  return (
    <form
      className="flex flex-col gap-3"
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
        {submitLabel}
      </Button>
    </form>
  )
}
