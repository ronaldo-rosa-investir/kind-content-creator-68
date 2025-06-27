
import { useState } from "react";
import { useProject } from "@/contexts/ProjectContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, BookOpen } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const LessonsLearned = () => {
  const { lessonsLearned, addLessonLearned, updateLessonLearned, deleteLessonLearned } = useProject();
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    item: "",
    category: "tecnica" as const,
    description: "",
    impact: "medio" as const,
    recommendation: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingLesson) {
      updateLessonLearned(editingLesson, formData);
    } else {
      addLessonLearned(formData);
    }
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      item: "",
      category: "tecnica",
      description: "",
      impact: "medio",
      recommendation: "",
    });
    setEditingLesson(null);
    setIsDialogOpen(false);
  };

  const handleEdit = (lesson: any) => {
    setFormData(lesson);
    setEditingLesson(lesson.id);
    setIsDialogOpen(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Tem certeza que deseja excluir esta lição aprendida?")) {
      deleteLessonLearned(id);
    }
  };

  const getCategoryLabel = (category: string) => {
    const categories = {
      'tecnica': 'Técnica',
      'gerencial': 'Gerencial',
      'comunicacao': 'Comunicação',
      'riscos': 'Riscos',
      'outros': 'Outros'
    };
    return categories[category as keyof typeof categories] || category;
  };

  const getImpactLabel = (impact: string) => {
    const impacts = {
      'baixo': 'Baixo',
      'medio': 'Médio',
      'alto': 'Alto'
    };
    return impacts[impact as keyof typeof impacts] || impact;
  };

  const getImpactColor = (impact: string) => {
    const colors = {
      'baixo': 'bg-green-100 text-green-800',
      'medio': 'bg-yellow-100 text-yellow-800',
      'alto': 'bg-red-100 text-red-800'
    };
    return colors[impact as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Lições Aprendidas</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nova Lição Aprendida
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle>{editingLesson ? "Editar" : "Nova"} Lição Aprendida</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <Label htmlFor="item">Item</Label>
                <Input
                  id="item"
                  value={formData.item}
                  onChange={(e) => setFormData({ ...formData, item: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="category">Categoria</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value: any) => setFormData({ ...formData, category: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="tecnica">Técnica</SelectItem>
                    <SelectItem value="gerencial">Gerencial</SelectItem>
                    <SelectItem value="comunicacao">Comunicação</SelectItem>
                    <SelectItem value="riscos">Riscos</SelectItem>
                    <SelectItem value="outros">Outros</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="impact">Impacto</Label>
                <Select
                  value={formData.impact}
                  onValueChange={(value: any) => setFormData({ ...formData, impact: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="baixo">Baixo</SelectItem>
                    <SelectItem value="medio">Médio</SelectItem>
                    <SelectItem value="alto">Alto</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="description">Descrição</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="recommendation">Recomendação</Label>
                <Textarea
                  id="recommendation"
                  value={formData.recommendation}
                  onChange={(e) => setFormData({ ...formData, recommendation: e.target.value })}
                  required
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" className="flex-1">
                  {editingLesson ? "Atualizar" : "Criar"} Lição
                </Button>
                <Button type="button" variant="outline" onClick={resetForm}>
                  Cancelar
                </Button>
              </div>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4">
        {lessonsLearned.map((lesson) => (
          <Card key={lesson.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                  <div>
                    <CardTitle>{lesson.item}</CardTitle>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline">{getCategoryLabel(lesson.category)}</Badge>
                      <Badge className={getImpactColor(lesson.impact)}>
                        {getImpactLabel(lesson.impact)}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(lesson)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button variant="destructive" size="sm" onClick={() => handleDelete(lesson.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold text-sm text-muted-foreground">Descrição:</h4>
                  <p className="text-sm">{lesson.description}</p>
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-muted-foreground">Recomendação:</h4>
                  <p className="text-sm">{lesson.recommendation}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {lessonsLearned.length === 0 && (
        <div className="text-center py-12">
          <BookOpen className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground mb-4">Nenhuma lição aprendida registrada ainda</p>
          <p className="text-sm text-muted-foreground">
            Documente as lições aprendidas durante o projeto para futuros empreendimentos
          </p>
        </div>
      )}
    </div>
  );
};

export default LessonsLearned;
