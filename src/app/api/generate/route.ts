import { NextResponse } from 'next/server';
import { GoogleGenerativeAI, HarmCategory, HarmBlockThreshold } from '@google/generative-ai';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';

const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY!);

const safetySettings = [
  { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
  { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
  { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
  { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
];

const MODEL_NAME = 'gemini-2.5-flash-lite';

const handleQuotaError = (): NextResponse => {
  return NextResponse.json(
    { 
      error: 'Cota da API excedida. Você atingiu o limite de requisições gratuitas. Por favor, aguarde alguns minutos ou verifique seu plano de uso em https://ai.dev/usage?tab=rate-limit' 
    }, 
    { status: 429 }
  );
};

const handleOverloadError = (): NextResponse => {
  return NextResponse.json(
    { error: 'A IA está sobrecarregada. Por favor, tente novamente em alguns instantes.' }, 
    { status: 503 }
  );
};

const handleGenericError = (): NextResponse => {
  return NextResponse.json(
    { error: 'Um erro inesperado ocorreu.' }, 
    { status: 500 }
  );
};

const isQuotaError = (error: any): boolean => {
  return error.status === 429 || (error.message && error.message.includes('quota'));
};

const isOverloadError = (error: any): boolean => {
  return error.status === 503 || (error.message && error.message.includes('overloaded'));
};

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session?.user) {
    return NextResponse.json(
      { error: 'Não autorizado. Por favor, faça o login.' },
      { status: 401 }
    );
  }

  try {
    const body = await request.json();
    const { prompt } = body;
    
    if (!prompt) {
      return NextResponse.json(
        { error: 'Nenhum prompt fornecido' }, 
        { status: 400 }
      );
    }

    const model = genAI.getGenerativeModel({ model: MODEL_NAME, safetySettings });
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return NextResponse.json({ generatedText: text }, { status: 200 });

  } catch (error: any) {
    console.error('Erro na API /api/generate:', error);
    
    if (isQuotaError(error)) {
      return handleQuotaError();
    }
    
    if (isOverloadError(error)) {
      return handleOverloadError();
    }
    
    return handleGenericError();
  }
}
