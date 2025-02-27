export const formatDuration = (trackTimeMillis: number): string => {
  const hours = Math.floor(trackTimeMillis / 3600000);
  const minutes = Math.floor((trackTimeMillis % 3600000) / 60000);
  const seconds = Math.floor((trackTimeMillis % 60000) / 1000);

  if (hours > 0) {
    return `${hours} hr ${minutes} min`;
  }

  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};
