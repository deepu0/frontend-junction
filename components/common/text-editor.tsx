import BlotFormatter from 'quill-blot-formatter';
//import * as Emoji from 'quill-emoji';
//import ImageUploader from 'quill-image-uploader';
import 'quill/dist/quill.snow.css';
import React, { useEffect, useState } from 'react';
import ReactQuill, { Quill } from 'react-quill';
//import { UploadToS3 } from 'utils/UploadFile';

import { isMobile } from 'mobile-device-detect';
import 'quill-emoji/dist/quill-emoji.css';

var BaseImageFormat = Quill.import('formats/image');
var BaseEmbedFormat = Quill.import('formats/video');
const ImageFormatAttributesList = ['alt', 'height', 'width', 'style'];
const EmbedFormatAttributesList = ['alt', 'height', 'width', 'style'];

// class ImageFormat extends BaseImageFormat {
//   static formats(domNode) {
//     return ImageFormatAttributesList.reduce(function (formats, attribute) {
//       if (domNode.hasAttribute(attribute)) {
//         formats[attribute] = domNode.getAttribute(attribute);
//       }
//       return formats;
//     }, {});
//   }
//   format(name, value) {
//     if (ImageFormatAttributesList.indexOf(name) > -1) {
//       if (value) {
//         this.domNode.setAttribute(name, value);
//       } else {
//         this.domNode.removeAttribute(name);
//       }
//     } else {
//       super.format(name, value);
//     }
//   }
// }
// class EmbedFormat extends BaseImageFormat {
//   static formats(domNode) {
//     return EmbedFormatAttributesList.reduce(function (formats, attribute) {
//       if (domNode.hasAttribute(attribute)) {
//         formats[attribute] = domNode.getAttribute(attribute);
//       }
//       return formats;
//     }, {});
//   }
//   format(name, value) {
//     if (EmbedFormatAttributesList.indexOf(name) > -1) {
//       if (value) {
//         this.domNode.setAttribute(name, value);
//       } else {
//         this.domNode.removeAttribute(name);
//       }
//     } else {
//       super.format(name, value);
//     }
//   }
// }

let Size = Quill.import('attributors/style/size');
Size.whitelist = ['12px', '14px', '16px', '18px'];

Quill.register(Size, true);
//Quill.register(ImageFormat, true);
//Quill.register(EmbedFormat, true);
//Quill.register('modules/imageUploader', ImageUploader);
//Quill.register('modules/emoji', Emoji);
Quill.register('modules/blotFormatter', BlotFormatter);

const mobileToolbar = [
  'bold',
  'italic',
  'underline',
  { list: 'bullet' },
  { list: 'ordered' },
  { header: [1, 2, 3, 4, 5, false] },
];

const formats = [
  'header',
  'font',
  'size',
  'bold',
  'italic',
  'underline',
  'strike',
  'blockquote',
  'list',
  'bullet',
  'indent',
  'direction',
  'align',
  'link',
  'emoji',
  'height',
  'width',
  'class',
  'style',
];

const tabToolbar = [
  ['bold', 'italic', 'underline', 'strike', 'blockquote'],
  [{ list: 'bullet' }, { list: 'ordered' }, { align: [] }],
  // [{ size: ["Select Size", "12px", "14px", "16px", "18px"] }],
  [{ header: [1, 2, 3, 4, 5, false] }],
  ['link', 'image', 'video'],
  ['emoji'],
];

type Props = {
  value?: string;
  onChange: (content: any) => void;
  placeHolder?: string;
  disabled?: boolean;
  showAllOptions?: boolean;
};
const modules = {
  toolbar: tabToolbar,
  'emoji-toolbar': true,
  'emoji-textarea': false,
  'emoji-shortname': true,
  blotFormatter: {},
  //   imageUploader: {
  //     upload: async (file: any) => {
  //       try {
  //         const response = await UploadToS3(file, 'image');
  //         return new Promise((resolve) => {
  //           resolve(response?.Location);
  //         });
  //       } catch (error) {
  //         console.error('Image Failed to upload! Try again!');
  //         return new Promise((_, reject) => {
  //           reject(error);
  //         });
  //       }
  //     },
  //   },
};

const mobileModules = {
  toolbar: mobileToolbar,
  'emoji-toolbar': true,
  'emoji-textarea': false,
  'emoji-shortname': true,
  blotFormatter: {},
  //   imageUploader: {
  //     upload: async (file: any) => {
  //       try {
  //         const response = await UploadToS3(file, 'image');
  //         return new Promise((resolve) => {
  //           resolve(response?.Location);
  //         });
  //       } catch (error) {
  //         console.error('Image Failed to upload! Try again!');
  //         return new Promise((_, reject) => {
  //           reject(error);
  //         });
  //       }
  //     },
  //   },
};

const TextEditor: React.FC<Props> = (props: Props) => {
  const {
    value,
    onChange,
    placeHolder,
    disabled,
    showAllOptions = false,
  } = props;
  const [editorText, setEditorText] = useState<any>(value || '');
  const onChangeHandler = (content: any) => {
    onChange(content);
  };

  useEffect(() => {
    onChangeHandler(editorText);
  }, [editorText]);
  console.log(showAllOptions, isMobile);

  return (
    <ReactQuill
      className={`custom-quill-editor ${disabled ? ' disabled' : ''}`}
      value={editorText}
      theme='snow'
      formats={formats}
      modules={isMobile || !showAllOptions ? mobileModules : modules}
      placeholder={placeHolder}
      onChange={setEditorText}
    />
  );
};

export default TextEditor;
