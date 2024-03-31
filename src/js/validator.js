import * as yup from 'yup';


export default async (inputUrlObj, state) => {

  const schema = yup.object({
    url: yup.string().url().nullable(),
  });

  schema.validate(inputUrlObj, { abortEarly: false })
  .then(() => {
    if (state.links.includes(inputUrlObj.url)) {
      state.form = {
        isValid: false,
        validationResult: 'urlExist',
      }
    } else {
      state.links.push(inputUrlObj.url);
      state.form = {
        isValid: true,
        validationResult: 'urlAdded',
      };
    }
  })
  .catch(() => {
    state.form = {
      isValid: false,
      validationResult: 'urlValidationError',
    }
  });
}