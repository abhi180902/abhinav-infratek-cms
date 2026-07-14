import Navbar from './components/layout/Navbar'
import Hero from './components/home/Hero'
import About from './components/home/About'
import Services from './components/home/Services'
import Projects from './components/home/Projects'

export default function App() {
  return (
    <div className="site-shell">
      <Navbar />
      <main>
        <Hero />
        <About />
        <Services />
        <Projects />
      </main>
    </div>
  )
}
