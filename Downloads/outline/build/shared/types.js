"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.UserRole = exports.UserPreference = exports.UserCreatableIntegrationService = exports.UnfurlType = exports.TeamPreference = exports.QueryNotices = exports.NotificationEventType = exports.NotificationEventDefaults = exports.NotificationChannelType = exports.NavigationNodeType = exports.MentionType = exports.IntegrationType = exports.IntegrationService = exports.FileOperationType = exports.FileOperationState = exports.FileOperationFormat = exports.ExportContentType = exports.DocumentPermission = exports.CollectionPermission = exports.Client = exports.AttachmentPreset = void 0;
let UserRole = exports.UserRole = /*#__PURE__*/function (UserRole) {
  UserRole["Admin"] = "admin";
  UserRole["Member"] = "member";
  UserRole["Viewer"] = "viewer";
  return UserRole;
}({});
let Client = exports.Client = /*#__PURE__*/function (Client) {
  Client["Web"] = "web";
  Client["Desktop"] = "desktop";
  return Client;
}({});
let ExportContentType = exports.ExportContentType = /*#__PURE__*/function (ExportContentType) {
  ExportContentType["Markdown"] = "text/markdown";
  ExportContentType["Html"] = "text/html";
  ExportContentType["Pdf"] = "application/pdf";
  return ExportContentType;
}({});
let FileOperationFormat = exports.FileOperationFormat = /*#__PURE__*/function (FileOperationFormat) {
  FileOperationFormat["JSON"] = "json";
  FileOperationFormat["MarkdownZip"] = "outline-markdown";
  FileOperationFormat["HTMLZip"] = "html";
  FileOperationFormat["PDF"] = "pdf";
  FileOperationFormat["Notion"] = "notion";
  return FileOperationFormat;
}({});
let FileOperationType = exports.FileOperationType = /*#__PURE__*/function (FileOperationType) {
  FileOperationType["Import"] = "import";
  FileOperationType["Export"] = "export";
  return FileOperationType;
}({});
let FileOperationState = exports.FileOperationState = /*#__PURE__*/function (FileOperationState) {
  FileOperationState["Creating"] = "creating";
  FileOperationState["Uploading"] = "uploading";
  FileOperationState["Complete"] = "complete";
  FileOperationState["Error"] = "error";
  FileOperationState["Expired"] = "expired";
  return FileOperationState;
}({});
let MentionType = exports.MentionType = /*#__PURE__*/function (MentionType) {
  MentionType["User"] = "user";
  return MentionType;
}({});
let AttachmentPreset = exports.AttachmentPreset = /*#__PURE__*/function (AttachmentPreset) {
  AttachmentPreset["DocumentAttachment"] = "documentAttachment";
  AttachmentPreset["Import"] = "import";
  AttachmentPreset["Avatar"] = "avatar";
  return AttachmentPreset;
}({});
let IntegrationType = exports.IntegrationType = /*#__PURE__*/function (IntegrationType) {
  IntegrationType["Post"] = "post";
  IntegrationType["Command"] = "command";
  IntegrationType["Embed"] = "embed";
  IntegrationType["Analytics"] = "analytics";
  return IntegrationType;
}({});
let IntegrationService = exports.IntegrationService = /*#__PURE__*/function (IntegrationService) {
  IntegrationService["Diagrams"] = "diagrams";
  IntegrationService["Grist"] = "grist";
  IntegrationService["Slack"] = "slack";
  IntegrationService["GoogleAnalytics"] = "google-analytics";
  return IntegrationService;
}({});
let UserCreatableIntegrationService = exports.UserCreatableIntegrationService = /*#__PURE__*/function (UserCreatableIntegrationService) {
  UserCreatableIntegrationService["Diagrams"] = "diagrams";
  UserCreatableIntegrationService["Grist"] = "grist";
  UserCreatableIntegrationService["GoogleAnalytics"] = "google-analytics";
  return UserCreatableIntegrationService;
}({});
let CollectionPermission = exports.CollectionPermission = /*#__PURE__*/function (CollectionPermission) {
  CollectionPermission["Read"] = "read";
  CollectionPermission["ReadWrite"] = "read_write";
  CollectionPermission["Admin"] = "admin";
  return CollectionPermission;
}({});
let DocumentPermission = exports.DocumentPermission = /*#__PURE__*/function (DocumentPermission) {
  DocumentPermission["Read"] = "read";
  DocumentPermission["ReadWrite"] = "read_write";
  return DocumentPermission;
}({});
let UserPreference = exports.UserPreference = /*#__PURE__*/function (UserPreference) {
  UserPreference["RememberLastPath"] = "rememberLastPath";
  UserPreference["UseCursorPointer"] = "useCursorPointer";
  UserPreference["CodeBlockLineNumers"] = "codeBlockLineNumbers";
  UserPreference["SeamlessEdit"] = "seamlessEdit";
  UserPreference["FullWidthDocuments"] = "fullWidthDocuments";
  return UserPreference;
}({});
let TeamPreference = exports.TeamPreference = /*#__PURE__*/function (TeamPreference) {
  TeamPreference["SeamlessEdit"] = "seamlessEdit";
  TeamPreference["PublicBranding"] = "publicBranding";
  TeamPreference["ViewersCanExport"] = "viewersCanExport";
  TeamPreference["MembersCanInvite"] = "membersCanInvite";
  TeamPreference["Commenting"] = "commenting";
  TeamPreference["CustomTheme"] = "customTheme";
  return TeamPreference;
}({});
let NavigationNodeType = exports.NavigationNodeType = /*#__PURE__*/function (NavigationNodeType) {
  NavigationNodeType["Collection"] = "collection";
  NavigationNodeType["Document"] = "document";
  return NavigationNodeType;
}({});
let NotificationEventType = exports.NotificationEventType = /*#__PURE__*/function (NotificationEventType) {
  NotificationEventType["PublishDocument"] = "documents.publish";
  NotificationEventType["UpdateDocument"] = "documents.update";
  NotificationEventType["AddUserToDocument"] = "documents.add_user";
  NotificationEventType["AddUserToCollection"] = "collections.add_user";
  NotificationEventType["CreateRevision"] = "revisions.create";
  NotificationEventType["CreateCollection"] = "collections.create";
  NotificationEventType["CreateComment"] = "comments.create";
  NotificationEventType["MentionedInDocument"] = "documents.mentioned";
  NotificationEventType["MentionedInComment"] = "comments.mentioned";
  NotificationEventType["InviteAccepted"] = "emails.invite_accepted";
  NotificationEventType["Onboarding"] = "emails.onboarding";
  NotificationEventType["Features"] = "emails.features";
  NotificationEventType["ExportCompleted"] = "emails.export_completed";
  return NotificationEventType;
}({});
let NotificationChannelType = exports.NotificationChannelType = /*#__PURE__*/function (NotificationChannelType) {
  NotificationChannelType["App"] = "app";
  NotificationChannelType["Email"] = "email";
  NotificationChannelType["Chat"] = "chat";
  return NotificationChannelType;
}({});
const NotificationEventDefaults = exports.NotificationEventDefaults = {
  [NotificationEventType.PublishDocument]: false,
  [NotificationEventType.UpdateDocument]: true,
  [NotificationEventType.CreateCollection]: false,
  [NotificationEventType.CreateComment]: true,
  [NotificationEventType.MentionedInDocument]: true,
  [NotificationEventType.MentionedInComment]: true,
  [NotificationEventType.InviteAccepted]: true,
  [NotificationEventType.Onboarding]: true,
  [NotificationEventType.Features]: true,
  [NotificationEventType.ExportCompleted]: true,
  [NotificationEventType.AddUserToDocument]: true,
  [NotificationEventType.AddUserToCollection]: true
};
let UnfurlType = exports.UnfurlType = /*#__PURE__*/function (UnfurlType) {
  UnfurlType["Mention"] = "mention";
  UnfurlType["Document"] = "document";
  return UnfurlType;
}({});
let QueryNotices = exports.QueryNotices = /*#__PURE__*/function (QueryNotices) {
  QueryNotices["UnsubscribeDocument"] = "unsubscribe-document";
  return QueryNotices;
}({});