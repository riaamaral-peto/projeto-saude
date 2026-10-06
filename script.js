/* ============================================================
   PROJETO 87 kg — script.js
   Bloco 1: salvamento automático no localStorage
   ============================================================ */

const CHAVE = 'projeto87kg';

const campos = document.querySelectorAll('[data-campo]');

function salvarDados() {
  const dados = {};

  campos.forEach(campo => {
    const nome = campo.dataset.campo;

    if (campo.type === 'checkbox') {
      dados[nome] = campo.checked;
    } else {
      dados[nome] = campo.value;
    }
  });

  localStorage.setItem(CHAVE, JSON.stringify(dados));
}

function carregarDados() {
  const salvos = localStorage.getItem(CHAVE);
  if (!salvos) return;

  const dados = JSON.parse(salvos);

  campos.forEach(campo => {
    const nome = campo.dataset.campo;

    if (dados[nome] === undefined) return;

    if (campo.type === 'checkbox') {
      campo.checked = dados[nome];
    } else {
      campo.value = dados[nome];
    }
  });
}

campos.forEach(campo => {
  campo.addEventListener('input', salvarDados);
  campo.addEventListener('change', salvarDados);
});

carregarDados();

console.log('✅ Bloco 1 carregado: salvamento automático ativo');
/* ============================================================
   Bloco 2: botões de relatório e reset
   ============================================================ */

// ------------------------------------------------------------
// RELATÓRIO COMPLETO — abre janela de impressão
// ------------------------------------------------------------
document.getElementById('btn-relatorio').addEventListener('click', () => {
  window.print();
});

// ------------------------------------------------------------
// RESETAR — apaga todos os dados
// ------------------------------------------------------------
document.getElementById('btn-limpar').addEventListener('click', () => {
  const confirmar = confirm('⚠️ Isso vai apagar TODOS os dados preenchidos (campos, perfil e anotações). Tem certeza?');
  if (!confirmar) return;

  // Limpa todos os campos com data-campo
  campos.forEach(campo => {
    if (campo.type === 'checkbox') {
      campo.checked = false;
    } else {
      campo.value = '';
    }
  });

  // Remove do localStorage
  localStorage.removeItem(CHAVE);
  localStorage.removeItem(CHAVE_PERFIL);

  // Recarrega a página para restaurar o perfil padrão
  location.reload();
});

console.log('✅ Bloco 2 carregado: relatório e reset ativos');
/* ============================================================
   Bloco 3: painel de personalização
   ============================================================ */

const CHAVE_PERFIL = 'projeto87kg-perfil';

const perfilPadrao = {
  nome: 'Rian',
  pesoInicial: '97',
  meta: '87',
  altura: '1,65',
  pessoa: 'Pietro',
  motivo: 'ter mais saúde, disposição e tempo de qualidade para acompanhar o Pietro ao longo da vida'
};

// Pegar elementos do painel
const painel = document.getElementById('painel-personalizar');
const inputNome = document.getElementById('personalizar-nome');
const inputPesoInicial = document.getElementById('personalizar-peso-inicial');
const inputMeta = document.getElementById('personalizar-meta');
const inputAltura = document.getElementById('personalizar-altura');
const inputPessoa = document.getElementById('personalizar-pessoa');
const inputMotivo = document.getElementById('personalizar-motivo');

// ------------------------------------------------------------
// Carregar perfil salvo (ou padrão)
// ------------------------------------------------------------
function carregarPerfil() {
  const salvo = localStorage.getItem(CHAVE_PERFIL);
  return salvo ? JSON.parse(salvo) : { ...perfilPadrao };
}

// ------------------------------------------------------------
// Aplicar perfil aos textos do site
// ------------------------------------------------------------
function aplicarPerfil(perfil) {
  const titulo = document.getElementById('titulo-projeto');
  const cardPeso = document.getElementById('card-peso-inicial');
  const cardMeta = document.getElementById('card-meta');
  const textoMotivo = document.getElementById('texto-motivo');

  if (titulo) titulo.textContent = `Projeto ${perfil.meta} kg`;
  if (cardPeso) cardPeso.textContent = `${perfil.pesoInicial} kg • ${perfil.altura} m`;
  if (cardMeta) cardMeta.textContent = `${perfil.meta} kg`;
  if (textoMotivo) textoMotivo.textContent = `Motivo: ${perfil.motivo}`;
}

// ------------------------------------------------------------
// Abrir painel
// ------------------------------------------------------------
document.getElementById('btn-personalizar').addEventListener('click', () => {
  const perfil = carregarPerfil();

  inputNome.value = perfil.nome;
  inputPesoInicial.value = perfil.pesoInicial;
  inputMeta.value = perfil.meta;
  inputAltura.value = perfil.altura;
  inputPessoa.value = perfil.pessoa;
  inputMotivo.value = perfil.motivo;

  painel.classList.add('ativo');
});

// ------------------------------------------------------------
// Fechar painel (cancelar)
// ------------------------------------------------------------
document.getElementById('btn-personalizar-cancelar').addEventListener('click', () => {
  painel.classList.remove('ativo');
});

// Fechar clicando fora
painel.addEventListener('click', (e) => {
  if (e.target === painel) painel.classList.remove('ativo');
});

// ------------------------------------------------------------
// Salvar perfil
// ------------------------------------------------------------
document.getElementById('btn-personalizar-salvar').addEventListener('click', () => {
  const perfil = {
    nome: inputNome.value.trim() || perfilPadrao.nome,
    pesoInicial: inputPesoInicial.value.trim() || perfilPadrao.pesoInicial,
    meta: inputMeta.value.trim() || perfilPadrao.meta,
    altura: inputAltura.value.trim() || perfilPadrao.altura,
    pessoa: inputPessoa.value.trim() || perfilPadrao.pessoa,
    motivo: inputMotivo.value.trim() || perfilPadrao.motivo
  };

  localStorage.setItem(CHAVE_PERFIL, JSON.stringify(perfil));
  aplicarPerfil(perfil);
  painel.classList.remove('ativo');
});

// ------------------------------------------------------------
// Aplicar ao carregar a página
// ------------------------------------------------------------
aplicarPerfil(carregarPerfil());

console.log('✅ Bloco 3 carregado: painel de personalização ativo');
/* ============================================================
   Bloco 4: gerador de PNG do resumo mensal
   ============================================================ */

// Mapeamento dos meses por número
const NOMES_MESES = {
  1: 'Mês 1',
  2: 'Mês 2',
  3: 'Mês 3'
};

// ------------------------------------------------------------
// Coletar dados do mês escolhido
// ------------------------------------------------------------
function coletarDadosMes(numeroMes) {
  const pegar = (campo) => {
    const el = document.querySelector(`[data-campo="${campo}"]`);
    return el ? el.value.trim() : '';
  };

  return {
    peso: pegar(`mes${numeroMes}-peso`),
    cintura: pegar(`mes${numeroMes}-cintura`),
    energia: pegar(`mes${numeroMes}-energia`)
  };
}

// ------------------------------------------------------------
// Montar o cartão com os dados
// ------------------------------------------------------------
function montarCartao(numeroMes) {
  const perfil = carregarPerfil();
  const dados = coletarDadosMes(numeroMes);

  // Se o mês estiver vazio, avisa e para
  if (!dados.peso && !dados.cintura && !dados.energia) {
    alert(`⚠️ O ${NOMES_MESES[numeroMes]} está vazio. Preencha peso, cintura ou energia antes de gerar.`);
    return false;
  }

  // Data atual (mês e ano por extenso)
  const agora = new Date();
  const meses = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
                 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
  const dataTexto = `${meses[agora.getMonth()]} ${agora.getFullYear()}`;

  // Preencher elementos do cartão
  document.getElementById('cartao-projeto').textContent = `Projeto ${perfil.meta} kg`;
  document.getElementById('cartao-pessoa').textContent = perfil.nome;
  document.getElementById('cartao-data').textContent = `${NOMES_MESES[numeroMes]} • ${dataTexto}`;

  document.getElementById('cartao-peso-inicial').textContent = `${perfil.pesoInicial} kg`;
  document.getElementById('cartao-peso-atual').textContent = dados.peso ? `${dados.peso} kg` : '—';
  document.getElementById('cartao-cintura').textContent = dados.cintura ? `${dados.cintura} cm` : '—';
  document.getElementById('cartao-energia').textContent = dados.energia ? `${dados.energia}/10` : '—';
  document.getElementById('cartao-meta').textContent = `${perfil.meta} kg`;

  // Calcular progresso e faltam
  let progresso = '—';
  let faltam = '—';

  if (dados.peso) {
    const pesoInicial = parseFloat(perfil.pesoInicial.replace(',', '.'));
    const pesoAtual = parseFloat(dados.peso.replace(',', '.'));
    const meta = parseFloat(perfil.meta.replace(',', '.'));

    if (!isNaN(pesoInicial) && !isNaN(pesoAtual)) {
      const dif = pesoInicial - pesoAtual;
      progresso = dif > 0 ? `-${dif.toFixed(1)} kg` : dif < 0 ? `+${Math.abs(dif).toFixed(1)} kg` : '0 kg';
    }

    if (!isNaN(meta) && !isNaN(pesoAtual)) {
      const restam = pesoAtual - meta;
      faltam = restam > 0 ? `${restam.toFixed(1)} kg` : 'Meta atingida! 🎉';
    }
  }

  document.getElementById('cartao-progresso').textContent = progresso;
  document.getElementById('cartao-faltam').textContent = faltam;
  document.getElementById('cartao-motivo').textContent = perfil.motivo;

  return true;
}

// ------------------------------------------------------------
// Gerar PNG do cartão
// ------------------------------------------------------------
async function gerarPNG(numeroMes) {
  const cartao = document.getElementById('cartao-mes');

  if (!montarCartao(numeroMes)) return;

  try {
    const canvas = await html2canvas(cartao, {
      backgroundColor: null,
      scale: 2,
      useCORS: true
    });

    // Converte para PNG e baixa
    const link = document.createElement('a');
    const perfil = carregarPerfil();
    const nomeArquivo = `${perfil.nome.toLowerCase().replace(/\s+/g, '-')}-${NOMES_MESES[numeroMes].toLowerCase().replace(' ', '-')}.png`;

    link.download = nomeArquivo;
    link.href = canvas.toDataURL('image/png');
    link.click();
  } catch (erro) {
    console.error('Erro ao gerar PNG:', erro);
    alert('❌ Não foi possível gerar o PNG. Veja o console para detalhes.');
  }
}

// ------------------------------------------------------------
// Botão "Gerar resumo do mês"
// ------------------------------------------------------------
document.getElementById('btn-gerar-mes').addEventListener('click', () => {
  const escolha = prompt('Qual mês você quer gerar?\n\nDigite 1, 2 ou 3:');

  if (!escolha) return;

  const numero = parseInt(escolha);
  if (![1, 2, 3].includes(numero)) {
    alert('⚠️ Escolha inválida. Digite 1, 2 ou 3.');
    return;
  }

  gerarPNG(numero);
});

console.log('✅ Bloco 4 carregado: gerador de PNG mensal ativo');