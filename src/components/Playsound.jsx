import React from 'react'

export const playSound = (file = "/sounds/ordersound.mp3") => {
  const audio = new Audio(file);
  audio.volume = 1.0;
  audio.play().catch(() => {});
};
