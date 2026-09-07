import { useEffect } from 'react';
import Navbar from '../components/user-workspace/Navbar';
import TopBar from '../components/user-workspace/TopBar';
import StatCards from '../components/user-workspace/StatCards';
import TopRankedCandidates from '../components/user-workspace/TopRankedCandidates';
import JobListings from '../components/user-workspace/JobListings';

function User_Workspace() {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <div className="flex min-h-screen bg-[#fffef9] font-sans text-stone-800 antialiased">
      <Navbar />
      <main className="min-w-0 flex-1 px-5 pb-10 pt-24 sm:px-8 lg:ml-[297px] lg:pt-10">
        <div className="mx-auto max-w-site">
          <TopBar />
          <StatCards />
          <div className="mt-6 grid grid-cols-1 gap-6 xl:grid-cols-3">
            <div className="xl:col-span-2">
              <TopRankedCandidates />
            </div>
            <JobListings />
          </div>
        </div>
      </main>
    </div>
  );
}

export default User_Workspace;