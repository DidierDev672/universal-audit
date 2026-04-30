import { ref } from 'vue'

export type Color = {
  id: string
  color: string[]
  sound: string[]
}

export const colors = ref<Color[]>([
  {
    id: 'yellow',
    color: ['#FEFCE8','#FEF9C3','#FEF08A','#FDE047','#FACC15','#EAB308'],
    sound: [
      'https://dvckxzkgvriwvnglgwxm.supabase.co/storage/v1/object/public/sounds/yellow-chime.mp3',
      'https://dvckxzkgvriwvnglgwxm.supabase.co/storage/v1/object/public/sounds/yellow-chimeII.mp3'
    ]
  },
  {
    id: 'amber',
    color: ['#FFFBEB','#FEF3C7','#FDE68A','#FCD34D','#FBBF24','#F59E0B'],
    sound: [
      'https://dvckxzkgvriwvnglgwxm.supabase.co/storage/v1/object/public/sounds/amber_tree.mp3',
      'https://dvckxzkgvriwvnglgwxm.supabase.co/storage/v1/object/public/sounds/amber_treeII.mp3'
    ]
  },
  {
    id: 'green',
    color: ['#BBF7D0','#86EFAC','#4ADE80','#22C55E','#16A34A','#15803D','#166534','#14532D','#052E16'],
    sound: [
      'https://dvckxzkgvriwvnglgwxm.supabase.co/storage/v1/object/public/sounds/Nature_Crickets.mp3',
      'https://dvckxzkgvriwvnglgwxm.supabase.co/storage/v1/object/public/sounds/Nature_Birds.mp3',
      'https://dvckxzkgvriwvnglgwxm.supabase.co/storage/v1/object/public/sounds/Nature_%20Mosquitos.mp3'
    ]
  },
  {
    id: 'emerald',
    color: ['#A7F3D0','#6EE7B7','#34D399','#10B981','#059669','#047857','#065F46','#064E3B','#022C22'],
    sound: [
      'https://dvckxzkgvriwvnglgwxm.supabase.co/storage/v1/object/public/sounds/Cartoon_Pop_Pull.mp3',
      'https://dvckxzkgvriwvnglgwxm.supabase.co/storage/v1/object/public/sounds/Food_Drink_Bottle.mp3',
      'https://dvckxzkgvriwvnglgwxm.supabase.co/storage/v1/object/public/sounds/Food_Drink_Tableware_Spoon.mp3'
    ]
  },
  {
    id: 'lime',
    color: ['#D9F99D','#BEF264','#A3E635','#84CC16','#65A30D','#4D7C0F','#7F6212','#365314','#1A2E05'],
    sound: [
      'https://dvckxzkgvriwvnglgwxm.supabase.co/storage/v1/object/public/sounds/Food_Glass.mp3',
      'https://dvckxzkgvriwvnglgwxm.supabase.co/storage/v1/object/public/sounds/Glass_Break_Dry_Variation.mp3'
    ]
  },
  {
    id: 'red',
    color: ['#FECACA','#FCA5A5','#F87171','#EF4444','#DC2626','#B91C1C','#991B1B','#7F1D1D','#450A0A'],
    sound: [
      'https://dvckxzkgvriwvnglgwxm.supabase.co/storage/v1/object/public/sounds/PadSwellSpacecraft.mp3',
      'https://dvckxzkgvriwvnglgwxm.supabase.co/storage/v1/object/public/sounds/Pop_Various.mp3',
      'https://dvckxzkgvriwvnglgwxm.supabase.co/storage/v1/object/public/sounds/Retro_Beeps_Success.mp3'
    ]
  },
  {
    id: 'orange',
    color: ['#FED7AA','#FDBA74','#FB923C','#F97316','#EA580C','#C2410C','#9A3412','#7C2D12','#431407'],
    sound: [
      'https://dvckxzkgvriwvnglgwxm.supabase.co/storage/v1/object/public/sounds/RumbleDrone.mp3',
      'https://dvckxzkgvriwvnglgwxm.supabase.co/storage/v1/object/public/sounds/SwellMysticPad.mp3'
    ]
  },
  {
    id: 'pink',
    color: ['#FECDD3','#FDA4AF','#FB7185','#F43F5E','#E11D48','#BE123C','#9F1239','#881337','#4C0519'],
    sound: [
      'https://dvckxzkgvriwvnglgwxm.supabase.co/storage/v1/object/public/sounds/Vehicles_Misc_Tap_Rhythmic.mp3',
      'https://dvckxzkgvriwvnglgwxm.supabase.co/storage/v1/object/public/sounds/HumanMetalRunIsolatedSteps.mp3'
    ]
  },
  {
    id: 'blue',
    color: ['#BFDBFE','#93C5FD','#60A5FA','#3B82F6','#2563EB','#1D4ED8','#1E40AF','#1E3A8A','#172554'],
    sound: [
      'https://dvckxzkgvriwvnglgwxm.supabase.co/storage/v1/object/public/sounds/Synthetic_Bubble.mp3',
      'https://dvckxzkgvriwvnglgwxm.supabase.co/storage/v1/object/public/sounds/WinterSubwayPassingTraffic.mp3'
    ]
  },
  {
    id: 'sky',
    color: ['#BAE6FD','#7DD3FC','#38BDF8','#0EA5E9','#0284C7','#0369A1','#075985','#0C4A6E','#082F49'],
    sound: [
      'https://dvckxzkgvriwvnglgwxm.supabase.co/storage/v1/object/public/sounds/Water_Splash.mp3',
      'https://dvckxzkgvriwvnglgwxm.supabase.co/storage/v1/object/public/sounds/Water_Sound.mp3'
    ]
  },
  {
    id: 'cyan',
    color: ['#A5F3FC','#67E8F9','#22D3EE','#06B6D4','#0891B2','#0E7490','#155E75','#164E63','#083344'],
    sound: [
      'https://dvckxzkgvriwvnglgwxm.supabase.co/storage/v1/object/public/sounds/WaterBubblesBubbleSplash.mp3',
      'https://dvckxzkgvriwvnglgwxm.supabase.co/storage/v1/object/public/sounds/Water_Splash_Splat.mp3'
    ]
  },
  {
    id: 'fuchsia',
    color: ['#F5D0FE','#F0ABFC','#E879F9','#D946EF','#C026D3','#A21CAF','#86198F','#701A75','#4A044E'],
    sound: [
      'https://dvckxzkgvriwvnglgwxm.supabase.co/storage/v1/object/public/sounds/WinterSubwayPassingTraffic.mp3'
    ]
  },
  {
    id: 'purple',
    color: ['#DDD6FE','#C4B5FD','#A78BFA','#8B5CF6','#7C3AED','#6D28D9','#5B21B6','#4C1D95','#370764'],
    sound: [
      'https://dvckxzkgvriwvnglgwxm.supabase.co/storage/v1/object/public/sounds/BicycleBell.mp3',
      'https://dvckxzkgvriwvnglgwxm.supabase.co/storage/v1/object/public/sounds/Cartoon_Pop_Pull.mp3'
    ]
  },
  {
    id: 'indigo',
    color: ['#C7D2FE','#A5B4FC','#818CF8','#6366F1','#4F46E5','#4338CA','#3730A3','#312E81','#1E1B4B'],
    sound: [
      'https://dvckxzkgvriwvnglgwxm.supabase.co/storage/v1/object/public/sounds/DarkSyntn.mp3'
    ]
  },
  {
    id: 'violet',
    color: ['#A78BFA','#8B5CF6','#7C3AED','#6D28D9','#5B21B6','#4C1D95','#2E1065'],
    sound: [
      'https://dvckxzkgvriwvnglgwxm.supabase.co/storage/v1/object/public/sounds/MediumLargeBells.mp3',
      'https://dvckxzkgvriwvnglgwxm.supabase.co/storage/v1/object/public/sounds/MorphingSynthDowner.mp3'
    ]
  }
])
