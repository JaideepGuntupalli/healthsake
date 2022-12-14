import { NextApiRequest, NextApiResponse } from "next";
import fs from "fs";
import pdfMake from "pdfmake";
import path from "path";

const generatebill = async (req: NextApiRequest, res: NextApiResponse) => {
  const { patient, org, transactionDetails } = req.body;

  console.log(transactionDetails);

  const medstr = `Amount Paid: ${transactionDetails.amount} \n
   Time: ${transactionDetails.timestamp.toLocaleString()} \n`;

  const dd = {
    content: [
      {
        text: `${org.name} .ltd`,
        style: "header",
      },
      {
        text: `${org.email}`,
        style: ["quote", "small"],
      },
      "\n",
      {
        text: "Bill issued to below Patient",
        style: "subheader",
      },
      {
        text: "Patient Details",
        style: "subheader",
      },
      "\n",
      `Name: ${patient.name}`,

      `Email:  ${patient.email}`,
      "\n",
      {
        text: "Prescription",
        style: "subheader",
      },
      "\n",

      `${medstr}`,

      {
        text: "This presciption is generated by HealthSake portal and is self signed.",
        style: ["quote", "small"],
      },
    ],
    styles: {
      header: {
        fontSize: 18,
        bold: true,
      },
      subheader: {
        fontSize: 15,
        bold: true,
      },
      quote: {
        italics: true,
      },
      small: {
        fontSize: 8,
      },
    },
  };

  const fontDescriptors = {
    Roboto: {
      normal: "src/styles/fonts/poppins/poppins-v20-latin-500.woff",
      bold: "src/styles/fonts/poppins/poppins-v20-latin-500.woff",
      italics: "src/styles/fonts/poppins/poppins-v20-latin-500.woff",
      bolditalics: "src/styles/fonts/poppins/poppins-v20-latin-500.woff",
    },
  };

  // create pdf with pdfmake
  const printer = new pdfMake(fontDescriptors);
  const pdfDoc = printer.createPdfKitDocument(dd);
  const uploadDir = path.join(__dirname, "../../../../../uploads");

  const createFileName =
    "healthsake_assets" +
    `${org.id}_${patient.id}` +
    new Date().toISOString() +
    ".pdf";
  const filePath = path.join(uploadDir, createFileName);
  pdfDoc.pipe(fs.createWriteStream(filePath));
  pdfDoc.end();

  res.status(200).json({ path: filePath, message: "success" });
};

export default generatebill;
