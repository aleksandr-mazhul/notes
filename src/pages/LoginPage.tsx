import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router'
import { useAuthContext } from '../hooks/useAuthContext.tsx'

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
    params.set('email', data.email)
    params.set('password', data.password)

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
    <div>
      <div>Login page</div>
      <form onSubmit={handleSubmit(handleLogin)}>
        <input
          type="text"
          placeholder="Email"
          {...register('email', { required: true })}
        />
        <input
          type="password"
          placeholder="Password"
          {...register('password', { required: true })}
        />
        <button type="submit" disabled={!isValid}>
          Login
        </button>
      </form>
    </div>
  )
}
