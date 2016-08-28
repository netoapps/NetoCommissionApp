SET PATH=%PATH%;"C:\Program Files\MongoDB\Server\3.2\bin"
start mongod --dbpath="K:\Dudi\NetoSalaryApp\db" --port=18873
cd server
SLEEP 2
node server.js
pause


