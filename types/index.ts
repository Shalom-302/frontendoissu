/**
 * Shapes returned by the OISSU CONNECT API.
 *
 * Mirrors `backend/app/admin/schema/*.py`. Every response is wrapped by the
 * API's envelope (`ApiResponse`), so `lib/api-*.ts` unwraps `data` before
 * anything here reaches a component.
 */

export type Role = 'user' | 'admin'

export interface ApiResponse<T> {
  code: number
  msg: string
  data: T
}

export interface Page<T> {
  items: T[]
  total: number
  page: number
  size: number
  total_pages: number
  links: Record<string, string | null>
}

export interface RoleRef {
  name: string
}

export interface User {
  id: number
  x_id: string
  email: string
  firstname: string | null
  lastname: string | null
  phone: string | null
  status: boolean
  roles: RoleRef[]
  join_time?: string
  last_login_time?: string | null
}

export interface LoginResponse {
  access_token: string
  access_token_type: string
  access_token_expire_time: string
  user: User
}

export interface Athlete {
  id: number
  x_id: string
  user_id: number
  first_name: string
  last_name: string
  license_number: string
  discipline: string
  speciality: string | null
  category: string | null
  club_or_establishment: string | null
  education_level: string | null
  nationality: string | null
  gender: string | null
  date_of_birth: string | null
  photo_url: string | null
  created_time: string
  updated_time: string | null
  email?: string | null
  is_active?: boolean
}

export interface AthleteDetail extends Athlete {
  performance_count: number
  performances: Performance[]
}

export interface Performance {
  id: number
  x_id: string
  athlete_id: number
  competition_name: string
  competition_date: string
  discipline: string
  event: string
  result: string
  unit: string
  location: string | null
  ranking: number | null
  medal: string | null
  observations: string | null
  created_time: string
  updated_time: string | null
  athlete_name?: string | null
  athlete_license_number?: string | null
}

export interface MedalCount {
  gold: number
  silver: number
  bronze: number
}

export interface EvolutionPoint {
  competition_date: string
  competition_name: string
  event: string
  result: string
  unit: string
  ranking: number | null
  season: string
}

export interface SeasonSummary {
  season: string
  performances: number
  competitions: number
  medals: number
  best_result: string | null
  average_ranking: number | null
}

export interface BestResult {
  discipline: string
  event: string
  result: string
  unit: string
  competition_name: string
  competition_date: string
  athlete_name: string | null
}

export interface UserDashboard {
  athlete: Athlete
  total_performances: number
  total_competitions: number
  best_ranking: number | null
  medals: MedalCount
  latest_performances: Performance[]
  best_results: BestResult[]
  evolution: EvolutionPoint[]
  seasons: SeasonSummary[]
}

export interface DisciplineStat {
  discipline: string
  athletes: number
  performances: number
  medals: number
}

export interface PeriodStat {
  period: string
  performances: number
  competitions: number
  medals: number
}

export interface AdminDashboard {
  total_athletes: number
  active_athletes: number
  total_disciplines: number
  total_competitions: number
  total_performances: number
  total_establishments: number
  medals: MedalCount
  best_results: BestResult[]
  latest_performances: Performance[]
  by_discipline: DisciplineStat[]
  by_period: PeriodStat[]
  seasons: SeasonSummary[]
}

export interface AthleteFilters {
  disciplines: string[]
  categories: string[]
  establishments: string[]
}

export interface RegisterAthletePayload {
  email: string
  password: string
  first_name: string
  last_name: string
  license_number: string
  discipline: string
  speciality?: string | null
  category?: string | null
  club_or_establishment?: string | null
  education_level?: string | null
  nationality?: string | null
  gender?: string | null
  date_of_birth?: string | null
}

export interface PerformancePayload {
  athlete_id: number
  competition_name: string
  competition_date: string
  discipline: string
  event: string
  result: string
  unit: string
  location?: string | null
  ranking?: number | null
  medal?: string | null
  observations?: string | null
}
