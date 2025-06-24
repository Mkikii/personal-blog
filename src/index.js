document.addEventListener('DOMContentLoaded', main);

function main() {
    displayPosts();
    addNewPostListener();
    
    // Show first post by default after slight delay
    setTimeout(() => {
        const firstPost = document.querySelector('.post-item');
        if (firstPost) {
            firstPost.classList.add('active');
            handlePostClick({ currentTarget: firstPost });
        }
    }, 300);
}

// Display all posts
function displayPosts() {
    fetch('http://localhost:3000/posts')
        .then(response => response.json())
        .then(posts => {
            const postList = document.getElementById('post-list');
            postList.innerHTML = '';
            
            if (posts.length === 0) {
                postList.innerHTML = `
                    <div class="card mb-3">
                        <div class="card-body text-center">
                            <p class="text-muted"><i class="far fa-compass"></i> No adventures yet. Ready for your first journey?</p>
                        </div>
                    </div>
                `;
                return;
            }
            
            posts.forEach(post => {
                const postItem = document.createElement('div');
                postItem.className = 'card mb-3 post-item';
                postItem.dataset.id = post.id;
                
                postItem.innerHTML = `
                    <div class="card-body">
                        <div class="d-flex justify-content-between align-items-start">
                            <div>
                                <h5 class="card-title">${post.title}</h5>
                                <p class="card-text text-muted">
                                    <i class="fas fa-map-marker-alt"></i> ${post.location}
                                </p>
                            </div>
                            <small class="text-muted">${new Date(post.date).toLocaleDateString()}</small>
                        </div>
                        <p class="card-text mt-2">${post.content.substring(0, 120)}...</p>
                        ${post.image ? `<img src="${post.image}" alt="${post.title}" class="img-fluid rounded mt-2" style="max-height: 150px; width: auto;">` : ''}
                    </div>
                `;
                
                postItem.addEventListener('click', handlePostClick);
                postList.appendChild(postItem);
            });
        })
        .catch(error => console.error('Error fetching posts:', error));
}

// Handle post click
function handlePostClick(event) {
    // Remove active class from all posts
    document.querySelectorAll('.post-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Add active class to clicked post
    event.currentTarget.classList.add('active');
    
    const postId = event.currentTarget.dataset.id;
    
    fetch(`http://localhost:3000/posts/${postId}`)
        .then(response => response.json())
        .then(post => {
            const postDetail = document.getElementById('post-detail');
            
            postDetail.innerHTML = `
                <div class="card-body">
                    <div class="d-flex justify-content-between align-items-start mb-3">
                        <h3 class="card-title">${post.title}</h3>
                        <small class="text-muted">${new Date(post.date).toLocaleDateString()}</small>
                    </div>
                    <p class="text-muted mb-3">
                        <i class="fas fa-map-marker-alt"></i> ${post.location}
                    </p>
                    <hr>
                    <p class="card-text">${post.content}</p>
                    
                    ${post.image ? `<img src="${post.image}" alt="${post.title}" class="img-fluid rounded mt-3 mb-3">` : ''}
                    
                    <div class="btn-actions mt-4">
                        <button class="btn btn-edit me-2" data-id="${post.id}">
                            <i class="fas fa-edit"></i> Edit
                        </button>
                        <button class="btn btn-delete" data-id="${post.id}">
                            <i class="fas fa-trash-alt"></i> Delete
                        </button>
                    </div>
                </div>
            `;
            
            // Add event listeners for edit and delete buttons
            postDetail.querySelector('.btn-edit').addEventListener('click', showEditForm);
            postDetail.querySelector('.btn-delete').addEventListener('click', deletePost);
        })
        .catch(error => console.error('Error fetching post:', error));
}

// Add new post listener
function addNewPostListener() {
    const form = document.getElementById('new-post-form');
    
    form.addEventListener('submit', event => {
        event.preventDefault();
        
        const title = document.getElementById('title').value;
        const location = document.getElementById('location').value;
        const content = document.getElementById('content').value;
        const image = document.getElementById('image').value;
        
        const newPost = {
            title,
            location,
            content,
            image: image || null,
            date: new Date().toISOString()
        };
        
        fetch('http://localhost:3000/posts', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newPost)
        })
        .then(response => response.json())
        .then(() => {
            displayPosts();
            form.reset();
            
            // Show success message
            const submitButton = form.querySelector('button[type="submit"]');
            const originalText = submitButton.innerHTML;
            submitButton.innerHTML = '<i class="fas fa-check"></i> Saved!';
            submitButton.classList.add('btn-success');
            
            setTimeout(() => {
                submitButton.innerHTML = originalText;
                submitButton.classList.remove('btn-success');
            }, 2000);
        })
        .catch(error => console.error('Error creating post:', error));
    });
}

// Show edit form
function showEditForm(event) {
    const postId = event.currentTarget.dataset.id;
    
    fetch(`http://localhost:3000/posts/${postId}`)
        .then(response => response.json())
        .then(post => {
            const postDetail = document.getElementById('post-detail');
            
            // Create edit form
            const editForm = document.createElement('form');
            editForm.id = 'edit-post-form';
            editForm.dataset.id = postId;
            editForm.className = 'bg-light p-4 rounded';
            editForm.innerHTML = `
                <h4><i class="fas fa-edit"></i> Edit Adventure</h4>
                <div class="mb-3">
                    <label for="edit-title" class="form-label">Title</label>
                    <input type="text" class="form-control" id="edit-title" value="${post.title}" required>
                </div>
                <div class="mb-3">
                    <label for="edit-location" class="form-label">Location</label>
                    <input type="text" class="form-control" id="edit-location" value="${post.location}" required>
                </div>
                <div class="mb-3">
                    <label for="edit-content" class="form-label">Content</label>
                    <textarea class="form-control" id="edit-content" rows="4" required>${post.content}</textarea>
                </div>
                <div class="mb-3">
                    <label for="edit-image" class="form-label">Image URL</label>
                    <input type="text" class="form-control" id="edit-image" value="${post.image || ''}">
                </div>
                <button type="submit" class="btn btn-primary me-2">
                    <i class="fas fa-save"></i> Update
                </button>
                <button type="button" class="btn btn-secondary" id="cancel-edit">
                    <i class="fas fa-times"></i> Cancel
                </button>
            `;
            
            // Add to post detail
            postDetail.appendChild(editForm);
            
            // Add event listener for form submission
            editForm.addEventListener('submit', updatePost);
            
            // Add event listener for cancel button
            document.getElementById('cancel-edit').addEventListener('click', () => {
                editForm.remove();
            });
        })
        .catch(error => console.error('Error fetching post for edit:', error));
}

// Update post
function updatePost(event) {
    event.preventDefault();
    
    const postId = event.currentTarget.dataset.id;
    const title = document.getElementById('edit-title').value;
    const location = document.getElementById('edit-location').value;
    const content = document.getElementById('edit-content').value;
    const image = document.getElementById('edit-image').value;
    
    fetch(`http://localhost:3000/posts/${postId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ title, location, content, image })
    })
    .then(response => response.json())
    .then(() => {
        displayPosts();
        
        // Re-fetch and display the updated post
        const postItem = document.querySelector(`.post-item[data-id="${postId}"]`);
        if (postItem) {
            handlePostClick({ currentTarget: postItem });
        }
    })
    .catch(error => console.error('Error updating post:', error));
}

// Delete post
function deletePost(event) {
    const postId = event.currentTarget.dataset.id;
    
    if (confirm('Are you sure you want to delete this adventure? All your memories will be lost.')) {
        fetch(`http://localhost:3000/posts/${postId}`, {
            method: 'DELETE'
        })
        .then(() => {
            displayPosts();
            document.getElementById('post-detail').innerHTML = `
                <div class="card-body text-center">
                    <p><i class="far fa-compass"></i> Select an adventure to begin reading!</p>
                </div>
            `;
        })
        .catch(error => console.error('Error deleting post:', error));
    }
}