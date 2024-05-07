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

export async function getRubricTypeRubrics(id) {
  const response = await fetch(`${BASE_URL}/RubricType/getRubricTypeRubrics`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ id })
  });
  const responseData = await response.json();
  return responseData;
}

export async function addReportMarking(data) {
  const response = await fetch(`${BASE_URL}/Marking/addMarking`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  const responseData = await response.json();
  return responseData;
}

export async function getMarking(data) {
  const response = await fetch(`${BASE_URL}/Marking/getMarking`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  const responseData = await response.json();
  return responseData;
}

export async function updateMarking(data) {
  const response = await fetch(`${BASE_URL}/Marking/updateMarking`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  });
  const responseData = await response.json();
  return responseData;
}

export async function getMeetingDetails(id) {
  const response = await axios.get(`${BASE_URL}/Meeting/getMeetingDetails/${id}`);
  return response.data;
}

export async function updateMeetingWorkStatus(data) {
  const response = await axios.post(`${BASE_URL}/MeetingAssignedWork/updateMeetingWorkStatus`, data);
  return response.data;
}

export async function showAssignedWorkByBatch(batch_id) {
  const response = await axios.post(`${BASE_URL}/AssignedWork/showAssignedWorkByBatch`, { batch_id });
  return response.data;
}

export async function submitProjectIdea(data) {
  const response = await axios.post(`${BASE_URL}/Ideas/create`, data);
  return response.data;
}

export async function getIdeaDetails(data) {
  const response = await axios.post(`${BASE_URL}/Ideas/getIdeaDetails`, data);
  return response.data;
}

export async function updateIdea(data) {
  const response = await axios.put(`${BASE_URL}/Ideas/updateIdeaDetails`, data);
  return response.data;
}

export async function getAllIdeas() {
  const response = await axios.get(`${BASE_URL}/Ideas/getAllIdeas`);
  return response.data;
}

export async function getIdea(id) {
  const response = await axios.get(`${BASE_URL}/Ideas/getIdeaDetails/${id}`);
  return response.data;
}

export async function createRequestForSupervison(data) {
  const response = await axios.post(`${BASE_URL}/IdeaRequest/createRequest`, data);
  return response.data;
}

export async function getIdeaSupervisonRequests(ideaId) {
  const response = await axios.get(`${BASE_URL}/IdeaRequest/getIdeaSupervisonRequests/${ideaId}`);
  return response.data;
}

export async function assignIdeaSupervisor(data) {
  const response = await axios.put(`${BASE_URL}/Ideas/assignIdeaSupervisor`, data);
  return response.data;
}

// get all rubric types
export async function getAllRubricTypes() {
  const response = await axios.get(`${BASE_URL}/RubricType/getAllRubricTypes`);
  return response.data;
}

// create report type
export async function createReportType(data) {
  const response = await axios.post(`${BASE_URL}/ReportType/createReport`, data);
  return response.data;
}

export async function getReportRubricMapping() {
  const response = await axios.get(`${BASE_URL}/RubricReportMapping/getRubricReportMapping`);
  return response.data;
}

export async function deleteReportType(reportId) {
  const response = await axios.delete(`${BASE_URL}/ReportType/deleteReportType/${reportId}`);
  return response.data;
}

export async function updateReportType(reportId, data) {
  const response = await axios.put(`${BASE_URL}/ReportType/updateReportType/${reportId}`, data);
  return response.data;
}

export async function getReportType(reportId) {
  const response = await axios.get(`${BASE_URL}/ReportType/getReportType/${reportId}`);
  return response.data;
}

export async function getReportWithRubric(reportId) {
  const response = await axios.get(`${BASE_URL}/RubricReportMapping/getSingleRubricReportMapping/${reportId}`);
  return response.data;
}

export async function getAssignedWork(reportId) {
  const response = await axios.get(`${BASE_URL}/AssignedWork/getAssignedWork/${reportId}`);
  return response.data;
}

export async function updateSubmittedFileEvaluation(id, data) {
  const response = await axios.put(`${BASE_URL}/saveGroupFiles/updateSubmittedFileEvaluation/${id}`, data);
  return response.data;
}

export async function getStudentWithGroup(id) {
  const response = await axios.get(`${BASE_URL}/Student/showStudentWithGroupByCMS/${id}`);
  return response.data;
}

export async function getGradedWork(id) {
  const response = await axios.get(`${BASE_URL}/AssignedWork/getGradedWork/${id}`);
  return response.data;
}

export async function getEvaluatedReports(id) {
  const response = await axios.get(`${BASE_URL}/AssignmentEvaluation/getAssignmentEvaluation/${id}`);
  return response.data;
}
