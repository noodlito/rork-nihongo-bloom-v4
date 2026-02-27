import companionData from './companion_data.json';


export interface FoodItem {
  name: string;
  kanji: string;
  pronunciation: string;
  comment: string;
}

export interface ColorItem {
  name: string;
  kanji: string;
  pronunciation: string;
  comment: string;
}

export interface LocationItem {
  name: string;
  description: string;
}

export interface FamousPersonItem {
  name: string;
  occupation: string;
  bio: string;
  comment: string;
}

export type TopicKey = 'favorites' | 'locations' | 'famous_people';
export type FavoritesSubKey = 'food' | 'color';
export type LocationsSubKey = 'vacation' | 'community_events' | 'business';
export type FamousPeopleSubKey = 'athletes' | 'scientists' | 'ceos' | 'government_officials' | 'music_artists';
export type SubKey = FavoritesSubKey | LocationsSubKey | FamousPeopleSubKey;

const seenIndices: Record<string, number[]> = {};

function getRandomUnseen<T>(items: T[], category: string): T {
  if (!seenIndices[category]) {
    seenIndices[category] = [];
  }

  const seen = seenIndices[category];
  const unseen = items.map((_, i) => i).filter(i => !seen.includes(i));

  if (unseen.length === 0) {
    seenIndices[category] = [];
    const idx = Math.floor(Math.random() * items.length);
    seenIndices[category].push(idx);
    return items[idx];
  }

  const idx = unseen[Math.floor(Math.random() * unseen.length)];
  seen.push(idx);
  return items[idx];
}

export function getFoodItem(): FoodItem {
  return getRandomUnseen(companionData.favorites.food as FoodItem[], 'food');
}

export function getColorItem(): ColorItem {
  return getRandomUnseen(companionData.favorites.color as ColorItem[], 'color');
}

export function getVacationItem(): LocationItem {
  return getRandomUnseen(companionData.locations.vacation as LocationItem[], 'vacation');
}

export function getCommunityEventItem(): LocationItem {
  return getRandomUnseen(companionData.locations.community_events as LocationItem[], 'community_events');
}

export function getBusinessItem(): LocationItem {
  return getRandomUnseen(companionData.locations.business as LocationItem[], 'business');
}

export function getAthleteItem(): FamousPersonItem {
  return getRandomUnseen(companionData.famous_people.athletes as FamousPersonItem[], 'athletes');
}

export function getScientistItem(): FamousPersonItem {
  return getRandomUnseen(companionData.famous_people.scientists as FamousPersonItem[], 'scientists');
}

export function getCeoItem(): FamousPersonItem {
  return getRandomUnseen(companionData.famous_people.ceos as FamousPersonItem[], 'ceos');
}

export function getGovernmentItem(): FamousPersonItem {
  return getRandomUnseen(companionData.famous_people.government_officials as FamousPersonItem[], 'government_officials');
}

export function getMusicArtistItem(): FamousPersonItem {
  return getRandomUnseen(companionData.famous_people.music_artists as FamousPersonItem[], 'music_artists');
}

export function formatFoodResponse(item: FoodItem): string {
  return `🍣 ${item.name} — ${item.kanji} (${item.pronunciation})\n\n${item.comment}`;
}

export function formatColorResponse(item: ColorItem): string {
  return `🎨 ${item.name} — ${item.kanji} (${item.pronunciation})\n\n${item.comment}`;
}

export function formatLocationResponse(item: LocationItem): string {
  return `📍 ${item.name}\n\n${item.description}`;
}

export function formatFamousPersonResponse(item: FamousPersonItem): string {
  return `🌟 ${item.name}\n${item.occupation}\n\n${item.bio}\n\n${item.comment}`;
}

export interface BubbleOption {
  id: string;
  label: string;
  emoji: string;
}

export const MAIN_TOPICS: BubbleOption[] = [
  { id: 'favorites', label: 'Favorites', emoji: '💕' },
  { id: 'locations', label: 'Locations', emoji: '🏯' },
  { id: 'famous_people', label: 'Famous People', emoji: '🌟' },
];

export const FAVORITES_SUBS: BubbleOption[] = [
  { id: 'food', label: 'Food', emoji: '🍣' },
  { id: 'color', label: 'Colors', emoji: '🎨' },
];

export const LOCATIONS_SUBS: BubbleOption[] = [
  { id: 'vacation', label: 'Vacation Spots', emoji: '✈️' },
  { id: 'community_events', label: 'Community Events', emoji: '🎎' },
  { id: 'business', label: 'Business Districts', emoji: '🏢' },
];

export const FAMOUS_PEOPLE_SUBS: BubbleOption[] = [
  { id: 'athletes', label: 'Athletes', emoji: '⚽' },
  { id: 'scientists', label: 'Scientists', emoji: '🔬' },
  { id: 'ceos', label: 'CEOs', emoji: '💼' },
  { id: 'government_officials', label: 'Government Officials', emoji: '🏛️' },
  { id: 'music_artists', label: 'Music Artists', emoji: '🎵' },
];

export function getSubTopics(topic: TopicKey): BubbleOption[] {
  switch (topic) {
    case 'favorites': return FAVORITES_SUBS;
    case 'locations': return LOCATIONS_SUBS;
    case 'famous_people': return FAMOUS_PEOPLE_SUBS;
  }
}

export function getTopicIntro(topic: TopicKey): string {
  switch (topic) {
    case 'favorites': return "Ooh, favorites arc! 💕 I have strong opinions on these, fair warning~";
    case 'locations': return "Japan's map is LOADED with legendary spots! 🏯 Where should we explore?";
    case 'famous_people': return "Time to unlock some character bios! 🌟 Who catches your eye?";
  }
}

export function getResponseForSub(sub: SubKey): string {
  switch (sub) {
    case 'food': return formatFoodResponse(getFoodItem());
    case 'color': return formatColorResponse(getColorItem());
    case 'vacation': return formatLocationResponse(getVacationItem());
    case 'community_events': return formatLocationResponse(getCommunityEventItem());
    case 'business': return formatLocationResponse(getBusinessItem());
    case 'athletes': return formatFamousPersonResponse(getAthleteItem());
    case 'scientists': return formatFamousPersonResponse(getScientistItem());
    case 'ceos': return formatFamousPersonResponse(getCeoItem());
    case 'government_officials': return formatFamousPersonResponse(getGovernmentItem());
    case 'music_artists': return formatFamousPersonResponse(getMusicArtistItem());
  }
}

export function getSubIntro(sub: SubKey): string {
  switch (sub) {
    case 'food': return "Okay so THIS one is S-tier! 🍱 Trust me~";
    case 'color': return "Rare drop incoming! A beautiful color fact~ 🎨";
    case 'vacation': return "Fast travel unlocked! Check out this spot~ ✈️";
    case 'community_events': return "Event quest discovered! This one's so cool~ 🎎";
    case 'business': return "Achievement unlocked: Japanese business lore! 🏢";
    case 'athletes': return "Boss-level athlete incoming! ⚽ Prepare yourself~";
    case 'scientists': return "Intelligence stat: MAX. Meet this legend! 🔬";
    case 'ceos': return "Power move! Here's a visionary leader~ 💼";
    case 'government_officials': return "Main story NPC unlocked! Important figure ahead~ 🏛️";
    case 'music_artists': return "BGM unlocked! This artist is fire~ 🎵";
  }
}
