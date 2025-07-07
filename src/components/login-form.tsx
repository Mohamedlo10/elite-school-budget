"use client";

import React, { useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { login } from '@/store/features/auth/authSlice';
import { useRouter } from 'next/navigation';
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { toast } from "sonner"
import { Loader2 } from "lucide-react"

export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"form">) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const dispatch = useAppDispatch();
  const router = useRouter();
  
  const [isLoading, setIsLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await dispatch(login({ email, password })).unwrap();
      toast.success("Connexion réussie", {
        description: "Redirection vers le tableau de bord..."
      });
      setIsLoading(false);
      router.push('/dashboard');
    } catch (err) {
      toast.error("Erreur d'authentification", {
        description: "Email ou mot de passe incorrect"
      });
      setIsLoading(false);
    }
  };

  return (
    <form 
      className={cn("flex flex-col gap-6 text-[#4F46E5]", className)} 
      onSubmit={handleSubmit}
      {...props}
    >
      <div className="flex flex-col items-center gap-2 text-center">
        <h1 className="text-2xl font-bold">Connexion</h1>
        <p className="text-balance text-sm text-muted-foreground">
          Entrez vos identifiants pour accéder à votre compte
        </p>
      </div>
      <div className="grid gap-6 text-[#4F46E5]">
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input 
            id="email" 
            className='text-[#4F46E5]'
            type="email" 
            placeholder="nom@exemple.fr"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={isLoading}
            required 
          />
        </div>
        <div className="grid gap-2">
          <div className="flex items-center">
            <Label htmlFor="password">Mot de passe</Label>
            <a
              href="#"
              className="ml-auto text-sm text-muted-foreground underline-offset-4 hover:underline"
            >
              Mot de passe oublié ?
            </a>
          </div>
          <Input 
            id="password" 
            className='text-[#4F46E5]'
            type="password"
            placeholder="Votre mot de passe"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={isLoading}
            required 
          />
        </div>
        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Se connecter
        </Button>
      </div>
    </form>
  )
}
