'use client'

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Sparkles, ArrowRight, Zap, Shield, Brain, Wand2, Layers, Check } from "lucide-react"
import { MorphingText } from "@/components/morphing-text"
import { FloatingOrbs } from "@/components/floating-orbs"
import { InfiniteMarquee } from "@/components/infinite-marquee"
import { BentoGrid } from "@/components/bento-grid"
import { ParticleField } from "@/components/particle-field"
import Header from "@/components/Header"
import { SessionProvider } from "next-auth/react"

const marqueeItems = [
  "GPT-4 Turbo",
  "Claude 3.5",
  "Gemini Pro",
  "100+ Templates",
  "API Integrada",
  "Multi-idiomas",
  "SEO Otimizado",
  "Analytics Avançado",
]

const bentoItems = [
  {
    title: "IA de Próxima Geração",
    description:
      "Utilizamos os modelos mais avançados do mercado, incluindo GPT-4 Turbo e Claude 3.5, para gerar conteúdo com qualidade humana e contexto preciso.",
    icon: <Brain className="w-6 h-6 text-primary" />,
    gradient: "bg-gradient-to-br from-primary/20 via-transparent to-accent/10",
  },
  {
    title: "Edição Mágica",
    description: "Refine e aprimore seu conteúdo com ferramentas de edição inteligente.",
    icon: <Wand2 className="w-6 h-6 text-primary" />,
  },
  {
    title: "Multi-formato",
    description: "Exporte para blogs, redes sociais, e-mails e muito mais.",
    icon: <Layers className="w-6 h-6 text-primary" />,
  },
  {
    title: "Velocidade Extrema",
    description: "Geração em tempo real, sem filas de espera.",
    icon: <Zap className="w-6 h-6 text-primary" />,
  },
  {
    title: "Segurança Total",
    description: "Seus dados protegidos com criptografia de ponta.",
    icon: <Shield className="w-6 h-6 text-primary" />,
  },
]

export default function Home() {
  return (
    <SessionProvider>
      <div className="relative flex flex-col min-h-screen bg-background text-foreground selection:bg-primary/30 overflow-hidden">
        <ParticleField />

        <FloatingOrbs />

        <div className="fixed inset-0 grid-pattern pointer-events-none z-[1]" />

        <Header />

        <main className="flex-1 relative z-10">
          <section className="relative pt-20 pb-16 overflow-hidden">
            <div className="container mx-auto px-4 text-center max-w-5xl relative">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/[0.03] border border-white/[0.08] backdrop-blur-sm mb-12">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-primary" />
                </span>
                <span className="text-sm font-medium text-muted-foreground">Nova IA disponível</span>
              </div>

              <h1 className="text-5xl md:text-7xl lg:text-8xl font-black mb-8 leading-[0.95] tracking-tight">
                <span className="block text-foreground">Crie conteúdo</span>
                <span className="block mt-2">
                  <MorphingText />
                </span>
              </h1>

              <p className="text-lg md:text-xl text-muted-foreground mb-14 max-w-2xl mx-auto leading-relaxed">
                O GenioText utiliza inteligência artificial de última geração para transformar suas ideias em conteúdo
                profissional em segundos.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                <Link href="/dashboard" className="cursor-pointer">
                  <Button className="relative h-14 px-8 text-base bg-foreground text-background font-bold rounded-full overflow-hidden group cursor-pointer">
                    <span className="relative z-10 flex items-center gap-2">
                      Começar Gratuitamente
                      <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                    <div className="absolute inset-0 bg-gradient-to-r from-primary/40 to-accent/40 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </Button>
                </Link>
                <Link href="#demo" className="cursor-pointer">
                  <Button
                    size="lg"
                    variant="outline"
                    className="h-14 px-8 text-base border-white/[0.1] bg-white/[0.02] hover:bg-white/[0.05] hover:border-primary/30 text-foreground rounded-full backdrop-blur-sm transition-all duration-300 cursor-pointer"
                  >
                    Ver Demonstração
                  </Button>
                </Link>
              </div>
            </div>
          </section>

          <section className="relative py-8 border-y border-white/[0.04]">
            <InfiniteMarquee items={marqueeItems} speed={60} />
          </section>

          <section id="recursos" className="relative py-20">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <p className="text-sm font-semibold text-primary tracking-widest uppercase mb-4">Recursos</p>
                <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground">Tudo em um só lugar</h2>
              </div>

              <BentoGrid items={bentoItems} />
            </div>
          </section>

          <section id="preços" className="relative py-20 border-t border-white/[0.04]">
            <div className="container mx-auto px-4">
              <div className="text-center mb-12">
                <p className="text-sm font-semibold text-primary tracking-widest uppercase mb-4">Preços</p>
                <h2 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground mb-4">Comece grátis</h2>
                <p className="text-lg text-muted-foreground max-w-xl mx-auto">
                  Para quem quer experimentar o poder da IA.
                </p>
              </div>

              <div className="max-w-md mx-auto">
                <div className="relative rounded-2xl overflow-hidden">
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary/20 via-accent/20 to-primary/20 rounded-2xl blur-xl opacity-50" />

                  <div className="relative bg-card/90 backdrop-blur-xl border border-white/[0.08] rounded-2xl p-8">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h3 className="text-2xl font-bold text-foreground">Starter</h3>
                        <p className="text-muted-foreground text-sm mt-1">Gratuito para sempre</p>
                      </div>
                      <div className="bg-primary/10 border border-primary/20 text-primary text-xs font-semibold px-3 py-1 rounded-full">
                        Popular
                      </div>
                    </div>

                    <div className="flex items-baseline gap-1 mb-8">
                      <span className="text-5xl font-black tracking-tight text-foreground">R$0</span>
                      <span className="text-muted-foreground">/mês</span>
                    </div>

                    <ul className="space-y-4 mb-8">
                      {[
                        "10 gerações por mês",
                        "Modelo Gemini Flash",
                        "Velocidade padrão",
                        "Histórico dos últimos 3 dias",
                        "Sem cartão de crédito",
                      ].map((feature, i) => (
                        <li key={i} className="flex items-center gap-3 text-foreground/80">
                          <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                            <Check className="w-3 h-3 text-primary" />
                          </div>
                          {feature}
                        </li>
                      ))}
                    </ul>

                    <Link href="/dashboard" className="block cursor-pointer">
                      <Button className="w-full h-14 bg-foreground text-background font-bold rounded-xl shadow-[0_0_30px_rgba(139,92,246,0.2)] hover:shadow-[0_0_40px_rgba(139,92,246,0.3)] transition-all duration-300 group relative overflow-hidden cursor-pointer">
                        <span className="relative z-10 flex items-center justify-center gap-2">
                          Começar Agora
                          <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                        </span>
                        <div className="absolute inset-0 bg-gradient-to-r from-primary/30 to-accent/30 opacity-0 group-hover:opacity-100 transition-opacity" />
                      </Button>
                    </Link>

                    <p className="text-center text-xs text-muted-foreground mt-4">Comece agora, sem compromisso</p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section id="demo" className="relative py-20">
            <div className="container mx-auto px-4">
              <div className="max-w-4xl mx-auto">
                <div className="relative rounded-2xl overflow-hidden">
                  <div className="absolute -inset-1 bg-gradient-to-r from-primary/30 via-accent/30 to-primary/30 rounded-2xl blur-xl opacity-50" />

                  <div className="relative bg-card/90 backdrop-blur-xl border border-white/[0.08] rounded-2xl p-8 shadow-2xl">
                    <div className="flex items-center gap-2 mb-6">
                      <div className="w-3 h-3 rounded-full bg-red-500/80" />
                      <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                      <div className="w-3 h-3 rounded-full bg-green-500/80" />
                      <span className="ml-4 text-sm text-muted-foreground font-mono">geniotext-ai</span>
                    </div>

                    <div className="space-y-4">
                      <div className="flex items-start gap-4">
                        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shrink-0">
                          <Sparkles className="w-5 h-5 text-foreground" />
                        </div>
                        <div className="flex-1">
                          <p className="text-sm text-muted-foreground mb-3">Gerando conteúdo...</p>
                          <div className="h-2 w-full bg-white/[0.05] rounded-full overflow-hidden">
                            <div
                              className="h-full bg-gradient-to-r from-primary via-accent to-primary rounded-full"
                              style={{ width: "75%" }}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="mt-8 p-6 rounded-xl bg-white/[0.03] border border-white/[0.06]">
                        <p className="text-foreground/90 leading-relaxed text-lg">
                          &ldquo;O futuro do trabalho está aqui. Com a IA, você pode criar conteúdo 10x mais rápido,
                          mantendo a qualidade e originalidade que seu público espera...&rdquo;
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          <section className="relative py-20 border-t border-white/[0.04]">
            <div className="container mx-auto px-4 text-center max-w-3xl">
              <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
                Pronto para <span className="text-primary">começar</span>?
              </h2>
              <p className="text-lg text-muted-foreground mb-12">
                Junte-se a milhares de criadores que já estão usando o GenioText para criar conteúdo incrível.
              </p>
              <Link href="/dashboard" className="cursor-pointer">
                <Button className="h-16 px-12 text-lg bg-foreground text-background font-bold rounded-full shadow-[0_0_40px_rgba(139,92,246,0.3)] hover:shadow-[0_0_50px_rgba(139,92,246,0.4)] transition-all duration-500 group relative overflow-hidden cursor-pointer">
                  <span className="relative z-10 flex items-center gap-3">
                    Criar Conta Gratuita
                    <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-primary/30 via-accent/30 to-primary/30 opacity-0 group-hover:opacity-100 transition-opacity" />
                </Button>
              </Link>
            </div>
          </section>
        </main>

        <footer className="relative z-10 py-12 border-t border-white/[0.04]">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-3">
                <div className="bg-gradient-to-br from-primary to-accent p-2 rounded-xl">
                  <Sparkles className="w-4 h-4 text-foreground" />
                </div>
                <span className="font-bold text-lg tracking-tight text-foreground">GenioText</span>
              </div>
              <p className="text-sm text-muted-foreground">&copy; 2025 GenioText. Todos os direitos reservados.</p>
            </div>
          </div>
        </footer>
      </div>
    </SessionProvider>
  )
}
