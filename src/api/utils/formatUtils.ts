export const formatDuration = (trackTimeMillis: number): string => {
  const minutes = Math.floor(trackTimeMillis / 60000);
  const seconds = Math.floor((trackTimeMillis % 60000) / 1000);
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};
