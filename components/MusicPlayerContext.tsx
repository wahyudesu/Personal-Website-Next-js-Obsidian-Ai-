"use client";

import { createContext, useContext, useState, useEffect } from "react";
import { Howl } from "howler";
import { playlist, Song } from "@/data/playlist";

type MusicPlayerContextType = {
  isPlaying: boolean;
  currentSongIndex: number;
  currentTime: number;
  duration: number;
  isLoading: boolean;
  play: (songIndex?: number) => void;
  pause: () => void;
  togglePlayPause: () => void;
  skipBack: () => void;
  skipForward: () => void;
  seek: (time: number) => void;
};

const MusicPlayerContext = createContext<MusicPlayerContextType | null>(null);

export function MusicPlayerProvider({ children }: { children: React.ReactNode }) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSongIndex, setCurrentSongIndex] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [howl, setHowl] = useState<Howl | null>(null);

  const play = (songIndex?: number) => {
    setIsLoading(true);
    const index = songIndex !== undefined ? songIndex : currentSongIndex;

    if (howl) {
      howl.stop();
      howl.unload();
    }

    const sound = new Howl({
      src: [playlist[index].audioUrl],
      volume: 1.0,
      onend: skipForward,
      onload: () => {
        setDuration(sound.duration());
        setIsLoading(false);
      },
      onplay: () => {
        setIsPlaying(true);
        setIsLoading(false);
      },
      onpause: () => setIsPlaying(false),
      onstop: () => setIsPlaying(false),
    });

    setHowl(sound);
    sound.play();
    setCurrentSongIndex(index);
  };

  const pause = () => {
    howl?.pause();
  };

  const togglePlayPause = () => {
    if (isPlaying) {
      pause();
    } else {
      play();
    }
  };

  const skipBack = () => {
    const prevIndex = (currentSongIndex - 1 + playlist.length) % playlist.length;
    play(prevIndex);
  };

  const skipForward = () => {
    const nextIndex = (currentSongIndex + 1) % playlist.length;
    play(nextIndex);
  };

  const seek = (time: number) => {
    if (howl) {
      howl.seek(time);
      setCurrentTime(time);
    }
  };

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (howl && isPlaying) {
      interval = setInterval(() => {
        setCurrentTime(howl.seek() as number);
      }, 1000);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [howl, isPlaying]);

  useEffect(() => {
    return () => {
      if (howl) {
        howl.stop();
        howl.unload();
      }
    };
  }, [howl]);

  return (
    <MusicPlayerContext.Provider
      value={{
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
      }}
    >
      {children}
    </MusicPlayerContext.Provider>
  );
}

export function useMusicPlayer() {
  const context = useContext(MusicPlayerContext);
  if (!context) {
    throw new Error("useMusicPlayer must be used within a MusicPlayerProvider");
  }
  return context;
}
