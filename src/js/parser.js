const parseLink = (response) => {
  const parser = new DOMParser();
  const content = response.contents;
  const doc = parser.parseFromString(content, 'application/xml');
  const errorNode = doc.querySelector('parsererror');
  if (errorNode) {
    throw new Error('not RSS error');
  }
  const feedInfo = doc.querySelector('channel');
  const postsInFeed = [...doc.querySelectorAll('item')];
  return { feedInfo, postsInFeed };
};

export default parseLink;
