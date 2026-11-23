import * as FileSystem from 'expo-file-system/legacy';
import { Exercicio } from '../types/Exercicios';

const CAMINHO_ARQUIVO =
  FileSystem.documentDirectory + 'exercicios.json';

export async function carregarExercicios(): Promise<Exercicio[] | null> {
  try {
    const arquivo = await FileSystem.getInfoAsync(CAMINHO_ARQUIVO);

    if (!arquivo.exists) {
      return null;
    }

    const conteudo = await FileSystem.readAsStringAsync(
      CAMINHO_ARQUIVO
    );

    return JSON.parse(conteudo) as Exercicio[];
  } catch (erro) {
    console.error('Erro ao carregar exercícios:', erro);
    throw erro;
  }
}

export async function salvarExercicios(
  exercicios: Exercicio[]
): Promise<void> {
  try {
    const conteudo = JSON.stringify(exercicios, null, 2);

    await FileSystem.writeAsStringAsync(
      CAMINHO_ARQUIVO,
      conteudo
    );
  } catch (erro) {
    console.error('Erro ao salvar exercícios:', erro);
    throw erro;
  }
}