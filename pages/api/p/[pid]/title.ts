import { patchFieldApi } from './../../../../lib/patch-field';

export default patchFieldApi("title",  (newTitle) => ({ $set: {
    title: newTitle
} }))