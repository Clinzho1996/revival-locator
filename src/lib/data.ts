import { ChristianEvent } from '@/types';

export const MOCK_EVENTS: ChristianEvent[] = [
  {
    id: '1',
    title: 'City-Wide Revival 2026',
    description: 'A powerful gathering of believers to seek God\'s face and pray for our city.',
    longDescription: 'Join thousands of believers as we gather together for a weekend of intense worship, prayer, and the word. This revival is focused on bringing unity to the body of Christ and seeking spiritual breakthrough for our families and community.',
    date: new Date().toISOString(), // Today
    startTime: '18:00',
    location: 'Central Plaza',
    address: '123 Faith Street, Grace City',
    coordinates: { lat: 40.7128, lng: -74.006 },
    imageUrl: '/events/revival.png',
    category: 'Revival',
    organizer: 'Kingdom Alliance',
    interestCount: 1240,
    status: 'upcoming',
    reviews: [
      { id: 'r1', userId: 'u1', userName: 'John Doe', rating: 5, comment: 'Life-changing experience last year!', createdAt: '2025-12-01T10:00:00Z' }
    ],
    forumMessages: [
      { id: 'm1', userId: 'u1', userName: 'John Doe', content: 'Can\'t wait for this year!', createdAt: '2026-03-01T09:00:00Z' }
    ]
  },
  {
    id: '2',
    title: 'Youth Worship Night',
    description: 'An evening of energetic worship and fellowship for the next generation.',
    date: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
    startTime: '19:30',
    location: 'Grace Community Church',
    address: '45 Church Road, Holy Park',
    coordinates: { lat: 40.7589, lng: -73.9851 },
    imageUrl: '/events/youth.png',
    category: 'Youth',
    organizer: 'Radiant Youth',
    interestCount: 450,
    status: 'upcoming',
    reviews: [],
    forumMessages: []
  },
  {
    id: '3',
    title: 'Annual Leadership Conference',
    description: 'Equipping leaders for effective ministry in the modern world.',
    date: new Date(Date.now() + 604800000).toISOString(), // Next week
    startTime: '09:00',
    location: 'Skyline Convention Center',
    address: '88 Horizon Ave, Downtown',
    coordinates: { lat: 40.7484, lng: -73.9857 },
    imageUrl: '/events/leadership.png',
    category: 'Conference',
    organizer: 'Lead Global',
    interestCount: 2100,
    status: 'upcoming',
    reviews: [],
    forumMessages: []
  }
];
