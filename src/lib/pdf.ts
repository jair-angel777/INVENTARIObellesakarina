import html2pdf from 'html2pdf.js';

export const generateBoleta = (data: any) => {
  const element = document.createElement('div');
  element.style.padding = '40px';
  element.style.fontFamily = 'serif';
  element.style.color = '#121212';
  
  element.innerHTML = `
    <div style="border: 4px solid #4A76C0; padding: 20px; border-radius: 20px;">
      <h1 style="color: #4A76C0; text-transform: uppercase; margin: 0;">Bellesas Karina Paris</h1>
      <p style="text-transform: uppercase; font-size: 10px; font-weight: bold; spacing: 2px;">Protocolo de Gestión v5</p>
      
      <hr style="margin: 20px 0; border: 1px solid #eee;" />
      
      <div style="display: flex; justify-between: space-between;">
         <div>
            <h2 style="font-style: italic;">BOLETA DE PEDIDO</h2>
            <p><strong>Referencia:</strong> #${data.id?.slice(-8) || 'N/A'}</p>
            <p><strong>Fecha:</strong> ${new Date().toLocaleDateString()}</p>
         </div>
      </div>
      
      <table style="width: 100%; border-collapse: collapse; margin-top: 30px;">
        <thead>
          <tr style="background: #4A76C0; color: white; text-transform: uppercase; font-size: 10px;">
            <th style="padding: 10px; text-align: left;">Descripción</th>
            <th style="padding: 10px; text-align: right;">Cantidad</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style="padding: 10px; border-bottom: 1px solid #eee;">${data.nombre || 'Reposición Stock'}</td>
            <td style="padding: 10px; border-bottom: 1px solid #eee; text-align: right;">${data.cantidad || 1}</td>
          </tr>
        </tbody>
      </table>
      
      <div style="margin-top: 50px;">
         <p style="font-size: 10px; border-top: 2px dashed #4A76C0; display: inline-block; padding-top: 10px; width: 200px; text-align: center;">Solicitado por</p>
         <div style="display: inline-block; width: 50px;"></div>
         <p style="font-size: 10px; border-top: 2px dashed #4A76C0; display: inline-block; padding-top: 10px; width: 200px; text-align: center;">Recibido por</p>
      </div>
    </div>
  `;

  const opt = {
    margin:       1,
    filename:     `boleta_${data.id || 'order'}.pdf`,
    image:        { type: 'jpeg' as const, quality: 0.98 },
    html2canvas:  { scale: 2 },
    jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' as const }
  };

  html2pdf().from(element).set(opt).save();
};
