/**
 * @public
 */
export class SQLUtil<Table, Column> {

  /**
   * Creates a SQL statement for creating a table.
   * @example
   * createTable('Users', [
   *   'id INTEGER PRIMARY KEY AUTOINCREMENT',
   *   'firstName VARCHAR(256)',
   *   'lastName VARCHAR(256)',
   * ])
   */
  createTable(
    name: Table,
    columnDefinitions: Array<string>,
  ): string {
    return `CREATE TABLE ${name}(${columnDefinitions.join(',')})`
  }

  /**
   * Creates a SQL statement for creating a table if it does not already exists.
   * @example
   * createTableIfNotExists('Users', [
   *   'id INTEGER PRIMARY KEY AUTOINCREMENT',
   *   'firstName VARCHAR(256)',
   *   'lastName VARCHAR(256)',
   * ])
   */
  createTableIfNotExists(
    name: Table,
    columnDefinitions: Array<string>,
  ): string {
    return `CREATE TABLE IF NOT EXISTS ${name}(${columnDefinitions.join(',')})`
  }

  /**
   * Creates a SQL statement for inserting data into a table.
   * @example
   * insertInto('Users', ['firstName', 'lastName'])
   */
  insertInto(table: Table, fields: Array<Column>): string {
    return `INSERT INTO ${table}(${fields.join(',')})VALUES(@${fields.join(',@')})`
  }

  // deleteFrom(table: SQLTable): string {
  //   return [
  //     `DELETE FROM ${table}`,
  //     // TOFIX
  //     // `WHERE ${[SQLField.id]} = @id`
  //   ].join(' ')
  // }

}
