export type House = 'blue' | 'yellow' | 'red' | 'green';
export type Position = 'head_boy' | 'head_girl' | 'house_captain';

export interface Candidate {
	id?: number;
	name: string;
	position: Position;
	house?: House;
	symbol: string;
	symbolImage: string;
	photoImage: string;
	voteCount?: number;
}

export interface Vote {
	id?: number;
	headBoyCandidateId: number;
	headGirlCandidateId: number;
	selectedHouse: House;
	houseCaptainCandidateId: number;
	votedAt?: Date;
}

export interface ElectionState {
	id?: number;
	isActive: boolean;
	totalVotes: number;
	startedAt?: Date;
	stoppedAt?: Date;
	updatedAt?: Date;
}

export interface VotingSession {
	headBoySelection: number | null;
	headGirlSelection: number | null;
	houseSelection: House | null;
	houseCaptainSelection: number | null;
}

export const HOUSES: House[] = ['blue', 'yellow', 'red', 'green'];

export const HOUSE_COLORS = {
	blue: 'bg-blue-500',
	yellow: 'bg-yellow-500',
	red: 'bg-red-500',
	green: 'bg-green-500',
} as const;

export const HOUSE_NAMES = {
	blue: 'Blue House',
	yellow: 'Yellow House',
	red: 'Red House',
	green: 'Green House',
} as const;
