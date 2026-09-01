"use client";
import React, { useState, useEffect } from "react";
import { MessageSquare } from "lucide-react";
import { CommentReply } from "./commentReply";
import UpdateModal from "../ui/modals/updateModal";
import DeleteModal from "../ui/modals/deleteModal";
import ratingService from "@/services/ratingService";

export default function MovieComments({ 
  movieId, 
  currentUser, 
  pendingRating,
  onCommentSubmitted 
}) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [newCommentContent, setNewCommentContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingComment, setEditingComment] = useState(null);
  const [editContent, setEditContent] = useState("");

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingComment, setDeletingComment] = useState(null);

  useEffect(() => {
    if (movieId) {
      loadComments();
    }
  }, [movieId]);

  const loadComments = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/comments?movie_id=${movieId}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const commentsData = await response.json();
      const organizedComments = organizeComments(commentsData);
      setComments(organizedComments);
    } catch (error) {
      console.error("Error loading comments:", error);
      setComments([]);
    } finally {
      setLoading(false);
    }
  };

  const organizeComments = (commentsList) => {
    if (!commentsList || !Array.isArray(commentsList)) return [];

    const commentMap = {};
    const rootComments = [];

    commentsList.forEach((comment) => {
      commentMap[comment.id] = {
        ...comment,
        replies: [],
        created_at: comment.created_at || comment.createdAt,
        user: comment.user || {
          username: "Anonymous",
          role: comment.user_role,
        },
      };
    });

    commentsList.forEach((comment) => {
      if (comment.parent_id) {
        if (commentMap[comment.parent_id]) {
          commentMap[comment.parent_id].replies.push(commentMap[comment.id]);
        }
      } else {
        rootComments.push(commentMap[comment.id]);
      }
    });

    rootComments.sort(
      (a, b) => new Date(b.created_at) - new Date(a.created_at)
    );

    rootComments.forEach((comment) => {
      if (comment.replies.length > 0) {
        comment.replies.sort(
          (a, b) => new Date(a.created_at) - new Date(b.created_at)
        );
      }
    });

    return rootComments;
  };

  const openEditModal = (comment) => {
    setEditingComment(comment);
    setEditContent(comment.content);
    setIsEditModalOpen(true);
  };

  const closeEditModal = () => {
    setIsEditModalOpen(false);
    setEditingComment(null);
    setEditContent("");
  };

  const openDeleteModal = (comment) => {
    if (!comment || !comment.id) {
      console.error("Invalid comment passed to delete:", comment);
      alert("Cannot delete: Invalid comment data");
      return;
    }

    setDeletingComment(comment);
    setIsDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsDeleteModalOpen(false);
    setDeletingComment(null);
  };

  const handleEdit = async (newContent) => {
    if (!editingComment || !newContent.trim()) {
      return;
    }

    try {
      const response = await fetch(`/api/comments?id=${editingComment.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: newContent,
          user_id: currentUser.id,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      await response.json();
      await loadComments();
      closeEditModal();
    } catch (error) {
      console.error("Error updating comment:", error);
      alert(error.message || "Error updating comment");
    }
  };

  const handleDelete = async () => {
    if (!deletingComment) {
      return;
    }

    try {
      const response = await fetch(`/api/comments?id=${deletingComment.id}`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: currentUser.id,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.message || `HTTP error! status: ${response.status}`
        );
      }

      await response.json();
      await loadComments();
      closeDeleteModal();
    } catch (error) {
      console.error("Error deleting comment:", error);
      alert(error.message || "Error deleting comment");
    }
  };

  const handleCreateComment = async () => {
    if (!newCommentContent.trim()) {
      alert("Please write a comment");
      return;
    }
    if (!currentUser?.id) {
      alert("You must be logged in to comment");
      return;
    }

    setIsSubmitting(true);
    try {
      if (pendingRating > 0) {
        await ratingService.submitRating(
          movieId,
          currentUser.id,
          pendingRating
        );
      }

      const response = await fetch("/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: newCommentContent,
          movie_id: movieId,
          user_id: currentUser.id,
          rating: pendingRating > 0 ? pendingRating : null,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const newComment = await response.json();

      setNewCommentContent("");
      
      if (onCommentSubmitted) {
        onCommentSubmitted();
      }
      
      await loadComments();
    } catch (error) {
      console.error("Error creating comment:", error);
      alert("Error posting comment");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleReply = async (parentId, content) => {
    if (!currentUser?.id) {
      alert("You must be logged in to reply");
      return;
    }

    try {
      const response = await fetch("/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: content,
          movie_id: movieId,
          user_id: currentUser.id,
          parent_id: parentId,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      await response.json();
      await loadComments();
    } catch (error) {
      console.error("Error posting reply:", error);
      alert("Error posting reply");
    }
  };

  return (
    <div className="mt-8">
      <div className="flex items-center gap-2 mb-6">
        <MessageSquare size={20} className="text-[#e50914]" />
        <h2 className="text-2xl font-bold text-white">
          Comments ({comments.length})
        </h2>
      </div>

      {currentUser ? (
        <div className="mb-6 bg-gray-900/50 rounded-lg p-4">
          <textarea
            value={newCommentContent}
            onChange={(e) => setNewCommentContent(e.target.value)}
            placeholder="Share your thoughts about this film..."
            className="w-full bg-black/50 border border-gray-700 rounded-lg p-4 text-white focus:outline-none focus:border-[#e50914] resize-none"
            rows={3}
          />
          <div className="flex justify-end mt-2">
            <button
              onClick={handleCreateComment}
              disabled={isSubmitting || !newCommentContent.trim()}
              className="px-6 py-2 bg-[#e50914] hover:bg-[#b20710] text-white rounded-lg font-semibold transition-colors disabled:opacity-50 cursor-pointer disabled:cursor-not-allowed"
            >
              {isSubmitting ? "Posting..." : "Post Comment"}
            </button>
          </div>
        </div>
      ) : (
        <div className="mb-6 bg-gray-900/30 rounded-lg p-6 text-center">
          <p className="text-gray-400 mb-3">Sign in to leave a comment</p>
          <button
            onClick={() => (window.location.href = "/login")}
            className="bg-[#e50914] hover:bg-[#b20710] text-white px-6 py-2 rounded-lg font-semibold"
          >
            Login to Comment
          </button>
        </div>
      )}

      {loading ? (
        <div className="text-center py-8 text-gray-500">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#e50914] mx-auto mb-2"></div>
          Loading comments...
        </div>
      ) : comments.length === 0 ? (
        <div className="text-center py-8 text-gray-500 bg-gray-900/30 rounded-lg">
          No comments yet. Be the first to comment!
        </div>
      ) : (
        <div className="space-y-4">
          {comments.map((comment) => (
            <CommentReply
              key={comment.id}
              comment={comment}
              user={currentUser}
              onReply={handleReply}
              onEdit={openEditModal}
              onDelete={openDeleteModal}
              depth={0}
            />
          ))}
        </div>
      )}

      <UpdateModal
        isOpen={isEditModalOpen}
        onClose={closeEditModal}
        onConfirm={handleEdit}
        input={editContent}
        label="Edit Comment"
        action="update"
      />

      <DeleteModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={handleDelete}
        itemId={`comment by ${deletingComment?.user?.username || "user"}`}
        label=""
      />
    </div>
  );
}