import React, { useRef, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import html2pdf from "html2pdf.js";

function ResumePage() {
  const location = useLocation();
  const navigate = useNavigate();
  const resume = location.state;
  const resumeRef = useRef();
  const [analysis, setAnalysis] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Load Google Font
    const link = document.createElement("link");
    link.href = "https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap";
    link.rel = "stylesheet";
    document.head.appendChild(link);
  }, []);

  if (!resume) return <div>No resume data</div>;

  const downloadPDF = () => html2pdf().from(resumeRef.current).save("resume.pdf");

  const analyzeResume = async () => {
    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(resume),
      });
      const data = await response.json();
      setAnalysis(data);
    } catch {
      alert("Error analyzing resume");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.page}>
      <div ref={resumeRef} style={styles.resumeCard}>
        <div style={styles.leftPanel}>
          <h2 style={styles.name}>{resume.name}</h2>
          <p>{resume.phone}</p>
          <p>{resume.address}</p>
          <p>
            GitHub:{" "}
            <a href={resume.github} target="_blank" rel="noopener noreferrer" style={styles.githubLink}>
              {resume.github}
            </a>
          </p>
          <h3 style={styles.sectionTitle}>Skills</h3>
          <ul style={styles.list}>{resume.skills.map((s, i) => <li key={i}>{s}</li>)}</ul>
        </div>

        <div style={styles.rightPanel}>
          <h2 style={styles.sectionTitle}>Professional Summary</h2>
          <p>{resume.summary}</p>
          <h2 style={styles.sectionTitle}>Experience</h2>
          <p>{resume.experience}</p>
          <h2 style={styles.sectionTitle}>Projects</h2>
          {resume.projects.map((p, i) => (
            <div key={i} style={styles.projectCard}>
              <h3>{p.title}</h3>
              <p>{p.description}</p>
              {p.impact && <p><strong>Impact:</strong> {p.impact}</p>}
            </div>
          ))}
          <h2 style={styles.sectionTitle}>Education</h2>
          <p>{resume.education}</p>
        </div>
      </div>

      <div style={styles.buttons}>
        <button onClick={downloadPDF} style={styles.button}>Download PDF</button>
        <button onClick={analyzeResume} style={styles.button}>
          {loading ? "Analyzing..." : "Analyze Resume"}
        </button>
        <button onClick={() => navigate("/portfolio", { state: resume })} style={{ ...styles.button, background: "#4CAF50" }}>
          Generate Portfolio
        </button>
        <button onClick={() => navigate("/")} style={{ ...styles.button, background: "#888" }}>Back</button>
      </div>

      {analysis?.score && (
        <div style={styles.analysisCard}>
          <h2 style={{ textAlign: "center" }}>Resume Score: {analysis.score} / 100</h2>
          {analysis.suggestions?.length > 0 && (
            <div>
              <h3>Suggestions:</h3>
              <ul>{analysis.suggestions.map((item, i) => <li key={i}>{item}</li>)}</ul>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const styles = {
  page: { background: "#f2f4f7", padding: "40px", fontFamily: "'Roboto', sans-serif" },
  resumeCard: { maxWidth: "900px", margin: "auto", display: "flex", boxShadow: "0 8px 25px rgba(0,0,0,0.15)", background: "#fff", borderRadius: "12px", overflow: "hidden" },
  leftPanel: { width: "30%", background: "#2c3e50", color: "#fff", padding: "30px" },
  rightPanel: { width: "70%", padding: "40px" },
  name: { fontWeight: 700, fontSize: "24px", marginBottom: "10px" },
  sectionTitle: { color: "#2c3e50", marginTop: "25px", marginBottom: "10px" },
  list: { paddingLeft: "20px" },
  githubLink: { color: "#fff", textDecoration: "underline" },
  projectCard: { marginBottom: "15px", padding: "10px", borderLeft: "3px solid #4CAF50", background: "#f9f9f9", borderRadius: "6px" },
  buttons: { textAlign: "center", marginTop: "30px", display: "flex", justifyContent: "center", flexWrap: "wrap", gap: "10px" },
  button: { padding: "10px 20px", background: "#2c3e50", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" },
  analysisCard: { maxWidth: "800px", margin: "30px auto", background: "white", padding: "25px", borderRadius: "10px", boxShadow: "0 5px 15px rgba(0,0,0,0.1)" },
};

export default ResumePage;


/*import React, { useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import html2pdf from "html2pdf.js";

function ResumePage() {
  const { state: resume } = useLocation();
  const navigate = useNavigate();
  const resumeRef = useRef();
  const [loadingPortfolio, setLoadingPortfolio] = useState(false);

  if (!resume) return <div>No resume data</div>;

  const downloadPDF = () => html2pdf().from(resumeRef.current).save("resume.pdf");

  const generatePortfolio = async () => {
    setLoadingPortfolio(true);
    try {
      const response = await fetch("http://localhost:5000/portfolio", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(resume),
      });
      const data = await response.json();
      navigate("/portfolio", { state: data });
    } catch {
      alert("Portfolio generation failed");
    } finally {
      setLoadingPortfolio(false);
    }
  };

  return (
    <div style={{ background: "#f2f4f7", padding: "40px" }}>
      <div ref={resumeRef} style={{ maxWidth: "900px", margin: "auto", background: "white", display: "flex", boxShadow: "0 8px 25px rgba(0,0,0,0.15)" }}>
        <div style={{ width: "30%", background: "#2c3e50", color: "white", padding: "30px" }}>
          <h2>{resume.name}</h2>
          <p>{resume.phone}</p>
          <p>{resume.address}</p>
          <p>GitHub: <a href={resume.github} target="_blank" rel="noopener noreferrer" style={{ color: "#fff", textDecoration: "underline" }}>{resume.github}</a></p>
          <h3 style={{ marginTop: "30px" }}>Skills</h3>
          <ul>{resume.skills.map((s,i)=><li key={i}>{s}</li>)}</ul>
        </div>
        <div style={{ width: "70%", padding: "40px" }}>
          <h2>Professional Summary</h2><p>{resume.summary}</p>
          <h2>Experience</h2><p>{resume.experience}</p>
          <h2>Projects</h2>{resume.projects.map((p,i)=><div key={i}><h3>{p.title}</h3><p>{p.description}</p><strong>Impact:</strong> {p.impact}</div>)}
          <h2>Education</h2><p>{resume.education}</p>
        </div>
      </div>

      <div style={{ textAlign: "center", marginTop: "30px" }}>
        <button onClick={downloadPDF} style={buttonStyle}>Download PDF</button>
        <button onClick={generatePortfolio} style={{ ...buttonStyle, marginLeft: "10px", background: "#4CAF50" }}>{loadingPortfolio ? "Generating..." : "Generate Portfolio"}</button>
        <button onClick={() => navigate("/")} style={{ ...buttonStyle, marginLeft: "10px", background: "#888" }}>Back</button>
      </div>
    </div>
  );
}

const buttonStyle = { padding: "10px 20px", background: "#2c3e50", color: "white", border: "none", borderRadius: "6px", cursor: "pointer", fontWeight: "bold" };

export default ResumePage;*/