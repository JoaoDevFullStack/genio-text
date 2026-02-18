
'use client'; 

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';


import { useSession, signIn, signOut } from 'next-auth/react';
import Image from 'next/image';

export default function GeneratorForm() {
  const [prompt, setPrompt] = useState('');
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { data: session, status } = useSession();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setIsLoading(true);
    setResult('');

    try {
      const response = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `Erro na API: ${response.statusText}`);
      }

      const data = await response.json();
      setResult(data.generatedText);
    } catch (error: any) {
      console.error("Erro ao gerar texto: ", error);
      setResult(error.message || 'Falha ao gerar o texto.');
    } finally {
      setIsLoading(false);
    }
  };

  if (status === 'loading') {
    return <p>Carregando...</p>;
  }

  if (status === 'unauthenticated') {
    return (
      <div className="w-full max-w-md text-center">
        <h1 className="text-3xl font-bold mb-4">Bem-vindo ao GenioText</h1>
        <p className="mb-6 text-muted-foreground">Faça login com o Google para começar a gerar.</p>
        <Button onClick={() => signIn('google')}>
          Fazer Login com Google
        </Button>
      </div>
    );
  }

  return (
    <div className="w-full max-w-2xl">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center gap-3">
          <Image 
            src={session?.user?.image || ''} 
            alt="Foto do perfil"
            width={40}
            height={40}
            className="rounded-full"
          />
          <span className="text-sm font-medium">Olá, {session?.user?.name}</span>
        </div>
        <Button variant="outline" size="sm" onClick={() => signOut()}>
          Fazer Logout
        </Button>
      </div>

      <h1 className="text-3xl font-bold text-center mb-2">
        GenioText
      </h1>
      <p className="text-center text-muted-foreground mb-6">
        Qual tópico você quer que a IA escreva?
      </p>

      <form onSubmit={handleSubmit} className="flex w-full items-center gap-2">
        <Input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Ex: Os benefícios do café"
          disabled={isLoading}
          className="flex-1"
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading ? 'Gerando...' : 'Gerar'}
        </Button>
      </form>

      {result && (
        <div className="mt-6 border rounded-md p-4 bg-muted/20">
          <h3 className="text-lg font-semibold mb-2">
            {result.startsWith('Erro') ? 'Erro' : 'Texto Gerado:'}
          </h3>
          <p className="text-sm whitespace-pre-wrap">
            {result}
          </p>
        </div>
      )}
    </div>
  );
}