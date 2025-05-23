const API_URL = "http://localhost:5000/api/courses";

export const getCourses = async () => (await fetch(API_URL)).json();
export const createCourse = async (course) =>
  (await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(course),
  })).json();
export const updateCourse = async (id, course) =>
  (await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(course),
  })).json();
export const deleteCourse = async (id) =>
  (await fetch(`${API_URL}/${id}`, { method: "DELETE" })).json();