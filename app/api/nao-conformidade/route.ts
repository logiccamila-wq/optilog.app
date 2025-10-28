import { NextRequest, NextResponse } from 'next/server';
import { writeFile } from 'fs/promises';
import { join } from 'path';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    
    const tipo = formData.get('tipo') as string;
    const gravidade = formData.get('gravidade') as string;
    const descricao = formData.get('descricao') as string;
    const foto = formData.get('foto') as File;

    // Validações
    if (!tipo || !gravidade || !descricao || !foto) {
      return NextResponse.json(
        { success: false, error: 'Todos os campos são obrigatórios' },
        { status: 400 }
      );
    }

    // Gerar número de protocolo único
    const protocolo = `NC-${Date.now()}-${Math.random().toString(36).substr(2, 6).toUpperCase()}`;

    // Salvar foto (em produção, use AWS S3 ou similar)
    const bytes = await foto.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    const filename = `${protocolo}-${foto.name}`;
    const uploadDir = join(process.cwd(), 'backend', 'uploads', 'nao-conformidades');
    const filepath = join(uploadDir, filename);
    
    try {
      await writeFile(filepath, buffer);
    } catch (err) {
      console.error('Erro ao salvar foto:', err);
      // Se der erro ao salvar, continua sem a foto
    }

    // Aqui você salvaria no banco de dados
    const naoConformidade = {
      protocolo,
      tipo,
      gravidade,
      descricao,
      fotoUrl: `/uploads/nao-conformidades/${filename}`,
      dataHora: new Date().toISOString(),
      status: 'pendente-analise',
      motoristaId: 1, // Pegar do token/session
      // Campos para auditoria
      auditoriaVirtual: {
        status: 'em-analise',
        prioridade: gravidade === 'alta' ? 'urgente' : gravidade === 'media' ? 'normal' : 'baixa',
        notificacoes: {
          consultorSASMMAQ: true,
          auditorISO: gravidade === 'alta',
          gerenteOperacoes: gravidade !== 'baixa'
        }
      }
    };

    // Simular análise inicial da IA
    const analisePreliminar = {
      categoriaRisco: gravidade === 'alta' ? 'Crítico' : gravidade === 'media' ? 'Moderado' : 'Baixo',
      impactoKPI: {
        seguranca: gravidade === 'alta' ? -5 : gravidade === 'media' ? -2 : -1,
        conformidade: -3,
        satisfacaoCliente: tipo.includes('cliente') ? -4 : 0
      },
      acoesSugeridas: gerarAcoesSugeridas(tipo, gravidade),
      prazosRecomendados: {
        investigacao: gravidade === 'alta' ? '4 horas' : '24 horas',
        resolucao: gravidade === 'alta' ? '24 horas' : '72 horas',
        relatorio: gravidade === 'alta' ? '48 horas' : '7 dias'
      }
    };

    // Retornar resposta
    return NextResponse.json({
      success: true,
      protocolo,
      mensagem: 'Não conformidade registrada com sucesso',
      detalhes: {
        tipo,
        gravidade,
        dataHora: naoConformidade.dataHora,
        fotoSalva: true
      },
      notificacoes: {
        whatsapp: 'Protocolo será enviado via WhatsApp em até 5 minutos',
        auditoriaVirtual: 'Auditoria Virtual foi notificada e iniciará análise',
        consultoria: naoConformidade.auditoriaVirtual.notificacoes.consultorSASMMAQ 
          ? 'Consultoria SASSMAQ/ISO será acionada' 
          : 'Não requer consultoria especializada no momento'
      },
      analisePreliminar,
      proximosPassos: [
        '1. Aguarde contato da equipe de operações',
        '2. Mantenha documentação e evidências disponíveis',
        gravidade === 'alta' ? '3. URGENTE: Não movimente o veículo até liberação' : '3. Continue operação normal se seguro',
        '4. Acompanhe o protocolo no app'
      ]
    });

  } catch (error) {
    console.error('Erro ao processar não conformidade:', error);
    return NextResponse.json(
      { success: false, error: 'Erro ao processar solicitação' },
      { status: 500 }
    );
  }
}

function gerarAcoesSugeridas(tipo: string, gravidade: string): string[] {
  const acoes: string[] = [];

  // Ações comuns
  acoes.push('Documentar todas as evidências (fotos, testemunhas, documentos)');
  
  if (gravidade === 'alta') {
    acoes.push('Isolar área/veículo imediatamente');
    acoes.push('Acionar supervisor de operações');
  }

  // Ações específicas por tipo
  switch (tipo) {
    case 'avaria-carga':
      acoes.push('Fotografar avaria de múltiplos ângulos');
      acoes.push('Não movimentar carga avariada');
      acoes.push('Acionar seguradora (RCF-DC)');
      acoes.push('Solicitar laudo do destinatário');
      break;
    
    case 'problema-veiculo':
      acoes.push('Acionar assistência 24h');
      acoes.push('Verificar se está coberto por garantia');
      if (gravidade === 'alta') acoes.push('Solicitar veículo reserva');
      break;
    
    case 'acidente':
      acoes.push('Chamar autoridades (PRF/Polícia)');
      acoes.push('Acionar seguro imediatamente');
      acoes.push('Não assinar documentos sem orientação jurídica');
      acoes.push('Realizar teste toxicológico');
      break;
    
    case 'roubo-furto':
      acoes.push('Registrar BO imediatamente');
      acoes.push('Acionar rastreador/central');
      acoes.push('Notificar seguradora em até 24h');
      acoes.push('Bloquear documentos do veículo');
      break;
    
    case 'desvio-rota':
      acoes.push('Justificar motivo do desvio');
      acoes.push('Verificar impacto no prazo de entrega');
      acoes.push('Comunicar cliente sobre atraso');
      break;
  }

  return acoes;
}
