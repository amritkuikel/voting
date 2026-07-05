import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { getCandidatesByPosition, getCandidatesByHouse } from '#/lib/candidates';
import type { House, VotingSession } from '#/lib/types';
import { HOUSES, HOUSE_COLORS, HOUSE_NAMES } from '#/lib/types';

export const Route = createFileRoute('/vote')({
	component: Vote,
	head: () => ({
		meta: [
			{
				title: "Vote | Student Council Election 2083",
			},
			{
				name: "description",
				content: "Cast your vote for Head Boy, Head Girl, and House Captain in the Student Council Election 2083 at Shree Baljyoti Secondary School.",
			},
		],
	}),
});

function Vote() {
	const navigate = useNavigate();
	const [step, setStep] = useState(1);
	const [session, setSession] = useState<VotingSession>({
		headBoySelection: null,
		headGirlSelection: null,
		houseSelection: null,
		houseCaptainSelection: null,
	});
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// Check if user is logged in
	useEffect(() => {
		if (localStorage.getItem('voting_session') !== 'true') {
			navigate({ to: '/vote' });
		}
	}, [navigate]);

	const headBoys = getCandidatesByPosition('head_boy');
	const headGirls = getCandidatesByPosition('head_girl');

	const handleHeadBoySelect = (candidateId: number) => {
		setSession((prev) => ({ ...prev, headBoySelection: candidateId }));
	};

	const handleHeadGirlSelect = (candidateId: number) => {
		setSession((prev) => ({ ...prev, headGirlSelection: candidateId }));
	};

	const handleHouseSelect = (house: House) => {
		setSession((prev) => ({ ...prev, houseSelection: house, houseCaptainSelection: null }));
	};

	const handleHouseCaptainSelect = (candidateId: number) => {
		setSession((prev) => ({ ...prev, houseCaptainSelection: candidateId }));
	};

	const handleNext = () => {
		if (step < 4) {
			setStep(step + 1);
		} else {
			handleSubmit();
		}
	};

	const handleSubmit = async () => {
		setIsSubmitting(true);
		setError(null);
		try {
			const response = await fetch('/api/election/vote', {
				method: 'POST',
				headers: { 'Content-Type': 'application/json' },
				body: JSON.stringify({
					headBoyCandidateId: session.headBoySelection,
					headGirlCandidateId: session.headGirlSelection,
					selectedHouse: session.houseSelection,
					houseCaptainCandidateId: session.houseCaptainSelection,
				}),
			});

			const data = await response.json();

			if (response.ok && data.success) {
				setStep(5);
				setIsSubmitting(false);
			} else {
				console.error('Vote submission failed:', data.error);
				setError(`Failed to submit vote: ${data.error || 'Unknown error'}`);
				setIsSubmitting(false);
			}
		} catch (error) {
			console.error('Failed to submit vote:', error);
			setError('Failed to submit vote. Please try again.');
			setIsSubmitting(false);
		}
	};

	const handleNextStudent = () => {
		// Clear session and go back to login
		localStorage.removeItem('voting_session');
		localStorage.removeItem('voting_credential');
		setStep(1);
		setSession({
			headBoySelection: null,
			headGirlSelection: null,
			houseSelection: null,
			houseCaptainSelection: null,
		});
		navigate({ to: '/vote' });
	};

	const canProceed = () => {
		switch (step) {
			case 1:
				return session.headBoySelection !== null;
			case 2:
				return session.headGirlSelection !== null;
			case 3:
				return session.houseSelection !== null;
			case 4:
				return session.houseCaptainSelection !== null;
			default:
				return false;
		}
	};

	const renderStep = () => {
		switch (step) {
			case 1:
				return (
					<div className="fade-in animate-in slide-in-from-bottom-4 duration-500">
						<h2 className="text-4xl font-bold text-blue-900 mb-2 text-center">
							HEAD BOY ELECTION
						</h2>
						<p className="text-lg text-gray-600 mb-8 text-center">Select a symbol to vote</p>
						<div className="grid grid-cols-2 gap-6">
							{headBoys.map((candidate) => (
								<button
									key={candidate.id}
									onClick={() => handleHeadBoySelect(candidate.id!)}
									className={`p-8 rounded-3xl border-4 transition-all duration-300 transform hover:scale-105 hover:shadow-xl ${
										session.headBoySelection === candidate.id
											? 'border-blue-600 bg-gradient-to-br from-blue-50 to-blue-100 shadow-2xl ring-4 ring-blue-300'
											: 'border-gray-200 bg-white hover:border-blue-400 hover:shadow-lg'
									}`}
								>
									<div className="flex flex-col items-center">
										<div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center mb-4">
											<img
												src={`/images/${candidate.symbolImage}`}
												alt={candidate.symbol}
												className="w-24 h-24 object-contain"
												onError={(e) => {
													const img = e.target as HTMLImageElement;
													img.style.display = 'none';
													const parent = img.parentElement;
													if (parent) {
														parent.innerHTML = `<span class="text-4xl font-bold text-blue-600">${candidate.symbol.charAt(0)}</span>`;
													}
												}}
											/>
										</div>
										{session.headBoySelection === candidate.id && (
											<div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mt-2">
												<svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
												</svg>
											</div>
										)}
									</div>
								</button>
							))}
						</div>
					</div>
				);

			case 2:
				return (
					<div className="fade-in animate-in slide-in-from-bottom-4 duration-500">
						<h2 className="text-4xl font-bold text-pink-900 mb-2 text-center">
							HEAD GIRL ELECTION
						</h2>
						<p className="text-lg text-gray-600 mb-8 text-center">Select a symbol to vote</p>
						<div className="grid grid-cols-2 gap-6">
							{headGirls.map((candidate) => (
								<button
									key={candidate.id}
									onClick={() => handleHeadGirlSelect(candidate.id!)}
									className={`p-8 rounded-3xl border-4 transition-all duration-300 transform hover:scale-105 hover:shadow-xl ${
										session.headGirlSelection === candidate.id
											? 'border-pink-600 bg-gradient-to-br from-pink-50 to-pink-100 shadow-2xl ring-4 ring-pink-300'
											: 'border-gray-200 bg-white hover:border-pink-400 hover:shadow-lg'
									}`}
								>
									<div className="flex flex-col items-center">
										<div className="w-32 h-32 bg-gradient-to-br from-pink-100 to-pink-200 rounded-2xl flex items-center justify-center mb-4">
											<img
												src={`/images/${candidate.symbolImage}`}
												alt={candidate.symbol}
												className="w-24 h-24 object-contain"
												onError={(e) => {
													const img = e.target as HTMLImageElement;
													img.style.display = 'none';
													const parent = img.parentElement;
													if (parent) {
														parent.innerHTML = `<span class="text-4xl font-bold text-pink-600">${candidate.symbol.charAt(0)}</span>`;
													}
												}}
											/>
										</div>
										{session.headGirlSelection === candidate.id && (
											<div className="w-8 h-8 bg-pink-600 rounded-full flex items-center justify-center mt-2">
												<svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
												</svg>
											</div>
										)}
									</div>
								</button>
							))}
						</div>
					</div>
				);

			case 3:
				return (
					<div className="fade-in animate-in slide-in-from-bottom-4 duration-500">
						<h2 className="text-4xl font-bold text-blue-900 mb-2 text-center">
							HOUSE SELECTION
						</h2>
						<p className="text-lg text-gray-600 mb-8 text-center">Select your house</p>
						<div className="grid grid-cols-2 gap-6">
							{HOUSES.map((house) => (
								<button
									key={house}
									onClick={() => handleHouseSelect(house)}
									className={`p-12 rounded-3xl border-4 transition-all duration-300 transform hover:scale-105 hover:shadow-xl ${
										session.houseSelection === house
											? 'border-blue-600 shadow-2xl ring-4 ring-blue-300'
											: 'border-gray-200 hover:border-blue-400 hover:shadow-lg'
									} ${HOUSE_COLORS[house]}`}
								>
									<div className="flex flex-col items-center">
										<span className="text-white text-3xl font-bold mb-2">
											{HOUSE_NAMES[house]}
										</span>
										{session.houseSelection === house && (
											<div className="w-8 h-8 bg-white rounded-full flex items-center justify-center mt-2">
												<svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
												</svg>
											</div>
										)}
									</div>
								</button>
							))}
						</div>
					</div>
				);

			case 4:
				const houseCandidates = session.houseSelection
					? getCandidatesByHouse(session.houseSelection)
					: [];
				return (
					<div className="fade-in animate-in slide-in-from-bottom-4 duration-500">
						<h2 className="text-4xl font-bold text-blue-900 mb-2 text-center">
							HOUSE CAPTAIN ELECTION
						</h2>
						<p className="text-xl text-gray-600 mb-2 text-center">
							{HOUSE_NAMES[session.houseSelection!]}
						</p>
						<p className="text-lg text-gray-500 mb-8 text-center">Select a symbol to vote</p>
						<div className="grid grid-cols-2 gap-6">
							{houseCandidates.map((candidate) => (
								<button
									key={candidate.id}
									onClick={() => handleHouseCaptainSelect(candidate.id!)}
									className={`p-8 rounded-3xl border-4 transition-all duration-300 transform hover:scale-105 hover:shadow-xl ${
										session.houseCaptainSelection === candidate.id
											? 'border-blue-600 bg-gradient-to-br from-blue-50 to-blue-100 shadow-2xl ring-4 ring-blue-300'
											: 'border-gray-200 bg-white hover:border-blue-400 hover:shadow-lg'
									}`}
								>
									<div className="flex flex-col items-center">
										<div className="w-32 h-32 bg-gradient-to-br from-blue-100 to-blue-200 rounded-2xl flex items-center justify-center mb-4">
											<img
												src={`/images/${candidate.symbolImage}`}
												alt={candidate.symbol}
												className="w-24 h-24 object-contain"
												onError={(e) => {
													const img = e.target as HTMLImageElement;
													img.style.display = 'none';
													const parent = img.parentElement;
													if (parent) {
														parent.innerHTML = `<span class="text-4xl font-bold text-blue-600">${candidate.symbol.charAt(0)}</span>`;
													}
												}}
											/>
										</div>
										{session.houseCaptainSelection === candidate.id && (
											<div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center mt-2">
												<svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
													<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
												</svg>
											</div>
										)}
									</div>
								</button>
							))}
						</div>
					</div>
				);

			case 5:
				return (
					<div className="fade-in animate-in slide-in-from-bottom-4 duration-500 text-center py-12">
						<div className="w-24 h-24 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
							<svg
								className="w-16 h-16 text-green-600"
								fill="none"
								stroke="currentColor"
								viewBox="0 0 24 24"
							>
								<path
									strokeLinecap="round"
									strokeLinejoin="round"
									strokeWidth="3"
									d="M5 13l4 4L19 7"
								/>
							</svg>
						</div>
						<h2 className="text-4xl font-bold text-green-600 mb-4">
							Thank You for Voting!
						</h2>
						<p className="text-xl text-gray-600 mb-8">
							Your vote has been successfully submitted.
						</p>
						<button
							onClick={handleNextStudent}
							className="px-12 py-4 bg-blue-600 hover:bg-blue-700 text-white text-2xl font-bold rounded-2xl shadow-lg transition-all duration-300 transform hover:scale-105"
						>
							Next Student
						</button>
					</div>
				);

			default:
				return null;
		}
	};

	return (
		<div className="min-h-screen bg-gradient-to-br from-indigo-100 via-purple-50 to-pink-100 flex flex-col items-center justify-center p-8">
			<div className="bg-white/90 backdrop-blur-sm rounded-3xl shadow-2xl p-12 max-w-4xl w-full border border-white/50">
				{error && (
					<div className="mb-6 bg-red-50 border-2 border-red-200 text-red-700 px-6 py-4 rounded-xl flex items-center justify-between">
						<div className="flex items-center gap-3">
							<svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
								<path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
							</svg>
							<span>{error}</span>
						</div>
						<button
							onClick={() => navigate({ to: '/' })}
							className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition-colors"
						>
							Go Home
						</button>
					</div>
				)}
				{renderStep()}

				{step < 5 && (
					<div className="mt-8 flex justify-center gap-4">
						<button
							onClick={() => navigate({ to: '/' })}
							className="px-8 py-4 bg-gray-200 hover:bg-gray-300 text-gray-700 text-xl font-bold rounded-2xl shadow-lg transition-all duration-300 transform hover:scale-105"
						>
							Home
						</button>
						<button
							onClick={handleNext}
							disabled={!canProceed() || isSubmitting}
							className="px-12 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-400 disabled:cursor-not-allowed text-white text-2xl font-bold rounded-2xl shadow-lg transition-all duration-300 transform hover:scale-105 disabled:hover:scale-100"
						>
							{step === 4 ? 'SUBMIT VOTE' : 'NEXT'}
						</button>
					</div>
				)}

				{step < 5 && (
					<div className="mt-6 flex justify-center gap-2">
						{[1, 2, 3, 4].map((s) => (
							<div
								key={s}
								className={`h-2 rounded-full transition-all duration-300 ${
									s === step ? 'w-8 bg-gradient-to-r from-indigo-600 to-purple-600' : 'w-2 bg-gray-300'
								}`}
							/>
						))}
					</div>
				)}
			</div>
		</div>
	);
}
