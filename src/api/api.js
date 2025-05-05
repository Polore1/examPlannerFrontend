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

export const fetchRooms = async (token) => {
  const res = await fetch(`${BASE_URL}/rooms`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
     // adaugă asta doar dacă serverul are supports_credentials=True
  });

  if (!res.ok) {
    throw new Error("Eroare la preluarea sălilor");
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

export const setExaminationMethod = async (courseId, newMethod, token) => {
  try {
    const response = await fetch(`${BASE_URL}/courses/${courseId}/set-examination-method`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({ examination_method: newMethod }), // Trimiterea metodei de examinare
    });

    if (!response.ok) {
      const errorDetails = await response.text(); // Prinde mesajul de eroare
      console.error('Error response from server:', errorDetails);
      throw new Error('Nu s-a putut actualiza metoda de examinare');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error while updating examination method:', error);
    throw error; // Redirecționează eroarea mai departe pentru a fi gestionată
  }
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
      console.error('Eroare la actualizarea cursului:', error);
      throw error;
    }
  };
  
  // Functia pentru a seta metoda de examinare (PUT)
  export const updateExaminationMethod = async (courseId, newMethod, token) => {
    try {
      const response = await fetch(`${BASE_URL}/courses/${courseId}/set-examination-method`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ examination_method: newMethod }), // Trimiterea metodei de examinare
      });
  
      if (!response.ok) {
        const errorDetails = await response.text(); // Prinde mesajul de eroare
        console.error('Error response from server:', errorDetails);
        throw new Error('Nu s-a putut actualiza metoda de examinare');
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Error while updating examination method:', error);
      throw error; // Redirecționează eroarea mai departe pentru a fi gestionată
    }
  };

// Funcția pentru a actualiza detaliile unui curs
export const updateCourseDetails = async (courseId, updatedCourseDetails, token) => {
  try {
    const response = await fetch(`${BASE_URL}/courses/${courseId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(updatedCourseDetails),
    });

    if (!response.ok) {
      const errorDetails = await response.text(); // Prinde mesajul de eroare
      console.error('Error response from server:', errorDetails);
      throw new Error('Nu s-au putut actualiza detaliile cursului');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error while updating course details:', error);
    throw error; // Redirecționează eroarea mai departe pentru a fi gestionată
  }
};

  // Exemplu de funcție pentru obținerea examenelor grupului
  export const fetchExamsForGroup = async (token) => {
    try {
      const response = await fetch(`${BASE_URL}/exam/for/group`, {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
      });
  
      if (!response.ok) {
        throw new Error(`Server răspunde cu status: ${response.status}`);
      }
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error('Eroare API:', error);
      throw new Error('Eroare la obținerea examenelor. Detaliu: ' + error.message);
    }
  };

// Exemplu de funcție pentru propunerea unui examen
export const proposeExam = async (examData, token) => {
  if (!token) {
    throw new Error("Tokenul lipsește. Trebuie autentificare.");
  }

  const response = await fetch(`${BASE_URL}/exam/propose`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(examData)
  });

  if (!response.ok) {
    const errMsg = await response.json();
    console.error("Error response from server:", errMsg);
    throw new Error("A apărut o eroare necunoscută. Încercați din nou.");
  }

  return await response.json();
};

export const fetchExamDetails = async (examId, token) => {
  try {
    const response = await fetch(`${BASE_URL}/exam/${examId}`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (response.status === 404) {
      throw new Error('Examenul nu a fost găsit.');
    }

    if (response.status === 403) {
      throw new Error('Acces interzis pentru acest examen.');
    }

    if (!response.ok) {
      throw new Error(`Server răspunde cu status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Eroare API:', error);
    throw new Error('Eroare la obținerea detaliilor examenului. Detaliu: ' + error.message);
  }
};

//exams
export const fetchExaminationPeriods = async (token) => {
  try {
    const response = await fetch(`${BASE_URL}/settings/examination-periods`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json", // adaugă dacă backendul așteaptă
      },
    });

    if (!response.ok) {
      const errorBody = await response.text();
      console.error("Eroare 422 - detalii răspuns:", errorBody);
      throw new Error("Eroare la încărcarea perioadelor");
    }

    return await response.json();
  } catch (error) {
    console.error("Error in fetchExaminationPeriods:", error);
    throw new Error("Eroare la încărcarea perioadelor");
  }
};

export const deleteExaminationPeriod = async (id, token) => {
  try {
    const response = await fetch(`${BASE_URL}/settings/examination-periods/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Eroare la ștergere perioadă");
    }

  } catch (error) {
    console.error("deleteExaminationPeriod Error: ", error);
    throw error;
  }
};

export const addExaminationPeriod = async (period, token) => {
  try {
    const response = await fetch(`${BASE_URL}/settings/examination-periods`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(period),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Eroare la adăugare perioadă");
    }

    return await response.json();
  } catch (error) {
    console.error("addExaminationPeriod Error: ", error);
    throw error;
  }
};

export const updateExaminationPeriod = async (id, period, token) => {
  try {
    const response = await fetch(`${BASE_URL}/settings/examination-periods/${id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(period),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Eroare la actualizare perioadă");
    }

    return await response.json();
  } catch (error) {
    console.error("updateExaminationPeriod Error: ", error);
    throw error;
  }
};


export const getExaminationPeriodById = async (id, token) => {
  const response = await fetch(`${BASE_URL}/settings/examination-periods/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Nu s-a putut găsi perioada");
  }

  return response.json();
};

export const getExamProposals = async (token) => {
  try {
    const response = await fetch(`${BASE_URL}/exam/proposals`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Eroare la preluarea propunerilor: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Eroare în getExamProposals:", error);
    throw error;
  }
};