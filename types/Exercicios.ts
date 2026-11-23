
export type Exercicio = {
  id: string;
  nome: string;
  series: number;
  repeticoes: number;
  concluido: boolean;
  pesoKg?: number;
  seriesConcluidas?: number[];
};
