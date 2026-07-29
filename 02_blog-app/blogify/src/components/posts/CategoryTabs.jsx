import React from "react";

export function CategoryTabs({ activeCategory, setActiveCategory, categories }) {
  return (
    <div className="mt-5 flex gap-2 overflow-x-auto pb-2 scrollbar-none">
      {categories.map((category) => (
        <button
          key={category}
          onClick={() => setActiveCategory(category)}
          className={`shrink-0 rounded-full px-5 py-2 text-xs font-black transition-all ${
            activeCategory === category
              ? "glow-btn text-white"
              : "bg-white/5 border border-white/5 text-violet-200/80 hover:bg-white/10 hover:text-white"
          }`}
        >
          {category}
        </button>
      ))}
    </div>
  );
}

export default CategoryTabs;
