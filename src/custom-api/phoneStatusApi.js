const PHONE_STATUS_URL = '/api/v1/user/phone-status/';
const PHONE_STATUS_SKIP_URL = '/api/v1/user/phone-status/skip/';

export const checkPhoneStatus = async ({ httpClient, baseUrl }) => {
  try {
    const response = await httpClient.get(`${baseUrl}${PHONE_STATUS_URL}`);
    if (response.status === 200 && response.data) {
      return {
        hasPhoneNumber: Boolean(response.data.has_phone_number),
        shouldPrompt: Boolean(response.data.should_prompt),
      };
    }
  } catch (err) {
    // Fail-safe: don't block the user if the API is unavailable
  }
  return { hasPhoneNumber: true, shouldPrompt: false };
};

export const savePhoneNumber = async ({ httpClient, baseUrl, phoneNumber }) => {
  const response = await httpClient.post(
    `${baseUrl}${PHONE_STATUS_URL}`,
    { phone_number: phoneNumber },
    { headers: { 'Content-Type': 'application/json' } },
  );
  return response.status === 200;
};

export const skipPhonePrompt = async ({ httpClient, baseUrl }) => {
  try {
    await httpClient.post(
      `${baseUrl}${PHONE_STATUS_SKIP_URL}`,
      {},
      { headers: { 'Content-Type': 'application/json' } },
    );
  } catch (err) {
    // Fail-safe: skipping should never block the UI even if recording it fails
  }
};
