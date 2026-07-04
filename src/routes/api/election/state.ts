import { createFileRoute } from '@tanstack/react-router';
import { getClient } from '#/db';

export const Route = createFileRoute('/api/election/state')({
	server: {
		handlers: {
			GET: async () => {
				const client = await getClient();
				if (!client) {
					return Response.json({ error: 'Database not available' }, { status: 500 });
				}

				try {
					const result = (await client`
						SELECT * FROM election_state
						ORDER BY id DESC
						LIMIT 1
					`) as any[];

					if (!result || result.length === 0) {
						// Initialize election state
						await client`
							INSERT INTO election_state (is_active, total_votes)
							VALUES (false, 0)
						`;
						const newState = (await client`
							SELECT * FROM election_state
							ORDER BY id DESC
							LIMIT 1
						`) as any[];
						return Response.json(newState[0]);
					}

					return Response.json(result[0]);
				} catch (error) {
					console.error('Election state fetch error:', error);
					return Response.json({ error: 'Failed to fetch election state' }, { status: 500 });
				}
			},
		},
	},
});
