
import { jsPDF } from "jspdf";
import html2canvas from "html2canvas";
import { APP_NAME } from "../constants";

export const exportClinicalReport = async (
  messageText: string,
  imageSrc: string | undefined,
  mode: string,
  username: string
) => {
  // Create a hidden temporary container for the report
  const reportContainer = document.createElement('div');
  reportContainer.style.position = 'absolute';
  reportContainer.style.left = '-9999px';
  reportContainer.style.top = '0';
  reportContainer.style.width = '750px';
  reportContainer.style.padding = '50px';
  reportContainer.style.backgroundColor = '#ffffff';
  reportContainer.style.color = '#1e293b';
  reportContainer.style.fontFamily = 'sans-serif';

  const dateStr = new Date().toLocaleString();
  const reportId = `POCUS-${Math.floor(Math.random() * 100000)}`;

  reportContainer.innerHTML = `
    <div style="border-bottom: 3px solid #3b82f6; padding-bottom: 15px; margin-bottom: 25px; display: flex; justify-content: space-between; align-items: flex-end;">
      <div>
        <h1 style="margin: 0; color: #1d4ed8; font-size: 28px; font-weight: 900; letter-spacing: -0.02em;">${APP_NAME}</h1>
        <p style="margin: 4px 0 0; color: #64748b; font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: 0.15em;">Broad-Spectrum Clinical Ultrasound Consultation Report</p>
      </div>
      <div style="text-align: right; color: #94a3b8; font-size: 10px; font-weight: 500;">
        <p style="margin: 0;">REPORT ID: <span style="color: #475569; font-weight: 700;">${reportId}</span></p>
        <p style="margin: 2px 0 0;">DATE: <span style="color: #475569; font-weight: 700;">${dateStr}</span></p>
      </div>
    </div>

    <div style="display: flex; gap: 20px; margin-bottom: 30px;">
      <div style="flex: 1; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 15px;">
        <p style="margin: 0; font-size: 9px; color: #94a3b8; font-weight: 800; text-transform: uppercase;">Medical Professional</p>
        <p style="margin: 2px 0 0; font-size: 14px; font-weight: 700; color: #1e293b;">${username}</p>
      </div>
      <div style="flex: 1; background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 15px;">
        <p style="margin: 0; font-size: 9px; color: #94a3b8; font-weight: 800; text-transform: uppercase;">Scan Category</p>
        <p style="margin: 2px 0 0; font-size: 14px; font-weight: 700; color: #3b82f6;">${mode.toUpperCase()} ULTRASOUND</p>
      </div>
    </div>

    ${imageSrc ? `
    <div style="margin-bottom: 30px; text-align: center; background: #f1f5f9; padding: 20px; border-radius: 16px;">
      <p style="margin: 0 0 12px; font-size: 10px; color: #64748b; text-transform: uppercase; letter-spacing: 0.1em; text-align: left; font-weight: 700;">Diagnostic Imaging</p>
      <img src="${imageSrc}" style="max-width: 100%; max-height: 400px; border-radius: 8px; box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);" />
    </div>
    ` : ''}

    <div style="margin-bottom: 40px;">
      <h3 style="margin: 0 0 15px; font-size: 11px; color: #1d4ed8; text-transform: uppercase; letter-spacing: 0.1em; font-weight: 800; border-bottom: 1px solid #dbeafe; padding-bottom: 5px;">Analysis & Impression</h3>
      <div style="font-size: 13px; line-height: 1.7; color: #334155; white-space: pre-wrap; background: #fff; padding: 5px;">
        ${messageText
          .replace(/\*\*(.*?)\*\*/g, '<strong style="color: #0f172a;">$1</strong>')
          .replace(/### (.*?)\n/g, '<h4 style="color: #3b82f6; font-size: 14px; margin-top: 15px; margin-bottom: 10px;">$1</h4>')
        }
      </div>
    </div>

    <div style="margin-top: auto; border-top: 1px solid #e2e8f0; padding-top: 20px;">
      <div style="background-color: #fefce8; border: 1px solid #fef3c7; border-radius: 12px; padding: 20px;">
        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
          <div style="width: 6px; height: 14px; background: #ca8a04; border-radius: 2px;"></div>
          <h4 style="margin: 0; color: #854d0e; font-size: 11px; font-weight: 900; text-transform: uppercase; letter-spacing: 0.05em;">Clinical Disclaimer</h4>
        </div>
        <p style="margin: 0; color: #92400e; font-size: 10px; line-height: 1.6;">
          This report is strictly for **research and educational purposes** in the field of Clinical Ultrasound. 
          It is NOT intended for primary medical diagnosis or clinical decision-making. 
          Final interpretation must be performed by a board-certified Radiologist. 
          This AI assistance tool is not FDA cleared for clinical diagnostic use.
        </p>
      </div>
      <div style="text-align: center; margin-top: 25px;">
        <p style="font-size: 9px; color: #94a3b8; font-weight: 500;">&copy; ${new Date().getFullYear()} ${APP_NAME} Research Initiative. Formalized Documentation.</p>
      </div>
    </div>
  `;

  document.body.appendChild(reportContainer);

  try {
    const canvas = await html2canvas(reportContainer, {
      scale: 2,
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff'
    });
    
    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF({
      orientation: 'portrait',
      unit: 'mm',
      format: 'a4'
    });

    const imgWidth = 210;
    const imgHeight = (canvas.height * imgWidth) / canvas.width;
    
    pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
    pdf.save(`${APP_NAME}_Report_${reportId}.pdf`);
  } catch (err) {
    console.error("PDF Export failed", err);
    alert("Failed to generate PDF report.");
  } finally {
    document.body.removeChild(reportContainer);
  }
};
