const NOTIFICATIONS_URL = '/api/v1/get/my/notifications/';

export const fetchNotifications = async ({ httpClient, baseUrl }) => {
  const response = await httpClient.get(`${baseUrl}${NOTIFICATIONS_URL}`);

  if (response.status === 200 && response.data) {
    return {
      haveNewNotification: Boolean(response.data.haveNewNotification),
      notifications: Array.isArray(response.data.notifications)
        ? response.data.notifications
        : [],
    };
  }

  return {
    haveNewNotification: false,
    notifications: [],
  };
};

export const checkoutNotifications = async ({ httpClient, baseUrl }) => {
  const response = await httpClient.post(
    `${baseUrl}${NOTIFICATIONS_URL}`,
    { checkedoutnewNotification: true },
    {
      headers: {
        'Content-Type': 'application/json',
      },
    },
  );

  return response.status === 200;
};
