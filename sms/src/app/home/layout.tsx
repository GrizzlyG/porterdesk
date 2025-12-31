import Footer from "@/components/Footer";
import Hero from "@/components/Hero";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="flex flex-col min-h-screen">
      <div>
        <Hero />
      </div>
      <main className="flex-1">
        <section className="max-w-screen-xl mx-auto min-h-[50vh]">
          {children}
        </section>
      </main>
      <Footer />
    </div>
  );
}
