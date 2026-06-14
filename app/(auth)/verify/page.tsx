import { Suspense } from 'react'
import VerifyPage from '@/features/auth/verify-page'

export default function Page() {
  return (
    <Suspense>
      <VerifyPage />
    </Suspense>
  )
}
