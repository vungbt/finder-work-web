/* eslint-disable @typescript-eslint/no-explicit-any */
import ReactQuill, { Quill } from 'react-quill';
const Video = Quill.import('formats/video');
// const Image = Quill.import('formats/image');

class CustomVideo extends Video {
  static create(value: any) {
    const node = super.create(value);
    const video: any = document.createElement('video');
    video.setAttribute('controls', true);
    video.setAttribute('type', 'video/mp4');
    video.setAttribute('style', 'height: auto; width: auto');
    video.setAttribute('src', value);
    node.appendChild(video);

    return node;
  }
}

class CustomImage extends Video {
  static create(value: any) {
    const node = super.create(value);
    const image: any = document.createElement('img');
    image.setAttribute('alt', 'quill-image');
    image.setAttribute('style', 'height: auto; width: auto');
    image.setAttribute('src', value);
    node.appendChild(image);

    return node;
  }
}

CustomVideo.blotName = 'video';
CustomVideo.className = 'ql-video';
CustomVideo.tagName = 'DIV';

CustomImage.blotName = 'div';
CustomImage.className = 'ql-image';
CustomImage.tagName = 'image';

Quill.register('formats/video', CustomVideo);
Quill.register('formats/image', CustomImage);
export default ReactQuill;

export type ReactQuillType = typeof ReactQuill;
