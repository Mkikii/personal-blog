// Main function that runs when the DOM is loaded
function main() {
    displayPosts();
    addNewPostListener();
}

// Display all posts from the API
function displayPosts() {
    fetch('http://localhost:3000/posts')
        .then(response => response.json())
        .then(posts => {
            const postList = document.getElementById('post-list');
            postList.innerHTML = ''; // Clear existing posts
            
            posts.forEach(post => {
                const postElement = document.createElement('div');
                postElement.className = 'post-item';
                postElement.textContent = post.title;
                postElement.dataset.id = post.id;
                
                postElement.addEventListener('click', () => handlePostClick(post.id));
                
                postList.appendChild(postElement);
            });
            
            // Display the first post by default (Advanced Deliverable)
            if (posts.length > 0) {
                handlePostClick(posts[0].id);
            }
        })
        .catch(error => console.error('Error fetching posts:', error));
}

// Handle click on a post to show its details
function handlePostClick(postId) {
    fetch(`http://localhost:3000/posts/${postId}`)
        .then(response => response.json())
        .then(post => {
            const postDetail = document.getElementById('post-detail');
            postDetail.innerHTML = `
                <h2>${post.title}</h2>
                <p><strong>Author:</strong> ${post.author}</p>
                <p><strong>Content:</strong></p>
                <p>${post.content}</p>
                <button id="edit-post">Edit</button>
                <button id="delete-post">Delete</button>
            `;
            
            // Add event listeners for edit and delete buttons
            document.getElementById('edit-post').addEventListener('click', () => showEditForm(post));
            document.getElementById('delete-post').addEventListener('click', () => deletePost(post.id));
        })
        .catch(error => console.error('Error fetching post details:', error));
}

// Add event listener for the new post form
function addNewPostListener() {
    const form = document.getElementById('new-post-form');
    form.addEventListener('submit', event => {
        event.preventDefault();
        
        const title = document.getElementById('title').value;
        const author = document.getElementById('author').value;
        const content = document.getElementById('content').value;
        
        const newPost = {
            title,
            author,
            content
        };
        
        fetch('http://localhost:3000/posts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newPost),
        })
        .then(response => response.json())
        .then(() => {
            // Clear the form
            form.reset();
            // Refresh the post list
            displayPosts();
        })
        .catch(error => console.error('Error creating new post:', error));
    });
}

// Show edit form (Advanced Deliverable)
function showEditForm(post) {
    const postDetail = document.getElementById('post-detail');
    postDetail.innerHTML = `
        <form id="edit-post-form">
            <h2>Edit Post</h2>
            <label for="edit-title">Title:</label>
            <input type="text" id="edit-title" value="${post.title}" required>
            
            <label for="edit-author">Author:</label>
            <input type="text" id="edit-author" value="${post.author}" required>
            
            <label for="edit-content">Content:</label>
            <textarea id="edit-content" rows="4" required>${post.content}</textarea>
            
            <button type="submit">Save Changes</button>
            <button type="button" id="cancel-edit">Cancel</button>
        </form>
    `;
    
    const editForm = document.getElementById('edit-post-form');
    editForm.addEventListener('submit', event => {
        event.preventDefault();
        
        const updatedPost = {
            title: document.getElementById('edit-title').value,
            author: document.getElementById('edit-author').value,
            content: document.getElementById('edit-content').value
        };
        
        updatePost(post.id, updatedPost);
    });
    
    document.getElementById('cancel-edit').addEventListener('click', () => {
        handlePostClick(post.id);
    });
}

// Update a post (Advanced Deliverable)
function updatePost(postId, updatedPost) {
    fetch(`http://localhost:3000/posts/${postId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(updatedPost),
    })
    .then(response => response.json())
    .then(() => {
        displayPosts();
        handlePostClick(postId);
    })
    .catch(error => console.error('Error updating post:', error));
}

// Delete a post (Advanced Deliverable)
function deletePost(postId) {
    if (confirm('Are you sure you want to delete this post?')) {
        fetch(`http://localhost:3000/posts/${postId}`, {
            method: 'DELETE',
        })
        .then(() => {
            // Clear the post detail view
            document.getElementById('post-detail').innerHTML = '<p>Select a post to view details</p>';
            // Refresh the post list
            displayPosts();
        })
        .catch(error => console.error('Error deleting post:', error));
    }
}

// Wait for DOM to load before starting the app
document.addEventListener('DOMContentLoaded', main);