import "./index.css";
import renzPhoto from "./assets/renz.png";
import appImg from "./assets/app.png";
import awesomeImg from "./assets/awesome.png";
import gtoursImg from "./assets/gtours.png";

function App() {
  return (
    <div className="app">
      <header className="navbar">
        <div className="logo">Renz Quelli</div>

        <nav className="nav-links">
          <a href="#home">Home</a>
          <a href="#about">About</a>
          <a href="#skills">Skills</a>
          <a href="#projects">Projects</a>
        </nav>
      </header>

      <section id="home" className="hero">
        <div className="hero-text">
          <p className="tag">Frontend Developer • Student</p>

          <h1>
            Hi, I’m <span>Renz</span>
          </h1>

          <p className="hero-description">
            I build modern and responsive websites with a strong focus on clean
            layout, smooth user experience, and simple but attractive design.
          </p>

          <div className="hero-buttons">
            <a href="#projects" className="btn primary-btn">View Projects</a>
            <a href="#about" className="btn secondary-btn">About Me</a>
          </div>
        </div>

        <div className="hero-image">
          <div className="image-box">
            <img src={renzPhoto} alt="Renz Quelli" />
          </div>
        </div>
      </section>

      <section id="about" className="section about-section">
        <div className="section-title">
          <h2>About Me</h2>
        </div>

        <div className="about-grid">
          <div className="about-card large-card">
            <p>
              Hello, I’m Renz Quelli. I enjoy creating websites that look clean,
              feel modern, and work well on different screen sizes. I am
              currently improving my frontend development skills and learning
              more about designing interfaces that are both simple and
              effective.
            </p>
          </div>

          <div className="about-card small-card">
            <h3>Location</h3>
            <p>Ambulong, Manoc-Manoc, Malay, Aklan</p>
          </div>

          <div className="about-card small-card">
            <h3>Focus</h3>
            <p>Frontend Development</p>
          </div>
        </div>
      </section>

      <section id="skills" className="section">
        <div className="section-title">
          <h2>Skills</h2>
        </div>

        <div className="cards">
          <div className="card">HTML</div>
          <div className="card">CSS</div>
          <div className="card">JavaScript</div>
          <div className="card">React</div>
          <div className="card">Responsive Design</div>
          <div className="card">UI Design</div>
        </div>
      </section>

    <section id="projects" className="section">
  <div className="section-title">
    <h2>Projects</h2>
  </div>

  <div className="project-grid">
    <div className="project-card">
      <img src={appImg} alt="Bakery Product Card" className="project-img" />
      <h3>Bakery Product Card</h3>
      <p>
        A modern product card UI featuring a bakery item with price,
        product details, and an add-to-cart button. This project focuses
        on layout, styling, and creating a clean shopping card design.
      </p>
    </div>

    <div className="project-card">
      <img src={awesomeImg} alt="Awesome Todos App" className="project-img" />
      <h3>Awesome Todos App</h3>
      <p>
        A functional todo application that allows users to add, manage,
        and remove tasks in a simple and organized interface. It was
        designed to be clean, modern, and easy to use.
      </p>
    </div>

    <div className="project-card">
      <img src={gtoursImg} alt="GTours Branding" className="project-img" />
      <h3>GTours Branding</h3>
      <p>
        A branding and logo design project for a tours and travel concept.
        It highlights simplicity, strong identity, and a professional
        visual style suitable for a tourism-related business.
      </p>
    </div>
  </div>
</section>
    </div>
  );
}

export default App;