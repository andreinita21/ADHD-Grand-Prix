import TrackCanvas from '@/components/TrackCanvas';
import Paddock from '@/components/Paddock';
import RaceControls from '@/components/RaceControls';

export default function Home() {
  return (
    <main className="flex flex-col lg:flex-row h-screen lg:h-screen w-full bg-slate-950 text-slate-100 font-sans overflow-hidden lg:overflow-hidden relative">

      {/* Background Decor */}
      <div className="absolute inset-0 bg-green-900 pointer-events-none" />
      {/* Subtle grass noise/texture overlay */}
      <div className="absolute inset-0 opacity-20 mix-blend-overlay pointer-events-none" style={{ backgroundImage: "url('data:image/svg+xml,%3Csvg viewBox=\"0 0 200 200\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cfilter id=\"noiseFilter\"%3E%3CfeTurbulence type=\"fractalNoise\" baseFrequency=\"0.8\" numOctaves=\"3\" stitchTiles=\"stitch\"/%3E%3C/filter%3E%3Crect width=\"100%25\" height=\"100%25\" filter=\"url(%23noiseFilter)\"/%3E%3C/svg%3E')" }}></div>
      <div className="absolute inset-0 pattern-grid-lg text-green-950/20 pointer-events-none" />

      {/* Main Area: The Track */}
      <section className="relative flex-1 flex flex-col w-full h-[50vh] lg:h-full lg:order-2 border-b lg:border-b-0 lg:border-l border-white/10 shadow-[-20px_0_50px_-20px_rgba(0,0,0,0.5)] z-10">
        <TrackCanvas />
      </section>

      {/* Sidebar: Paddock & Pit Lane (Mobile bottom, Desktop left) */}
      <aside className="w-full lg:w-[28rem] xl:w-[32rem] h-[50vh] lg:h-full flex flex-col bg-slate-900/80 backdrop-blur-2xl lg:order-1 z-20 shadow-2xl relative">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-800/20 to-transparent pointer-events-none" />

        {/* Interactive Header & Start Race Button */}
        <RaceControls />

        {/* Paddock Area */}
        <div className="flex-1 overflow-y-auto px-5 py-6 custom-scrollbar relative z-10 hide-scrollbar-mobile">
          <Paddock />
        </div>
      </aside>

    </main>
  );
}
