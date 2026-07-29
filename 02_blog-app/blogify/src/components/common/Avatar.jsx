import React from "react";

export function avatarText(name = "B") {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}

export function Avatar({ user, size = "md" }) {
  const sizes = {
    sm: "h-8 w-8 text-[10px] rounded-xl",
    md: "h-11 w-11 text-xs rounded-2xl",
    lg: "h-16 w-16 text-lg rounded-3xl",
  };

  if (user?.profileImage) {
    return (
      <img
        src={user.profileImage}
        alt={user.username || "User"}
        className={`${sizes[size]} shrink-0 object-cover border border-white/10`}
      />
    );
  }

  return (
    <div
      className={`${sizes[size]} grid shrink-0 place-items-center bg-gradient-to-br from-violet-600 via-fuchsia-500 to-indigo-600 font-black text-white shadow-inner`}
    >
      {avatarText(user?.username || user?.name || user?.email)}
    </div>
  );
}

export default Avatar;
