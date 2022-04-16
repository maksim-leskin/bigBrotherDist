import toBase64 from "./toBase64.js";

const label = document.querySelector('.upload__label');
const file = document.querySelector('.upload__file');
const preview = document.querySelector('.upload__preview');

const tempSrc = preview.src;

file.addEventListener('change', async () => {
  if (file.files.length > 0) {
    const src = await toBase64(file.files[0]);
    preview.style.display = 'block';
    label.classList.add('upload__label_active');
    preview.src = src;
  }
});

export const clearPreview = () => {
  preview.style.display = '';
  label.classList.remove('upload__label_active');
  preview.src = tempSrc;
}
