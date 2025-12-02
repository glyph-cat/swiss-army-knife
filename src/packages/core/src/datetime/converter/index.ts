import { Nullable } from '@glyph-cat/foundation'
import { DateTime } from 'luxon'
import { ITimestamp } from '../../firestore/timestamp'

/**
 * @public
 */
export interface DateTimeConverterConfig {
  Timestamp?: typeof ITimestamp
  DateTime?: typeof DateTime
}

/**
 * @public
 */
export class DateTimeConverter {

  /**
   * @internal
   */
  private readonly Timestamp: typeof ITimestamp

  /**
   * @internal
   */
  private readonly DateTime: typeof DateTime

  constructor(config: DateTimeConverterConfig) {
    if (config.Timestamp) { this.Timestamp = config.Timestamp }
    if (config.DateTime) { this.DateTime = config.DateTime }
    this.DateTimeToHTMLInputString = this.DateTimeToHTMLInputString.bind(this)
    this.DateTimeToSQLString = this.DateTimeToSQLString.bind(this)
    this.DateTimeToTimestamp = this.DateTimeToTimestamp.bind(this)
    this.HTMLInputStringToDateTime = this.HTMLInputStringToDateTime.bind(this)
    this.SQLStringToDateTime = this.SQLStringToDateTime.bind(this)
    this.TimestampToDateTime = this.TimestampToDateTime.bind(this)
  }

  DateTimeToHTMLInputString(dateTime: DateTime): string {
    return dateTime.toFormat('yyyy-LL-dd') + 'T' + dateTime.toFormat('HH:mm')
  }

  DateTimeToSQLString(dateTime: DateTime): Nullable<string> {
    return dateTime ? dateTime.toSQL() : null
  }

  DateTimeToTimestamp(dateTime: DateTime): Nullable<ITimestamp> {
    return dateTime ? this.Timestamp.fromMillis(dateTime.toMillis()) : null
  }

  HTMLInputStringToDateTime(value: string): DateTime {
    return this.DateTime.fromISO(value)
  }

  SQLStringToDateTime(value: string): Nullable<DateTime> {
    return value ? this.DateTime.fromSQL(value) : null
  }

  TimestampToDateTime(timestamp: ITimestamp): Nullable<DateTime> {
    return timestamp ? this.DateTime.fromMillis(timestamp.toMillis()) : null
  }

}
