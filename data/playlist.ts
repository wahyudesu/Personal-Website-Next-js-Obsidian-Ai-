// playlist.ts
export type Song = {
    id: string;
    title: string;
    artist: string;
    thumbnail: string;
    audioUrl: string;
  };
  
  export const playlist: Song[] = [
    {
      id: '1',
      title: 'Blue',
      artist: 'Yongkai',
      thumbnail: '/yongkai-blue.jpg',
      audioUrl: 'music/yung_kai-blue.mp3',
    },
    {
      id: '2',
      title: 'Bunga Maaf',
      artist: 'The Lantis',
      thumbnail: '/bunga-maaf.jpg',
      audioUrl: 'music/The Lantis - Bunga Maaf.mp3',
    },
    {
      id: '3',
      title: 'Entrance to Infinity Castle',
      artist: 'Demon Slayer',
      thumbnail: '/bunga-maaf.jpg',
      audioUrl: 'music/kny.mp3',
    },
  ];
  