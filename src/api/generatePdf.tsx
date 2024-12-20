import { GET_PDF_URL } from "./secureData/secureData";

export const generateAndDownloadPDF = async (text: string) => {
  try {
    const response = await fetch(GET_PDF_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        markdown: text,
        engine: "pdflatex",
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to generate PDF");
    }

    const pdfBlob = await response.blob();

    return pdfBlob;
  } catch (error) {
    console.error("Error:", error);
  }
};
