(function () {
    var app = new Vue({
        el: '#app',
        data: {
            users: [],
            activeUser: null,
            activePost: null,
            editMode: {
                type: '',
                id: 0,
                cachePost: {}
            },
        },
        methods: {
            getUsers: function () {
                // GET Users
                this.$http.get('http://jsonplaceholder.typicode.com/users')
                    .then(response => {
                        this.users = response.body;
                    }, response => {
                        // TODO: Error handling
                        alert("ERROR: See Console Log");
                        console.log('Error: ');
                        console.log(response);
                    });
            },
            getUser: function (user) {
                // Ensure top of window
                window && window.scroll(0, 0);

                // GET User
                this.$http.get('http://jsonplaceholder.typicode.com/posts?userId=' + user.id)
                    .then(response => {
                        this.activeUser = {
                            name: user.name,
                            id: user.id,
                            posts: []
                        };
                        this.activeUser.posts = response.body;
                    }, response => {
                        // TODO: Error handling
                        alert("ERROR: See Console Log");
                        console.log('Error: ');
                        console.log(response);
                    });
            },
            openPostMode: function (modeNumber, post) {
                // 1 = Create
                // 2 = Edit
                this.editMode.id = modeNumber;
                this.editMode.type = modeNumber === 1 ? 'Create' : 'Edit'

                if (!post) {
                    post = {
                        title: '',
                        body: '',
                        userId: this.activeUser.id
                    };
                }
                this.editMode.cachePost = {
                    title: post.title,
                    body: post.body,
                }
                this.activePost = post;
            },
            closePostMode: function (cancel) {
                // 1 = Create
                // 2 = Edit
                this.editMode.id = 0;
                this.editMode.type = '';

                if (cancel) {
                    for (var i = 0; i < this.activeUser.posts.length; i++)
                        if (this.activeUser.posts[i].id === this.activePost.id) {
                            this.activeUser.posts[i].title = this.editMode.cachePost.title;
                            this.activeUser.posts[i].body = this.editMode.cachePost.body;
                            break;
                        }
                }
            },
            createPost: function () {
                // POST Post
                this.$http.post('http://jsonplaceholder.typicode.com/posts', this.activePost)
                    .then(response => {
                        console.log(response);
                        this.activeUser.posts.unshift(response.body);
                        this.closePostMode();
                    }, response => {
                        // TODO: Error handling
                        alert("ERROR: See Console Log");
                        console.log('Error: ');
                        console.log(response); 
                    });
            },
            editPost: function () {   
                // PUT Post
                this.$http.put('http://jsonplaceholder.typicode.com/posts/' + this.activePost.id, this.activePost)
                    .then(response => {
                        console.log(response);
                        this.closePostMode();                        
                    }, response => {
                        // TODO: Error handling
                        alert("ERROR: See Console Log");
                        console.log('Error: ');
                        console.log(response); 
                    });
            },
            deletePost: function (post) {
                // DELETE Post
                this.$http.delete('http://jsonplaceholder.typicode.com/posts/' + post.id)
                    .then(response => {
                        console.log(response);
                        for (var i = 0; i < this.activeUser.posts.length; i++)
                            if (this.activeUser.posts[i].id === post.id) {
                                this.activeUser.posts.splice(i, 1);
                                break;
                            }
                    }, response => {
                        // TODO: Error handling
                        alert("ERROR: See Console Log");
                        console.log('Error: ');
                        console.log(response);
                    });

            },
            sortPosts: function (type) {
                console.log(this.activeUser.posts.sort((a, b) => a.title > b.title));
                // 0 - Ascending
                // 1 - Descending
                if (type === 0) {
                    this.activeUser.posts = this.activeUser.posts.sort((a, b) => a.title > b.title);
                } else {
                    this.activeUser.posts = this.activeUser.posts.sort((a, b) => a.title < b.title);
                }
            },
            clearActiveUser: function () {
                this.activeUser = null;
            }
        },
        created: function () {
            this.getUsers();
        }
    });
})();