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
      <section>
        <h2 className="text-xl font-semibold">Team</h2>
        <ul className="list-disc pl-6">
          {team.map((m) => (
            <li key={m.id}>
              {m.name} — <em>{m.role}</em>
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}

