import { createFileRoute } from '@tanstack/react-router';
import { getClient } from '#/db';

export const Route = createFileRoute('/api/election/vote')({
	server: {
		handlers: {
			POST: async ({ request }) => {
				const client = await getClient();
				if (!client) {
					return Response.json({ error: 'Database not available' }, { status: 500 });
				}

				try {
					const body = await request.json();
					const { headBoyCandidateId, headGirlCandidateId, selectedHouse, houseCaptainCandidateId } = body;

					console.log('Vote submission:', { headBoyCandidateId, headGirlCandidateId, selectedHouse, houseCaptainCandidateId });

					// Validate all selections are present
					if (!headBoyCandidateId || !headGirlCandidateId || !selectedHouse || !houseCaptainCandidateId) {
						return Response.json({ error: 'All selections are required' }, { status: 400 });
					}

					// Check if election state table exists and has data
					const electionResult = (await client`
						SELECT * FROM election_state
						ORDER BY id DESC
						LIMIT 1
					`) as any[];

					console.log('Election state:', electionResult);

					if (!electionResult || electionResult.length === 0) {
						return Response.json({ error: 'Election not initialized. Please contact admin.' }, { status: 400 });
					}

					if (!electionResult[0].is_active) {
						return Response.json({ error: 'Election is not active. Please contact admin to start the election.' }, { status: 400 });
					}

					// Verify candidates exist
					const candidateCheck = (await client`
						SELECT id FROM candidates WHERE id IN (${headBoyCandidateId}, ${headGirlCandidateId}, ${houseCaptainCandidateId})
					`) as any[];

					console.log('Candidate check:', candidateCheck);

					if (candidateCheck.length !== 3) {
						return Response.json({ error: 'Invalid candidate selection' }, { status: 400 });
					}

					// Insert the complete vote (no partial votes)
					await client`
						INSERT INTO votes (head_boy_candidate_id, head_girl_candidate_id, selected_house, house_captain_candidate_id)
						VALUES (${headBoyCandidateId}, ${headGirlCandidateId}, ${selectedHouse}, ${houseCaptainCandidateId})
					`;

					// Update vote counts for all selected candidates
					await client`
						UPDATE candidates
						SET vote_count = vote_count + 1
						WHERE id IN (${headBoyCandidateId}, ${headGirlCandidateId}, ${houseCaptainCandidateId})
					`;

					// Update total votes
					await client`
						UPDATE election_state
						SET total_votes = total_votes + 1,
							updated_at = CURRENT_TIMESTAMP
						WHERE id = (SELECT id FROM election_state ORDER BY id DESC LIMIT 1)
					`;

					return Response.json({ success: true });
				} catch (error) {
					console.error('Vote submission error:', error);
					return Response.json({ error: 'Failed to submit vote: ' + (error as Error).message }, { status: 500 });
				}
			},
		},
	},
});
