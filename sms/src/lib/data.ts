export const role = "admin";
export const NO_AVATAR_URL = "/image/noavatar.png";
export const SCHOOL_LOGO = "/image/school-logo.png";
export const ITEM_PAR_PAGE = 10;
export const SITE_NAME = "Arafims Hostel Management System";
export const SITE_URL = "http://localhost:3000";
export const SITE_TITLE = "Arafims Hostel Network Management System";
export const SITE_DESCRIPTION = "Arafims Hostel Management System";
export const SITE_IMAGE = "/image/logo.png";
export const SITE_AUTHOR = "Arafims Hostel Network Management System";
export const SITE_TWITTER = "@ahn";
export const SITE_FACEBOOK = "ahn";
export const SITE_INSTAGRAM = "ahn";
export const SITE_YOUTUBE = "ahn";
export const SITE_PHONE = "123456789";
export const SITE_EMAIL = "ahn@arafims.com";
export const SITE_ADDRESS = "Ilorin, Nigeria";
export const SITE_FAX = "123456789";
export const SITE_COPYRIGHT = "Arafims Hostel Network Management System";
export const SITE_POWERED_BY = "Arafims Hostel Network Management System";
export const SCHOOL_NAME = "Arafims Hostel Network Management System";
export const SCHOOL_CODE = "123456";
export const SCHOOL_EIIN = "EN23456";
export const SCHOOL_MESSAGE = "Central platform for Managing Arafims Hostels";
export const GENEREL_SESSION =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJJRCI6IjEyMzQ1Njc4OTAiLCJuYW1lIjoiVXNlciIsImlhdCI6MTUxNjIzOTAyMn0.q2-bjp-bIbC1KcsegBorKoJvi6BU7tJOGfaLqLVIeT0";
export const SCHOOL_INTRO = `Arafims Hostel Network Management System is a comprehensive platform designed to streamline the management of hostels within the Arafims educational institutions. 
Our system offers a range of features to efficiently handle hostel operations, including student accommodation, fee management, maintenance requests, and communication between hostel staff and residents. 
With a user-friendly interface and robust functionality, Arafims Hostel Network Management System aims to enhance the overall experience for both hostel administrators and students, ensuring a safe and comfortable living environment.
`;
export const SCHOOL_SHORTNAME = "AHNMS";
export const MonthNames = [
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
];

export const Times = [
  {
    time: "10:00-11:00",
  },
  {
    time: "11:00-12:00",
  },
  {
    time: "12:00-1:00",
  },
  {
    time: "2:00-3:00",
  },
  {
    time: "3:00-4:00",
  },
];

export const ScheduleHours = [
  {
    hour: 1,
    name: "1st Hour",
  },
  {
    hour: 2,
    name: "2nd Hour",
  },
  {
    hour: 3,
    name: "3rd Hour",
  },
  {
    hour: 4,
    name: "4th Hour",
  },
  {
    hour: 5,
    name: "5th Hour",
  },
];

export const DaysOfWeek = [
  "Saturday",
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
];

export const MenuItems = [
  {
    title: "MENU",
    items: [
      {
        icon: "LayoutDashboard",
        label: "Dashboard",
        href: "/dashboard",
        visiable: ["ADMIN"],
      },

      {
        icon: "User",
        label: "Profile",
        href: "/profile",
        visiable: ["TEACHER", "STUDENT"],
      },


      {
        icon: "Bell",
        label: "Notices",
        href: "/dashboard/notices",
        visiable: ["ADMIN"],
      },
      {
        icon: "Building",
        label: "Building",
        href: "/dashboard/buildings",
        visiable: ["ADMIN"],
      },
      {
        icon: "Settings",
        label: "Block Config",
        href: "/dashboard/block-config",
        visiable: ["ADMIN"],
      },
      {
        icon: "LayoutGrid",
        label: "Block View",
        href: "/dashboard/block",
        visiable: ["ADMIN"],
      },
      {
        icon: "Users",
        label: "Staff",
        href: "/dashboard/staff",
        visiable: ["ADMIN"],
      },
      {
        icon: "GraduationCap",
        label: "Students",
        href: "/dashboard/students",
        visiable: ["ADMIN"],
      },
    ],
  },
];

export const Infrastructures = [
  {
    title: "Academic",
    items: [
      {
        content:
          "1×2 storied Main building (Classrooms 14, Teachers room 03 & Others 21, Total-38)",
      },
      {
        content:
          "1×4 storied Hons building -01 (Classrooms 11, Teachers room 02 & Others 08, Total-21)",
      },
      {
        content:
          "1×6 storied College building (Classrooms 29, Teachers room 13 & Others 11, Total-53)",
      },
      {
        content:
          "1×5 storied School building (Classrooms 29, Teachers room 04 & Others 12, Total-45)",
      },
      {
        content:
          "1×1 storied Nursery building (Classrooms 06, Teachers room 00 & Others 04, Total-10)",
      },
    ],
  },
  {
    title: "Residential",
    items: [
      {
        content: "1×2 Storied Principal’s Quarter (Duplex)",
      },
      {
        content: "1×1 Storied Teachers’ Quarter (2 Flats)",
      },
      {
        content: "1×2 Storied Teachers’ Quarter (4 Flats)",
      },
    ],
  },
];

export const GradeValues = {
  "A+": 5.0,
  A: 4.0,
  "A-": 3.5,
  B: 3.0,
  C: 2.5,
  D: 1.0,
  F: 0.0,
};
