function App() {
  return (
    <main className="min-h-screen bg-slate-950 px-6 py-16 text-slate-100">
      <section className="mx-auto max-w-3xl">
        <p className="mb-4 text-sm font-semibold uppercase tracking-[0.3em] text-cyan-400">HR Helper</p>
        <h1 className="text-5xl font-bold tracking-tight">Your people operations workspace.</h1>
        <p className="mt-6 max-w-xl text-lg leading-8 text-slate-300">
          The frontend is ready. Connect it to the NestJS API and AI service as features are added.
        </p>
        <div className="mt-10 grid gap-4 sm:grid-cols-3">
          {['People', 'Requests', 'Insights'].map((label) => (
            <div key={label} className="rounded-lg border border-slate-800 bg-slate-900 p-5">
              <p className="font-medium">{label}</p>
              <p className="mt-2 text-sm text-slate-400">Ready for your first module.</p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}

export default App;
