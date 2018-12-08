const getRandomIndex = (arr: any[] = []) => Math.floor(Math.random() * (arr.length - 1));
const rand = (arr: any[] = []) => arr[getRandomIndex(arr)];
export default rand;
