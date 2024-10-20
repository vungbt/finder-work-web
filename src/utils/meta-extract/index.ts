import { MetaExtractInfo } from '@/types';
import axios from 'axios';
import * as cheerio from 'cheerio';
import camelCase from 'lodash/camelCase';

export const extractMetaByUrl = async (url: string) => {
  try {
    const { data } = await axios.get(url);
    const $ = cheerio.load(data);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const metaTags: any = {};

    $('meta').each((i, element) => {
      const name = $(element).attr('name') || $(element).attr('property');
      if (name) {
        metaTags[name] = $(element).attr('content');
      }
    });
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const newObj: any = {};
    for (const [key, value] of Object.entries(metaTags)) {
      const camelCaseKey = camelCase(key);
      newObj[camelCaseKey] = value;
    }
    return newObj as MetaExtractInfo;
  } catch (error) {
    return null;
  }
};

export const metaExtract = {
  extract: extractMetaByUrl
};
