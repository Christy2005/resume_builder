const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => res.send("Resume Builder API is running 🚀"));

app.post("/generate", (req, res) => {
  try {
    const { name, phone, address, github, skills, projects, experience, education, template } = req.body;

    if (!name || !skills) return res.status(400).json({ error: "Name and Skills are required fields." });

    const skillsArray = skills.split(",").map(s => s.trim());

    let summary = "";
    if (template === "classic")
      summary = `${name} is a dedicated professional skilled in ${skillsArray.slice(0,3).join(", ")} with strong academic and practical background.`;
    else if (template === "minimal")
      summary = `Professional with expertise in ${skillsArray.slice(0,2).join(", ")}.`;
    else
      summary = `${name} is a motivated professional with experience in ${skillsArray.slice(0,3).join(", ")}.`;

    const resumeProjects = Array.isArray(projects) && projects.length > 0
      ? projects.map(p => ({
          title: p.title || "Untitled Project",
          description: p.description || "No description",
          impact: "Delivered scalable and impactful results through strong technical implementation."
        }))
      : [{
          title: "Personal Project",
          description: "No description provided",
          impact: "Delivered scalable and impactful results through strong technical implementation."
        }];

    const resume = { template: template || "modern", name, phone, address, github, summary, skills: skillsArray, experience, education, projects: resumeProjects };
    res.json(resume);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Server error while generating resume." });
  }
});

app.post("/analyze", (req, res) => {
  try {
    const resume = req.body;
    const suggestions = [];

    if (!resume.github || resume.github.trim() === "") suggestions.push("Add a GitHub profile link to showcase your projects.");
    if (!resume.skills || resume.skills.length < 3) suggestions.push("Include at least 3-5 strong technical skills.");
    if (!resume.experience || resume.experience.length < 50) suggestions.push("Describe your experience in more detail.");
    const hasNumbers = resume.experience?.match(/\d+/) || resume.projects?.some(p => p.description.match(/\d+/));
    if (!hasNumbers) suggestions.push("Add measurable achievements (numbers, percentages, metrics).");
    if (!resume.summary || resume.summary.length < 40) suggestions.push("Improve your professional summary to highlight strengths.");
    if (!resume.education || resume.education.length < 10) suggestions.push("Provide clearer education details including degree and institution.");
    if (suggestions.length === 0) suggestions.push("Your resume looks strong! Minor formatting improvements can make it even better.");

    let score = 0;
    if (resume.skills && resume.skills.length > 0) score += Math.min(resume.skills.length * 4, 20);
    if (resume.github && resume.github.trim() !== "") score += 10;
    if (resume.experience && resume.experience.length > 0) score += Math.min((resume.experience.length / 50) * 20, 20);
    const hasImpact = resume.projects?.some(p => p.impact && p.impact.length > 10);
    if (hasImpact) score += 20;
    if (resume.summary && resume.summary.length > 0) score += Math.min((resume.summary.length / 50) * 15, 15);
    if (resume.education && resume.education.length > 0) score += Math.min((resume.education.length / 10) * 15, 15);

    res.json({ score: Math.round(score), suggestions });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Error analyzing resume." });
  }
});

app.listen(5000, () => console.log("Server running on http://localhost:5000"));

