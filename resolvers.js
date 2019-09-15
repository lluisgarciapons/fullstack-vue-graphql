module.exports = {
  Query: {
    getPosts: async (_, args, { Post }) => {
      const posts = await Post.find({})
        .sort({ createdDate: "desc" })
        .populate({
          path: "createdBy",
          model: "User"
        });
      return posts;
    }
  },
  Mutation: {
    // Object destructure args to {username, email, password}
    // Object destructure context to {User, Post}
    signupUser: async (_, { username, email, password }, { User }) => {
      // username: username becomes just username
      const user = await User.findOne({ username });
      if (user) {
        throw new Error("User already exist");
      }
      const newUser = await new User({
        username,
        email,
        password
      }).save();
      return newUser;
    },

    addPost: async (
      _,
      { title, imageUrl, categories, description, creatorId },
      { Post }
    ) => {
      const newPost = await new Post({
        title,
        imageUrl,
        categories,
        description,
        createdBy: creatorId
      }).save();
      return newPost;
    },

    addAllPosts: async (_, { posts }, { Post }) => {
      posts.forEach(post => {
        const newPost = new Post({
          title: post.title,
          imageUrl: post.imageUrl,
          categories: post.categories,
          description: post.description,
          createdBy: post.creatorId
        }).save();
      });
      return "All posts sent";
    }
  }
};
