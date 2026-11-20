import { useMutation } from '@tanstack/react-query'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router'
import Button from '../components/Button.tsx'
import { useAuthContext } from '../hooks/useAuthContext.tsx'
import { cardClass, inputClass } from '../styles/ui.ts'
import { createUser, findUserByEmail } from '../api.ts'

type RegisterFormValues = {
  email: string
  password: string
  confirmPassword: string
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

  const registerMutation = useMutation({
    mutationFn: async ({
      email,
      password,
    }: Pick<RegisterFormValues, 'email' | 'password'>) => {
      const existingUser = await findUserByEmail(email)
      if (existingUser) {
        return null
      }

      return createUser(email, password)
    },
    gcTime: 0,
    onSuccess: (user) => {
      if (!user) {
        setError('email', {
          type: 'manual',
          message: 'Email is already taken',
        })
        return
      }

      setUser(user)
      navigate('/notes')
    },
    onError: (error) => console.error('Error registering user:', error),
  })

  const handleRegister = ({ email, password }: RegisterFormValues) => {
    registerMutation.mutate({ email: email.trim(), password })
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
              validate: (value) =>
                /^\S+@\S+\.\S+$/.test(value.trim()) || 'Enter a valid email',
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

        {registerMutation.isError && (
          <p className="text-meta text-danger" role="alert">
            Could not register. Try again.
          </p>
        )}
        <Button
          className="self-end"
          type="submit"
          disabled={!isValid || registerMutation.isPending}
        >
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
