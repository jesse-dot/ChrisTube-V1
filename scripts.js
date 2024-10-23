document.addEventListener('DOMContentLoaded', () => {
    loadVideos();
});

function loadVideos() {
    fetch('/api/videos')
        .then(response => response.json())
        .then(videos => {
            const videosContainer = document.getElementById('videos');
            videos.forEach(video => {
                const videoElement = createVideoElement(video);
                videosContainer.appendChild(videoElement);
            });
        })
        .catch(error => console.error('Error loading videos:', error));
}

function createVideoElement(video) {
    const videoElement = document.createElement('div');
    videoElement.classList.add('video');

    const videoTitle = document.createElement('h2');
    videoTitle.textContent = video.title;
    videoElement.appendChild(videoTitle);

    const videoPlayer = document.createElement('video');
    videoPlayer.src = video.url;
    videoPlayer.controls = true;
    videoElement.appendChild(videoPlayer);

    const videoLikes = document.createElement('p');
    videoLikes.textContent = `Likes: ${video.likes}`;
    videoElement.appendChild(videoLikes);

    const likeButton = document.createElement('button');
    likeButton.textContent = 'Like';
    likeButton.addEventListener('click', () => {
        likeVideo(video.id);
    });
    videoElement.appendChild(likeButton);

    const commentsSection = document.createElement('div');
    commentsSection.classList.add('comments');
    video.comments.forEach(comment => {
        const commentElement = document.createElement('p');
        commentElement.textContent = comment;
        commentsSection.appendChild(commentElement);
    });
    videoElement.appendChild(commentsSection);

    const commentForm = document.createElement('form');
    commentForm.addEventListener('submit', (event) => {
        event.preventDefault();
        const commentInput = commentForm.querySelector('input');
        addComment(video.id, commentInput.value);
        commentInput.value = '';
    });

    const commentInput = document.createElement('input');
    commentInput.type = 'text';
    commentInput.placeholder = 'Add a comment...';
    commentForm.appendChild(commentInput);

    const commentSubmit = document.createElement('button');
    commentSubmit.type = 'submit';
    commentSubmit.textContent = 'Submit';
    commentForm.appendChild(commentSubmit);

    videoElement.appendChild(commentForm);

    return videoElement;
}

function likeVideo(videoId) {
    fetch(`/api/videos/${videoId}/like`, {
        method: 'POST'
    })
    .then(response => response.json())
    .then(updatedVideo => {
        const videoElement = document.querySelector(`.video[data-id="${videoId}"]`);
        const videoLikes = videoElement.querySelector('p');
        videoLikes.textContent = `Likes: ${updatedVideo.likes}`;
    })
    .catch(error => console.error('Error liking video:', error));
}

function addComment(videoId, comment) {
    fetch(`/api/videos/${videoId}/comments`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ comment })
    })
    .then(response => response.json())
    .then(updatedVideo => {
        const videoElement = document.querySelector(`.video[data-id="${videoId}"]`);
        const commentsSection = videoElement.querySelector('.comments');
        const commentElement = document.createElement('p');
        commentElement.textContent = comment;
        commentsSection.appendChild(commentElement);
    })
    .catch(error => console.error('Error adding comment:', error));
}
