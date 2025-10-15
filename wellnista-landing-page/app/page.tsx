import { Hero } from "@/components/hero"
import { About } from "@/components/about"
import { Activities } from "@/components/activities"
import { Services } from "@/components/services"
import { Programs } from "@/components/programs"
import { Contact } from "@/components/contact"
import { Footer } from "@/components/footer"

export default function Home() {
  return (
    <main className="min-h-screen">
      <Hero />
      <About />
      <Activities />
      <Services />
      <Programs />
      <Contact />
      <Footer />
    </main>
  )
}
