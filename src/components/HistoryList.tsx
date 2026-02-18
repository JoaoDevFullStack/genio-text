import {
    Card,
    CardAction,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"


interface Generation {
    _id: string;
    prompt: string;
    response: string;
    createdAt: string;
}

interface HistoryListProps {
    generations: Generation[];
}

export default function HistoryList({generations}: HistoryListProps) {
    if(generations.length === 0){
        return <p className="text-center text-muted-foreground mt-8">Nenhuma geração encontrada. Comece a criar!</p>;
    }

    return (
        <div className="w-full max-w-2xl mt-8 space-y-4">
          <h2 className="text-2xl font-bold text-center">Histórico</h2>
          {generations.map((gen) => (
            <Card key={gen._id}>
              <CardHeader>
                <CardTitle className="text-lg">Prompt:</CardTitle>
                <CardDescription className="text-md text-primary">{gen.prompt}</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="font-semibold">Resposta:</p>
                <p className="text-muted-foreground whitespace-pre-wrap">{gen.response}</p>
                <p className="text-xs text-muted-foreground/50 mt-4">
                  {new Date(gen.createdAt).toLocaleString('pt-BR')}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      );
}