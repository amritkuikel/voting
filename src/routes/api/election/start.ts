import { createFileRoute } from '@tanstack/react-router';
import { getClient } from '#/db';

export const Route = createFileRoute('/api/election/start')({
	server: {
		handlers: {
			POST: async () => {
				const client = await getClient();
				if (!client) {
					return Response.json({ error: 'Database not available' }, { status: 500 });
				}

				try {
					await client`
						UPDATE election_state
						SET is_active = true,
							started_at = CURRENT_TIMESTAMP,
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
					return Response.json({ error: 'Failed to start election' }, { status: 500 });
				}
			},
		},
	},
});
