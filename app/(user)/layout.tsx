import Header from '@/components/header'
import Footer from '@/components/footer'

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="min-h-screen flex flex-col bg-background">
      <Header cartCount={3} wishlistCount={2} />
        {children}
      <Footer />
    </div>
  )
}
