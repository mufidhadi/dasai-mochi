export type TamagotchiExpression = 
  | 'neutral'
  | 'happy'
  | 'hungry'
  | 'sleepy'
  | 'sleeping'
  | 'love'
  | 'excited'
  | 'surprised'
  | 'low_battery';

export type TamagotchiActionState = 
  | 'idle'
  | 'feeding'
  | 'playing'
  | 'cleaning'
  | 'petting'
  | 'sleeping';

export type ColorTheme = 'cyan' | 'amber' | 'green' | 'magenta' | 'white';

export interface TamagotchiStats {
  hunger: number;    // 0 to 100
  energy: number;    // 0 to 100
  happiness: number; // 0 to 100
  battery: number;   // 0 to 100
}

export interface Vector2D {
  x: number;
  y: number;
}
