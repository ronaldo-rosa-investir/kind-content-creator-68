
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Search, Edit, Trash2, Building, Mail, Phone } from "lucide-react";
import { Link } from "react-router-dom";

export default function Clients() {
  const [searchTerm, setSearchTerm] = useState("");

  // Mock data para demonstração
  const clients = [
    {
      id: 1,
      name: "Empresa ABC Ltda",
      email: "contato@empresaabc.com.br",
      phone: "(11) 99999-9999",
      address: "Av. Paulista, 1000 - São Paulo, SP",
      contact: "Carlos Mendes",
      projectsCount: 3,
      totalBudget: 315000
    },
    {
      id: 2,
      name: "Tech Solutions Inc",
      email: "hello@techsolutions.com",
      phone: "(11) 88888-8888",
      address: "Rua da Inovação, 500 - São Paulo, SP",
      contact: "Jennifer Smith",
      projectsCount: 1,
      totalBudget: 80000
    },
    {
      id: 3,
      name: "StartUp Inovadora",
      email: "contato@startup.com.br",
      phone: "(11) 77777-7777",
      address: "Rua do Empreendedor, 200 - São Paulo, SP",
      contact: "Rafael Lima",
      projectsCount: 1,
      totalBudget: 200000
    },
  ];

  const filteredClients = clients.filter(client =>
    client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    client.contact.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Clientes</h1>
        <Button asChild>
          <Link to="/clientes/novo">
            <Plus className="h-4 w-4 mr-2" />
            Novo Cliente
          </Link>
        </Button>
      </div>

      {/* Busca */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Buscar por nome, email ou contato..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Cards de Clientes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredClients.map((client) => (
          <Card key={client.id} className="hover:shadow-lg transition-shadow">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Building className="h-5 w-5 text-blue-600" />
                {client.name}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Mail className="h-4 w-4" />
                {client.email}
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Phone className="h-4 w-4" />
                {client.phone}
              </div>
              <div className="text-sm">
                <strong>Contato:</strong> {client.contact}
              </div>
              <div className="text-sm text-gray-600">
                {client.address}
              </div>
              <div className="pt-3 border-t">
                <div className="flex justify-between text-sm">
                  <span>{client.projectsCount} projeto(s)</span>
                  <span className="font-semibold">
                    R$ {client.totalBudget.toLocaleString('pt-BR')}
                  </span>
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <Button variant="ghost" size="sm">
                  <Edit className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="sm" className="text-red-600 hover:text-red-800">
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {filteredClients.length === 0 && (
        <Card>
          <CardContent className="text-center py-12">
            <Building className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Nenhum cliente encontrado
            </h3>
            <p className="text-gray-500 mb-4">
              {searchTerm ? "Tente ajustar sua busca" : "Você ainda não cadastrou nenhum cliente"}
            </p>
            <Button asChild>
              <Link to="/clientes/novo">
                <Plus className="h-4 w-4 mr-2" />
                Cadastrar Primeiro Cliente
              </Link>
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
