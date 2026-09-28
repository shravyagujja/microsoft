export const getDaysActive = (createdAt: Date): number => {
  const diffTime = Math.abs(new Date().getTime() - createdAt.getTime());
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
};
