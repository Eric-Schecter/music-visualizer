export const getfft = (target: number) => {
  let n = 0;
  while (n < target) {
    const left = 2 ** n;
    const right = 2 ** (n + 1);
    if (left <= target && right >= target) {
      return right * 2;
    }
    n++;
  }
  return n * 2;
}