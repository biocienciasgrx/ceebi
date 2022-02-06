export type Schedule = Record<DateString, ScheduleDay>;

export type ScheduleDay = Event[];

export interface Event {
  ID: number;
  data: {
    ID: number;
    title: string;
    content: string;
    post: EventPost;
    time: {
      start: TimeString;
      end: TimeString;
      start_raw: TimeString;
      end_raw: TimeString;
      start_timestamp: number;
      end_timestamp: number;
    };
    hourly_schedules: any[];
    tickets: any[];
    color: MayEmptyString;
    permalink: URL;
    thumbnails: EventThumbnails;
    featured_image: EventThumbnails;
    speakers: Record<`${number}`, EventSpeaker>;
    categories: Record<`${number}`, EventCategory>;
    locations: Record<`${number}`, EventLocation>;
    fields: { label: string; value: string }[];
    TZ0: {
      timezone_type: number;
      timezone: `${string}/${string}`;
    };
  };
  dates: {
    start: DateTime;
    end: DateTime;
    allday: "0" | "1";
    hide_time: "0" | "1";
    past: number;
  }[];
  date: {
    start: DateTime;
    end: DateTime;
  };
}

interface DateTime {
  date: string;
  hour: Hour12;
  minutes: Minutes;
  ampm: "am" | "pm";
  timestamp: number;
}

type DateString = string;
// TODO says it's too complex `${0 | 1 | 2}${Digit}${Digit}${Digit}-${0 | 1}${Digit}-${
//   | 0
//   | 1
//   | 2
//   | 3}${Digit}`;

type Hour12 =
  | "00"
  | "01"
  | "02"
  | "03"
  | "04"
  | "05"
  | "06"
  | "07"
  | "08"
  | "09"
  | "10"
  | "11"
  | "12";

type Hour24 =
  | Hour12
  | "13"
  | "14"
  | "15"
  | "16"
  | "17"
  | "18"
  | "19"
  | "20"
  | "21"
  | "22"
  | "23"
  | "24";

type Minutes = `${0 | 1 | 2 | 3 | 4 | 5}${Digit}`;

type Digit = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;

type FullDays = `${0 | 1 | 2}${Digit}`;

type TimeString = `${Hour24}:${Minutes}`;

interface EventPost {
  ID: number;
  post_author: Digit;
  post_date: string;
  post_date_gmt: string;
  post_content: string;
  post_title: string;
  post_excerpt: string;
  post_status: "publish" | string;
  comment_status: "closed" | string;
  png_status: "closed" | string;
  post_password: MayEmptyString;
  post_name: string;
  to_ping: MayEmptyString;
  pinged: MayEmptyString;
  post_modified: string;
  post_modified_gmt: string;
  post_content_filtered: MayEmptyString;
  post_parent: number; // Guess its the id of the post
  guid: URL; //URL type?
  menu_order: number;
  post_type: "mec-events" | string;
  post_mime_type: MayEmptyString;
  comment_count: `${number}`;
  filter: "raw" | string;
}

type URL = `${"http" | "https"}://${string}`;

type MayEmptyString = "" | string;

interface EventThumbnails {
  thumbnail: MayEmptyString;
  thumblist: MayEmptyString;
  gridsquare: MayEmptyString;
  meccarouselthumb: MayEmptyString;
  medium: MayEmptyString;
  large: MayEmptyString;
  full: MayEmptyString;
  tileview: MayEmptyString;
}

interface EventSpeaker {
  id: number;
  name: string;
  job_title: MayEmptyString;
  tel: MayEmptyString;
  email: "" | Email;
  facebook: "" | URL;
  twitter: "" | URL;
  gplus: "" | URL;
  thumbnail: "" | URL;
}

type Email = `${string}@${string}`;

interface EventCategory {
  id: number;
  name: string;
  icon: string;
  color: "" | ColorString;
}

type ColorString = `#${string}`;

type HexChar = Digit | "a" | "b" | "c" | "d" | "e" | "f";

interface EventLocation {
  id: number;
  name: string;
  addres: string;
  latitude: `${number}`;
  longitude: `${number}`;
  url: "" | URL;
  thumbnail: MayEmptyString;
}
