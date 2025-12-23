export interface ResMsg {
  msg: string;
}

export interface ChatMessage {
  fromUserId: string;
  toUserId: string;
  content: string;
  timestamp: number;
}

export interface IpLocation {
  status: string,
  country: string,
  countryCode: string,
  region: string,
  regionName: string,
  city: string,
  zip: string,
  lat: number,
  lon: number,
  timezone: string,
  isp: string,
  org: string,
  as: string,
  query: string
}