- Background
  - Holostagram is a social platform that allow people to join by creating account. Each user should provide a full name, username, email and password to create an account.
  - The email address should not link to any account in the system. After joining Holostagram, user can update their profile picture, username, biography, password and name.
  - Users can write Posts that contain text content and an image. The new posts will be shown on the user profile page, allowing other users to comment. Users can also React with like or dislike on a post or a comment.
  - Users can follow other user. After following other user, user can see other user post.
- Authentication
  - As a user, I can see my current profile info.
  - As a user, I can see a specific user's profile given a username.
  - As a user, I can update my profile with profile picture, name, username, password, and biography.
- Posts
  - As a user, I can see timeline of post.
  - As a user, I can create a new post with text content and an image.
  - As a user, I can delete my posts.
- Comments
  - As a user, I can see a list of comments on a post.
  - As a user, I can write comments on a post.
- Reactions

  - As a user, I can react like or unlike to a post.
<hr>

- API endpoints

* Auth APIs
<hr>

    - @route POST /users/register
    - @description Register with full name, username, email, password
    - @body {full name, username, email, password}
    - @access Public

    - @route POST /users/login
    - @description Log in with username and password
    - @body {user, passsword}
    - @access Public

    - @route POST /users/logout
    - @description Logout of user account
    - @access Login required

    - @route POST /users/google
    - @description Log in with google account
    - @access Public

* Users APIS
<hr>

    - @route GET /users/profile/:query
    - @description Get a user profile
    - @body {username, id}
    - @access Login required
    
    - @route GET /users/profile/:query
    - @description Get a user profile
    - @body {username, id}
    - @access Login required
  
    - @route GET /users/suggested
    - @description Get suggestusted user
    - @body {username}
    - @access Login required
  
    - @route GET /users/search
    - @description Get specific user
    - @body {username, id}
    - @access Login required
  
    - @route POST /users/follow/:id
    - @description Follow a user
    - @body {id}
    - @access Login required
  
    - @route PUT /users/update/:id
    - @description Update a profile
    - @body {full name, username, email, bio, profile picture}
    - @access Login required
  
    - @route PUT /users/password/:id
    - @description Update password
    - @body {old password, new password}
    - @access Login required

* Post APIs
<hr>

    - @route GET /posts/timeline
    - @description Get timeline of post of people you follow
    - @access Login required
  
    - @route GET /posts/:id
    - @description Get a post
    - @access Login required
  
    - @route GET /posts/users/:username
    - @description Get a user post
    - @access Login required
  
    - @route POST /posts/create
    - @description Create a post
    - @body {text, img}
    - @access Login required
  
    - @route DELETE /posts/:id
    - @description Delete a post
    - @access Login required
  
    - @route PUT /posts/react/:id
    - @description Like or unlike a post
    - @access Login required
  
    - @route GET /posts/reply/:id
    - @description Reply to a post
    - @body {text}
    - @access Login required

* Conversation APIs
<hr>

    - @route GET /messages/conversation
    - @description Get a whole conversation
    - @access Login required
  
    - @route GET /messages/:otherUserId
    - @description Get a message with a single person
    - @access Login required
  
    - @route POST /messages/
    - @description Send a message
    - @body {text}
    - @access Login required
