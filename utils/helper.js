export const timeParser = time => {
  const date = time.split(' ')[0].split('-'); //2023-10-5 12:30 => [2023, 10, 5]
  const year = Number(date[0]);
  const month = Number(date[1]);
  const day = Number(date[2]);

  return { year, month, day };
};

export const formatDate = (start, end) => {
  const startDate = new Date(start);
  const endDate = new Date(end);

  const day = startDate.getDate();
  const month = startDate.getMonth() + 1;
  const year = startDate.getFullYear();
  const startHours = String(startDate.getUTCHours()).padStart(2, '0');
  const startMinutes = String(startDate.getUTCMinutes()).padStart(2, '0');

  const endHours = String(endDate.getUTCHours()).padStart(2, '0');
  const endMinutes = String(endDate.getUTCMinutes()).padStart(2, '0');

  //Reservation's date and time i.e [7.10.2023, 12:00 - 13:00]
  return [`${day}.${month}.${year}`, `${startHours}:${startMinutes} - ${endHours}:${endMinutes}`] 
}