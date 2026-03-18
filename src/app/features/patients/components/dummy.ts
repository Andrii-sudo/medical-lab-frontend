import { PatientListItem } from "../interfaces/patient-list-item";

export const patientList: PatientListItem[] = [
  {
    firstName: "Тетяна",
    lastName: "Шевченко",
    middleName: "Михайлівна",
    birthDate: new Date(1998, 6, 29), // Місяці в JS починаються з 0 (6 = липень)
    phone: "+38 050 987 65 43",
    email: "t.shevchenko@gmail.com"
  },
  {
    firstName: "Василь",
    lastName: "Мельник",
    birthDate: new Date(1972, 10, 4), // 10 = листопад
    email: "v.melnyk@gmail.com"
  },
  {
    firstName: "Олена",
    lastName: "Коваленко",
    middleName: "Іванівна",
    birthDate: new Date(1985, 2, 12), // 2 = березень
    phone: "+38 067 123 45 67"
  },
  {
    firstName: "Андрій",
    lastName: "Бойко",
    middleName: "Сергійович",
    birthDate: new Date(1960, 1, 17), // 1 = лютий
    phone: "+38 063 456 78 90"
  }
];