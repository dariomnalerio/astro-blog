export function FormatDate(date: Date,) {

const monthNames = [
  "January", "February", "March", "April",
  "May", "June", "July", "August",
  "September", "October", "November", "December"
];

// Get the day, month, and year components from the Date object
const day = date.getDate();
const monthIndex = date.getMonth();
const year = date.getFullYear();

// Format the date as "day Month year"
const formattedDate = `${day} ${monthNames[monthIndex]} ${year}`;

return formattedDate;

}