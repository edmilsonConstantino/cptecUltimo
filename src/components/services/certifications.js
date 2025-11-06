import axios from "axios";
const BASE_URL = "https://cestificacoesiso-back.onrender.com"; 
// const BASE_URL = "http://127.0.0.1:8000"; 
const API_URL = `${BASE_URL}/api/certifications/`;

export default {
  async getAll() {
    try {
      const response = await axios.get(API_URL);
      return response.data;
    } catch (error) {
      console.error("Erro ao buscar certificações:", error);
      throw error;
    }
  },

  async create(certData) {
    try {
      const response = await axios.post(API_URL, certData);
      return response.data;
    } catch (error) {
      console.error("Erro ao criar certificação:", error);
      throw error;
    }
  },

  async getById(id) {
    try {
      const response = await axios.get(`${API_URL}${id}/`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar certificação com id ${id}:`, error);
      throw error;
    }
  },
  async getByUniqueLink(uniqueLink) {
    try {
      const response = await axios.get(`${API_URL}link/${uniqueLink}/`);
      return response.data;
    } catch (error) {
      console.error(`Erro ao buscar certificação com link único ${uniqueLink}:`, error);
      throw error;
    }
  }
};
