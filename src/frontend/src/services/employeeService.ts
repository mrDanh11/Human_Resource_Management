import axios from 'axios';

const API_URL = 'http://localhost:5258/api/employee';

export const employee = {
    createEmployee: async (employee : any) => {
        const response = await axios.post(API_URL, employee);
        return response.data;
    }
}
