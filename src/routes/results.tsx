import { createFileRoute } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import type { House } from '#/lib/types';
import { HOUSES, HOUSE_COLORS, HOUSE_NAMES } from '#/lib/types';

export const Route = createFileRoute('/results')({
	component: Results,
	head: () => ({
		meta: [
			{
				title: "Election Results | Student Council Election 2083",
			},
			{
				name: "description",
				content: "View live results for the Student Council Election 2083 at Shree Baljyoti Secondary School. Real-time vote counts for Head Boy, Head Girl, and House Captains.",
			},
		],
	}),
});

function Results() {
	const [candidates, setCandidates] = useState<any[]>([]);
	const [totalVotes, setTotalVotes] = useState(0);
	const [lastUpdate, setLastUpdate] = useState(new Date());

	useEffect(() => {
		fetchResults();
		const interval = setInterval(fetchResults, 10000); // Auto-refresh every 10 seconds
		return () => clearInterval(interval);
	}, []);

	const fetchResults = async () => {
		try {
			const response = await fetch('/api/election/results');
			const data = await response.json();
			setCandidates(data.candidates || []);
			setTotalVotes(data.electionState?.total_votes || 0);
			setLastUpdate(new Date());
		} catch (error) {
			console.error('Failed to fetch results:', error);
		}
	};

	const headBoys = candidates.filter((c) => c.position === 'head_boy');
	const headGirls = candidates.filter((c) => c.position === 'head_girl');

	const getLeader = (candidateList: any[]) => {
		if (candidateList.length === 0) return null;
		return candidateList.reduce((max, c) => (c.vote_count > max.vote_count ? c : max));
	};

	const renderCandidateCard = (candidate: any, isLeader: boolean) => {
		const maxVotes = Math.max(...candidates.map((c) => c.vote_count || 0), 1);
		const percentage = ((candidate.vote_count || 0) / maxVotes) * 100;

		return (
			<div
				key={candidate.id}
				className={`p-4 rounded-xl border-2 ${
					isLeader
						? 'border-yellow-400 bg-yellow-50 shadow-lg'
						: 'border-gray-200 bg-white'
				}`}
			>
				<div className="flex items-center gap-4">
					<img
						src={`/images/${candidate.photo_image}`}
						alt={candidate.name}
						className="w-16 h-16 object-cover rounded-full"
					/>
					<div className="flex-1">
						<h3 className="font-bold text-gray-800 text-sm">{candidate.name}</h3>
						<p className="text-xs text-gray-600 mb-1">{candidate.symbol}</p>
						<div className="w-full bg-gray-200 rounded-full h-2">
							<div
								className="bg-blue-600 h-2 rounded-full transition-all duration-500"
								style={{ width: `${percentage}%` }}
							/>
						</div>
					</div>
					<div className="text-right">
						<p className="text-2xl font-bold text-blue-600">
							{candidate.vote_count || 0}
						</p>
						{isLeader && (
							<span className="text-xs font-bold text-yellow-600">👑 Leader</span>
						)}
					</div>
				</div>
			</div>
		);
	};

	const renderHousePanel = (house: House) => {
		const houseCandidates = candidates.filter(
			(c) => c.house === house && c.position === 'house_captain',
		);
		const leader = getLeader(houseCandidates);

		return (
			<div key={house} className="bg-white rounded-2xl shadow-lg p-4">
				<h3
					className={`text-xl font-bold text-white mb-4 p-2 rounded-lg text-center ${HOUSE_COLORS[house]}`}
				>
					{HOUSE_NAMES[house]}
				</h3>
				<div className="space-y-3">
					{houseCandidates.map((candidate) =>
						renderCandidateCard(candidate, candidate.id === leader?.id),
					)}
				</div>
			</div>
		);
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 p-4">
			{/* Header */}
			<div className="bg-white rounded-2xl shadow-lg p-4 mb-4">
				<div className="flex justify-between items-center">
					<div>
						<h1 className="text-3xl font-bold text-blue-900">
							Student Council Election 2083 - Live Results
						</h1>
						<p className="text-lg text-gray-600">
							Shree Baljyoti Secondary School
						</p>
					</div>
					<div className="text-right">
						<p className="text-2xl font-bold text-blue-600">
							Total Votes: {totalVotes}
						</p>
						<p className="text-sm text-gray-500">
							Last updated: {lastUpdate.toLocaleTimeString()}
						</p>
					</div>
				</div>
			</div>

			{/* School Leadership Section */}
			<div className="grid grid-cols-2 gap-4 mb-4">
				{/* Head Boys */}
				<div className="bg-white rounded-2xl shadow-lg p-4">
					<h2 className="text-2xl font-bold text-blue-900 mb-4 text-center border-b-2 border-blue-200 pb-2">
						Head Boys
					</h2>
					<div className="space-y-3">
						{headBoys.map((candidate) => {
							const leader = getLeader(headBoys);
							return renderCandidateCard(candidate, candidate.id === leader?.id);
						})}
					</div>
				</div>

				{/* Head Girls */}
				<div className="bg-white rounded-2xl shadow-lg p-4">
					<h2 className="text-2xl font-bold text-pink-900 mb-4 text-center border-b-2 border-pink-200 pb-2">
						Head Girls
					</h2>
					<div className="space-y-3">
						{headGirls.map((candidate) => {
							const leader = getLeader(headGirls);
							return renderCandidateCard(candidate, candidate.id === leader?.id);
						})}
					</div>
				</div>
			</div>

			{/* House Captains Section */}
			<div className="grid grid-cols-4 gap-4">
				{HOUSES.map((house) => renderHousePanel(house))}
			</div>
		</div>
	);
}
