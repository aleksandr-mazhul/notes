import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router'
import { useAuthContext } from '../hooks/useAuthContext.tsx'
import Button from '../components/Button.tsx'
import { cardClass, inputClass } from '../styles/ui.ts'

type LoginFormValues = {
  email: string
  password: string
}

export default function LoginPage() {
  const { setUser } = useAuthContext()
  const navigate = useNavigate()

  const {
    register,
    handleSubmit,
    formState: { isValid },
  } = useForm<LoginFormValues>({
    mode: 'onBlur',
  })

  const handleLogin = (data: LoginFormValues) => {
    const params = new URLSearchParams()
    params.set(
      '_where',
      JSON.stringify({
        email: { eq: data.email },
        password: { eq: data.password },
      }),
    )

    fetch(`http://localhost:3000/users?${params.toString()}`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok')
        }
        return response.json()
      })
      .then(([user]) => {
        if (user) {
          setUser(user)
          navigate('/notes')
        }
      })
      .catch((error) => {
        console.error('Error:', error)
      })
  }

  return (
    <div className="mx-auto flex max-w-sm flex-col gap-6 px-5 pt-12 pb-16">
      <div className="text-2xl font-semibold tracking-[-0.01em]">
        Login page
      </div>
      <form
        className={`flex flex-col gap-3 ${cardClass}`}
        onSubmit={handleSubmit(handleLogin)}
      >
        <input
          className={inputClass}
          type="text"
          placeholder="Email"
          {...register('email', { required: true })}
        />
        <input
          className={inputClass}
          type="password"
          placeholder="Password"
          {...register('password', { required: true })}
        />
        <Button className="self-end" type="submit" disabled={!isValid}>
          Login
        </Button>
      </form>
      <p className="text-sm text-muted">
        No account yet?{' '}
        <Link className="font-medium text-ink underline" to="/register">
          Register
        </Link>
      </p>
    </div>
  )
}
