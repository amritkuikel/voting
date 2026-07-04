import { createFileRoute } from '@tanstack/react-router';
import { getClient } from '#/db';

export const Route = createFileRoute('/api/election/reset')({
	server: {
		handlers: {
			POST: async () => {
				const client = await getClient();
				if (!client) {
					return Response.json({ error: 'Database not available' }, { status: 500 });
				}

				try {
					// Reset all vote counts
					await client`
						UPDATE candidates
						SET vote_count = 0
					`;

					// Delete all votes
					await client`
						DELETE FROM votes
					`;

					// Reset election state
					await client`
						UPDATE election_state
						SET is_active = false,
							total_votes = 0,
							started_at = NULL,
							stopped_at = NULL,
							updated_at = CURRENT_TIMESTAMP
						WHERE id = (SELECT id FROM election_state ORDER BY id DESC LIMIT 1)
					`;

					const result = (await client`
						SELECT * FROM election_state
						ORDER BY id DESC
						LIMIT 1
					`) as any[];

					return Response.json(result[0]);
				} catch (error) {
					return Response.json({ error: 'Failed to reset election' }, { status: 500 });
				}
			},
		},
	},
});
