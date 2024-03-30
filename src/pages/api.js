import axios from 'axios';

const BASE_URL = 'http://localhost:8080';

export const getAllPlos = async () => {
  const response = await axios.get(`${BASE_URL}/Plo/getAllPlo`);
  return response.data;
};

export const addPlo = async (title) => {
  const response = await axios.post(`${BASE_URL}/Plo/addPlo`, { title });
  return response.data;
};

export const updatePlo = async (id, title) => {
  const response = await axios.put(`${BASE_URL}/Plo/updatePlo/${id}`, { title });
  return response.data;
};

export const deletePlo = async (id) => {
  const response = await axios.delete(`${BASE_URL}/Plo/deletePlo/${id}`);
  return response.data;
};

export const getRubricTypes = async () => {
  const response = await axios.get(`${BASE_URL}/RubricType/getRubricType`);
  return response.data;
};

export const addRubricType = async (rubricType) => {
  await axios.post(`${BASE_URL}/RubricType/addRubricType`, { rubric_type: rubricType });
};

export const updateRubricType = async (id, rubricType) => {
  await axios.put(`${BASE_URL}/RubricType/updateRubricType/${id}`, { rubric_type: rubricType });
};

export const deleteRubricType = async (id) => {
  await axios.delete(`${BASE_URL}/RubricType/deleteRubricType/${id}`);
};

export const addRubric = async (rubricData) => {
  const response = await fetch(`${BASE_URL}/Rubric/addRubric`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(rubricData)
  });
  const data = await response.json();
  return data;
};

export const updateRubric = async (rubricId, rubricData) => {
  const response = await fetch(`${BASE_URL}/Rubric/updateRubric/${rubricId}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(rubricData)
  });
  const data = await response.json();
  return data;
};

export const deleteRubric = async (rubricId) => {
  const response = await fetch(`${BASE_URL}/Rubric/deleteRubric/${rubricId}`, {
    method: 'DELETE'
  });
  const data = await response.json();
  return data;
};

export const getAllRubrics = async () => {
  const response = await fetch(`${BASE_URL}/Rubric/getAllRubrics`);
  const data = await response.json();
  return data;
};

export async function addRubricDetail(data) {
  const response = await fetch(`${BASE_URL}/RubricDetails/addRubricDetails`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  const responseData = await response.json();
  return responseData;
}

export async function updateRubricDetail(id, data) {
  const response = await fetch(`${BASE_URL}/RubricDetails/updateRubricDetails/${id}`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  const responseData = await response.json();
  return responseData;
}

export async function deleteRubricDetail(id) {
  const response = await fetch(`${BASE_URL}/RubricDetails/deleteRubricDetails/${id}`, {
    method: 'DELETE'
  });
  const responseData = await response.json();
  return responseData;
}

export async function getRubricDetails() {
  const response = await fetch(`${BASE_URL}/RubricDetails/getRubricDetails`);
  const responseData = await response.json();
  return responseData;
}