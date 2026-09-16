/**
 * Reference values, mirroring `backend/common/enums.py`.
 *
 * The API accepts free text for these fields (real-world data will not fit a
 * closed list forever), but the forms offer the V1 vocabulary so the demo data
 * stays consistent.
 */

export const DISCIPLINES = [
  'Athlétisme',
  'Football',
  'Basketball',
  'Handball',
  'Volleyball',
  'Natation',
] as const

export const CATEGORIES = ['Minime', 'Cadet', 'Junior', 'Senior'] as const

export const EDUCATION_LEVELS = ['Primaire', 'Secondaire', 'Supérieur'] as const

export const GENDERS = [
  { value: 'M', label: 'Masculin' },
  { value: 'F', label: 'Féminin' },
] as const

export const MEDALS = ['Or', 'Argent', 'Bronze'] as const

/** Units a result can be expressed in, with what they mean on a chart. */
export const UNITS = [
  { value: 's', label: 'Secondes (s) — plus bas est meilleur' },
  { value: 'm', label: 'Mètres (m)' },
  { value: 'cm', label: 'Centimètres (cm)' },
  { value: 'pts', label: 'Points (pts)' },
] as const
