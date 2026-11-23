import { useEffect, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Alert,
} from 'react-native';
import { Exercicio } from '../types/Exercicios';

type Props = {
  inicial?: Exercicio | null;
  onSalvar: (nome: string, series: number, repeticoes: number) => void;
  onCancelar: () => void;
};

export default function FormularioExercicio({
  inicial,
  onSalvar,
  onCancelar,
}: Props) {
  const [nome, setNome] = useState('');
  const [series, setSeries] = useState('3');
  const [repeticoes, setRepeticoes] = useState('12');

  useEffect(() => {
    setNome(inicial?.nome ?? '');
    setSeries(inicial ? String(inicial.series) : '3');
    setRepeticoes(inicial ? String(inicial.repeticoes) : '12');
  }, [inicial]);

  function salvar() {
    const quantidadeSeries = Number(series);
    const quantidadeRepeticoes = Number(repeticoes);

    if (!nome.trim() || !series.trim() || !repeticoes.trim()) {
      Alert.alert('Atenção', 'Preencha todos os campos.');
      return;
    }

    if (
      !Number.isInteger(quantidadeSeries) ||
      !Number.isInteger(quantidadeRepeticoes) ||
      quantidadeSeries < 1 ||
      quantidadeRepeticoes < 1
    ) {
      Alert.alert(
        'Valores inválidos',
        'Séries e repetições devem ser números inteiros maiores que zero.',
      );
      return;
    }

    onSalvar(nome.trim(), quantidadeSeries, quantidadeRepeticoes);
  }

  return (
    <View style={styles.formulario}>
      <Text style={styles.titulo}>
        {inicial ? 'Editar exercício' : 'Novo exercício'}
      </Text>

      <Text style={styles.label}>Nome do exercicio</Text>
      <TextInput
        style={styles.input}
        placeholderTextColor="#777B72"
        value={nome}
        onChangeText={setNome}
      />

      <View style={styles.linha}>
        <View style={styles.campo}>
          <Text style={styles.label}>Series</Text>
          <TextInput
            style={styles.input}
            keyboardType="number-pad"
            value={series}
            onChangeText={setSeries}
          />
        </View>

        <View style={styles.campo}>
          <Text style={styles.label}>Repetiçoes</Text>
          <TextInput
            style={styles.input}
            keyboardType="number-pad"
            value={repeticoes}
            onChangeText={setRepeticoes}
          />
        </View>
      </View>

      <TouchableOpacity style={styles.botaoSalvar} onPress={salvar}>
        <Text style={styles.textoBotao}>
          {inicial ? 'SALVAR ALTERAÇÕES' : 'ADICIONAR EXERCÍCIO +'}
        </Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.botaoCancelar} onPress={onCancelar}>
        <Text style={styles.textoCancelar}>Cancelar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  formulario: {
    backgroundColor: '#191B19',
    borderRadius: 18,
    padding: 18,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#30352B',
  },
  titulo: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  label: {
    color: '#C4FF35',
    fontSize: 13,
    marginBottom: 8,
  },
  input: {
    backgroundColor: '#101110',
    borderWidth: 1,
    borderColor: '#343830',
    borderRadius: 10,
    color: '#fdfcfc',
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 16,
    fontSize: 15,
  },
  linha: {
    flexDirection: 'row',
    gap: 12,
  },
  campo: {
    flex: 1,
  },
  botaoSalvar: {
    backgroundColor: '#C4FF35',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 4,
  },
  textoBotao: {
    color: '#10110D',
    fontSize: 12,
    fontWeight: 'bold',
  },
  botaoCancelar: {
    alignItems: 'center',
    padding: 12,
    marginTop: 4,
  },
  textoCancelar: {
    color: '#B6B9B2',
  },
});