import {
  PrismaClient,
  Type,
  UserRole,
  GENDER,
  UserStatus,
} from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Start seeding ...');

  // Clean up database. Order is important to respect foreign key constraints.
  // await prisma.student.deleteMany({});
  // await prisma.user.deleteMany({});

  // console.log('Deleted existing data.');

  // Create Admin User
  // Use a strong password for admin (change as needed)
  const adminPlainPassword = Math.random().toString(36).slice(-8) + Math.random().toString(36).slice(-8);
  const adminPassword = await bcrypt.hash(adminPlainPassword, 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@arafims.com' },
    update: {},
    create: {
      email: 'admin@arafims.com',
      password: adminPassword,
      role: UserRole.ADMIN,
      sex: GENDER.MALE,
      status: UserStatus.ACTIVE,
      phone: '0000000000',
      address: 'Admin Address',
    },
  });
  console.log('Created admin user:', admin);
  console.log('-----------------------------------');
  console.log(`Admin Email: admin@arafims.com`);
  console.log(`Admin Password: ${adminPlainPassword}`);
  console.log('-----------------------------------');

  // Create Student User with Student Profile
  const studentPassword = await bcrypt.hash('student123', 10);
  const studentUser = await prisma.user.upsert({
    where: { email: 'student@arafims.com' },
    update: {},
    create: {
      email: 'student@arafims.com',
      password: studentPassword,
      role: UserRole.STUDENT,
      sex: GENDER.MALE,
      status: UserStatus.ACTIVE,
      phone: '2222222222',
      address: 'Student Address',
      studentProfile: {
        create: {
          matricNumber: 'S3001',
          first_name: 'John',
          last_name: 'Smith',
          dob: new Date('2010-01-01'),
          type: Type.RESIDENT,
        },
      },
    },
  });
  console.log('Created student user:', studentUser);

  console.log('Seeding finished.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
