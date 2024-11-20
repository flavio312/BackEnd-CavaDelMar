import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: '231216@ids.upchiapas.edu.mx',
    pass: 'Rock371dnd33',
  },
  tls:{
    rejectUnauthorized: false,
  },
});

export const verifyConnection = async (): Promise<void> => {
  try {
    await transporter.verify();
    console.log("✅ Conexión SMTP exitosa");
  } catch (error) {
    console.error("❌ Error al conectar con el servidor SMTP:", error);
  }
};

export const sendEmail = async (to: string, subject: string, text: string): Promise<void> => {
  try {
    const mailOptions = {
      from: '231204@ids.upchiapas.edu.mx',
      to,                         
      subject,                    
      text,                       
    };

    // Enviar el correo
    await transporter.sendMail(mailOptions);
    console.log(`Correo enviado a ${to}`);
  } catch (error) {
    console.error('Error al enviar correo:', error);
    throw new Error('No se pudo enviar el correo.');
  }

  transporter.verify((error, success) => {
    if (error) {
      console.error('Error al conectar:', error);
    } else {
      console.log('Servidor listo para enviar correos');
    }
  });
  
};
