import { SMTPClient } from "../deps.js";

const sendEmail = async (reveiver, link) => {
  console.log('connecting...');

  //these will be env
  const email = '';
  const password = '';

  const client = new SMTPClient({
    connection: {
      hostname: "smtp.gmail.com",
      port: 465,
      tls: true,
      auth: {
        username: email,
        password: password,
      },
    },
  });

  console.log('connected');

  try {
    console.log('sending to ', reveiver);

    await client.send({
      from: email,
      to: reveiver,
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
