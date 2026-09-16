/**
 * Photography used on the public pages.
 *
 * Two rules govern this file.
 *
 * 1. Every photo was fetched and looked at before being listed, so the caption
 *    matches what it actually shows — a landing page that labels a swimmer as a
 *    handball match is worse than one with no photo at all.
 * 2. OISSU CONNECT is built for the Ivorian school and university sport
 *    federation, so the people on these pages are African athletes. A visitor
 *    should recognise themselves on the home page of their own federation.
 *
 * Source: Unsplash (free to use under the Unsplash licence). `id` is the photo
 * slug; `photo()` builds the delivery URL with the crop the layout needs.
 */

const BASE = 'https://images.unsplash.com/photo-'

function photo(id: string, { w, h, q = 72 }: { w: number; h: number; q?: number }): string {
  return `${BASE}${id}?auto=format&fit=crop&w=${w}&h=${h}&q=${q}`
}

export const HERO_IMAGE = {
  src: photo('1698671823406-035c77ff6fcd', { w: 1920, h: 1120, q: 78 }),
  alt: "Sprinteur s'élançant des starting-blocks sur une piste d'athlétisme",
}

export const SCHOOL_SPORT_IMAGE = {
  src: photo('1745012010615-47abbeb3e906', { w: 1200, h: 900 }),
  alt: 'Jeunes joueurs disputant un match de football sur un terrain herbeux',
}

export const CTA_IMAGE = {
  src: photo('1652665314612-c48e10a01598', { w: 1920, h: 900, q: 72 }),
  alt: 'Jeunes joueurs de football sur un terrain en terre',
}

/**
 * One tile per discipline suivie en V1.
 *
 * Le handball n'a pas de photo : aucune image libre fiable ne le représentait,
 * et la tuile porte donc le dégradé de la marque plutôt qu'une photo d'un autre
 * sport. Remplacez `src` par une photo de handball quand vous en avez une.
 */
export const DISCIPLINE_TILES: {
  name: string
  src: string | null
  alt: string
}[] = [
  {
    name: 'Athlétisme',
    src: photo('1526676537331-7747bf8278fc', { w: 800, h: 1000 }),
    alt: 'Coureurs en pleine course sur une piste d’athlétisme',
  },
  {
    name: 'Football',
    src: photo('1510597026538-da2e86b8588a', { w: 800, h: 1000 }),
    alt: 'Jeune footballeur contrôlant le ballon du pied',
  },
  {
    name: 'Basketball',
    src: photo('1667844141293-2036371911fd', { w: 800, h: 1000 }),
    alt: 'Joueur de basket avec son ballon sur un terrain d’établissement',
  },
  {
    name: 'Volleyball',
    src: photo('1601512986351-9b0e01780eef', { w: 800, h: 1000 }),
    alt: 'Attaque au filet lors d’un match de volleyball',
  },
  {
    name: 'Natation',
    src: photo('1649163783135-a66ab43e1193', { w: 800, h: 1000 }),
    alt: 'Nageur en crawl dans un couloir de bassin',
  },
  {
    name: 'Handball',
    src: null,
    alt: '',
  },
]
