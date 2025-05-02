import axios from 'axios';


const GET_USER_REPORTS_API_URL = process.env.GET_USER_REPORTS_API_URL; 

export const getUserReports = async (token) => {
  try {
    const response = await axios.get(API_URL, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data; 
  } catch (error) {
    console.error('Error fetching user reports:', error);
    throw error;  
  }
};
