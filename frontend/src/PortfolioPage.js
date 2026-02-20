import React from "react";
import { useLocation, useNavigate } from "react-router-dom";

function PortfolioPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const resume = location.state;

  if (!resume) return <div>No resume data</div>;

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1>{resume.name}</h1>
        <p>{resume.phone}</p>
        <p>{resume.address}</p>
        <p>
          GitHub:{" "}
          <a
            href={resume.github}
            target="_blank"
            rel="noopener noreferrer"
            style={styles.githubLink}
          >
            {resume.github}
          </a>
        </p>
      </div>

      <div style={styles.section}>
        <h2>Professional Summary</h2>
        <p>{resume.summary}</p>
      </div>

      <div style={styles.section}>
        <h2>Skills</h2>
        <div style={styles.skills}>
          {resume.skills.map((skill, i) => (
            <span key={i} style={styles.skillBadge}>
              {skill}
            </span>
          ))}
        </div>
      </div>

      <div style={styles.section}>
        <h2>Experience</h2>
        <p>{resume.experience}</p>
      </div>

      <div style={styles.section}>
        <h2>Projects</h2>
        <div style={styles.projectGrid}>
          {resume.projects.map((project, i) => (
            <div key={i} style={styles.projectCard}>
              <h3>{project.title}</h3>
              <p>{project.description}</p>
              {project.impact && <p style={styles.impact}><strong>Impact:</strong> {project.impact}</p>}
            </div>
          ))}
        </div>
      </div>

      <div style={styles.section}>
        <h2>Education</h2>
        <p>{resume.education}</p>
      </div>

      <div style={styles.buttonContainer}>
        <button onClick={() => navigate("/resume")} style={styles.button}>
          Back to Resume
        </button>
      </div>
    </div>
  );
}

const styles = {
  container: {
    fontFamily: "'Roboto', sans-serif",
    background: "#f4f7f8",
    padding: "40px",
    minHeight: "100vh",
  },
  header: {
    textAlign: "center",
    marginBottom: "30px",
    background: "#2c3e50",
    color: "#fff",
    padding: "20px 40px",
    borderRadius: "10px",
  },
  githubLink: {
    color: "#4CAF50",
    textDecoration: "underline",
  },
  section: {
    marginBottom: "30px",
    padding: "20px",
    background: "#fff",
    borderRadius: "10px",
    boxShadow: "0 5px 15px rgba(0,0,0,0.1)",
  },
  skills: {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
  },
  skillBadge: {
    background: "#4CAF50",
    color: "#fff",
    padding: "5px 12px",
    borderRadius: "20px",
    fontSize: "0.9rem",
  },
  projectGrid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))",
    gap: "20px",
  },
  projectCard: {
    padding: "15px",
    background: "#f9f9f9",
    borderRadius: "10px",
    boxShadow: "0 4px 10px rgba(0,0,0,0.08)",
  },
  impact: {
    marginTop: "10px",
    fontStyle: "italic",
    color: "#555",
  },
  buttonContainer: {
    textAlign: "center",
    marginTop: "20px",
  },
  button: {
    padding: "10px 25px",
    background: "#2c3e50",
    color: "#fff",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    fontWeight: "bold",
    fontSize: "1rem",
  },
};

export default PortfolioPage;