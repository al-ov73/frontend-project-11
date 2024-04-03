export default (data) => {
  const parser = new DOMParser();
  let postId = 1;
  let feedId = 1;
  let content = {
    feeds: [],
    posts: [],
  };
  data.forEach((feed) => {
    const doc = parser.parseFromString(feed.contents, "application/xml");
    const postsInFeed = [...doc.querySelectorAll('item')].slice(0, 5);
    postsInFeed.forEach((post) => {
      const newsPost = {
        id: postId,
        feedId,
        title: post.querySelector('title').textContent,
        link: post.querySelector('link').textContent,
        description: post.querySelector('description').textContent,
      }
      content.posts.push(newsPost);
      postId += 1;
    })
    content.feeds.push(doc.querySelector('title').textContent);
    feedId += 1;
  })
  return content;
}