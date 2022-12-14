import { PrismaClient } from "@prisma/client";
import { nanoid } from "nanoid";

const drugsData = [
  {
    name: "Amoxicillin (Amoxil)",
    image: "https://www.drugs.com/images/pills/nlm/167140299.jpg",
    barcode: nanoid(),
  },
  {
    name: "Vitamin D (Drisdol)",
    image:
      "https://img.medscapestatic.com/pi/features/drugdirectory/octupdate/PAD01940.jpg?output-quality=50",
    barcode: nanoid(),
  },
  {
    name: "Ibuprofen (Motrin)",
    image: "https://www.drugs.com/images/pills/fio/MCN07701.JPG",
    barcode: nanoid(),
  },
  {
    name: "Levothyroxine (Synthroid)",
    image:
      "https://images.everydayhealth.com/drugs/multum/675440883_PB.jpg?output-quality=50",
    barcode: nanoid(),
  },
  {
    name: "Lisinopril (Prinivil, Zestril)",
    image:
      "https://www.grxstatic.com/d4fuqqd5l3dbz/products/DrugItem_18628.JPG?format=JPG&auto=webp",
    barcode: nanoid(),
  },
  {
    name: "Amlodipine (Norvasc)",
    image:
      "https://www.grxstatic.com/d4fuqqd5l3dbz/products/DrugItem_23090.JPG",
    barcode: nanoid(),
  },
  {
    name: "Prednisone (Deltasone)",
    image:
      "https://www.rxwiki.com/sites/files/styles/pill_image/public/images/pillbox/000090032.jpg",
    barcode: nanoid(),
  },
  {
    name: "Amphetamine/dextroamphetamine (Adderall, Adderall XR)",
    image:
      "https://img.medscapestatic.com/pi/features/drugdirectory/octupdate/SHR03911.jpg?output-quality=50",
    barcode: nanoid(),
  },
  {
    name: "Albuterol sulfate HFA (Ventolin HFA, Proair HFA, Proventil HFA)",
    image:
      "https://img.medscapestatic.com/pi/features/drugdirectory/octupdate/TEV05790.jpg",
    barcode: nanoid(),
  },
  {
    name: "Alprazolam (Xanax)",
    image: "https://medworksmedia.com/wp-content/uploads/2018/08/Xanax.jpg",
    barcode: nanoid(),
  },
  {
    name: "Cyclobenzaprine (Flexeril)",
    image:
      "https://img.medscapestatic.com/pi/features/drugdirectory/octupdate/CBR02830.jpg?output-quality=50",
    barcode: nanoid(),
  },
  {
    name: "Azithromycin (Zithromax Z-Pak)",
    image:
      "https://img.medscapestatic.com/pi/features/drugdirectory/octupdate/PFZ30600.jpg",
    barcode: nanoid(),
  },
  {
    name: "Gabapentin (Neurontin)",
    image:
      "https://www.grxstatic.com/d4fuqqd5l3dbz/products/DrugItem_29163.JPG",
    barcode: nanoid(),
  },
  {
    name: "Cephalexin (Keflex)",
    image:
      "https://img.medscapestatic.com/pi/features/drugdirectory/octupdate/ASC02190.jpg?output-quality=50",
    barcode: nanoid(),
  },
  {
    name: "Cetirizine (Zyrtec)",
    image:
      "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ1EDch_VJr1l_jMYflXbQCmTjgIoqR-n2J_w&usqp=CAU",
    barcode: nanoid(),
  },
  {
    name: "Folic acid",
    image:
      "https://img.medscapestatic.com/pi/features/drugdirectory/octupdate/AMN03610.jpg?output-quality=50",
    barcode: nanoid(),
  },
  {
    name: "Hydrochlorothiazide (Microzide)",
    image:
      "https://img.medscapestatic.com/pi/features/drugdirectory/octupdate/WTS07400.jpg?output-quality=50",
    barcode: nanoid(),
  },
  {
    name: "Metformin (Glucophage)",
    image:
      "https://img.medscapestatic.com/pi/features/drugdirectory/octupdate/ASD05620.jpg?output-quality=50",
    barcode: nanoid(),
  },
  {
    name: "Atorvastatin (Lipitor)",
    image:
      "https://img.medscapestatic.com/pi/features/drugdirectory/octupdate/PD01550.jpg?output-quality=50",
    barcode: nanoid(),
  },
  {
    name: "Amoxicillin/clavulanate (Augmentin)",
    image:
      "https://img.medscapestatic.com/pi/features/drugdirectory/octupdate/NPI00121.jpg?output-quality=50",
    barcode: nanoid(),
  },
];

const prisma = new PrismaClient();

async function main() {
  const admin = await prisma.user.upsert({
    where: { email: "admin@healthsake.io" },
    update: {},
    create: {
      email: "admin@healthsake.io",
      name: "Admin",
      password: "adminpass",
      type: "ADMIN",
      userVerified: true,
      status: "APPROVED",
    },
  });

  const drugs = async () => {
    for (const drug of drugsData) {
      await prisma.medicinesAvailable.create({
        data: drug,
      });
    }
  };

  // Amoxicillin (Amoxil) https://www.drugs.com/images/pills/nlm/167140299.jpg
  // Vitamin D (Drisdol) https://img.medscapestatic.com/pi/features/drugdirectory/octupdate/PAD01940.jpg?output-quality=50
  // Ibuprofen (Motrin) https://www.drugs.com/images/pills/fio/MCN07701.JPG
  // Levothyroxine (Synthroid) https://images.everydayhealth.com/drugs/multum/675440883_PB.jpg
  // Lisinopril (Prinivil, Zestril) https://www.grxstatic.com/d4fuqqd5l3dbz/products/DrugItem_18628.JPG?format=JPG&auto=webp
  // Amlodipine (Norvasc) https://www.grxstatic.com/d4fuqqd5l3dbz/products/DrugItem_23090.JPG
  // Prednisone (Deltasone) https://www.rxwiki.com/sites/files/styles/pill_image/public/images/pillbox/000090032.jpg
  // Amphetamine/dextroamphetamine (Adderall, Adderall XR) https://img.medscapestatic.com/pi/features/drugdirectory/octupdate/SHR03911.jpg?output-quality=50
  // Albuterol sulfate HFA (Ventolin HFA, Proair HFA, Proventil HFA) https://img.medscapestatic.com/pi/features/drugdirectory/octupdate/TEV05790.jpg
  // Alprazolam (Xanax) https://medworksmedia.com/wp-content/uploads/2018/08/Xanax.jpg
  // Cyclobenzaprine (Flexeril) https://img.medscapestatic.com/pi/features/drugdirectory/octupdate/CBR02830.jpg?output-quality=50
  // Azithromycin (Zithromax Z-Pak) https://img.medscapestatic.com/pi/features/drugdirectory/octupdate/PFZ30600.jpg
  // Gabapentin (Neurontin) https://www.grxstatic.com/d4fuqqd5l3dbz/products/DrugItem_29163.JPG
  // Cephalexin (Keflex) https://img.medscapestatic.com/pi/features/drugdirectory/octupdate/ASC02190.jpg?output-quality=50
  // Cetirizine (Zyrtec) https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQ1EDch_VJr1l_jMYflXbQCmTjgIoqR-n2J_w&usqp=CAU
  // Folic acid https://img.medscapestatic.com/pi/features/drugdirectory/octupdate/AMN03610.jpg?output-quality=50
  // Hydrochlorothiazide (Microzide) https://img.medscapestatic.com/pi/features/drugdirectory/octupdate/WTS07400.jpg?output-quality=50
  // Metformin (Glucophage) https://img.medscapestatic.com/pi/features/drugdirectory/octupdate/ASD05620.jpg?output-quality=50
  // Atorvastatin (Lipitor) https://img.medscapestatic.com/pi/features/drugdirectory/octupdate/PD01550.jpg?output-quality=50
  // Amoxicillin/clavulanate (Augmentin) https://img.medscapestatic.com/pi/features/drugdirectory/octupdate/NPI00121.jpg?output-quality=50

  // const healthWorkerInd = await prisma.individual.upsert({
  //     where: {id: '1'},
  //     update: {},
  //     create: {
  //         image: 'https://picsum.photos/200',
  //         identity: 'https://www.africau.edu/images/default/sample.pdf',
  //         address: 'https://www.africau.edu/images/default/sample.pdf',
  //         healthLicense: 'https://www.africau.edu/images/default/sample.pdf',
  //         role: 'HEALTHCARE',
  //     },
  // })

  // const healthWorker = await prisma.user.upsert({
  //     where: {email: 'healthWorkerfake1@bnail.com'},
  //     update: {},
  //     create: {
  //         email: 'healthWorkerfake1@bnail.com',
  //         name: 'Fake 1',
  //         password: 'healthWorkerfake1',
  //         type: 'INDIVIDUAL',
  //         userVerified: true,
  //         status: 'APPROVED',
  //         indID: healthWorkerInd.id,
  //     },
  // })

  // const healthWorkerOrg2 = await prisma.organisation.upsert({
  //     where: {id: '2'},
  //     update: {},
  //     create: {
  //         description: 'This is a fake organisation',
  //         image1: 'https://picsum.photos/200',
  //         image2: 'https://picsum.photos/200',
  //         license: 'https://www.africau.edu/images/default/sample.pdf',
  //         permit: 'https://www.africau.edu/images/default/sample.pdf',
  //         location: 'https://www.africau.edu/images/default/sample.pdf',
  //         phone: '9898989898',
  //         role: "HOSPITAL",
  //     },
  // })

  // const healthWorker2 = await prisma.user.upsert({
  //     where: {email: "gfallowfield0@ow.ly"},
  //     update: {},
  //     create: {
  //         email: "gfallowfield0@ow.ly",
  //         name: "Gradey Fallowfield",
  //         password: "6JW7NVWaIB",
  //         type: "ORGANIZATION",
  //         userVerified: true,
  //         status: "APPROVED",
  //         orgId: healthWorkerOrg2.id,
  //     },
  // })

  // const healthWorkerOrg3 = await prisma.organisation.upsert({
  //     where: {id: '3'},
  //     update: {},
  //     create: {
  //         description: 'This is a fake organisation',
  //         image1: 'https://picsum.photos/200',
  //         image2: 'https://picsum.photos/200',
  //         license: 'https://www.africau.edu/images/default/sample.pdf',
  //         permit: 'https://www.africau.edu/images/default/sample.pdf',
  //         location: 'https://www.africau.edu/images/default/sample.pdf',
  //         phone: '9898989898',
  //         role: "INSURANCE",
  //     },
  // })

  // const healthWorkerOrg4 = await prisma.organisation.upsert({
  //     where: {id: '4'},
  //     update: {},
  //     create: {
  //         description: 'This is a fake organisation',
  //         image1: 'https://picsum.photos/200',
  //         image2: 'https://picsum.photos/200',
  //         license: 'https://www.africau.edu/images/default/sample.pdf',
  //         permit: 'https://www.africau.edu/images/default/sample.pdf',
  //         location: 'https://www.africau.edu/images/default/sample.pdf',
  //         phone: '9898989898',
  //         role: "PHARMACY",
  //     },
  // })

  // const healthWorker3 = await prisma.user.upsert({
  //     where: {email: "abrehat1@mediafire.com"},
  //     update: {},
  //     create: {
  //         email: "abrehat1@mediafire.com",
  //         name: "Axel Brehat",
  //         password: "tZBB32e",
  //         type: "ORGANIZATION",
  //         userVerified: false,
  //         status: "CREATED",
  //         orgId: healthWorkerOrg3.id,
  //     },
  // })
  // const healthWorker4 = await prisma.user.upsert({
  //     where: {email: "mlinge2@diigo.com"},
  //     update: {},
  //     create: {
  //         email: "mlinge2@diigo.com",
  //         name: "Mozes Linge",
  //         password: "luxgodio8tK",
  //         type: "ORGANIZATION",
  //         userVerified: false,
  //         status: "REJECTED",
  //         orgId: healthWorkerOrg3.id,
  //     },
  // })
  // const healthWorker18 = await prisma.user.upsert({
  //     where: {email: "lsindall3@sbwire.com"},
  //     update: {},
  //     create: {
  //         email: "lsindall3@sbwire.com",
  //         name: "Lianne Sindall",
  //         password: "VOeA0s1V9IUr",
  //         type: "ORGANIZATION",
  //         userVerified: false,
  //         status: "REJECTED",
  //         orgId: healthWorkerOrg3.id,
  //     },
  // })

  // const healthWorkerInd17 = await prisma.individual.upsert({
  //     where: {id: '17'},
  //     update: {},
  //     create: {
  //         image: 'https://picsum.photos/200',
  //         identity: 'https://www.africau.edu/images/default/sample.pdf',
  //         address: 'https://www.africau.edu/images/default/sample.pdf',
  //         healthLicense: 'https://www.africau.edu/images/default/sample.pdf',
  //         role: 'HEALTHCARE',
  //     },
  // })

  // const healthWorker17 = await prisma.user.upsert({
  //     where: {email: "ehellis4@indiegogo.com"},
  //     update: {},
  //     create: {
  //         email: "ehellis4@indiegogo.com",
  //         name: "Elliott Hellis",
  //         password: "HVxh5hzj",
  //         type: "INDIVIDUAL",
  //         userVerified: true,
  //         status: "APPROVED",
  //         indID: healthWorkerInd17.id,
  //     },
  // })

  // const healthWorkerInd16 = await prisma.individual.upsert({
  //     where: {id: '16'},
  //     update: {},
  //     create: {
  //         image: 'https://picsum.photos/200',
  //         identity: 'https://www.africau.edu/images/default/sample.pdf',
  //         address: 'https://www.africau.edu/images/default/sample.pdf',
  //         healthLicense: 'https://www.africau.edu/images/default/sample.pdf',
  //         role: 'HEALTHCARE',
  //     },
  // })

  // const healthWorker16 = await prisma.user.upsert({
  //     where: {email: "fsugar5@pcworld.com"},
  //     update: {},
  //     create: {
  //         email: "fsugar5@pcworld.com",
  //         name: "Fabiano Sugar",
  //         password: "4mtSV9f0",
  //         type: "INDIVIDUAL",
  //         userVerified: false,
  //         status: "CREATED",
  //         indID: healthWorkerInd16.id,
  //     },
  // })
  // const healthWorker15 = await prisma.user.upsert({
  //     where: {email: "tdrayson6@addtoany.com"},
  //     update: {},
  //     create: {
  //         email: "tdrayson6@addtoany.com",
  //         name: "Tildy Drayson",
  //         password: "232BxnAqgI",
  //         type: "ORGANIZATION",
  //         userVerified: false,
  //         status: "PENDING",
  //         orgId: healthWorkerOrg4.id,
  //     },
  // })
  // const healthWorker14 = await prisma.user.upsert({
  //     where: {email: "vswinbourne7@chicagotribune.com"},
  //     update: {},
  //     create: {
  //         email: "vswinbourne7@chicagotribune.com",
  //         name: "Vonni Swinbourne",
  //         password: "J8MTR7IRH",
  //         type: "ORGANIZATION",
  //         userVerified: false,
  //         status: "CREATED",
  //         orgId: healthWorkerOrg4.id,
  //     },
  // })

  // const healthWorkerInd13 = await prisma.individual.upsert({
  //     where: {id: '13'},
  //     update: {},
  //     create: {
  //         image: 'https://picsum.photos/200',
  //         identity: 'https://www.africau.edu/images/default/sample.pdf',
  //         address: 'https://www.africau.edu/images/default/sample.pdf',
  //         healthLicense: 'https://www.africau.edu/images/default/sample.pdf',
  //         role: 'HEALTHCARE',
  //     },
  // })

  // const healthWorker13 = await prisma.user.upsert({
  //     where: {email: "csotham8@hexun.com"},
  //     update: {},
  //     create: {
  //         email: "csotham8@hexun.com",
  //         name: "Caesar Sotham",
  //         password: "g0K2b7GK",
  //         type: "INDIVIDUAL",
  //         userVerified: false,
  //         status: "REJECTED",
  //         indID: healthWorkerInd13.id,
  //     },
  // })

  // const healthWorkerInd12 = await prisma.individual.upsert({
  //     where: {id: '12'},
  //     update: {},
  //     create: {
  //         image: 'https://picsum.photos/200',
  //         identity: 'https://www.africau.edu/images/default/sample.pdf',
  //         address: 'https://www.africau.edu/images/default/sample.pdf',
  //         role: 'USER',
  //     },
  // })

  // const healthWorker12 = await prisma.user.upsert({
  //     where: {email: "gantognetti9@reverbnation.com"},
  //     update: {},
  //     create: {
  //         email: "gantognetti9@reverbnation.com",
  //         name: "Garald Antognetti",
  //         password: "lD3I9KE",
  //         type: "INDIVIDUAL",
  //         userVerified: false,
  //         status: "PENDING",
  //         indID: healthWorkerInd12.id,
  //     },
  // })
  // const healthWorker11 = await prisma.user.upsert({
  //     where: {email: "sbarranda@taobao.com"},
  //     update: {},
  //     create: {
  //         email: "sbarranda@taobao.com",
  //         name: "Salomone Barrand",
  //         password: "tRYdWBNZk71",
  //         type: "ORGANIZATION",
  //         userVerified: false,
  //         status: "REJECTED",
  //         orgId: healthWorkerOrg4.id,
  //     },
  // })
  // const healthWorker10 = await prisma.user.upsert({
  //     where: {email: "tmaysb@theguardian.com"},
  //     update: {},
  //     create: {
  //         email: "tmaysb@theguardian.com",
  //         name: "Tildie Mays",
  //         password: "723IkN90OW",
  //         type: "ORGANIZATION",
  //         userVerified: false,
  //         status: "CREATED",
  //         orgId: healthWorkerOrg2.id,
  //     },
  // })
  // const healthWorker9 = await prisma.user.upsert({
  //     where: {email: "sterrellyc@e-recht24.de"},
  //     update: {},
  //     create: {
  //         email: "sterrellyc@e-recht24.de",
  //         name: "Sondra Terrelly",
  //         password: "pfWUnpiUf4Bn",
  //         type: "ORGANIZATION",
  //         userVerified: false,
  //         status: "PENDING",
  //         orgId: healthWorkerOrg2.id,
  //     },
  // })
  // const healthWorker8 = await prisma.user.upsert({
  //     where: {email: "pcleatord@microsoft.com"},
  //     update: {},
  //     create: {
  //         email: "pcleatord@microsoft.com",
  //         name: "Peter Cleator",
  //         password: "47lE3ZpgC",
  //         type: "ORGANIZATION",
  //         userVerified: false,
  //         status: "PENDING",
  //         orgId: healthWorkerOrg2.id,
  //     },
  // })

  // const healthWorkerInd7 = await prisma.individual.upsert({
  //     where: {id: '7'},
  //     update: {},
  //     create: {
  //         image: 'https://picsum.photos/200',
  //         identity: 'https://www.africau.edu/images/default/sample.pdf',
  //         address: 'https://www.africau.edu/images/default/sample.pdf',
  //         role: 'USER',
  //     },
  // })

  // const healthWorker7 = await prisma.user.upsert({
  //     where: {email: "rgruszkae@wikimedia.org"},
  //     update: {},
  //     create: {
  //         email: "rgruszkae@wikimedia.org",
  //         name: "Rosaline Gruszka",
  //         password: "pzi6rbKdB",
  //         type: "INDIVIDUAL",
  //         userVerified: false,
  //         status: "PENDING",
  //         indID: healthWorkerInd7.id,
  //     },
  // })

  // const healthWorkerInd6 = await prisma.individual.upsert({
  //     where: {id: '6'},
  //     update: {},
  //     create: {
  //         image: 'https://picsum.photos/200',
  //         identity: 'https://www.africau.edu/images/default/sample.pdf',
  //         address: 'https://www.africau.edu/images/default/sample.pdf',
  //         role: 'USER',
  //     },
  // })

  // const healthWorker6 = await prisma.user.upsert({
  //     where: {email: "scrathornef@spiegel.de"},
  //     update: {},
  //     create: {
  //         email: "scrathornef@spiegel.de",
  //         name: "Stormi Crathorne",
  //         password: "E7MRsNJipeex",
  //         type: "INDIVIDUAL",
  //         userVerified: false,
  //         status: "CREATED",
  //         indID: healthWorkerInd6.id,
  //     },
  // })

  // const healthWorker5 = await prisma.user.upsert({
  //     where: {email: "atomeg@sciencedaily.com"},
  //     update: {},
  //     create: {
  //         email: "atomeg@sciencedaily.com",
  //         name: "Alec Tome",
  //         password: "pRrktog",
  //         type: "ORGANIZATION",
  //         userVerified: true,
  //         status: "APPROVED",
  //         orgId: healthWorkerOrg4.id,
  //     },
  // })

  // const healthWorkerInd19 = await prisma.individual.upsert({
  //     where: {id: '19'},
  //     update: {},
  //     create: {
  //         image: 'https://picsum.photos/200',
  //         identity: 'https://www.africau.edu/images/default/sample.pdf',
  //         address: 'https://www.africau.edu/images/default/sample.pdf',
  //         role: 'USER',
  //     },
  // })

  // const healthWorker19 = await prisma.user.upsert({
  //     where: {email: "kharfleteh@ebay.co.uk"},
  //     update: {},
  //     create: {
  //         email: "kharfleteh@ebay.co.uk",
  //         name: "Kristen Harflete",
  //         password: "5JQzFJtPugO",
  //         type: "INDIVIDUAL",
  //         userVerified: true,
  //         status: "APPROVED",
  //         indID: healthWorkerInd19.id,
  //     },
  // })

  console.log({
    admin,
    // healthWorkerOrg2,
    // healthWorkerOrg3,
    // healthWorkerOrg4,
    // healthWorkerInd17,
    // healthWorkerInd16,
    // healthWorkerInd13,
    // healthWorkerInd19,
    // healthWorkerInd6,
    // healthWorkerInd7,
    // healthWorkerInd12,
    // healthWorkerInd,
    // healthWorker,
    // healthWorker3,
    // healthWorker2,
    // healthWorker4,
    // healthWorker5,
    // healthWorker6,
    // healthWorker7,
    // healthWorker8,
    // healthWorker9,
    // healthWorker10,
    // healthWorker11,
    // healthWorker13,
    // healthWorker12,
    // healthWorker14,
    // healthWorker15,
    // healthWorker16,
    // healthWorker17,
    // healthWorker18,
    // healthWorker19,
  });

  drugs();
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
