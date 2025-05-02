export const getReports = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/reports');
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching reports:', error);
      return [];
    }
  };
  