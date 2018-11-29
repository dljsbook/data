const getAtStep = (step: number, num: number, start: number, end: number) => start + ((end - start) * step / (num - 1));

export default getAtStep;
