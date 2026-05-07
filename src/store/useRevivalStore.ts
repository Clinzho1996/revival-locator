// store/useRevivalStore.ts
import axios, { AxiosInstance } from "axios";
import { toast } from "sonner";
import { create } from "zustand";
import { persist } from "zustand/middleware";

// Types
export interface User {
	_id: string;
	name: string;
	email: string;
	avatar?: string;
	role: "user" | "admin";
	bookmarks: string[];
	createdAt: string;
	updatedAt: string;
}

export interface Location {
	address: string;
	city?: string;
	state?: string;
	country?: string;
}

export interface Event {
	_id: string;
	title: string;
	description: string;
	category: string | Category;
	location: Location;
	date: string;
	time?: string;
	organizer: string | User;
	attendees: number;
	status: string;
	isFree?: boolean;
	price?: number;
	image?: string;
	banner?: string;
	createdAt: string;
	updatedAt: string;
}

export interface Category {
	_id: string;
	icon: string;
	name: string;
	eventCount: number;
	description?: string;
}

export interface Resource {
	_id: string;
	title: string;
	description?: string;
	type: string;
	fileUrl?: string;
	uploadedBy: string | User;
	createdAt: string;
}

export interface Review {
	_id: string;
	user: string | User;
	event: string | Event;
	rating: number;
	comment: string;
	createdAt?: string;
}

export interface Message {
	_id: string;
	event: string | Event;
	user: string | User;
	message: string;
	parent: string | null;
	createdAt: string;
	updatedAt: string;
}

export interface ForumPost {
	_id: string;
	title: string;
	content: string;
	user: string | User;
	replies: ForumReply[];
	createdAt: string;
	updatedAt: string;
}

export interface ForumReply {
	_id: string;
	message: string;
	user: string | User;
	createdAt: string;
}

export interface Subscription {
	_id: string;
	email: string;
}

export interface DashboardStats {
	totalEvents: number;
	totalBookmarks: number;
}

export interface AnalyticsData {
	overview: {
		totalEvents: number;
		totalUsers: number;
		totalReviews: number;
		totalMessages: number;
	};
	recent: {
		events: Event[];
		users: User[];
	};
}

// API Response types
interface ApiResponse<T> {
	success: boolean;
	message: string;
	data: T;
}

interface AuthResponse {
	user: User;
	token: string;
}

interface BookmarkResponse {
	bookmarks: string[];
	total: number;
}

export interface Blog {
	_id: string;
	title: string;
	slug: string;
	content: string;
	excerpt: string;
	featuredImage: string;
	category: string;
	tags: string[];
	author: string | User;
	readTime: number;
	views: number;
	likes: number;
	status: string;
	publishedAt: string;
	createdAt: string;
	updatedAt: string;
}
// State types
interface RevivalState {
	// Auth state
	user: User | null;
	token: string | null;
	isAuthenticated: boolean;
	isLoading: boolean;
	error: string | null;

	// Data states
	events: Event[];
	bookmarkedEvents: Event[];
	resources: Resource[];
	reviews: Review[];
	messages: Message[];
	forumPosts: ForumPost[];
	categories: Category[];
	subscriptions: Subscription[];
	analytics: AnalyticsData | null;
	dashboardData: {
		myEvents: Event[];
		bookmarks: Event[];
		stats: DashboardStats;
	} | null;

	// Selected item states
	selectedEvent: Event | null;
	selectedResource: Resource | null;
	selectedForumPost: ForumPost | null;

	// Pagination
	pagination: {
		page: number;
		limit: number;
		total: number;
	};

	// Actions
	blogs: Blog[];
	selectedBlog: Blog | null;
	getBlogs: (params?: {
		page?: number;
		category?: string;
		search?: string;
	}) => Promise<void>;
	getBlogBySlug: (slug: string) => Promise<void>;
	createBlog: (blogData: Partial<Blog>) => Promise<void>;
	updateBlog: (id: string, blogData: Partial<Blog>) => Promise<void>;
	deleteBlog: (id: string) => Promise<void>;
	likeBlog: (id: string) => Promise<void>;
	setLoading: (loading: boolean) => void;
	setError: (error: string | null) => void;

	// Auth actions
	register: (name: string, email: string, password: string) => Promise<void>;
	login: (email: string, password: string) => Promise<void>;
	logout: () => void;
	getProfile: () => Promise<void>;
	updateProfile: (data: Partial<User>) => Promise<void>;
	changePassword: (
		currentPassword: string,
		newPassword: string,
	) => Promise<void>;

	// Event actions
	createEvent: (eventData: Partial<Event>) => Promise<void>;
	getEvents: (params?: { status?: string; category?: string }) => Promise<void>;
	getEventById: (id: string) => Promise<void>;
	updateEvent: (id: string, eventData: Partial<Event>) => Promise<void>;
	deleteEvent: (id: string) => Promise<void>;
	searchEvents: (keyword: string, city?: string) => Promise<void>;

	// Bookmark actions
	toggleBookmark: (eventId: string) => Promise<void>;
	getBookmarks: () => Promise<void>;
	removeBookmark: (eventId: string) => Promise<void>;

	// Resource actions
	createResource: (resourceData: Partial<Resource>) => Promise<void>;
	getResources: () => Promise<void>;
	deleteResource: (id: string) => Promise<void>;
	updateResource: (
		id: string,
		data: {
			title: string;
			description?: string;
			type: string;
			fileUrl: string;
		},
	) => Promise<void>;

	// Review actions
	createReview: (
		eventId: string,
		rating: number,
		comment: string,
	) => Promise<void>;
	getReviewsByEvent: (eventId: string) => Promise<void>;
	deleteReview: (reviewId: string) => Promise<void>;

	// Chat/Message actions
	sendMessage: (
		eventId: string,
		message: string,
		parentId?: string,
	) => Promise<void>;
	getEventMessages: (eventId: string) => Promise<void>;

	// Forum actions
	createForumPost: (title: string, content: string) => Promise<void>;
	getForumPosts: () => Promise<void>;
	replyToPost: (postId: string, message: string) => Promise<void>;
	deleteForumPost: (postId: string) => Promise<void>;

	// Subscription actions
	subscribe: (email: string) => Promise<void>;

	// Category actions (admin only)
	createCategory: (name: string, description?: string) => Promise<void>;
	getCategories: () => Promise<void>;
	updateCategory: (
		id: string,
		data: { name: string; description?: string },
	) => Promise<void>;
	deleteCategory: (id: string) => Promise<void>;

	// Admin actions
	getAnalytics: () => Promise<void>;
	getDashboard: () => Promise<void>;
	getAllUsers: () => Promise<User[]>;
	updateUserRole: (userId: string, role: "user" | "admin") => Promise<void>;
	deleteUser: (userId: string) => Promise<void>;
	allUsers: User[];

	// Utility
	clearError: () => void;
}

// Create axios instance
const api: AxiosInstance = axios.create({
	baseURL: "https://revival-locator-backend.onrender.com/api",
	headers: {
		"Content-Type": "application/json",
	},
});

// Add token to requests
api.interceptors.request.use((config) => {
	const token = localStorage.getItem("token");
	if (token) {
		config.headers.Authorization = `Bearer ${token}`;
	}
	return config;
});

export const useRevivalStore = create<RevivalState>()(
	persist(
		(set, get) => ({
			// Initial state
			blogs: [],
			selectedBlog: null,
			allUsers: [],
			user: null,
			token: null,
			isAuthenticated: false,
			isLoading: false,
			error: null,
			events: [],
			bookmarkedEvents: [],
			resources: [],
			reviews: [],
			messages: [],
			forumPosts: [],
			categories: [],
			subscriptions: [],
			analytics: null,
			dashboardData: null,
			selectedEvent: null,
			selectedResource: null,
			selectedForumPost: null,
			pagination: {
				page: 1,
				limit: 10,
				total: 0,
			},

			// Basic actions
			setLoading: (loading) => set({ isLoading: loading }),
			setError: (error) => set({ error }),
			clearError: () => set({ error: null }),

			// Auth actions
			register: async (name, email, password) => {
				set({ isLoading: true, error: null });
				try {
					const response = await api.post<AuthResponse>("/auth/register", {
						name,
						email,
						password,
					});
					const { user, token } = response.data;
					localStorage.setItem("token", token);
					set({
						user,
						token,
						isAuthenticated: true,
						isLoading: false,
					});
				} catch (error: any) {
					set({
						error: error.response?.data?.message || "Registration failed",
						isLoading: false,
					});
					throw error;
				}
			},

			login: async (email, password) => {
				set({ isLoading: true, error: null });
				try {
					const response = await api.post<AuthResponse>("/auth/login", {
						email,
						password,
					});
					const { user, token } = response.data;
					localStorage.setItem("token", token);
					set({
						user,
						token,
						isAuthenticated: true,
						isLoading: false,
					});
				} catch (error: any) {
					set({
						error: error.response?.data?.message || "Login failed",
						isLoading: false,
					});
					throw error;
				}
			},

			logout: () => {
				localStorage.removeItem("token");
				set({
					user: null,
					token: null,
					isAuthenticated: false,
					events: [],
					bookmarkedEvents: [],
					resources: [],
					reviews: [],
					messages: [],
					forumPosts: [],
					categories: [],
					subscriptions: [],
					analytics: null,
					dashboardData: null,
				});
			},

			getProfile: async () => {
				set({ isLoading: true, error: null });
				try {
					const response = await api.get<ApiResponse<User>>("/users/me");
					set({
						user: response.data.data,
						isLoading: false,
					});
				} catch (error: any) {
					set({
						error: error.response?.data?.message || "Failed to get profile",
						isLoading: false,
					});
				}
			},

			updateProfile: async (data) => {
				set({ isLoading: true, error: null });
				try {
					const response = await api.put<ApiResponse<User>>("/users/me", data);
					set({
						user: response.data.data,
						isLoading: false,
					});
				} catch (error: any) {
					set({
						error: error.response?.data?.message || "Failed to update profile",
						isLoading: false,
					});
					throw error;
				}
			},
			changePassword: async (currentPassword: string, newPassword: string) => {
				set({ isLoading: true, error: null });
				try {
					const response = await api.put("/users/change-password", {
						currentPassword,
						newPassword,
					});
					set({ isLoading: false });
					return response.data;
				} catch (error: any) {
					set({
						error: error.response?.data?.message || "Failed to change password",
						isLoading: false,
					});
					throw error;
				}
			},

			// Event actions
			createEvent: async (eventData) => {
				set({ isLoading: true, error: null });
				try {
					const response = await api.post<ApiResponse<Event>>(
						"/events",
						eventData,
					);
					set((state) => ({
						events: [response.data.data, ...state.events],
						isLoading: false,
					}));
				} catch (error: any) {
					set({
						error: error.response?.data?.message || "Failed to create event",
						isLoading: false,
					});
					throw error;
				}
			},

			getEvents: async (params) => {
				set({ isLoading: true, error: null });
				try {
					const response = await api.get<Event[]>("/events", { params });
					set({
						events: response.data,
						isLoading: false,
					});
				} catch (error: any) {
					set({
						error: error.response?.data?.message || "Failed to fetch events",
						isLoading: false,
					});
				}
			},

			getEventById: async (id) => {
				set({ isLoading: true, error: null });
				try {
					const response = await api.get<Event>(`/events/${id}`);
					set({
						selectedEvent: response.data,
						isLoading: false,
					});
				} catch (error: any) {
					set({
						error: error.response?.data?.message || "Failed to fetch event",
						isLoading: false,
					});
				}
			},

			updateEvent: async (id, eventData) => {
				set({ isLoading: true, error: null });
				try {
					const response = await api.put<Event>(`/events/${id}`, eventData);
					set((state) => ({
						events: state.events.map((event) =>
							event._id === id ? response.data : event,
						),
						selectedEvent: response.data,
						isLoading: false,
					}));
				} catch (error: any) {
					set({
						error: error.response?.data?.message || "Failed to update event",
						isLoading: false,
					});
					throw error;
				}
			},

			deleteEvent: async (id) => {
				set({ isLoading: true, error: null });
				try {
					await api.delete(`/events/${id}`);
					set((state) => ({
						events: state.events.filter((event) => event._id !== id),
						isLoading: false,
					}));
				} catch (error: any) {
					set({
						error: error.response?.data?.message || "Failed to delete event",
						isLoading: false,
					});
					throw error;
				}
			},

			searchEvents: async (keyword, city) => {
				set({ isLoading: true, error: null });
				try {
					const response = await api.get<Event[]>("/events/search", {
						params: { keyword, city },
					});
					set({
						events: response.data,
						isLoading: false,
					});
				} catch (error: any) {
					set({
						error: error.response?.data?.message || "Failed to search events",
						isLoading: false,
					});
				}
			},

			// Bookmark actions
			toggleBookmark: async (eventId) => {
				set({ isLoading: true, error: null });
				try {
					const response = await api.post<ApiResponse<BookmarkResponse>>(
						`/bookmarks/${eventId}`,
					);
					// Update user's bookmarks in state
					if (get().user) {
						set((state) => ({
							user: state.user
								? { ...state.user, bookmarks: response.data.data.bookmarks }
								: null,
							isLoading: false,
						}));
					}
					await get().getBookmarks(); // Refresh bookmarks list
				} catch (error: any) {
					set({
						error: error.response?.data?.message || "Failed to toggle bookmark",
						isLoading: false,
					});
					throw error;
				}
			},

			getBookmarks: async () => {
				set({ isLoading: true, error: null });
				try {
					const response =
						await api.get<ApiResponse<{ bookmarks: Event[]; total: number }>>(
							"/bookmarks",
						);
					set({
						bookmarkedEvents: response.data.data.bookmarks,
						pagination: {
							...get().pagination,
							total: response.data.data.total,
						},
						isLoading: false,
					});
				} catch (error: any) {
					set({
						error: error.response?.data?.message || "Failed to fetch bookmarks",
						isLoading: false,
					});
				}
			},

			removeBookmark: async (eventId) => {
				set({ isLoading: true, error: null });
				try {
					await api.post(`/bookmarks/${eventId}`);
					set((state) => ({
						bookmarkedEvents: state.bookmarkedEvents.filter(
							(event) => event._id !== eventId,
						),
						isLoading: false,
					}));
				} catch (error: any) {
					set({
						error: error.response?.data?.message || "Failed to remove bookmark",
						isLoading: false,
					});
					throw error;
				}
			},

			// Resource actions
			createResource: async (resourceData) => {
				set({ isLoading: true, error: null });
				try {
					const response = await api.post<ApiResponse<Resource>>(
						"/resources",
						resourceData,
					);
					set((state) => ({
						resources: [response.data.data, ...state.resources],
						isLoading: false,
					}));
				} catch (error: any) {
					set({
						error: error.response?.data?.message || "Failed to create resource",
						isLoading: false,
					});
					throw error;
				}
			},

			updateResource: async (
				id: string,
				data: {
					title: string;
					description?: string;
					type: string;
					fileUrl: string;
				},
			) => {
				set({ isLoading: true, error: null });
				try {
					const response = await api.put(`/resources/${id}`, data);

					// Update the resource in the resources array
					set((state) => ({
						resources: state.resources.map((resource: Resource) =>
							resource._id === id ? { ...resource, ...data } : resource,
						),
						isLoading: false,
					}));

					return response.data;
				} catch (error: any) {
					set({
						error: error.response?.data?.message || "Failed to update resource",
						isLoading: false,
					});
					throw error;
				}
			},
			getResources: async () => {
				set({ isLoading: true, error: null });
				try {
					const response =
						await api.get<
							ApiResponse<{ resources: Resource[]; total: number }>
						>("/resources");
					set({
						resources: response.data.data.resources,
						pagination: {
							...get().pagination,
							total: response.data.data.total,
						},
						isLoading: false,
					});
				} catch (error: any) {
					set({
						error: error.response?.data?.message || "Failed to fetch resources",
						isLoading: false,
					});
				}
			},

			deleteResource: async (id) => {
				set({ isLoading: true, error: null });
				try {
					await api.delete(`/resources/${id}`);
					set((state) => ({
						resources: state.resources.filter(
							(resource) => resource._id !== id,
						),
						isLoading: false,
					}));
				} catch (error: any) {
					set({
						error: error.response?.data?.message || "Failed to delete resource",
						isLoading: false,
					});
					throw error;
				}
			},

			// Review actions
			createReview: async (eventId, rating, comment) => {
				set({ isLoading: true, error: null });
				try {
					const response = await api.post<ApiResponse<Review>>("/reviews", {
						event: eventId,
						rating,
						comment,
					});
					set((state) => ({
						reviews: [response.data.data, ...state.reviews],
						isLoading: false,
					}));
				} catch (error: any) {
					set({
						error: error.response?.data?.message || "Failed to create review",
						isLoading: false,
					});
					throw error;
				}
			},

			getReviewsByEvent: async (eventId) => {
				set({ isLoading: true, error: null });
				try {
					const response = await api.get<
						ApiResponse<{ reviews: Review[]; total: number }>
					>(`/reviews/${eventId}`);
					set({
						reviews: response.data.data.reviews,
						pagination: {
							...get().pagination,
							total: response.data.data.total,
						},
						isLoading: false,
					});
				} catch (error: any) {
					set({
						error: error.response?.data?.message || "Failed to fetch reviews",
						isLoading: false,
					});
				}
			},

			deleteReview: async (reviewId) => {
				set({ isLoading: true, error: null });
				try {
					await api.delete(`/reviews/${reviewId}`);
					set((state) => ({
						reviews: state.reviews.filter((review) => review._id !== reviewId),
						isLoading: false,
					}));
				} catch (error: any) {
					set({
						error: error.response?.data?.message || "Failed to delete review",
						isLoading: false,
					});
					throw error;
				}
			},

			// Chat/Message actions
			sendMessage: async (eventId, message, parentId = undefined) => {
				set({ isLoading: true, error: null });
				try {
					const response = await api.post<ApiResponse<Message>>("/chat", {
						event: eventId,
						message,
						parent: parentId,
					});
					set((state) => ({
						messages: [...state.messages, response.data.data],
						isLoading: false,
					}));
				} catch (error: any) {
					set({
						error: error.response?.data?.message || "Failed to send message",
						isLoading: false,
					});
					throw error;
				}
			},

			getEventMessages: async (eventId) => {
				set({ isLoading: true, error: null });
				try {
					const response = await api.get<
						ApiResponse<{ messages: Message[]; total: number }>
					>(`/chat/${eventId}`);
					set({
						messages: response.data.data.messages,
						pagination: {
							...get().pagination,
							total: response.data.data.total,
						},
						isLoading: false,
					});
				} catch (error: any) {
					set({
						error: error.response?.data?.message || "Failed to fetch messages",
						isLoading: false,
					});
				}
			},

			// Forum actions
			createForumPost: async (title, content) => {
				set({ isLoading: true, error: null });
				try {
					const response = await api.post<ApiResponse<ForumPost>>("/forum", {
						title,
						content,
					});
					set((state) => ({
						forumPosts: [response.data.data, ...state.forumPosts],
						isLoading: false,
					}));
				} catch (error: any) {
					set({
						error:
							error.response?.data?.message || "Failed to create forum post",
						isLoading: false,
					});
					throw error;
				}
			},

			getForumPosts: async () => {
				set({ isLoading: true, error: null });
				try {
					const response =
						await api.get<ApiResponse<{ posts: ForumPost[]; total: number }>>(
							"/forum",
						);
					set({
						forumPosts: response.data.data.posts,
						pagination: {
							...get().pagination,
							total: response.data.data.total,
						},
						isLoading: false,
					});
				} catch (error: any) {
					set({
						error:
							error.response?.data?.message || "Failed to fetch forum posts",
						isLoading: false,
					});
				}
			},

			replyToPost: async (postId, message) => {
				set({ isLoading: true, error: null });
				try {
					const response = await api.post<ApiResponse<ForumPost>>(
						`/forum/${postId}/reply`,
						{ message },
					);
					set((state) => ({
						forumPosts: state.forumPosts.map((post) =>
							post._id === postId ? response.data.data : post,
						),
						selectedForumPost:
							state.selectedForumPost?._id === postId
								? response.data.data
								: state.selectedForumPost,
						isLoading: false,
					}));
				} catch (error: any) {
					set({
						error: error.response?.data?.message || "Failed to add reply",
						isLoading: false,
					});
					throw error;
				}
			},

			deleteForumPost: async (postId) => {
				set({ isLoading: true, error: null });
				try {
					await api.delete(`/forum/${postId}`);
					set((state) => ({
						forumPosts: state.forumPosts.filter((post) => post._id !== postId),
						isLoading: false,
					}));
				} catch (error: any) {
					set({
						error:
							error.response?.data?.message || "Failed to delete forum post",
						isLoading: false,
					});
					throw error;
				}
			},

			// Subscription actions
			subscribe: async (email) => {
				set({ isLoading: true, error: null });
				try {
					const response = await api.post<ApiResponse<Subscription>>(
						"/subscribe",
						{ email },
					);
					set((state) => ({
						subscriptions: [...state.subscriptions, response.data.data],
						isLoading: false,
					}));
				} catch (error: any) {
					set({
						error: error.response?.data?.message || "Failed to subscribe",
						isLoading: false,
					});
					throw error;
				}
			},

			// Add these to your store actions:

			// Admin User Management
			getAllUsers: async () => {
				set({ isLoading: true, error: null });
				try {
					const response = await api.get("/users/all");
					set({
						allUsers: response.data.data,
						isLoading: false,
					});
					return response.data.data;
				} catch (error: any) {
					set({
						error: error.response?.data?.message || "Failed to fetch users",
						isLoading: false,
					});
					throw error;
				}
			},

			updateUserRole: async (userId: string, role: "user" | "admin") => {
				set({ isLoading: true, error: null });
				try {
					const response = await api.put(`/users/${userId}/role`, { role });
					set({ isLoading: false });

					// Update the user in the allUsers array if it exists
					set((state) => ({
						allUsers:
							state.allUsers?.map((user: User) =>
								user._id === userId ? { ...user, role } : user,
							) || [],
					}));

					return response.data;
				} catch (error: any) {
					set({
						error:
							error.response?.data?.message || "Failed to update user role",
						isLoading: false,
					});
					throw error;
				}
			},

			deleteUser: async (userId: string) => {
				set({ isLoading: true, error: null });
				try {
					const response = await api.delete(`/users/${userId}`);
					set({ isLoading: false });

					// Remove the user from the allUsers array
					set((state) => ({
						allUsers:
							state.allUsers?.filter((user: User) => user._id !== userId) || [],
					}));

					return response.data;
				} catch (error: any) {
					set({
						error: error.response?.data?.message || "Failed to delete user",
						isLoading: false,
					});
					throw error;
				}
			},

			// Category actions (admin only)
			createCategory: async (name, description) => {
				set({ isLoading: true, error: null });
				try {
					const response = await api.post<ApiResponse<Category>>(
						"/categories",
						{
							name,
							description,
						},
					);
					set((state) => ({
						categories: [...state.categories, response.data.data],
						isLoading: false,
					}));
				} catch (error: any) {
					set({
						error: error.response?.data?.message || "Failed to create category",
						isLoading: false,
					});
					throw error;
				}
			},
			updateCategory: async (
				id: string,
				data: { name: string; description?: string },
			) => {
				set({ isLoading: true, error: null });
				try {
					const response = await api.put(`/categories/${id}`, data);
					set({ isLoading: false });
					return response.data;
				} catch (error: any) {
					set({
						error: error.response?.data?.message || "Failed to update category",
						isLoading: false,
					});
					throw error;
				}
			},

			getCategories: async () => {
				set({ isLoading: true, error: null });
				try {
					const response =
						await api.get<
							ApiResponse<{ categories: Category[]; total: number }>
						>("/categories");
					set({
						categories: response.data.data.categories,
						pagination: {
							...get().pagination,
							total: response.data.data.total,
						},
						isLoading: false,
					});
				} catch (error: any) {
					set({
						error:
							error.response?.data?.message || "Failed to fetch categories",
						isLoading: false,
					});
				}
			},

			deleteCategory: async (id) => {
				set({ isLoading: true, error: null });
				try {
					await api.delete(`/categories/${id}`);
					set((state) => ({
						categories: state.categories.filter(
							(category) => category._id !== id,
						),
						isLoading: false,
					}));
				} catch (error: any) {
					set({
						error: error.response?.data?.message || "Failed to delete category",
						isLoading: false,
					});
					throw error;
				}
			},
			getBlogs: async (params) => {
				set({ isLoading: true, error: null });
				try {
					const response = await api.get("/blogs", { params });
					set({
						blogs: response.data.data.blogs,
						pagination: {
							page: response.data.data.page,
							limit: 10,
							total: response.data.data.total,
						},
						isLoading: false,
					});
				} catch (error: any) {
					set({
						error: error.response?.data?.message || "Failed to fetch blogs",
						isLoading: false,
					});
				}
			},

			getBlogBySlug: async (slug) => {
				set({ isLoading: true, error: null });
				try {
					const response = await api.get(`/blogs/${slug}`);
					set({
						selectedBlog: response.data.data,
						isLoading: false,
					});
				} catch (error: any) {
					set({
						error: error.response?.data?.message || "Failed to fetch blog",
						isLoading: false,
					});
				}
			},

			likeBlog: async (id) => {
				set({ isLoading: true, error: null });
				try {
					const response = await api.post(`/blogs/${id}/like`);
					set((state) => ({
						blogs: state.blogs.map((blog) =>
							blog._id === id ? { ...blog, likes: blog.likes + 1 } : blog,
						),
						selectedBlog:
							state.selectedBlog?._id === id
								? {
										...state.selectedBlog,
										likes: (state.selectedBlog.likes || 0) + 1,
									}
								: state.selectedBlog,
						isLoading: false,
					}));
				} catch (error: any) {
					set({
						error: error.response?.data?.message || "Failed to like blog",
						isLoading: false,
					});
				}
			},
			createBlog: async (blogData) => {
				set({ isLoading: true, error: null });
				try {
					const response = await api.post<ApiResponse<Blog>>(
						"/blogs",
						blogData,
					);
					set((state) => ({
						blogs: [response.data.data, ...state.blogs],
						isLoading: false,
					}));
					toast.success("Blog created successfully!");
				} catch (error: any) {
					set({
						error: error.response?.data?.message || "Failed to create blog",
						isLoading: false,
					});
					throw error;
				}
			},

			updateBlog: async (id, blogData) => {
				set({ isLoading: true, error: null });
				try {
					const response = await api.put<ApiResponse<Blog>>(
						`/blogs/${id}`,
						blogData,
					);
					set((state) => ({
						blogs: state.blogs.map((blog) =>
							blog._id === id ? response.data.data : blog,
						),
						selectedBlog:
							state.selectedBlog?._id === id
								? response.data.data
								: state.selectedBlog,
						isLoading: false,
					}));
					toast.success("Blog updated successfully!");
				} catch (error: any) {
					set({
						error: error.response?.data?.message || "Failed to update blog",
						isLoading: false,
					});
					throw error;
				}
			},

			deleteBlog: async (id) => {
				set({ isLoading: true, error: null });
				try {
					await api.delete(`/blogs/${id}`);
					set((state) => ({
						blogs: state.blogs.filter((blog) => blog._id !== id),
						selectedBlog:
							state.selectedBlog?._id === id ? null : state.selectedBlog,
						isLoading: false,
					}));
					toast.success("Blog deleted successfully!");
				} catch (error: any) {
					set({
						error: error.response?.data?.message || "Failed to delete blog",
						isLoading: false,
					});
					throw error;
				}
			},
			// Admin actions
			getAnalytics: async () => {
				// Don't use isLoading from state as it might be stale
				// Instead, add a dedicated fetching flag
				if ((get() as any)._fetchingAnalytics) return;

				(get() as any)._fetchingAnalytics = true;
				set({ isLoading: true, error: null });

				try {
					const response = await api.get("/analytics");
					set({ analytics: response.data.data, isLoading: false });
				} catch (error: any) {
					set({
						error: error.response?.data?.message || "Failed to fetch analytics",
						isLoading: false,
					});
				} finally {
					(get() as any)._fetchingAnalytics = false;
				}
			},

			getDashboard: async () => {
				set({ isLoading: true, error: null });
				try {
					const response = await api.get<
						ApiResponse<{
							myEvents: Event[];
							bookmarks: Event[];
							stats: DashboardStats;
						}>
					>("/users/dashboard");
					set({
						dashboardData: response.data.data,
						isLoading: false,
					});
				} catch (error: any) {
					set({
						error: error.response?.data?.message || "Failed to fetch dashboard",
						isLoading: false,
					});
				}
			},
		}),
		{
			name: "revival-storage",
			partialize: (state) => ({
				user: state.user,
				token: state.token,
				isAuthenticated: state.isAuthenticated,
			}),
		},
	),
);
