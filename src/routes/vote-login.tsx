import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';

export const Route = createFileRoute('/vote-login')({
	component: VoteLogin,
	head: () => ({
		meta: [
			{
				title: "Voting Login | Student Council Election 2083",
			},
			{
				name: "description",
				content: "Login to cast your vote in the Student Council Election 2083 at Shree Baljyoti Secondary School.",
			},
		],
	}),
});

function VoteLogin() {
	const navigate = useNavigate();
	const [password, setPassword] = useState('');
	const [error, setError] = useState('');
	const [isLoading, setIsLoading] = useState(false);

	// 10 test credentials for voting
	const VOTING_CREDENTIALS = [
		{ password: 'vote1', label: 'Voting Student 1 (vote1)' },
		{ password: 'vote2', label: 'Voting Student 2 (vote2)' },
		{ password: 'vote3', label: 'Voting Student 3 (vote3)' },
		{ password: 'vote4', label: 'Voting Student 4 (vote4)' },
		{ password: 'vote5', label: 'Voting Student 5 (vote5)' },
		{ password: 'vote6', label: 'Voting Student 6 (vote6)' },
		{ password: 'vote7', label: 'Voting Student 7 (vote7)' },
		{ password: 'vote8', label: 'Voting Student 8 (vote8)' },
		{ password: 'vote9', label: 'Voting Student 9 (vote9)' },
		{ password: 'vote10', label: 'Voting Student 10 (vote10)' },
	];

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setIsLoading(true);
		setError('');

		const cred = VOTING_CREDENTIALS.find((c) => c.password === password);

		if (cred) {
			localStorage.setItem('voting_session', 'true');
			localStorage.setItem('voting_credential', password);
			navigate({ to: '/vote' });
		} else {
			setError('Invalid voting credential');
			setIsLoading(false);
		}
	};

	const handleQuickLogin = (cred: typeof VOTING_CREDENTIALS[0]) => {
		setPassword(cred.password);
		setIsLoading(true);
		setError('');
		localStorage.setItem('voting_session', 'true');
		localStorage.setItem('voting_credential', cred.password);
		navigate({ to: '/vote' });
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 flex flex-col items-center justify-center p-8">
			<div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-12 max-w-md w-full border border-white/50">
				<div className="text-center mb-8">
					<div className="w-20 h-20 mx-auto mb-4 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center shadow-lg">
						<svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
						</svg>
					</div>
					<h1 className="text-3xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
						VOTING LOGIN
					</h1>
				</div>

				<form onSubmit={handleSubmit} className="space-y-6">
					<div>
						<label className="block text-lg font-semibold text-gray-700 mb-2">
							Enter Voting Credential
						</label>
						<input
							type="password"
							value={password}
							onChange={(e) => setPassword(e.target.value)}
							className="w-full px-4 py-3 border-2 border-gray-300 rounded-xl focus:border-purple-500 focus:ring-2 focus:ring-purple-200 focus:outline-none text-lg transition-all"
							placeholder="Enter voting credential"
							autoFocus
						/>
					</div>

					{error && (
						<div className="bg-red-50 border-2 border-red-200 text-red-700 px-4 py-3 rounded-xl flex items-center gap-2">
							<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
							</svg>
							{error}
						</div>
					)}

					<button
						type="submit"
						disabled={isLoading}
						className="w-full px-6 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white text-xl font-bold rounded-xl shadow-lg transition-all duration-300 transform hover:scale-105 disabled:hover:scale-100"
					>
						{isLoading ? 'Logging in...' : 'START VOTING'}
					</button>
				</form>

				<div className="mt-8 text-center">
					<button
						onClick={() => navigate({ to: '/' })}
						className="text-indigo-600 hover:text-indigo-800 font-semibold flex items-center justify-center gap-2 mx-auto transition-colors"
					>
						<svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
							<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
						</svg>
						Back to Home
					</button>
				</div>
			</div>
		</div>
	);
}
