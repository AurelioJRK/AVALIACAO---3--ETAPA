
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Exercicio } from '../types/Exercicios';

type Props = {
  exercicio: Exercicio;
  onAlterarPeso: (id: string, peso: number) => void;
  onAlterarRepeticoes: (id: string, repeticoes: number) => void;
  onConcluirSerie: (id: string, serie: number) => void;
};

export default function TreinoCard({
  exercicio,
  onAlterarPeso,
  onAlterarRepeticoes,
  onConcluirSerie,
}: Props) {
  const seriesConcluidas = exercicio.seriesConcluidas ?? [];
  const peso = exercicio.pesoKg ?? 0;

  return (
    <View style={styles.card}>
      <Text style={styles.nome}>{exercicio.nome}</Text>

      <View style={styles.configuracoes}>
        <View style={styles.configItem}>
          <Text style={styles.rotulo}>PESO (KG)</Text>

          <View style={styles.controle}>
            <TouchableOpacity
              style={styles.botaoControle}
              onPress={() => onAlterarPeso(exercicio.id, peso - 1)}
            >
              <Text style={styles.botaoTexto}>−</Text>
            </TouchableOpacity>

            <Text style={styles.valor}>{peso} kg</Text>

            <TouchableOpacity
              style={styles.botaoControle}
              onPress={() => onAlterarPeso(exercicio.id, peso + 1)}
            >
              <Text style={styles.botaoTexto}>+</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.configItem}>
          <Text style={styles.rotulo}>REPETIÇÕES</Text>

          <View style={styles.controle}>
            <TouchableOpacity
              style={styles.botaoControle}
              onPress={() =>
                onAlterarRepeticoes(
                  exercicio.id,
                  exercicio.repeticoes - 1,
                )
              }
            >
              <Text style={styles.botaoTexto}>−</Text>
            </TouchableOpacity>

            <Text style={styles.valor}>{exercicio.repeticoes}</Text>

            <TouchableOpacity
              style={styles.botaoControle}
              onPress={() =>
                onAlterarRepeticoes(
                  exercicio.id,
                  exercicio.repeticoes + 1,
                )
              }
            >
              <Text style={styles.botaoTexto}>+</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.divisor} />

      <View style={styles.cabecalhoSeries}>
        <Text style={styles.tituloSeries}>Séries</Text>

        <Text style={styles.progresso}>
          {seriesConcluidas.length}/{exercicio.series}
        </Text>
      </View>

      {Array.from({ length: exercicio.series }, (_, indice) => {
        const numeroSerie = indice + 1;
        const concluida = seriesConcluidas.includes(numeroSerie);

        return (
          <View key={numeroSerie} style={styles.linhaSerie}>
            <View>
              <Text style={styles.nomeSerie}>
                Série {numeroSerie}
              </Text>

              <Text style={styles.detalhesSerie}>
                {exercicio.repeticoes} repetições • {peso} kg
              </Text>
            </View>

            <TouchableOpacity
              style={[
                styles.botaoSerie,
                concluida && styles.botaoSerieConcluida,
              ]}
              onPress={() =>
                onConcluirSerie(exercicio.id, numeroSerie)
              }
            >
              <Text
                style={[
                  styles.textoBotaoSerie,
                  concluida && styles.textoSerieConcluida,
                ]}
              >
                {concluida ? '✓ Concluída' : 'Concluir'}
              </Text>
            </TouchableOpacity>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#191B19',
    borderRadius: 18,
    padding: 17,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#292D27',
  },
  nome: {
    color: '#FFFFFF',
    fontSize: 19,
    fontWeight: '900',
    marginBottom: 20,
  },
  configuracoes: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 10,
  },
  configItem: {
    flex: 1,
  },
  rotulo: {
    color: '#969A90',
    fontSize: 10,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  controle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#101110',
    borderRadius: 10,
    padding: 5,
  },
  botaoControle: {
    backgroundColor: '#292D27',
    width: 32,
    height: 32,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  botaoTexto: {
    color: '#C4FF35',
    fontSize: 20,
    fontWeight: 'bold',
  },
  valor: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
  divisor: {
    height: 1,
    backgroundColor: '#292D27',
    marginVertical: 20,
  },
  cabecalhoSeries: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  tituloSeries: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
  },
  progresso: {
    color: '#C4FF35',
    fontWeight: 'bold',
  },
  linhaSerie: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#101110',
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
  },
  nomeSerie: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: 'bold',
  },
  detalhesSerie: {
    color: '#969A90',
    fontSize: 11,
    marginTop: 5,
  },
  botaoSerie: {
    backgroundColor: '#292D27',
    paddingVertical: 10,
    paddingHorizontal: 13,
    borderRadius: 9,
  },
  botaoSerieConcluida: {
    backgroundColor: '#C4FF35',
  },
  textoBotaoSerie: {
    color: '#FFFFFF',
    fontSize: 11,
    fontWeight: 'bold',
  },
  textoSerieConcluida: {
    color: '#101110',
  },
});
