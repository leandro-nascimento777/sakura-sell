export interface Feature {
  id: string
  title: string
  description: string
  icon: string
  exampleMessage: { from: 'user' | 'bot'; text: string }[]
}

export const features: Feature[] = [
  {
    id: 'advanced-search',
    title: 'Buscas avançadas',
    description:
      'Pesquise voos por origem, destino, datas, deadlines, cabines e companhias aéreas de forma inteligente.',
    icon: 'Search',
    exampleMessage: [
      { from: 'user', text: 'GRU → FLN, 2 adultos, ida e volta, julho, mais barato?' },
      { from: 'bot', text: 'Encontrei as melhores opções para sua viagem.' },
    ],
  },
  {
    id: 'alerts',
    title: 'Alertas personalizados',
    description:
      'Crie alertas com suas datas, destinos e preço ideal. A Sakura avisa quando a oferta aparecer.',
    icon: 'Bell',
    exampleMessage: [
      { from: 'user', text: 'Me avise quando GRU → MIA cair abaixo de R$ 3.000' },
      { from: 'bot', text: 'Alerta criado! Você será notificado assim que surgir.' },
    ],
  },
  {
    id: 'ecosystem',
    title: 'Ecossistema completo',
    description:
      'Busque, compare, gere orçamentos, consulte RAV e acompanhe tudo no painel da Sakura Pass.',
    icon: 'LayoutGrid',
    exampleMessage: [
      { from: 'user', text: 'GRU → BUE, entre dias 5 e 7, com bagagem, melhor custo-benefício?' },
      { from: 'bot', text: 'Encontrei as opções com melhor custo para você comparar.' },
    ],
  },
]
