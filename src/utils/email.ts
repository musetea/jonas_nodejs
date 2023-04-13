import nodemailer, { SendMailOptions } from "nodemailer";

const EMAIL_USER = process.env.EMAIL_USER || "4da95ba676edea";
const EMAIL_PASS = process.env.EMAIL_PASS || "39f4600165de89";
const EMAIL_HOST = process.env.EMAIL_HOST || "sandbox.smtp.mailtrap.io";
const EMAIL_PORT = process.env.EMAIL_PORT || "25";

/**
 * 1) Create a transporter
 * 2) Define the email Options
 * 3) Actually send the email
 * @param options
 */
const sendEmail = async (mailOptions: SendMailOptions) => {
	// 1)
	// const smtpOptins: any = {
	//     // service: 'Gmail',
	//     host: EMAIL_HOST,
	//     port: EMAIL_PORT,
	//     auth: {
	//         user: EMAIL_USER,
	//         pass: EMAIL_PASS
	//     }
	// };

	const transport = nodemailer.createTransport({
		host: "sandbox.smtp.mailtrap.io",
		port: 2525,
		auth: {
			user: "4da95ba676edea",
			pass: "39f4600165de89",
		},
	});
	//console.log(transport);

	// const transporter = nodemailer.createTransport(smtpOptins);
	// console.log(transporter);
	// Activate in gmail less secure app option
	// GMail 일 경우 하루에 500통 제한 (프로덕션용으로 사용안됨)

	// 2
	// const mailOptions = {
	//     from: 'Jonas NodeJs Test <admin@gmail.com>',
	//     to: options.email,
	//     subject: options.subject,
	//     text: options.message
	//     // html:
	// }

	// 3
	const result = await transport.sendMail(mailOptions);
	console.log(result);
};

export default sendEmail;
