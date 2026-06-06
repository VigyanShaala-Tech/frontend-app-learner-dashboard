export const fetchAchievementsAll = async ({ httpClient, baseUrl }) => {
  const response = await httpClient.get(`${baseUrl}/api/v1/achievements/all/`);

  if (response.status === 200 && response.data) {
    return response.data;
  }

  return {
    stats: [],
    earned_badges: [],
    badges_in_progress: [],
  };
};
