const parseLinks = (feeds) => {
  const parser = new DOMParser();
  let postId = 1;
  const content = feeds.map((feed) => {
    const doc = parser.parseFromString(feed.contents, 'text/html');
    const postsInFeed = [...doc.querySelectorAll('item')];
    postsInFeed.forEach((post) => {
      post.id = postId;
      postId += 1;
    });
    return doc;
  });
  return content;
};

export default parseLinks;
