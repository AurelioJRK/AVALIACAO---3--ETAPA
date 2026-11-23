
import { useEffect, useState } from 'react';

import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Alert,
} from 'react-native';

import { Exercicio } from './types/Exercicios';

import ExercicioCard from './components/ExercicioCard';
import FormularioExercicio from './components/FormularioExercicio';
import TreinoCard from './components/TreinoCard';

import {
  carregarExercicios,
  salvarExercicios,
} from './services/armazenamento';

import {
  solicitarPermissao,
  programarLembrete,
  cancelarLembretes,
  verificarLembrete,
} from './services/notificacoes';

type Aba = 'inicio' | 'treino';

export default function App() {
  const [exercicios, setExercicios] = useState<Exercicio[]>([
    {
      id: '1',
      nome: 'Agachamento',
      series: 4,
      repeticoes: 12,
      concluido: false,
      pesoKg: 0,
      seriesConcluidas: [],
    },
    {
      id: '2',
      nome: 'Supino',
      series: 3,
      repeticoes: 10,
      concluido: false,
      pesoKg: 0,
      seriesConcluidas: [],
    },
    {
      id: '3',
      nome: 'Puxada frontal',
      series: 3,
      repeticoes: 12,
      concluido: false,
      pesoKg: 0,
      seriesConcluidas: [],
    },
  ]);

  const [mostrarFormulario, setMostrarFormulario] = useState(false);
  const [editando, setEditando] = useState<Exercicio | null>(null);

  const [abaAtual, setAbaAtual] = useState<Aba>('inicio');

  const [estadoDados, setEstadoDados] = useState<
    'carregando' | 'pronto' | 'erro'
  >('carregando');

  const [horarioLembrete, setHorarioLembrete] = useState('18:00');
  const [lembreteAtivo, setLembreteAtivo] = useState(false);
  const [carregandoLembrete, setCarregandoLembrete] = useState(false);

  // Carregar dados do JSON
  useEffect(() => {
    async function carregarDados() {
      try {
        const dados = await carregarExercicios();

        if (dados !== null) {
          const dadosAtualizados = dados.map((exercicio) => {
            const seriesConcluidas =
              exercicio.seriesConcluidas ??
              (exercicio.concluido
                ? Array.from(
                    { length: exercicio.series },
                    (_, i) => i + 1,
                  )
                : []);

            return {
              ...exercicio,
              pesoKg: exercicio.pesoKg ?? 0,
              seriesConcluidas,
              concluido:
                seriesConcluidas.length >= exercicio.series,
            };
          });

          setExercicios(dadosAtualizados);
        }

        setEstadoDados('pronto');
      } catch (erro) {
        console.error('Erro ao carregar exercícios:', erro);
        setEstadoDados('erro');

        Alert.alert(
          'Erro',
          'Não foi possível carregar os exercícios salvos.',
        );
      }
    }

    carregarDados();
  }, []);

  // Salvar dados no JSON
  useEffect(() => {
    if (estadoDados !== 'pronto') {
      return;
    }

    async function salvarDados() {
      try {
        await salvarExercicios(exercicios);
      } catch (erro) {
        console.error('Erro ao salvar exercícios:', erro);

        Alert.alert(
          'Erro',
          'Não foi possível salvar os exercícios.',
        );
      }
    }

    salvarDados();
  }, [exercicios, estadoDados]);

  // Verificar lembrete existente
  useEffect(() => {
    async function verificar() {
      try {
        const existe = await verificarLembrete();
        setLembreteAtivo(existe);
      } catch (erro) {
        console.error('Erro ao verificar lembrete:', erro);
      }
    }

    verificar();
  }, []);

  const concluidos = exercicios.filter(
    (exercicio) => exercicio.concluido,
  ).length;

  const totalSeries = exercicios.reduce(
    (total, exercicio) => total + exercicio.series,
    0,
  );

  const seriesRealizadas = exercicios.reduce(
    (total, exercicio) =>
      total + (exercicio.seriesConcluidas?.length ?? 0),
    0,
  );

  const progressoTreino =
    totalSeries > 0
      ? Math.round((seriesRealizadas / totalSeries) * 100)
      : 0;

  // Adicionar ou editar exercício
  function salvarExercicio(
    nome: string,
    series: number,
    repeticoes: number,
  ) {
    if (editando) {
      setExercicios((lista) =>
        lista.map((exercicio) =>
          exercicio.id === editando.id
            ? {
                ...exercicio,
                nome,
                series,
                repeticoes,
                seriesConcluidas: (exercicio.seriesConcluidas ?? [])
                  .filter((numero) => numero <= series),
                concluido:
                  (exercicio.seriesConcluidas ?? []).filter(
                    (numero) => numero <= series,
                  ).length >= series,
              }
            : exercicio,
        ),
      );
    } else {
      const novoExercicio: Exercicio = {
        id: `${Date.now()}-${Math.random()}`,
        nome,
        series,
        repeticoes,
        concluido: false,
        pesoKg: 0,
        seriesConcluidas: [],
      };

      setExercicios((lista) => [...lista, novoExercicio]);
    }

    setMostrarFormulario(false);
    setEditando(null);
  }

  // Marcar ou desmarcar todas as séries
  function concluirExercicio(id: string) {
    setExercicios((lista) =>
      lista.map((exercicio) => {
        if (exercicio.id !== id) return exercicio;

        const jaConcluido = exercicio.concluido;

        const novasSeries = jaConcluido
          ? []
          : Array.from(
              { length: exercicio.series },
              (_, i) => i + 1,
            );

        return {
          ...exercicio,
          seriesConcluidas: novasSeries,
          concluido: !jaConcluido,
        };
      }),
    );
  }

  // Alterar peso
  function alterarPeso(id: string, peso: number) {
    setExercicios((lista) =>
      lista.map((exercicio) =>
        exercicio.id === id
          ? {
              ...exercicio,
              pesoKg: Math.max(0, Number(peso.toFixed(1))),
            }
          : exercicio,
      ),
    );
  }

  // Alterar repetições
  function alterarRepeticoes(id: string, repeticoes: number) {
    setExercicios((lista) =>
      lista.map((exercicio) =>
        exercicio.id === id
          ? {
              ...exercicio,
              repeticoes: Math.max(1, repeticoes),
            }
          : exercicio,
      ),
    );
  }

  // Concluir uma série individual
  function concluirSerie(id: string, serie: number) {
    setExercicios((lista) =>
      lista.map((exercicio) => {
        if (exercicio.id !== id) return exercicio;

        const atuais = exercicio.seriesConcluidas ?? [];

        const novasSeries = atuais.includes(serie)
          ? atuais.filter((numero) => numero !== serie)
          : [...atuais, serie];

        return {
          ...exercicio,
          seriesConcluidas: novasSeries,
          concluido: novasSeries.length >= exercicio.series,
        };
      }),
    );
  }

  function editarExercicio(exercicio: Exercicio) {
    setEditando(exercicio);
    setMostrarFormulario(true);
  }

  function excluirExercicio(id: string) {
    Alert.alert(
      'Excluir exercício',
      'Tem certeza que deseja excluir este exercício?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: () => {
            setExercicios((lista) =>
              lista.filter((exercicio) => exercicio.id !== id),
            );
          },
        },
      ],
    );
  }

  function abrirFormulario() {
    setEditando(null);
    setMostrarFormulario(true);
  }

  // Ativar lembrete
  async function ativarLembrete() {
    const formatoValido = /^([01]\d|2[0-3]):([0-5]\d)$/.test(
      horarioLembrete,
    );

    if (!formatoValido) {
      Alert.alert(
        'Horário inválido',
        'Informe um horário válido no formato HH:MM.',
      );
      return;
    }

    try {
      setCarregandoLembrete(true);

      const permitido = await solicitarPermissao();

      if (!permitido) {
        Alert.alert(
          'Permissão necessária',
          'Ative as notificações do Meu Treino nas configurações do dispositivo.',
        );
        return;
      }

      const [hora, minuto] = horarioLembrete.split(':').map(Number);

      await programarLembrete(hora, minuto);

      setLembreteAtivo(true);

      Alert.alert(
        'Lembrete programado!',
        `Você receberá uma notificação todos os dias às ${horarioLembrete}.`,
      );
    } catch (erro) {
      console.error('Erro ao programar lembrete:', erro);
      Alert.alert('Erro', 'Não foi possível programar o lembrete.');
    } finally {
      setCarregandoLembrete(false);
    }
  }

  // Desativar lembrete
  async function desativarLembrete() {
    try {
      await cancelarLembretes();
      setLembreteAtivo(false);

      Alert.alert(
        'Lembrete cancelado',
        'O lembrete diário foi desativado.',
      );
    } catch (erro) {
      console.error('Erro ao cancelar lembrete:', erro);
      Alert.alert('Erro', 'Não foi possível cancelar o lembrete.');
    }
  }

  // Carregamento
  if (estadoDados === 'carregando') {
    return (
      <SafeAreaView style={styles.tela}>
        <StatusBar barStyle="light-content" backgroundColor="#101110" />
        <Text style={styles.mensagem}>Carregando exercícios...</Text>
      </SafeAreaView>
    );
  }

  // Erro
  if (estadoDados === 'erro') {
    return (
      <SafeAreaView style={styles.tela}>
        <StatusBar barStyle="light-content" backgroundColor="#101110" />
        <Text style={styles.mensagem}>
          Não foi possível carregar os exercícios.
        </Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.tela}>
      <StatusBar barStyle="light-content" backgroundColor="#101110" />

      {abaAtual === 'inicio' ? (
        <FlatList
          data={exercicios}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.conteudo}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <View>
              <View style={styles.cabecalho}>
                <Text style={styles.marca}>MEU TREINO</Text>
              </View>

              <Text style={styles.boasVindas}>BORA TREINAR?</Text>

              <View style={styles.destaque}>
                <Text style={styles.destaqueLegenda}>
                  TREINO DE HOJE
                </Text>

                <Text style={styles.destaqueDescricao}>
                  Organize seus exercícios e acompanhe seu desempenho.
                </Text>

                <View style={styles.progressoCabecalho}>
                  <Text style={styles.progressoTexto}>
                    Progresso do treino
                  </Text>

                  <Text style={styles.progressoNumero}>
                    {progressoTreino}%
                  </Text>
                </View>

                <View style={styles.barraFundo}>
                  <View
                    style={[
                      styles.barraProgresso,
                      { width: `${progressoTreino}%` },
                    ]}
                  />
                </View>
              </View>

              <View style={styles.resumo}>
                <View style={styles.resumoCard}>
                  <Text style={styles.resumoNumero}>
                    {exercicios.length}
                  </Text>
                  <Text style={styles.resumoLegenda}>Exercícios</Text>
                </View>

                <View style={styles.resumoCard}>
                  <Text style={styles.resumoNumero}>
                    {concluidos}
                  </Text>
                  <Text style={styles.resumoLegenda}>Concluídos</Text>
                </View>

                <View style={styles.resumoCard}>
                  <Text style={styles.resumoNumero}>
                    {exercicios.length - concluidos}
                  </Text>
                  <Text style={styles.resumoLegenda}>Pendentes</Text>
                </View>
              </View>

              <View style={styles.tituloLista}>
                <Text style={styles.tituloSecao}>
                  Seus exercícios
                </Text>

                <TouchableOpacity
                  style={styles.botaoAdicionar}
                  onPress={abrirFormulario}
                >
                  <Text style={styles.textoAdicionar}>
                    Adicionar
                  </Text>
                </TouchableOpacity>
              </View>

              {mostrarFormulario && (
                <FormularioExercicio
                  inicial={editando}
                  onSalvar={salvarExercicio}
                  onCancelar={() => {
                    setMostrarFormulario(false);
                    setEditando(null);
                  }}
                />
              )}
            </View>
          }
          renderItem={({ item }) => (
            <ExercicioCard
              exercicio={item}
              onConcluir={concluirExercicio}
              onEditar={editarExercicio}
              onExcluir={excluirExercicio}
            />
          )}
          ListEmptyComponent={
            <View style={styles.vazio}>
              <Text style={styles.vazioTitulo}>
                Nenhum exercício ainda
              </Text>
              <Text style={styles.vazioTexto}>
                Toque em Adicionar para cadastrar um exercício.
              </Text>
            </View>
          }
        />
      ) : (
        <FlatList
          data={exercicios}
          keyExtractor={(item) => item.id}
          contentContainerStyle={styles.conteudo}
          showsVerticalScrollIndicator={false}
          ListHeaderComponent={
            <View>
              <Text style={styles.marca}>MEU TREINO</Text>

              <Text style={styles.tituloTreino}>SEU TREINO</Text>

              <Text style={styles.subtituloTreino}>
                Acompanhe suas séries e seu desempenho.
              </Text>

              <View style={styles.resumoTreino}>
                <View>
                  <Text style={styles.resumoTreinoNumero}>
                    {seriesRealizadas}/{totalSeries}
                  </Text>
                  <Text style={styles.resumoTreinoLegenda}>
                    Séries concluídas
                  </Text>
                </View>

                <Text style={styles.resumoTreinoNumero}>
                  {progressoTreino}%
                </Text>
              </View>

              <View style={styles.barraFundo}>
                <View
                  style={[
                    styles.barraProgresso,
                    { width: `${progressoTreino}%` },
                  ]}
                />
              </View>

              {/* Lembrete diário */}
              <View style={styles.lembreteCard}>
                <Text style={styles.lembreteTitulo}>
                  LEMBRETE DE TREINO
                </Text>

                <Text style={styles.lembreteDescricao}>
                  Escolha um horário para receber uma notificação diária.
                </Text>

                <Text style={styles.lembreteLabel}>Horário</Text>

                <TextInput
                  style={styles.inputHorario}
                  value={horarioLembrete}
                  onChangeText={setHorarioLembrete}
                  placeholder="18:00"
                  placeholderTextColor="#777777"
                  keyboardType="numbers-and-punctuation"
                  maxLength={5}
                  editable={!lembreteAtivo}
                />

                {lembreteAtivo ? (
                  <>
                    <Text style={styles.lembreteStatus}>
                      Lembrete diário ativado
                    </Text>

                    <TouchableOpacity
                      style={styles.botaoCancelarLembrete}
                      onPress={desativarLembrete}
                    >
                      <Text style={styles.textoBotaoCancelar}>
                        Cancelar lembrete
                      </Text>
                    </TouchableOpacity>
                  </>
                ) : (
                  <TouchableOpacity
                    style={styles.botaoLembrete}
                    onPress={ativarLembrete}
                    disabled={carregandoLembrete}
                  >
                    <Text style={styles.textoBotaoLembrete}>
                      {carregandoLembrete
                        ? 'Programando...'
                        : 'Ativar lembrete'}
                    </Text>
                  </TouchableOpacity>
                )}
              </View>

              <Text style={styles.tituloSecaoTreino}>
                Exercícios do treino
              </Text>
            </View>
          }
          renderItem={({ item }) => (
            <TreinoCard
              exercicio={item}
              onAlterarPeso={alterarPeso}
              onAlterarRepeticoes={alterarRepeticoes}
              onConcluirSerie={concluirSerie}
            />
          )}
          ListEmptyComponent={
            <View style={styles.vazio}>
              <Text style={styles.vazioTitulo}>
                Nenhum exercício cadastrado
              </Text>
              <Text style={styles.vazioTexto}>
                Adicione exercícios na aba Início.
              </Text>
            </View>
          }
          ListFooterComponent={
            totalSeries > 0 && seriesRealizadas === totalSeries ? (
              <View style={styles.treinoFinalizado}>
                <Text style={styles.textoFinalizado}>
                  TREINO CONCLUÍDO!
                </Text>
              </View>
            ) : null
          }
        />
      )}

      {/* Navegação inferior */}
      <View style={styles.navegacao}>
        <TouchableOpacity
          style={styles.itemNavegacao}
          onPress={() => setAbaAtual('inicio')}
        >
          <Text
            style={[
              styles.iconeNavegacao,
              abaAtual === 'inicio' && styles.navegacaoAtiva,
            ]}
          >
            ⌂
          </Text>

          <Text
            style={[
              styles.textoNavegacao,
              abaAtual === 'inicio' && styles.navegacaoAtiva,
            ]}
          >
            Início
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.itemNavegacao}
          onPress={() => setAbaAtual('treino')}
        >
          <Text
            style={[
              styles.iconeNavegacao,
              abaAtual === 'treino' && styles.navegacaoAtiva,
            ]}
          >
            ▣
          </Text>

          <Text
            style={[
              styles.textoNavegacao,
              abaAtual === 'treino' && styles.navegacaoAtiva,
            ]}
          >
            Treino
          </Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  tela: {
    flex: 1,
    backgroundColor: '#101110',
  },
  conteudo: {
    paddingHorizontal: 20,
    paddingTop: 18,
    paddingBottom: 25,
  },
  cabecalho: {
    marginBottom: 32,
  },
  marca: {
    color: '#C4FF35',
    fontSize: 23,
    fontWeight: '900',
    letterSpacing: 1.5,
    marginBottom: 24,
  },
  boasVindas: {
    color: '#FFFFFF',
    fontSize: 29,
    fontWeight: '900',
    letterSpacing: 0.5,
    marginBottom: 20,
  },
  destaque: {
    backgroundColor: '#C4FF35',
    padding: 22,
    borderRadius: 22,
    marginBottom: 16,
  },
  destaqueLegenda: {
    color: '#303B16',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 2,
  },
  destaqueDescricao: {
    color: '#303B16',
    fontSize: 12,
    lineHeight: 18,
    marginTop: 10,
    marginBottom: 24,
  },
  progressoCabecalho: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 9,
  },
  progressoTexto: {
    color: '#303B16',
    fontSize: 11,
    fontWeight: '600',
  },
  progressoNumero: {
    color: '#101110',
    fontWeight: '900',
    fontSize: 12,
  },
  barraFundo: {
    height: 7,
    backgroundColor: '#343834',
    borderRadius: 10,
    overflow: 'hidden',
    marginBottom: 20,
  },
  barraProgresso: {
    height: '100%',
    backgroundColor: '#C4FF35',
    borderRadius: 10,
  },
  resumo: {
    flexDirection: 'row',
    gap: 10,
    marginBottom: 30,
  },
  resumoCard: {
    flex: 1,
    backgroundColor: '#191B19',
    paddingVertical: 17,
    paddingHorizontal: 5,
    borderRadius: 15,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#292D27',
  },
  resumoNumero: {
    color: '#C4FF35',
    fontSize: 23,
    fontWeight: '900',
  },
  resumoLegenda: {
    color: '#A4A79F',
    fontSize: 10,
    marginTop: 5,
  },
  tituloLista: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
  },
  tituloSecao: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '800',
  },
  botaoAdicionar: {
    backgroundColor: '#C4FF35',
    borderRadius: 10,
    paddingVertical: 11,
    paddingHorizontal: 13,
  },
  textoAdicionar: {
    color: '#101110',
    fontSize: 11,
    fontWeight: '900',
  },
  vazio: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  vazioTitulo: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 16,
  },
  vazioTexto: {
    color: '#969A90',
    marginTop: 8,
    fontSize: 12,
    textAlign: 'center',
  },
  mensagem: {
    color: '#FFFFFF',
    textAlign: 'center',
    marginTop: 30,
  },
  tituloTreino: {
    color: '#FFFFFF',
    fontSize: 29,
    fontWeight: '900',
    marginBottom: 7,
  },
  subtituloTreino: {
    color: '#969A90',
    fontSize: 13,
    marginBottom: 24,
  },
  resumoTreino: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#191B19',
    padding: 18,
    borderRadius: 15,
    marginBottom: 15,
  },
  resumoTreinoNumero: {
    color: '#C4FF35',
    fontSize: 24,
    fontWeight: '900',
  },
  resumoTreinoLegenda: {
    color: '#969A90',
    fontSize: 11,
    marginTop: 4,
  },
  tituloSecaoTreino: {
    color: '#FFFFFF',
    fontSize: 19,
    fontWeight: '800',
    marginTop: 10,
    marginBottom: 18,
  },
  treinoFinalizado: {
    backgroundColor: '#26321B',
    padding: 18,
    borderRadius: 14,
    alignItems: 'center',
    marginTop: 5,
  },
  textoFinalizado: {
    color: '#C4FF35',
    fontSize: 16,
    fontWeight: '900',
  },
  lembreteCard: {
    backgroundColor: '#191B19',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#292D27',
    padding: 18,
    marginBottom: 22,
  },
  lembreteTitulo: {
    color: '#C4FF35',
    fontSize: 14,
    fontWeight: '900',
    letterSpacing: 1,
  },
  lembreteDescricao: {
    color: '#969A90',
    fontSize: 12,
    lineHeight: 18,
    marginTop: 8,
    marginBottom: 16,
  },
  lembreteLabel: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 7,
  },
  inputHorario: {
    backgroundColor: '#101110',
    borderWidth: 1,
    borderColor: '#383D35',
    borderRadius: 10,
    color: '#FFFFFF',
    padding: 12,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 14,
  },
  botaoLembrete: {
    backgroundColor: '#C4FF35',
    padding: 13,
    borderRadius: 10,
    alignItems: 'center',
  },
  textoBotaoLembrete: {
    color: '#101110',
    fontWeight: '900',
  },
  lembreteStatus: {
    color: '#C4FF35',
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 12,
  },
  botaoCancelarLembrete: {
    backgroundColor: '#343834',
    padding: 13,
    borderRadius: 10,
    alignItems: 'center',
  },
  textoBotaoCancelar: {
    color: '#FFFFFF',
    fontWeight: '700',
  },
  navegacao: {
    flexDirection: 'row',
    backgroundColor: '#191B19',
    borderTopWidth: 1,
    borderTopColor: '#292D27',
    paddingVertical: 10,
    paddingBottom: 12,
  },
  itemNavegacao: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 3,
  },
  iconeNavegacao: {
    color: '#969A90',
    fontSize: 23,
  },
  textoNavegacao: {
    color: '#969A90',
    fontSize: 11,
    fontWeight: '600',
  },
  navegacaoAtiva: {
    color: '#C4FF35',
    fontWeight: '900',
  },
});
