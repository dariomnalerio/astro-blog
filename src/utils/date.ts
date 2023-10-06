interface MonthNames {
  en: string[];
  es: string[];
}

export function FormatDate(date: Date, lang: "en" | "es") {

  const monthNames: MonthNames = {
    en: [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ],
    es: [
      "Enero",
      "Febrero",
      "Marzo",
      "Abril",
      "Mayo",
      "Junio",
      "Julio",
      "Agosto",
      "Septiembre",
      "Octubre",
      "Noviembre",
      "Diciembre",
    ],
  };

// Get the day, month, and year components from the Date object
const day = date.getDate();
const monthIndex = date.getMonth();
const year = date.getFullYear();

// Format the date as "day Month year"
let formattedDate = "";
if (lang === "en") {
  formattedDate = `${day} ${monthNames.en[monthIndex]}, ${year}`;
} if (lang === "es") {
   formattedDate = `${day} de ${monthNames.es[monthIndex]}, ${year}`;
}
return formattedDate;

}