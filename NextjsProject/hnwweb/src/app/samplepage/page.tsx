// app/about/page.tsx
// This is a React Server Component by default (no "use client")

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
    <main className="mx-auto max-w-2xl p-6 space-y-4">
      <h1 className="text-3xl font-semibold">About (TSX)</h1>
      <p>We build delightful web apps.</p>
      <ul className="list-disc pl-6">
        {team.map((m) => (
          <li key={m.id}>
            {m.name} — <em>{m.role}</em>
          </li>
        ))}
      </ul>
    </main>
  );
}