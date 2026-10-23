import type { Note } from '../types'
import { type SubmitHandler, useForm } from 'react-hook-form'
import { useNavigate } from 'react-router'
import Button from '../components/Button.tsx'
import styles from '../styles/CreateNoteForm.module.css'
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

  const HandleFormSubmit: SubmitHandler<CreateNoteFormValues> = (data) => {
    const note: Omit<Note, 'id'> = {
      title: data.title.trim(),
      authorId: user!.id,
      content: data.content.trim(),
      createdAt: new Date(),
      hidden: data.hidden,
      tags: data.tags
        .split(',')
        .map((tag) => tag.trim())
        .filter((tag) => tag.length > 0),
    }

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
    <form className={styles.form} onSubmit={handleSubmit(HandleFormSubmit)}>
      <div className={styles.field}>
        <input
          className={styles.input}
          type="text"
          placeholder="Title"
          {...register('title', {
            validate: (value) => {
              return value.trim().length > 0 || 'Title is required'
            },
          })}
        />
        {errors.title && <p className={styles.error}>{errors.title.message}</p>}
      </div>

      <div className={styles.field}>
        <textarea
          className={styles.input}
          placeholder="Content"
          {...register('content')}
        />
      </div>

      <div className={styles.field}>
        <input
          className={styles.input}
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
        {errors.tags && <p className={styles.error}>{errors.tags.message}</p>}
      </div>

      <div className={styles.field}>
        <label className={styles.checkbox}>
          <input type="checkbox" {...register('hidden')} />
          Hidden
        </label>
      </div>

      <Button className={styles.submit} type="submit" disabled={!isValid}>
        Add Note
      </Button>
    </form>
  )
}
