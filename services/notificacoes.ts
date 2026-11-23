
import * as Notifications from 'expo-notifications';

const IDENTIFICADOR_LEMBRETE = 'lembrete-meu-treino';

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowBanner: true,
    shouldShowList: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export async function solicitarPermissao(): Promise<boolean> {
  const permissaoAtual = await Notifications.getPermissionsAsync();

  let status = permissaoAtual.status;

  if (status !== 'granted') {
    const permissao = await Notifications.requestPermissionsAsync();
    status = permissao.status;
  }

  return status === 'granted';
}

export async function programarLembrete(
  hora: number,
  minuto: number,
): Promise<string> {
  await cancelarLembretes();

  return await Notifications.scheduleNotificationAsync({
    identifier: IDENTIFICADOR_LEMBRETE,
    content: {
      title: 'Hora de treinar!',
      body: 'Está na hora de cuidar da sua saúde. Vamos treinar?',
      sound: true,
      data: { tipo: IDENTIFICADOR_LEMBRETE },
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour: hora,
      minute: minuto,
    },
  });
}

export async function verificarLembrete(): Promise<boolean> {
  const agendamentos =
    await Notifications.getAllScheduledNotificationsAsync();

  return agendamentos.some(
    (notificacao) =>
      notificacao.identifier === IDENTIFICADOR_LEMBRETE,
  );
}

export async function cancelarLembretes(): Promise<void> {
  await Notifications.cancelScheduledNotificationAsync(
    IDENTIFICADOR_LEMBRETE,
  );
}
