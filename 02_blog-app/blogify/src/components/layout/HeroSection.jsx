import { FiPlus, FiTrendingUp } from "react-icons/fi";

function HeroSection({ postsCount, writersCount, myPostsCount, onCompose, onExplore }) {
  return (
    <section className="mt-5 overflow-hidden rounded-[2rem] bg-gradient-to-br from-violet-700 via-fuchsia-600 to-indigo-700 px-5 py-6 text-white shadow-2xl shadow-violet-200 md:px-8">
      <div className="grid gap-6 md:grid-cols-[1.15fr_0.85fr] md:items-center">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.24em] text-violet-100">
            Social blogging space
          </p>
          <h1 className="mt-3 max-w-2xl text-4xl font-black leading-tight md:text-6xl">
            Blogify
          </h1>
          <p className="mt-4 max-w-xl text-base leading-7 text-violet-50 md:text-lg">
            Read fresh stories, follow writers, publish your ideas, and keep the
            conversation moving in one clean community feed.
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={onCompose}
              className="inline-flex items-center gap-2 rounded-full bg-white px-5 py-3 text-sm font-bold text-violet-700 shadow-lg shadow-violet-950/20 transition hover:-translate-y-0.5"
            >
              <FiPlus /> Write blog
            </button>
            <button
              onClick={onExplore}
              className="inline-flex items-center gap-2 rounded-full border border-white/30 px-5 py-3 text-sm font-bold text-white backdrop-blur transition hover:bg-white/15"
            >
              <FiTrendingUp /> Explore tech
            </button>
          </div>
        </div>
        <div className="grid gap-3 sm:grid-cols-3 md:grid-cols-1">
          <HeroStat label="Posts" value={postsCount} />
          <HeroStat label="Writers" value={writersCount} />
          <HeroStat label="My posts" value={myPostsCount} muted="Published work" />
        </div>
      </div>
    </section>
  );
}

function HeroStat({ label, value, muted }) {
  return (
    <div className="rounded-3xl border border-white/20 bg-white/15 p-4 backdrop-blur">
      <p className="text-3xl font-black">{value}</p>
      <p className="mt-1 text-sm font-semibold text-violet-100">{label}</p>
      {muted && <p className="mt-2 text-xs text-violet-100/80">{muted}</p>}
    </div>
  );
}

export default HeroSection;
