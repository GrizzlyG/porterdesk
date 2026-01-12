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

    // Create Production Admin User
    const admin1PlainPassword = Array(4).fill(0).map(() => Math.random().toString(36).slice(-8)).join('');
    const admin1Password = await bcrypt.hash(admin1PlainPassword, 12);
    const admin1 = await prisma.user.upsert({
      where: { email: 'admin1@arafims.com' },
      update: {},
      create: {
        email: 'admin1@arafims.com',
        password: admin1Password,
        role: UserRole.ADMIN,
        sex: GENDER.MALE,
        status: UserStatus.ACTIVE,
        phone: '0000000001',
        address: 'Production Admin',
      },
    });
    console.log('Created production admin user:', admin1);
    console.log('-----------------------------------');
    console.log(`Admin Email: admin1@arafims.com`);
    console.log(`Admin Password: ${admin1PlainPassword}`);
    console.log('-----------------------------------');


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
