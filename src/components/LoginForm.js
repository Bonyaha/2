import { useState } from 'react'
import { Form, Button } from 'react-bootstrap'
import PropTypes from 'prop-types'

const LoginForm = ({ handleLogin }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleFormSubmit = (e) => {
    e.preventDefault()

    handleLogin(username, password)
    setUsername('')
    setPassword('')
  }

  return (
    <div>
      <h2>Login</h2>

      <Form onSubmit={handleFormSubmit}>
        <Form.Group>
          <Form.Label>  username:</Form.Label>
          <Form.Control
            id="username"
            type="text"
            value={username}
            onChange={({ target }) => setUsername(target.value)}
          />

          <div>
            <Form.Label>password:</Form.Label>
            <Form.Control
              id="password"
              type="password"
              value={password}
              onChange={({ target }) => setPassword(target.value)}
            />
          </div>
          <Button variant="primary" id="login-button" type="submit" >
            login
          </Button>
        </Form.Group>
      </Form>
    </div>
  )
}

LoginForm.propTypes = {
  handleLogin: PropTypes.func.isRequired,
}
export default LoginForm
