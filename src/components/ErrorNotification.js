import { Alert } from 'react-bootstrap'

const ErrorNotification = ({ message }) => {
  if (message === null) {
    return null
  }

  return <div className="container"><Alert variant="danger">      {message}    </Alert></div>
}

export default ErrorNotification
