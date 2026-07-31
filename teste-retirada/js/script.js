(function () {
  'use strict';

  /* =========================================================
     DADOS DAS PERGUNTAS
     Cada pergunta pertence a um pilar do Score Financeiro.
     Cada opção carrega uma pontuação de 0 a 100.
  ========================================================= */
  var PILLARS = {
    margem: { label: 'Margem Operacional', weight: 30, color: '#0A2342' },
    autossuficiencia: { label: 'Autossuficiência Financeira', weight: 25, color: '#2CA58D' },
    reinvestimento: { label: 'Taxa de Reinvestimento', weight: 15, color: '#4F6D7A' },
    juros: { label: 'Cobertura de Juros', weight: 15, color: '#F5A623' },
    retiradas: { label: 'Peso das Retiradas', weight: 15, color: '#E63946' }
  };

  var QUESTIONS = [
    {
      pillar: 'margem',
      text: 'Quando você retira dinheiro da empresa, como decide o valor?',
      options: [
        { text: 'Sei exatamente qual é o meu caixa operacional e retiro dentro dele', score: 100 },
        { text: 'Retiro com base no que sobra na conta no fim do mês', score: 60 },
        { text: 'Retiro um valor fixo, independente do resultado do mês', score: 35 },
        { text: 'Retiro conforme a necessidade pessoal, sem olhar a empresa', score: 10 }
      ]
    },
    {
      pillar: 'margem',
      text: 'Você sabe, hoje, qual foi o caixa operacional da empresa no último mês?',
      options: [
        { text: 'Sim, com precisão — eu calculo isso', score: 100 },
        { text: 'Tenho uma ideia aproximada', score: 65 },
        { text: 'Não sei, mas o negócio "parece ir bem"', score: 30 },
        { text: 'Não sei e nunca calculei isso', score: 5 }
      ]
    },
    {
      pillar: 'autossuficiencia',
      text: 'De onde vem o dinheiro que você retira todo mês?',
      options: [
        { text: 'Só do caixa operacional gerado pela empresa', score: 100 },
        { text: 'Na maior parte do caixa, mas às vezes uso limite ou cartão', score: 60 },
        { text: 'Frequentemente uso empréstimo ou cheque especial', score: 20 },
        { text: 'Não sei diferenciar isso no dia a dia', score: 10 }
      ]
    },
    {
      pillar: 'autossuficiencia',
      text: 'Nos últimos 6 meses, quantas vezes a empresa precisou de empréstimos ou aporte feito por sócios para fechar o caixa?',
      options: [
        { text: 'Nenhuma vez', score: 100 },
        { text: '1 ou 2 vezes', score: 65 },
        { text: 'De 3 a 5 vezes', score: 30 },
        { text: 'Praticamente todo mês', score: 5 }
      ]
    },
    {
      pillar: 'reinvestimento',
      text: 'Que parte do lucro você reinveste no negócio (estoque, equipamento, marketing, etc.)?',
      options: [
        { text: 'Mais de 15% do lucro', score: 100 },
        { text: 'Entre 5% e 15%', score: 65 },
        { text: 'Reinvisto pouco, quase tudo vira retirada', score: 30 },
        { text: 'Não reinvisto nada, ou não sei dizer', score: 10 }
      ]
    },
    {
      pillar: 'juros',
      text: 'Como estão as dívidas com juros da empresa (empréstimos, financiamentos, cartão)?',
      options: [
        { text: 'Sem dívidas com juros, ou o lucro cobre os juros com folga', score: 100 },
        { text: 'Tenho dívidas, mas consigo pagar sem apertar', score: 65 },
        { text: 'As parcelas pesam bastante no caixa todo mês', score: 30 },
        { text: 'Estou tomando crédito novo para pagar dívida antiga', score: 5 }
      ]
    },
    {
      pillar: 'retiradas',
      text: 'Aproximadamente, que porcentagem do faturamento vira retirada sua (pró-labore + distribuição)?',
      options: [
        { text: 'Até 10%', score: 100 },
        { text: 'Entre 10% e 20%', score: 70 },
        { text: 'Entre 20% e 35%', score: 40 },
        { text: 'Mais de 35%', score: 10 }
      ]
    },
    {
      pillar: 'retiradas',
      text: 'Se você parasse de retirar por 1 mês, o que aconteceria com o caixa da empresa?',
      options: [
        { text: 'Nada, o caixa cresceria e ficaria tranquilo', score: 100 },
        { text: 'Ficaria mais folgado, mas nada dramático', score: 70 },
        { text: 'Notaria uma folga real — sinal de que a retirada pesa', score: 40 },
        { text: 'Seria quase impossível, dependo dessa retirada', score: 15 }
      ]
    }
  ];

  var BANDS = [
    { min: 85, key: 'campeao', icon: '🏆', label: 'Campeão', color: '#2CA58D',
      title: 'Sua gestão de retiradas está exemplar.',
      text: 'Você retira com régua, conhece sua margem e não compromete o caixa. O próximo passo é confirmar isso com dados reais e manter a régua.' },
    { min: 70, key: 'saudavel', icon: '🥈', label: 'Saudável', color: '#5ECDB5',
      title: 'Você está no caminho certo, com pontos a ajustar.',
      text: 'A base é sólida, mas existem sinais — como o uso ocasional de limite ou a falta de precisão na margem — que merecem atenção antes de virarem hábito.' },
    { min: 55, key: 'no-caminho', icon: '🥉', label: 'No Caminho', color: '#F5A623',
      title: 'Existem sinais de risco na forma como você retira.',
      text: 'Parte das suas respostas indica decisões tomadas no feeling, sem referência clara de margem ou de caixa. Vale a pena confirmar com o extrato antes que o problema cresça.' },
    { min: 40, key: 'atencao', icon: '⚠️', label: 'Atenção', color: '#E63946',
      title: 'Seu comportamento de retirada está pressionando o caixa.',
      text: 'Vários indícios — dependência de crédito, retirada alta em relação ao faturamento, pouco reinvestimento — sugerem que a empresa pode estar sustentando uma retirada maior do que aguenta.' },
    { min: 0, key: 'critico', icon: '🚨', label: 'Crítico', color: '#E63946',
      title: 'A forma como você retira hoje é um risco real para o negócio.',
      text: 'As respostas indicam forte dependência de crédito, ausência de referência de margem e retiradas que pesam demais no caixa. Recomendamos o diagnóstico completo com urgência.' }
  ];

  /* =========================================================
     ESTADO
  ========================================================= */
  var current = 0;
  var answers = new Array(QUESTIONS.length).fill(null);

  var mount = document.getElementById('questionMount');
  var progressFill = document.getElementById('quizProgressFill');
  var progressLabel = document.getElementById('quizProgressLabel');
  var progressTrack = document.querySelector('.quiz-progress-track');
  var btnBack = document.getElementById('btnVoltar');
  var btnNext = document.getElementById('btnAvancar');

  function renderQuestions() {
    QUESTIONS.forEach(function (q, qi) {
      var block = document.createElement('div');
      block.className = 'question-block' + (qi === 0 ? ' active' : '');
      block.dataset.index = qi;

      var h3 = document.createElement('h3');
      h3.textContent = q.text;
      block.appendChild(h3);

      var list = document.createElement('div');
      list.className = 'option-list';

      q.options.forEach(function (opt, oi) {
        var label = document.createElement('label');
        label.className = 'option-item';

        var input = document.createElement('input');
        input.type = 'radio';
        input.name = 'q' + qi;
        input.value = oi;

        var span = document.createElement('span');
        span.textContent = opt.text;

        label.appendChild(input);
        label.appendChild(span);
        list.appendChild(label);

        input.addEventListener('change', function () {
          answers[qi] = opt.score;
          Array.prototype.forEach.call(list.querySelectorAll('.option-item'), function (el) {
            el.classList.remove('selected');
          });
          label.classList.add('selected');
          btnNext.disabled = false;
        });
      });

      block.appendChild(list);
      mount.appendChild(block);
    });
  }

  function updateProgress() {
    var pct = Math.round(((current) / QUESTIONS.length) * 100);
    progressFill.style.width = pct + '%';
    progressTrack.setAttribute('aria-valuenow', pct);
    progressLabel.textContent = 'Pergunta ' + (current + 1) + ' de ' + QUESTIONS.length;
  }

  function showQuestion(index) {
    Array.prototype.forEach.call(mount.querySelectorAll('.question-block'), function (el) {
      el.classList.toggle('active', Number(el.dataset.index) === index);
    });
    btnBack.disabled = index === 0;
    btnNext.disabled = answers[index] === null;
    btnNext.textContent = index === QUESTIONS.length - 1 ? 'Ver resultado' : 'Próxima';
    updateProgress();
  }

  btnBack.addEventListener('click', function () {
    if (current === 0) return;
    current -= 1;
    showQuestion(current);
  });

  btnNext.addEventListener('click', function () {
    if (answers[current] === null) return;
    if (current === QUESTIONS.length - 1) {
      finishQuiz();
      return;
    }
    current += 1;
    showQuestion(current);
  });

  /* =========================================================
     CÁLCULO DO SCORE
  ========================================================= */
  function computeScore() {
    var pillarSums = {}, pillarCounts = {};
    Object.keys(PILLARS).forEach(function (k) { pillarSums[k] = 0; pillarCounts[k] = 0; });

    QUESTIONS.forEach(function (q, qi) {
      pillarSums[q.pillar] += answers[qi];
      pillarCounts[q.pillar] += 1;
    });

    var pillarScores = {};
    Object.keys(PILLARS).forEach(function (k) {
      pillarScores[k] = pillarCounts[k] ? pillarSums[k] / pillarCounts[k] : 0;
    });

    var total = 0;
    Object.keys(PILLARS).forEach(function (k) {
      total += pillarScores[k] * (PILLARS[k].weight / 100);
    });

    return { total: Math.round(total), pillars: pillarScores };
  }

  function bandFor(score) {
    for (var i = 0; i < BANDS.length; i++) {
      if (score >= BANDS[i].min) return BANDS[i];
    }
    return BANDS[BANDS.length - 1];
  }

  /* =========================================================
     FINALIZAÇÃO / RESULTADO
  ========================================================= */
  var GAUGE_MAX_LENGTH = 283; // comprimento aproximado do arco semicircular

  function finishQuiz() {
    document.getElementById('avaliacao').hidden = true;

    var processando = document.getElementById('processando');
    processando.hidden = false;
    processando.scrollIntoView({ behavior: 'smooth', block: 'start' });

    setTimeout(function () {
      var result = computeScore();
      var band = bandFor(result.total);
      renderResult(result, band);

      processando.hidden = true;
      var resultado = document.getElementById('resultado');
      resultado.hidden = false;
      document.getElementById('cta').hidden = false;

      resultado.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 1600);
  }

  function renderResult(result, band) {
    document.getElementById('scoreNumber').textContent = result.total;

    var scoreBand = document.getElementById('scoreBand');
    scoreBand.textContent = band.icon + ' ' + band.label;
    scoreBand.style.background = band.color + '22';
    scoreBand.style.color = band.color;

    document.getElementById('scoreTitle').textContent = band.title;
    document.getElementById('scoreText').textContent = band.text;

    var arc = document.getElementById('gaugeArc');
    var arcLength = (result.total / 100) * GAUGE_MAX_LENGTH;
    arc.style.stroke = band.color;
    requestAnimationFrame(function () {
      arc.style.strokeDasharray = arcLength + ' ' + GAUGE_MAX_LENGTH;
    });

    var pillarsMount = document.getElementById('scorePillars');
    pillarsMount.innerHTML = '';
    Object.keys(PILLARS).forEach(function (k) {
      var p = PILLARS[k];
      var value = Math.round(result.pillars[k]);

      var row = document.createElement('div');
      row.className = 'pillar-row';

      var top = document.createElement('div');
      top.className = 'pillar-row-top';
      top.innerHTML = '<span class="pillar-name">' + p.label + '</span>' +
                       '<span class="pillar-weight">peso ' + p.weight + '% · ' + value + '/100</span>';

      var track = document.createElement('div');
      track.className = 'pillar-track';
      var fill = document.createElement('div');
      fill.className = 'pillar-fill';
      fill.style.background = p.color;
      track.appendChild(fill);

      row.appendChild(top);
      row.appendChild(track);
      pillarsMount.appendChild(row);

      requestAnimationFrame(function () {
        fill.style.width = value + '%';
      });
    });
  }

  /* =========================================================
     CARDS DE IDENTIFICAÇÃO -> pulam para o quiz
  ========================================================= */
  Array.prototype.forEach.call(document.querySelectorAll('[data-jump]'), function (el) {
    el.addEventListener('click', function () {
      var target = document.getElementById(el.dataset.jump);
      if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    });
  });

  /* =========================================================
     INIT
  ========================================================= */
  renderQuestions();
  showQuestion(0);
})();
