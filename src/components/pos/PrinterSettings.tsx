import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Settings, Printer, Check } from 'lucide-react';
import { toast } from 'sonner';

const PRINTER_STORAGE_KEY = 'dube-burger-printer';

export const usePrinterSettings = () => {
  const [savedPrinter, setSavedPrinter] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(PRINTER_STORAGE_KEY);
    if (stored) {
      setSavedPrinter(stored);
    }
  }, []);

  const savePrinter = (printerName: string) => {
    localStorage.setItem(PRINTER_STORAGE_KEY, printerName);
    setSavedPrinter(printerName);
  };

  const clearPrinter = () => {
    localStorage.removeItem(PRINTER_STORAGE_KEY);
    setSavedPrinter(null);
  };

  return { savedPrinter, savePrinter, clearPrinter };
};

export const PrinterSettings = () => {
  const [open, setOpen] = useState(false);
  const { savedPrinter, savePrinter, clearPrinter } = usePrinterSettings();

  const handleTestPrint = () => {
    const testWindow = window.open('', '_blank', 'width=300,height=400');
    if (testWindow) {
      testWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Teste de Impressão</title>
          <style>
            @page {
              size: 80mm auto;
              margin: 0;
            }
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
            }
            body {
              font-family: 'Courier New', monospace;
              font-size: 14px;
              line-height: 1.4;
              padding: 8px;
              width: 80mm;
              color: #000 !important;
              background: #fff !important;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            .header {
              text-align: center;
              border-bottom: 2px dashed #000;
              padding-bottom: 12px;
              margin-bottom: 12px;
            }
            .title {
              font-size: 20px;
              font-weight: 900;
              letter-spacing: 1px;
            }
            .content {
              text-align: center;
              padding: 20px 0;
            }
            .check {
              font-size: 32px;
              margin-bottom: 8px;
            }
            .footer {
              text-align: center;
              border-top: 2px dashed #000;
              padding-top: 12px;
              margin-top: 12px;
              font-size: 12px;
            }
          </style>
        </head>
        <body>
          <div class="header">
            <div class="title">DUBE BURGER</div>
            <div>Teste de Impressão</div>
          </div>
          <div class="content">
            <div class="check">✓</div>
            <div style="font-weight: bold; font-size: 16px;">IMPRESSORA OK!</div>
            <div style="margin-top: 8px;">Se você está lendo isto,</div>
            <div>a impressora está funcionando.</div>
          </div>
          <div class="footer">
            <div>${new Date().toLocaleString('pt-BR')}</div>
          </div>
        </body>
        </html>
      `);
      testWindow.document.close();
      
      setTimeout(() => {
        testWindow.print();
        testWindow.onafterprint = () => {
          testWindow.close();
        };
      }, 250);
    }
  };

  const handleConfigurePrinter = () => {
    // Trigger print dialog so user can select and save printer
    const configWindow = window.open('', '_blank', 'width=300,height=200');
    if (configWindow) {
      configWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Configurar Impressora</title>
          <style>
            @page { size: 80mm auto; margin: 0; }
            body {
              font-family: 'Courier New', monospace;
              padding: 20px;
              text-align: center;
              width: 80mm;
            }
            .title { font-size: 18px; font-weight: bold; margin-bottom: 10px; }
            .info { font-size: 12px; color: #666; }
          </style>
        </head>
        <body>
          <div class="title">DUBE BURGER</div>
          <div class="info">Selecione sua impressora no diálogo</div>
          <div class="info">e marque "Lembrar seleção"</div>
        </body>
        </html>
      `);
      configWindow.document.close();
      
      setTimeout(() => {
        configWindow.print();
        configWindow.onafterprint = () => {
          savePrinter('configured');
          toast.success('Impressora configurada!');
          configWindow.close();
        };
      }, 250);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="lg" className="touch-button">
          <Settings className="w-5 h-5 mr-2" />
          Impressora
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Printer className="w-5 h-5" />
            Configuração de Impressora
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="p-4 bg-muted rounded-lg">
            <h4 className="font-medium mb-2">Status:</h4>
            {savedPrinter ? (
              <div className="flex items-center gap-2 text-green-500">
                <Check className="w-4 h-4" />
                <span>Impressora configurada</span>
              </div>
            ) : (
              <span className="text-muted-foreground">Nenhuma impressora configurada</span>
            )}
          </div>

          <div className="p-4 bg-muted/50 rounded-lg text-sm text-muted-foreground">
            <h4 className="font-medium text-foreground mb-2">Dicas para Bematech:</h4>
            <ul className="list-disc list-inside space-y-1">
              <li>Use papel térmico de boa qualidade</li>
              <li>Verifique a densidade de impressão no painel</li>
              <li>Limpe o cabeçote regularmente</li>
              <li>Configure ESC/POS mode se disponível</li>
            </ul>
          </div>
          
          <div className="flex flex-col gap-3">
            <Button 
              onClick={handleConfigurePrinter}
              className="touch-button w-full"
              size="lg"
            >
              <Printer className="w-5 h-5 mr-2" />
              Configurar Impressora
            </Button>
            
            <Button 
              onClick={handleTestPrint}
              variant="outline"
              className="touch-button w-full"
              size="lg"
            >
              Imprimir Teste
            </Button>
            
            {savedPrinter && (
              <Button 
                onClick={() => {
                  clearPrinter();
                  toast.info('Configuração removida');
                }}
                variant="ghost"
                className="text-destructive hover:text-destructive"
              >
                Remover Configuração
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
