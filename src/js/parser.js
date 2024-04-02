export default (data) => {
  const parser = new DOMParser();
  let id = 1;
  let content = [];
  data.forEach((feed) => {
    const doc = parser.parseFromString(feed.contents, "application/xml");
    const postsInFeed = [...doc.querySelectorAll('item')].slice(0, 3)
    let posts = []
    postsInFeed.forEach((post) => {
      const newsObj = {
        id,
        title: post.querySelector('title').textContent,
        link: post.querySelector('link').textContent,
        description: post.querySelector('description').textContent,
      }
      posts.push(newsObj);
      id += 1;
    })
    const feedObj = {
      source: doc.querySelector('title').textContent,
      posts,
    }
    content.push(feedObj);
  })
  return content;
}