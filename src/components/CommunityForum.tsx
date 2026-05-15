"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useRevival } from "@/hooks/useRevival";
import { format } from "date-fns";
import {
	Flame,
	Hand,
	Heart,
	Loader2,
	Reply,
	Send,
	Smile,
	ThumbsUp,
	User,
	X,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import io, { Socket } from "socket.io-client";
import { toast } from "sonner";

interface CommunityForumProps {
	messages: any[];
	eventId: string;
}

// Emoji options for reactions
const REACTION_EMOJIS = [
	{ emoji: "👍", label: "Like", icon: ThumbsUp },
	{ emoji: "❤️", label: "Love", icon: Heart },
	{ emoji: "🙏", label: "Prayer", icon: Hand },
	{ emoji: "🔥", label: "Fire", icon: Flame },
	{ emoji: "😊", label: "Smile", icon: Smile },
];

// Reply context interface
interface ReplyContext {
	messageId: string;
	userName: string;
	message: string;
}

export function CommunityForum({
	messages: initialMessages,
	eventId,
}: CommunityForumProps) {
	const [newMessage, setNewMessage] = useState("");
	const [isSending, setIsSending] = useState(false);
	const [reactingTo, setReactingTo] = useState<string | null>(null);
	const [socket, setSocket] = useState<Socket | null>(null);
	const [liveMessages, setLiveMessages] = useState<any[]>([]);
	const [replyTo, setReplyTo] = useState<ReplyContext | null>(null);
	const [contextMenuPosition, setContextMenuPosition] = useState<{
		x: number;
		y: number;
		message: any;
	} | null>(null);
	const scrollRef = useRef<HTMLDivElement>(null);
	const inputRef = useRef<HTMLInputElement>(null);
	const contextMenuRef = useRef<HTMLDivElement>(null);

	const {
		sendMessage,
		getEventMessages,
		messages: apiMessages,
		isLoading,
		user,
		isAuthenticated,
	} = useRevival();

	// Use API messages if available, otherwise use initialMessages, merge with live messages
	const messages =
		liveMessages.length > 0
			? liveMessages
			: apiMessages.length > 0
				? apiMessages
				: initialMessages;

	// Initialize Socket.IO connection
	useEffect(() => {
		if (!eventId) return;

		const socketInstance = io(
			process.env.NEXT_PUBLIC_SOCKET_URL || "https://api.revival-locator.ng",
			{
				transports: ["websocket"],
			},
		);

		setSocket(socketInstance);

		// Join the event room
		socketInstance.emit("join_event", eventId);

		// Listen for new messages
		socketInstance.on("new_message", (message) => {
			setLiveMessages((prev) => [...prev, message]);
		});

		// Listen for reaction updates
		socketInstance.on("reaction_update", (updatedMessage) => {
			setLiveMessages((prev) =>
				prev.map((msg) =>
					msg._id === updatedMessage._id ? updatedMessage : msg,
				),
			);
		});

		return () => {
			socketInstance.disconnect();
		};
	}, [eventId]);

	// Scroll to bottom when messages change
	useEffect(() => {
		if (scrollRef.current) {
			scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
		}
	}, [messages]);

	// Focus input when replying
	useEffect(() => {
		if (replyTo && inputRef.current) {
			inputRef.current.focus();
		}
	}, [replyTo]);

	// Handle click outside context menu
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				contextMenuRef.current &&
				!contextMenuRef.current.contains(event.target as Node)
			) {
				setContextMenuPosition(null);
			}
		};
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);

	// Initial fetch of messages
	useEffect(() => {
		if (!eventId) return;
		getEventMessages(eventId);
	}, [eventId]);

	// Refresh messages periodically (every 30 seconds) as fallback
	useEffect(() => {
		if (!eventId) return;

		const interval = setInterval(() => {
			if (liveMessages.length === 0) {
				getEventMessages(eventId);
			}
		}, 30000);

		return () => clearInterval(interval);
	}, [eventId]);

	const handleSend = async () => {
		if (!newMessage.trim()) {
			toast.error("Message cannot be empty", {
				description: "Please write a message before sending.",
			});
			return;
		}

		if (!isAuthenticated) {
			toast.error("Authentication required", {
				description: "Please login to join the conversation",
				action: {
					label: "Login",
					onClick: () => (window.location.href = "/login"),
				},
			});
			return;
		}

		setIsSending(true);
		try {
			await sendMessage(eventId, newMessage.trim(), replyTo?.messageId);
			setNewMessage("");
			cancelReply();
			toast.success("Message sent!", {
				description: "Your message has been posted to the community.",
			});
			await getEventMessages(eventId);
		} catch (error: any) {
			toast.error("Failed to send message", {
				description: error.message || "Please try again later.",
			});
		} finally {
			setIsSending(false);
		}
	};

	const handleReply = (message: any) => {
		const userName =
			typeof message.user === "object" ? message.user.name : "Anonymous";
		setReplyTo({
			messageId: message._id,
			userName: userName,
			message: message.message,
		});
		setContextMenuPosition(null);
	};

	const cancelReply = () => {
		setReplyTo(null);
	};

	const handleReaction = async (messageId: string, emoji: string) => {
		if (!isAuthenticated) {
			toast.error("Authentication required", {
				description: "Please login to react to messages",
			});
			return;
		}

		setReactingTo(messageId);
		try {
			const response = await fetch(
				`https://api.revival-locator.ng/api/chat/${messageId}/react`,
				{
					method: "POST",
					headers: {
						"Content-Type": "application/json",
						Authorization: `Bearer ${localStorage.getItem("token")}`,
					},
					body: JSON.stringify({ emoji }),
				},
			);

			const data = await response.json();

			if (data.success) {
				setLiveMessages((prev) =>
					prev.map((msg) => (msg._id === messageId ? data.data : msg)),
				);
				await getEventMessages(eventId);
			}
		} catch (error) {
			toast.error("Failed to add reaction", {
				description: "Please try again later.",
			});
		} finally {
			setReactingTo(null);
		}
	};

	const handleContextMenu = (e: React.MouseEvent, message: any) => {
		e.preventDefault();
		setContextMenuPosition({ x: e.clientX, y: e.clientY, message });
	};

	const handleTouchHold = (message: any) => {
		// For mobile long press
		setContextMenuPosition({ x: window.innerWidth / 2, y: 200, message });
	};

	const getReactionCounts = (reactions: any[]) => {
		if (!reactions) return {};
		return reactions.reduce((acc: any, r: any) => {
			acc[r.emoji] = (acc[r.emoji] || 0) + 1;
			return acc;
		}, {});
	};

	// Find parent message for reply preview
	const getParentMessage = (parentId: string) => {
		return messages.find((msg) => msg._id === parentId);
	};

	if (isLoading && messages.length === 0) {
		return (
			<Card className="h-[600px] flex flex-col border-primary/10 bg-card/50 backdrop-blur-sm shadow-xl">
				<CardHeader className="border-b border-primary/10">
					<CardTitle className="text-xl flex items-center gap-2">
						<div className="w-2 h-2 rounded-full bg-yellow-500 animate-pulse" />
						Loading Community Chat...
					</CardTitle>
				</CardHeader>
				<CardContent className="flex-grow flex items-center justify-center">
					<div className="text-center space-y-4">
						<Loader2 className="w-8 h-8 text-primary animate-spin mx-auto" />
						<p className="text-muted-foreground">Loading messages...</p>
					</div>
				</CardContent>
			</Card>
		);
	}

	return (
		<>
			<Card className="h-[600px] flex flex-col border-primary/10 bg-card/50 backdrop-blur-sm shadow-xl">
				<CardHeader className="border-b border-primary/10">
					<CardTitle className="text-xl flex items-center gap-2">
						<div
							className={`w-2 h-2 rounded-full ${isAuthenticated ? "bg-green-500 animate-pulse" : "bg-gray-500"} `}
						/>
						Live Community Chat
						{isAuthenticated && user && (
							<span className="text-xs text-muted-foreground ml-2">
								(Logged in as {user.name})
							</span>
						)}
					</CardTitle>
				</CardHeader>
				<CardContent className="flex-grow overflow-hidden p-0 flex flex-col">
					<ScrollArea className="flex-grow p-4" ref={scrollRef}>
						<div className="space-y-4">
							{messages.length === 0 ? (
								<div className="text-center py-20 text-muted-foreground flex flex-col items-center gap-2">
									<Send className="w-8 h-8 opacity-20" />
									<p>Start the conversation! Encourage others attending.</p>
									{!isAuthenticated && (
										<Button
											variant="outline"
											size="sm"
											className="mt-4"
											onClick={() => (window.location.href = "/login")}>
											Login to Join the Conversation
										</Button>
									)}
								</div>
							) : (
								<div className="space-y-4">
									{messages.map((msg) => {
										const isCurrentUser =
											user?._id ===
											(typeof msg.user === "object" ? msg.user._id : msg.user);
										const userName =
											typeof msg.user === "object"
												? msg.user.name
												: "Anonymous";
										const isAdmin =
											typeof msg.user === "object"
												? msg.user.role === "admin"
												: false;
										const reactionCounts = getReactionCounts(msg.reactions);
										const parentMessage = msg.parent
											? getParentMessage(msg.parent)
											: null;

										return (
											<div
												key={msg._id}
												className={`flex gap-3 ${isCurrentUser ? "flex-row-reverse" : ""}`}
												onContextMenu={(e) => handleContextMenu(e, msg)}
												onTouchStart={() => {
													const timer = setTimeout(
														() => handleTouchHold(msg),
														500,
													);
													return () => clearTimeout(timer);
												}}>
												<div className="flex-shrink-0">
													<div
														className={`w-8 h-8 rounded-full flex items-center justify-center mt-1 ${
															isAdmin
																? "bg-purple-500/20 ring-2 ring-purple-500/50"
																: isCurrentUser
																	? "bg-primary/20 ring-2 ring-primary/30"
																	: "bg-primary/20"
														}`}>
														<User
															className={`w-4 h-4 ${
																isAdmin ? "text-purple-500" : "text-primary"
															}`}
														/>
													</div>
													{isAdmin && (
														<div className="text-[8px] font-bold text-purple-500 text-center mt-1">
															ADMIN
														</div>
													)}
												</div>
												<div
													className={`max-w-[80%] space-y-1 ${isCurrentUser ? "items-end" : ""}`}>
													<div className="flex items-center gap-2 px-1">
														<p className="text-xs font-bold">
															{userName}
															{isAdmin && (
																<span className="ml-1 text-purple-500">👑</span>
															)}
														</p>
														<p className="text-[10px] text-muted-foreground">
															{format(new Date(msg.createdAt), "p")}
														</p>
													</div>

													{/* WhatsApp-style Reply Preview - This shows the original message being replied to */}
													{parentMessage && (
														<div className="text-xs bg-muted/50 rounded-lg px-3 py-1.5 mb-1 border-l-2 border-primary">
															<div className="flex items-center gap-1 text-primary font-semibold text-[10px] mb-0.5">
																<Reply className="w-3 h-3" />
																<span>
																	{typeof parentMessage.user === "object"
																		? parentMessage.user.name
																		: "Someone"}
																</span>
															</div>
															<p className="text-muted-foreground text-[11px] leading-relaxed">
																{parentMessage.message.length > 100
																	? parentMessage.message.substring(0, 100) +
																		"..."
																	: parentMessage.message}
															</p>
														</div>
													)}

													{/* Current Message */}
													<div
														className={`p-3 rounded-2xl text-sm ${
															isCurrentUser
																? "bg-primary text-primary-foreground rounded-tr-none"
																: "bg-background border border-primary/10 rounded-tl-none"
														}`}>
														{msg.message}
													</div>

													{/* Reaction Buttons */}
													<div className="flex items-center gap-1 mt-1">
														{REACTION_EMOJIS.map(({ emoji, label }) => (
															<button
																key={emoji}
																onClick={() => handleReaction(msg._id, emoji)}
																disabled={reactingTo === msg._id}
																className="text-xs hover:scale-110 transition-transform p-1 rounded-full hover:bg-primary/10"
																title={label}>
																<span className="text-sm">{emoji}</span>
															</button>
														))}
														{!isCurrentUser && (
															<button
																onClick={() => handleReply(msg)}
																className="text-xs hover:scale-110 transition-transform p-1 rounded-full hover:bg-primary/10"
																title="Reply">
																<Reply className="w-3 h-3" />
															</button>
														)}
													</div>

													{/* Display Reactions */}
													{Object.keys(reactionCounts).length > 0 && (
														<div className="flex items-center gap-1 flex-wrap mt-1">
															{Object.entries(reactionCounts).map(
																([emoji, count]) => (
																	<span
																		key={emoji}
																		className="text-xs bg-primary/10 rounded-full px-1.5 py-0.5 flex items-center gap-0.5">
																		<span>{emoji}</span>
																		<span className="text-[10px]">
																			{count as number}
																		</span>
																	</span>
																),
															)}
														</div>
													)}
												</div>
											</div>
										);
									})}
								</div>
							)}
						</div>
					</ScrollArea>

					{/* Reply Indicator Bar - Shows while composing a reply */}
					{replyTo && (
						<div className="px-4 pt-2 pb-1 bg-primary/5 border-t border-primary/10">
							<div className="flex items-center justify-between text-sm bg-background/80 rounded-lg p-2">
								<div className="flex-1 min-w-0">
									<div className="flex items-center gap-2">
										<Reply className="w-4 h-4 text-primary flex-shrink-0" />
										<span className="text-xs font-semibold text-primary truncate">
											Replying to {replyTo.userName}
										</span>
									</div>
									<p className="text-xs text-muted-foreground truncate mt-0.5">
										{replyTo.message.length > 60
											? replyTo.message.substring(0, 60) + "..."
											: replyTo.message}
									</p>
								</div>
								<Button
									variant="ghost"
									size="icon"
									className="h-6 w-6 flex-shrink-0"
									onClick={cancelReply}>
									<X className="w-3 h-3" />
								</Button>
							</div>
						</div>
					)}

					{/* Input Area */}
					<div className="p-4 bg-background/50 border-t border-primary/10">
						{!isAuthenticated ? (
							<div className="text-center space-y-2">
								<p className="text-sm text-muted-foreground">
									Please login to join the conversation
								</p>
								<Button
									variant="outline"
									size="sm"
									onClick={() => (window.location.href = "/login")}
									className="w-full">
									Login to Chat
								</Button>
							</div>
						) : (
							<div className="flex gap-2">
								<Input
									ref={inputRef}
									placeholder={
										replyTo
											? `Reply to ${replyTo.userName}...`
											: "Say something inspiring..."
									}
									value={newMessage}
									onChange={(e) => setNewMessage(e.target.value)}
									onKeyDown={(e) =>
										e.key === "Enter" && !isSending && handleSend()
									}
									className="rounded-xl border-primary/20 bg-background/80"
									disabled={isSending}
								/>
								<Button
									onClick={handleSend}
									size="icon"
									className="rounded-xl bg-primary"
									disabled={isSending || !newMessage.trim()}>
									{isSending ? (
										<Loader2 className="w-4 h-4 animate-spin" />
									) : (
										<Send className="w-4 h-4" />
									)}
								</Button>
							</div>
						)}
					</div>
				</CardContent>
			</Card>

			{/* Context Menu */}
			{contextMenuPosition && (
				<div
					ref={contextMenuRef}
					className="fixed z-50 bg-popover rounded-lg shadow-lg border py-1 min-w-[150px]"
					style={{
						top: contextMenuPosition.y,
						left: contextMenuPosition.x,
					}}>
					<button
						onClick={() => {
							handleReply(contextMenuPosition.message);
							setContextMenuPosition(null);
						}}
						className="w-full px-4 py-2 text-left text-sm hover:bg-accent flex items-center gap-2">
						<Reply className="w-4 h-4" />
						Reply
					</button>
					{REACTION_EMOJIS.map(({ emoji, label }) => (
						<button
							key={emoji}
							onClick={() => {
								handleReaction(contextMenuPosition.message._id, emoji);
								setContextMenuPosition(null);
							}}
							className="w-full px-4 py-2 text-left text-sm hover:bg-accent flex items-center gap-2">
							<span>{emoji}</span>
							{label}
						</button>
					))}
				</div>
			)}
		</>
	);
}
