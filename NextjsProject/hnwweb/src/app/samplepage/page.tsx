// app/samplepage/page.tsx
// This is a React Server Component by default (no "use client")

import SampleSearch from './SampleSearch';

type TeamMember = {
  id: string;
  name: string;
  role: "dev" | "design" | "pm";
};

async function getTeam(): Promise<TeamMember[]> {
  // Simulate fetching static data at build time (or ISR if you add revalidate)
  return [
    { id: "1", name: "Alex", role: "dev" },
    { id: "2", name: "Sam", role: "design" },
    { id: "3", name: "Rae", role: "pm" },
  ];
}

// Optional: make this route static with revalidation
export const revalidate = 300; // seconds



export default async function AboutPage() {
  const team = await getTeam();

  return (
    <main className="mx-auto max-w-4xl p-6 space-y-4">
 

 <h1 className="text-3xl font-semibold">Sample Search Page</h1>
  <p>Type in the search box to run a database full-text search.</p>

  {/* Client-side interactive search component */}
  {/*<SampleSearch />   */}

  {/* Keep the existing team list for reference */}
  <section className="bg-black p-6 rounded-lg shadow-md"> 
    <h2 className="text-xl font-semibold mb-4">Team</h2>
    <ul className="list-disc pl-6">
      {team.map((m) => (
        <li key={m.id}>
          {m.name} — <em className="font-bold">{m.role}</em >
        </li >
      ))}
    </ul >
  </section>

  <section className="bg-black p-6 rounded-lg shadow-md"> 
    <h2 className="text-xl font-semibold mb-4">Customer Data</h2>
    <table className="table-auto w-full">
      <thead >
        <tr className="text-left">
          <th >Name</th >
          <th >Phone Number</th >
          <th >Email</th >
          <th >Gender</th >
          <th >BOD</th >
        </tr >
      </thead >
      <tbody >
        {Array.from({ length: 20 }, (_, i) => ({
          id: i + 1,
          name: `Customer ${i + 1}`,
          phone: `555-123-${i + 1}`,
          email: `customer${i + 1}@example.com`,
          gender: [`Male`, `Female`, `Other`][i % 3],
          bod: new Date().setDate(new Date().getDate() - i),
        }))
        .map((row) => (
          <tr key={row.id} className="text-left">
            <td className="p-2">{row.name}</td>
            <td className="p-2">{row.phone}</td>
            <td className="p-2">{row.email}</td>
            <td className="p-2">{row.gender}</td>
            <td className="p-2">{new Date(row.bod).toLocaleDateString()}</td>
          </tr >
        ))}
      </tbody >
    </table >
  </section >






    </main>
  );
}

