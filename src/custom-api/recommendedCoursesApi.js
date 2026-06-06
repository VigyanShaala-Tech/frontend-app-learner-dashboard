export const fetchRecommendedCourses = async ({ httpClient, baseUrl }) => {
  const response = await httpClient.get(`${baseUrl}/api/v1/dashboard/recommended-courses/`);

  if (response.status === 200 && Array.isArray(response.data)) {
    return response.data;
  }

  return [];
};
