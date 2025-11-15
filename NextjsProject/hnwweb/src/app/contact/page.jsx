// app/contact/page.jsx
// Still a React Server Component by default

// Make this route dynamic SSR (example of per-route control)
// export const dynamic = 'force-dynamic';

export default async function ContactPage() {
  // You can fetch data here if needed; returning static JSX for brevity
  return (
    <main className="mx-auto max-w-2xl p-6 space-y-4">
      <h1 className="text-3xl font-semibold">Contact (JSX)</h1>
      <p>Send us a message at hello@example.com.</p>
      <form action="#" className="space-y-3">
        <div>
          <label htmlFor="email" className="block text-sm font-medium">Email</label>
          <input id="email" name="email" type="email" className="mt-1 w-full rounded border px-3 py-2" />
        </div>
        <div>
          <label htmlFor="msg" className="block text-sm font-medium">Message</label>
          <textarea id="msg" name="msg" rows="4" className="mt-1 w-full rounded border px-3 py-2" />
        </div>
        <button type="submit" className="rounded bg-blue-600 px-4 py-2 text-white">Send</button>
      </form>
    </main>
  );
}