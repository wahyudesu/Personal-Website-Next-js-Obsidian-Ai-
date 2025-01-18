import { useState } from 'react';
import Image from 'next/image';
import { CirclePlay, Pause, SkipBack, SkipForward, ChevronUp, ChevronDown, Loader2 } from 'lucide-react';
import { Button } from '@/components/components/ui/button';
import { Separator } from './components/ui/separator';
import { useMusicPlayer } from './MusicPlayerContext';
import { playlist, Song } from '@/data/playlist';
import { motion, AnimatePresence } from 'framer-motion'; // Impor Framer Motion

export default function MusicPlayer() {
  const {
    isPlaying,
    currentSongIndex,
    currentTime,
    duration,
    isLoading,
    play,
    pause,
    togglePlayPause,
    skipBack,
    skipForward,
    seek,
  } = useMusicPlayer();

  const [showPlaylist, setShowPlaylist] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  const currentSong = playlist[currentSongIndex];

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const progressBar = e.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const clickPosition = e.clientX - rect.left;
    const percentage = clickPosition / rect.width;
    const newTime = percentage * duration;

    seek(newTime);
  };

  const handleProgressDrag = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;

    const progressBar = e.currentTarget;
    const rect = progressBar.getBoundingClientRect();
    const dragPosition = e.clientX - rect.left;
    const percentage = dragPosition / rect.width;
    const newTime = percentage * duration;

    seek(newTime);
  };

  return (
    <div className="bg-white dark:bg-zinc-900 h-full overflow-auto rounded-[16px]">
      <div className="px-4 pb-3 pt-3">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className="w-[42px] h-[42px] relative rounded-md overflow-hidden">
              <Image
                src={currentSong.thumbnail || '/placeholder.svg'}
                alt="Album art"
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1 min-w-0">
              <h2 className="font-semibold truncate text-black dark:text-white">{currentSong.title}</h2>
              <p className="text-xs text-gray-400 truncate">{currentSong.artist}</p>
            </div>
          </div>
          <span className="text-xs text-gray-400">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
        </div>

        <div
          className="w-full bg-gray-300 rounded-full h-1 dark:bg-gray-700 relative cursor-pointer"
          onClick={handleProgressClick}
          onMouseMove={handleProgressDrag}
          onMouseDown={() => setIsDragging(true)}
          onMouseUp={() => setIsDragging(false)}
          onMouseLeave={() => setIsDragging(false)}
        >
          {duration > 0 && (
            <div
              className="bg-primary-500 h-1 rounded-full"
              style={{ width: `${(currentTime / duration) * 100}%` }}
            ></div>
          )}
        </div>

        <div className="flex items-center justify-between mb-1 pt-1">
          <div className="flex items-center gap-4">
            <button className="hover:bg-white/10" onClick={skipBack}>
              <SkipBack className="h-5 w-5" />
            </button>
            <button className="hover:bg-white/10" onClick={togglePlayPause}>
              {isLoading ? (
                <Loader2 className="h-6 w-6 text-primary-500 animate-spin" />
              ) : isPlaying ? (
                <Pause className="h-6 w-6 text-primary-500" />
              ) : (
                <CirclePlay className="h-6 w-6 text-primary-500" />
              )}
            </button>
            <button onClick={skipForward}>
              <SkipForward className="h-5 w-5" />
            </button>
          </div>
          <Button
            variant="ghost"
            size="sm"
            className="text-sm hover:bg-white/10"
            onClick={() => setShowPlaylist(!showPlaylist)}
          >
            <span className={showPlaylist ? 'text-primary-500' : 'text-gray-400'}>
              {showPlaylist ? 'Hide playlist' : 'Show playlist'}
            </span>
            {showPlaylist ? <ChevronUp className="h-4 w-4 ml-1" /> : <ChevronDown className="h-4 w-4 ml-1" />}
          </Button>
        </div>

        {/* Animasi Playlist */}
        <AnimatePresence>
          {showPlaylist && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="border-t border-white/10 overflow-hidden"
            >
              <Separator className="mb-1" />
              {playlist.map((song, index) => (
                <button
                  key={song.id}
                  onClick={() => play(index)}
                  className={`w-full flex items-center gap-3 p-2 hover:bg-primary-500 hover:bg-opacity-10 transition-colors rounded-lg ${
                    currentSongIndex === index ? 'bg-white/10' : ''
                  }`}
                >
                  <div className="w-[34px] h-[34px] relative rounded-md overflow-hidden">
                    <Image
                      src={song.thumbnail || '/placeholder.svg'}
                      alt={song.title}
                      fill
                      className="object-cover"
                    />
                  </div>

                  <div className="text-left flex-1 min-w-0">
                    <h3
                      className={`font-medium truncate ${
                        currentSongIndex === index ? 'text-primary-500' : 'text-black dark:text-white'
                      }`}
                    >
                      {song.title}
                    </h3>
                    <p className="text-xs text-gray-400 truncate">{song.artist}</p>
                  </div>
                </button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}