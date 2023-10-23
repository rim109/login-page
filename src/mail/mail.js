const { Template } = require('ejs');
const mailer = require('nodemailer');
const welcome = require('./welcome_template');
const goodbye = require('./goodbye_template');

const getEmailData = (to, name, template) => {
    let data = null;

    switch(template) {
        case "hello":
            data = {
                from: '보내는 사람 이름 <userId@gmail.com>',
                to,
                subject:`Hello ${name}`,
                html: welcome()
            }
            break;
    }
    switch(template) {
        case "goodbye":
            data = {
                from: '보내는 사람 이름 <userId@gmail.com>',
                to,
                subject:`Goodbye ${name}`,
                html: goodbye()
            }
            break;
        default:
            data;

    }
    return data;
}
const sendEMail = (to, name, type) => {
    const transporter = mailer.createTransport({
        service: 'Gmail',
        auth: {
            user: '유저 이메일 아이디',
            pass: '구글에서 새로 생성한 비밀번호'
        }
    })
    
    const mail = getEmailData(to, name, type);
    
    transporter.sendEMail(mail, (error, response) => {
        if(error) {
            console.log(error);
        } else {
            console.log('email sent successfully');
        }
    
        transporter.close();
    })    
}

module.exports = sendEMail;