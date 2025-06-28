// Initialize posts array with your sample data
let posts = [
  {
    "id": 1,
    "title": "My First Solo Trip to Bali",
    "location": "Bali, Indonesia",
    "content": "This was my first time traveling alone and it was absolutely transformative. I stayed in Ubud for two weeks, practicing yoga every morning and exploring rice terraces in the afternoons. The locals were so welcoming and the food was incredible!",
    "image": "images/pexels-planespotter-geneva-1877406873-32667453.jpg",
    "date": "2023-05-15T00:00:00.000Z"
  },
  {
    "id": 2,
    "title": "Weekend in the Mountains",
    "location": "Rocky Mountains, Colorado",
    "content": "A quick getaway to recharge in nature. Hiked to Dream Lake at sunrise - the views were worth the early wakeup call! Saw elk, moose, and even a black bear from a safe distance.",
    "image": "images/pexels-skydream-14187938.jpg",
    "date": "2023-07-22T00:00:00.000Z"
  },
  {
    "id": 3,
    "title": "Cultural Exploration in Kyoto",
    "location": "Kyoto, Japan",
    "content": "Spent 10 days immersed in Japanese culture. Highlights included tea ceremonies, visiting Fushimi Inari Shrine at dawn, and trying authentic kaiseki meals. The autumn leaves were breathtaking!",
    "image": "images/pexels-camcasey-1157255.jpg",
    "date": "2022-11-10T00:00:00.000Z"
  }
];

document.addEventListener('DOMContentLoaded', main);

function main() {
    displayPosts();
    addNewPostListener();
    setupImagePreview();
    
    // Show first post by default after slight delay
    setTimeout(() => {
        const firstPost = document.querySelector('.post-item');
        if (firstPost) {
            firstPost.classList.add('active');
            handlePostClick({ currentTarget: firstPost });
        }
    }, 300);
}

function setupImagePreview() {
    document.getElementById('image').addEventListener('input', function(e) {
        const previewContainer = document.getElementById('image-preview-container');
        const preview = document.getElementById('image-preview');
        
        if (this.value) {
            preview.src = this.value;
            previewContainer.style.display = 'block';
        } else {
            previewContainer.style.display = 'none';
        }
    });
}

// Display all posts
function displayPosts() {
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
}

// Handle post click
function handlePostClick(event) {
    // Remove active class from all posts
    document.querySelectorAll('.post-item').forEach(item => {
        item.classList.remove('active');
    });
    
    // Add active class to clicked post
    event.currentTarget.classList.add('active');
    
    const postId = parseInt(event.currentTarget.dataset.id);
    const post = posts.find(p => p.id === postId);
    
    if (post) {
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
    }
}

// Add new post listener
function addNewPostListener() {
    const form = document.getElementById('new-post-form');
    
    form.addEventListener('submit', event => {
        event.preventDefault();
        
        const submitButton = form.querySelector('button[type="submit"]');
        const originalText = submitButton.innerHTML;
        
        try {
            const title = document.getElementById('title').value;
            const location = document.getElementById('location').value;
            const content = document.getElementById('content').value;
            const image = document.getElementById('image').value;
            
            const newPost = {
                id: Date.now(), // Generate a simple unique ID
                title,
                location,
                content,
                image: image || null,
                date: new Date().toISOString()
            };
            
            // Add to our posts array
            posts.push(newPost);
            
            // Show success message
            submitButton.innerHTML = '<i class="fas fa-check"></i> Saved!';
            submitButton.classList.add('btn-success');
            
            // Clear form
            form.reset();
            document.getElementById('image-preview-container').style.display = 'none';
            
            // Refresh posts display
            displayPosts();
            
            // Scroll to show the new post
            setTimeout(() => {
                const newPostElement = document.querySelector(`.post-item[data-id="${newPost.id}"]`);
                if (newPostElement) {
                    newPostElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                }
            }, 100);
        } catch (error) {
            console.error('Error:', error);
            submitButton.innerHTML = '<i class="fas fa-times"></i> Error!';
            submitButton.classList.add('btn-danger');
        }
        
        setTimeout(() => {
            submitButton.innerHTML = originalText;
            submitButton.classList.remove('btn-success', 'btn-danger');
        }, 2000);
    });
}

// Show edit form
function showEditForm(event) {
    const postId = parseInt(event.currentTarget.dataset.id);
    const post = posts.find(p => p.id === postId);
    
    if (post) {
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
    }
}

// Update post
function updatePost(event) {
    event.preventDefault();
    
    const postId = parseInt(event.currentTarget.dataset.id);
    const title = document.getElementById('edit-title').value;
    const location = document.getElementById('edit-location').value;
    const content = document.getElementById('edit-content').value;
    const image = document.getElementById('edit-image').value;
    
    const postIndex = posts.findIndex(p => p.id === postId);
    
    if (postIndex !== -1) {
        posts[postIndex] = {
            ...posts[postIndex],
            title,
            location,
            content,
            image: image || null
        };
        
        displayPosts();
        
        // Re-fetch and display the updated post
        const postItem = document.querySelector(`.post-item[data-id="${postId}"]`);
        if (postItem) {
            handlePostClick({ currentTarget: postItem });
        }
    }
}

// Delete post
function deletePost(event) {
    const postId = parseInt(event.currentTarget.dataset.id);
    
    if (confirm('Are you sure you want to delete this adventure? All your memories will be lost.')) {
        posts = posts.filter(post => post.id !== postId);
        displayPosts();
        document.getElementById('post-detail').innerHTML = `
            <div class="card-body text-center">
                <p><i class="far fa-compass"></i> Select an adventure to begin reading!</p>
            </div>
        `;
    }
}