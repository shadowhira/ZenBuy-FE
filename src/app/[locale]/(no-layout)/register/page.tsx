"use client"

import { useTranslation } from "react-i18next"
import RegisterForm from "@components/auth/register-form"
import Link from "next/link"

export default function RegisterPage() {
  const { t } = useTranslation("auth")

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            {t("register.title")}
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            {t("register.haveAccount")}{" "}
            <Link href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
              {t("register.login")}
            </Link>
          </p>
        </div>
        <RegisterForm />
      </div>
    </div>
  )
} 