import ReactDOM from 'react-dom/client'
import { QueryClient, QueryClientProvider } from 'react-query'
import App from './App'
import './index.css'
import { AppContextProvider } from './AppContext'

const queryClient = new QueryClient()

ReactDOM.createRoot(document.getElementById('root')).render(
	<QueryClientProvider client={queryClient}>
		<AppContextProvider> {/* Wrap App with AppContextProvider */}
			<App />
		</AppContextProvider>
	</QueryClientProvider>
)