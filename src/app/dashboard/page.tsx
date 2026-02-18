'use client';

import { useState, useEffect, useCallback } from 'react'
import { useSession, signIn, signOut, SessionProvider } from 'next-auth/react'
import { useRouter } from 'next/navigation'

import Header from '@/components/Header'
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Send, Sparkles, MessageSquare } from 'lucide-react'

interface GenerationHistoryItem {
  _id: string
  prompt: string
  response: string
  createdAt: string
}

interface ChatHistoryItem {
  id: string
  title: string
  date: string
  prompt: string
  messages?: any[]
}

const GRADIENTS = [
  'from-purple-500 to-blue-500',
  'from-orange-500 to-pink-500',
  'from-cyan-500 to-teal-500',
  'from-green-400 to-blue-500',
  'from-yellow-400 to-orange-500',
]

const getStorageKey = (email: string | null | undefined): string => {
  return email ? `chatHistory_${email}` : 'chatHistory'
}

const loadChatHistory = (storageKey: string): ChatHistoryItem[] => {
  try {
    const savedHistory = localStorage.getItem(storageKey)
    if (!savedHistory) return []
    return JSON.parse(savedHistory)
  } catch (e) {
    console.error('Erro ao carregar histórico de chats:', e)
    return []
  }
}

function DashboardContent() {
  const [prompt, setPrompt] = useState('')
  const [result, setResult] = useState('')
  const [history, setHistory] = useState<GenerationHistoryItem[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [fetchError, setFetchError] = useState<string | null>(null)
  const [chatHistory, setChatHistory] = useState<ChatHistoryItem[]>([])
  const [lastUserEmail, setLastUserEmail] = useState<string | null>(null)

  const { data: session, status } = useSession()
  const router = useRouter()

  const userEmail = session?.user?.email
  const storageKey = getStorageKey(userEmail)

  useEffect(() => {
    if (!userEmail) return

    if (lastUserEmail && lastUserEmail !== userEmail) {
      setChatHistory([])
    }
    
    const history = loadChatHistory(storageKey)
    setChatHistory(history)
    setLastUserEmail(userEmail)
  }, [userEmail, storageKey, lastUserEmail])

  useEffect(() => {
    if (status !== 'authenticated') return

    setIsLoading(true)
    setFetchError(null)

    fetch('/api/history')
      .then(data => {
        if (Array.isArray(data)) {
          setHistory(data)
          if (data.length > 0) {
            setFetchError(null)
          }
        } else {
          setHistory([])
        }
        setIsLoading(false)
      })
      .catch(() => {
        setFetchError('Falha ao buscar histórico')
        setIsLoading(false)
      })
  }, [status])

  const handleSubmit = useCallback((e: React.FormEvent) => {
    e.preventDefault()
    if (!prompt.trim()) return
    router.push(`/chat?prompt=${encodeURIComponent(prompt)}`)
  }, [prompt, router])

  if (status === 'loading') {
    return (
      <div className="gradient-bg min-h-screen flex items-center justify-center">
        <p className="text-white text-lg">A carregar sessão...</p>
      </div>
    )
  }

  if (status === 'unauthenticated') {
    return (
      <div className="gradient-bg min-h-screen flex flex-col items-center justify-center p-4">
        <div className="glass-effect rounded-2xl p-8 md:p-12 text-center max-w-md">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-8 h-8 text-cyan-400" />
          </div>
          <h1 className="gradient-text text-5xl md:text-6xl font-black glow-text mb-4">GenioText</h1>
          <p className="text-gray-300 text-lg md:text-xl mb-8">Faça login com o Google para começar a gerar.</p>
          <Button 
            onClick={() => signIn('google')}
            className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold px-8 py-6 rounded-lg text-lg"
          >
            Fazer Login com Google
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col min-h-screen">
      <Header variant="dashboard" />
      <div className="gradient-bg flex-1 p-4 md:p-8">
        <div className="mx-auto max-w-4xl">

        <div className="mb-12 text-center space-y-3">
          <div className="flex items-center justify-center gap-2 mb-4">
            <Sparkles className="w-8 h-8 text-cyan-400" />
          </div>
          <h1 className="gradient-text text-5xl md:text-6xl font-black glow-text">GenioText</h1>
          <p className="text-gray-300 text-lg md:text-xl">Qual tópico você quer que a IA escreva?</p>
        </div>

        <form onSubmit={handleSubmit} className="mb-12 glass-effect rounded-2xl p-1 border-2 border-transparent bg-gradient-to-r from-purple-500/50 to-cyan-500/50 overflow-hidden">
          <div className="flex gap-2 bg-slate-950/90 rounded-xl p-4">
            <Input
              type="text"
              placeholder="Ex: Os benefícios do café"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              disabled={isLoading}
              className="flex-1 bg-slate-900/50 border-slate-700 text-white placeholder:text-gray-500 focus:border-cyan-500 focus:ring-cyan-500/20"
            />
            <Button 
              type="submit" 
              disabled={isLoading}
              className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold px-6 rounded-lg"
            >
              {isLoading ? 'A gerar...' : (
                <>
                  <Send className="w-4 h-4 mr-2" />
                  Gerar
                </>
              )}
            </Button>
          </div>
        </form>

        {result && (
          <div className="mb-8">
            <div className="group glass-effect rounded-2xl p-1 border-2 border-transparent bg-gradient-to-br from-cyan-500/30 to-purple-500/30">
              <Card className="bg-slate-950/90 border-0 rounded-xl h-full flex flex-col">
                <CardHeader className="pb-3">
                  <CardTitle className={result.startsWith('Erro') ? "text-destructive" : "text-cyan-300"}>
                    {result.startsWith('Erro') ? 'Erro na Geração' : 'Nova Geração:'}
                  </CardTitle>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-sm text-gray-300 leading-relaxed whitespace-pre-wrap">
                    {result}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {chatHistory.length > 0 && (
          <div className="mb-12">
            <h2 className="text-center text-3xl font-bold text-white mb-8 flex items-center justify-center gap-2">
              <span className="text-cyan-400">Seus</span>
              <span className="text-white">Chats</span>
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {chatHistory.slice(0, 6).map((chat) => (
                <Card
                  key={chat.id}
                  onClick={() => router.push(`/chat?id=${chat.id}`)}
                  className="glass-effect border-purple-500/20 bg-slate-950/50 hover:bg-slate-900/70 cursor-pointer transition-all duration-200 hover:border-purple-500/50 hover:scale-105"
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <MessageSquare className="w-5 h-5 text-purple-400 flex-shrink-0 mt-0.5" />
                      <div className="flex-1 min-w-0">
                        <p className="text-white font-medium text-sm leading-relaxed line-clamp-2">{chat.title}</p>
                        <p className="text-gray-400 text-xs mt-1">{chat.date}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {fetchError && history.length === 0 && !isLoading && (
            <p className="text-center text-red-400 md:col-span-3">{fetchError}</p>
          )}
          {isLoading && history.length === 0 && (
            <p className="text-center text-gray-300 md:col-span-3">A carregar histórico...</p>
          )}
          {history.map((item, index) => (
            <div 
              key={item._id} 
              className="group glass-effect rounded-2xl p-1 border-2 border-transparent bg-gradient-to-br from-cyan-500/30 to-purple-500/30 hover:from-cyan-500/50 hover:to-purple-500/50 transition-all duration-300 transform hover:scale-105"
            >
              <Card className="bg-slate-950/90 border-0 rounded-xl h-full flex flex-col">
                <CardHeader className="pb-3">
                  <div className={`inline-flex w-fit px-3 py-1 rounded-full bg-gradient-to-r ${GRADIENTS[index % GRADIENTS.length]} text-white text-xs font-semibold mb-3`}>
                    {new Date(item.createdAt).toLocaleDateString('pt-BR')}
                  </div>
                  <CardTitle className="text-cyan-300">Prompt</CardTitle>
                  <CardDescription className="text-gray-200 font-medium text-base">{item.prompt}</CardDescription>
                </CardHeader>
                <CardContent className="flex-1">
                  <p className="text-sm text-gray-300 leading-relaxed">
                    <span className="font-semibold text-purple-300">Resposta:</span> {item.response}
                  </p>
                </CardContent>
              </Card>
            </div>
          ))}
        </div>
        </div>
      </div>
    </div>
  )
}

export default function Dashboard() {
  return (
    <SessionProvider>
      <DashboardContent />
    </SessionProvider>
  )
}
