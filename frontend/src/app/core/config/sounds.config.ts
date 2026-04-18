/** Single source of truth for ambient sound metadata */
export interface SoundMeta {
  id: string;
  label: string;
  file: string;
}

export const SOUND_LIST: SoundMeta[] = [
  { id: 'barista',    label: 'Barista',      file: 'barista.mp3'    },
  { id: 'rain',       label: 'Rainy Day',    file: 'rain.mp3'       },
  { id: 'fireplace',  label: 'Fireplace',    file: 'fireplace.mp3'  },
  { id: 'keyboard',   label: 'Coffee Cups',  file: 'keyboard.mp3'   },
  { id: 'chatter',    label: 'Customers',    file: 'chatter.mp3'    },
  { id: 'jazz',       label: 'Jazz',         file: 'jazz.mp3'       },
  { id: 'wind',       label: 'Sunny Day',    file: 'wind.mp3'       },
  { id: 'whitenoise', label: 'Machinery',    file: 'whitenoise.mp3' },
];
