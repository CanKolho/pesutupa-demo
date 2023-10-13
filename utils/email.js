import { SMTPClient } from "../deps.js";
import { SEND_EMAIL, PASSWORD } from "../config/config.js";

const sendEmail = async (receiver, link) => {
  console.log('connecting...');

  const client = new SMTPClient({
    connection: {
      hostname: "smtp.gmail.com",
      port: 465,
      tls: true,
      auth: {
        username: SEND_EMAIL,
        password: PASSWORD,
      },
    },
  });

  console.log('connected');

  try {
    console.log('sending to ', receiver);

    await client.send({
      from: SEND_EMAIL,
      to: receiver,
      subject: "RESET PASSWORD",
      html: `<p>Reset your password using this link - <a href='${link}'>${link}</a></p>`,
    });
    console.log('email sent successfully!');
  } catch (error) {
    console.error("Error sending email:", error);
  }

  await client.close();
};

export { sendEmail };
