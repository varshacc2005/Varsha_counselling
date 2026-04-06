const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true for 465, false for other ports
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
    tls: {
        rejectUnauthorized: false,
        ciphers: 'SSLv3'
    }
});

const sendBookingRequestEmail = async (counselorEmail, studentName, date, time) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: counselorEmail, // Send to actual counselor
            subject: 'New Booking Request - Varsha Counseling Platform',
            html: `
                <div style="font-family: sans-serif; color: #333; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                    <h2 style="color: #4f46e5;">New Booking Request</h2>
                    <p>Dear Counselor,</p>
                    <p>You have received a new booking request from a student.</p>
                    <div style="background-color: #f9fafb; padding: 15px; border-radius: 8px; margin: 20px 0;">
                        <p><strong>Student Name:</strong> ${studentName}</p>
                        <p><strong>Date:</strong> ${new Date(date).toDateString()}</p>
                        <p><strong>Time Slot:</strong> ${time}</p>
                    </div>
                    <p>Please log in to your dashboard to review and approve the request.</p>
                    <p style="margin-top: 30px; font-size: 0.8em; color: #777;">This is an automated message from the Varsha Counseling Platform.</p>
                </div>
            `,
        };

        if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
            await transporter.sendMail(mailOptions);
            console.log('Booking request email sent successfully');
        } else {
            console.warn('Email credentials not set. Skipping email send.');
        }
    } catch (error) {
        console.error('Error sending booking request email:', error);
    }
};

const sendBookingConfirmationEmail = async (studentEmail, counselorName, date, time, status) => {
    try {
        const isApproved = status === 'approved';
        const subject = isApproved ? 'Booking Confirmed - Varsha Counseling' : 'Booking Update - Varsha Counseling';

        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: studentEmail, // Send to actual student
            subject: subject,
            html: `
                <div style="font-family: sans-serif; color: #333; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                    <h2 style="color: ${isApproved ? '#16a34a' : '#dc2626'};">${subject}</h2>
                    <p>Hello,</p>
                    <p>Your booking request with <strong>${counselorName}</strong> has been <strong>${status}</strong>.</p>
                    <div style="background-color: #f9fafb; padding: 15px; border-radius: 8px; margin: 20px 0;">
                        <p><strong>Counselor:</strong> ${counselorName}</p>
                        <p><strong>Date:</strong> ${new Date(date).toDateString()}</p>
                        <p><strong>Time Slot:</strong> ${time}</p>
                    </div>
                    ${isApproved ? '<p>You can now access the chat and video session through your dashboard.</p>' : '<p>Please feel free to book another available slot.</p>'}
                    <p style="margin-top: 30px; font-size: 0.8em; color: #777;">Thank you for using Varsha Counseling Platform.</p>
                </div>
            `,
        };

        if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
            await transporter.sendMail(mailOptions);
            console.log('Booking confirmation email sent successfully');
        } else {
            console.warn('Email credentials not set. Skipping email send.');
        }
    } catch (error) {
        console.error('Error sending booking confirmation email:', error);
    }
};

const sendMeetingDetailsEmail = async (studentEmail, studentName, counselorEmail, counselorName, date, time, bookingId) => {
    try {
        const meetingLink = `https://meet.jit.si/varsha-session-${bookingId}`;

        // Common mail options
        const subject = 'Your Video Counseling Session Details';

        // Send to Student
        const studentMailOptions = {
            from: process.env.EMAIL_USER,
            to: studentEmail,
            subject: subject,
            html: `
                <div style="font-family: sans-serif; color: #333; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                    <h2 style="color: #4f46e5;">Session Details</h2>
                    <p>Hello ${studentName},</p>
                    <p>Your video counseling session with <strong>${counselorName}</strong> is confirmed. Below are the details for your upcoming session:</p>
                    <div style="background-color: #f0fdf4; border: 1px solid #bbfcbd; padding: 15px; border-radius: 8px; margin: 20px 0;">
                        <p><strong>Date:</strong> ${new Date(date).toDateString()}</p>
                        <p><strong>Time:</strong> ${time}</p>
                        <p><strong>Video Link:</strong> <a href="${meetingLink}" style="color: #4f46e5; font-weight: bold;">Join Video Call</a></p>
                    </div>
                    <p>Please ensure you have a stable internet connection and are in a quiet environment for the session.</p>
                    <p style="margin-top: 30px; font-size: 0.8em; color: #777;">Best regards,<br/>The Varsha Team</p>
                </div>
            `,
        };

        // Send to Counselor
        const counselorMailOptions = {
            from: process.env.EMAIL_USER,
            to: counselorEmail,
            subject: 'Meeting Details: Session with ' + studentName,
            html: `
                <div style="font-family: sans-serif; color: #333; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                    <h2 style="color: #4f46e5;">Upcoming Session Details</h2>
                    <p>Dear ${counselorName},</p>
                    <p>You have a confirmed session with student <strong>${studentName}</strong>. Here are the meeting details:</p>
                    <div style="background-color: #f0fdf4; border: 1px solid #bbfcbd; padding: 15px; border-radius: 8px; margin: 20px 0;">
                        <p><strong>Student:</strong> ${studentName}</p>
                        <p><strong>Date:</strong> ${new Date(date).toDateString()}</p>
                        <p><strong>Time:</strong> ${time}</p>
                        <p><strong>Video Link:</strong> <a href="${meetingLink}" style="color: #4f46e5; font-weight: bold;">Start Video Call</a></p>
                    </div>
                    <p style="margin-top: 30px; font-size: 0.8em; color: #777;">Varsha Counseling Platform</p>
                </div>
            `,
        };

        if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
            await transporter.sendMail(studentMailOptions);
            await transporter.sendMail(counselorMailOptions);
            console.log('Meeting details emails sent to both parties');
        } else {
            console.warn('Email credentials not set. Skipping email send.');
        }
    } catch (error) {
        console.error('Error sending meeting details email:', error);
    }
};

const sendWaitingForApprovalEmail = async (studentEmail, studentName, counselorName, date, time) => {
    try {
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: studentEmail,
            subject: 'Booking Received - Waiting for Approval',
            html: `
                <div style="font-family: sans-serif; color: #333; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
                    <h2 style="color: #f59e0b;">Booking Received</h2>
                    <p>Hello ${studentName},</p>
                    <p>We have received your booking request for a counseling session with <strong>${counselorName}</strong>.</p>
                    <div style="background-color: #fffbeb; border: 1px solid #fde68a; padding: 15px; border-radius: 8px; margin: 20px 0;">
                        <p><strong>Counselor:</strong> ${counselorName}</p>
                        <p><strong>Date:</strong> ${new Date(date).toDateString()}</p>
                        <p><strong>Time Slot:</strong> ${time}</p>
                        <p><strong>Status:</strong> <span style="color: #d97706; font-weight: bold;">Waiting for Approval</span></p>
                    </div>
                    <p>The counselor will review your request shortly. You will receive another email once the session is confirmed.</p>
                    <p style="margin-top: 30px; font-size: 0.8em; color: #777;">Thank you for using Varsha Counseling Platform.</p>
                </div>
            `,
        };

        if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
            await transporter.sendMail(mailOptions);
            console.log('Waiting for approval email sent to student');
        } else {
            console.warn('Email credentials not set. Skipping email send.');
        }
    } catch (error) {
        console.error('Error sending waiting for approval email:', error);
    }
};

module.exports = {
    sendBookingRequestEmail,
    sendBookingConfirmationEmail,
    sendMeetingDetailsEmail,
    sendWaitingForApprovalEmail,
};
