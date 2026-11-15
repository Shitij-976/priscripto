import React from 'react';
import {
  Html,
  Head,
  Body,
  Container,
  Section,
  Heading,
  Text,
  Hr,
  Button,
} from '@react-email/components';

const mainStyle = {
  backgroundColor: '#f6f9fc',
  fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Ubuntu, sans-serif',
  padding: '20px 0',
};

const containerStyle = {
  backgroundColor: '#ffffff',
  border: '1px solid #e2e8f0',
  borderRadius: '12px',
  margin: '0 auto',
  padding: '32px',
  maxWidth: '560px',
};

const headerBrand = {
  fontSize: '24px',
  fontWeight: 'bold',
  color: '#5f6FFF',
  marginBottom: '20px',
};

const headingStyle = {
  fontSize: '20px',
  fontWeight: '600',
  color: '#1e293b',
  marginBottom: '16px',
};

const textStyle = {
  fontSize: '15px',
  lineHeight: '24px',
  color: '#475569',
  margin: '8px 0',
};

const cardStyle = {
  backgroundColor: '#f8fafc',
  border: '1px solid #e2e8f0',
  borderRadius: '8px',
  padding: '16px',
  margin: '16px 0',
};

const labelStyle = {
  fontWeight: '600',
  color: '#334155',
};

const buttonStyle = {
  backgroundColor: '#5f6FFF',
  color: '#ffffff',
  borderRadius: '8px',
  padding: '12px 24px',
  fontSize: '14px',
  fontWeight: '600',
  textDecoration: 'none',
  display: 'inline-block',
  marginTop: '16px',
};

const footerStyle = {
  fontSize: '12px',
  color: '#94a3b8',
  marginTop: '24px',
  textAlign: 'center',
};

// 1. Appointment Booked Email Template
export const AppointmentBookedTemplate = ({ patientName, doctorName, speciality, slotDate, slotTime, fees, address }) => {
  return React.createElement(
    Html,
    { lang: 'en' },
    React.createElement(Head, null),
    React.createElement(
      Body,
      { style: mainStyle },
      React.createElement(
        Container,
        { style: containerStyle },
        React.createElement('div', { style: headerBrand }, 'Prescripto'),
        React.createElement(Heading, { style: headingStyle }, 'Appointment Confirmed! 🩺'),
        React.createElement(Text, { style: textStyle }, `Hello ${patientName || 'Patient'},`),
        React.createElement(
          Text,
          { style: textStyle },
          'Your appointment has been successfully booked with Prescripto. Here are your booking details:'
        ),
        React.createElement(
          Section,
          { style: cardStyle },
          React.createElement(Text, { style: textStyle }, React.createElement('span', { style: labelStyle }, 'Doctor: '), `Dr. ${doctorName} (${speciality})`),
          React.createElement(Text, { style: textStyle }, React.createElement('span', { style: labelStyle }, 'Date: '), slotDate),
          React.createElement(Text, { style: textStyle }, React.createElement('span', { style: labelStyle }, 'Time Slot: '), slotTime),
          React.createElement(Text, { style: textStyle }, React.createElement('span', { style: labelStyle }, 'Consultation Fee: '), `₹${fees}`),
          address && React.createElement(Text, { style: textStyle }, React.createElement('span', { style: labelStyle }, 'Clinic Address: '), `${address.line1 || ''}, ${address.line2 || ''}`)
        ),
        React.createElement(Text, { style: textStyle }, 'Please arrive 10 minutes prior to your scheduled time slot.'),
        React.createElement(
          Button,
          {
            style: buttonStyle,
            href: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/my-appointments`,
          },
          'View My Appointments'
        ),
        React.createElement(Hr, { style: { borderColor: '#e2e8f0', margin: '24px 0 16px' } }),
        React.createElement(Text, { style: footerStyle }, '© Prescripto Healthcare. All rights reserved.')
      )
    )
  );
};

// 2. Appointment Cancelled Email Template
export const AppointmentCancelledTemplate = ({ patientName, doctorName, slotDate, slotTime, cancelledBy }) => {
  return React.createElement(
    Html,
    { lang: 'en' },
    React.createElement(Head, null),
    React.createElement(
      Body,
      { style: mainStyle },
      React.createElement(
        Container,
        { style: containerStyle },
        React.createElement('div', { style: headerBrand }, 'Prescripto'),
        React.createElement(Heading, { style: { ...headingStyle, color: '#ef4444' } }, 'Appointment Cancelled ⚠️'),
        React.createElement(Text, { style: textStyle }, `Hello ${patientName || 'Patient'},`),
        React.createElement(
          Text,
          { style: textStyle },
          `Your appointment with Dr. ${doctorName} scheduled for ${slotDate} at ${slotTime} has been cancelled${cancelledBy ? ` by ${cancelledBy}` : ''}.`
        ),
        React.createElement(
          Button,
          {
            style: buttonStyle,
            href: `${process.env.FRONTEND_URL || 'http://localhost:5173'}/doctors`,
          },
          'Book Another Appointment'
        ),
        React.createElement(Hr, { style: { borderColor: '#e2e8f0', margin: '24px 0 16px' } }),
        React.createElement(Text, { style: footerStyle }, '© Prescripto Healthcare. All rights reserved.')
      )
    )
  );
};

// 3. Appointment Completed Email Template
export const AppointmentCompletedTemplate = ({ patientName, doctorName, slotDate }) => {
  return React.createElement(
    Html,
    { lang: 'en' },
    React.createElement(Head, null),
    React.createElement(
      Body,
      { style: mainStyle },
      React.createElement(
        Container,
        { style: containerStyle },
        React.createElement('div', { style: headerBrand }, 'Prescripto'),
        React.createElement(Heading, { style: { ...headingStyle, color: '#10b981' } }, 'Consultation Completed ✅'),
        React.createElement(Text, { style: textStyle }, `Hello ${patientName || 'Patient'},`),
        React.createElement(
          Text,
          { style: textStyle },
          `Your consultation with Dr. ${doctorName} on ${slotDate} has been marked as completed.`
        ),
        React.createElement(Text, { style: textStyle }, 'Thank you for choosing Prescripto for your healthcare needs. We wish you good health!'),
        React.createElement(Hr, { style: { borderColor: '#e2e8f0', margin: '24px 0 16px' } }),
        React.createElement(Text, { style: footerStyle }, '© Prescripto Healthcare. All rights reserved.')
      )
    )
  );
};

// 4. Reset Password OTP Email Template
export const ResetPasswordOtpTemplate = ({ userName, otp }) => {
  return React.createElement(
    Html,
    { lang: 'en' },
    React.createElement(Head, null),
    React.createElement(
      Body,
      { style: mainStyle },
      React.createElement(
        Container,
        { style: containerStyle },
        React.createElement('div', { style: headerBrand }, 'Prescripto'),
        React.createElement(Heading, { style: headingStyle }, 'Password Reset Request 🔐'),
        React.createElement(Text, { style: textStyle }, `Hello ${userName || 'User'},`),
        React.createElement(
          Text,
          { style: textStyle },
          'We received a request to reset your password. Use the OTP code below to set a new password:'
        ),
        React.createElement(
          Section,
          {
            style: {
              backgroundColor: '#eef2ff',
              border: '2px dashed #6366f1',
              borderRadius: '8px',
              padding: '20px',
              textAlign: 'center',
              margin: '20px 0',
            },
          },
          React.createElement(
            Text,
            {
              style: {
                fontSize: '32px',
                fontWeight: 'bold',
                color: '#4338ca',
                letterSpacing: '6px',
                margin: 0,
              },
            },
            otp
          )
        ),
        React.createElement(
          Text,
          { style: { ...textStyle, fontSize: '13px', color: '#64748b' } },
          'This OTP is valid for 15 minutes. If you did not request this, you can safely ignore this email.'
        ),
        React.createElement(Hr, { style: { borderColor: '#e2e8f0', margin: '24px 0 16px' } }),
        React.createElement(Text, { style: footerStyle }, '© Prescripto Healthcare. All rights reserved.')
      )
    )
  );
};
