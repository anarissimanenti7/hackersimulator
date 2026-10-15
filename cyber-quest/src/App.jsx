
import { useEffect, useState } from "react";
import fases from "./fases";
import "./App.css";

const TEMPO_INICIAL = 120;

function App() {
  const [tela, setTela] = useState("inicio");
  const [faseAtual, setFaseAtual] = useState(0);
  const [resposta, setResposta] = useState("");
  const [tempo, setTempo] = useState(TEMPO_INICIAL);
  const [dicaVisivel, setDicaVisivel] = useState(false);
  const [mensagem, setMensagem] = useState("");
  const [erros, setErros] = useState(0);

  const fase = fases[faseAtual];

  useEffect(() => {
    if (tela !== "jogando") return;

    const intervalo = setInterval(() => {
      setTempo((anterior) => {
        if (anterior <= 1) {
          clearInterval(intervalo);
          setTela("derrota");
          return 0;
        }

        return anterior - 1;
      });
    }, 1000);

    return () => clearInterval(intervalo);
  }, [tela, faseAtual]);

  function iniciarJogo() {
    setFaseAtual(0);
    setResposta("");
    setTempo(fases[0].tempo || TEMPO_INICIAL);
    setDicaVisivel(false);
    setMensagem("");
    setErros(0);
    setTela("jogando");
  }

  function verificarResposta(evento) {
    evento.preventDefault();

    if (!resposta.trim()) {
      setMensagem("Digite uma resposta antes de continuar.");
      return;
    }

    if (resposta.trim().toLowerCase() === fase.resposta.toLowerCase()) {
      setMensagem("Acesso autorizado! Desafio concluído.");
      setTela("concluida");
    } else {
      setErros((anterior) => anterior + 1);
      setMensagem("Resposta incorreta. Analise as pistas e tente novamente.");
      setResposta("");
    }
  }

  function proximaFase() {
    const proxima = faseAtual + 1;

    if (proxima >= fases.length) {
      setTela("vitoria");
      return;
    }

    setFaseAtual(proxima);
    setResposta("");
    setTempo(fases[proxima].tempo || TEMPO_INICIAL);
    setDicaVisivel(false);
    setMensagem("");
    setTela("jogando");
  }

  function voltarInicio() {
    setTela("inicio");
    setFaseAtual(0);
    setResposta("");
    setTempo(TEMPO_INICIAL);
    setDicaVisivel(false);
    setMensagem("");
    setErros(0);
  }

  function formatarTempo(segundos) {
    const minutos = Math.floor(segundos / 60);
    const resto = segundos % 60;

    return `${String(minutos).padStart(2, "0")}:${String(resto).padStart(2, "0")}`;
  }

  return (
    <main className="app">
      <header className="topo">
        <div className="marca">
          <span className="simbolo">&gt;_</span>
          <span>CYBER QUEST</span>
        </div>
        <span className="status">
          <span className="ponto" />
          SISTEMA ONLINE
        </span>
      </header>

      {tela === "inicio" && (
        <section className="painel inicio">
          <p className="etiqueta">[ SIMULADOR DE DESAFIOS ]</p>
          <h1>
            CYBER <span>QUEST</span>
          </h1>
          <p className="subtitulo">HACKER SIMULATOR</p>

          <div className="terminal">
            <p>&gt; Inicializando ambiente de treinamento...</p>
            <p>&gt; Preparando desafios de lógica...</p>
            <p>&gt; Aguardando novo participante.</p>
            <p className="terminal-verde">
              &gt; Seu raciocínio é sua maior ferramenta.
            </p>
          </div>

          <button className="botao principal" onClick={iniciarJogo}>
            &gt; INICIAR JOGO
          </button>

          <p className="rodape-texto">
            PENSE · ANALISE · RESOLVA · AVANCE
          </p>
        </section>
      )}

      {tela === "jogando" && (
        <section className="painel jogo">
          <div className="linha-info">
            <span>
              FASE {faseAtual + 1} / {fases.length}
            </span>
            <span className={tempo <= 20 ? "tempo urgente" : "tempo"}>
              TEMPO: {formatarTempo(tempo)}
            </span>
          </div>

          <div className="barra-progresso">
            <div
              style={{
                width: `${((faseAtual + 1) / fases.length) * 100}%`,
              }}
            />
          </div>

          <p className="etiqueta">[ NOVA MISSÃO DETECTADA ]</p>
          <h2>{fase.titulo}</h2>
          <p className="descricao">{fase.descricao}</p>

          <div className="terminal desafio-terminal">
            <p>&gt; Terminal de treinamento iniciado.</p>
            <p>&gt; Resolva o desafio para continuar.</p>
            <p className="terminal-verde">&gt; Aguardando entrada...</p>
          </div>

          <form onSubmit={verificarResposta}>
            <label htmlFor="resposta">INSIRA SUA RESPOSTA</label>
            <input
              id="resposta"
              type="text"
              value={resposta}
              onChange={(evento) => setResposta(evento.target.value)}
              placeholder="Digite sua resposta..."
              autoComplete="off"
            />

            <button className="botao principal" type="submit">
              CONFIRMAR RESPOSTA
            </button>
          </form>

          <button
            className="botao secundario"
            onClick={() => setDicaVisivel((anterior) => !anterior)}
          >
            {dicaVisivel ? "OCULTAR DICA" : "SOLICITAR DICA"}
          </button>

          {dicaVisivel && (
            <div className="caixa-dica">
              <strong>&gt; PISTA DO SISTEMA</strong>
              <p>{fase.dica}</p>
            </div>
          )}

          {mensagem && (
            <p className="mensagem" aria-live="polite">
              {mensagem}
            </p>
          )}

          <p className="contador-erros">Tentativas incorretas: {erros}</p>
        </section>
      )}

      {tela === "concluida" && (
        <section className="painel resultado">
          <p className="etiqueta">[ MISSÃO CONCLUÍDA ]</p>
          <div className="icone-resultado">✓</div>
          <h2>ACESSO AUTORIZADO</h2>
          <p>Você resolveu o desafio desta fase.</p>
          <button className="botao principal" onClick={proximaFase}>
            {faseAtual + 1 >= fases.length
              ? "FINALIZAR JOGO"
              : "PRÓXIMA FASE"}
          </button>
        </section>
      )}

      {tela === "vitoria" && (
        <section className="painel resultado">
          <p className="etiqueta">[ TODAS AS MISSÕES CONCLUÍDAS ]</p>
          <div className="icone-resultado">★</div>
          <h2>VOCÊ CONSEGUIU!</h2>
          <p>
            Você completou todas as fases do Cyber Quest e demonstrou seu
            raciocínio lógico.
          </p>
          <button className="botao principal" onClick={voltarInicio}>
            VOLTAR AO INÍCIO
          </button>
        </section>
      )}

      {tela === "derrota" && (
        <section className="painel resultado">
          <p className="etiqueta">[ CONEXÃO ENCERRADA ]</p>
          <div className="icone-derrota">×</div>
          <h2>TEMPO ESGOTADO</h2>
          <p>
            O tempo desta missão terminou. Volte ao início e tente novamente.
          </p>
          <button className="botao principal" onClick={voltarInicio}>
            VOLTAR AO INÍCIO
          </button>
        </section>
      )}

      <footer className="rodape">
        CYBER QUEST <span> // </span> AMBIENTE FICTÍCIO DE TREINAMENTO
      </footer>
    </main>
  );
}

export default App;
