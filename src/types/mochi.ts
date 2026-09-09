export type MochiEmotion = 
  | 'idle'
  | 'happy'
  | 'winking'
  | 'driving'
  | 'cornering_left'
  | 'cornering_right'
  | 'braking'
  | 'dizzy'
  | 'sleepy'
  | 'sleeping'
  | 'surprised'
  | 'angry'
  | 'love'
  | 'cool'

export type HelmetType = 
  | 'none'
  | 'cyber_visor'
  | 'carbon_jdm'
  | 'neko_ears'
  | 'retro_arcade'
  | 'samurai_kabuto'

export interface HelmetInfo {
  id: HelmetType
  name: string
  subtitle: string
  color: string
  accentColor: string
  description: string
}

export interface TelemetryState {
  emotion: MochiEmotion
  helmet: HelmetType
  speed: number // km/h (0 - 180)
  gForceX: number // -1.0 to +1.0 (lateral)
  gForceY: number // -1.0 to +1.0 (longitudinal)
  battery: number // 0 - 100
  mood: number // 0 - 100
  petCount: number
  soundEnabled: boolean
  gyroEnabled: boolean
  mode: 'car' | 'desk'
}
