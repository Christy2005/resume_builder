import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

function FormPage() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
    github: "",
    skills: "",
    experience: "",
    education: "",
    template: "modern",
  });

  const [projects, setProjects] = useState([{ title: "", description: "" }]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleProjectChange = (index, e) => {
    const updated = [...projects];
    updated[index][e.target.name] = e.target.value;
    setProjects(updated);
  };

  const addProject = () => setProjects([...projects, { title: "", description: "" }]);
  const removeProject = (index) => setProjects(projects.filter((_, i) => i !== index));

  const generateResume = async () => {
    try {
      const response = await fetch("http://localhost:5000/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, projects }),
      });

      const data = await response.json();
      if (!response.ok) {
        alert(data.error || "Something went wrong");
        return;
      }
      navigate("/resume", { state: data });
    } catch (error) {
      alert("Server error");
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        <h1 style={{ textAlign: "center" }}>Resume Builder</h1>
        <input name="name" placeholder="Full Name" onChange={handleChange} style={styles.input} />
        <input name="phone" placeholder="Phone Number" onChange={handleChange} style={styles.input} />
        <input name="address" placeholder="Address" onChange={handleChange} style={styles.input} />
        <input name="github" placeholder="GitHub Link" onChange={handleChange} style={styles.input} />
        <input name="skills" placeholder="Skills (comma separated)" onChange={handleChange} style={styles.input} />
        <input name="experience" placeholder="Experience" onChange={handleChange} style={styles.input} />
        <input name="education" placeholder="Education" onChange={handleChange} style={styles.input} />

        <h3>Projects</h3>
        {projects.map((project, i) => (
          <div key={i} style={{ marginBottom: "10px" }}>
            <input
              name="title"
              placeholder="Project Title"
              value={project.title}
              onChange={(e) => handleProjectChange(i, e)}
              style={styles.input}
            />
            <input
              name="description"
              placeholder="Project Description"
              value={project.description}
              onChange={(e) => handleProjectChange(i, e)}
              style={styles.input}
            />
            {projects.length > 1 && (
              <button type="button" onClick={() => removeProject(i)} style={styles.removeBtn}>
                Remove
              </button>
            )}
          </div>
        ))}
        <button type="button" onClick={addProject} style={styles.addBtn}>
          Add Project
        </button>

        <button onClick={generateResume} style={styles.button}>
          Generate Resume
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: { background: "linear-gradient(to right, #2c3e50, #4ca1af)", height: "100vh", display: "flex", justifyContent: "center", alignItems: "center" },
  card: { background: "white", padding: "40px", borderRadius: "12px", width: "450px", boxShadow: "0 10px 25px rgba(0,0,0,0.2)" },
  input: { width: "100%", padding: "10px", margin: "8px 0", borderRadius: "6px", border: "1px solid #ccc" },
  button: { width: "100%", padding: "12px", marginTop: "15px", background: "#2c3e50", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" },
  addBtn: { padding: "8px 12px", marginBottom: "10px", background: "#4CAF50", color: "white", border: "none", borderRadius: "6px", cursor: "pointer" },
  removeBtn: { padding: "5px 10px", marginLeft: "10px", background: "#f44336", color: "white", border: "none", borderRadius: "6px", cursor: "pointer" },
};

export default FormPage;


