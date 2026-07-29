import React, { useState } from "react";
import { FiImage, FiSend } from "react-icons/fi";
import ModalShell from "./ModalShell";

export function ComposerModal({ post, onClose, onSave, categories }) {
  const [form, setForm] = useState({
    title: post?.title || "",
    category: post?.category || "Personal",
    content: post?.content || "",
    coverImage: post?.coverImage || null,
  });
  const [previewUrl, setPreviewUrl] = useState(post?.coverImage || "");

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }));
  }

  function handleFileChange(event) {
    const file = event.target.files?.[0];
    if (file) {
      update("coverImage", file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  }

  function submit(event) {
    event.preventDefault();
    if (!form.title.trim() || !form.content.trim()) return;
    onSave({
      title: form.title.trim(),
      category: form.category,
      content: form.content.trim(),
      coverImage: form.coverImage,
    });
  }

  return (
    <ModalShell onClose={onClose} title={post ? "Edit Blog Post" : "Write a New Blog"}>
      <form onSubmit={submit} className="grid gap-4">
        {/* Cover Image Upload Area */}
        <div className="relative">
          {previewUrl ? (
            <div className="relative overflow-hidden rounded-2xl border border-white/10 aspect-video max-h-48 bg-slate-950/40">
              <img
                src={previewUrl}
                alt="Cover Preview"
                className="w-full h-full object-cover hover:scale-[1.02] transition duration-300"
              />
              <button
                type="button"
                onClick={() => {
                  update("coverImage", null);
                  setPreviewUrl("");
                }}
                className="absolute top-3 right-3 rounded-full bg-slate-950/80 backdrop-blur border border-white/10 px-3 py-1.5 text-[10px] font-black text-rose-300 hover:bg-rose-500 hover:text-white transition"
              >
                Remove
              </button>
            </div>
          ) : (
            <label className="flex flex-col items-center justify-center border border-dashed border-white/20 hover:border-violet-500/40 bg-white/5 hover:bg-violet-500/5 rounded-2xl p-6 cursor-pointer transition text-center min-h-[120px]">
              <FiImage className="text-violet-400 text-2xl mb-2 transition duration-300" />
              <span className="text-xs font-bold text-violet-200">
                Choose a beautiful cover photo
              </span>
              <span className="text-[10px] text-violet-300/40 mt-1 font-semibold">
                Supports JPG, PNG, GIF up to 5MB
              </span>
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleFileChange}
              />
            </label>
          )}
        </div>

        <input
          value={form.title}
          onChange={(event) => update("title", event.target.value)}
          placeholder="Enter a catchy title..."
          className="rounded-2xl glass-input px-4 py-3 text-sm font-black text-white"
        />
        <select
          value={form.category}
          onChange={(event) => update("category", event.target.value)}
          className="rounded-2xl glass-input px-4 py-3 text-xs font-bold text-white bg-slate-900"
        >
          {categories
            .filter((category) => category !== "All")
            .map((category) => (
              <option key={category} className="bg-slate-950 text-white">{category}</option>
            ))}
        </select>
        <textarea
          value={form.content}
          onChange={(event) => update("content", event.target.value)}
          placeholder="Tell the community what is on your mind..."
          rows="8"
          className="resize-none rounded-2xl glass-input px-4 py-3 text-xs font-semibold leading-relaxed"
        />
        <div className="flex flex-wrap items-center justify-end gap-3 mt-2">
          <button className="glow-btn inline-flex items-center gap-2 rounded-2xl px-5 py-2.5 text-xs font-bold text-white shadow-lg">
            <FiSend /> {post ? "Update Blog" : "Publish Blog"}
          </button>
        </div>
      </form>
    </ModalShell>
  );
}

export default ComposerModal;
