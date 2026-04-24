import { Nullable } from '@glyph-cat/foundation'
import type { DateTime } from 'luxon'
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
  private readonly Timestamp?: typeof ITimestamp

  /**
   * @internal
   */
  private readonly DateTime?: typeof DateTime

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
    if (!this.Timestamp) {
      throw new Error('Attempted to call `DateTimeConverter.DateTimeToTimestamp` but `config.Timestamp` is missing from the constructor')
    }
    return dateTime ? this.Timestamp.fromMillis(dateTime.toMillis()) : null
  }

  HTMLInputStringToDateTime(value: string): DateTime {
    if (!this.DateTime) {
      throw new Error('Attempted to call `DateTimeConverter.HTMLInputStringToDateTime` but `config.DateTime` is missing from the constructor')
    }
    return this.DateTime.fromISO(value)
  }

  SQLStringToDateTime(value: string): Nullable<DateTime> {
    if (!this.DateTime) {
      throw new Error('Attempted to call `DateTimeConverter.SQLStringToDateTime` but `config.DateTime` is missing from the constructor')
    }
    return value ? this.DateTime.fromSQL(value) : null
  }

  TimestampToDateTime(timestamp: ITimestamp): Nullable<DateTime> {
    if (!this.DateTime) {
      throw new Error('Attempted to call `DateTimeConverter.TimestampToDateTime` but `config.DateTime` is missing from the constructor')
    }
    return timestamp ? this.DateTime.fromMillis(timestamp.toMillis()) : null
  }

}
