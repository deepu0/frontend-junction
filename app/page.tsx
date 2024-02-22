import LandingPage from "@/components/home";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4 mt-3">

{/* <div className="container mx-auto mt-8">
    <h1 className="text-4xl font-bold text-center mb-8">Ace Your Next Frontend Interview</h1>
    <p className="text-lg text-center mb-8">Prepare with Confidence: End your interview prep frustration. Get frontend interview experiences from across the web, all in one place.</p>
    
    <div className="flex flex-wrap justify-center">
      <div className="max-w-xs rounded overflow-hidden shadow-lg m-4">
        <img className="w-full" src="company_logo.jpg" alt="Company Logo" />
        <div className="px-6 py-4">
          <div className="font-bold text-xl mb-2">Google Frontend Developer Interview</div>
          <p className="text-gray-700 text-base">
            Prepare with Confidence: Gain insights into the interview process, types of questions asked, and the overall experience shared by fellow developers who have been through it.
          </p>
        </div>
        <div className="px-6 py-4">
          <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700 mr-2">#Google</span>
          <span className="inline-block bg-gray-200 rounded-full px-3 py-1 text-sm font-semibold text-gray-700">#Frontend</span>
        </div>
        <div className="px-6 py-4">
          <a href="#" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full">
            Read More
          </a>
        </div>
      </div>
    </div>

    <div className="text-center mt-8">
      <p className="text-lg">Unlock Your Potential. Prepare Strategically. Ace Your Interview.</p>
      <p className="text-lg mt-4">Join Frontend Interview Adda Today!</p>
      <p className="text-lg mt-8">Why Choose Frontend Interview Adda?</p>
      <p className="text-base mb-4">Frontend Interview Adda is your one-stop destination for preparing for frontend developer interviews. Our platform offers:</p>
      <ul className="text-base list-disc list-inside">
        <li>{`Curated Interview Experiences: Gain insights from real interview experiences shared by candidates who've been through the process.`}</li>
        <li>{`Comprehensive Coverage: Explore interview experiences from a wide range of top tech companies, ensuring you're prepared for any scenario.`}</li>
        <li>Search and Filter: Easily find interview experiences tailored to specific companies, roles, or technical topics to focus your preparation effectively.</li>
        <li>Community Support: Join a vibrant community of frontend developers sharing tips, strategies, and support to help each other succeed in interviews.</li>
      </ul>
    </div>
  </div> */}
    <LandingPage />
    </main>
  );
}
