import LoginForm from "@components/auth/login-form";

export default function LoginPage() {
  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <h1 className="text-3xl font-bold mb-8 text-center">Login</h1>
      <div className="bg-white p-8 rounded-lg shadow-md">
        <LoginForm />
        <div className="mt-4 text-center text-sm text-muted-foreground">
          <p>Use these test credentials:</p>
          <p>Email: user@example.com</p>
          <p>Password: password</p>
        </div>
      </div>
    </div>
  )
}

