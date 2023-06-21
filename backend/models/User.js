const mysql = require('mysql');
const dbConfig = require('../config/dbConfig');

const pool = mysql.createPool(dbConfig);

class User {
  constructor(user) {
    this.id = user.id;
    this.name = user.name;
    this.email = user.email;
    this.gender = user.gender;
    this.phone = user.phone;
    this.password = user.password;
    this.status = user.status;
    this.date = user.date;
  }

  static findOne(condition) {
    return new Promise((resolve, reject) => {
      pool.query('SELECT * FROM userstable WHERE ?', condition, (err, results) => {
        if (err) {
          reject(err);
          return;
        }

        if (results.length === 0) {
          resolve(null);
          return;
        }

        const user = new User(results[0]);
        resolve(user);
      });
    });
  }

  static deleteOne(condition) {
    return new Promise((resolve, reject) => {
      pool.query('DELETE FROM userstable WHERE ?', condition, (err, results) => {
        if (err) {
          reject(err);
          return;
        }

        resolve(results.affectedRows);
      });
    });
  }

  static update(condition, updatedFields) {
    return new Promise((resolve, reject) => {
      pool.query('UPDATE userstable SET ? WHERE ?', [updatedFields, condition], (err) => {
        if (err) {
          reject(err);
          return;
        }

        resolve();
      });
    });
  }

  save() {
    return new Promise((resolve, reject) => {
      pool.query('INSERT INTO userstable SET ?', this, (err, results) => {
        if (err) {
          reject(err);
          return;
        }

        this.id = results.insertId;
        resolve();
      });
    });
  }
}

module.exports = User;
