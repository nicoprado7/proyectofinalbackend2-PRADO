import nodemailer from "nodemailer";
import path from "path";
import { deleteFile } from "../utils/fileSystem.js";
import paths from "../utils/paths.js";

export default class EmailService {
    #nodemailer;

    constructor() {
        this.#nodemailer = nodemailer;
    }

    #createTransport() {
        return this.#nodemailer.createTransport({
            host: process.env.SMTP_HOST,
            port: process.env.SMTP_PORT,
            secure: process.env.SMTP_PORT === "465",
            auth: {
                user: process.env.SMTP_EMAIL,
                pass: process.env.SMTP_PASSWORD,
            },
            tls: {
                rejectUnauthorized: false,
            },
        });
    }

    async send(to, subject, content, filename) {
        const transport = this.#createTransport();
        const attachments = [];

        if (filename) {
            attachments.push({
                filename,
                path: path.join(paths.images, filename),
            });
        }

        try {
            await transport.sendMail({
                from: process.env.SMTP_EMAIL,
                to,
                subject,
                html: content,
                attachments,
            });
        } catch (error) {
            console.error("Error al enviar el correo:", error);
        }

        if (filename) {
            try {
                await deleteFile(paths.images, filename);
            } catch (deleteError) {
                console.error("Error al eliminar el archivo:", deleteError);
            }
        }
    }
}