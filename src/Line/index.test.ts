import 'ts-jest';
import line from './index';

test('that line generates 4 datapoints', () => {
  expect(line()).toEqual([
    [0, 0],
    [1, 2],
    [2, 4],
    [3, 6],
  ]);
});

test('that line can start at an arbitrary point', () => {
  expect(line({ start: -3 })).toEqual([
    [-3, -6],
    [-1, -2],
    [1, 2],
    [3, 6],
  ]);
});

test('that line can end at an arbitrary point', () => {
  expect(line({ start: -3, end: 6 })).toEqual([
    [-3, -6],
    [0, 0],
    [3, 6],
    [6, 12],
  ]);
});

test('that line can end at an arbitrary point', () => {
  expect(line({ start: -3, end: 6 })).toEqual([
    [-3, -6],
    [0, 0],
    [3, 6],
    [6, 12],
  ]);
});

test('that line can have an arbitrary number of steps', () => {
  expect(line({ start: 0, end: 3, steps: 7 })).toEqual([
    [0, 0],
    [0.5, 1],
    [1, 2],
    [1.5, 3],
    [2, 4],
    [2.5, 5],
    [3, 6],
  ]);
});

test('that line can accept an intercept', () => {
  expect(line({ intercept: 1 })).toEqual([
    [0, 1],
    [1, 3],
    [2, 5],
    [3, 7],
  ]);
});

test('that line can accept a slope', () => {
  expect(line({ slope: 3 })).toEqual([
    [0, 0],
    [1, 3],
    [2, 6],
    [3, 9],
  ]);
});
