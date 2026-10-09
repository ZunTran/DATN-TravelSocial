import { AdminHashtagListObject, HashtagObject, HashtagPageObject } from "./hashtag.object";


export interface HashtagsResponse {
  hashtags: HashtagObject[];
}

export interface HashtagOptionsResponse {
  hashtagOptions: HashtagPageObject;
}

export interface CreateHashtagResponse {
  createHashtag: HashtagObject;
}

export interface UpdateHashtagResponse {
  updateHashtag: HashtagObject;
}

export interface AdminHashtagsResponse {
  adminHashtags: AdminHashtagListObject;
}