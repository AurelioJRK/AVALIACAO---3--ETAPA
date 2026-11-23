import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Exercicio } from '../types/Exercicios';

type Props = {
  exercicio: Exercicio;
  onConcluir: (id: string) => void;
  onEditar: (exercicio: Exercicio) => void;
  onExcluir: (id: string) => void;
};

export default function ExercicioCard({
  exercicio,
  onConcluir,
  onEditar,
  onExcluir,
}: Props) {
  return (
    <View style={styles.card}>
      <TouchableOpacity
        style={[
        styles.check,
        exercicio.concluido && styles.checkConcluido,
        ]}
        onPress={() => onConcluir(exercicio.id)}
      >
        <Text style={styles.checkText}>
          {exercicio.concluido ? '✓' : ''}
        </Text>
      </TouchableOpacity>

      <View style={styles.info}>
        <Text
          style={[
            styles.nome,
            exercicio.concluido && styles.concluido,
          ]}
        >
          {exercicio.nome}
        </Text>
        <Text style={styles.detalhes}>
          {exercicio.series} series  •  {exercicio.repeticoes} repetiçoes
        </Text>
        <Text style={styles.status}>
          {exercicio.concluido ? 'CONCLUIDO' : 'PENDENTE'}
        </Text>
      </View>

      <View style={styles.acoes}>
        <TouchableOpacity onPress={() => onEditar(exercicio)}>
          <Text style={styles.editar}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => onExcluir(exercicio.id)}>
          <Text style={styles.excluir}>Excluir</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#191B19',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#292D27',
  },
  check: {
    width: 26,
    height: 26,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#C4FF35',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  checkText: {
    color: '#10110D',
    fontWeight: 'bold',
  },
  info: {
    flex: 1,
  },
  nome: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  concluido: {
    textDecorationLine: 'line-through',
    color: '#999999',
  },
  detalhes: {
    color: '#B6B9B2',
    fontSize: 12,
  },
  status: {
    color: '#C4FF35',
    fontSize: 10,
    fontWeight: 'bold',
    marginTop: 7,
  },
  acoes: {
    alignItems: 'flex-end',
    gap: 12,
    marginLeft: 8,
  },
  editar: {
    color: '#C4FF35',
    fontSize: 12,
    fontWeight: 'bold',
  },
  excluir: {
    color: '#FF7373',
    fontSize: 12,
  },
  checkConcluido: {
  backgroundColor: '#C4FF35',
  },
});