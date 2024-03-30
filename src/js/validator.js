import * as yup from 'yup';

export default async (inputUrlObj, state) => {

  const schema = yup.object({
    url: yup.string().url().nullable(),
  });

  schema.validate(inputUrlObj, { abortEarly: false })
  .then(() => {
    console.log('url valide');
    if (state.links.includes(inputUrlObj.url)) {
      state.form.isValid = false;
      state.form.validationErrors = 'RSS уже существует';
    } else {
      state.form.isValid = true;
      state.links.push(inputUrlObj.url);
      console.log(state.links);
    }

  })
  .catch((e) => {
    state.form.isValid = false;
    state.form.validationErrors = 'Ссылка должна быть валидным URL';
  });
}