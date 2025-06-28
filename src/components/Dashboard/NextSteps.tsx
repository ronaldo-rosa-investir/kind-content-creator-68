
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { FileText, Target, CheckCircle, Activity, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface NextStepsProps {
  nextSteps: {
    title: string;
    description: string;
    action: string;
    link: string;
    icon: string;
    priority: string;
  };
}

export const NextSteps = ({ nextSteps }: NextStepsProps) => {
  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'FileText': return FileText;
      case 'Target': return Target;
      case 'CheckCircle': return CheckCircle;
      case 'Activity': return Activity;
      default: return FileText;
    }
  };

  const IconComponent = getIcon(nextSteps.icon);

  return (
    <Card className={`border-2 ${
      nextSteps.priority === 'high' ? 'border-red-200 bg-red-50' :
      nextSteps.priority === 'medium' ? 'border-yellow-200 bg-yellow-50' :
      'border-green-200 bg-green-50'
    }`}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <IconComponent className="h-5 w-5" />
          Próximos Passos
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h3 className="font-semibold text-lg">{nextSteps.title}</h3>
            <p className="text-muted-foreground">{nextSteps.description}</p>
          </div>
          <Link to={nextSteps.link}>
            <Button>
              {nextSteps.action}
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};
