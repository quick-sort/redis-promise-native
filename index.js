const Redis = require('redis')
const RedisCommands = require('redis-commands');
const { promisify } = require('util');

const originCreateClient = Redis.createClient
Redis.createClient = function() {
  const client = originCreateClient.call(arguments)
  const p = {}
  RedisCommands.list.forEach(command => {
    var commandName = command.replace(/(?:^([0-9])|[^a-zA-Z0-9_$])/g, '_$1');
    const fn = client[commandName]
    if (fn && typeof(fn) === 'function') {
      client[commandName.toUpperCase()] = client[commandName] = promisify(fn).bind(client)
    }
  })
  return client
}
module.exports = Redis
