import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState, useEffect } from 'react';

export const Route = createFileRoute('/admin/dashboard')({
	component: AdminDashboard,
	head: () => ({
		meta: [
			{
				title: "Admin Dashboard | Student Council Election 2083",
			},
			{
				name: "description",
				content: "Admin dashboard for managing the Student Council Election 2083 at Shree Baljyoti Secondary School. Start/stop election and view results.",
			},
		],
	}),
});

function AdminDashboard() {
	const navigate = useNavigate();
	const [electionState, setElectionState] = useState<any>(null);
	const [showConfirm, setShowConfirm] = useState<string | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [sessionError, setSessionError] = useState<string | null>(null);

	useEffect(() => {
		// Check admin session
		const session = localStorage.getItem('admin_session');
		if (session !== 'true') {
			setSessionError('Session not found. Redirecting to login...');
			setTimeout(() => {
				window.location.href = '/admin';
			}, 2000);
		} else {
			fetchElectionState();
		}
	}, []);

	const fetchElectionState = async () => {
		try {
			const response = await fetch('/api/election/state');
			const data = await response.json();
			setElectionState(data);
		} catch (error) {
			console.error('Failed to fetch election state:', error);
		}
	};

	const handleStartElection = async () => {
		setIsLoading(true);
		try {
			await fetch('/api/election/start', { method: 'POST' });
			await fetchElectionState();
			setShowConfirm(null);
		} catch (error) {
			console.error('Failed to start election:', error);
		}
		setIsLoading(false);
	};

	const handleStopElection = async () => {
		setIsLoading(true);
		try {
			await fetch('/api/election/stop', { method: 'POST' });
			await fetchElectionState();
			setShowConfirm(null);
		} catch (error) {
			console.error('Failed to stop election:', error);
		}
		setIsLoading(false);
	};

	const handleResetElection = async () => {
		setIsLoading(true);
		try {
			await fetch('/api/election/reset', { method: 'POST' });
			await fetchElectionState();
			setShowConfirm(null);
		} catch (error) {
			console.error('Failed to reset election:', error);
		}
		setIsLoading(false);
	};

	const handleExportResults = async () => {
		try {
			const response = await fetch('/api/election/export');
			const blob = await response.blob();
			const url = window.URL.createObjectURL(blob);
			const a = document.createElement('a');
			a.href = url;
			a.download = 'election_results.csv';
			document.body.appendChild(a);
			a.click();
			document.body.removeChild(a);
			window.URL.revokeObjectURL(url);
		} catch (error) {
			console.error('Failed to export results:', error);
		}
	};

	const handleLogout = () => {
		localStorage.removeItem('admin_session');
		navigate({ to: '/' });
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-8">
			<div className="max-w-6xl mx-auto">
				{sessionError && (
					<div className="bg-red-50 border-2 border-red-200 text-red-700 px-6 py-4 rounded-xl mb-8">
						{sessionError}
					</div>
				)}
				<div className="flex justify-between items-center mb-8">
					<h1 className="text-4xl font-bold text-blue-900">
						Admin Dashboard
					</h1>
					<button
						onClick={handleLogout}
						className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-xl shadow-lg transition-all"
					>
						Logout
					</button>
				</div>

				{/* Election Status Card */}
				<div className="bg-white rounded-3xl shadow-2xl p-8 mb-8">
					<div className="flex items-center justify-between">
						<div>
							<h2 className="text-2xl font-bold text-gray-800 mb-2">
								Election Status
							</h2>
							<p className="text-lg text-gray-600">
								Total Votes: <span className="font-bold text-blue-600">{electionState?.total_votes || 0}</span>
							</p>
						</div>
						<div
							className={`px-8 py-4 rounded-2xl text-2xl font-bold ${
								electionState?.is_active
									? 'bg-green-100 text-green-700'
									: 'bg-red-100 text-red-700'
							}`}
						>
							{electionState?.is_active ? 'ACTIVE' : 'STOPPED'}
						</div>
					</div>
				</div>

				{/* Control Buttons */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
					<button
						onClick={() => setShowConfirm('start')}
						disabled={electionState?.is_active || isLoading}
						className="px-6 py-8 bg-green-600 hover:bg-green-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-xl font-bold rounded-2xl shadow-lg transition-all transform hover:scale-105 disabled:hover:scale-100"
					>
						Start Election
					</button>
					<button
						onClick={() => setShowConfirm('stop')}
						disabled={!electionState?.is_active || isLoading}
						className="px-6 py-8 bg-red-600 hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-xl font-bold rounded-2xl shadow-lg transition-all transform hover:scale-105 disabled:hover:scale-100"
					>
						Stop Election
					</button>
					<button
						onClick={() => setShowConfirm('reset')}
						disabled={isLoading}
						className="px-6 py-8 bg-yellow-600 hover:bg-yellow-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-xl font-bold rounded-2xl shadow-lg transition-all transform hover:scale-105 disabled:hover:scale-100"
					>
						Reset Election
					</button>
					<button
						onClick={handleExportResults}
						disabled={isLoading}
						className="px-6 py-8 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white text-xl font-bold rounded-2xl shadow-lg transition-all transform hover:scale-105 disabled:hover:scale-100"
					>
						Export Results
					</button>
				</div>

				{/* Quick Links */}
				<div className="bg-white rounded-3xl shadow-2xl p-8">
					<h2 className="text-2xl font-bold text-gray-800 mb-6">
						Quick Links
					</h2>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4">
						<button
							onClick={() => navigate({ to: '/results' })}
							className="px-6 py-4 bg-purple-600 hover:bg-purple-700 text-white text-lg font-bold rounded-xl shadow-lg transition-all"
						>
							View Live Results
						</button>
						<button
							onClick={() => navigate({ to: '/vote' })}
							className="px-6 py-4 bg-indigo-600 hover:bg-indigo-700 text-white text-lg font-bold rounded-xl shadow-lg transition-all"
						>
							Test Voting Interface
						</button>
					</div>
				</div>

				{/* Confirmation Dialog */}
				{showConfirm && (
					<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
						<div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full mx-4">
							<h3 className="text-2xl font-bold text-gray-800 mb-4">
								Confirm Action
							</h3>
							<p className="text-lg text-gray-600 mb-8">
								{showConfirm === 'start' && 'Are you sure you want to start the election?'}
								{showConfirm === 'stop' && 'Are you sure you want to stop the election?'}
								{showConfirm === 'reset' && 'Are you sure you want to reset the election? This will delete all votes.'}
							</p>
							<div className="flex gap-4">
								<button
									onClick={() => setShowConfirm(null)}
									className="flex-1 px-6 py-3 bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold rounded-xl transition-all"
								>
									Cancel
								</button>
								<button
									onClick={() => {
										if (showConfirm === 'start') handleStartElection();
										if (showConfirm === 'stop') handleStopElection();
										if (showConfirm === 'reset') handleResetElection();
									}}
									disabled={isLoading}
									className="flex-1 px-6 py-3 bg-red-600 hover:bg-red-700 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-bold rounded-xl transition-all"
								>
									{isLoading ? 'Processing...' : 'Confirm'}
								</button>
							</div>
						</div>
					</div>
				)}
			</div>
		</div>
	);
}
