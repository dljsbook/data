const parseCsv = (csv: string) => {
  const lines = csv.split('\r\n').filter(line => line);
  if (!lines[0]) {
    throw new Error('No header row or any lines');
  }

  const header = lines[0].split(',');

  return lines.slice(1).map(line => line.split(',')).map(line => {
    return header.reduce((obj, key, index) => {
      const value = line[index];
      return {
        ...obj,
        [key]: Number(value) !== undefined ? Number(value) : value,
      };
    }, {});
  });
};

export default parseCsv;
