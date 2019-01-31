import 'ts-jest';
import * as fs from 'fs';
import parseCsv from './parseCsv';

const fixture = fs.readFileSync('./test/fixtures/test.csv', 'utf8');

test('that it parses a csv', () => {
  expect(parseCsv(fixture)).toEqual([{
    "ID": 3,
    "age": 61.1,
    "chas": 0,
    "crim": 0.02729,
    "dis": 4.9671,
    "indus": 7.07,
    "lstat": 4.03,
    "medv": 34.7,
    "nox": 0.469,
    "ptratio": 17.8,
    "rad": 2,
    "rm": 7.185,
    "tax": 242,
    "zn": 0
  }, {
    "ID": 6,
    "age": 58.7,
    "chas": 0,
    "crim": 0.02985,
    "dis": 6.0622,
    "indus": 2.18,
    "lstat": 5.21,
    "medv": 28.7,
    "nox": 0.458,
    "ptratio": 18.7,
    "rad": 3,
    "rm": 6.43,
    "tax": 222,
    "zn": 0
  }, {
    "ID": 8,
    "age": 96.1,
    "chas": 0,
    "crim": 0.14455,
    "dis": 5.9505,
    "indus": 7.87,
    "lstat": 19.15,
    "medv": 27.1,
    "nox": 0.524,
    "ptratio": 15.2,
    "rad": 5,
    "rm": 6.172,
    "tax": 311,
    "zn": 12.5
  }]);
});
