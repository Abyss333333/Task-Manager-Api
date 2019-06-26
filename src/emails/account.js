 const sgMail = require('@sendgrid/mail')
const sendgridAPIkey = (process.env.SENDGRID_API_KEY)

sgMail.setApiKey(sendgridAPIkey)

// sgMail.send ({
//     to: 'abdullah.siddiqi2445@gmail.com',
//     from: 'abdullah.siddiqi2445@gmail.com',
//     subject: 'First creation',
//     text: 'Hope this reaches'
// })

const sendWelcomeEmail = (email,name) => {
    sgMail.send({
        to: email,
        from: 'abdullah.siddiqi2445@gmail.com',
        subject: "Whats Up",
        text: `Welcome to the app, ${name}. Lmk how you like this`
    })
}

const sendCancelEmail  = (email,name) => {
    sgMail.send ({
        to:email,
        from: 'abdullah.siddiqi2445@gmail.com',
        subject: 'Why Cancel?',
        text: `PLease dont Cancel, ${name} :(`
    })
}

module.exports = {
    sendWelcomeEmail,
    sendCancelEmail
}