export const classListColumns = [
  {
    header: "Info",
    accessor: "info",
  },
  {
    header: "Type",
    accessor: "type",
    className: "hidden sm:table-cell",
  },

  {
    header: "Sections",
    accessor: "sections",
    className: "hidden sm:table-cell",
  },

  {
    header: "Courses",
    accessor: "courses",
    className: "hidden sm:table-cell",
  },
  {
    header: "Action",
    accessor: "action",
  },
];


export const RoomTableColumns = [
  {
    header: "Room Number",
    accessor: "room_number",
  },
  {
    header: "Floor",
    accessor: "floor",
  },
  {
    header: "Building",
    accessor: "building",
  },

  {
    header: "Capacity",
    accessor: "capacity",
  },
];


export const StudentTableListColumn = [
  {
    header: "Name",
    accessor: "info",
  },

  {
    header: "Section",
    accessor: "section",
    className: "hidden md:table-cell",
  },

  {
    header: "Phone",
    accessor: "phone",
    className: "hidden lg:table-cell",
  },
  {
    header: "Address",
    accessor: "address",
    className: "hidden xl:table-cell",
  },
  {
    header: "Last Login",
    accessor: "last_login",
    className: "hidden xl:table-cell",
  },

  {
    header: "Action",
    accessor: "action",
  },
];

export const SectionStudentTableColumns = [
  {
    header: "ID",
    accessor: "id",
  },
  {
    header: "Name",
    accessor: "name",
    className: "",
  },
  {
    header: "Attedance",
    accessor: "attendance",
  },
];
