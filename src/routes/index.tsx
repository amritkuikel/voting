import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/")({
	component: Home,
	head: () => ({
		meta: [
			{
				title: "Home | Student Council Election 2083",
			},
			{
				name: "description",
				content: "Welcome to the official voting platform for Student Council Election 2083 at Shree Baljyoti Secondary School, Hetauda-5, Makawanpur, Nepal.",
			},
		],
	}),
});

const translations = {
	en: {
		schoolName: "Shree Baljyoti Secondary School",
		location: "Hetauda-5, Makawanpur, Nepal",
		electionTitle: "Student Council Election 2083",
		startVoting: "START VOTING",
		adminLogin: "ADMIN LOGIN",
		language: "नेपाली",
	},
	ne: {
		schoolName: "श्री बालज्योति माध्यमिक विद्यालय",
		location: "हेटौडा-५, मकवानपुर, नेपाल",
		electionTitle: "विद्यार्थी परिषद निर्वाचन २०८३",
		startVoting: "मतदान सुरु गर्नुहोस्",
		adminLogin: "प्रशासक लगइन",
		language: "English",
	},
};

function Home() {
	const [language, setLanguage] = useState<'en' | 'ne'>('en');
	const t = translations[language];

	return (
		<div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 flex flex-col items-center justify-center p-8 animate-in fade-in duration-1000">
			{/* Language Toggle */}
			<div className="absolute top-4 right-4">
				<button
					onClick={() => setLanguage(language === 'en' ? 'ne' : 'en')}
					className="px-4 py-2 bg-white/90 backdrop-blur-sm border-2 border-indigo-300 rounded-lg text-indigo-700 font-semibold hover:bg-indigo-50 transition-colors shadow-md"
				>
					{t.language}
				</button>
			</div>

			<div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-12 max-w-2xl w-full text-center border border-white/50">
				{/* School Logo */}
				<div className="mb-8">
					<div className="w-32 h-32 mx-auto bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
						<img
							src="/images/logo.png"
							alt="School Logo"
							className="w-24 h-24 object-contain"
							onError={(e) => {
								(e.target as HTMLImageElement).style.display = 'none';
								const parent = (e.target as HTMLImageElement).parentElement;
								if (parent) {
									parent.innerHTML = '<span class="text-4xl font-bold text-white">🏫</span>';
								}
							}}
						/>
					</div>
				</div>

				{/* School Name */}
				<h1 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-2 animate-in slide-in-from-bottom-4 duration-700">
					{t.schoolName}
				</h1>
				<p className="text-gray-600 mb-2 text-lg animate-in slide-in-from-bottom-4 duration-700 delay-100">
					{t.location}
				</p>

				{/* Election Title */}
				<div className="my-8 py-6 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl border-2 border-indigo-200 animate-in slide-in-from-bottom-4 duration-700 delay-200">
					<h2 className="text-4xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
						{t.electionTitle}
					</h2>
				</div>

				{/* Action Buttons */}
				<div className="flex flex-col sm:flex-row gap-6 justify-center mt-12 animate-in slide-in-from-bottom-4 duration-700 delay-300">
					<Link
						to="/vote-login"
						className="px-12 py-6 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-2xl font-bold rounded-2xl shadow-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
					>
						{t.startVoting}
					</Link>
					<Link
						to="/admin"
						className="px-12 py-6 bg-gradient-to-r from-gray-600 to-gray-700 hover:from-gray-700 hover:to-gray-800 text-white text-2xl font-bold rounded-2xl shadow-xl transition-all duration-300 transform hover:scale-105 hover:shadow-2xl"
					>
						{t.adminLogin}
					</Link>
				</div>

				
			</div>
		</div>
	);
}
