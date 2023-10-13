export const timeParses = time => {
  const date = time.split(' ')[0].split('-'); //2023-10-5 12:30 => [2023, 10, 5]
  const year = Number(date[0]);
  const month = Number(date[1]);
  const day = Number(date[2]);

  return { year, month, day };
};