'use client';

import { useState, useEffect } from 'react';
import FlappyBird from './flappybird';
import Tetris from './tetris';
import Game2048 from './game2048';
import Snake from './snake';
import DinoGame from './dino';

export default function GamesPage() {
    const [activeTab, setActiveTab] = useState('tab1');

    const handleTabClick = (tab: string) => {
        setActiveTab(tab);
    };

    useEffect(() => {
        const preventScrollKeys = ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '];

        const handleKeyDown = (e: KeyboardEvent) => {
            if (preventScrollKeys.includes(e.key)) {
                e.preventDefault();
            }
        };

        window.addEventListener('keydown', handleKeyDown, { passive: false });

        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, []);

    return (
        <div className="p-4">
            <div className="flex flex-wrap space-x-2 space-y-2 mb-4">
                <button
                    className={`px-4 py-2 rounded ${
                        activeTab === 'tab1'
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 text-gray-700'
                    }`}
                    onClick={() => handleTabClick('tab1')}
                >
                    Flappy Bird
                </button>
                <button
                    className={`px-4 py-2 rounded ${
                        activeTab === 'tab2'
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 text-gray-700'
                    }`}
                    onClick={() => handleTabClick('tab2')}
                >
                    2048
                </button>
                <button
                    className={`px-4 py-2 rounded ${
                        activeTab === 'tab3'
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 text-gray-700'
                    }`}
                    onClick={() => handleTabClick('tab3')}
                >
                    Tetris
                </button>
                <button
                    className={`px-4 py-2 rounded ${
                        activeTab === 'tab4'
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 text-gray-700'
                    }`}
                    onClick={() => handleTabClick('tab4')}
                >
                    Snake
                </button>
                <button
                    className={`px-4 py-2 rounded ${
                        activeTab === 'tab5'
                            ? 'bg-blue-500 text-white'
                            : 'bg-gray-200 text-gray-700'
                    }`}
                    onClick={() => handleTabClick('tab5')}
                >
                    Dino
                </button>
            </div>

            <div className="mt-4 space-y-4">
                <div
                    className={`p-4 bg-white rounded shadow ${
                        activeTab === 'tab1' ? 'block' : 'hidden'
                    }`}
                >
                    <h2 className="text-xl font-bold mb-2">Flappy Bird</h2>
                    <FlappyBird />
                </div>

                <div
                    className={`p-4 bg-white rounded shadow ${
                        activeTab === 'tab2' ? 'block' : 'hidden'
                    }`}
                >
                    <h2 className="text-xl font-bold mb-2">2048</h2>
                    <Game2048 />
                </div>

                <div
                    className={`p-4 bg-white rounded shadow ${
                        activeTab === 'tab3' ? 'block' : 'hidden'
                    }`}
                >
                    <h2 className="text-xl font-bold mb-2">Tetris</h2>
                    <Tetris />
                </div>

                <div
                    className={`p-4 bg-white rounded shadow ${
                        activeTab === 'tab4' ? 'block' : 'hidden'
                    }`}
                >
                    <h2 className="text-xl font-bold mb-2">Snake</h2>
                    <Snake />
                </div>

                <div
                    className={`p-4 bg-white rounded shadow ${
                        activeTab === 'tab5' ? 'block' : 'hidden'
                    }`}
                >
                    <h2 className="text-xl font-bold mb-2">Chrome Dino</h2>
                    <DinoGame />
                </div>
            </div>
        </div>
    );
}
