import axios from 'axios';

const API_URL = 'http://localhost:5258/api/employee';

export const employeeService = {
    getAllEmployees: async (pageNumber = 1, pageSize = 5) => {
        const response = await axios.get(API_URL, {
            params: { pageNumber, pageSize }
        });
        return response.data;
    },
    
    getEmployeeById: async (id: number) => {
        const response = await axios.get(`${API_URL}/${id}`);
        return response.data;
    },

    createEmployee: async (employee : any) => {
        const response = await axios.post(API_URL, employee);
        return response.data;
    },

    updateEmployee: async (id: number, employee: any) => {
        const response = await axios.put(`${API_URL}/${id}`, employee);
        return response.data;
    },

    deleteEmployee: async (id: number) => {
        const response = await axios.delete(`${API_URL}/${id}`);
        return response.data;
    }
}
