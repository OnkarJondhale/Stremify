import { createRoot } from 'react-dom/client'
import App from './App.jsx'

// 1. ALWAYS import third-party CSS first.
import 'stream-chat-react/dist/css/v2/index.css';

// 2. Import your single, global stylesheet LAST. This contains all your custom styles,
// including Tailwind/DaisyUI and our chat theme.
import './index.css' 
import './App.css' // <-- Make sure to import your App.css here for chat theme overrides

import { BrowserRouter } from "react-router-dom"
import { Provider } from 'react-redux'
import store from "./redux/store.js"

createRoot(document.getElementById('root')).render(
    <Provider store={store}>
        <BrowserRouter>
            <App />
        </BrowserRouter>
    </Provider>
)