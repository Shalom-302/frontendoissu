/**
 * Photography used on the public pages.
 *
 * Every entry was fetched and looked at before being listed, so the caption
 * matches what the photo actually shows — a landing page that labels a swimmer
 * as a handball match is worse than one with no photo at all.
 *
 * Source: Unsplash (free to use under the Unsplash licence). `id` is the photo
 * slug; `builds` the delivery URL with the crop the layout needs.
 */

const BASE = 'https://images.unsplash.com/photo-'

function photo(id: string, { w, h, q = 72 }: { w: number; h: number; q?: number }): string {
  return `${BASE}${id}?auto=format&fit=crop&w=${w}&h=${h}&q=${q}`
}

export const HERO_IMAGE = {
  src: photo('1461896836934-ffe607ba8211', { w: 1920, h: 1280, q: 76 }),
  alt: "Athlète dans les starting-blocks sur une piste d'athlétisme",
}

export const SCHOOL_SPORT_IMAGE = {
  src: photo('1526232761682-d26e03ac148e', { w: 1200, h: 900 }),
  alt: 'Un encadreur entouré de jeunes joueurs sur un terrain de football',
}

export const CTA_IMAGE = {
  src: photo('1431324155629-1a6deb1dec8d', { w: 1920, h: 1280, q: 72 }),
  alt: 'Terrain de sport éclairé en soirée',
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
    src: photo('1552674605-db6ffd4facb5', { w: 800, h: 1000 }),
    alt: 'Coureurs à contre-jour au lever du soleil',
  },
  {
    name: 'Football',
    src: photo('1517466787929-bc90951d0974', { w: 800, h: 1000 }),
    alt: 'Joueur de football frappant le ballon',
  },
  {
    name: 'Basketball',
    src: photo('1546519638-68e109498ffc', { w: 800, h: 1000 }),
    alt: 'Ballon de basket traversant l’arceau',
  },
  {
    name: 'Volleyball',
    src: photo('1547347298-4074fc3086f0', { w: 800, h: 1000 }),
    alt: 'Échange lors d’un match de volleyball en salle',
  },
  {
    name: 'Natation',
    src: photo('1530549387789-4c1017266635', { w: 800, h: 1000 }),
    alt: 'Nageuse en papillon dans un bassin',
  },
  {
    name: 'Handball',
    src: null,
    alt: '',
  },
]
