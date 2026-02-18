'use client'

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useSession, signOut } from "next-auth/react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { Sparkles } from "lucide-react"

interface HeaderProps {
  variant?: 'default' | 'dashboard'
}

export default function Header({ variant = 'default' }: HeaderProps) {
  const { data: session, status } = useSession()
  const router = useRouter()

  const handleLogoClick = () => {
    router.push("/")
  }

  const isDashboard = variant === 'dashboard'

  return (
    <header className={`px-6 py-4 flex items-center justify-between ${isDashboard ? 'gradient-bg' : 'border-b border-white/5 bg-slate-950/50 backdrop-blur-sm'} top-0 z-50`}>
      <div 
        className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
        onClick={handleLogoClick}
      >
        <div className="bg-gradient-to-br from-cyan-500 to-purple-600 p-2 rounded-lg">
          <Sparkles className="w-5 h-5 text-white" />
        </div>
        <span className="font-bold text-xl tracking-tight text-white">GenioText</span>
      </div>
      {!isDashboard && (
        <nav className="hidden md:flex gap-6 text-sm font-medium text-slate-400">
          <a 
            href="#recursos" 
            onClick={(e) => {
              e.preventDefault()
              const element = document.getElementById('recursos')
              element?.scrollIntoView({ behavior: 'smooth', block: 'start' })
            }}
            className="hover:text-cyan-400 transition-colors cursor-pointer"
          >
            Recursos
          </a>
          <a 
            href="#preços" 
            onClick={(e) => {
              e.preventDefault()
              const element = document.getElementById('preços')
              element?.scrollIntoView({ behavior: 'smooth', block: 'start' })
            }}
            className="hover:text-cyan-400 transition-colors cursor-pointer"
          >
            Preços
          </a>
          <Link href="/dashboard" className="hover:text-cyan-400 transition-colors cursor-pointer">Dashboard</Link>
        </nav>
      )}
      <div className="flex gap-3 items-center">
        {status === 'loading' ? (
          <div className="h-10 w-20 bg-slate-800 rounded animate-pulse" />
        ) : session?.user ? (
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2">
              <Avatar className="border-2 border-cyan-400 h-8 w-8">
                <AvatarImage src={session.user.image || ''} alt={session.user.name || 'Usuário'} />
                <AvatarFallback className="text-xs">
                  {session.user.name?.substring(0, 2).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <span className="text-sm font-medium text-white hidden sm:inline">
                {session.user.name}
              </span>
            </div>
            <Button 
              variant="outline" 
              onClick={() => signOut()}
              className={isDashboard ? "border-purple-500/50 bg-purple-500/10 hover:bg-purple-500/20 text-white" : "border-slate-700 hover:bg-slate-800 text-white"}
            >
              Sair
            </Button>
          </div>
        ) : (
          <>
            <Link href="/dashboard" className="cursor-pointer">
              <Button variant="outline" className="border-slate-700 hover:bg-slate-800 text-white hidden sm:flex">
                Entrar
              </Button>
            </Link>
            <Link href="/dashboard" className="cursor-pointer">
              <Button className="bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 text-white border-0 shadow-lg shadow-cyan-500/20">
                Começar Agora
              </Button>
            </Link>
          </>
        )}
      </div>
    </header>
  )
}

