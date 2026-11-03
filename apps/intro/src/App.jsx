import React from 'react';
import { ClickEmojiCannons } from './components/ClickEmojiCannons';
import { IndexHero } from './components/IndexHero';

export default function App() {
  return (
    <div className="fixed inset-0 w-full h-[100dvh] overflow-hidden bg-[#FFE091] text-[#1A1200] flex items-center justify-center">
      {/* 1. Global Click Emoji Burst Cannon */}
      <ClickEmojiCannons />

      {/* 2. Fullscreen Two-Stage Kinetic Intro Experience */}
      <main className="w-full h-full flex items-center justify-center">
        <IndexHero />
      </main>
    </div>
  );
}
