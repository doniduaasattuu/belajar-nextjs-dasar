import Navbar from "../navbar";

export default function AuthenticatedLayout({
  children,
}: {
  children?: React.ReactNode;
}) {
  return (
    <section>
      <Navbar />
      {children}
    </section>
  );
}
