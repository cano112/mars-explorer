export class StringUtils {
  static dateToIsoDateString(date) {
    return date.toISOString().substring(0, 10);
  }
}
