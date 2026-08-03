import type { FC } from "react"
import { useState } from "react"
import { useLocation } from "wouter"
import Card from "../../components/ui/Card"
import Input from "../../components/ui/Input"
import Button from "../../components/ui/Button"
import "./Login.css"

const Login: FC = () => {
  const [, navigate] = useLocation()
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    localStorage.setItem("token", "demo")
    navigate("/home")
  }

  return (
    <div className="login-wrapper">
      <Card className="login-card">
        <h2 className="login-title">Clinical Research</h2>
        <p className="login-subtitle">Experimenter sign in</p>

        <form className="login-form" onSubmit={handleSubmit} noValidate>
          <Input
            id="username"
            label="Username"
            type="text"
            placeholder="rehan_teacher"
            autoComplete="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <Input
            id="password"
            label="Password"
            type="password"
            placeholder="••••••••"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <Button type="submit" fullWidth>
            Log In
          </Button>
        </form>
      </Card>
    </div>
  )
}

export default Login
