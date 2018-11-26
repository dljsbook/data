const getRandom = (min: number, max?: number) => {
  if (max === undefined) {
    max = min;
    min = 0;
  }
  return min + (Math.random() * (max - min));
}

export default getRandom;
