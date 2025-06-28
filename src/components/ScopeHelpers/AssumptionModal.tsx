
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus } from 'lucide-react';

interface AssumptionModalProps {
  onAdd: (assumption: any) => void;
}

const AssumptionModal: React.FC<AssumptionModalProps> = ({ onAdd }) => {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState({
    description: '',
    probability: '',
    riskIfFalse: ''
  });

  const handleSubmit = () => {
    if (formData.description.trim()) {
      onAdd(formData);
      setFormData({ description: '', probability: '', riskIfFalse: '' });
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <Plus className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Adicionar Premissa</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label htmlFor="description">Descrição</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Descreva a premissa..."
            />
          </div>
          <div>
            <Label htmlFor="probability">Probabilidade</Label>
            <Select value={formData.probability} onValueChange={(value) => setFormData({ ...formData, probability: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione a probabilidade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="alta">Alta</SelectItem>
                <SelectItem value="media">Média</SelectItem>
                <SelectItem value="baixa">Baixa</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label htmlFor="riskIfFalse">Risco se falsa</Label>
            <Textarea
              id="riskIfFalse"
              value={formData.riskIfFalse}
              onChange={(e) => setFormData({ ...formData, riskIfFalse: e.target.value })}
              placeholder="Que risco corremos se esta premissa não se confirmar?"
            />
          </div>
          <div className="flex gap-2 justify-end">
            <Button variant="outline" onClick={() => setOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSubmit}>
              Adicionar
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AssumptionModal;
