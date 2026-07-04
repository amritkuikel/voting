import { createFileRoute } from '@tanstack/react-router';
import { getClient } from '#/db';

export const Route = createFileRoute('/api/election/export')({
	server: {
		handlers: {
			GET: async () => {
				const client = await getClient();
				if (!client) {
					return Response.json({ error: 'Database not available' }, { status: 500 });
				}

				try {
					const votes = (await client`
						SELECT 
							v.id,
							v.head_boy_candidate_id,
							hb.name as head_boy_name,
							v.head_girl_candidate_id,
							hg.name as head_girl_name,
							v.selected_house,
							v.house_captain_candidate_id,
							hc.name as house_captain_name,
							v.voted_at
						FROM votes v
						JOIN candidates hb ON v.head_boy_candidate_id = hb.id
						JOIN candidates hg ON v.head_girl_candidate_id = hg.id
						JOIN candidates hc ON v.house_captain_candidate_id = hc.id
						ORDER BY v.voted_at DESC
					`) as any[];

					// Convert to CSV
					const headers = ['Vote ID', 'Head Boy', 'Head Girl', 'Selected House', 'House Captain', 'Voted At'];
					const csvRows = [
						headers.join(','),
						...votes.map((vote) =>
							[
								vote.id,
								vote.head_boy_name,
								vote.head_girl_name,
								vote.selected_house,
								vote.house_captain_name,
								vote.voted_at,
							].join(','),
						),
					];

					const csv = csvRows.join('\n');

					return new Response(csv, {
						headers: {
							'Content-Type': 'text/csv',
							'Content-Disposition': 'attachment; filename=election_results.csv',
						},
					});
				} catch (error) {
					return Response.json({ error: 'Failed to export results' }, { status: 500 });
				}
			},
		},
	},
});
