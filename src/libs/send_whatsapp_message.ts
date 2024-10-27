// Download the helper library from https://www.twilio.com/docs/node/install
const twilio = require("twilio"); // Or, for ESM: import twilio from "twilio";

// Find your Account SID and Auth Token at twilio.com/console
// and set the environment variables. See http://twil.io/secure
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = twilio(accountSid, authToken);

export default async function createWhatsAppMessage(message_body: any, to: any) {

    try {
        const message = await client.messages.create({
            body: message_body,
            from: "whatsapp:+14155238886",
            to: "whatsapp:" + to,
          });
        
        console.log('message body: ', message.body); 
    } catch (error) {
        console.log('error: ', error); 
    }
}

/*export default async function createWhatsAppMessage(message_body: any, to: any) {
    const message = await client.messages.create({
      body: "Hello there!",
      from: "whatsapp:+14155238886",
      to: "whatsapp:+15005550006",
    });
  
    console.log(message.body);
  }*/