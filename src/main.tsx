import { StrictMode } from "react"
import { createRoot } from "react-dom/client"

import "./index.css"
import App from "./App.tsx"

document.documentElement.classList.remove("dark")
document.documentElement.classList.add("light")
localStorage.removeItem("theme")
localStorage.removeItem("vite-ui-theme")

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
