import type { Candidate, House, Position } from './types';

export const CANDIDATES: Candidate[] = [
	// HEAD BOY
	{
		id: 1,
		name: 'Sugam Gomja',
		position: 'head_boy',
		symbol: 'Book',
		symbolImage: 'Book.png',
		photoImage: 'Book1.jpg',
	},
	{
		id: 2,
		name: 'Saugat Shrestha',
		position: 'head_boy',
		symbol: 'Sunglass',
		symbolImage: 'Sunglass.png',
		photoImage: 'Sunglass1.jpg',
	},
	{
		id: 3,
		name: 'Prince Bajagain',
		position: 'head_boy',
		symbol: 'Duster',
		symbolImage: 'Duster.jpg',
		photoImage: 'Duster1.jpg',
	},
	{
		id: 4,
		name: 'Aaditya Chimariya',
		position: 'head_boy',
		symbol: 'Chair',
		symbolImage: 'Chair.png',
		photoImage: 'Chair1.jpg',
	},
	// HEAD GIRL
	{
		id: 5,
		name: 'Anshu Pokhrel',
		position: 'head_girl',
		symbol: 'Belt',
		symbolImage: 'Belt.png',
		photoImage: 'Belt1.jpg',
	},
	{
		id: 6,
		name: 'Krinsha Mainali',
		position: 'head_girl',
		symbol: 'Table',
		symbolImage: 'Table.png',
		photoImage: 'Table1.jpg',
	},
	{
		id: 7,
		name: 'Arpita Pokhrel',
		position: 'head_girl',
		symbol: 'Marker',
		symbolImage: 'Marker.png',
		photoImage: 'Marker1.jpg',
	},
	{
		id: 8,
		name: 'Srijana Thing',
		position: 'head_girl',
		symbol: 'Fan',
		symbolImage: 'Fan.png',
		photoImage: 'Fan1.jpg',
	},
	// BLUE HOUSE
	{
		id: 9,
		name: 'Ajay Ghimire',
		position: 'house_captain',
		house: 'blue',
		symbol: 'Key',
		symbolImage: 'Key.png',
		photoImage: 'Key1.jpg',
	},
	{
		id: 10,
		name: 'Sadikshya Mainali',
		position: 'house_captain',
		house: 'blue',
		symbol: 'Stapler',
		symbolImage: 'Stapler.png',
		photoImage: 'Stapler1.jpg',
	},
	{
		id: 11,
		name: 'Ayusha Ghimire',
		position: 'house_captain',
		house: 'blue',
		symbol: 'Tap',
		symbolImage: 'Tap.png',
		photoImage: 'Tap1.jpg',
	},
	{
		id: 12,
		name: 'Punam Adhikari',
		position: 'house_captain',
		house: 'blue',
		symbol: 'House',
		symbolImage: 'house.png',
		photoImage: 'house1.jpg',
	},
	// YELLOW HOUSE
	{
		id: 13,
		name: 'Archand Thada Magar',
		position: 'house_captain',
		house: 'yellow',
		symbol: 'Bicycle',
		symbolImage: 'bicycle.png',
		photoImage: 'bicycle1.jpg',
	},
	{
		id: 14,
		name: 'Roshan Bishwokarma',
		position: 'house_captain',
		house: 'yellow',
		symbol: 'Flower',
		symbolImage: 'flower.png',
		photoImage: 'Flower1.jpg',
	},
	{
		id: 15,
		name: 'Subodh Khanal',
		position: 'house_captain',
		house: 'yellow',
		symbol: 'Bulb',
		symbolImage: 'Bulb.png',
		photoImage: 'Bulb1.jpg',
	},
	{
		id: 16,
		name: 'Puspa Ale Magar',
		position: 'house_captain',
		house: 'yellow',
		symbol: 'Monitor',
		symbolImage: 'Monitor.png',
		photoImage: 'Monitor1.jpg',
	},
	// RED HOUSE
	{
		id: 17,
		name: 'Aaditya Lakai',
		position: 'house_captain',
		house: 'red',
		symbol: 'Tie',
		symbolImage: 'Tie.png',
		photoImage: 'Tie1.jpg',
	},
	{
		id: 18,
		name: 'Swornima Pokhrel',
		position: 'house_captain',
		house: 'red',
		symbol: 'Geometry Box',
		symbolImage: 'Geometry Box.jpg',
		photoImage: 'Geometry Box1.jpg',
	},
	{
		id: 19,
		name: 'Mandip Magar',
		position: 'house_captain',
		house: 'red',
		symbol: 'Mouse',
		symbolImage: 'Mouse.png',
		photoImage: 'Mouse1.jpg',
	},
	{
		id: 20,
		name: 'Ujjwal Poudel',
		position: 'house_captain',
		house: 'red',
		symbol: 'Umbrella',
		symbolImage: 'umbrella.png',
		photoImage: 'Umbrella1.jpg',
	},
	// GREEN HOUSE
	{
		id: 21,
		name: 'Rubus Parajuli',
		position: 'house_captain',
		house: 'green',
		symbol: 'Keyboard',
		symbolImage: 'Keyboard.png',
		photoImage: 'Keyboard1.jpg',
	},
	{
		id: 22,
		name: 'Santosh Gole',
		position: 'house_captain',
		house: 'green',
		symbol: 'Bottle',
		symbolImage: 'Bottle.png',
		photoImage: 'Bottle1.jpg',
	},
	{
		id: 23,
		name: 'Nancy Neupane',
		position: 'house_captain',
		house: 'green',
		symbol: 'Watch',
		symbolImage: 'Watch.png',
		photoImage: 'Watch1.jpg',
	},
	{
		id: 24,
		name: 'Priyanka Chaudhary',
		position: 'house_captain',
		house: 'green',
		symbol: 'Speaker',
		symbolImage: 'Speaker.png',
		photoImage: 'Speaker1.jpg',
	},
];

export function getCandidatesByPosition(position: Position): Candidate[] {
	return CANDIDATES.filter((c) => c.position === position);
}

export function getCandidatesByHouse(house: House): Candidate[] {
	return CANDIDATES.filter((c) => c.house === house);
}

export function getCandidateById(id: number): Candidate | undefined {
	return CANDIDATES.find((c) => c.id === id);
}

export function getCandidateBySymbol(symbol: string, position?: Position, house?: House): Candidate | undefined {
	return CANDIDATES.find((c) => {
		if (c.symbol !== symbol) return false;
		if (position && c.position !== position) return false;
		if (house && c.house !== house) return false;
		return true;
	});
}
