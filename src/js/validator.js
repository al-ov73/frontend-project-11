import * as yup from 'yup';

const validateIsRss = (response) => {
  const parser = new DOMParser();
  const content = response.contents;
  const doc = parser.parseFromString(content, 'application/xml');
  const errorNode = doc.querySelector('parsererror');
  if (errorNode) {
    return false;
  }
  return true;
};

const validateUrl = async (inputUrlObj) => {
  const schema = yup.object({
    url: yup.string().url().nullable(),
  });
  return schema.validate(inputUrlObj)
    .then(() => true)
    .catch(() => false);
};

export { validateUrl, validateIsRss };
