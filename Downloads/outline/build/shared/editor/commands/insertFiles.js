"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;
var Sentry = _interopRequireWildcard(require("@sentry/react"));
var _sonner = require("sonner");
var _uuid = require("uuid");
var _FileHelper = _interopRequireDefault(require("../lib/FileHelper"));
var _uploadPlaceholder = _interopRequireWildcard(require("../lib/uploadPlaceholder"));
function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
function _getRequireWildcardCache(e) { if ("function" != typeof WeakMap) return null; var r = new WeakMap(), t = new WeakMap(); return (_getRequireWildcardCache = function (e) { return e ? t : r; })(e); }
function _interopRequireWildcard(e, r) { if (!r && e && e.__esModule) return e; if (null === e || "object" != typeof e && "function" != typeof e) return { default: e }; var t = _getRequireWildcardCache(r); if (t && t.has(e)) return t.get(e); var n = { __proto__: null }, a = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var u in e) if ("default" !== u && Object.prototype.hasOwnProperty.call(e, u)) { var i = a ? Object.getOwnPropertyDescriptor(e, u) : null; i && (i.get || i.set) ? Object.defineProperty(n, u, i) : n[u] = e[u]; } return n.default = e, t && t.set(e, n), n; }
const insertFiles = async function (view, event, pos, files, options) {
  const {
    dictionary,
    uploadFile,
    onFileUploadStart,
    onFileUploadStop
  } = options;

  // okay, we have some dropped files and a handler – lets stop this
  // event going any further up the stack
  event.preventDefault();

  // let the user know we're starting to process the files
  onFileUploadStart === null || onFileUploadStart === void 0 ? void 0 : onFileUploadStart();
  const {
    schema
  } = view.state;

  // we'll use this to track of how many files have succeeded or failed
  let complete = 0;
  const filesToUpload = await Promise.all(files.map(async file => {
    const isImage = _FileHelper.default.isImage(file) && !options.isAttachment && !!schema.nodes.image;
    const isVideo = _FileHelper.default.isVideo(file) && !options.isAttachment && !!schema.nodes.video;
    const getDimensions = isImage ? _FileHelper.default.getImageDimensions : isVideo ? _FileHelper.default.getVideoDimensions : undefined;
    return {
      id: "upload-".concat((0, _uuid.v4)()),
      dimensions: await (getDimensions === null || getDimensions === void 0 ? void 0 : getDimensions(file)),
      isImage,
      isVideo,
      file
    };
  }));

  // the user might have dropped multiple files at once, we need to loop
  for (const upload of filesToUpload) {
    const {
      tr
    } = view.state;
    tr.setMeta(_uploadPlaceholder.default, {
      add: {
        pos,
        ...upload,
        replaceExisting: options.replaceExisting
      }
    });
    view.dispatch(tr);

    // start uploading the file to the server. Using "then" syntax
    // to allow all placeholders to be entered at once with the uploads
    // happening in the background in parallel.
    uploadFile === null || uploadFile === void 0 ? void 0 : uploadFile(upload.file).then(async src => {
      if (view.isDestroyed) {
        return;
      }
      if (upload.isImage) {
        const newImg = new Image();
        newImg.onload = async () => {
          var _upload$dimensions;
          const result = (0, _uploadPlaceholder.findPlaceholder)(view.state, upload.id);
          if (result === null) {
            return;
          }
          if (view.isDestroyed) {
            return;
          }
          const [from, to] = result;
          view.dispatch(view.state.tr.replaceWith(from, to || from, schema.nodes.image.create({
            src,
            ...((_upload$dimensions = upload.dimensions) !== null && _upload$dimensions !== void 0 ? _upload$dimensions : {}),
            ...options.attrs
          })).setMeta(_uploadPlaceholder.default, {
            remove: {
              id: upload.id
            }
          }));
        };
        newImg.onerror = () => {
          throw new Error("Error loading image: ".concat(src));
        };
        newImg.src = src;
      } else if (upload.isVideo) {
        var _upload$file$name;
        const result = (0, _uploadPlaceholder.findPlaceholder)(view.state, upload.id);
        if (result === null) {
          return;
        }
        const [from, to] = result;
        if (view.isDestroyed) {
          return;
        }
        view.dispatch(view.state.tr.replaceWith(from, to || from, schema.nodes.video.create({
          src,
          title: (_upload$file$name = upload.file.name) !== null && _upload$file$name !== void 0 ? _upload$file$name : dictionary.untitled,
          ...upload.dimensions,
          ...options.attrs
        })).setMeta(_uploadPlaceholder.default, {
          remove: {
            id: upload.id
          }
        }));
      } else {
        var _upload$file$name2;
        const result = (0, _uploadPlaceholder.findPlaceholder)(view.state, upload.id);
        if (result === null) {
          return;
        }
        const [from, to] = result;
        view.dispatch(view.state.tr.replaceWith(from, to || from, schema.nodes.attachment.create({
          href: src,
          title: (_upload$file$name2 = upload.file.name) !== null && _upload$file$name2 !== void 0 ? _upload$file$name2 : dictionary.untitled,
          size: upload.file.size
        })).setMeta(_uploadPlaceholder.default, {
          remove: {
            id: upload.id
          }
        }));
      }
    }).catch(error => {
      Sentry.captureException(error);

      // eslint-disable-next-line no-console
      console.error(error);
      if (view.isDestroyed) {
        return;
      }

      // cleanup the placeholder if there is a failure
      view.dispatch(view.state.tr.setMeta(_uploadPlaceholder.default, {
        remove: {
          id: upload.id
        }
      }));
      _sonner.toast.error(error.message || dictionary.fileUploadError);
    }).finally(() => {
      complete++;

      // once everything is done, let the user know
      if (complete === files.length && onFileUploadStop) {
        onFileUploadStop();
      }
    });
  }
};
var _default = exports.default = insertFiles;