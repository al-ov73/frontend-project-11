const parseLinks = (feeds) => {
  const parser = new DOMParser();
  // let postId = 1;
  // let feedId = 1;
  // const content = {
  //   feeds: [],
  //   posts: [],
  // };
  // feeds.forEach((feed) => {
  //   const doc = parser.parseFromString(feed.contents, 'text/html');
  //   const postsInFeed = [...doc.querySelectorAll('item')];
  //   postsInFeed.forEach((post) => {
  //     const newsPost = {
  //       id: postId,
  //       feedId,
  //       title: post.querySelector('title').textContent,
  //       link: post.querySelector('link').textContent,
  //       description: post.querySelector('description').textContent,
  //     };
  //     content.posts.push(newsPost);
  //     postId += 1;
  //   });
  //   const feedInfo = {
  //     title: doc.querySelector('title').textContent,
  //     description: doc.querySelector('description').textContent,
  //   };
  //   content.feeds.push(feedInfo);
  //   feedId += 1;
  // });
  let postId = 1;
  const content = feeds.map((feed) => {
    const doc = parser.parseFromString(feed.contents, 'text/html');
    const postsInFeed = [...doc.querySelectorAll('item')];
    postsInFeed.forEach((post) => {
      post.id = postId;
      postId += 1;
    });
    return doc;
  })
  console.log(content[0].body)
  return content;
};

export default parseLinks;