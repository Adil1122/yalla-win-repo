import twilio from 'twilio';
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;

const client = twilio(accountSid, authToken);

export default async function createMessage(sms: any, to: any) {

    try {
        const message = await client.messages.create({
            body: sms,
            from: "+12564327089",
            to: to,
          });

        console.log('message body: ', message.body);
    } catch (error) {
        console.log('error: ', error);
    }
}

/*async function createMessage(sms: any, to: any) {
    const message = await client.messages.create({
      body: "This is the ship that made the Kessel Run in fourteen parsecs?",
      from: "+15017122661",
      to: "+15558675310",
    });
  
    console.log(message.body);
}*/
