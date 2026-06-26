import React, {
  useState,
  useEffect,
  useCallback,
} from 'react';
import PropTypes from 'prop-types';
import { useIntl } from '@edx/frontend-platform/i18n';
import {
  Button,
  ModalDialog,
  Spinner,
} from '@openedx/paragon';
import { PhoneInput } from 'react-international-phone';
import { getAuthenticatedHttpClient } from '@edx/frontend-platform/auth';
import { getConfig } from '@edx/frontend-platform';

import { sendWhatsappOtp, verifyWhatsappOtp } from '../../../custom-api/whatsappOtpApi';
import { savePhoneNumber } from '../../../custom-api/phoneStatusApi';
import messages from './messages';
import './WhatsAppVerificationModal.scss';

// Minimum digits for a valid mobile number (ignoring country code prefix chars)
const extractDigits = (value = '') => value.replace(/\D/g, '');
const isValidMobile = (value) => {
  const digits = extractDigits(value);
  return digits.length >= 10 && digits.length <= 15;
};

const getBackendError = (error) => {
  const data = error?.response?.data;
  if (!data) {
    return '';
  }
  if (typeof data === 'string') {
    return data;
  }
  return (
    data.message
    || data.detail
    || data.error
    || (Array.isArray(data.non_field_errors) ? data.non_field_errors[0] : '')
    || ''
  );
};

const STEP_PROMPT = 'prompt';
const STEP_VERIFY = 'verify';

const WhatsAppVerificationModal = ({ isOpen, onClose, onSuccess }) => {
  const { formatMessage } = useIntl();
  const baseUrl = getConfig().LMS_BASE_URL;
  const httpClient = getAuthenticatedHttpClient();

  const [step, setStep] = useState(STEP_PROMPT);

  // Phone + OTP state
  const [phone, setPhone] = useState('');
  const [otpValue, setOtpValue] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [otpForPhone, setOtpForPhone] = useState('');
  const [verificationKey, setVerificationKey] = useState('');
  const [resendInSeconds, setResendInSeconds] = useState(0);
  const [otpExpiresInSeconds, setOtpExpiresInSeconds] = useState(0);

  const [isSendingOtp, setIsSendingOtp] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [statusMessage, setStatusMessage] = useState('');

  // Reset verify state each time the verify step is entered
  useEffect(() => {
    if (step === STEP_VERIFY) {
      setPhone('');
      setOtpValue('');
      setOtpSent(false);
      setOtpForPhone('');
      setVerificationKey('');
      setResendInSeconds(0);
      setOtpExpiresInSeconds(0);
      setErrorMessage('');
      setStatusMessage('');
    }
  }, [step]);

  // Resend countdown
  useEffect(() => {
    if (resendInSeconds <= 0) {
      return undefined;
    }
    const id = setInterval(() => {
      setResendInSeconds((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(id);
  }, [resendInSeconds]);

  // OTP expiry countdown
  useEffect(() => {
    if (!otpSent || otpExpiresInSeconds <= 0) {
      return undefined;
    }
    const id = setInterval(() => {
      setOtpExpiresInSeconds((prev) => Math.max(0, prev - 1));
    }, 1000);
    return () => clearInterval(id);
  }, [otpSent, otpExpiresInSeconds]);

  const isOtpExpired = otpSent && otpExpiresInSeconds === 0;

  const handlePhoneChange = useCallback((value) => {
    setPhone(value);
    // Reset OTP state when phone changes
    setOtpSent(false);
    setOtpValue('');
    setOtpForPhone('');
    setVerificationKey('');
    setResendInSeconds(0);
    setErrorMessage('');
    setStatusMessage('');
  }, []);

  const handleSendOtp = useCallback(async () => {
    if (!isValidMobile(phone)) {
      setErrorMessage(formatMessage(messages['modal.whatsapp.error.invalidNumber']));
      return;
    }
    setErrorMessage('');
    setStatusMessage('');
    setIsSendingOtp(true);
    try {
      const result = await sendWhatsappOtp(phone);
      if (!result.success) {
        setErrorMessage(result.message || formatMessage(messages['modal.whatsapp.error.sendFailed']));
        return;
      }
      setOtpSent(true);
      setOtpForPhone(phone);
      setVerificationKey(result.verificationKey);
      setResendInSeconds(result.resendAfterSeconds);
      setOtpExpiresInSeconds(result.expiresInSeconds);
      setStatusMessage(result.message || formatMessage(messages['modal.whatsapp.status.otpSent']));
    } catch (err) {
      setErrorMessage(
        getBackendError(err) || formatMessage(messages['modal.whatsapp.error.sendFailed']),
      );
    } finally {
      setIsSendingOtp(false);
    }
  }, [phone, formatMessage]);

  const handleVerifyAndSave = useCallback(async () => {
    if (!isValidMobile(phone)) {
      setErrorMessage(formatMessage(messages['modal.whatsapp.error.invalidNumber']));
      return;
    }
    if (!otpSent || otpForPhone !== phone) {
      setErrorMessage(formatMessage(messages['modal.whatsapp.error.sendOtpFirst']));
      return;
    }
    if (isOtpExpired) {
      setErrorMessage(formatMessage(messages['modal.whatsapp.error.otpExpired']));
      return;
    }
    if (!otpValue) {
      setErrorMessage(formatMessage(messages['modal.whatsapp.error.enterOtp']));
      return;
    }
    setErrorMessage('');
    setStatusMessage('');
    setIsSaving(true);
    try {
      // Step 1: verify the OTP
      const verification = await verifyWhatsappOtp({
        phoneNumber: phone,
        otpCode: otpValue,
        verificationKey,
      });
      if (!verification.success) {
        setErrorMessage(
          verification.message || formatMessage(messages['modal.whatsapp.error.invalidOtp']),
        );
        return;
      }
      // Step 2: save phone number to ExtraRegistrationData
      const saved = await savePhoneNumber({ httpClient, baseUrl, phoneNumber: phone });
      if (!saved) {
        setErrorMessage(formatMessage(messages['modal.whatsapp.error.saveFailed']));
        return;
      }
      setStatusMessage(formatMessage(messages['modal.whatsapp.status.saved']));
      // Short delay so user sees the success message, then close
      setTimeout(() => {
        onSuccess();
      }, 1200);
    } catch (err) {
      setErrorMessage(
        getBackendError(err) || formatMessage(messages['modal.whatsapp.error.invalidOtp']),
      );
    } finally {
      setIsSaving(false);
    }
  }, [
    phone,
    otpSent,
    otpForPhone,
    isOtpExpired,
    otpValue,
    verificationKey,
    httpClient,
    baseUrl,
    formatMessage,
    onSuccess,
  ]);

  const canSendOtp = isValidMobile(phone) && !isSendingOtp && (!otpSent || resendInSeconds === 0);
  const canVerify = Boolean(otpValue) && otpSent && otpForPhone === phone && !isOtpExpired && !isSaving;

  const sendOtpLabel = () => {
    if (isSendingOtp) {
      return formatMessage(messages['modal.whatsapp.verify.sendingOtp']);
    }
    if (otpSent && resendInSeconds > 0) {
      return formatMessage(messages['modal.whatsapp.verify.resendOtpTimer'], { seconds: resendInSeconds });
    }
    if (otpSent) {
      return formatMessage(messages['modal.whatsapp.verify.resendOtp']);
    }
    return formatMessage(messages['modal.whatsapp.verify.sendOtp']);
  };

  return (
    <ModalDialog
      isOpen={isOpen}
      onClose={onClose}
      hasCloseButton
      title={step === STEP_PROMPT
        ? formatMessage(messages['modal.whatsapp.prompt.title'])
        : formatMessage(messages['modal.whatsapp.verify.title'])}
      className="whatsapp-verification-modal"
    >
      <ModalDialog.Header>
        <ModalDialog.Title>
          {step === STEP_PROMPT
            ? formatMessage(messages['modal.whatsapp.prompt.title'])
            : formatMessage(messages['modal.whatsapp.verify.title'])}
        </ModalDialog.Title>
      </ModalDialog.Header>

      <ModalDialog.Body>
        {step === STEP_PROMPT && (
          <p className="mb-0">
            {formatMessage(messages['modal.whatsapp.prompt.body'])}
          </p>
        )}

        {step === STEP_VERIFY && (
          <div>
            <p className="small text-muted mb-3">
              {formatMessage(messages['modal.whatsapp.verify.helper'])}
            </p>

            {/* Phone input — country code selector + number field side by side */}
            <div className="mb-2">
              <PhoneInput
                defaultCountry="in"
                value={phone}
                onChange={handlePhoneChange}
                className={`custom-whatsapp-phone-input${errorMessage && !otpSent ? ' is-invalid' : ''}`}
                inputProps={{
                  type: 'tel',
                  placeholder: formatMessage(messages['modal.whatsapp.verify.placeholder']),
                }}
              />
            </div>

            {/* Send OTP button */}
            <div className="mb-3">
              <Button
                variant="outline-primary"
                size="sm"
                onClick={handleSendOtp}
                disabled={!canSendOtp}
              >
                {sendOtpLabel()}
              </Button>
            </div>

            {/* OTP input — shown after OTP is sent */}
            {otpSent && (
              <div className="mb-2">
                <input
                  type="text"
                  className="whatsapp-otp-input form-control"
                  value={otpValue}
                  placeholder={formatMessage(messages['modal.whatsapp.verify.otpPlaceholder'])}
                  onChange={(e) => setOtpValue(e.target.value.replace(/\D/g, '').slice(0, 6))}
                  disabled={isOtpExpired}
                  maxLength={6}
                />
              </div>
            )}

            {/* Status / helper messages */}
            {statusMessage && !errorMessage && (
              <p className="small text-success mb-1">{statusMessage}</p>
            )}
            {otpSent && !canVerify && !errorMessage && (
              <p className="small text-muted mb-1">
                {isOtpExpired
                  ? formatMessage(messages['modal.whatsapp.helper.otpExpired'])
                  : formatMessage(messages['modal.whatsapp.helper.enterOtp'])}
              </p>
            )}

            {/* Error message */}
            {errorMessage && (
              <p className="small text-danger mb-1">{errorMessage}</p>
            )}
          </div>
        )}
      </ModalDialog.Body>

      <ModalDialog.Footer>
        {step === STEP_PROMPT && (
          <>
            <Button variant="tertiary" className="whatsapp-modal-footer-skip" onClick={onClose}>
              {formatMessage(messages['modal.whatsapp.prompt.skip'])}
            </Button>
            <Button variant="primary" onClick={() => setStep(STEP_VERIFY)}>
              {formatMessage(messages['modal.whatsapp.prompt.verifyNow'])}
            </Button>
          </>
        )}

        {step === STEP_VERIFY && (
          <>
            <Button variant="tertiary" className="whatsapp-modal-footer-skip" onClick={onClose}>
              {formatMessage(messages['modal.whatsapp.verify.cancel'])}
            </Button>
            <Button
              variant="primary"
              onClick={handleVerifyAndSave}
              disabled={!canVerify || isSaving}
            >
              {isSaving
                ? (
                  <>
                    <Spinner animation="border" size="sm" className="mr-2" />
                    {formatMessage(messages['modal.whatsapp.verify.saving'])}
                  </>
                )
                : formatMessage(messages['modal.whatsapp.verify.verifySave'])}
            </Button>
          </>
        )}
      </ModalDialog.Footer>
    </ModalDialog>
  );
};

WhatsAppVerificationModal.propTypes = {
  isOpen: PropTypes.bool.isRequired,
  onClose: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
};

export default WhatsAppVerificationModal;
