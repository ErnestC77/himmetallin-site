import Header from './components/Header'
import Hero from './components/Hero'
import Ticker from './components/Ticker'
import About from './components/About'
import Directions from './components/Directions'
import Equipment from './components/Equipment'
import Applications from './components/Applications'
import Benefits from './components/Benefits'
import Standards from './components/Standards'
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
        <Directions />
        <Equipment />
        <Applications />
        <Benefits />
        <Standards />
        <Contacts />
      </main>
      <Footer />
    </>
  )
}
