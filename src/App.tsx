import Header from './components/Header'
import Hero from './components/Hero'
import Ticker from './components/Ticker'
import About from './components/About'
import Design from './components/Design'
import Directions from './components/Directions'
import Equipment from './components/Equipment'
import Applications from './components/Applications'
import Benefits from './components/Benefits'
import Contacts from './components/Contacts'
import Footer from './components/Footer'

export default function App() {
  return (
    <>
      <Header />
      <main>
        <Hero />
        <Ticker />
        <About />
        <Design />
        <Directions />
        <Equipment />
        <Applications />
        <Benefits />
        <Contacts />
      </main>
      <Footer />
    </>
  )
}
