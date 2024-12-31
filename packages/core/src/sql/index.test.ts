import { SQLUtil } from '.'

describe(SQLUtil.name, () => {

  enum Table {
    Users = 'Users',
    Tokens = 'Tokens',
  }

  enum Column {
    id = 'id',
    firstName = 'first_name',
    lastName = 'last_name',
  }

  test(SQLUtil.prototype.createTable.name, () => {
    const sqlUtil = new SQLUtil<Table, Column>()
    const output = sqlUtil.createTable(Table.Users, [
      'id INTEGER PRIMARY KEY AUTOINCREMENT',
      'firstName VARCHAR(256)',
      'lastName VARCHAR(256)',
    ])
    expect(output).toBe('CREATE TABLE Users(id INTEGER PRIMARY KEY AUTOINCREMENT,firstName VARCHAR(256),lastName VARCHAR(256))')
  })

  test(SQLUtil.prototype.createTableIfNotExists.name, () => {
    const sqlUtil = new SQLUtil<Table, Column>()
    const output = sqlUtil.createTableIfNotExists(Table.Users, [
      'id INTEGER PRIMARY KEY AUTOINCREMENT',
      'firstName VARCHAR(256)',
      'lastName VARCHAR(256)',
    ])
    expect(output).toBe('CREATE TABLE IF NOT EXISTS Users(id INTEGER PRIMARY KEY AUTOINCREMENT,firstName VARCHAR(256),lastName VARCHAR(256))')
  })

  test(SQLUtil.prototype.insertInto.name, () => {
    const sqlUtil = new SQLUtil<Table, Column>()
    const output = sqlUtil.insertInto(Table.Users, [
      Column.id,
      Column.firstName,
      Column.lastName,
    ])
    expect(output).toBe('INSERT INTO Users(id,first_name,last_name)VALUES(@id,@first_name,@last_name)')
  })

})
