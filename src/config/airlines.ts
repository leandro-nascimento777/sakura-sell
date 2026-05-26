export interface Airline {
  name: string
  logo: string
  width: number
}

export const airlines: Airline[] = [
  { name: 'LATAM', logo: '/images/airlines/latam.svg', width: 80 },
  { name: 'GOL', logo: '/images/airlines/gol.svg', width: 60 },
  { name: 'Azul', logo: '/images/airlines/azul.svg', width: 70 },
  { name: 'American Airlines', logo: '/images/airlines/american.svg', width: 120 },
  { name: 'United', logo: '/images/airlines/united.svg', width: 90 },
  { name: 'Delta', logo: '/images/airlines/delta.svg', width: 80 },
  { name: 'Emirates', logo: '/images/airlines/emirates.svg', width: 100 },
  { name: 'Copa Airlines', logo: '/images/airlines/copa.svg', width: 80 },
  { name: 'Iberia', logo: '/images/airlines/iberia.svg', width: 80 },
]
