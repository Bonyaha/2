import { useState } from 'react'

const LoginForm = ({
  handleSubmit,
  handleUsernameChange,
  handlePasswordChange,
}) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleFormSubmit = (e) => {
    e.preventDefault()
    try {
      handleSubmit(username, password)
      setUsername('')
      setPassword('')
    } catch (exception) {
      setUsername('')
      setPassword('')
    }
  }

  return (
    <div>
      <h2>Login</h2>

      <form onSubmit={handleSubmit}>
        <div>
          username
          <input type="text" value={username} onChange={handleUsernameChange} />
        </div>
        <div>
          password
          <input
            type="password"
            value={password}
            onChange={handlePasswordChange}
          />
        </div>
        <button type="submit" style={{ marginBottom: '5px' }}>
          login
        </button>
      </form>
    </div>
  )
}

export default LoginForm
