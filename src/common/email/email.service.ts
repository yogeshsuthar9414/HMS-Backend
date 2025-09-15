import { parentPort, workerData } from 'worker_threads';
import * as nodemailer from 'nodemailer';
import { Worker } from 'worker_threads';
import * as path from 'path';
import config from "../../config/config";
import { HelperService } from '../utils/helper/helper.service';
import { Logger } from '@nestjs/common';


// @Injectable()
// export class EmailService {
async function readyToSendMail(to: string, subject: string, html: string, companyDtl: any) {
    const helperService = new HelperService();
    const loggerService = new Logger("Email Service");
    try {
        if (!companyDtl || config.nodeEnv !== "LIVE" || companyDtl?.is_email === false) return;

        const transporter = nodemailer.createTransport({
            host: companyDtl?.smtp_host,
            port: companyDtl?.smtp_port,
            secure: true,
            auth: {
                user: companyDtl?.smtp_usernm,
                pass: companyDtl?.smtp_password,
            },
        });

        const fromName = companyDtl?.comp_nm;
        const fromEmail = companyDtl?.smtp_from_email;

        const info = await transporter.sendMail({
            from: `${fromName} <${fromEmail}>`,
            to,
            subject,
            html,
        });

        return info;
    } catch (error) {
        loggerService.log(error.message, error.stack, 'Email Service');
        helperService.exceptionHandler(error);
    }
}

readyToSendMail(workerData?.to, workerData?.subject, workerData?.html, workerData?.companyDtl)
    .then(() => {
        parentPort?.postMessage('done');
    })
    .catch((err) => {
        parentPort?.postMessage(`error: ${err.message}`);
    });

export function sendMail(sendMailPayload: { to: string, subject: string, html: string, companyDtl: any }) {
    new Worker(path.join(__dirname, '../../../dist/common/email/email.service.js'), {
        workerData: { to: sendMailPayload.to, subject: sendMailPayload.subject, html: sendMailPayload.html, companyDtl: sendMailPayload.companyDtl },
    });
}

