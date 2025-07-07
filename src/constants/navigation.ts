import { Home, Users, FileText, ClipboardList, Settings, Calendar, BarChart, CheckSquare, Building } from "lucide-react";

// Navigation items for Department Head (Chef de département)
export const departmentHeadNavItems = [
    {
      title: "Tableau de bord",
      url: "/dashboard",
      icon: Home,
      items: [
        {
          title: "Vue d'ensemble",
          url: "/dashboard",
        },
      ],
    },
    {
      title: "Gestion Personnel",
      url: "/dashboard/staff/list",
      icon: Users,
      items: [
        {
          title: "Liste Personnel",
          url: "/dashboard/staff/list",
        },
        {
          title: "Gérer les Catégories",
          url: "/dashboard/staff/categories",
        },
      ],
    },
    {
      title: "Période de Collecte",
      url: "/dashboard/collection",
      icon: Calendar,
    },
    {
      title: "Validation Besoins",
      url: "/dashboard/validation",
      icon: CheckSquare,
      items: [
        /*
        {
          title: "En attente",
          url: "/dashboard/validation/pending",
        },
        {
          title: "À réviser",
          url: "/dashboard/validation/revision",
        },
        {
          title: "Historique",
          url: "/dashboard/validation/history",
        },*/
      ],
    },
    {
      title: "Export (XLSX)",
      url: "/dashboard/reports",
      icon: FileText,
      items: [
        /*
        {
          title: "Synthèse Besoins",
          url: "/dashboard/reports/summary",
        },
        {
          title: "Rapport Budget",
          url: "/dashboard/needs/summary",
        },
        {
          title: "Export PDF",
          url: "/dashboard/reports/export",
        }, */
      ],
    },
];

// Navigation items for Staff (Personnel éligible)
export const staffNavItems = [
    {
      title: "Tableau de bord",
      url: "/dashboard",
      icon: Home,
      items: [
        {
          title: "Vue d'ensemble",
          url: "/dashboard",
        },
      ],
    },
    {
      title: "Mes Besoins",
      url: "",
      icon: ClipboardList,
      items: [
        {
          title: "Nouvelle Soumission",
          url: "/dashboard/needs/submit",
        },
        {
          title: "Mes Soumissions",
          url: "/dashboard/needs/list",
        },
        /*
        {
          title: "À Réviser",
          url: "/dashboard/needs/revision",
        },*/
      ],
    },
    {
      title: "Historique",
      url: "/dashboard/history",
      icon: FileText,
      items: []
    } 
  /*
      items: [
        {
          title: "Besoins Validés",
          url: "/dashboard/history/approved",
        },
        {
          title: "Besoins Rejetés",
          url: "/dashboard/history/rejected",
        },
      ],
    },*/
];

// Add this to your existing navigation exports
export const adminNavItems = [
    {
      title: "Tableau de bord",
      url: "/dashboard",
      icon: Home,
      isActive: true,
      items: [
        {
          title: "Vue d'ensemble",
          url: "/dashboard",
        },
      ],
    },
    {
      title: "Départements",
      url: "/dashboard/departments",
      icon: Building,
      isActive: false,
      items: []
    },
    {
      title: "Utilisateurs",
      url: "/dashboard/users",
      icon: Users,
      isActive: false,
      items: []
    },
    /*
    {
      title: "Gestion Budget",
      url: "/dashboard/budget",
      icon: BarChart,
      isActive: false,
      items: [
        {
          title: "Aperçu Budget",
          url: "/dashboard/budget/overview",
        },
        {
          title: "Validation Besoins",
          url: "/dashboard/budget/needs",
        },
      ],
    },
    {
      title: "Paramètres",
      url: "/dashboard/settings",
      icon: Settings,
      isActive: false,
      items: [
        {
          title: "Configuration Système",
          url: "/dashboard/settings/system",
        },
        {
          title: "Périodes Budgétaires",
          url: "/dashboard/settings/periods",
        },
      ],
    },*/
];