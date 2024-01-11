const nodemailer = require('nodemailer')

const mailSender = async(email,title,body)=>{
        let transporter;
        let isDevelopment = process.env.MODE==='development'
        if(isDevelopment){
            transporter = nodemailer.createTransport({
                host: 'smtp.ethereal.email',
                port: 587,
                auth: {
                    user: 'ken.schuster@ethereal.email',
                    pass: 'nwJ1zxz91MDBy8sT7F'
                }
            });
        }else{
            transporter = nodemailer.createTransport({
                service:'gmail',
                auth:{
                    user:process.env.MAILUSER,
                    pass:process.env.MAILPASS
                }
            });
        }
        let info = await transporter.sendMail(
            {
                from:"www.unknownstudy.com",
                to:email,
                subject:title,
                html:body,
            }
        )
        console.log(info)
        return info;
}
module.exports = mailSender