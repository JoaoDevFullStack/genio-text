"use client"

import { useSearchParams, useRouter } from "next/navigation"
import { useSession, SessionProvider } from "next-auth/react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ArrowLeft, Bot, Send, Menu, X, MessageSquare } from "lucide-react"
import { useEffect, useState, useRef, useCallback } from "react"

interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  isTyping?: boolean
  error?: string
}

interface ChatHistoryItem {
  id: string
  title: string
  date: string
  prompt: string
  messages: Message[]
}

const getStorageKey = (email: string | null | undefined): string => {
  return email ? `chatHistory_${email}` : 'chatHistory'
}

const formatDate = (date: Date): string => {
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  
  if (days === 0) {
    return `Hoje, ${date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`
  }
  if (days === 1) {
    return `Ontem, ${date.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}`
  }
  return date.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

const truncateText = (text: string, maxLength: number = 50): string => {
  return text.length > maxLength ? `${text.substring(0, maxLength)}...` : text
}

const createMessage = (id: string, role: 'user' | 'assistant', content: string, isTyping: boolean = false): Message => {
  return { id, role, content, isTyping }
}

const loadChatHistory = (storageKey: string): ChatHistoryItem[] => {
  try {
    const savedHistory = localStorage.getItem(storageKey)
    if (!savedHistory) return []
    return JSON.parse(savedHistory)
  } catch (e) {
    console.error('Erro ao carregar histórico:', e)
    return []
  }
}

const saveChatHistory = (storageKey: string, history: ChatHistoryItem[]): void => {
  localStorage.setItem(storageKey, JSON.stringify(history))
}

function ChatContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { data: session, status } = useSession()
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const [messages, setMessages] = useState<Message[]>([])
  const [isThinking, setIsThinking] = useState(false)
  const [displayedText, setDisplayedText] = useState("")
  const [currentAiResponse, setCurrentAiResponse] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [newMessage, setNewMessage] = useState("")
  const [isSending, setIsSending] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [chatHistory, setChatHistory] = useState<ChatHistoryItem[]>([])
  const [currentChatId, setCurrentChatId] = useState<string | null>(null)
  const [isInitialized, setIsInitialized] = useState(false)
  const [lastUserEmail, setLastUserEmail] = useState<string | null>(null)

  const userEmail = session?.user?.email
  const storageKey = getStorageKey(userEmail)

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, displayedText, isThinking, scrollToBottom])

  useEffect(() => {
    if (status !== 'authenticated' || !userEmail) return

    if (lastUserEmail && lastUserEmail !== userEmail) {
      setMessages([])
      setChatHistory([])
      setCurrentChatId(null)
      setIsInitialized(false)
    }
    
    const shouldLoadHistory = !isInitialized || (lastUserEmail && lastUserEmail !== userEmail) || !lastUserEmail
    
    if (shouldLoadHistory) {
      const history = loadChatHistory(storageKey)
      setChatHistory(history)
      setLastUserEmail(userEmail)
      
      const chatId = searchParams.get("id")
      if (chatId && history.length > 0) {
        const existingChat = history.find(chat => chat.id === chatId)
        if (existingChat?.messages && existingChat.messages.length > 0) {
          setMessages(existingChat.messages)
          setCurrentChatId(chatId)
          setIsInitialized(true)
        }
      }
    }
  }, [status, userEmail, storageKey, isInitialized, lastUserEmail, searchParams])

  useEffect(() => {
    if (isInitialized || !userEmail || status !== 'authenticated') return
    
    const chatId = searchParams.get("id")
    if (!chatId) return
    
    if (chatHistory.length > 0) {
      const existingChat = chatHistory.find(chat => chat.id === chatId)
      if (existingChat?.messages && existingChat.messages.length > 0) {
        setMessages(existingChat.messages)
        setCurrentChatId(chatId)
        setIsInitialized(true)
        return
      }
    }
  }, [chatHistory, userEmail, searchParams, isInitialized, status])

  const handleChatSelect = useCallback((chatId: string) => {
    const selectedChat = chatHistory.find(chat => chat.id === chatId)
    if (selectedChat) {
      router.push(`/chat?id=${chatId}`)
    }
    setSidebarOpen(false)
  }, [chatHistory, router])

  const loadExistingChat = useCallback((chatId: string, history: ChatHistoryItem[]): boolean => {
    const existingChat = history.find(chat => chat.id === chatId)
    if (existingChat?.messages && existingChat.messages.length > 0) {
      setMessages(existingChat.messages)
      setCurrentChatId(chatId)
      setIsInitialized(true)
      return true
    }
    return false
  }, [])

  useEffect(() => {
    if (isInitialized) return
    if (status === 'loading') return
    if (status === 'unauthenticated') {
      router.push("/dashboard")
      return
    }
    
    const chatId = searchParams.get("id")
    const promptParam = searchParams.get("prompt")
    
    if (chatId) {
      if (!userEmail || status !== 'authenticated') {
        return
      }
      
      const loadChat = () => {
        if (chatHistory.length === 0) {
          const history = loadChatHistory(storageKey)
          if (history.length > 0) {
            setChatHistory(history)
            const existingChat = history.find(chat => chat.id === chatId)
            if (existingChat?.messages && existingChat.messages.length > 0) {
              setMessages(existingChat.messages)
              setCurrentChatId(chatId)
              setIsInitialized(true)
              return true
            }
          }
        } else {
          const existingChat = chatHistory.find(chat => chat.id === chatId)
          if (existingChat?.messages && existingChat.messages.length > 0) {
            setMessages(existingChat.messages)
            setCurrentChatId(chatId)
            setIsInitialized(true)
            return true
          }
        }
        return false
      }
      
      if (loadChat()) {
        return
      }
      
      const timeoutId = setTimeout(() => {
        if (!isInitialized) {
          const loaded = loadChat()
          if (!loaded) {
            router.push("/dashboard")
          }
        }
      }, 2000)
      
      return () => clearTimeout(timeoutId)
    }
    
    if (!promptParam) {
      router.push("/dashboard")
      return
    }

    const userMessage = createMessage(Date.now().toString(), 'user', promptParam)
    setMessages([userMessage])
    
    const newChatId = Date.now().toString()
    setCurrentChatId(newChatId)
    
    const newChat: ChatHistoryItem = {
      id: newChatId,
      title: truncateText(promptParam),
      date: formatDate(new Date()),
      prompt: promptParam,
      messages: [userMessage]
    }
    
    setChatHistory(prev => {
      const updatedHistory = [newChat, ...prev]
      if (userEmail) {
        saveChatHistory(storageKey, updatedHistory)
      }
      return updatedHistory
    })
    
    setIsInitialized(true)

    const fetchAIResponse = async () => {
      setIsThinking(true)
      setError(null)

      const assistantMessageId = (Date.now() + 1).toString()
      const assistantMessage = createMessage(assistantMessageId, 'assistant', '', true)
      setMessages(prev => [...prev, assistantMessage])

      try {
        const response = await fetch('/api/generate', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ prompt: promptParam }),
        })

        if (!response.ok) {
          let errorMessage = 'Falha ao gerar o texto.'
          try {
            const errorData = await response.json()
            errorMessage = errorData.error || errorMessage
          } catch {
            errorMessage = `Erro na API: ${response.statusText || response.status}`
          }
          
          if (response.status === 401) {
            router.push("/dashboard")
            return
          }
          
          setMessages(prev => prev.map(msg => 
            msg.id === assistantMessageId 
              ? { ...msg, content: '', error: errorMessage, isTyping: false }
              : msg
          ))
          setIsThinking(false)
          return
        }

        const data = await response.json()
        const aiResponse = data.generatedText || ""
        
        setTimeout(() => {
          setMessages(prev => prev.map(msg => 
            msg.id === assistantMessageId 
              ? { ...msg, content: aiResponse, isTyping: false }
              : msg
          ))
          setCurrentAiResponse(aiResponse)
          setIsThinking(false)
        }, 1500)

      } catch (error: any) {
        console.error("Erro ao gerar texto: ", error)
        setMessages(prev => prev.map(msg => 
          msg.id === assistantMessageId 
            ? { ...msg, content: '', error: error?.message || 'Falha ao gerar o texto.', isTyping: false }
            : msg
        ))
        setIsThinking(false)
      }
    }

    fetchAIResponse()
  }, [searchParams, router, isInitialized, chatHistory, userEmail, storageKey, loadExistingChat])

  useEffect(() => {
    if (!isInitialized || !currentChatId || messages.length === 0 || !userEmail) return
    
    const timeoutId = setTimeout(() => {
      setChatHistory(prev => {
        const chatExists = prev.some(chat => chat.id === currentChatId)
        
        if (chatExists) {
          const updatedHistory = prev.map(chat => 
            chat.id === currentChatId 
              ? { ...chat, messages: messages }
              : chat
          )
          saveChatHistory(storageKey, updatedHistory)
          return updatedHistory
        }
        
        const firstUserMessage = messages.find(msg => msg.role === 'user')
        const title = firstUserMessage?.content 
          ? truncateText(firstUserMessage.content)
          : 'Novo Chat'
        
        const newChat: ChatHistoryItem = {
          id: currentChatId,
          title,
          date: formatDate(new Date()),
          prompt: firstUserMessage?.content || '',
          messages: messages
        }
        
        const updatedHistory = [newChat, ...prev]
        saveChatHistory(storageKey, updatedHistory)
        return updatedHistory
      })
    }, 500)
    
    return () => clearTimeout(timeoutId)
  }, [messages, currentChatId, isInitialized, userEmail, storageKey])

  useEffect(() => {
    if (!isThinking && currentAiResponse) {
      let currentIndex = 0
      setDisplayedText("")
      
      const typingInterval = setInterval(() => {
        if (currentIndex <= currentAiResponse.length) {
          setDisplayedText(currentAiResponse.slice(0, currentIndex))
          currentIndex++
        } else {
          clearInterval(typingInterval)
        }
      }, 20)

      return () => clearInterval(typingInterval)
    }
  }, [isThinking, currentAiResponse])

  const createNewChat = useCallback((messageToSend: string): string => {
    const chatId = Date.now().toString()
    setCurrentChatId(chatId)
    setIsInitialized(true)
    
    const newChat: ChatHistoryItem = {
      id: chatId,
      title: truncateText(messageToSend),
      date: formatDate(new Date()),
      prompt: messageToSend,
      messages: []
    }
    
    setChatHistory(prev => {
      const updatedHistory = [newChat, ...prev]
      if (userEmail) {
        saveChatHistory(storageKey, updatedHistory)
      }
      return updatedHistory
    })

    return chatId
  }, [userEmail, storageKey])

  const addMessage = useCallback((message: Message) => {
    setMessages(prev => {
      const messageExists = prev.some(msg => msg.id === message.id)
      if (messageExists) return prev
      return [...prev, message]
    })
  }, [])

  const updateMessage = useCallback((messageId: string, updates: Partial<Message>) => {
    setMessages(prev => prev.map(msg => 
      msg.id === messageId ? { ...msg, ...updates } : msg
    ))
  }, [])

  const handleSend = async () => {
    if (!newMessage.trim() || isSending) return

    const messageToSend = newMessage.trim()
    setNewMessage("")
    setIsSending(true)
    setIsThinking(true)
    setError(null)
    setDisplayedText("")
    setCurrentAiResponse("")

    let chatId = currentChatId || createNewChat(messageToSend)

    const baseTime = Date.now()
    const userMessageId = `${baseTime}_user`
    const assistantMessageId = `${baseTime + 1}_assistant`

    const userMessage = createMessage(userMessageId, 'user', messageToSend)
    addMessage(userMessage)

    const assistantMessage = createMessage(assistantMessageId, 'assistant', '', true)
    addMessage(assistantMessage)

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: messageToSend }),
      })

      if (!response.ok) {
        let errorMessage = 'Falha ao gerar o texto.'
        try {
          const errorData = await response.json()
          errorMessage = errorData.error || errorMessage
        } catch {
          errorMessage = `Erro na API: ${response.statusText || response.status}`
        }
        
        if (response.status === 401) {
          router.push("/dashboard")
          return
        }
        
        updateMessage(assistantMessageId, { content: '', error: errorMessage, isTyping: false })
        setIsThinking(false)
        setIsSending(false)
        return
      }

      const data = await response.json()
      const aiResponse = data.generatedText || ""
      
      setTimeout(() => {
        updateMessage(assistantMessageId, { content: aiResponse, isTyping: false })
        setCurrentAiResponse(aiResponse)
        setIsThinking(false)
        setIsSending(false)
      }, 1500)

    } catch (error: any) {
      console.error("Erro ao gerar texto: ", error)
      updateMessage(assistantMessageId, { 
        content: '', 
        error: error?.message || 'Falha ao gerar o texto.', 
        isTyping: false 
      })
      setIsThinking(false)
      setIsSending(false)
    }
  }

  const renderUserMessage = (message: Message) => (
    <div key={message.id} className="flex items-start gap-4 justify-end">
      <Card className="inline-block max-w-[85%] md:max-w-[75%] glass-effect border-cyan-500/30 bg-slate-950/90">
        <CardContent className="pt-4 pb-4 px-4">
          <p className="text-white text-base md:text-lg leading-relaxed break-words whitespace-pre-wrap">
            {message.content}
          </p>
        </CardContent>
      </Card>
      <Avatar className="border-2 border-cyan-400 flex-shrink-0">
        <AvatarImage src={session?.user?.image || ''} alt={session?.user?.name || 'Utilizador'} />
        <AvatarFallback>
          {session?.user?.name?.substring(0, 2).toUpperCase() || 'U'}
        </AvatarFallback>
      </Avatar>
    </div>
  )

  const renderAssistantMessage = (message: Message, index: number) => {
    const isLastMessage = index === messages.length - 1
    const isLastAiMessage = isLastMessage && message.role === 'assistant'
    const isTyping = message.isTyping && isLastAiMessage

    return (
      <div key={message.id} className="flex items-start gap-4">
        <Avatar className="border-2 border-purple-500 flex-shrink-0">
          <div className="w-full h-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <AvatarFallback>AI</AvatarFallback>
        </Avatar>
        <Card className="inline-block max-w-[85%] md:max-w-[75%] glass-effect border-purple-500/30 bg-slate-950/90">
          <CardContent className="pt-4 pb-4 px-4">
            {isTyping ? (
              <div className="flex items-center gap-3">
                <div className="flex gap-1">
                  <span className="w-2 h-2 bg-purple-500 rounded-full animate-bounce" style={{ animationDelay: "0ms" }} />
                  <span className="w-2 h-2 bg-cyan-500 rounded-full animate-bounce" style={{ animationDelay: "150ms" }} />
                  <span className="w-2 h-2 bg-pink-500 rounded-full animate-bounce" style={{ animationDelay: "300ms" }} />
                </div>
                <span className="text-gray-400 text-sm italic">GenioText está pensando...</span>
              </div>
            ) : message.error ? (
              <div className="text-red-400 text-base leading-relaxed">
                {message.error.startsWith('⚠️') ? message.error : `Erro: ${message.error}`}
              </div>
            ) : isLastAiMessage && displayedText ? (
              <div className="text-gray-200 text-base leading-relaxed whitespace-pre-wrap break-words">
                {displayedText}
                {displayedText.length < currentAiResponse.length && (
                  <span className="inline-block w-0.5 h-5 bg-cyan-400 ml-1 animate-pulse" />
                )}
              </div>
            ) : (
              <div className="text-gray-200 text-base leading-relaxed whitespace-pre-wrap break-words">
                {message.content}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    )
  }

  if (status === 'loading') {
    return (
      <div className="gradient-bg h-screen flex items-center justify-center">
        <p className="text-white text-lg">A carregar sessão...</p>
      </div>
    )
  }

  if (status === 'unauthenticated') {
    router.push("/dashboard")
    return null
  }

  return (
    <div className="gradient-bg h-screen flex overflow-hidden">
      <div
        className={`${
          sidebarOpen ? "w-80" : "w-0"
        } transition-all duration-300 border-r border-purple-500/30 overflow-hidden bg-slate-950/50 flex-shrink-0`}
      >
        <div className="h-full flex flex-col p-4">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
              Histórico
            </h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSidebarOpen(false)}
              className="text-gray-400 hover:text-white hover:bg-purple-500/20"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>
          <div className="flex-1 space-y-2 overflow-y-auto">
            {chatHistory.map((chat) => (
              <Card
                key={chat.id}
                onClick={() => handleChatSelect(chat.id)}
                className="glass-effect border-purple-500/20 bg-slate-950/50 hover:bg-slate-900/70 cursor-pointer transition-all duration-200 hover:border-purple-500/50"
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
      </div>

      <div className="flex-1 flex flex-col h-full overflow-hidden relative">
        <div className="flex-shrink-0 p-4 md:p-8 pb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {!sidebarOpen && (
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setSidebarOpen(true)}
                  className="border-purple-500/50 bg-purple-500/10 hover:bg-purple-500/20 text-white mr-2"
                >
                  <Menu className="w-4 h-4" />
                </Button>
              )}
              <Button
                variant="outline"
                onClick={() => router.push("/dashboard")}
                className="border-purple-500/50 bg-purple-500/10 hover:bg-purple-500/20 text-white"
              >
                <ArrowLeft className="w-4 h-4 mr-2" />
                Voltar
              </Button>
            </div>
            <div className="flex items-center gap-3">
              <Avatar className="border-2 border-cyan-400">
                <AvatarImage src={session?.user?.image || ''} alt={session?.user?.name || 'Utilizador'} />
                <AvatarFallback>
                  {session?.user?.name?.substring(0, 2).toUpperCase() || 'U'}
                </AvatarFallback>
              </Avatar>
              <span className="text-lg font-semibold text-white hidden md:inline">
                {session?.user?.name || 'Utilizador'}
              </span>
            </div>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto px-4 md:px-8 space-y-6 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <div className="mx-auto max-w-4xl w-full">
            {messages.map((message, index) => 
              message.role === 'user' 
                ? renderUserMessage(message)
                : renderAssistantMessage(message, index)
            )}
            <div ref={messagesEndRef} className="h-4" />
          </div>
        </div>
          
        <div className="flex-shrink-0 p-4 md:p-8 pt-4 bg-gradient-to-t from-slate-950 via-slate-950/90 to-transparent">
          <div className="mx-auto max-w-4xl w-full">
            <div className="glass-effect rounded-2xl p-1 border-2 border-transparent bg-gradient-to-r from-purple-500/50 to-cyan-500/50 overflow-hidden">
              <div className="flex gap-2 bg-slate-950/90 rounded-xl p-4">
                <Input
                  type="text"
                  placeholder="Digite sua mensagem..."
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      handleSend()
                    }
                  }}
                  disabled={isSending || isThinking}
                  className="flex-1 bg-slate-900/50 border-purple-500/30 text-white placeholder:text-gray-400 focus-visible:ring-purple-500"
                />
                <Button
                  onClick={handleSend}
                  disabled={!newMessage.trim() || isSending || isThinking}
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-semibold px-6 rounded-lg"
                >
                  {isSending || isThinking ? (
                    'Enviando...'
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" />
                      Enviar
                    </>
                  )}
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function ChatPage() {
  return (
    <SessionProvider>
      <ChatContent />
    </SessionProvider>
  )
}
