import React, { useState } from 'react';
import './index.css';

function App() {
  const [theme, setTheme] = useState('light');
  const [loading, setLoading] = useState(false);
  const [portfolioData, setPortfolioData] = useState(null);
  
  const [formData, setFormData] = useState({
    name: '',
    role: '',
    about: '',
    skills: '',
    projects: [{ title: '', description: '' }],
    education: [{ degree: '', institution: '', year: '' }],
    experience: [{ role: '', company: '', duration: '', description: '' }],
    certifications: '',
    achievements: '',
    hobbies: '',
    photo: '',
    email: '',
    github: '',
    linkedin: ''
  });

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Helper for Projects, Education, Experience
  const handleArrayChange = (field, index, subField, value) => {
    const newArray = [...formData[field]];
    newArray[index][subField] = value;
    setFormData(prev => ({ ...prev, [field]: newArray }));
  };

  const addItem = (field, template) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...prev[field], template]
    }));
  };

  const removeItem = (field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const generatePortfolio = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Split strings to arrays for API
      const payload = {
        ...formData,
        certifications: formData.certifications ? formData.certifications.split(',').map(s => s.trim()) : [],
        achievements: formData.achievements ? formData.achievements.split(',').map(s => s.trim()) : [],
        hobbies: formData.hobbies
      };

      const response = await fetch('https://ai-portfolio-generator-backend-a744.onrender.com/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();
      if (data.success) {
        setPortfolioData(data.data);
      } else {
        alert('Failed to generate portfolio');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error connecting to backend server. Make sure it is running on port 5001.');
    } finally {
      setLoading(false);
    }
  };

  const downloadPortfolio = () => {
    if (!portfolioData) return;

    const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${portfolioData.name} - Portfolio</title>
    <style>
        :root {
            --primary: #4f46e5;
            --secondary: #ec4899;
            --dark: #0f172a;
            --light: #f8fafc;
            --text: #334155;
            --white: #ffffff;
            --card-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05);
        }
        
        * { box-sizing: border-box; margin: 0; padding: 0; scroll-behavior: smooth; }
        
        body { 
            font-family: 'Inter', system-ui, -apple-system, sans-serif; 
            line-height: 1.6; 
            color: var(--text); 
            background: var(--light); 
        }

        /* Navigation */
        nav { 
            background: rgba(255, 255, 255, 0.9); 
            backdrop-filter: blur(10px);
            position: sticky; 
            top: 0; 
            z-index: 100;
            border-bottom: 1px solid #e2e8f0;
        }
        
        .nav-container { 
            max-width: 1200px; 
            margin: 0 auto; 
            padding: 1rem 2rem; 
            display: flex; 
            justify-content: space-between; 
            align-items: center; 
        }
        
        .logo { 
            font-weight: 800; 
            font-size: 1.5rem; 
            background: linear-gradient(135deg, var(--primary), var(--secondary));
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
            text-decoration: none;
        }
        
        .nav-links { display: flex; gap: 1.5rem; }
        
        .nav-links a { 
            color: var(--text); 
            text-decoration: none; 
            font-weight: 500; 
            transition: color 0.2s; 
            font-size: 0.9rem;
        }
        
        .nav-links a:hover { color: var(--primary); }

        /* General Styles */
        section { padding: 5rem 2rem; }
        .container { max-width: 1200px; margin: 0 auto; }
        
        .section-title { 
            font-size: 2.25rem; 
            font-weight: 800; 
            color: var(--dark); 
            margin-bottom: 3rem; 
            text-align: center; 
            position: relative;
        }
        
        .section-title::after {
            content: '';
            display: block;
            width: 60px;
            height: 4px;
            background: linear-gradient(to right, var(--primary), var(--secondary));
            margin: 1rem auto 0;
            border-radius: 2px;
        }

        .btn { 
            display: inline-block; 
            padding: 0.75rem 1.5rem; 
            border-radius: 9999px; 
            text-decoration: none; 
            font-weight: 600; 
            transition: all 0.2s; 
        }
        
        .btn-primary { 
            background: linear-gradient(135deg, var(--primary), var(--secondary));
            color: white; 
            box-shadow: 0 4px 15px rgba(79, 70, 229, 0.3); 
        }
        
        .btn-primary:hover { 
            transform: translateY(-2px); 
            box-shadow: 0 8px 25px rgba(79, 70, 229, 0.4); 
        }

        /* Hero */
        .hero { 
            padding: 8rem 2rem; 
            text-align: center; 
            background: radial-gradient(circle at top right, #e0e7ff 0%, transparent 40%),
                        radial-gradient(circle at bottom left, #fce7f3 0%, transparent 40%);
        }
        
        .profile-img {
            width: 150px;
            height: 150px;
            border-radius: 50%;
            object-fit: cover;
            margin-bottom: 2rem;
            border: 4px solid white;
            box-shadow: 0 10px 25px rgba(0,0,0,0.1);
        }
        
        .hero h1 { 
            font-size: 3.5rem; 
            color: var(--dark); 
            margin-bottom: 1.5rem; 
            line-height: 1.1;
            font-weight: 800;
        }

        /* About */
        .about-card {
            background: var(--white);
            padding: 3rem;
            border-radius: 2rem;
            box-shadow: var(--card-shadow);
            max-width: 900px;
            margin: 0 auto;
            text-align: center;
        }

        /* Skills & Hobbies */
        .skills-grid { 
            display: flex; 
            flex-wrap: wrap; 
            gap: 1rem; 
            justify-content: center; 
            max-width: 800px;
            margin: 0 auto;
        }
        
        .skill-tag { 
            background: var(--white); 
            color: var(--primary); 
            padding: 0.75rem 1.5rem; 
            border-radius: 1rem; 
            font-weight: 600; 
            box-shadow: 0 2px 4px rgba(0,0,0,0.05);
            border: 1px solid #e2e8f0;
        }

        /* Projects */
        .projects-grid { 
            display: grid; 
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); 
            gap: 2rem; 
        }
        
        .project-card { 
            background: var(--white); 
            border-radius: 1.5rem; 
            padding: 2rem; 
            box-shadow: var(--card-shadow); 
            border: 1px solid #f1f5f9;
            transition: transform 0.2s;
        }
        
        .project-card:hover { transform: translateY(-5px); }
        
        .project-title { font-size: 1.25rem; font-weight: 700; color: var(--dark); margin-bottom: 0.5rem; }

        /* Timeline (Experience & Education) */
        .timeline {
            max-width: 800px;
            margin: 0 auto;
            position: relative;
        }
        
        .timeline-item {
            padding-left: 3rem;
            border-left: 2px solid #e2e8f0;
            position: relative;
            padding-bottom: 3rem;
        }
        
        .timeline-item::before {
            content: '';
            width: 16px;
            height: 16px;
            background: var(--primary);
            border: 4px solid var(--white);
            border-radius: 50%;
            position: absolute;
            left: -9px;
            top: 0;
            box-shadow: 0 0 0 4px rgba(79, 70, 229, 0.1);
        }
        
        .timeline-date {
            color: var(--secondary);
            font-weight: 600;
            margin-bottom: 0.5rem;
            font-size: 0.875rem;
            text-transform: uppercase;
            letter-spacing: 1px;
        }

        /* Achievements & Certifications Grid */
        .grid-3 {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
            gap: 2rem;
        }
        
        .card-box {
            background: white;
            padding: 1.5rem;
            border-radius: 1rem;
            display: flex;
            align-items: center;
            gap: 1rem;
            box-shadow: var(--card-shadow);
        }

        /* Contact */
        .contact { 
            background: var(--dark); 
            color: white; 
            text-align: center;
        }
        .contact .section-title { color: white; }
        .social-links { 
            display: flex; 
            justify-content: center; 
            gap: 1.5rem; 
            margin-top: 2rem; 
        }
        .social-btn {
            background: rgba(255,255,255,0.1);
            color: white;
            padding: 0.75rem 1.5rem;
            border-radius: 9999px;
            text-decoration: none;
            backdrop-filter: blur(5px);
            border: 1px solid rgba(255,255,255,0.1);
        }
        
        .social-btn:hover {
            background: white;
            color: var(--primary);
            transform: translateY(-3px);
        }

        footer { 
            background: #020617; 
            color: #94a3b8; 
            padding: 3rem 0; 
            text-align: center; 
            font-size: 0.9rem; 
            border-top: 1px solid #1e293b;
        }

        @media (max-width: 768px) {
            .hero h1 { font-size: 2.5rem; }
            .nav-container { flex-direction: column; gap: 1rem; }
            .nav-links { flex-wrap: wrap; justify-content: center; }
        }
    </style>
</head>
<body>
    <!-- Navigation -->
    <nav>
        <div class="nav-container">
            <a href="#" class="logo">${portfolioData.name}</a>
            <div class="nav-links">
                <a href="#about">About</a>
                <a href="#projects">Work</a>
                <a href="#experience">Experience</a>
                <a href="#contact">Contact</a>
            </div>
        </div>
    </nav>

    <!-- Hero / Home -->
    <header class="hero" id="home">
        <div class="container">
            ${portfolioData.photo ? `<img src="${portfolioData.photo}" alt="${portfolioData.name}" class="profile-img">` : ''}
            <h1>Hello, I'm ${portfolioData.name}<br><span style="color: var(--primary); font-size: 0.6em;">${portfolioData.role}</span></h1>
            <p style="font-size: 1.25rem; color: var(--text); margin-bottom: 2rem; max-width: 600px; margin-left: auto; margin-right: auto;">
                Crafting digital experiences with passion and precision.
            </p>
            <div style="display: flex; gap: 1rem; justify-content: center;">
                <a href="#projects" class="btn btn-primary">My Work</a>
                <a href="#contact" class="btn" style="background: white; border: 1px solid #e2e8f0; color: var(--text);">Contact Me</a>
            </div>
        </div>
    </header>

    <!-- About Me -->
    <section id="about">
        <div class="container">
            <h2 class="section-title">About Me</h2>
            <div class="about-card">
                <p style="font-size: 1.15rem; line-height: 1.8;">${portfolioData.about}</p>
            </div>
        </div>
    </section>

    <!-- Skills -->
    <section id="skills" style="background: white;">
        <div class="container">
            <h2 class="section-title">Technical Expertise</h2>
            <div class="skills-grid">
                ${(portfolioData.skills || []).map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
            </div>
        </div>
    </section>

    <!-- Projects -->
    <section id="projects">
        <div class="container">
            <h2 class="section-title">Featured Projects</h2>
            <div class="projects-grid">
                ${(portfolioData.projects || []).map(project => `
                    <div class="project-card">
                        <div style="height: 160px; background: linear-gradient(135deg, #e0e7ff 0%, #f3e8ff 100%); border-radius: 1rem; margin-bottom: 1.5rem; display: flex; align-items: center; justify-content: center; font-size: 2.5rem;">🚀</div>
                        <h3 class="project-title">${project.title}</h3>
                        <p style="color: #64748b; font-size: 0.95rem;">${project.description}</p>
                    </div>
                `).join('')}
            </div>
        </div>
    </section>

    <!-- Experience / Learning Journey -->
    <section id="experience" style="background: white;">
        <div class="container">
            <h2 class="section-title">Experience & Journey</h2>
            <div class="timeline">
                ${(portfolioData.experience || []).map(exp => `
                <div class="timeline-item">
                    <div class="timeline-date">${exp.duration}</div>
                    <h3 style="font-weight: 700; color: var(--dark);">${exp.role}</h3>
                    <h4 style="font-size: 0.9rem; color: var(--primary); margin-bottom: 0.5rem;">${exp.company}</h4>
                    <p style="color: var(--text);">${exp.description}</p>
                </div>
                `).join('')}
            </div>
        </div>
    </section>

    <!-- Education -->
    <section id="education">
        <div class="container">
            <h2 class="section-title">Education</h2>
            <div class="timeline">
                ${(portfolioData.education || []).map(edu => `
                <div class="timeline-item">
                    <div class="timeline-date">${edu.year}</div>
                    <h3 style="font-weight: 700; color: var(--dark);">${edu.degree}</h3>
                    <p style="color: var(--text);">${edu.institution}</p>
                </div>
                `).join('')}
            </div>
        </div>
    </section>

    <!-- Achievements / Certifications -->
    <section id="achievements" style="background: white;">
        <div class="container">
            <h2 class="section-title">Achievements & Certifications</h2>
            <div class="grid-3">
                 ${(portfolioData.achievements || []).map(ach => `
                <div class="card-box">
                    <div style="font-size: 2rem;">🏆</div>
                    <div>
                        <h4 style="font-weight: 700; color: var(--dark);">Achievement</h4>
                        <p style="font-size: 0.9rem;">${ach}</p>
                    </div>
                </div>
                `).join('')}
                ${(portfolioData.certifications || []).map(cert => `
                <div class="card-box">
                    <div style="font-size: 2rem;">📜</div>
                    <div>
                        <h4 style="font-weight: 700; color: var(--dark);">Certification</h4>
                        <p style="font-size: 0.9rem;">${cert}</p>
                    </div>
                </div>
                `).join('')}
            </div>
        </div>
    </section>

    <!-- Hobbies / Interests -->
    <section id="hobbies">
        <div class="container">
            <h2 class="section-title">Interests & Hobbies</h2>
            <div class="skills-grid">
                 ${(portfolioData.hobbies || []).map(hobby => `<span class="skill-tag" style="background:#fce7f3; color: var(--secondary);">${hobby}</span>`).join('')}
            </div>
        </div>
    </section>

    <!-- Services -->
    <section id="services">
        <div class="container">
            <h2 class="section-title">What I Can Do</h2>
            <div class="grid-3">
                <div class="card-box" style="display:block; text-align:center;">
                    <h3 style="font-size: 1.25rem; font-weight: 700; margin-bottom: 1rem; color: var(--dark);">Web Development</h3>
                    <p style="color: var(--text);">Building fast, responsive, and secure websites.</p>
                </div>
                <div class="card-box" style="display:block; text-align:center;">
                    <h3 style="font-size: 1.25rem; font-weight: 700; margin-bottom: 1rem; color: var(--dark);">Backend Systems</h3>
                    <p style="color: var(--text);">Designing robust APIs and architectures.</p>
                </div>
                <div class="card-box" style="display:block; text-align:center;">
                    <h3 style="font-size: 1.25rem; font-weight: 700; margin-bottom: 1rem; color: var(--dark);">UI/UX Design</h3>
                    <p style="color: var(--text);">Creating intuitive and beautiful interfaces.</p>
                </div>
            </div>
        </div>
    </section>

    <!-- Contact -->
    <section id="contact" class="contact">
        <div class="container">
            <h2 class="section-title">Let's Work Together</h2>
            <p style="font-size: 1.25rem; opacity: 0.9; margin-bottom: 3rem; max-width: 600px; margin-left: auto; margin-right: auto;">
                Interested in collaboration? Reach out to me and let's discuss your next project.
            </p>
            
            <div class="social-links">
                ${portfolioData.contact.email ? `<a href="mailto:${portfolioData.contact.email}" class="social-btn">Email Me</a>` : ''}
                ${portfolioData.contact.github ? `<a href="${portfolioData.contact.github}" target="_blank" class="social-btn">GitHub</a>` : ''}
                ${portfolioData.contact.linkedin ? `<a href="${portfolioData.contact.linkedin}" target="_blank" class="social-btn">LinkedIn</a>` : ''}
            </div>
        </div>
    </section>

    <footer>
        <div class="container">
            <p>&copy; ${new Date().getFullYear()} ${portfolioData.name}. All rights reserved.</p>
        </div>
    </footer>
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'portfolio.html';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="container">
      <header className="header">
        <h1>✨ AI Portfolio Generator</h1>
        <div className="controls">
            {portfolioData && (
                <button onClick={downloadPortfolio} className="btn btn-download" style={{ marginRight: '1rem' }}>
                    Download Portfolio
                </button>
            )}
            <label className="switch">
            <input type="checkbox" onChange={toggleTheme} checked={theme === 'dark'} />
            <span className="slider"></span>
            </label>
        </div>
      </header>

      <div className={`grid ${portfolioData ? 'grid-2' : ''}`}>
        {/* Input Form */}
        <div className="card">
          <h2>Create Your Portfolio</h2>
          <form onSubmit={generatePortfolio}>
            <div className="form-group">
              <label>Full Name</label>
              <input
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                required
                placeholder="e.g. John Doe"
              />
            </div>

            <div className="form-group">
              <label>Current Role</label>
              <input
                name="role"
                value={formData.role}
                onChange={handleInputChange}
                required
                placeholder="e.g. Full Stack Developer"
              />
            </div>
            
            <div className="form-group">
                <label>Profile Photo URL</label>
                <input
                    name="photo"
                    placeholder="https://example.com/photo.jpg"
                    value={formData.photo}
                    onChange={handleInputChange}
                />
            </div>

            <div className="form-group">
              <label>About Me</label>
              <textarea
                name="about"
                value={formData.about}
                onChange={handleInputChange}
                required
                rows="4"
                placeholder="Write a brief introduction..."
              />
            </div>

            <div className="form-group">
              <label>Skills (Comma separated)</label>
              <input
                name="skills"
                value={formData.skills}
                onChange={handleInputChange}
                placeholder="React, Node.js, Python, Design..."
              />
            </div>

            <div className="form-group">
              <label>Projects</label>
              {formData.projects.map((project, index) => (
                <div key={index} style={{ marginBottom: '1rem', padding: '1rem', border: '1px solid var(--border-color)', borderRadius: '0.5rem' }}>
                  <input
                    placeholder="Project Title"
                    value={project.title}
                    onChange={(e) => handleArrayChange('projects', index, 'title', e.target.value)}
                    style={{ marginBottom: '0.5rem' }}
                  />
                  <textarea
                    placeholder="Project Description"
                    value={project.description}
                    onChange={(e) => handleArrayChange('projects', index, 'description', e.target.value)}
                    rows="2"
                  />
                  {formData.projects.length > 1 && (
                    <button type="button" onClick={() => removeItem('projects', index)} style={{ color: 'red', marginTop: '0.5rem', background: 'none', border: 'none', cursor: 'pointer' }}>
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button type="button" onClick={() => addItem('projects', { title: '', description: '' })} className="btn btn-outline" style={{ width: '100%' }}>
                + Add Project
              </button>
            </div>

            <div className="form-group">
              <label>Experience</label>
              {formData.experience.map((exp, index) => (
                <div key={index} style={{ marginBottom: '1rem', padding: '1rem', border: '1px solid var(--border-color)', borderRadius: '0.5rem' }}>
                  <input
                    placeholder="Role"
                    value={exp.role}
                    onChange={(e) => handleArrayChange('experience', index, 'role', e.target.value)}
                    style={{ marginBottom: '0.5rem' }}
                  />
                  <input
                    placeholder="Company"
                    value={exp.company}
                    onChange={(e) => handleArrayChange('experience', index, 'company', e.target.value)}
                    style={{ marginBottom: '0.5rem' }}
                  />
                  <input
                    placeholder="Duration/Year"
                    value={exp.duration}
                    onChange={(e) => handleArrayChange('experience', index, 'duration', e.target.value)}
                    style={{ marginBottom: '0.5rem' }}
                  />
                  <textarea
                    placeholder="Description"
                    value={exp.description}
                    onChange={(e) => handleArrayChange('experience', index, 'description', e.target.value)}
                    rows="2"
                  />
                  {formData.experience.length > 1 && (
                    <button type="button" onClick={() => removeItem('experience', index)} style={{ color: 'red', marginTop: '0.5rem', background: 'none', border: 'none', cursor: 'pointer' }}>
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button type="button" onClick={() => addItem('experience', { role: '', company: '', duration: '', description: '' })} className="btn btn-outline" style={{ width: '100%' }}>
                + Add Experience
              </button>
            </div>

            <div className="form-group">
              <label>Education</label>
              {formData.education.map((edu, index) => (
                <div key={index} style={{ marginBottom: '1rem', padding: '1rem', border: '1px solid var(--border-color)', borderRadius: '0.5rem' }}>
                  <input
                    placeholder="Degree"
                    value={edu.degree}
                    onChange={(e) => handleArrayChange('education', index, 'degree', e.target.value)}
                    style={{ marginBottom: '0.5rem' }}
                  />
                  <input
                    placeholder="Institution"
                    value={edu.institution}
                    onChange={(e) => handleArrayChange('education', index, 'institution', e.target.value)}
                    style={{ marginBottom: '0.5rem' }}
                  />
                  <input
                    placeholder="Year"
                    value={edu.year}
                    onChange={(e) => handleArrayChange('education', index, 'year', e.target.value)}
                    style={{ marginBottom: '0.5rem' }}
                  />
                  {formData.education.length > 1 && (
                    <button type="button" onClick={() => removeItem('education', index)} style={{ color: 'red', marginTop: '0.5rem', background: 'none', border: 'none', cursor: 'pointer' }}>
                      Remove
                    </button>
                  )}
                </div>
              ))}
              <button type="button" onClick={() => addItem('education', { degree: '', institution: '', year: '' })} className="btn btn-outline" style={{ width: '100%' }}>
                + Add Education
              </button>
            </div>

            <div className="form-group">
                <label>Certifications (comma separated)</label>
                <input
                    name="certifications"
                    value={formData.certifications}
                    onChange={handleInputChange}
                    placeholder="AWS Certified, Google Cloud..."
                />
            </div>

            <div className="form-group">
                <label>Achievements (comma separated)</label>
                <input
                    name="achievements"
                    value={formData.achievements}
                    onChange={handleInputChange}
                    placeholder="Hackathon Winner, Best Employee..."
                />
            </div>
            
            <div className="form-group">
                <label>Hobbies / Interests (comma separated)</label>
                <input
                    name="hobbies"
                    value={formData.hobbies}
                    onChange={handleInputChange}
                    placeholder="Photography, Gaming, Hiking..."
                />
            </div>

            <div className="form-group">
                <label>Contact Links</label>
                <input
                    name="email"
                    type="email"
                    placeholder="Email Address"
                    value={formData.email}
                    onChange={handleInputChange}
                    style={{ marginBottom: '0.5rem' }}
                />
                <input
                    name="github"
                    placeholder="GitHub URL"
                    value={formData.github}
                    onChange={handleInputChange}
                    style={{ marginBottom: '0.5rem' }}
                />
                <input
                    name="linkedin"
                    placeholder="LinkedIn URL"
                    value={formData.linkedin}
                    onChange={handleInputChange}
                />
            </div>

            <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={loading}>
              {loading ? 'Generating...' : 'Generate Portfolio'}
            </button>
          </form>
        </div>

        {/* Live Preview */}
        {portfolioData && (
          <div className="card preview-container">
            <div className="portfolio-header">
                {portfolioData.photo && <img src={portfolioData.photo} alt="Profile" style={{ width: '120px', height: '120px', borderRadius: '50%', objectFit: 'cover', marginBottom: '1rem' }} />}
                <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', color: 'var(--primary-color)' }}>{portfolioData.name}</h1>
                <h2 style={{ fontSize: '1.5rem', color: 'var(--text-muted)', marginBottom: '1.5rem' }}>{portfolioData.role}</h2>
                <p style={{ maxWidth: '600px', margin: '0 auto', fontSize: '1.1rem' }}>{portfolioData.about}</p>
                
                <div style={{ marginTop: '2rem' }}>
                    {portfolioData.skills.map((skill, i) => (
                        <span key={i} className="chip">{skill}</span>
                    ))}
                </div>
            </div>

            <div style={{ marginTop: '3rem' }}>
                <h3 style={{ borderBottom: '2px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>Featured Projects</h3>
                <div className="grid" style={{ gap: '1.5rem' }}>
                    {portfolioData.projects.map((project, i) => (
                        <div key={i} className="project-card">
                            <h4 style={{ fontSize: '1.25rem', marginBottom: '0.5rem', color: 'var(--primary-color)' }}>{project.title}</h4>
                            <p style={{ color: 'var(--text-muted)' }}>{project.description}</p>
                        </div>
                    ))}
                </div>
            </div>
            
            {portfolioData.experience && portfolioData.experience.length > 0 && (
                <div style={{ marginTop: '3rem' }}>
                    <h3 style={{ borderBottom: '2px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>Experience</h3>
                    {portfolioData.experience.map((exp, i) => (
                         <div key={i} style={{ marginBottom: '1.5rem' }}>
                            <h4 style={{ fontSize: '1.1rem', color: 'var(--text-color)' }}>{exp.role} <span style={{color: 'var(--text-muted)', fontSize: '0.9rem'}}>at {exp.company}</span></h4>
                            <div style={{ fontSize: '0.8rem', color: 'var(--primary-color)', marginBottom: '0.5rem' }}>{exp.duration}</div>
                            <p style={{ color: 'var(--text-muted)' }}>{exp.description}</p>
                         </div>
                    ))}
                </div>
            )}
            
            {portfolioData.education && portfolioData.education.length > 0 && (
                <div style={{ marginTop: '3rem' }}>
                    <h3 style={{ borderBottom: '2px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>Education</h3>
                    {portfolioData.education.map((edu, i) => (
                         <div key={i} style={{ marginBottom: '1rem' }}>
                            <h4 style={{ fontSize: '1.1rem', color: 'var(--text-color)' }}>{edu.degree}</h4>
                            <p style={{ color: 'var(--text-muted)' }}>{edu.institution}, {edu.year}</p>
                         </div>
                    ))}
                </div>
            )}

            {(portfolioData.achievements?.length > 0 || portfolioData.certifications?.length > 0) && (
                <div style={{ marginTop: '3rem' }}>
                    <h3 style={{ borderBottom: '2px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>Achievements & Certifications</h3>
                    <div className="grid">
                        {(portfolioData.achievements || []).map((ach, i) => (
                            <div key={`ach-${i}`} style={{ padding: '1rem', border: '1px solid var(--border-color)', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <span style={{ fontSize: '1.5rem' }}>🏆</span>
                                <span>{ach}</span>
                            </div>
                        ))}
                        {(portfolioData.certifications || []).map((cert, i) => (
                            <div key={`cert-${i}`} style={{ padding: '1rem', border: '1px solid var(--border-color)', borderRadius: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                                <span style={{ fontSize: '1.5rem' }}>📜</span>
                                <span>{cert}</span>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {portfolioData.hobbies && portfolioData.hobbies.length > 0 && (
                <div style={{ marginTop: '3rem' }}>
                     <h3 style={{ borderBottom: '2px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>Interests</h3>
                     <div>
                        {portfolioData.hobbies.map((hobby, i) => (
                            <span key={i} className="chip" style={{ backgroundColor: 'rgba(236, 72, 153, 0.1)', color: 'var(--secondary-color)' }}>{hobby}</span>
                        ))}
                     </div>
                </div>
            )}

            <div className="social-links">
                {portfolioData.contact.email && <a href={`mailto:${portfolioData.contact.email}`} title="Email">📧</a>}
                {portfolioData.contact.github && <a href={portfolioData.contact.github} target="_blank" rel="noreferrer" title="GitHub">🐙</a>}
                {portfolioData.contact.linkedin && <a href={portfolioData.contact.linkedin} target="_blank" rel="noreferrer" title="LinkedIn">💼</a>}
            </div>
            
            <p style={{ textAlign: 'center', marginTop: '3rem', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Generated on {new Date(portfolioData.generatedAt).toLocaleDateString()}
            </p>
          </div>
        )}
        
        {!portfolioData && !loading && (
            <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px', textAlign: 'center', color: 'var(--text-muted)' }}>
                <div>
                    <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🚀</div>
                    <h3>Ready to build your portfolio?</h3>
                    <p>Fill out the form to generate your AI-enhanced portfolio.</p>
                </div>
            </div>
        )}
        
        {loading && (
             <div className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}>
                <div className="loading">
                    <div style={{ fontSize: '2rem', marginBottom: '1rem' }}>🤖</div>
                    Enhancing your content with AI logic...
                </div>
             </div>
        )}

      </div>
    </div>
  )
}

export default App
