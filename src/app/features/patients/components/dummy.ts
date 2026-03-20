import { Patient } from "../interfaces/patient.interface";
import { Appointment } from "../interfaces/appointment.interface";
import { AppointmentPurpose } from "../enums/appointment-purpose.enum";
import { AppointmentStatus } from "../enums/appointment-status.enum";

export const patientList: Patient[] = [
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

export const appointments: Appointment[] = [
  {
    visitTime: new Date(new Date().setHours(9, 0, 0)),
    patientFirstName: 'Олена',
    patientLastName: 'Коваленко',
    status: AppointmentStatus.Completed,
    purpose: AppointmentPurpose.FirstVisit
  },
  {
    visitTime: new Date(new Date().setHours(10, 30, 0)),
    patientFirstName: 'Іван',
    patientLastName: 'Петренко',
    patientMiddleName: 'Миколайович',
    status: AppointmentStatus.Arrived,
    purpose: AppointmentPurpose.Sample
  },
  {
    visitTime: new Date(new Date().setHours(12, 0, 0)),
    patientFirstName: 'Марія',
    patientLastName: 'Сидоренко',
    status: AppointmentStatus.Pending,
    purpose: AppointmentPurpose.Results
  },
  {
    visitTime: new Date(new Date().setHours(14, 15, 0)),
    patientFirstName: 'Олександр',
    patientLastName: 'Ткаченко',
    patientMiddleName: 'Васильович',
    status: AppointmentStatus.Arrived,
    purpose: AppointmentPurpose.FirstVisit
  },
  {
    visitTime: new Date(new Date().setHours(19, 45, 0)),
    patientFirstName: 'Анна',
    patientLastName: 'Мороз',
    status: AppointmentStatus.Cancelled,
    purpose: AppointmentPurpose.Sample
  }
];