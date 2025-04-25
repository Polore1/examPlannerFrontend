// src/api/api.js
import BASE_URL from "./config";

// Fetch: Obține cursurile utilizatorului
export const fetchCourses = async (token) => {
    const res = await fetch(`${BASE_URL}/courses`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    if (!res.ok) {
      throw new Error("Eroare la preluarea cursurilor. Cod de eroare: " + res.status);
    }
    return await res.json();
  };

// Logout: Deconectează utilizatorul
export const logout = async () => {
  const res = await fetch(`${BASE_URL}/logout`, {
    method: "GET",
    credentials: "include",
  });
  if (!res.ok) {
    throw new Error("Logout eșuat");
  }
  return true;
};

// PUT: Modifică detaliile unui examen
export const editExam = async (examId, examData, token) => {
  const res = await fetch(`${BASE_URL}/exam/edit/${examId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(examData), // datele examenului pe care le actualizezi
  });
  if (!res.ok) {
    throw new Error("Eroare la actualizarea examenului");
  }
  return await res.json();
};

// GET: Obține examenele pentru grupul utilizatorului
export const getExamsForGroup = async (token) => {
  const res = await fetch(`${BASE_URL}/exam/for/group`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    throw new Error("Eroare la preluarea examenelor");
  }
  return await res.json();
};

// GET: Obține examenele în așteptare
export const getPendingExams = async (token) => {
  const res = await fetch(`${BASE_URL}/exam/pending`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    throw new Error("Eroare la preluarea examenelor în așteptare");
  }
  return await res.json();
};

// POST: Propune o dată pentru un examen
export const proposeExamDate = async (examId, proposedDate, token) => {
  const res = await fetch(`${BASE_URL}/exam/propose`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ examId, proposedDate }), // ID-ul examenului și data propusă
  });
  if (!res.ok) {
    throw new Error("Eroare la propunerea unei date pentru examen");
  }
  return await res.json();
};

// PUT: Acceptă sau respinge propunerea de examen
export const reviewExamProposal = async (examId, status, token) => {
  const res = await fetch(`${BASE_URL}/exam/review`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ examId, status }), // ID-ul examenului și statusul (acceptat/respins)
  });
  if (!res.ok) {
    throw new Error("Eroare la revizuirea propunerii de examen");
  }
  return await res.json();
};

// GET: Obține detaliile unui examen
export const getExamDetails = async (examId, token) => {
  const res = await fetch(`${BASE_URL}/exam/${examId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  if (!res.ok) {
    throw new Error("Eroare la preluarea detaliilor examenului");
  }
  return await res.json();
};

// PATCH: Modifică data unui examen respins
export const updateExamDate = async (examId, newDate, token) => {
  const res = await fetch(`${BASE_URL}/exam/${examId}/update-date`, {
    method: "PATCH",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ newDate }), // Noua dată pentru examen
  });
  if (!res.ok) {
    throw new Error("Eroare la actualizarea datei examenului");
  }
  return await res.json();
};

export const setExaminationMethod = (courseId, newMethod, token) => {
    return fetch(`/courses/${courseId}/set-examination-method`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ examination_method: newMethod }), // Trimiterea metodei de examinare
    })
    .then((response) => {
      if (!response.ok) {
        throw new Error('Nu s-a putut actualiza metoda de examinare');
      }
      return response.json();
    });
  };


  export const fetchCourseDetails = async (id, token) => {
    try {
      const response = await fetch(`${BASE_URL}/courses/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
  
      if (!response.ok) {
        throw new Error(`Error: ${response.status} ${response.statusText}`);
      }
  
      return await response.json();
    } catch (error) {
      console.error("Error fetching course details:", error);
      throw error;
    }
  };

  // Functia pentru a edita un curs (PUT)
  export const updateCourse = async (courseId, updatedData, token) => {
    try {
      const response = await fetch(`${API_URL}/courses/${courseId}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedData),
      });
  
      if (!response.ok) {
        throw new Error('Nu s-au putut actualiza detaliile cursului');
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      throw error;
    }
  };
  
  // Functia pentru a seta metoda de examinare (PUT)
  export const updateExaminationMethod = async (courseId, examinationMethod, token) => {
    try {
      const response = await fetch(`${API_URL}/courses/${courseId}/set-examination-method`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ examination_method: examinationMethod }),
      });
  
      if (!response.ok) {
        throw new Error('Nu s-a putut seta metoda de examinare');
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      throw error;
    }
  };

  export const updateCourseDetails = (courseId, updatedCourseDetails, token) => {
    return fetch(`/api/courses/${courseId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(updatedCourseDetails),
    }).then(response => response.json());
  };
  