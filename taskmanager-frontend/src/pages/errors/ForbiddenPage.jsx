import { ShieldAlert, ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/ui/Button';

export default function ForbiddenPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-6 bg-surface dark:bg-slate-900 text-center">
      <div className="w-20 h-20 rounded-full bg-red-100 dark:bg-red-950/20 flex items-center justify-center text-red-500 mb-6 animate-bounce-subtle">
        <ShieldAlert className="w-10 h-10" />
      </div>
      <h1 className="text-4xl font-extrabold text-slate-800 dark:text-slate-100 mb-2">403 Forbidden</h1>
      <p className="text-slate-500 dark:text-slate-400 max-w-md mb-8">
        You do not have administrative access permissions to view this dashboard resource.
      </p>
      <Button icon={ArrowLeft} onClick={() => navigate('/')}>
        Return to Dashboard
      </Button>
    </div>
  );
}
