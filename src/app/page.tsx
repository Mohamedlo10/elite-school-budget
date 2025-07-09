import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import Image from "next/image"
import Link from "next/link"
import { ArrowRight, BarChart3, Building2, Clock, Users } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-muted">
      {/* Hero Section */}
      <header className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl lg:text-7xl">
          Elite<span className="text-primary">Budget</span>
        </h1>
        <p className="mx-auto mt-4 max-w-2xl text-muted-foreground md:text-xl">
          Simplifiez la gestion budgétaire de votre département universitaire avec notre plateforme intuitive et puissante
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link href="/auth/login">
            <Button size="lg" className="h-11 px-8">
              Commencer
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
          <Link href="#features">
            <Button variant="outline" size="lg" className="h-11 px-8">
              En savoir plus
            </Button>
          </Link>
        </div>
      </header>

      {/* Features Section */}
      <section id="features" className="container mx-auto px-4 py-16">
        <h2 className="text-center text-3xl font-bold tracking-tighter sm:text-4xl md:text-5xl">
          Fonctionnalités principales
        </h2>
        <div className="mt-12 grid gap-8 md:grid-cols-2 lg:grid-cols-4">
          <FeatureCard
            icon={<Building2 className="h-8 w-8" />}
            title="Gestion des Départements"
            description="Organisez et gérez efficacement les besoins de chaque département"
          />
          <FeatureCard
            icon={<Users className="h-8 w-8" />}
            title="Gestion du Personnel"
            description="Suivez les demandes et les validations de votre équipe"
          />
          <FeatureCard
            icon={<Clock className="h-8 w-8" />}
            title="Périodes de Collecte"
            description="Planifiez et contrôlez les périodes de soumission des besoins"
          />
          <FeatureCard
            icon={<BarChart3 className="h-8 w-8" />}
            title="Rapports & Analytics"
            description="Générez des rapports détaillés et suivez vos budgets"
          />
        </div>
      </section>

      {/* Stats Section */}
      <section className="bg-muted/50 py-16">
        <div className="container mx-auto px-4">
          <div className="grid gap-8 md:grid-cols-3">
            <StatCard number="99%" text="Satisfaction utilisateur" />
            <StatCard number="50+" text="Départements utilisateurs" />
            <StatCard number="10k+" text="Besoins traités" />
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t bg-background">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col items-center justify-between gap-4 md:flex-row">
            <div className="flex items-center gap-2">
              <Image
                src="/next.svg"
                alt="Logo"
                width={32}
                height={32}
                className="dark:invert"
              />
              <span className="text-xl font-bold">Elite Budgetisation</span>
            </div>
            <p className="text-sm text-muted-foreground">
              © {new Date().getFullYear()} Elite Budgetisation. Tous droits réservés.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}

function FeatureCard({ icon, title, description }: {
  icon: React.ReactNode
  title: string
  description: string
}) {
  return (
    <Card className="transition-all hover:scale-105">
      <CardContent className="flex flex-col items-center p-6 text-center">
        <div className="mb-4 rounded-full bg-primary/10 p-3 text-primary">
          {icon}
        </div>
        <h3 className="mb-2 text-xl font-bold">{title}</h3>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardContent>
    </Card>
  )
}

function StatCard({ number, text }: { number: string; text: string }) {
  return (
    <div className="text-center">
      <div className="text-4xl font-bold text-primary">{number}</div>
      <div className="mt-2 text-sm text-muted-foreground">{text}</div>
    </div>
  )
}
