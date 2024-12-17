'use client'

import { useState } from 'react';
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle } from 'lucide-react'

export default function Home() {
  const [token, setToken] = useState('');
  const [channelId, setChannelId] = useState('');
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleClearChannel = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage('');
    setIsError(false);

    try {
      const response = await fetch('/api/clear-channel', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, channelId }),
      });
      const data = await response.json();
      setMessage(data.message);
      setIsError(!data.success);
    } catch (error) {
      setMessage('Ocorreu um erro ao processar sua solicitação.');
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClearAll = async () => {
    if (!confirm('Tem certeza que deseja apagar TODAS as suas mensagens? Esta ação não pode ser desfeita.')) {
      return;
    }

    setIsLoading(true);
    setMessage('');
    setIsError(false);

    try {
      const response = await fetch('/api/clear-all', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token }),
      });
      const data = await response.json();
      setMessage(data.message);
      setIsError(!data.success);
    } catch (error) {
      setMessage('Ocorreu um erro ao processar sua solicitação.');
      setIsError(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Hakai Clear</CardTitle>
          <CardDescription>Limpe mensagens de um canal específico ou de toda a sua conta</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleClearChannel} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="token">Token do Discord</Label>
              <Input
                id="token"
                type="password"
                value={token}
                onChange={(e) => setToken(e.target.value)}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="channelId">ID do Canal</Label>
              <Input
                id="channelId"
                type="text"
                value={channelId}
                onChange={(e) => setChannelId(e.target.value)}
                required
              />
            </div>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Processando...' : 'Limpar Canal'}
            </Button>
          </form>
        </CardContent>
        <CardFooter>
          <Button onClick={handleClearAll} variant="destructive" disabled={isLoading}>
            {isLoading ? 'Processando...' : 'Limpar Todas as Mensagens'}
          </Button>
        </CardFooter>
      </Card>
      {message && (
        <Alert variant={isError ? "destructive" : "default"} className="mt-4">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>{isError ? "Erro" : "Sucesso"}</AlertTitle>
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}
    </div>
  );
}

