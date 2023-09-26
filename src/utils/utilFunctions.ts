export const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));
export const getWindowRatio = (): number => {
  return window.innerWidth / window.innerHeight;
};
