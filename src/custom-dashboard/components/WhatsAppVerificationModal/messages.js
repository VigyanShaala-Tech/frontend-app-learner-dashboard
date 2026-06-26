import { defineMessages } from '@edx/frontend-platform/i18n';

const messages = defineMessages({
  'modal.whatsapp.prompt.title': {
    id: 'modal.whatsapp.prompt.title',
    defaultMessage: 'Verify Your WhatsApp Number',
    description: 'Title for the WhatsApp verification prompt modal',
  },
  'modal.whatsapp.prompt.body': {
    id: 'modal.whatsapp.prompt.body',
    defaultMessage: 'Stay connected! Add your WhatsApp number to receive important course updates, reminders, and notifications.',
    description: 'Body text for the WhatsApp verification prompt modal',
  },
  'modal.whatsapp.prompt.skip': {
    id: 'modal.whatsapp.prompt.skip',
    defaultMessage: 'Skip for now',
    description: 'Button to skip WhatsApp verification',
  },
  'modal.whatsapp.prompt.verifyNow': {
    id: 'modal.whatsapp.prompt.verifyNow',
    defaultMessage: 'Verify Now',
    description: 'Button to start WhatsApp verification',
  },
  'modal.whatsapp.verify.title': {
    id: 'modal.whatsapp.verify.title',
    defaultMessage: 'Add Your WhatsApp Number',
    description: 'Title for the WhatsApp number input step',
  },
  'modal.whatsapp.verify.helper': {
    id: 'modal.whatsapp.verify.helper',
    defaultMessage: 'Select your country and enter your WhatsApp number, then click Send OTP.',
    description: 'Helper text shown before OTP send',
  },
  'modal.whatsapp.verify.placeholder': {
    id: 'modal.whatsapp.verify.placeholder',
    defaultMessage: 'Enter WhatsApp number',
    description: 'Placeholder for phone number input',
  },
  'modal.whatsapp.verify.sendOtp': {
    id: 'modal.whatsapp.verify.sendOtp',
    defaultMessage: 'Send OTP',
    description: 'Button to send OTP',
  },
  'modal.whatsapp.verify.sendingOtp': {
    id: 'modal.whatsapp.verify.sendingOtp',
    defaultMessage: 'Sending...',
    description: 'Button label while OTP is being sent',
  },
  'modal.whatsapp.verify.resendOtp': {
    id: 'modal.whatsapp.verify.resendOtp',
    defaultMessage: 'Resend OTP',
    description: 'Button to resend OTP',
  },
  'modal.whatsapp.verify.resendOtpTimer': {
    id: 'modal.whatsapp.verify.resendOtpTimer',
    defaultMessage: 'Resend OTP in {seconds}s',
    description: 'Resend OTP button with countdown timer',
  },
  'modal.whatsapp.verify.otpPlaceholder': {
    id: 'modal.whatsapp.verify.otpPlaceholder',
    defaultMessage: 'Enter 6-digit OTP',
    description: 'Placeholder for OTP input',
  },
  'modal.whatsapp.verify.verifySave': {
    id: 'modal.whatsapp.verify.verifySave',
    defaultMessage: 'Verify & Save',
    description: 'Button to verify OTP and save phone number',
  },
  'modal.whatsapp.verify.saving': {
    id: 'modal.whatsapp.verify.saving',
    defaultMessage: 'Saving...',
    description: 'Button label while saving',
  },
  'modal.whatsapp.verify.cancel': {
    id: 'modal.whatsapp.verify.cancel',
    defaultMessage: 'Cancel',
    description: 'Cancel button on the verify step',
  },
  'modal.whatsapp.error.invalidNumber': {
    id: 'modal.whatsapp.error.invalidNumber',
    defaultMessage: 'Please enter a valid WhatsApp number.',
    description: 'Error for invalid phone number',
  },
  'modal.whatsapp.error.sendOtpFirst': {
    id: 'modal.whatsapp.error.sendOtpFirst',
    defaultMessage: 'Please send OTP before verifying.',
    description: 'Error when user tries to verify without sending OTP',
  },
  'modal.whatsapp.error.enterOtp': {
    id: 'modal.whatsapp.error.enterOtp',
    defaultMessage: 'Please enter the OTP.',
    description: 'Error when OTP field is empty',
  },
  'modal.whatsapp.error.otpExpired': {
    id: 'modal.whatsapp.error.otpExpired',
    defaultMessage: 'OTP expired. Please resend OTP.',
    description: 'Error when OTP has expired',
  },
  'modal.whatsapp.error.sendFailed': {
    id: 'modal.whatsapp.error.sendFailed',
    defaultMessage: 'Unable to send OTP. Please try again.',
    description: 'Error when OTP send fails',
  },
  'modal.whatsapp.error.invalidOtp': {
    id: 'modal.whatsapp.error.invalidOtp',
    defaultMessage: 'Invalid OTP. Please retry or resend OTP.',
    description: 'Error when OTP verification fails',
  },
  'modal.whatsapp.error.saveFailed': {
    id: 'modal.whatsapp.error.saveFailed',
    defaultMessage: 'Failed to save phone number. Please try again.',
    description: 'Error when phone number save fails',
  },
  'modal.whatsapp.status.otpSent': {
    id: 'modal.whatsapp.status.otpSent',
    defaultMessage: 'OTP sent to your WhatsApp number.',
    description: 'Success message after OTP is sent',
  },
  'modal.whatsapp.status.saved': {
    id: 'modal.whatsapp.status.saved',
    defaultMessage: 'WhatsApp number verified and saved successfully.',
    description: 'Success message after phone is verified and saved',
  },
  'modal.whatsapp.helper.enterOtp': {
    id: 'modal.whatsapp.helper.enterOtp',
    defaultMessage: 'Enter the OTP sent to your WhatsApp and click Verify & Save.',
    description: 'Helper text shown after OTP is sent',
  },
  'modal.whatsapp.helper.otpExpired': {
    id: 'modal.whatsapp.helper.otpExpired',
    defaultMessage: 'OTP has expired. Please resend OTP to continue.',
    description: 'Helper text shown when OTP expires',
  },
});

export default messages;
