import { getFromApi, postWithApi, updateWithApi, deleteWithApi } from "@/services/axiosService";

/**
 * Récupérer tous les commentaires
 * @returns {Promise<Array|null>} - Liste des commentaires ou null si erreur
 */
export async function getAllComments() {
    const [ok, response] = await getFromApi("comments");
    if (!ok) {
        console.error("Erreur récupération commentaires :", response);
        return null;
    }
    return response;
}

/**
 * Créer un nouveau commentaire
 * @param {Object} commentData - { content, movie_id, user_id }
 * @returns {Promise<Object|null>} 
 */
export async function createComment(commentData) {
    const [ok, response] = await postWithApi("comments", commentData, { successStatus: 201 });
    if (!ok) {
        console.error("Erreur création commentaire :", response);
        return null;
    }
    return response;
}

/**
 * Modifier un commentaire existant
 * @param {string} commentId 
 * @param {Object} updateData 
 * @returns {Promise<Object|null>} 
 */
export async function updateComment(commentId, updateData) {
    const [ok, response] = await updateWithApi(
        `/api/comments?id=${commentId}`,
        updateData,
        { autoJoin: false }
    );
    if (!ok) {
        console.error("Erreur modification commentaire :", response);
        return null;
    }
    return response;
}

/**
 * Supprimer un commentaire
 * @param {string} commentId 
 * @returns {Promise<boolean>} 
 */
export async function deleteComment(commentId) {
    const [ok, response] = await deleteWithApi(
        `/api/comments?id=${commentId}`,
        { autoJoin: false }
    );
    if (!ok) {
        console.error("Erreur suppression commentaire :", response);
        return false;
    }
    return true;
}

/**
 * Récupérer les commentaires d'un film spécifique
 * @param {string} movieId 
 * @returns {Promise<Array|null>} 
 */
export async function getCommentsByMovie(movieId) {
    const [ok, response] = await getFromApi(`comments?movie_id=${movieId}`);
    if (!ok) {
        console.error("Erreur récupération commentaires du film :", response);
        return null;
    }
    return response;
}

/**
 * @param {Object} commentData - { content, movie_id }
 * @returns {Promise<Object|null>} - le commentaire créé ou null si erreur
 */
export async function getMovieComments(movieId, params = {}) {
    const query = new URLSearchParams(params).toString();
    return await getFromApi(`/movies/${movieId}/comments?${query}`);
}

/**
 * @param {Object} commentData - { content, movie_id }
 * @returns {Promise<Object|null>} - le commentaire créé ou null si erreur
 */
export async function createMovieComment(movieId, data) {
    return await postWithApi(
        `/movies/${movieId}/comments`, 
        data, 
        { successStatus: 201 }
    );
}

/**
 * @param {Object} commentData - { content, movie_id }
 * @returns {Promise<Object|null>} - le commentaire créé ou null si erreur
 */
export async function updateMovieComment(commentId, data) {
    return await updateWithApi(`/comments/${commentId}`, data);
}

/**
 * Delete a comment
 */
export async function deleteMovieComment(commentId) {
    return await deleteWithApi(`/comments/${commentId}`);
}


