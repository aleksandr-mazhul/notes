import type { User } from '../types'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router'
import Button from '../components/Button.tsx'
import { useAuthContext } from '../hooks/useAuthContext.tsx'
import { cardClass, inputClass } from '../styles/ui.ts'
import { API_URL } from '../utils.ts'

type RegisterFormValues = {
  email: string
  password: string
  confirmPassword: string
}

const findUserByEmail = (email: string): Promise<User | undefined> => {
  const params = new URLSearchParams()
  params.set('_where', JSON.stringify({ email: { eq: email } }))
  return fetch(`${API_URL}/users?${params.toString()}`)
    .then((response) => {
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      return response.json()
    })
    .then(([user]: User[]) => user)
}

const createUser = (email: string, password: string): Promise<User> => {
  return fetch(`${API_URL}/users`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ email, password }),
  }).then((response) => {
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }
    return response.json()
  })
}

export default function RegisterPage() {
  const { setUser } = useAuthContext()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isValid },
  } = useForm<RegisterFormValues>({ mode: 'all' })

  const handleRegister = (values: RegisterFormValues) => {
    findUserByEmail(values.email).then((existingUser) => {
      if (existingUser) {
        setError('email', { type: 'manual', message: 'Email is already taken' })
      } else {
        createUser(values.email, values.password).then((user) => {
          setUser(user)
          navigate('/notes')
        })
      }
    })
  }

  return (
    <div className="mx-auto flex max-w-sm flex-col gap-6 px-5 pt-12 pb-16">
      <h1 className="text-2xl font-semibold tracking-[-0.01em]">Register</h1>
      <form
        className={`flex flex-col gap-3 ${cardClass}`}
        onSubmit={handleSubmit(handleRegister)}
      >
        <div className="flex flex-col gap-1">
          <input
            className={inputClass}
            type="text"
            placeholder="Email"
            {...register('email', {
              required: 'Email is required',
              pattern: {
                value: /^\S+@\S+\.\S+$/,
                message: 'Enter a valid email',
              },
            })}
          />
          {errors.email && (
            <p className="text-meta text-danger">{errors.email.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <input
            className={inputClass}
            type="password"
            placeholder="Password"
            {...register('password', {
              required: 'Password is required',
              minLength: {
                value: 4,
                message: 'Use at least 4 characters',
              },
              // Re-check the confirmation when the password changes
              deps: 'confirmPassword',
            })}
          />
          {errors.password && (
            <p className="text-meta text-danger">{errors.password.message}</p>
          )}
        </div>

        <div className="flex flex-col gap-1">
          <input
            className={inputClass}
            type="password"
            placeholder="Repeat password"
            {...register('confirmPassword', {
              validate: (value, formValues) =>
                value === formValues.password || 'Passwords do not match',
            })}
          />
          {errors.confirmPassword && (
            <p className="text-meta text-danger">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <Button className="self-end" type="submit" disabled={!isValid}>
          Register
        </Button>
      </form>
      <p className="text-sm text-muted">
        Already have an account?{' '}
        <Link className="font-medium text-ink underline" to="/login">
          Log in
        </Link>
      </p>
    </div>
  )
}
