export default async (state) => {
  const links = state.links;
  const parser = new DOMParser();
  const promises = links.map((link) => {
    return fetch(`https://allorigins.hexlet.app/get?url=${encodeURIComponent(link)}`)
      .then(response => {
        if (response.ok) {
          return response.json()
        }
        throw new Error('Network response was not ok.')
      })
      .then(data => {
        const doc = parser.parseFromString(data.contents, "application/xml");
        const posts = [...doc.querySelectorAll('item')].slice(0, 3)
        let postsInLink = []
        posts.forEach((post) => {
          const newsObj = {
            title: post.querySelector('title').textContent
          }
          postsInLink.push(newsObj);
        })
        return {
          source: doc.querySelector('title').textContent,
          posts: postsInLink,
        }
      });
  });
  const promise =  Promise.all(promises);
  return promise;
}